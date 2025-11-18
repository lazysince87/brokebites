import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthProvider } from './AuthContext';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {HeaderOptions} from './screens/Header';
import LandingScreen from './screens/LandingScreen';
import LoginScreen from './screens/LoginScreen';
import RecipesScreen from './screens/RecipesScreen';
import IngredientsScreen from './screens/IngredientsScreen';
import CameraScreen from './screens/CameraScreen';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    // Wrap the app with AuthProvider to manage authentication state
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={({ navigation }) => HeaderOptions({navigation})}>
          <Stack.Screen name="Landing" component={LandingScreen} options={{title: "Home"}}/>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Recipes" component={RecipesScreen} />
          <Stack.Screen name="Ingredients" component={IngredientsScreen} />
          <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ title: "Scan Ingredients" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'flex-start', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
