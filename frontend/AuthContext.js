import React, { createContext, useState, useContext } from 'react';
import * as AuthSession from 'expo-auth-session';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '@env';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const login = async () => {
    try {
      // Use Expo proxy
      const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

      const authUrl =
        `https://${AUTH0_DOMAIN}/authorize` +
        `?client_id=${AUTH0_CLIENT_ID}` +
        `&response_type=token` +
        `&scope=openid profile email` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}`;

      const result = await AuthSession.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === 'success') {
        const tokenMatch = result.url.match(/access_token=([^&]+)/);
        if (!tokenMatch) throw new Error('No access token returned');
        const token = tokenMatch[1];

        setAccessToken(token);

        const userInfoResponse = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userInfo = await userInfoResponse.json();
        setUser(userInfo);
      }
    } catch (error) {
      console.log('Login failed', error);
    }
  };

  const logout = () => {
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
