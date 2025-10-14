package com.example.demo.controller;

import com.example.demo.model.Recipe;
import com.example.demo.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecipeController {
    
    private final RecipeService recipeService;
    
    @GetMapping
    public ResponseEntity<List<Recipe>> getAllRecipes() {
        List<Recipe> recipes = recipeService.getAllRecipes();
        return ResponseEntity.ok(recipes);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable String id) {
        Recipe recipe = recipeService.getRecipeById(id);
        if (recipe != null) {
            return ResponseEntity.ok(recipe);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/search")
    public ResponseEntity<List<Recipe>> searchRecipesByIngredients(@RequestBody List<String> ingredients) {
        List<Recipe> recipes = recipeService.searchRecipesByIngredients(ingredients);
        return ResponseEntity.ok(recipes);
    }
    
    @PostMapping("/search/filters")
    public ResponseEntity<List<Recipe>> searchRecipesWithFilters(@RequestBody Map<String, Object> filters) {
        List<Recipe> recipes = recipeService.searchRecipesWithFilters(filters);
        return ResponseEntity.ok(recipes);
    }
    
    @GetMapping("/saved")
    public ResponseEntity<List<Recipe>> getSavedRecipes() {
        List<Recipe> recipes = recipeService.getSavedRecipes();
        return ResponseEntity.ok(recipes);
    }
    
    @PostMapping("/{id}/save")
    public ResponseEntity<Recipe> saveRecipe(@PathVariable String id) {
        Recipe recipe = recipeService.saveRecipe(id);
        if (recipe != null) {
            return ResponseEntity.ok(recipe);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}/unsave")
    public ResponseEntity<Void> unsaveRecipe(@PathVariable String id) {
        boolean success = recipeService.unsaveRecipe(id);
        if (success) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/popular")
    public ResponseEntity<List<Recipe>> getPopularRecipes() {
        List<Recipe> recipes = recipeService.getPopularRecipes();
        return ResponseEntity.ok(recipes);
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<Recipe>> getRecentRecipes() {
        List<Recipe> recipes = recipeService.getRecentRecipes();
        return ResponseEntity.ok(recipes);
    }
}
