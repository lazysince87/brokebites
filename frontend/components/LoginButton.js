import React from 'react';
import { Button } from 'react-native';
import { useAuth } from '../AuthContext';

const LoginButton = () => {
  const { login } = useAuth();

  return <Button title="Login" onPress={login} />;
};

export default LoginButton;
