// Replace with your computer's IP address when testing on physical device
// For Android emulator use: 10.0.2.2
// For iOS simulator use: localhost
// const API_BASE_URL = 'http://localhost:8080/api';

// If testing on physical device, replace localhost with your computer's IP:
 const API_BASE_URL = 'http://100.70.36.34:8080/api';

class ApiService {
  // Get all recipes
  async getAllRecipes() {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  }

  // Get recipe by ID
  async getRecipeById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      throw error;
    }
  }

  // Search recipes by ingredients
  async searchRecipesByIngredients(ingredients) {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ingredients),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  }

  // Generate recipes using AI
  async generateRecipes(ingredients) {
    const response = await fetch(`${API_BASE_URL}/recipes/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ingredients),
    });
    if (!response.ok) throw new Error('Failed to generate recipes');
    return await response.text(); // backend returns markdown string
  }

  // Save a generated recipe
  async saveGeneratedRecipe(recipeText, ingredients) {
    const response = await fetch(`${API_BASE_URL}/recipes/generate/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipeText, ingredients }),
    });
    if (!response.ok) return { success: false };
    return await response.json(); // { success: true, recipe: {...} }
  }

  // Get all ingredients
  async getAllIngredients() {
    try {
      const response = await fetch(`${API_BASE_URL}/ingredients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      throw error;
    }
  }

  async getIngredientById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/ingredients/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching ingredient:', error);
      throw error;
    }
  }

  async createIngredient(ingredient) {
    try {
      const response = await fetch(`${API_BASE_URL}/ingredients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ingredient),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating ingredient:', error);
      throw error;
    }
  }

  async updateIngredient(id, ingredient) {
    try {
      const response = await fetch(`${API_BASE_URL}/ingredients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ingredient),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating ingredient:', error);
      throw error;
    }
  }

  async deleteIngredient(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/ingredients/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      throw error;
    }
  }

  async searchIngredients(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/ingredients/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching ingredients:', error);
      throw error;
    }
  }

  async getIngredientsByCategory(category) {
    try {
      const response = await fetch(`${API_BASE_URL}/ingredients/category/${category}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching ingredients by category:', error);
      throw error;
    }
  }

  // Upload image for AI ingredient detection
async detectIngredients(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/ingredients/detect`, {
      method: "POST",
      headers: {
        // DO NOT set Content-Type for multipart uploads
        // fetch will set the correct boundary automatically
        "Accept": "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error detecting ingredients:", error);
    throw error;
  }
}

  // Test connection
  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        success: response.ok,
        status: response.status,
        message: response.ok ? 'Connection successful!' : 'Connection failed'
      };
    } catch (error) {
      return {
        success: false,
        status: 0,
        message: `Connection error: ${error.message}`
      };
    }
  }
}

export default new ApiService();