import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import ApiService from '../services/api';

const RecipesScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecipes = async () => {
    setLoading(true);
    
    try {
      const data = await ApiService.getAllRecipes();
      setRecipes(data);
      
      if (data.length === 0) {
        Alert.alert('Info', 'No recipes found');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to load recipes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await ApiService.getAllRecipes();
      setRecipes(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh');
    } finally {
      setRefreshing(false);
    }
  };

  const renderRecipe = ({ item }) => (
    <TouchableOpacity style={styles.recipeCard} activeOpacity={0.7}>
      <Text style={styles.recipeTitle}>{item.title}</Text>
      <Text style={styles.recipeDescription}>{item.description}</Text>
      
      <View style={styles.recipeDetails}>
        <Text style={styles.detailText}>
          ⏱️ {(item.prepTimeMinutes || 0) + (item.cookTimeMinutes || 0)} min
        </Text>
        <Text style={styles.detailText}>🍽️ {item.servings} servings</Text>
        {item.rating && <Text style={styles.detailText}>⭐ {item.rating}</Text>}
      </View>
      
      {item.tags && item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
      
      {item.ingredients && item.ingredients.length > 0 && (
        <>
          <Text style={styles.ingredientsLabel}>Ingredients:</Text>
          <Text style={styles.ingredients} numberOfLines={2}>
            {item.ingredients.join(', ')}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );

  if (loading && recipes.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading recipes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recipes</Text>
        <Text style={styles.headerSubtitle}>{recipes.length} recipes available</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.fetchButton, loading && styles.buttonDisabled]}
          onPress={loadRecipes}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : 'Fetch Recipes'}
          </Text>
        </TouchableOpacity>
      </View>

      {recipes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🍳</Text>
          <Text style={styles.emptyText}>No recipes yet</Text>
          <Text style={styles.emptySubtext}>Check back soon for delicious recipes!</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadRecipes}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipe}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  fetchButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  recipeCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  recipeDescription: {
    fontSize: 15,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  recipeDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#1976d2',
    fontSize: 13,
    fontWeight: '500',
  },
  ingredientsLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
    marginTop: 4,
  },
  ingredients: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RecipesScreen;