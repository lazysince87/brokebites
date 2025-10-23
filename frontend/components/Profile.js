import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useAuth } from '../AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <Text>You are not logged in.</Text>;

  return (
    <View style={styles.container}>
      {user.picture && <Image source={{ uri: user.picture }} style={styles.avatar} />}
      <Text style={styles.name}>{user.name}</Text>
      <Text>{user.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: 'bold' },
});

export default Profile;
