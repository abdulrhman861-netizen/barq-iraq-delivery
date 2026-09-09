import React, { useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { DashboardContext } from '../contexts/DashboardContext';
import { AuthContext } from '../contexts/AuthContext';
import DashboardStatCard from '../components/DashboardStatCard';
import DashboardChart from '../components/DashboardChart';
import { DASHBOARD_ROLES } from '../constants/dashboard';
import { COLORS, FONT_SIZES, SIZES } from '../constants';

const MerchantDashboardScreen = ({ route }) => {
  const { user } = useContext(AuthContext);
  const merchantId = route?.params?.merchantId || user?.id;
  const { dashboardData, isLoading, loadDashboard } = useContext(DashboardContext);

  useEffect(() => {
    if (merchantId) {
      loadDashboard({ role: DASHBOARD_ROLES.MERCHANT, userId: merchantId });
    }
  }, [loadDashboard, merchantId]);

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
        <Text style={styles.title}>لوحة التاجر</Text>
        <View style={styles.row}>
          <DashboardStatCard title="المبيعات" value={stats.totalSales || 0} icon="💰" />
          <DashboardStatCard title="العمولات" value={stats.totalCommissions || 0} icon="🏦" />
        </View>
        <View style={styles.row}>
          <DashboardStatCard title="مكتملة" value={stats.completed || 0} icon="✅" />
          <DashboardStatCard title="متوسط التقييم" value={stats.averageRating || 0} icon="⭐" />
        </View>
        <DashboardChart title="أداء المبيعات" data={dashboardData?.charts?.sales || []} />
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

export default MerchantDashboardScreen;
