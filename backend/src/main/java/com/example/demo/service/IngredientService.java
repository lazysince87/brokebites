package com.example.demo.service;

import com.example.demo.model.Ingredient;
import com.example.demo.repository.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IngredientService {
    
    private final IngredientRepository ingredientRepository;
    
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }
    
    public Ingredient getIngredientById(String id) {
        Optional<Ingredient> ingredient = ingredientRepository.findById(id);
        return ingredient.orElse(null);
    }
    
    public List<Ingredient> detectIngredientsFromImage(MultipartFile image) {
        // TODO: Implement AI image recognition
        // For now, return mock detected ingredients
        return getMockDetectedIngredients();
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
    
    private List<Ingredient> getMockDetectedIngredients() {
        // Mock detected ingredients for development
        return List.of(
            new Ingredient(
                "1", "Tomato", "vegetables", null, 0.95, true, LocalDateTime.now(),
                LocalDateTime.now(), LocalDateTime.now()
            ),
            new Ingredient(
                "2", "Onion", "vegetables", null, 0.88, true, LocalDateTime.now(),
                LocalDateTime.now(), LocalDateTime.now()
            ),
            new Ingredient(
                "3", "Bell Pepper", "vegetables", null, 0.92, true, LocalDateTime.now(),
                LocalDateTime.now(), LocalDateTime.now()
            ),
            new Ingredient(
                "4", "Garlic", "vegetables", null, 0.76, true, LocalDateTime.now(),
                LocalDateTime.now(), LocalDateTime.now()
            )
        );
    }
}
