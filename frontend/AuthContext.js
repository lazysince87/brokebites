import React, { createContext, useState, useContext, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
const AuthContext = createContext();

// Configure Auth0 endpoints
const discovery = {
  authorizationEndpoint: `https://${AUTH0_DOMAIN}/authorize`,
  tokenEndpoint: `https://${AUTH0_DOMAIN}/oauth/token`,
  revocationEndpoint: `https://${AUTH0_DOMAIN}/v2/logout`,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧩 Restore login session on startup
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('auth_user');
        const storedToken = await AsyncStorage.getItem('auth_token');

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setAccessToken(storedToken);
          console.log('🔁 Session restored');
        } else {
          console.log('No saved session found');
        }
      } catch (error) {
        console.error('Failed to load session:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, []);

  // 🧩 Save session whenever user logs in
  useEffect(() => {
    const saveSession = async () => {
      if (user && accessToken) {
        await AsyncStorage.setItem('auth_user', JSON.stringify(user));
        await AsyncStorage.setItem('auth_token', accessToken);
      }
    };
    saveSession();
  }, [user, accessToken]);

  const login = async () => {
    try {
      // Create redirect URI using Expo's proxy for development
      const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
      console.log('Redirect URI:', redirectUri);

      // Configure Auth request
      const authRequest = new AuthSession.AuthRequest({
        clientId: AUTH0_CLIENT_ID,
        redirectUri,
        scopes: ['openid', 'profile', 'email'],
        responseType: 'token',
      });

      // Prompt user for login
      const result = await authRequest.promptAsync(discovery, { useProxy: true });

      if (result.type === 'success' && result.params.access_token) {
        const token = result.params.access_token;
        setAccessToken(token);

        // Fetch user info
        const userInfoResponse = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userInfo = await userInfoResponse.json();

        setUser(userInfo);
        await AsyncStorage.setItem('auth_user', JSON.stringify(userInfo));
        await AsyncStorage.setItem('auth_token', token);

        console.log('✅ Login success');
      } else {
        console.log('Login cancelled or failed:', result);
      }
    } catch (error) {
      console.log('Login failed', error);
    }
  };

  const logout = async () => {
    setUser(null);
    setAccessToken(null);
    await AsyncStorage.removeItem('auth_user');
    await AsyncStorage.removeItem('auth_token');
    console.log('🚪 Logged out');
  };

  if (loading) return null; // or a splash screen component

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
