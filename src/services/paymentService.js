// خدمة الدفع الآمنة
import { writeData, readData, updateData, deleteData, listenToData } from './firebase';
import { encryptData, decryptData, hashSensitiveData } from '../utils/security';
import { FIREBASE_PATHS, PAYMENT_STATUS, PAYMENT_METHODS } from '../constants/index';

const PAYMENT_DB_PATH = 'payments';
const WALLETS_DB_PATH = 'wallets';
const TRANSACTIONS_DB_PATH = 'transactions';
const PAYMENT_METHODS_DB_PATH = 'paymentMethods';

// =================== محفظة المستخدم ===================

/**
 * الحصول على رصيد المحفظة
 * @param {string} userId - معرف المستخدم
 * @returns {Promise<number>}
 */
export const getWalletBalance = async (userId) => {
  try {
    const walletData = await readData(`${WALLETS_DB_PATH}/${userId}`);
    return walletData?.balance || 0;
  } catch (error) {
    console.error('❌ Error getting wallet balance:', error);
    throw error;
  }
};

/**
 * إنشاء محفظة جديدة للمستخدم
 * @param {string} userId - معرف المستخدم
 * @returns {Promise}
 */
export const createWallet = async (userId) => {
  try {
    const walletData = {
      userId,
      balance: 0,
      currency: 'IQD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalSpent: 0,
      totalEarned: 0,
      transactionCount: 0,
    };

    await writeData(`${WALLETS_DB_PATH}/${userId}`, walletData);
    console.log('✅ Wallet created for user:', userId);
    return walletData;
  } catch (error) {
    console.error('❌ Error creating wallet:', error);
    throw error;
  }
};

/**
 * تحديث رصيد المحفظة
 * @param {string} userId - معرف المستخدم
 * @param {number} amount - المبلغ
 * @param {string} type - نوع التحديث (add/subtract)
 * @returns {Promise}
 */
export const updateWalletBalance = async (userId, amount, type = 'add') => {
  try {
    const currentBalance = await getWalletBalance(userId);
    const newBalance = type === 'add' ? currentBalance + amount : currentBalance - amount;

    if (newBalance < 0) {
      throw new Error('رصيد المحفظة غير كافي');
    }

    await updateData(`${WALLETS_DB_PATH}/${userId}`, {
      balance: newBalance,
      updatedAt: new Date().toISOString(),
      totalSpent: type === 'subtract' ? (await readData(`${WALLETS_DB_PATH}/${userId}/totalSpent`) || 0) + amount : undefined,
      totalEarned: type === 'add' ? (await readData(`${WALLETS_DB_PATH}/${userId}/totalEarned`) || 0) + amount : undefined,
    });

    console.log(`✅ Wallet balance updated: ${newBalance} IQD`);
    return newBalance;
  } catch (error) {
    console.error('❌ Error updating wallet balance:', error);
    throw error;
  }
};

/**
 * تحويل أموال بين مستخدمين
 * @param {string} fromUserId - معرف المرسل
 * @param {string} toUserId - معرف المستقبل
 * @param {number} amount - المبلغ
 * @param {string} description - الوصف
 * @returns {Promise}
 */
export const transferBalance = async (fromUserId, toUserId, amount, description = '') => {
  try {
    const transactionId = Date.now().toString();

    // تحقق من الرصيد
    const fromBalance = await getWalletBalance(fromUserId);
    if (fromBalance < amount) {
      throw new Error('رصيد غير كافي للتحويل');
    }

    // تنفيذ التحويل
    await updateWalletBalance(fromUserId, amount, 'subtract');
    await updateWalletBalance(toUserId, amount, 'add');

    // تسجيل العملية
    const transaction = {
      id: transactionId,
      type: 'transfer',
      fromUserId,
      toUserId,
      amount,
      description,
      status: PAYMENT_STATUS.COMPLETED,
      timestamp: new Date().toISOString(),
    };

    await writeData(`${TRANSACTIONS_DB_PATH}/${transactionId}`, transaction);
    console.log('✅ Transfer completed:', transactionId);
    return transaction;
  } catch (error) {
    console.error('❌ Error transferring balance:', error);
    throw error;
  }
};

// =================== طرق الدفع ===================

/**
 * حفظ طريقة دفع جديدة (بشكل آمن - بدون تخزين البيانات الحساسة كاملة)
 * @param {string} userId - معرف المستخدم
 * @param {object} paymentMethodData - بيانات طريقة الدفع
 * @returns {Promise}
 */
export const savePaymentMethod = async (userId, paymentMethodData) => {
  try {
    const paymentMethodId = Date.now().toString();
    const { cardNumber, cvv, ...safeData } = paymentMethodData;

    // حفظ آخر 4 أرقام فقط وتشفير البيانات الحساسة
    const lastFourDigits = cardNumber?.slice(-4) || '';
    const encryptedToken = encryptData(cardNumber);

    const securePaymentMethod = {
      id: paymentMethodId,
      userId,
      ...safeData,
      lastFourDigits,
      encryptedToken, // ✅ مشفر فقط، بدون الرقم الكامل
      isDefault: false,
      createdAt: new Date().toISOString(),
    };

    await writeData(`${PAYMENT_METHODS_DB_PATH}/${userId}/${paymentMethodId}`, securePaymentMethod);
    console.log('✅ Payment method saved securely');
    return { ...securePaymentMethod, encryptedToken: '***' }; // إخفاء التوكن في الرد
  } catch (error) {
    console.error('❌ Error saving payment method:', error);
    throw error;
  }
};

/**
 * الحصول على طرق الدفع المحفوظة للمستخدم
 * @param {string} userId - معرف المستخدم
 * @returns {Promise<Array>}
 */
export const getPaymentMethods = async (userId) => {
  try {
    const paymentMethods = await readData(`${PAYMENT_METHODS_DB_PATH}/${userId}`);
    if (!paymentMethods) return [];

    return Object.values(paymentMethods).map((method) => ({
      ...method,
      encryptedToken: '***', // إخفاء التوكن
    }));
  } catch (error) {
    console.error('❌ Error getting payment methods:', error);
    throw error;
  }
};

/**
 * حذف طريقة دفع
 * @param {string} userId - معرف المستخدم
 * @param {string} paymentMethodId - معرف طريقة الدفع
 * @returns {Promise}
 */
export const deletePaymentMethod = async (userId, paymentMethodId) => {
  try {
    await deleteData(`${PAYMENT_METHODS_DB_PATH}/${userId}/${paymentMethodId}`);
    console.log('✅ Payment method deleted');
    return true;
  } catch (error) {
    console.error('❌ Error deleting payment method:', error);
    throw error;
  }
};

// =================== المعاملات المالية ===================

/**
 * إنشاء معاملة دفع جديدة
 * @param {object} paymentData - بيانات المعاملة
 * @returns {Promise}
 */
export const createPayment = async (paymentData) => {
  try {
    const paymentId = Date.now().toString();
    const payment = {
      id: paymentId,
      ...paymentData,
      status: PAYMENT_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await writeData(`${PAYMENT_DB_PATH}/${paymentId}`, payment);
    console.log('✅ Payment created:', paymentId);
    return payment;
  } catch (error) {
    console.error('❌ Error creating payment:', error);
    throw error;
  }
};

/**
 * الحصول على تفاصيل المعاملة
 * @param {string} paymentId - معرف المعاملة
 * @returns {Promise}
 */
export const getPayment = async (paymentId) => {
  try {
    return await readData(`${PAYMENT_DB_PATH}/${paymentId}`);
  } catch (error) {
    console.error('❌ Error getting payment:', error);
    throw error;
  }
};

/**
 * تحديث حالة المعاملة
 * @param {string} paymentId - معرف المعاملة
 * @param {string} status - الحالة الجديدة
 * @param {object} additionalData - بيانات إضافية
 * @returns {Promise}
 */
export const updatePaymentStatus = async (paymentId, status, additionalData = {}) => {
  try {
    const updates = {
      status,
      updatedAt: new Date().toISOString(),
      ...additionalData,
    };

    if (status === PAYMENT_STATUS.COMPLETED) {
      updates.completedAt = new Date().toISOString();
    }

    if (status === PAYMENT_STATUS.FAILED) {
      updates.failedAt = new Date().toISOString();
    }

    await updateData(`${PAYMENT_DB_PATH}/${paymentId}`, updates);
    console.log(`✅ Payment ${paymentId} status updated to ${status}`);
    return true;
  } catch (error) {
    console.error('❌ Error updating payment status:', error);
    throw error;
  }
};

/**
 * الحصول على سجل المعاملات للمستخدم
 * @param {string} userId - معرف المستخدم
 * @returns {Promise<Array>}
 */
export const getUserTransactions = async (userId) => {
  try {
    const allPayments = await readData(PAYMENT_DB_PATH);
    if (!allPayments) return [];

    return Object.values(allPayments)
      .filter((payment) => payment.userId === userId || payment.fromUserId === userId || payment.toUserId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('❌ Error getting user transactions:', error);
    throw error;
  }
};

/**
 * معالجة الدفع عند الاستلام
 * @param {object} orderData - بيانات الطلب
 * @returns {Promise}
 */
export const processCashOnDelivery = async (orderData) => {
  try {
    const paymentId = Date.now().toString();
    const payment = {
      id: paymentId,
      orderId: orderData.orderId,
      userId: orderData.customerId,
      amount: orderData.totalAmount,
      method: PAYMENT_METHODS.CASH,
      status: PAYMENT_STATUS.PENDING,
      description: `الدفع عند استلام الطلب #${orderData.orderId}`,
      createdAt: new Date().toISOString(),
    };

    await writeData(`${PAYMENT_DB_PATH}/${paymentId}`, payment);
    console.log('✅ Cash on delivery payment recorded');
    return payment;
  } catch (error) {
    console.error('❌ Error processing cash on delivery:', error);
    throw error;
  }
};

/**
 * معالجة رد الأموال
 * @param {string} paymentId - معرف المعاملة الأصلية
 * @param {number} amount - المبلغ المراد رده
 * @param {string} reason - السبب
 * @returns {Promise}
 */
export const processRefund = async (paymentId, amount, reason = '') => {
  try {
    const originalPayment = await getPayment(paymentId);
    if (!originalPayment) {
      throw new Error('المعاملة الأصلية غير موجودة');
    }

    if (originalPayment.status === PAYMENT_STATUS.REFUNDED) {
      throw new Error('تم رد الأموال مسبقاً');
    }

    const refundId = `REFUND_${paymentId}`;
    const refund = {
      id: refundId,
      originalPaymentId: paymentId,
      userId: originalPayment.userId,
      amount,
      reason,
      status: PAYMENT_STATUS.COMPLETED,
      timestamp: new Date().toISOString(),
    };

    // إضافة الأموال إلى محفظة المستخدم
    await updateWalletBalance(originalPayment.userId, amount, 'add');

    // تسجيل عملية الاسترجاع
    await writeData(`${TRANSACTIONS_DB_PATH}/${refundId}`, refund);

    // تحديث حالة المعاملة الأصلية
    await updatePaymentStatus(paymentId, PAYMENT_STATUS.REFUNDED, {
      refundId,
      refundReason: reason,
    });

    console.log('✅ Refund processed:', refundId);
    return refund;
  } catch (error) {
    console.error('❌ Error processing refund:', error);
    throw error;
  }
};

/**
 * الاستماع إلى تغييرات المحفظة في الوقت الفعلي
 * @param {string} userId - معرف المستخدم
 * @param {function} callback - الدالة المراد استدعاؤها
 * @returns {function} دالة لإيقاف الاستماع
 */
export const listenToWalletChanges = (userId, callback) => {
  try {
    return listenToData(`${WALLETS_DB_PATH}/${userId}`, callback);
  } catch (error) {
    console.error('❌ Error listening to wallet changes:', error);
    throw error;
  }
};

/**
 * حساب إجمالي المبيعات للتاجر
 * @param {string} merchantId - معرف التاجر
 * @returns {Promise<number>}
 */
export const getMerchantTotalSales = async (merchantId) => {
  try {
    const allPayments = await readData(PAYMENT_DB_PATH);
    if (!allPayments) return 0;

    return Object.values(allPayments)
      .filter((payment) => payment.merchantId === merchantId && payment.status === PAYMENT_STATUS.COMPLETED)
      .reduce((total, payment) => total + (payment.amount || 0), 0);
  } catch (error) {
    console.error('❌ Error getting merchant total sales:', error);
    throw error;
  }
};
