// App.js - الملف الرئيسي مع دمج جميع Contexts والشاشات
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Contexts
import { AuthProvider } from './src/contexts/AuthContext';
import { OrderProvider } from './src/contexts/OrderContext';
import { TrackingProvider } from './src/contexts/TrackingContext';
import { RatingProvider } from './src/contexts/RatingContext';
import { ChatProvider } from './src/contexts/ChatContext';
import { NotificationProvider } from './src/contexts/NotificationContext';

// Screens
import TrackingScreen from './src/screens/TrackingScreen';
import ChatScreen from './src/screens/ChatScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import RatingScreen from './src/screens/RatingScreen';
import RatingsListScreen from './src/screens/RatingsListScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import NotificationCenterScreen from './src/screens/NotificationCenterScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';

// Services
import { initializeFirebase } from './src/services/firebase';
import { initializeNotifications } from './src/services/notifications';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  useEffect(() => {
    // تهيئة Firebase
    initializeFirebase();
    
    // تهيئة الإشعارات
    initializeNotifications();
  }, []);

  return (
    <AuthProvider>
      <OrderProvider>
        <TrackingProvider>
          <RatingProvider>
            <ChatProvider>
              <NotificationProvider>
                <NavigationContainer>
                  <Stack.Navigator
                    screenOptions={{
                      headerShown: false,
                    }}
                  >
                    <Stack.Screen
                      name="MainTabs"
                      component={MainTabNavigator}
                    />
                    <Stack.Screen name="Tracking" component={TrackingScreen} />
                    <Stack.Screen name="Chat" component={ChatScreen} />
                    <Stack.Screen name="Rating" component={RatingScreen} />
                    <Stack.Screen
                      name="RatingsList"
                      component={RatingsListScreen}
                    />
                    <Stack.Screen
                      name="UserProfile"
                      component={UserProfileScreen}
                    />
                    <Stack.Screen
                      name="NotificationSettings"
                      component={NotificationSettingsScreen}
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </NotificationProvider>
            </ChatProvider>
          </RatingProvider>
        </TrackingProvider>
      </OrderProvider>
    </AuthProvider>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          title: 'الرسائل',
          tabBarLabel: 'الرسائل',
          tabBarIcon: () => '💬',
        }}
      />
      <Tab.Screen
        name="NotificationCenter"
        component={NotificationCenterScreen}
        options={{
          title: 'الإشعارات',
          tabBarLabel: 'الإشعارات',
          tabBarIcon: () => '🔔',
        }}
      />
    </Tab.Navigator>
  );
};

export default App;
