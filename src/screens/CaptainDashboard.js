import React, { useContext, useEffect } from 'react';
import { ScrollView, Text } from 'react-native';
import { DashboardContext } from '../contexts/DashboardContext';
import DashboardStats from '../components/DashboardStats';
import DashboardChart from '../components/DashboardChart';
import DashboardTable from '../components/DashboardTable';

const CaptainDashboard = () => {
  const { dashboardData, loadDashboard } = useContext(DashboardContext);

  useEffect(() => {
    loadDashboard('captain');
  }, [loadDashboard]);

  const rows = [
    { label: 'أكثر المناطق نشاطاً', value: 'الكرادة' },
    { label: 'أفضل أوقات العمل', value: '6:00 PM - 10:00 PM' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5', padding: 12 }}>
      <Text style={{ fontWeight: '700', fontSize: 20, marginBottom: 10, textAlign: 'right' }}>لوحة الكابتن</Text>
      <DashboardStats stats={dashboardData?.metrics} />
      <DashboardChart title="الدخل اليومي" series={dashboardData?.earningsSeries || []} />
      <DashboardTable rows={rows} />
    </ScrollView>
  );
};

export default CaptainDashboard;
