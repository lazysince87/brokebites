package com.example.demo.repository;

import com.example.demo.model.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends MongoRepository<Recipe, String> {
    
    // Find recipes by ingredients (case-insensitive)
    @Query("{'ingredients': {$regex: ?0, $options: 'i'}}")
    List<Recipe> findByIngredientsContaining(String ingredient);
    
    // Find recipes by multiple ingredients
    @Query("{'ingredients': {$in: ?0}}")
    List<Recipe> findByIngredientsIn(List<String> ingredients);
    
    // Find recipes by tags
    @Query("{'tags': {$in: ?0}}")
    List<Recipe> findByTagsIn(List<String> tags);
    
    // Find recipes by diet type (tag-based)
    @Query("{'tags': {$regex: ?0, $options: 'i'}}")
    List<Recipe> findByDietType(String dietType);
    
    // Find recipes by maximum calories
    @Query("{'nutrition.calories': {$lte: ?0}}")
    List<Recipe> findByMaxCalories(Double maxCalories);
    
    // Find recipes by minimum protein
    @Query("{'nutrition.protein': {$gte: ?0}}")
    List<Recipe> findByMinProtein(Double minProtein);
    
    // Find recipes by maximum prep time
    @Query("{'prepTimeMinutes': {$lte: ?0}}")
    List<Recipe> findByMaxPrepTime(Integer maxPrepTime);
    
    // Find recipes by maximum cook time
    @Query("{'cookTimeMinutes': {$lte: ?0}}")
    List<Recipe> findByMaxCookTime(Integer maxCookTime);
    
    // Find saved recipes by user ID
    @Query("{'isSaved': true}")
    List<Recipe> findSavedRecipes();
    
    // Find recipes by rating
    @Query("{'rating': {$gte: ?0}}")
    List<Recipe> findByMinRating(Double minRating);
    
    // Find recipes by title (case-insensitive)
    @Query("{'title': {$regex: ?0, $options: 'i'}}")
    List<Recipe> findByTitleContaining(String title);
    
    // Complex query for filtered search
    @Query("{'$and': [{'nutrition.calories': {$lte: ?0}}, {'nutrition.protein': {$gte: ?1}}, {'prepTimeMinutes': {$lte: ?2}}, {'cookTimeMinutes': {$lte: ?3}}]}")
    List<Recipe> findByFilters(Double maxCalories, Double minProtein, Integer maxPrepTime, Integer maxCookTime);
}
