import React, { useContext, useEffect } from 'react';
import { ScrollView, Text } from 'react-native';
import { DashboardContext } from '../contexts/DashboardContext';
import DashboardStats from '../components/DashboardStats';
import DashboardChart from '../components/DashboardChart';
import DashboardReport from '../components/DashboardReport';

const MerchantDashboard = () => {
  const { dashboardData, loadDashboard } = useContext(DashboardContext);

  useEffect(() => {
    loadDashboard('merchant');
  }, [loadDashboard]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5', padding: 12 }}>
      <Text style={{ fontWeight: '700', fontSize: 20, marginBottom: 10, textAlign: 'right' }}>لوحة التاجر</Text>
      <DashboardStats stats={dashboardData?.metrics} />
      <DashboardChart title="مبيعات بمرور الوقت" series={dashboardData?.salesSeries || []} />
      <DashboardReport title="تقرير المبيعات" description="ملخص يومي/شهري وسنوي للأرباح والعمولات." />
    </ScrollView>
  );
};

export default MerchantDashboard;
