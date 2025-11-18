package com.example.demo.service;

import com.example.demo.model.Ingredient;
import com.example.demo.repository.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class IngredientService {
    
    private final IngredientRepository ingredientRepository;
    private final GeminiService geminiService;
    
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }
    
    public Ingredient getIngredientById(String id) {
        Optional<Ingredient> ingredient = ingredientRepository.findById(id);
        return ingredient.orElse(null);
    }
    
    public Map<String, Object> detectIngredients(MultipartFile image) throws IOException {
        try {
            // Get ingredient names from Gemini
            List<String> detectedIngredientNames = geminiService.extractIngredientsFromImage(image);
            
            if (detectedIngredientNames.isEmpty()) {
                return Map.of(
                    "success", false,
                    "message", "No food ingredients detected in the image",
                    "ingredients", Collections.emptyList()
                );
            }
            
            List<Ingredient> savedIngredients = new ArrayList<>();
            
            for (String ingredientName : detectedIngredientNames) {
                List<Ingredient> existing = ingredientRepository.findByNameContaining(ingredientName);
                
                if (existing.isEmpty()) {
                    Ingredient newIngredient = new Ingredient();
                    newIngredient.setName(ingredientName);
                    newIngredient.setCategory("detected");
                    newIngredient.setDetectedFromImage(true);
                    newIngredient.setCreatedAt(LocalDateTime.now());
                    newIngredient.setUpdatedAt(LocalDateTime.now());
                    
                    Ingredient saved = ingredientRepository.save(newIngredient);
                    savedIngredients.add(saved);
                } else {
                    savedIngredients.add(existing.get(0));
                }
            }
            
            return Map.of(
                "success", true,
                "message", "Detected " + savedIngredients.size() + " ingredients",
                "ingredients", savedIngredients,
                "ingredientNames", detectedIngredientNames
            );
            
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of(
                "success", false,
                "error", e.getMessage(),
                "message", "Failed to detect ingredients: " + e.getMessage()
            );
        }
    }
    
    public List<Ingredient> searchIngredients(String query) {
        return ingredientRepository.findByNameContaining(query);
    }
    
    public List<Ingredient> getIngredientsByCategory(String category) {
        return ingredientRepository.findByCategory(category);
    }
    
    public Ingredient createIngredient(Ingredient ingredient) {
        ingredient.setCreatedAt(LocalDateTime.now());
        ingredient.setUpdatedAt(LocalDateTime.now());
        return ingredientRepository.save(ingredient);
    }
    
    public Ingredient updateIngredient(String id, Ingredient ingredient) {
        Optional<Ingredient> existingIngredientOpt = ingredientRepository.findById(id);
        if (existingIngredientOpt.isPresent()) {
            Ingredient existingIngredient = existingIngredientOpt.get();
            ingredient.setId(id);
            ingredient.setCreatedAt(existingIngredient.getCreatedAt());
            ingredient.setUpdatedAt(LocalDateTime.now());
            return ingredientRepository.save(ingredient);
        }
        return null;
    }
    
    public boolean deleteIngredient(String id) {
        if (ingredientRepository.existsById(id)) {
            ingredientRepository.deleteById(id);
            return true;
        }
        return false;
    }
}