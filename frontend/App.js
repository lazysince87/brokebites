import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthProvider } from './AuthContext';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';
import RecipeDemo from './screens/RecipesScreen';

export default function App() {
  return (
    // Wrap the app with AuthProvider to manage authentication state
    <AuthProvider>
      <View style={styles.container}>
        <RecipeDemo />
        <Text style={styles.title}>Auth0 Login</Text>
        <LoginButton />
        <LogoutButton />
        <Profile />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'flex-start', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
