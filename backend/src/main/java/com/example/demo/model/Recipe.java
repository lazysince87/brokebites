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
@Document(collection = "recipes")
public class Recipe {
    
    @Id
    private String id;
    
    @Field("title")
    private String title;
    
    @Field("description")
    private String description;
    
    @Field("image_url")
    private String imageUrl;
    
    @Field("prep_time_minutes")
    private Integer prepTimeMinutes;
    
    @Field("cook_time_minutes")
    private Integer cookTimeMinutes;
    
    @Field("servings")
    private Integer servings;
    
    @Field("ingredients")
    private List<String> ingredients;
    
    @Field("instructions")
    private List<String> instructions;
    
    @Field("nutrition")
    private NutritionInfo nutrition;
    
    @Field("tags")
    private List<String> tags;
    
    @Field("source")
    private String source;
    
    @Field("rating")
    private Double rating;
    
    @Field("review_count")
    private Integer reviewCount;
    
    @Field("is_saved")
    private Boolean isSaved = false;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    // Helper methods
    public Integer getTotalTimeMinutes() {
        return (prepTimeMinutes != null ? prepTimeMinutes : 0) + 
               (cookTimeMinutes != null ? cookTimeMinutes : 0);
    }
    
    public String getFormattedTime() {
        int totalMinutes = getTotalTimeMinutes();
        if (totalMinutes < 60) {
            return totalMinutes + "m";
        } else {
            int hours = totalMinutes / 60;
            int minutes = totalMinutes % 60;
            return minutes > 0 ? hours + "h " + minutes + "m" : hours + "h";
        }
    }
}
