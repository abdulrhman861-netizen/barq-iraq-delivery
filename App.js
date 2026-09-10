// App.js - الملف الرئيسي
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';

// Contexts
import { AuthProvider } from './src/contexts/AuthContext';
import { OrderProvider } from './src/contexts/OrderContext';
import { TrackingProvider } from './src/contexts/TrackingContext';
import { RatingProvider } from './src/contexts/RatingContext';
import { ChatProvider } from './src/contexts/ChatContext';
import { NotificationProvider } from './src/contexts/NotificationContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

// Services
import { initializeFirebase } from './src/services/firebase';
import { initializeNotifications } from './src/services/notifications';
import { COLORS } from './src/constants/index';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // تهيئة Firebase
    initializeFirebase();
    
    // تهيئة الإشعارات
    initializeNotifications();
    
    console.log('✅ App initialized successfully');
  }, []);

  return (
    <AuthProvider>
      <OrderProvider>
        <TrackingProvider>
          <RatingProvider>
            <ChatProvider>
              <NotificationProvider>
                <SafeAreaView style={styles.container}>
                  {isLoggedIn ? (
                    <HomeScreen onLogout={() => setIsLoggedIn(false)} />
                  ) : (
                    <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />
                  )}
                </SafeAreaView>
              </NotificationProvider>
            </ChatProvider>
          </RatingProvider>
        </TrackingProvider>
      </OrderProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});

export default App;
