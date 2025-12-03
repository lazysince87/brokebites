import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import ApiService from "../services/api";
import RecipeGenerator from "./RecipeGenerator";

const CameraScreen = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [showRecipeGenerator, setShowRecipeGenerator] = useState(false);
  const [generating, setGenerating] = useState(false);

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Camera access is required to scan ingredients.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        setDetectedIngredients([]);
      }
    } catch (error) {
      console.log("Camera error:", error);
      Alert.alert("Error", "Failed to open camera.");
    }
  };
  //allow selecting from device
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Photo library access is required.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        setDetectedIngredients([]);
      }
    } catch (error) {
      console.log("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  const uploadImage = async () => {
    if (!image) return;

    setLoading(true);
    setShowRecipeGenerator(false);
    setGenerating(false);
    try {
      const formData = new FormData();

      // Get filename from URI
      const filename = image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append("image", {
        uri: image,
        type: type,
        name: filename || "receipt.jpg",
      });

      console.log("Uploading image to backend...");
      const response = await ApiService.detectIngredients(formData);
      console.log("Response from backend:", response);

      if (response.success) {
        const ingredients = response.ingredients || [];
        setDetectedIngredients(ingredients);

        Alert.alert(
          "Success! 🎉",
          `Found ${ingredients.length} ingredients:\n${response.ingredientNames?.join(", ") || ""}`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("Detection Result", response.message || "No ingredients detected");
      }

    } catch (error) {
      console.error("Upload error:", error);

      let errorMessage = "Failed to detect ingredients. ";
      if (error.message.includes("Network request failed")) {
        errorMessage += "Cannot reach backend. Check your API URL and network connection.";
      } else if (error.message.includes("500")) {
        errorMessage += "Server error. Check backend logs for details.";
      } else {
        errorMessage += error.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Scan Receipt for Ingredients</Text>

        {image ? (
          <Image source={{ uri: image }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>📷</Text>
            <Text style={styles.placeholderSubtext}>Take a photo of your receipt</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={openCamera}>
            <Text style={styles.buttonText}>📷 Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={pickImage}>
            <Text style={styles.buttonText}>🖼️ Gallery</Text>
          </TouchableOpacity>
        </View>

        {image && (
          <TouchableOpacity
            style={[styles.uploadButton, loading && styles.disabledButton]}
            onPress={uploadImage}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "🔍 Detecting..." : "✨ Upload & Detect"}
            </Text>
          </TouchableOpacity>
        )}

        {detectedIngredients.length > 0 && (
          <>
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Detected Ingredients:</Text>
              {detectedIngredients.map((ingredient, index) => (
                <View key={ingredient.id || index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientText}>• {ingredient.name}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.generateButton, generating && styles.disabledButton]}
              onPress={() => setShowRecipeGenerator(true)}
              disabled={generating}
            >
              <Text style={styles.buttonText}>
                {generating ? "Generating..." : "🍳 Generate Recipes"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {showRecipeGenerator && detectedIngredients.length > 0 && (
          <View style={styles.recipeGeneratorWrapper}>
            <RecipeGenerator ingredients={detectedIngredients.map(i => i.name)} />
          </View>
        )}

        <Text style={styles.infoText}>
          💡 Tip: Make sure the receipt is clear and well-lit for best results.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  preview: {
    width: 300,
    height: 300,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#049623",
  },
  placeholder: {
    width: 300,
    height: 300,
    borderRadius: 20,
    backgroundColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#dee2e6",
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 80,
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#049623",
    padding: 15,
    borderRadius: 12,
    minWidth: 140,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#0066cc",
  },
  uploadButton: {
    backgroundColor: "#ff6b35",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    minWidth: 280,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  resultsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "100%",
    maxWidth: 300,
    borderWidth: 1,
    borderColor: "#049623",
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#049623",
  },
  ingredientItem: {
    paddingVertical: 5,
  },
  ingredientText: {
    fontSize: 16,
    color: "#333",
  },
  infoText: {
    marginTop: 30,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  generateButton: {
    backgroundColor: "#ff9800",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    minWidth: 280,
    alignItems: "center",
  },
  recipeGeneratorWrapper: {
    marginTop: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fefefe",
  },
  recipeScroll: {
    width: "100%",
  },
});

export default CameraScreen;