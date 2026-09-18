import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, FONT_SIZES, SIZES } from '../../constants';
import {
  getFirebaseSetupState,
  subscribeUserProfile,
  upsertUserRole,
} from '../../services/firestoreWebDemo';
import ChatPanel from './ChatPanel';
import RatingsPanel from './RatingsPanel';
import CreateOrderPanel from './CreateOrderPanel';
import NotificationsPanel from './NotificationsPanel';
import FinancePanel from './FinancePanel';

const ROLE_LABELS = {
  captain: 'كابتن',
  merchant: 'تاجر',
  employee: 'موظف',
  admin: 'مدير',
};

const ROLES = Object.keys(ROLE_LABELS);

const NAV_ITEMS = [
  { id: 'dashboard', label: 'الرئيسية' },
  { id: 'chat', label: 'المحادثات' },
  { id: 'ratings', label: 'التقييمات' },
  { id: 'orders', label: 'الطلبات والتوصيل' },
  { id: 'notifications', label: 'الإشعارات' },
  { id: 'finance', label: 'المالية والمحافظ' },
];

const WebDemoDashboardScreen = ({ onLogout, currentUser }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState(currentUser?.role || 'merchant');
  const [profile, setProfile] = useState(null);
  const [setupState] = useState(getFirebaseSetupState());
  const isDemoUser = !currentUser?.uid;
  const resolvedRole = isDemoUser ? role : profile?.role || role;

  useEffect(() => {
    if (currentUser?.role && ROLES.includes(currentUser.role)) {
      setRole(currentUser.role);
    }
  }, [currentUser?.role]);

  const effectiveUser = useMemo(
    () => ({
      uid: currentUser?.uid || `demo-${role}-user`,
      displayName:
        currentUser?.displayName ||
        currentUser?.email ||
        profile?.displayName ||
        `مستخدم ${ROLE_LABELS[resolvedRole] || resolvedRole}`,
      role: resolvedRole,
    }),
    [
      currentUser?.displayName,
      currentUser?.email,
      currentUser?.uid,
      profile?.displayName,
      resolvedRole,
      role,
    ]
  );

  useEffect(() => {
    if (!setupState.isConfigured) return undefined;
    setProfile(null);

    if (isDemoUser) {
      upsertUserRole({
        uid: effectiveUser.uid,
        displayName: effectiveUser.displayName,
        role,
      }).catch(() => {});
    }

    return subscribeUserProfile(effectiveUser.uid, setProfile, () => {});
  }, [effectiveUser.displayName, effectiveUser.uid, isDemoUser, role, setupState.isConfigured]);

  const renderDashboardHome = () => (
    <View style={styles.dashboardGrid}>
      {NAV_ITEMS.filter((item) => item.id !== 'dashboard').map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.dashboardCard}
          onPress={() => setActiveTab(item.id)}
        >
          <Text style={styles.dashboardCardTitle}>{item.label}</Text>
          <Text style={styles.dashboardCardHint}>فتح</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTab = () => {
    const sharedProps = { currentUser: effectiveUser, setupState };

    switch (activeTab) {
      case 'chat':
        return <ChatPanel {...sharedProps} />;
      case 'ratings':
        return <RatingsPanel {...sharedProps} />;
      case 'orders':
        return <CreateOrderPanel {...sharedProps} />;
      case 'notifications':
        return <NotificationsPanel {...sharedProps} />;
      case 'finance':
        return <FinancePanel {...sharedProps} />;
      default:
        return renderDashboardHome();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>برق العراق</Text>
          <Text style={styles.subtitle}>
            المستخدم: {profile?.displayName || effectiveUser.displayName} ({ROLE_LABELS[resolvedRole] || resolvedRole})
          </Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>

      {!setupState.isConfigured && (
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>إعداد Firebase للويب مطلوب</Text>
          <Text style={styles.warningText}>
            أضف قيم EXPO_PUBLIC_FIREBASE_* الحقيقية داخل .env لتفعيل البيانات الفعلية، أو استخدم الوضع التجريبي للمعاينة فقط.
          </Text>
        </View>
      )}

      {isDemoUser && (
        <View style={styles.roleRow}>
          {ROLES.map((roleItem) => (
            <TouchableOpacity
              key={roleItem}
              onPress={() => setRole(roleItem)}
              style={[styles.roleButton, roleItem === role && styles.roleButtonActive]}
            >
              <Text style={[styles.roleText, roleItem === role && styles.roleTextActive]}>
                {ROLE_LABELS[roleItem]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView horizontal style={styles.navScroll} showsHorizontalScrollIndicator={false}>
        <View style={styles.navRow}>
          {NAV_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.navButton, item.id === activeTab && styles.navButtonActive]}
              onPress={() => setActiveTab(item.id)}
            >
              <Text style={[styles.navText, item.id === activeTab && styles.navTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.content}>{renderTab()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray, direction: 'rtl' },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: COLORS.white, fontSize: FONT_SIZES.xxl, fontWeight: '700', textAlign: 'right' },
  subtitle: { color: COLORS.white, fontSize: FONT_SIZES.sm, marginTop: SIZES.xs, textAlign: 'right' },
  logoutButton: { backgroundColor: COLORS.white, paddingHorizontal: SIZES.md, paddingVertical: SIZES.sm, borderRadius: 8 },
  logoutText: { color: COLORS.primary, fontWeight: '700' },
  warningBox: {
    margin: SIZES.md,
    padding: SIZES.md,
    borderRadius: 8,
    backgroundColor: '#FFF4E5',
    borderWidth: 1,
    borderColor: '#F2C078',
  },
  warningTitle: { color: '#9A5A00', fontWeight: '700', marginBottom: SIZES.xs, textAlign: 'right' },
  warningText: { color: '#9A5A00', fontSize: FONT_SIZES.sm, textAlign: 'right' },
  roleRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: SIZES.sm,
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.sm,
  },
  roleButton: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleButtonActive: { backgroundColor: COLORS.secondary, borderColor: COLORS.secondary },
  roleText: { color: COLORS.darkGray, fontWeight: '600' },
  roleTextActive: { color: COLORS.white },
  navScroll: { maxHeight: 48, paddingRight: SIZES.md },
  navRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: SIZES.sm, paddingLeft: SIZES.md },
  navButton: { backgroundColor: COLORS.white, paddingHorizontal: SIZES.md, paddingVertical: SIZES.sm, borderRadius: 18 },
  navButtonActive: { backgroundColor: COLORS.primary },
  navText: { color: COLORS.darkGray, fontSize: FONT_SIZES.sm, fontWeight: '600' },
  navTextActive: { color: COLORS.white },
  content: { flex: 1, padding: SIZES.md, direction: 'rtl' },
  dashboardGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: SIZES.md },
  dashboardCard: {
    backgroundColor: COLORS.white,
    width: '48%',
    borderRadius: 10,
    padding: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dashboardCardTitle: { color: COLORS.darkGray, fontWeight: '700', textAlign: 'right' },
  dashboardCardHint: { color: COLORS.darkGray, marginTop: SIZES.sm, textAlign: 'right' },
});

export default WebDemoDashboardScreen;
