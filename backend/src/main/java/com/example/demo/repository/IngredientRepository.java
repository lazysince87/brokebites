package com.example.demo.repository;

import com.example.demo.model.Ingredient;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredientRepository extends MongoRepository<Ingredient, String> {
    
    // Find ingredients by name (case-insensitive)
    @Query("{'name': {$regex: ?0, $options: 'i'}}")
    List<Ingredient> findByNameContaining(String name);
    
    // Find ingredients by category
    List<Ingredient> findByCategory(String category);
    
    // Find detected ingredients
    List<Ingredient> findByIsDetectedTrue();
    
    // Find ingredients by confidence level
    @Query("{'confidence': {$gte: ?0}}")
    List<Ingredient> findByMinConfidence(Double minConfidence);
    
    // Find high confidence ingredients
    @Query("{'confidence': {$gte: 0.8}}")
    List<Ingredient> findHighConfidenceIngredients();
}
