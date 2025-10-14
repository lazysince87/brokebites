package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.model.UserPreferences;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    public User getUserById(String id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }
    
    public User getUserByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.orElse(null);
    }
    
    public User createUser(User user) {
        user.setCreatedAt(LocalDateTime.now());
        user.setLastLoginAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    public User updateUser(String id, User user) {
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            user.setId(id);
            user.setCreatedAt(existingUser.getCreatedAt());
            user.setLastLoginAt(existingUser.getLastLoginAt());
            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        }
        return null;
    }
    
    public User updateUserPreferences(String id, UserPreferences preferences) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPreferences(preferences);
            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        }
        return null;
    }
    
    public User addSavedRecipe(String id, String recipeId) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            List<String> savedRecipes = user.getSavedRecipes();
            if (savedRecipes == null) {
                savedRecipes = List.of(recipeId);
            } else if (!savedRecipes.contains(recipeId)) {
                savedRecipes = new java.util.ArrayList<>(savedRecipes);
                savedRecipes.add(recipeId);
            }
            user.setSavedRecipes(savedRecipes);
            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        }
        return null;
    }
    
    public User removeSavedRecipe(String id, String recipeId) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            List<String> savedRecipes = user.getSavedRecipes();
            if (savedRecipes != null) {
                savedRecipes = new java.util.ArrayList<>(savedRecipes);
                savedRecipes.remove(recipeId);
                user.setSavedRecipes(savedRecipes);
                user.setUpdatedAt(LocalDateTime.now());
                return userRepository.save(user);
            }
        }
        return null;
    }
    
    public User addFavoriteIngredient(String id, String ingredientName) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            List<String> favoriteIngredients = user.getFavoriteIngredients();
            if (favoriteIngredients == null) {
                favoriteIngredients = List.of(ingredientName);
            } else if (!favoriteIngredients.contains(ingredientName)) {
                favoriteIngredients = new java.util.ArrayList<>(favoriteIngredients);
                favoriteIngredients.add(ingredientName);
            }
            user.setFavoriteIngredients(favoriteIngredients);
            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        }
        return null;
    }
    
    public User removeFavoriteIngredient(String id, String ingredientName) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            List<String> favoriteIngredients = user.getFavoriteIngredients();
            if (favoriteIngredients != null) {
                favoriteIngredients = new java.util.ArrayList<>(favoriteIngredients);
                favoriteIngredients.remove(ingredientName);
                user.setFavoriteIngredients(favoriteIngredients);
                user.setUpdatedAt(LocalDateTime.now());
                return userRepository.save(user);
            }
        }
        return null;
    }
    
    public boolean deleteUser(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
