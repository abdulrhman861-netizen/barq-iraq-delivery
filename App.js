// App.js - الملف الرئيسي
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

// Contexts
import { AuthProvider } from './src/contexts/AuthContext';
import { OrderProvider } from './src/contexts/OrderContext';
import { TrackingProvider } from './src/contexts/TrackingContext';
import { RatingProvider } from './src/contexts/RatingContext';
import { ChatProvider } from './src/contexts/ChatContext';
import { NotificationProvider } from './src/contexts/NotificationContext';

// Services
import { initializeFirebase } from './src/services/firebase';
import { initializeNotifications } from './src/services/notifications';
import { COLORS, SIZES, FONT_SIZES } from './src/constants/index';

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
                <SafeAreaView style={styles.container}>
                  <View style={styles.header}>
                    <Text style={styles.title}>🚀 برق العراق</Text>
                    <Text style={styles.subtitle}>تطبيق التوصيل السريع</Text>
                  </View>

                  <View style={styles.content}>
                    <Text style={styles.welcome}>أهلاً وسهلاً! 👋</Text>
                    <Text style={styles.message}>
                      التطبيق قيد التطوير حالياً
                    </Text>
                    <Text style={styles.status}>✅ جميع الخدمات متصلة</Text>
                  </View>

                  <View style={styles.features}>
                    <FeatureItem icon="💬" title="الدردشة" />
                    <FeatureItem icon="📦" title="الطلبات" />
                    <FeatureItem icon="📍" title="التتبع" />
                    <FeatureItem icon="⭐" title="التقييمات" />
                  </View>
                </SafeAreaView>
              </NotificationProvider>
            </ChatProvider>
          </RatingProvider>
        </TrackingProvider>
      </OrderProvider>
    </AuthProvider>
  );
};

const FeatureItem = ({ icon, title }) => (
  <View style={styles.feature}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.xl,
    paddingHorizontal: SIZES.md,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
  },
  welcome: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.md,
  },
  message: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gray,
    marginBottom: SIZES.md,
    textAlign: 'center',
  },
  status: {
    fontSize: FONT_SIZES.base,
    color: COLORS.success,
    fontWeight: '600',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SIZES.xl,
    paddingHorizontal: SIZES.md,
    backgroundColor: COLORS.gray,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  feature: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: FONT_SIZES.huge,
    marginBottom: SIZES.xs,
  },
  featureTitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
});

export default App;
