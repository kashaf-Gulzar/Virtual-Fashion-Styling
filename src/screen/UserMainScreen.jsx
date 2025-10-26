// UserHomeScreen.js

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const UserHome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Home!</Text>
      <Text style={styles.subtitle}>This is the user dashboard</Text>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          navigation.replace('Login'); // Redirect to login screen
        }}
      >
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#777',
    marginBottom: 20,
  },
  logoutButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UserHome;
