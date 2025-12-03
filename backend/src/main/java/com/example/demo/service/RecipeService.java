package com.example.demo.service;

import com.example.demo.model.Recipe;
import com.example.demo.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecipeService {
    
    private final RecipeRepository recipeRepository;
    private final GeminiService geminiService;
    
    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }
    
    public Recipe getRecipeById(String id) {
        Optional<Recipe> recipe = recipeRepository.findById(id);
        return recipe.orElse(null);
    }
    
    public List<Recipe> searchRecipesByIngredients(List<String> ingredients) {
        // If the client omits the body (null), treat as request for all recipes.
        // If the client sends an explicit empty list, return no results (avoid returning all accidentally).
        if (ingredients == null) {
            return getAllRecipes();
        }
        if (ingredients.isEmpty()) {
            return List.of();
        }
        
        // Fuzzy search: case-insensitive substring match against recipe ingredients
        List<String> queries = ingredients.stream()
                .filter(s -> s != null && !s.isBlank())
                .map(String::toLowerCase)
                .toList();

        if (queries.isEmpty()) {
            // all queries were blank strings (e.g. ["", " "]) — return no results
            return List.of();
        }

        // Compute a match count for each recipe and sort by descending matches
        List<Recipe> allRecipes = getAllRecipes();

        // Precompute counts to avoid repeated work in comparator
        java.util.Map<String, Integer> recipeMatchCounts = new java.util.HashMap<>();
        for (Recipe recipe : allRecipes) {
            int count = 0;
            if (recipe.getIngredients() != null) {
                for (String ing : recipe.getIngredients()) {
                    if (ing == null) continue;
                    String ingLower = ing.toLowerCase();
                    for (String q : queries) {
                        if (ingLower.contains(q)) {
                            count++;
                            break; // count this ingredient once even if multiple queries match
                        }
                    }
                }
            }
            recipeMatchCounts.put(recipe.getId() != null ? recipe.getId() : recipe.getTitle(), count);
        }

        // Keep only recipes with at least one matching ingredient, then sort by match count descending
        return allRecipes.stream()
            .filter(r -> recipeMatchCounts.getOrDefault(r.getId() != null ? r.getId() : r.getTitle(), 0) > 0)
            .sorted((r1, r2) -> Integer.compare(
                recipeMatchCounts.getOrDefault(r2.getId() != null ? r2.getId() : r2.getTitle(), 0),
                recipeMatchCounts.getOrDefault(r1.getId() != null ? r1.getId() : r1.getTitle(), 0)
            ))
            .toList();
    }

    public String generateRecipesFromAI(List<String> ingredients) {
        return geminiService.generateRecipes(ingredients);
    }
    
    public List<Recipe> searchRecipesWithFilters(Map<String, Object> filters) {
        List<Recipe> allRecipes = getAllRecipes();
        
        return allRecipes.stream()
                .filter(recipe -> {
                    // Filter by max calories
                    if (filters.containsKey("maxCalories")) {
                        Double maxCalories = (Double) filters.get("maxCalories");
                        if (recipe.getNutrition() != null && recipe.getNutrition().getCalories() > maxCalories) {
                            return false;
                        }
                    }
                    
                    // Filter by min protein
                    if (filters.containsKey("minProtein")) {
                        Double minProtein = (Double) filters.get("minProtein");
                        if (recipe.getNutrition() != null && recipe.getNutrition().getProtein() < minProtein) {
                            return false;
                        }
                    }
                    
                    // Filter by diet type
                    if (filters.containsKey("dietType")) {
                        String dietType = (String) filters.get("dietType");
                        if (recipe.getTags() == null || !recipe.getTags().contains(dietType.toLowerCase())) {
                            return false;
                        }
                    }
                    
                    // Filter by max prep time
                    if (filters.containsKey("maxPrepTime")) {
                        Integer maxPrepTime = (Integer) filters.get("maxPrepTime");
                        if (recipe.getPrepTimeMinutes() != null && recipe.getPrepTimeMinutes() > maxPrepTime) {
                            return false;
                        }
                    }
                    
                    // Filter by max cook time
                    if (filters.containsKey("maxCookTime")) {
                        Integer maxCookTime = (Integer) filters.get("maxCookTime");
                        if (recipe.getCookTimeMinutes() != null && recipe.getCookTimeMinutes() > maxCookTime) {
                            return false;
                        }
                    }
                    
                    return true;
                })
                .toList();
    }
    
    public List<Recipe> getSavedRecipes() {
        return recipeRepository.findSavedRecipes();
    }
    
    public Recipe saveRecipe(String id) {
        Optional<Recipe> recipeOpt = recipeRepository.findById(id);
        if (recipeOpt.isPresent()) {
            Recipe recipe = recipeOpt.get();
            recipe.setIsSaved(true);
            recipe.setUpdatedAt(LocalDateTime.now());
            return recipeRepository.save(recipe);
        }
        return null;
    }
    
    public boolean unsaveRecipe(String id) {
        Optional<Recipe> recipeOpt = recipeRepository.findById(id);
        if (recipeOpt.isPresent()) {
            Recipe recipe = recipeOpt.get();
            recipe.setIsSaved(false);
            recipe.setUpdatedAt(LocalDateTime.now());
            recipeRepository.save(recipe);
            return true;
        }
        return false;
    }
    
    public List<Recipe> getPopularRecipes() {
        return recipeRepository.findByMinRating(4.0);
    }
    
    public List<Recipe> getRecentRecipes() {
        return recipeRepository.findAll().stream()
                .sorted((r1, r2) -> {
                    LocalDateTime date1 = r1.getCreatedAt() != null ? r1.getCreatedAt() : LocalDateTime.MIN;
                    LocalDateTime date2 = r2.getCreatedAt() != null ? r2.getCreatedAt() : LocalDateTime.MIN;
                    return date2.compareTo(date1);
                })
                .limit(10)
                .toList();
    }
    
    public Recipe createRecipe(Recipe recipe) {
        recipe.setCreatedAt(LocalDateTime.now());
        recipe.setUpdatedAt(LocalDateTime.now());
        return recipeRepository.save(recipe);
    }
    
    public Recipe updateRecipe(String id, Recipe recipe) {
        Optional<Recipe> existingRecipeOpt = recipeRepository.findById(id);
        if (existingRecipeOpt.isPresent()) {
            Recipe existingRecipe = existingRecipeOpt.get();
            recipe.setId(id);
            recipe.setCreatedAt(existingRecipe.getCreatedAt());
            recipe.setUpdatedAt(LocalDateTime.now());
            return recipeRepository.save(recipe);
        }
        return null;
    }
    
    public boolean deleteRecipe(String id) {
        if (recipeRepository.existsById(id)) {
            recipeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
