// شاشة إعدادات الإشعارات
import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NotificationContext } from '../../contexts/NotificationContext';
import { COLORS, SIZES, FONT_SIZES } from '../../constants/index';

const NotificationSettingsScreen = ({ navigation }) => {
  const { notificationSettings, updateSettings } = useContext(NotificationContext);
  const [settings, setSettings] = useState(notificationSettings);

  const handleToggle = (key) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    setSettings(newSettings);
    updateSettings(newSettings);
  };

  const SettingRow = ({ label, icon, enabled, onToggle }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLabel}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <Text style={styles.settingText}>{label}</Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.border, true: COLORS.accent }}
        thumbColor={enabled ? COLORS.primary : COLORS.gray}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>إعدادات الإشعارات</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* إشعارات الطلبات */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 إشعارات الطلبات</Text>
          <SettingRow
            label="طلب جديد"
            icon="✅"
            enabled={settings.orderCreated}
            onToggle={() => handleToggle('orderCreated')}
          />
          <SettingRow
            label="تم قبول الطلب"
            icon="📍"
            enabled={settings.orderAccepted}
            onToggle={() => handleToggle('orderAccepted')}
          />
          <SettingRow
            label="تم التسليم"
            icon="🎉"
            enabled={settings.orderDelivered}
            onToggle={() => handleToggle('orderDelivered')}
          />
        </View>

        {/* إشعارات الدردشة */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 إشعارات الدردشة</Text>
          <SettingRow
            label="رسالة جديدة"
            icon="💬"
            enabled={settings.chatMessage}
            onToggle={() => handleToggle('chatMessage')}
          />
        </View>

        {/* إشعارات التقييمات */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ إشعارات التقييمات</Text>
          <SettingRow
            label="تقييم جديد"
            icon="⭐"
            enabled={settings.ratingReceived}
            onToggle={() => handleToggle('ratingReceived')}
          />
        </View>

        {/* إشعارات الدفع */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 إشعارات الدفع</Text>
          <SettingRow
            label="تم استقبال الدفع"
            icon="💳"
            enabled={settings.paymentReceived}
            onToggle={() => handleToggle('paymentReceived')}
          />
        </View>

        {/* إشعارات النظام */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ إشعارات النظام</Text>
          <SettingRow
            label="تنبيهات النظام"
            icon="🔔"
            enabled={settings.systemAlert}
            onToggle={() => handleToggle('systemAlert')}
          />
        </View>

        {/* الإعدادات العامة */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔊 الإعدادات العامة</Text>
          <SettingRow
            label="الصوت"
            icon="🔔"
            enabled={settings.sound}
            onToggle={() => handleToggle('sound')}
          />
          <SettingRow
            label="الاهتزاز"
            icon="📳"
            enabled={settings.vibration}
            onToggle={() => handleToggle('vibration')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
  },
  backButton: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.white,
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SIZES.md,
  },
  section: {
    marginBottom: SIZES.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
  },
  settingIcon: {
    fontSize: FONT_SIZES.lg,
  },
  settingText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.darkGray,
  },
});

export default NotificationSettingsScreen;
