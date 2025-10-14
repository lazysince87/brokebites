package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.model.UserPreferences;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User user) {
        User updatedUser = userService.updateUser(id, user);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/preferences")
    public ResponseEntity<User> updateUserPreferences(@PathVariable String id, @RequestBody UserPreferences preferences) {
        User updatedUser = userService.updateUserPreferences(id, preferences);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/{id}/saved-recipes/{recipeId}")
    public ResponseEntity<User> addSavedRecipe(@PathVariable String id, @PathVariable String recipeId) {
        User updatedUser = userService.addSavedRecipe(id, recipeId);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}/saved-recipes/{recipeId}")
    public ResponseEntity<User> removeSavedRecipe(@PathVariable String id, @PathVariable String recipeId) {
        User updatedUser = userService.removeSavedRecipe(id, recipeId);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/{id}/favorite-ingredients/{ingredientName}")
    public ResponseEntity<User> addFavoriteIngredient(@PathVariable String id, @PathVariable String ingredientName) {
        User updatedUser = userService.addFavoriteIngredient(id, ingredientName);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}/favorite-ingredients/{ingredientName}")
    public ResponseEntity<User> removeFavoriteIngredient(@PathVariable String id, @PathVariable String ingredientName) {
        User updatedUser = userService.removeFavoriteIngredient(id, ingredientName);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        boolean success = userService.deleteUser(id);
        if (success) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
