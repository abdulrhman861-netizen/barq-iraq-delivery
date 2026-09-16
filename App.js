import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import WebDemoDashboardScreen from './src/screens/webDemo/WebDemoDashboardScreen';
import { initializeNotifications } from './src/services/notifications';
import { COLORS } from './src/constants';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    initializeNotifications();
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user || null);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoggedIn ? (
        <WebDemoDashboardScreen currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});

export default App;
