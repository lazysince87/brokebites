package com.example.demo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    
    @Field("email")
    private String email;
    
    @Field("name")
    private String name;
    
    @Field("profile_image_url")
    private String profileImageUrl;
    
    @Field("dietary_preferences")
    private List<String> dietaryPreferences;
    
    @Field("allergies")
    private List<String> allergies;
    
    @Field("saved_recipes")
    private List<String> savedRecipes;
    
    @Field("favorite_ingredients")
    private List<String> favoriteIngredients;
    
    @Field("preferences")
    private UserPreferences preferences;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("last_login_at")
    private LocalDateTime lastLoginAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
}
