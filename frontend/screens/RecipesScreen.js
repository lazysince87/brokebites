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
  const [expandedCards, setExpandedCards] = useState(new Set());

  const loadRecipes = async () => {
    setLoading(true);
    try {
      // Fetch ingredients from backend and use their names to search recipes
      const ingredientsFromServer = await ApiService.getAllIngredients();
      const ingredientNames = Array.isArray(ingredientsFromServer)
        ? ingredientsFromServer.map((ing) => ing && (ing.name || ing.title)).filter(Boolean)
        : [];

      let data;
      if (ingredientNames.length === 0) {
        // No ingredients available on server — fallback to retrieving all recipes
        data = await ApiService.getAllRecipes();
      } else {
        data = await ApiService.searchRecipesByIngredients(ingredientNames);
      }
      setRecipes(data || []);
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

  const toggleCard = (key) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const renderRecipe = ({ item, index }) => {
    const key = `${item.id ?? item.name ?? item.title ?? index}`;
    const expanded = expandedCards.has(key);

    return (
      <TouchableOpacity
        style={styles.recipeCard}
        activeOpacity={0.85}
        onPress={() => toggleCard(key)}
      >
        <Text style={styles.recipeTitle}>{item.name || item.title}</Text>
        <View style={styles.recipeDetails}>
          {item.rating && <Text style={styles.detailText}>⭐ {item.rating}</Text>}
        </View>

        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {item.ingredients && item.ingredients.length > 0 && (
          <View style={styles.ingredientsContainer}>
            <Text style={styles.ingredientsLabel}>Ingredients:</Text>
            <Text style={styles.ingredients}>{item.ingredients.join(', ')}</Text>
          </View>
        )}

        {expanded && item.instructions && item.instructions.length > 0 && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions</Text>
            {item.instructions.map((step, i) => (
              <Text key={i} style={styles.instructionStep}>{`${i + 1}. ${step}`}</Text>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

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
      {/* Header + Fetch button fixed at top */}
      <View style={styles.topContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Recipes</Text>
          <Text style={styles.headerSubtitle}>
            {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} available
          </Text>
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
      </View>

      {/* Scrollable recipe list */}
      {recipes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🍳</Text>
          <Text style={styles.emptyText}>No recipes yet</Text>
          <Text style={styles.emptySubtext}>
            Check back soon for delicious recipes!
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadRecipes}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipe}
          keyExtractor={(item, index) => `${item.id ?? item.name ?? item.title ?? index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={{ flex: 1 }}
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
  topContainer: {
    paddingBottom: 10,
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
    paddingVertical: 10,
  },
  fetchButton: {
    backgroundColor: '#049623',
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
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 6,
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
  ingredientsContainer: {
    marginTop: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
  },
  ingredientsLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  ingredients: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  instructionsContainer: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff8e1',
    borderWidth: 1,
    borderColor: '#ffe082',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#a65e00',
    marginBottom: 8,
  },
  instructionStep: {
    fontSize: 14,
    color: '#6b4a00',
    marginBottom: 6,
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
    backgroundColor: '#049623',
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
