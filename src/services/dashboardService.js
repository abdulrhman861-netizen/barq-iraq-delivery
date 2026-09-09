import { DASHBOARD_DEFAULT_METRICS } from '../constants/dashboard';

const buildSeries = (seed) => [
  { label: '1', value: seed * 1 },
  { label: '2', value: seed * 1.2 },
  { label: '3', value: seed * 1.4 },
  { label: '4', value: seed * 1.1 },
];

export const getMerchantDashboardData = async () => ({
  metrics: {
    ...DASHBOARD_DEFAULT_METRICS,
    totalSales: 1250000,
    totalProfit: 210000,
    activeOrders: 38,
    completedOrders: 620,
    growthRate: 12.5,
  },
  salesSeries: buildSeries(100000),
});

export const getCaptainDashboardData = async () => ({
  metrics: {
    totalIncome: 540000,
    incentives: 45000,
    availableBalance: 210000,
    completedOrders: 184,
    cancellationRate: 3.2,
    responseRate: 96,
  },
  earningsSeries: buildSeries(45000),
});

export const getAdminDashboardData = async () => ({
  metrics: {
    usersCount: 5300,
    totalRevenue: 18450000,
    systemGrowth: 18.3,
    pendingPayments: 24,
    totalOrders: 21340,
    completionRate: 92,
  },
  systemSeries: buildSeries(1800000),
});
