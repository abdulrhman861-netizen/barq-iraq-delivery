import { FIREBASE_PATHS } from '../constants/firebase';
import { DASHBOARD_DEFAULTS, DASHBOARD_ORDER_STATES, DASHBOARD_PERIODS, DASHBOARD_ROLES } from '../constants/dashboard';
import { readData } from './firebase';

const toArray = (data) => (data ? Object.keys(data).map((id) => ({ id, ...data[id] })) : []);

const asDate = (value) => new Date(value || Date.now());

const inPeriod = (item, period) => {
  const date = asDate(item.createdAt);
  const now = new Date();

  if (period === DASHBOARD_PERIODS.DAILY) {
    return date.toDateString() === now.toDateString();
  }

  if (period === DASHBOARD_PERIODS.YEARLY) {
    return date.getFullYear() === now.getFullYear();
  }

  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
};

const groupByDay = (items, amountKey = 'amount') => {
  const grouped = {};
  items.forEach((item) => {
    const key = asDate(item.createdAt).toISOString().slice(0, 10);
    grouped[key] = (grouped[key] || 0) + Number(item[amountKey] ?? item.totalAmount ?? item.itemPrice ?? 0);
  });

  return Object.keys(grouped)
    .sort()
    .slice(-DASHBOARD_DEFAULTS.CHART_LIMIT)
    .map((label) => ({ label, value: grouped[label] }));
};

const countByStatus = (orders) => ({
  new: orders.filter((order) => order.status === DASHBOARD_ORDER_STATES.NEW).length,
  processing: orders.filter((order) => order.status === DASHBOARD_ORDER_STATES.PROCESSING).length,
  completed: orders.filter((order) => order.status === DASHBOARD_ORDER_STATES.COMPLETED).length,
  rejected: orders.filter((order) => order.status === DASHBOARD_ORDER_STATES.REJECTED || order.status === 'failed').length,
});

const average = (items, key) => {
  if (!items.length) return 0;
  const total = items.reduce((sum, item) => sum + Number(item[key] || item.score || 0), 0);
  return Number((total / items.length).toFixed(2));
};

const buildTopProducts = (orders) => {
  const map = {};
  orders.forEach((order) => {
    const key = order.productName || order.productTitle || 'غير محدد';
    map[key] = (map[key] || 0) + 1;
  });

  return Object.keys(map)
    .map((name) => ({ name, salesCount: map[name] }))
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);
};

export const fetchMerchantDashboard = async (merchantId, period = DASHBOARD_PERIODS.MONTHLY) => {
  const [ordersRaw, ratingsRaw] = await Promise.all([
    readData(FIREBASE_PATHS.ORDERS),
    readData(FIREBASE_PATHS.RATINGS),
  ]);

  const orders = toArray(ordersRaw).filter((order) => order.merchantId === merchantId && inPeriod(order, period));
  const ratings = toArray(ratingsRaw).filter((rating) => rating.ratedUserId === merchantId && inPeriod(rating, period));

  const totalSales = orders.reduce((sum, order) => sum + Number(order.totalAmount ?? order.itemPrice ?? 0), 0);
  const totalCommissions = Number((totalSales * DASHBOARD_DEFAULTS.COMMISSION_RATE).toFixed(2));

  return {
    stats: {
      totalSales,
      totalCommissions,
      ...countByStatus(orders),
      averageRating: average(ratings, 'score'),
      totalReviews: ratings.length,
    },
    charts: {
      sales: groupByDay(orders, 'totalAmount'),
    },
    topProducts: buildTopProducts(orders),
    reports: orders.slice(0, DASHBOARD_DEFAULTS.REPORT_LIMIT),
  };
};

export const fetchCaptainDashboard = async (captainId, period = DASHBOARD_PERIODS.MONTHLY) => {
  const [ordersRaw, ratingsRaw] = await Promise.all([
    readData(FIREBASE_PATHS.ORDERS),
    readData(FIREBASE_PATHS.RATINGS),
  ]);

  const orders = toArray(ordersRaw).filter((order) => order.captainId === captainId && inPeriod(order, period));
  const ratings = toArray(ratingsRaw).filter((rating) => rating.ratedUserId === captainId && inPeriod(rating, period));

  const completedOrders = orders.filter((order) => order.status === DASHBOARD_ORDER_STATES.COMPLETED);
  const cancelledOrders = orders.filter((order) => order.status === DASHBOARD_ORDER_STATES.REJECTED);

  const earnings = completedOrders.reduce(
    (sum, order) => sum + Number(order.captainEarning ?? (order.deliveryFee || 0) * DASHBOARD_DEFAULTS.CAPTAIN_SHARE),
    0
  );
  const incentives = completedOrders.reduce((sum, order) => sum + Number(order.incentive || 0), 0);
  const distanceKm = completedOrders.reduce((sum, order) => sum + Number(order.distanceKm || 0), 0);

  return {
    stats: {
      earnings,
      incentives,
      completedOrders: completedOrders.length,
      cancelledOrders: cancelledOrders.length,
      averageRating: average(ratings, 'score'),
      distanceKm: Number(distanceKm.toFixed(2)),
    },
    charts: {
      income: groupByDay(completedOrders, 'captainEarning'),
    },
    goals: {
      weeklyTargetOrders: 30,
      currentOrders: completedOrders.length,
      availableIncentivePrograms: incentives > 0 ? 1 : 0,
    },
    reports: orders.slice(0, DASHBOARD_DEFAULTS.REPORT_LIMIT),
  };
};

export const fetchAdminDashboard = async (period = DASHBOARD_PERIODS.MONTHLY) => {
  const [ordersRaw, usersRaw] = await Promise.all([
    readData(FIREBASE_PATHS.ORDERS),
    readData(FIREBASE_PATHS.USERS),
  ]);

  const orders = toArray(ordersRaw).filter((order) => inPeriod(order, period));
  const users = toArray(usersRaw);

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount ?? order.itemPrice ?? 0), 0);
  const totalCommissions = Number((totalRevenue * DASHBOARD_DEFAULTS.COMMISSION_RATE).toFixed(2));

  return {
    stats: {
      usersCount: users.length,
      merchantsCount: users.filter((user) => user.role === DASHBOARD_ROLES.MERCHANT).length,
      captainsCount: users.filter((user) => user.role === DASHBOARD_ROLES.CAPTAIN).length,
      customersCount: users.filter((user) => user.role === 'customer').length,
      totalRevenue,
      totalCommissions,
      ...countByStatus(orders),
    },
    charts: {
      revenue: groupByDay(orders, 'totalAmount'),
    },
    alerts: orders.filter((order) => order.status === 'failed').slice(0, 10),
    reports: orders.slice(0, DASHBOARD_DEFAULTS.REPORT_LIMIT),
  };
};

export const fetchDashboardData = (role, userId, period = DASHBOARD_PERIODS.MONTHLY) => {
  if (role === DASHBOARD_ROLES.MERCHANT) {
    return fetchMerchantDashboard(userId, period);
  }

  if (role === DASHBOARD_ROLES.CAPTAIN) {
    return fetchCaptainDashboard(userId, period);
  }

  return fetchAdminDashboard(period);
};
