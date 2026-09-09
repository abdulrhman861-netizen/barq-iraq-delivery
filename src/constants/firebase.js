// إعدادات Firebase
// تجديد هذه البيانات من Firebase Console الخاصة بك

export const FIREBASE_CONFIG = {
  // استبدل هذه القيم ببيانات Firebase الخاصة بك
  apiKey: process.env.FIREBASE_API_KEY || 'YOUR_FIREBASE_API_KEY',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'your_project.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'your_project_id',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'your_project.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'your_sender_id',
  appId: process.env.FIREBASE_APP_ID || 'your_app_id',
  databaseURL: process.env.FIREBASE_DB_URL || 'https://your_database_name.firebasedatabase.app',
};

// مسارات قاعدة البيانات
export const FIREBASE_PATHS = {
  USERS: 'users',
  ORDERS: 'orders',
  CHATS: 'chats',
  MESSAGES: 'messages',
  RATINGS: 'ratings',
  NOTIFICATIONS: 'notifications',
  CAPTAINS: 'captains',
  PAYMENTS: 'payments',
  ADMIN_STAFF: 'admin_staff',
  TRANSACTIONS: 'transactions',
  SUPPORT_TICKETS: 'support_tickets',
};
