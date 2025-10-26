import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthProvider } from './AuthContext';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import RecipesScreen from './screens/RecipesScreen';
import IngredientsScreen from './screens/IngredientsScreen';
import LandingScreen from './screens/LandingScreen';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    // Wrap the app with AuthProvider to manage authentication state
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Landing" component={LandingScreen} options={{title: "Home"}}/>
          <Stack.Screen name="Recipes" component={RecipesScreen} />
          <Stack.Screen name="Ingredients" component={IngredientsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
    
    /*<AuthProvider>
      <View style={styles.container}>
        <RecipeDemo />
        <Text style={styles.title}>Auth0 Login</Text>
        <LoginButton />
        <LogoutButton />
        <Profile />
      </View>
    </AuthProvider>*/
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'flex-start', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
