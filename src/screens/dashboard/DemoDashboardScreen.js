import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, FONT_SIZES, SIZES } from '../../constants';

const roleLabels = {
  captain: 'كابتن',
  merchant: 'تاجر',
  employee: 'موظف',
  admin: 'إدارة',
};

const roleOptions = ['captain', 'merchant', 'employee', 'admin'];

const featureItems = [
  { key: 'chat', title: '💬 Chat', subtitle: 'التواصل مع السائقين' },
  { key: 'createOrder', title: '📦 Create Order', subtitle: 'إنشاء طلب جديد' },
  { key: 'ratings', title: '⭐ Ratings', subtitle: 'تقييم الخدمات' },
  { key: 'notifications', title: '🔔 Notifications', subtitle: 'إدارة الإشعارات' },
  { key: 'wallet', title: '💰 Wallet / Finance', subtitle: 'المحافظ والحسابات المالية' },
];

const featureVisibilityByRole = {
  captain: ['chat', 'notifications', 'wallet', 'ratings'],
  merchant: ['createOrder', 'chat', 'ratings', 'notifications', 'wallet'],
  employee: ['chat', 'notifications', 'wallet'],
  admin: ['chat', 'createOrder', 'ratings', 'notifications', 'wallet'],
};

const DemoDashboardScreen = ({ currentRole, onRoleChange, onNavigate, firebaseMode, onLogout }) => {
  const allowed = featureVisibilityByRole[currentRole] || featureItems.map((item) => item.key);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>لوحة التجربة على الويب</Text>
      <Text style={styles.badge}>
        وضع البيانات: {firebaseMode === 'firebase' ? 'Firebase الحقيقي' : 'Demo Fallback'}
      </Text>

      <View style={styles.roleSection}>
        <Text style={styles.sectionTitle}>تبديل الدور الحالي</Text>
        <View style={styles.roleGrid}>
          {roleOptions.map((role) => (
            <TouchableOpacity
              key={role}
              style={[styles.roleButton, currentRole === role && styles.roleButtonActive]}
              onPress={() => onRoleChange(role)}
            >
              <Text style={[styles.roleButtonText, currentRole === role && styles.roleButtonTextActive]}>
                {roleLabels[role]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>الصفحات الرئيسية</Text>
      {featureItems.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[styles.featureButton, !allowed.includes(item.key) && styles.featureDisabled]}
          disabled={!allowed.includes(item.key)}
          onPress={() => onNavigate(item.key)}
        >
          <Text style={styles.featureTitle}>{item.title}</Text>
          <Text style={styles.featureSubtitle}>{item.subtitle}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.md,
    backgroundColor: COLORS.gray,
    minHeight: '100%',
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.sm,
    textAlign: 'right',
  },
  badge: {
    backgroundColor: COLORS.secondary,
    color: COLORS.white,
    padding: SIZES.sm,
    borderRadius: 8,
    marginBottom: SIZES.lg,
    textAlign: 'center',
    overflow: 'hidden',
  },
  roleSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    marginBottom: SIZES.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    marginBottom: SIZES.sm,
    color: COLORS.darkGray,
    textAlign: 'right',
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  roleButton: {
    flexGrow: 1,
    minWidth: 120,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    backgroundColor: COLORS.gray,
  },
  roleButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleButtonText: {
    textAlign: 'center',
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: COLORS.white,
  },
  featureButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    marginBottom: SIZES.sm,
  },
  featureDisabled: {
    opacity: 0.45,
  },
  featureTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.darkGray,
  },
  featureSubtitle: {
    marginTop: SIZES.xs,
    color: COLORS.gray,
    textAlign: 'right',
  },
  logoutButton: {
    marginTop: SIZES.md,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    padding: SIZES.md,
  },
  logoutText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '700',
  },
});

export default DemoDashboardScreen;
