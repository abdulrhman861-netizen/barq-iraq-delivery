import React, { useContext, useEffect } from 'react';
import { ScrollView, Text } from 'react-native';
import { DashboardContext } from '../contexts/DashboardContext';
import DashboardStats from '../components/DashboardStats';
import DashboardChart from '../components/DashboardChart';
import DashboardReport from '../components/DashboardReport';

const AdminDashboard = () => {
  const { dashboardData, loadDashboard } = useContext(DashboardContext);

  useEffect(() => {
    loadDashboard('admin');
  }, [loadDashboard]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5', padding: 12 }}>
      <Text style={{ fontWeight: '700', fontSize: 20, marginBottom: 10, textAlign: 'right' }}>لوحة الإدارة</Text>
      <DashboardStats stats={dashboardData?.metrics} />
      <DashboardChart title="حالة النظام" series={dashboardData?.systemSeries || []} />
      <DashboardReport title="تقرير الإدارة" description="متابعة المستخدمين والطلبات والمدفوعات المعلقة." />
    </ScrollView>
  );
};

export default AdminDashboard;
