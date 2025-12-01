import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";
import ApiService from "../services/api";

const RecipeGenerator = ({ ingredients, onSaveRecipe }) => {
  const [loading, setLoading] = useState(false);
  const [generatedRecipes, setGeneratedRecipes] = useState([]);

  const generateRecipes = async () => {
    if (!ingredients || ingredients.length === 0) return;

    setLoading(true);
    try {
      const response = await ApiService.generateRecipes(ingredients); 

      // Split response into recipes by "##" headers
      const recipes = response
        .split("##")
        .filter(r => r.trim() !== "")
        .map(r => "##" + r.trim());

      setGeneratedRecipes(recipes);

    } catch (error) {
      console.error("Recipe generation error:", error);
      Alert.alert("Error", "Failed to generate recipes. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async (recipeText) => {
    try {
      const res = await ApiService.saveGeneratedRecipe(recipeText, ingredients);
      if (res.success) {
        Alert.alert("Saved!", "Recipe saved successfully.");
        if (onSaveRecipe) onSaveRecipe(res.recipe);
      } else {
        Alert.alert("Error", "Could not save recipe.");
      }
    } catch (error) {
      console.error("Save recipe error:", error);
      Alert.alert("Error", "Failed to save recipe.");
    }
  };

  return (
    <View style={styles.container}>
      {generatedRecipes.length === 0 && (
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={generateRecipes}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Generating..." : "✨ Generate Recipes"}
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView style={{ maxHeight: 400 }}>
        {generatedRecipes.map((recipe, idx) => (
          <View key={idx} style={styles.recipeCard}>
            <Markdown style={markdownStyles}>{recipe}</Markdown>

            {/* Skip save button for the first paragraph */}
            {idx !== 0 && (
              <TouchableOpacity style={styles.saveButton} onPress={() => saveRecipe(recipe)}>
                <Text style={styles.saveButtonText}>💾 Save</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
  button: { 
    backgroundColor: "#ff6b35", 
    padding: 12, 
    borderRadius: 10, 
    alignItems: "center", 
    marginBottom: 15 
  },
  disabledButton: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  recipeCard: { 
    marginBottom: 15, 
    padding: 12, 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: "#049623" 
  },
  saveButton: { 
    backgroundColor: "#049623", 
    padding: 8, 
    borderRadius: 8, 
    alignItems: "center",
    marginTop: 10
  },
  saveButtonText: { color: "#fff", fontWeight: "600" },
});

const markdownStyles = {
  heading2: { fontSize: 18, fontWeight: "bold", color: "#049623", marginBottom: 8 },
  strong: { fontWeight: "bold" },
  text: { color: "#333", fontSize: 16, marginBottom: 4 },
};

export default RecipeGenerator;
