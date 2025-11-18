package com.example.demo.controller;

import com.example.demo.model.Ingredient;
import com.example.demo.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IngredientController {
    
    private final IngredientService ingredientService;
    
    @GetMapping
    public ResponseEntity<List<Ingredient>> getAllIngredients() {
        List<Ingredient> ingredients = ingredientService.getAllIngredients();
        return ResponseEntity.ok(ingredients);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Ingredient> getIngredientById(@PathVariable String id) {
        Ingredient ingredient = ingredientService.getIngredientById(id);
        if (ingredient != null) {
            return ResponseEntity.ok(ingredient);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/detect")
    public ResponseEntity<Map<String, Object>> detectIngredients(
            @RequestParam("image") MultipartFile image
    ) throws IOException {
        Map<String, Object> ingredients = ingredientService.detectIngredients(image);
        return ResponseEntity.ok(ingredients);
    }
    
    @PostMapping("/search")
    public ResponseEntity<List<Ingredient>> searchIngredients(@RequestBody String query) {
        List<Ingredient> ingredients = ingredientService.searchIngredients(query);
        return ResponseEntity.ok(ingredients);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Ingredient>> getIngredientsByCategory(@PathVariable String category) {
        List<Ingredient> ingredients = ingredientService.getIngredientsByCategory(category);
        return ResponseEntity.ok(ingredients);
    }

    @PostMapping
    public ResponseEntity<Ingredient> createIngredient(@RequestBody Ingredient ingredient) {
        Ingredient createdIngredient = ingredientService.createIngredient(ingredient);
        return ResponseEntity.ok(createdIngredient);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Ingredient> updateIngredient(@PathVariable String id, @RequestBody Ingredient ingredient) {
        Ingredient updatedIngredient = ingredientService.updateIngredient(id, ingredient);
        if (updatedIngredient != null) {
            return ResponseEntity.ok(updatedIngredient);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIngredient(@PathVariable String id) {
        boolean success = ingredientService.deleteIngredient(id);
        if (success) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
