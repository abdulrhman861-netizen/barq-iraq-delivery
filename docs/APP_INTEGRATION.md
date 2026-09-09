// ملف التكامل - تحديث App.js لدمج نظام الدفع
// أضف هذا المحتوى إلى App.js الموجود

/*

// في الجزء العلوي من الملف، أضف الاستيراد:
import { PaymentProvider } from './src/contexts/PaymentContext';
import PaymentScreen from './src/screens/PaymentScreen';
import WalletScreen from './src/screens/WalletScreen';

// في الدالة MainTabNavigator، أضف هذه الشاشات:
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
        name="Home"
        component={HomeScreen}
        options={{
          title: 'الرئيسية',
          tabBarLabel: 'الرئيسية',
          tabBarIcon: () => '🏠',
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          title: 'المحفظة',
          tabBarLabel: 'المحفظة',
          tabBarIcon: () => '💰',
        }}
      />
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
      <Tab.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{
          title: 'الملف الشخصي',
          tabBarLabel: 'الملف',
          tabBarIcon: () => '👤',
        }}
      />
    </Tab.Navigator>
  );
};

// في الدالة App، غطّي الشاشات بـ PaymentProvider:
const App = () => {
  useEffect(() => {
    initializeFirebase();
    initializeNotifications();
  }, []);

  return (
    <AuthProvider>
      <OrderProvider>
        <TrackingProvider>
          <RatingProvider>
            <ChatProvider>
              <NotificationProvider>
                <PaymentProvider>  {/* أضف هنا */}
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
                      <Stack.Screen
                        name="Payment"
                        component={PaymentScreen}
                      />
                      {/* أضف الشاشات الأخرى */}
                    </Stack.Navigator>
                  </NavigationContainer>
                </PaymentProvider>  {/* أغلق هنا */}
              </NotificationProvider>
            </ChatProvider>
          </RatingProvider>
        </TrackingProvider>
      </OrderProvider>
    </AuthProvider>
  );
};

export default App;

*/
