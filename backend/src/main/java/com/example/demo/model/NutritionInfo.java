package com.example.demo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NutritionInfo {
    
    @Field("calories")
    private Double calories;
    
    @Field("protein")
    private Double protein;
    
    @Field("carbs")
    private Double carbs;
    
    @Field("fat")
    private Double fat;
    
    @Field("fiber")
    private Double fiber;
    
    @Field("sugar")
    private Double sugar;
    
    @Field("sodium")
    private Double sodium;
}
