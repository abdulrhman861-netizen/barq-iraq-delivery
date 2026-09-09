export const mockUsers = [
  {
    id: 'customer_001',
    role: 'customer',
    name: 'عميل تجريبي',
    phone: '07700000001',
    email: 'customer@test.barq',
    walletBalance: 25000,
  },
  {
    id: 'merchant_001',
    role: 'merchant',
    name: 'تاجر تجريبي',
    phone: '07700000002',
    email: 'merchant@test.barq',
    walletBalance: 100000,
  },
  {
    id: 'captain_001',
    role: 'captain',
    name: 'كابتن تجريبي',
    phone: '07700000003',
    email: 'captain@test.barq',
    walletBalance: 50000,
  },
  {
    id: 'admin_001',
    role: 'admin',
    name: 'مدير تجريبي',
    phone: '07700000004',
    email: 'admin@test.barq',
    walletBalance: 0,
  },
];

export const mockProducts = [
  { id: 'product_001', merchantId: 'merchant_001', name: 'برجر', price: 9000 },
  { id: 'product_002', merchantId: 'merchant_001', name: 'بيتزا', price: 12000 },
  { id: 'product_003', merchantId: 'merchant_001', name: 'شاورما', price: 8000 },
  { id: 'product_004', merchantId: 'merchant_001', name: 'عصير طبيعي', price: 3000 },
  { id: 'product_005', merchantId: 'merchant_001', name: 'حلويات', price: 5000 },
];

export const mockAreas = [
  { id: 'area_001', name: 'الكرادة', city: 'بغداد' },
  { id: 'area_002', name: 'المنصور', city: 'بغداد' },
  { id: 'area_003', name: 'الأعظمية', city: 'بغداد' },
];

export const mockOrders = [
  { id: 'order_001', status: 'pending', customerId: 'customer_001', merchantId: 'merchant_001', total: 18000 },
  { id: 'order_002', status: 'processing', customerId: 'customer_001', merchantId: 'merchant_001', total: 21000 },
  { id: 'order_003', status: 'completed', customerId: 'customer_001', merchantId: 'merchant_001', captainId: 'captain_001', total: 15000 },
  { id: 'order_004', status: 'cancelled', customerId: 'customer_001', merchantId: 'merchant_001', total: 9000 },
  { id: 'order_005', status: 'pending', customerId: 'customer_001', merchantId: 'merchant_001', total: 12000 },
  { id: 'order_006', status: 'processing', customerId: 'customer_001', merchantId: 'merchant_001', captainId: 'captain_001', total: 16000 },
  { id: 'order_007', status: 'completed', customerId: 'customer_001', merchantId: 'merchant_001', captainId: 'captain_001', total: 19000 },
  { id: 'order_008', status: 'completed', customerId: 'customer_001', merchantId: 'merchant_001', captainId: 'captain_001', total: 14500 },
  { id: 'order_009', status: 'cancelled', customerId: 'customer_001', merchantId: 'merchant_001', total: 11000 },
  { id: 'order_010', status: 'pending', customerId: 'customer_001', merchantId: 'merchant_001', total: 23000 },
];

export const mockPayments = [
  { id: 'payment_001', orderId: 'order_001', method: 'cod', status: 'pending', amount: 18000 },
  { id: 'payment_002', orderId: 'order_002', method: 'card', status: 'authorized', amount: 21000 },
  { id: 'payment_003', orderId: 'order_003', method: 'wallet', status: 'captured', amount: 15000 },
  { id: 'payment_004', orderId: 'order_004', method: 'cod', status: 'cancelled', amount: 9000 },
  { id: 'payment_005', orderId: 'order_006', method: 'card', status: 'captured', amount: 16000 },
];

export const mockRatings = [
  { id: 'rating_001', orderId: 'order_003', score: 5, comment: 'خدمة ممتازة', fromUserId: 'customer_001', toUserId: 'captain_001' },
  { id: 'rating_002', orderId: 'order_007', score: 4, comment: 'التوصيل كان جيد', fromUserId: 'customer_001', toUserId: 'merchant_001' },
  { id: 'rating_003', orderId: 'order_008', score: 5, comment: 'تجربة رائعة', fromUserId: 'customer_001', toUserId: 'captain_001' },
];

export const mockMessages = [
  { id: 'message_001', chatId: 'chat_001', senderId: 'customer_001', receiverId: 'captain_001', text: 'وصلت الطلبية؟', createdAt: '2026-01-01T12:00:00.000Z' },
  { id: 'message_002', chatId: 'chat_001', senderId: 'captain_001', receiverId: 'customer_001', text: 'باقي 5 دقائق', createdAt: '2026-01-01T12:01:00.000Z' },
  { id: 'message_003', chatId: 'chat_002', senderId: 'merchant_001', receiverId: 'customer_001', text: 'تم تجهيز الطلب', createdAt: '2026-01-01T12:02:00.000Z' },
];

export default {
  users: mockUsers,
  products: mockProducts,
  areas: mockAreas,
  orders: mockOrders,
  payments: mockPayments,
  ratings: mockRatings,
  messages: mockMessages,
};
