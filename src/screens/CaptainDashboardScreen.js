import React, { useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { DashboardContext } from '../contexts/DashboardContext';
import { AuthContext } from '../contexts/AuthContext';
import DashboardStatCard from '../components/DashboardStatCard';
import DashboardChart from '../components/DashboardChart';
import { DASHBOARD_ROLES } from '../constants/dashboard';
import { COLORS, FONT_SIZES, SIZES } from '../constants';

const CaptainDashboardScreen = ({ route }) => {
  const { user } = useContext(AuthContext);
  const captainId = route?.params?.captainId || user?.id;
  const { dashboardData, isLoading, loadDashboard } = useContext(DashboardContext);

  useEffect(() => {
    if (captainId) {
      loadDashboard({ role: DASHBOARD_ROLES.CAPTAIN, userId: captainId });
    }
  }, [captainId, loadDashboard]);

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
        <Text style={styles.title}>لوحة الكابتن</Text>
        <View style={styles.row}>
          <DashboardStatCard title="الأرباح" value={stats.earnings || 0} icon="💵" />
          <DashboardStatCard title="الحوافز" value={stats.incentives || 0} icon="🎯" />
        </View>
        <View style={styles.row}>
          <DashboardStatCard title="طلبات مكتملة" value={stats.completedOrders || 0} icon="📦" />
          <DashboardStatCard title="المسافة (كم)" value={stats.distanceKm || 0} icon="🗺️" />
        </View>
        <DashboardChart title="تحليل الدخل" data={dashboardData?.charts?.income || []} />
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

export default CaptainDashboardScreen;
