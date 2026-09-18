import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import WebDemoDashboardScreen from './src/screens/webDemo/WebDemoDashboardScreen';
import { initializeNotifications } from './src/services/notifications';
import { COLORS } from './src/constants';
import { signOutUser, subscribeToAuthState } from './src/services/firebaseAuth';
import { getFirebaseSetupState } from './src/services/firebaseClient';

const App = () => {
  const [authUser, setAuthUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [setupState] = useState(getFirebaseSetupState());
  const isUsingDemoMode = isDemoMode && !authUser;
  const dashboardUser = authUser || null;

  useEffect(() => {
    initializeNotifications();
    const unsubscribe = subscribeToAuthState((user) => {
      setAuthUser(user);
      if (user) setIsDemoMode(false);
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
      ) : isUsingDemoMode || authUser ? (
        <WebDemoDashboardScreen
          currentUser={dashboardUser}
          onLogout={async () => {
            if (isUsingDemoMode) {
              setIsDemoMode(false);
              return;
            }
            await signOutUser();
          }}
        />
      ) : (
        <LoginScreen
          isFirebaseConfigured={setupState.isConfigured}
          onOpenDemoMode={() => setIsDemoMode(true)}
        />
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
