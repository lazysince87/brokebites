package com.example.demo.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GeminiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;

    private static final String MODEL_NAME = "gemini-2.5-flash"; 

    public GeminiService(@Value("${gemini.api.key}") String apiKey) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("GEMINI_API_KEY is not set!");
        }

        this.apiKey = apiKey;
        
        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .defaultHeader("Content-Type", "application/json")
                .build();
        
        this.objectMapper = new ObjectMapper();
        
        System.out.println("GeminiService initialized with model: " + MODEL_NAME);
        System.out.println("API Key (first 10 chars): " + apiKey.substring(0, Math.min(10, apiKey.length())) + "...");
    }

    public List<String> extractIngredientsFromImage(MultipartFile image) throws IOException {
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("No image uploaded");
        }

        byte[] bytes = image.getBytes();
        String base64Image = Base64.getEncoder().encodeToString(bytes);

        Map<String, Object> inlineData = Map.of(
                "mimeType", image.getContentType(),
                "data", base64Image
        );

        // food ingredients only
        String prompt = "Analyze this receipt image and extract ONLY food and beverage items that can be used for cooking. " +
                "Include: vegetables, fruits, meat, dairy, beverages (coffee, latte, espresso, tea, etc.), " +
                "grains, pasta, rice, spices, condiments, oils, and any other edible ingredients. " +
                "DO NOT include: paper products, cleaning supplies, toiletries, or other non-food items. " +
                "Return ONLY a valid JSON array of ingredient names as strings. " +
                "Format example: [\"tomatoes\", \"chicken\", \"rice\", \"olive oil\"]. " +
                "Do not include prices, quantities, or any other text - ONLY the ingredient names in a JSON array.";

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt),
                                        Map.of("inline_data", inlineData)
                                )
                        )
                )
        );

        try {
            URI uri = UriComponentsBuilder
                    .fromHttpUrl("https://generativelanguage.googleapis.com/v1beta/models/" + MODEL_NAME + ":generateContent")
                    .queryParam("key", apiKey)
                    .build()
                    .toUri();
            
            System.out.println("📤 Making request to Gemini API...");
            System.out.println("🔗 Endpoint: " + uri.toString().replace(apiKey, "***"));
            
            ResponseEntity<Map<String, Object>> response = webClient.post()
                    .uri(uri)
                    .bodyValue(requestBody)
                    .retrieve()
                    .toEntity(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();

            if (response == null || response.getBody() == null) {
                throw new RuntimeException("No response from Gemini API");
            }

            System.out.println("✅ Gemini API Response Status: " + response.getStatusCode());
            System.out.println("📥 Response body: " + response.getBody());

            // Extract text from Gemini response
            String responseText = extractTextFromGeminiResponse(response.getBody());
            System.out.println("📄 Extracted text: " + responseText);
            
            // Parse JSON from response text
            return parseIngredientsFromText(responseText);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error calling Gemini API: " + e.getMessage());
        }
    }

    private String extractTextFromGeminiResponse(Map<String, Object> responseBody) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                throw new RuntimeException("No candidates in response");
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            
            if (parts == null || parts.isEmpty()) {
                throw new RuntimeException("No parts in response");
            }

            return parts.get(0).get("text").toString();
        } catch (Exception e) {
            throw new RuntimeException("Error parsing Gemini response structure: " + e.getMessage());
        }
    }

    private List<String> parseIngredientsFromText(String text) {
        try {
            // Remove markdown code blocks if present
            text = text.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();
            
            // Try to find JSON array in the text
            Pattern jsonArrayPattern = Pattern.compile("\\[.*?\\]", Pattern.DOTALL);
            Matcher matcher = jsonArrayPattern.matcher(text);
            
            if (matcher.find()) {
                String jsonArray = matcher.group();
                System.out.println("🔍 Found JSON array: " + jsonArray);
                
                List<String> ingredients = objectMapper.readValue(jsonArray, new TypeReference<List<String>>() {});
                
                // Clean up ingredient names and remove empty/invalid entries
                List<String> cleanedIngredients = ingredients.stream()
                        .map(String::trim)
                        .filter(s -> !s.isEmpty() && s.length() > 1)
                        .distinct()
                        .toList();
                
                System.out.println("Parsed " + cleanedIngredients.size() + " ingredients: " + cleanedIngredients);
                return cleanedIngredients;
            } else {
                System.err.println("No JSON array found in response. Full text: " + text);
                throw new RuntimeException("No JSON array found in response. Response was: " + text.substring(0, Math.min(200, text.length())));
            }
        } catch (Exception e) {
            System.err.println("Error parsing ingredients: " + e.getMessage());
            throw new RuntimeException("Error parsing ingredients JSON: " + e.getMessage() + "\nResponse text: " + text);
        }
    }

    public String generateRecipes(List<String> ingredients) {
        String ingredientText = String.join(", ", ingredients);

        String prompt = "Create 3 simple, budget-friendly recipes using these ingredients: " + ingredientText + ".\n\n" +
                "For each recipe provide:\n" +
                "- A creative recipe name\n" +
                "- Ingredients list (using ONLY the provided ingredients)\n" +
                "- Step-by-step cooking instructions\n" +
                "- Estimated prep time and cook time\n\n" +
                "Format the response in clean Markdown with headers (##) for each recipe.";

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                )
        );

        try {
            URI uri = UriComponentsBuilder
                    .fromUriString("https://generativelanguage.googleapis.com/v1beta/models/" + MODEL_NAME + ":generateContent")
                    .queryParam("key", apiKey)
                    .build()
                    .toUri();
            
            ResponseEntity<Map<String, Object>> response = webClient.post()
                    .uri(uri)
                    .bodyValue(requestBody)
                    .retrieve()
                    .toEntity(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();

            if (response == null || response.getBody() == null) {
                return "Error: No response from Gemini API";
            }

            return extractTextFromGeminiResponse(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return "Error generating recipes: " + e.getMessage();
        }
    }
}