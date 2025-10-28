import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';

const LandingScreen = ({navigation}) => {

  return (
    <View style= {styles.Container}>
      <Text style= {styles.HeroMainText}>Delicious Recipes</Text>
      <Text style= {styles.HeroSubText}>Zero Waste</Text>
      <TouchableOpacity style= {styles.HighlightedButton} onPress= {() => {navigation.navigate("Login")}}>Register Now</TouchableOpacity>
      <Image 
        source={require("../assets/Leaf.png")} 
        style={{  
          width: 500,
          height: 350,
          resizeMode: "contain",
          position: 'absolute',
          top: -80,
          right: -100,
          transform: [{ rotate: "-120deg" }],
        }} 
      />
      <Image 
        source={require("../assets/Leaf.png")} 
        style={{
          width: 500,
          height: 500,
          resizeMode: "contain",
          position: 'absolute',
          bottom: -80,
          right: -50,
          transform: [{ rotate: "-60deg" }],
        }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 100,
  },
  HeroMainText: {
    fontSize: 70,
  },
  HeroSubText: {
    fontSize: 60,
  },
  HighlightedButton:{
    backgroundColor: "#049623",
    
    fontSize: 25,
    fontWeight: 500,
    color: "#fff",
    
    paddingHorizontal: 18,
    paddingVertical: 8,

    borderColor: "#049623",
    borderWidth: 3,
    borderRadius: 25,

    marginTop: 15,
  }
});

export default LandingScreen;