// Replace with your computer's IP address when testing on physical device
// For Android emulator use: 10.0.2.2
// For iOS simulator use: localhost
const API_BASE_URL = 'http://localhost:8080/api';

// If testing on physical device, replace localhost with your computer's IP:
// const API_BASE_URL = 'http://192.168.1.XXX:8080/api';

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