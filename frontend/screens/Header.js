import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../AuthContext';

const HeaderButtons = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout(); // Clear user + token
    navigation.navigate("Login"); // Go back to login screen
  };

  const isLoggedIn = !!user; 

  return (
    <View style={styles.Container}>
      <TouchableOpacity onPress={() => navigation.navigate("Recipes")}>
        <Text style={styles.TextButton}>Recipes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Ingredients")}>
        <Text style={styles.TextButton}>Ingredients</Text>
      </TouchableOpacity>
      {!isLoggedIn && (
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.ReverseHighlightedButton}>Sign In</Text>
        </TouchableOpacity>
      )}

      {isLoggedIn && (
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.ReverseHighlightedButton}>Sign Out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const HeaderOptions = ({ navigation }) => ({
  headerShown: true,
  headerStyle: {
    backgroundColor: '#fff',
  },
  headerTintColor: '#000',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerTitleAlign: 'left',
  headerRight: () => <HeaderButtons navigation={navigation} />,
});

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginRight: 10,
  },
  TextButton: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  ReverseHighlightedButton: {
    backgroundColor: 'white',
    fontSize: 16,
    fontWeight: '500',
    color: '#049623',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderColor: '#049623',
    borderWidth: 3,
    borderRadius: 25,
  },
});

export default HeaderButtons;
