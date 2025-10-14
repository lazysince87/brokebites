package com.example.demo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferences {
    
    @Field("theme")
    private String theme = "system";
    
    @Field("language")
    private String language = "en";
    
    @Field("notifications_enabled")
    private Boolean notificationsEnabled = true;
    
    @Field("auto_save_recipes")
    private Boolean autoSaveRecipes = true;
    
    @Field("default_servings")
    private Integer defaultServings = 4;
    
    @Field("default_diet_type")
    private String defaultDietType = "balanced";
    
    @Field("preferred_cuisines")
    private List<String> preferredCuisines;
    
    @Field("max_prep_time")
    private Integer maxPrepTime = 60;
    
    @Field("max_cook_time")
    private Integer maxCookTime = 60;
    
    @Field("show_nutrition_info")
    private Boolean showNutritionInfo = true;
}
