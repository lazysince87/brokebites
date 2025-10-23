import React from 'react';
import { Button } from 'react-native';
import { useAuth } from '../AuthContext';

const LogoutButton = () => {
  const { logout } = useAuth();

  return <Button title="Logout" onPress={logout} />;
};

export default LogoutButton;
