import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import WebDemoDashboardScreen from './src/screens/webDemo/WebDemoDashboardScreen';
import { initializeNotifications } from './src/services/notifications';
import { COLORS } from './src/constants';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    initializeNotifications();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {isLoggedIn ? (
        <WebDemoDashboardScreen onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />
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
