package com.example.demo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ingredients")
public class Ingredient {
    
    @Id
    private String id;
    
    @Field("name")
    private String name;
    
    @Field("category")
    private String category;
    
    @Field("image_url")
    private String imageUrl;
    
    @Field("confidence")
    private Double confidence;
    
    @Field("is_detected")
    private Boolean isDetected = false;
    
    @Field("detected_at")
    private LocalDateTime detectedAt;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    // Helper methods
    public Boolean isHighConfidence() {
        return confidence != null && confidence >= 0.8;
    }
    
    public Boolean isMediumConfidence() {
        return confidence != null && confidence >= 0.5 && confidence < 0.8;
    }
    
    public Boolean isLowConfidence() {
        return confidence != null && confidence < 0.5;
    }
}
