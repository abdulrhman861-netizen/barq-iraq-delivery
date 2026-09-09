// ثوابت التطبيق الأساسية

// 🎨 الألوان
export const COLORS = {
  primary: '#FF6B35',      // البرتقالي الأساسي
  secondary: '#004E89',    // الأزرق الداكن
  accent: '#1FBF83',       // الأخضر
  danger: '#E63946',       // الأحمر
  warning: '#F77F00',      // البرتقالي الفاتح
  success: '#06A77D',      // الأخضر الداكن
  white: '#FFFFFF',
  black: '#000000',
  gray: '#F5F5F5',
  darkGray: '#333333',
  lightGray: '#EEEEEE',
  border: '#CCCCCC',
};

// 📱 أحجام الخطوط
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  huge: 32,
};

// 🎲 الحجم والفراغات
export const SIZES = {
  xs: 4,
  sm: 8,
  base: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

// 👥 أدوار المستخدمين
export const USER_ROLES = {
  MERCHANT: 'merchant',
  CAPTAIN: 'captain',
  CUSTOMER: 'customer',
  ADMIN_MANAGER: 'admin_manager',
  ADMIN_ACCOUNTANT: 'admin_accountant',
  ADMIN_FOLLOWUP: 'admin_followup',
};

// 📦 حالات الطلبات
export const ORDER_STATUS = {
  PENDING: 'pending',              // قيد الانتظار
  ACCEPTED: 'accepted',            // مقبول من الكابتن
  IN_TRANSIT: 'in_transit',        // قيد التوصيل
  DELIVERED: 'delivered',          // تم التسليم
  CANCELLED: 'cancelled',          // ملغي
  FAILED: 'failed',                // فشل
};

// 💳 طرق الدفع
export const PAYMENT_METHODS = {
  CASH: 'cash',                    // دفع نقدي
  WALLET: 'wallet',                // محفظة
  CARD: 'card',                    // بطاقة
  BANK_TRANSFER: 'bank_transfer',  // تحويل بنكي
};

// 📊 حالات الكابتن
export const CAPTAIN_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  BUSY: 'busy',
  ON_DELIVERY: 'on_delivery',
};

// 🌍 حالات التوفر
export const AVAILABILITY_STATUS = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
  BUSY: 'busy',
};

// 📍 أنواع الإشعارات
export const NOTIFICATION_TYPES = {
  ORDER_CREATED: 'order_created',
  ORDER_ACCEPTED: 'order_accepted',
  ORDER_DELIVERED: 'order_delivered',
  CHAT_MESSAGE: 'chat_message',
  RATING_RECEIVED: 'rating_received',
  PAYMENT_RECEIVED: 'payment_received',
  SYSTEM_ALERT: 'system_alert',
};

// ⏱️ المهلات الزمنية (بالثواني)
export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
  VERY_LONG: 60000,
};

// 📊 حجم الحزمة
export const PACKAGE_SIZES = {
  SMALL: 'small',       // صغير
  MEDIUM: 'medium',     // متوسط
  LARGE: 'large',       // كبير
  EXTRA_LARGE: 'extra_large', // كبير جداً
};

// 🚗 أنواع المركبات
export const VEHICLE_TYPES = {
  MOTORCYCLE: 'motorcycle',   // دراجة نارية
  BICYCLE: 'bicycle',         // دراجة
  CAR: 'car',                 // سيارة
  TRUCK: 'truck',             // شاحنة
};

// 💰 حدود الرسوم
export const FEE_LIMITS = {
  MIN_DELIVERY_FEE: 2000,     // الحد الأدنى للأجرة
  MAX_DELIVERY_FEE: 50000,    // الحد الأقصى للأجرة
  CAPTAIN_PERCENTAGE: 0.8,    // نسبة الكابتن
  ADMIN_PERCENTAGE: 0.2,      // نسبة الإدارة
};

// 🗺️ إحداثيات المدينة الافتراضية (بغداد)
export const DEFAULT_LOCATION = {
  lat: 33.3157,
  lng: 44.3661,
  name: 'بغداد',
};

// ⭐ نظام التقييم
export const RATING_SYSTEM = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  DEFAULT_RATING: 0,
};

// 🔐 معايير الأمان
export const SECURITY = {
  PIN_LENGTH: 4,
  PASSWORD_MIN_LENGTH: 6,
  PHONE_REGEX: /^\d{10,15}$/,
  OTP_LENGTH: 4,
};

// 📝 رسائل خطأ شائعة
export const ERROR_MESSAGES = {
  INVALID_PHONE: 'رقم الهاتف غير صحيح',
  INVALID_PASSWORD: 'كلمة المرور قصيرة جداً',
  INVALID_EMAIL: 'البريد الإلكتروني غير صحيح',
  USER_NOT_FOUND: 'المستخدم غير موجود',
  WRONG_PASSWORD: 'كلمة المرور غير صحيحة',
  USER_ALREADY_EXISTS: 'المستخدم موجود بالفعل',
  NETWORK_ERROR: 'خطأ في الاتصال بالإنترنت',
  FIREBASE_ERROR: 'خطأ في قاعدة البيانات',
  LOCATION_ERROR: 'تعذر الحصول على الموقع',
  PERMISSION_DENIED: 'تم رفض الصلاحية',
};

// ✅ رسائل النجاح
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'تم تسجيل الدخول بنجاح',
  REGISTER_SUCCESS: 'تم إنشاء الحساب بنجاح',
  ORDER_CREATED: 'تم إنشاء الطلب بنجاح',
  ORDER_UPDATED: 'تم تحديث الطلب بنجاح',
  PROFILE_UPDATED: 'تم تحديث الملف الشخصي بنجاح',
  PAYMENT_SUCCESS: 'تم الدفع بنجاح',
};
