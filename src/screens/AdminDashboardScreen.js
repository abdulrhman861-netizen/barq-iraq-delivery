import React, { useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { DashboardContext } from '../contexts/DashboardContext';
import DashboardStatCard from '../components/DashboardStatCard';
import DashboardChart from '../components/DashboardChart';
import { DASHBOARD_ROLES } from '../constants/dashboard';
import { COLORS, FONT_SIZES, SIZES } from '../constants';

const AdminDashboardScreen = () => {
  const { dashboardData, isLoading, loadDashboard } = useContext(DashboardContext);

  useEffect(() => {
    loadDashboard({ role: DASHBOARD_ROLES.ADMIN });
  }, [loadDashboard]);

  if (isLoading && !dashboardData) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const stats = dashboardData?.stats || {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>لوحة الإدارة</Text>
        <View style={styles.row}>
          <DashboardStatCard title="المستخدمون" value={stats.usersCount || 0} icon="👥" />
          <DashboardStatCard title="الإيرادات" value={stats.totalRevenue || 0} icon="💰" />
        </View>
        <View style={styles.row}>
          <DashboardStatCard title="العمولات" value={stats.totalCommissions || 0} icon="🏦" />
          <DashboardStatCard title="الطلبات المكتملة" value={stats.completed || 0} icon="📦" />
        </View>
        <DashboardChart title="إيرادات النظام" data={dashboardData?.charts?.revenue || []} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: SIZES.md },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.primary, marginBottom: SIZES.md },
  row: { flexDirection: 'row', gap: SIZES.sm },
});

export default AdminDashboardScreen;
