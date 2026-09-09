import React, { useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet, Alert } from 'react-native';
import { SecurityContext } from '../contexts/SecurityContext';
import { AuthContext } from '../contexts/AuthContext';
import SecurityToggleItem from '../components/SecurityToggleItem';
import SecurityEventCard from '../components/SecurityEventCard';
import { COLORS, FONT_SIZES, SIZES } from '../constants';

const SecuritySettingsScreen = ({ route }) => {
  const { user } = useContext(AuthContext);
  const userId = route?.params?.userId || user?.id;
  const {
    settings,
    auditLogs,
    initializeSecurity,
    updateSettings,
  } = useContext(SecurityContext);

  useEffect(() => {
    if (userId) {
      initializeSecurity(userId).catch((error) => Alert.alert('خطأ', error.message));
    }
  }, [initializeSecurity, userId]);

  const handleToggle = async (key, value) => {
    try {
      await updateSettings(userId, { [key]: value });
    } catch (error) {
      Alert.alert('خطأ', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>إعدادات الأمان</Text>
        <SecurityToggleItem
          label="تفعيل التحقق بخطوتين"
          value={settings?.twoFactorEnabled}
          onValueChange={(value) => handleToggle('twoFactorEnabled', value)}
        />
        <SecurityToggleItem
          label="تفعيل المصادقة البيومترية"
          value={settings?.biometricEnabled}
          onValueChange={(value) => handleToggle('biometricEnabled', value)}
        />
        <SecurityToggleItem
          label="تنبيهات تسجيل الدخول"
          value={settings?.loginAlerts}
          onValueChange={(value) => handleToggle('loginAlerts', value)}
        />
        <SecurityToggleItem
          label="تجميد تلقائي للنشاط المريب"
          value={settings?.suspiciousAutoFreeze}
          onValueChange={(value) => handleToggle('suspiciousAutoFreeze', value)}
        />

        <Text style={styles.subtitle}>سجل العمليات الحساسة</Text>
        {auditLogs.map((item) => (
          <SecurityEventCard key={item.id} event={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SIZES.md },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.md,
  },
  subtitle: {
    marginTop: SIZES.lg,
    marginBottom: SIZES.sm,
    fontSize: FONT_SIZES.lg,
    color: COLORS.darkGray,
    fontWeight: 'bold',
  },
});

export default SecuritySettingsScreen;
