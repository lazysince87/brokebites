import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/Leaf.png")}
        style={[styles.leaf, { top: -80, right: -100, transform: [{ rotate: "-120deg" }] }]}
      />
      <Image
        source={require("../assets/Leaf.png")}
        style={[styles.leaf, { bottom: -80, right: -50, transform: [{ rotate: "-60deg" }] }]}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.heroMainText}>Delicious Recipes</Text>
        <Text style={styles.heroSubText}>Zero Waste</Text>

        <TouchableOpacity
          style={styles.highlightedButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Register Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.highlightedButton, { marginTop: 20 }]}
          onPress={() => navigation.navigate("CameraScreen")}
        >
          <Text style={styles.buttonText}>Scan Ingredients</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
    zIndex: 10, // ensures buttons are on top of leaves
  },
  heroMainText: {
    fontSize: width > 350 ? 60 : 40,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  heroSubText: {
    fontSize: width > 350 ? 50 : 30,
    textAlign: "center",
    marginBottom: 30,
  },
  highlightedButton: {
    backgroundColor: "#049623",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#049623",
    minWidth: 220,
    alignItems: "center",
    zIndex: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },
  leaf: {
    width: width * 1.2,
    height: width * 1.2,
    resizeMode: "contain",
    position: "absolute",
    zIndex: 0,
  },
});

export default LandingScreen;
