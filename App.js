// App.js - الملف الرئيسي مع دمج جميع Contexts والشاشات
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Contexts
import { AuthProvider } from './src/contexts/AuthContext';
import { OrderProvider } from './src/contexts/OrderContext';
import { TrackingProvider } from './src/contexts/TrackingContext';
import { RatingProvider } from './src/contexts/RatingContext';
import { ChatProvider } from './src/contexts/ChatContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { PaymentProvider } from './src/contexts/PaymentContext';
import { DashboardProvider } from './src/contexts/DashboardContext';
import { SecurityProvider } from './src/contexts/SecurityContext';

// Screens
import TrackingScreen from './src/screens/TrackingScreen';
import ChatScreen from './src/screens/ChatScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import RatingScreen from './src/screens/RatingScreen';
import RatingsListScreen from './src/screens/RatingsListScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import NotificationCenterScreen from './src/screens/NotificationCenterScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import WalletScreen from './src/screens/WalletScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import CODConfirmationScreen from './src/screens/CODConfirmationScreen';
import StripePaymentScreen from './src/screens/StripePaymentScreen';
import PayPalPaymentScreen from './src/screens/PayPalPaymentScreen';
import MerchantDashboard from './src/screens/MerchantDashboard';
import CaptainDashboard from './src/screens/CaptainDashboard';
import AdminDashboard from './src/screens/AdminDashboard';
import StatisticsScreen from './src/screens/StatisticsScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import SecurityDashboard from './src/screens/SecurityDashboard';
import TwoFactorSetupScreen from './src/screens/TwoFactorSetupScreen';
import TwoFactorVerificationScreen from './src/screens/TwoFactorVerificationScreen';
import BiometricAuthScreen from './src/screens/BiometricAuthScreen';
import SessionManagementScreen from './src/screens/SessionManagementScreen';

// Services
import { initializeFirebase } from './src/services/firebase';
import { initializeNotifications } from './src/services/notifications';

const Stack = createStackNavigator();
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
                <PaymentProvider>
                  <DashboardProvider>
                    <SecurityProvider>
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
                          <Stack.Screen name="Wallet" component={WalletScreen} />
                          <Stack.Screen name="Payment" component={PaymentScreen} />
                          <Stack.Screen name="CODConfirmation" component={CODConfirmationScreen} />
                          <Stack.Screen name="StripePayment" component={StripePaymentScreen} />
                          <Stack.Screen name="PayPalPayment" component={PayPalPaymentScreen} />
                          <Stack.Screen name="MerchantDashboard" component={MerchantDashboard} />
                          <Stack.Screen name="CaptainDashboard" component={CaptainDashboard} />
                          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
                          <Stack.Screen name="Statistics" component={StatisticsScreen} />
                          <Stack.Screen name="Reports" component={ReportsScreen} />
                          <Stack.Screen name="SecurityDashboard" component={SecurityDashboard} />
                          <Stack.Screen name="TwoFactorSetup" component={TwoFactorSetupScreen} />
                          <Stack.Screen name="TwoFactorVerification" component={TwoFactorVerificationScreen} />
                          <Stack.Screen name="BiometricAuth" component={BiometricAuthScreen} />
                          <Stack.Screen name="SessionManagement" component={SessionManagementScreen} />
                        </Stack.Navigator>
                      </NavigationContainer>
                    </SecurityProvider>
                  </DashboardProvider>
                </PaymentProvider>
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
