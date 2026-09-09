import React from 'react';
import { ScrollView, Text } from 'react-native';
import StatisticsCard from '../components/StatisticsCard';
import { calculateOrderStatistics } from '../services/statisticsService';

const mockOrders = [
  { status: 'delivered', totalAmount: 20000 },
  { status: 'cancelled', totalAmount: 12000 },
  { status: 'delivered', totalAmount: 35000 },
  { status: 'rejected', totalAmount: 9000 },
];

const StatisticsScreen = () => {
  const stats = calculateOrderStatistics(mockOrders);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5', padding: 12 }}>
      <Text style={{ fontWeight: '700', fontSize: 20, marginBottom: 10, textAlign: 'right' }}>إحصائيات المبيعات والطلبات</Text>
      <StatisticsCard title="إجمالي الطلبات" value={stats.total} />
      <StatisticsCard title="الطلبات المكتملة" value={stats.completed} />
      <StatisticsCard title="الطلبات الملغاة" value={stats.cancelled} />
      <StatisticsCard title="إجمالي المبيعات" value={stats.totalSales.toLocaleString('ar-IQ')} />
    </ScrollView>
  );
};

export default StatisticsScreen;
