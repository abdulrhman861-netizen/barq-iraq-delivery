export const calculateOrderStatistics = (orders = []) => {
  const total = orders.length;
  const completed = orders.filter((order) => order.status === 'delivered').length;
  const cancelled = orders.filter((order) => order.status === 'cancelled').length;
  const rejected = orders.filter((order) => order.status === 'rejected').length;
  const sales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  return {
    total,
    completed,
    cancelled,
    rejected,
    totalSales: sales,
    averageSale: total ? sales / total : 0,
    maxSale: orders.reduce((max, order) => Math.max(max, order.totalAmount || 0), 0),
  };
};
