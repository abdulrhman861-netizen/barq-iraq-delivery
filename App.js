import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import WebDemoDashboardScreen from './src/screens/webDemo/WebDemoDashboardScreen';
import { initializeNotifications } from './src/services/notifications';
import { COLORS } from './src/constants';
import { signOutUser, subscribeToAuthState } from './src/services/firebaseAuth';

const App = () => {
  const [authUser, setAuthUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    initializeNotifications();
    const unsubscribe = subscribeToAuthState((user) => {
      setAuthUser(user);
      setIsAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {isAuthLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>جاري التحقق من حالة تسجيل الدخول...</Text>
        </View>
      ) : authUser ? (
        <WebDemoDashboardScreen currentUser={authUser} onLogout={signOutUser} />
      ) : (
        <LoginScreen />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: COLORS.darkGray,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;
