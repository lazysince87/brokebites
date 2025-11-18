package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestGeminiController {
    
    @Value("${gemini.api.key}")
    private String apiKey;
    
    @GetMapping("/gemini")
    public ResponseEntity<Map<String, Object>> testGeminiConnection() {
        try {
            // Simple text-only test (no image)
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of(
                        "parts", List.of(
                            Map.of("text", "Say 'Hello! API is working!' in exactly 5 words.")
                        )
                    )
                )
            );

            URI uri = UriComponentsBuilder
                    .fromHttpUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent")
                    .queryParam("key", apiKey)
                    .build()
                    .toUri();
            
            System.out.println("Testing Gemini API connection...");
            System.out.println("API Key (first 10 chars): " + apiKey.substring(0, Math.min(10, apiKey.length())));
            System.out.println("Full URL: " + uri.toString().replace(apiKey, "***HIDDEN***"));
            
            WebClient webClient = WebClient.builder()
                    .baseUrl("https://generativelanguage.googleapis.com")
                    .defaultHeader("Content-Type", "application/json")
                    .build();

            ResponseEntity<Map<String, Object>> response = webClient.post()
                    .uri(uri)
                    .bodyValue(requestBody)
                    .retrieve()
                    .toEntity(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();

            if (response == null || response.getBody() == null) {
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "No response from Gemini API"
                ));
            }

            System.out.println("Gemini API Response: " + response.getBody());

            // Extract the text response
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
            String responseText = "";
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    responseText = parts.get(0).get("text").toString();
                }
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Gemini API is working!",
                "geminiResponse", responseText,
                "fullResponse", response.getBody()
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Map.of(
                "success", false,
                "error", e.getMessage(),
                "message", "Failed to connect to Gemini API. Check your API key.",
                "apiKeyLength", apiKey != null ? apiKey.length() : 0,
                "apiKeyPrefix", apiKey != null && apiKey.length() > 10 ? apiKey.substring(0, 10) : "INVALID"
            ));
        }
    }
}