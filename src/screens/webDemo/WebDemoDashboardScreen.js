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

const ROLES = ['captain', 'merchant', 'employee', 'admin'];

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'chat', label: 'Chat' },
  { id: 'ratings', label: 'Ratings' },
  { id: 'orders', label: 'Create Order' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'finance', label: 'Finance & Wallets' },
];

const WebDemoDashboardScreen = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState('merchant');
  const [profile, setProfile] = useState(null);
  const [setupState] = useState(getFirebaseSetupState());

  const demoUser = useMemo(
    () => ({
      uid: `demo-${role}-user`,
      displayName: `Demo ${role}`,
      role,
    }),
    [role]
  );

  useEffect(() => {
    if (!setupState.isConfigured) return undefined;

    upsertUserRole({
      uid: demoUser.uid,
      displayName: demoUser.displayName,
      role,
    }).catch(() => {});

    return subscribeUserProfile(demoUser.uid, setProfile, () => {});
  }, [demoUser.displayName, demoUser.uid, role, setupState.isConfigured]);

  const renderDashboardHome = () => (
    <View style={styles.dashboardGrid}>
      {NAV_ITEMS.filter((item) => item.id !== 'dashboard').map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.dashboardCard}
          onPress={() => setActiveTab(item.id)}
        >
          <Text style={styles.dashboardCardTitle}>{item.label}</Text>
          <Text style={styles.dashboardCardHint}>Open</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTab = () => {
    const sharedProps = { currentUser: demoUser, setupState };

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
          <Text style={styles.title}>Barq Web Demo</Text>
          <Text style={styles.subtitle}>
            User: {profile?.displayName || demoUser.displayName} ({role})
          </Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {!setupState.isConfigured && (
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>Firebase Web setup required</Text>
          <Text style={styles.warningText}>
            Fill FIREBASE_* values in .env. Keep placeholders only for UI preview mode.
          </Text>
        </View>
      )}

      <View style={styles.roleRow}>
        {ROLES.map((roleItem) => (
          <TouchableOpacity
            key={roleItem}
            onPress={() => setRole(roleItem)}
            style={[styles.roleButton, roleItem === role && styles.roleButtonActive]}
          >
            <Text style={[styles.roleText, roleItem === role && styles.roleTextActive]}>{roleItem}</Text>
          </TouchableOpacity>
        ))}
      </View>

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
  container: { flex: 1, backgroundColor: COLORS.gray },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: COLORS.white, fontSize: FONT_SIZES.xxl, fontWeight: '700' },
  subtitle: { color: COLORS.white, fontSize: FONT_SIZES.sm, marginTop: SIZES.xs },
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
  warningTitle: { color: '#9A5A00', fontWeight: '700', marginBottom: SIZES.xs },
  warningText: { color: '#9A5A00', fontSize: FONT_SIZES.sm },
  roleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SIZES.sm, paddingHorizontal: SIZES.md, marginBottom: SIZES.sm },
  roleButton: { backgroundColor: COLORS.white, borderRadius: 8, paddingVertical: SIZES.sm, paddingHorizontal: SIZES.md, borderWidth: 1, borderColor: COLORS.border },
  roleButtonActive: { backgroundColor: COLORS.secondary, borderColor: COLORS.secondary },
  roleText: { color: COLORS.darkGray, fontWeight: '600' },
  roleTextActive: { color: COLORS.white },
  navScroll: { maxHeight: 48, paddingLeft: SIZES.md },
  navRow: { flexDirection: 'row', alignItems: 'center', gap: SIZES.sm, paddingRight: SIZES.md },
  navButton: { backgroundColor: COLORS.white, paddingHorizontal: SIZES.md, paddingVertical: SIZES.sm, borderRadius: 18 },
  navButtonActive: { backgroundColor: COLORS.primary },
  navText: { color: COLORS.darkGray, fontSize: FONT_SIZES.sm, fontWeight: '600' },
  navTextActive: { color: COLORS.white },
  content: { flex: 1, padding: SIZES.md },
  dashboardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SIZES.md },
  dashboardCard: {
    backgroundColor: COLORS.white,
    width: '48%',
    borderRadius: 10,
    padding: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dashboardCardTitle: { color: COLORS.darkGray, fontWeight: '700' },
  dashboardCardHint: { color: COLORS.gray, marginTop: SIZES.sm },
});

export default WebDemoDashboardScreen;
