import React, { createContext, useState, useContext } from 'react';
import * as AuthSession from 'expo-auth-session';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '@env';

// Create the context
const AuthContext = createContext();

// Configure Auth0 endpoint
const discovery = {
  authorizationEndpoint: `https://${AUTH0_DOMAIN}/authorize`,
  tokenEndpoint: `https://${AUTH0_DOMAIN}/oauth/token`,
  revocationEndpoint: `https://${AUTH0_DOMAIN}/v2/logout`,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const login = async () => {
    try {
      // Create redirect URI using Expo's proxy for development
      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true,
      });

      console.log('Redirect URI:', redirectUri);

      // Configure the Auth request
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
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
