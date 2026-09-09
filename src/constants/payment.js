// ثوابت نظام الدفع

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
};

export const PAYMENT_METHODS = {
  CASH: 'cash', // الدفع عند الاستلام
  CARD: 'card', // بطاقة ائتمان/خصم
  WALLET: 'wallet', // المحفظة الرقمية
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
  TELEBIRR: 'telebirr',
};

export const PAYMENT_ERRORS = {
  INSUFFICIENT_BALANCE: 'رصيد المحفظة غير كافي',
  INVALID_CARD: 'بيانات البطاقة غير صحيحة',
  EXPIRED_CARD: 'البطاقة منتهية الصلاحية',
  INVALID_CVV: 'رمز CVV غير صحيح',
  PAYMENT_DECLINED: 'تم رفض المعاملة',
  FRAUD_DETECTED: 'تم اكتشاف نشاط غريب',
  GATEWAY_ERROR: 'خطأ في بوابة الدفع',
  TIMEOUT: 'انتهت مهلة انتظار المعاملة',
};

export const TRANSACTION_TYPES = {
  PAYMENT: 'payment', // دفع
  TRANSFER: 'transfer', // تحويل
  REFUND: 'refund', // استرجاع
  WITHDRAWAL: 'withdrawal', // سحب أموال
  TOP_UP: 'top_up', // شحن المحفظة
};

export const CURRENCY = {
  IQD: 'IQD', // الدينار العراقي
  USD: 'USD',
  EUR: 'EUR',
};

export const PAYMENT_LIMITS = {
  MIN_TRANSACTION: 1000, // 1000 دينار
  MAX_TRANSACTION: 10000000, // 10 مليون دينار
  DAILY_LIMIT: 100000000, // 100 مليون دينار يومياً
  MAX_WALLET_BALANCE: 500000000, // 500 مليون دينار كحد أقصى للمحفظة
};

export const FEES = {
  TRANSFER_FEE_PERCENT: 1.5, // 1.5% رسوم التحويل
  WITHDRAWAL_FEE: 5000, // 5000 دينار رسوم السحب
  TOPUP_FEE_PERCENT: 2, // 2% رسوم شحن المحفظة
};

export const PAYMENT_TIMEOUT = 300000; // 5 دقائق

export const RETRY_ATTEMPTS = 3;

export const PAYMENT_NOTIFICATION_TYPES = {
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  TRANSFER_RECEIVED: 'transfer_received',
  WALLET_LOW_BALANCE: 'wallet_low_balance',
  REFUND_PROCESSED: 'refund_processed',
};
