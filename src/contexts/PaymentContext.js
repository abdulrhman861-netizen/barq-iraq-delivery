// Context لإدارة حالة الدفع والمحافظ
import React, { createContext, useState, useCallback, useEffect } from 'react';
import {
  getWalletBalance,
  createWallet,
  updateWalletBalance,
  transferBalance,
  savePaymentMethod,
  getPaymentMethods,
  deletePaymentMethod,
  createPayment,
  getPayment,
  updatePaymentStatus,
  getUserTransactions,
  processCashOnDelivery,
  processRefund,
  listenToWalletChanges,
  getMerchantTotalSales,
} from '../services/paymentService';
import { PAYMENT_STATUS, PAYMENT_METHODS } from '../constants/payment';

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [payments, setPayments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // تهيئة المحفظة للمستخدم
  const initializeWallet = useCallback(async (userId) => {
    try {
      setIsLoading(true);
      setError(null);

      let walletData = await getWalletBalance(userId);
      
      if (!walletData) {
        // إنشاء محفظة جديدة إذا لم تكن موجودة
        await createWallet(userId);
        walletData = 0;
      }

      setWallet({
        userId,
        balance: walletData,
        currency: 'IQD',
      });

      // الاستماع إلى تغييرات المحفظة في الوقت الفعلي
      const unsubscribe = listenToWalletChanges(userId, (updatedWallet) => {
        if (updatedWallet) {
          setWallet(updatedWallet);
        }
      });

      return unsubscribe;
    } catch (err) {
      const errorMessage = err.message || 'خطأ في تهيئة المحفظة';
      setError(errorMessage);
      console.error('❌ Error initializing wallet:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // جلب المعاملات المالية
  const fetchTransactions = useCallback(async (userId) => {
    try {
      setIsLoading(true);
      const userTransactions = await getUserTransactions(userId);
      setTransactions(userTransactions || []);
      return userTransactions;
    } catch (err) {
      const errorMessage = err.message || 'خطأ في جلب المعاملات';
      setError(errorMessage);
      console.error('❌ Error fetching transactions:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // جلب طرق الدفع المحفوظة
  const fetchPaymentMethods = useCallback(async (userId) => {
    try {
      setIsLoading(true);
      const methods = await getPaymentMethods(userId);
      setPaymentMethods(methods || []);
      return methods;
    } catch (err) {
      const errorMessage = err.message || 'خطأ في جلب طرق الدفع';
      setError(errorMessage);
      console.error('❌ Error fetching payment methods:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // حفظ طريقة دفع جديدة
  const addPaymentMethod = useCallback(async (userId, paymentMethodData) => {
    try {
      setIsLoading(true);
      setError(null);

      const newMethod = await savePaymentMethod(userId, paymentMethodData);
      setPaymentMethods((prev) => [...prev, newMethod]);

      console.log('✅ Payment method added successfully');
      return newMethod;
    } catch (err) {
      const errorMessage = err.message || 'خطأ في حفظ طريقة الدفع';
      setError(errorMessage);
      console.error('❌ Error adding payment method:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // حذف طريقة دفع
  const removePaymentMethod = useCallback(async (userId, paymentMethodId) => {
    try {
      setIsLoading(true);
      setError(null);

      await deletePaymentMethod(userId, paymentMethodId);
      setPaymentMethods((prev) => prev.filter((method) => method.id !== paymentMethodId));

      if (selectedPaymentMethod?.id === paymentMethodId) {
        setSelectedPaymentMethod(null);
      }

      console.log('✅ Payment method removed successfully');
    } catch (err) {
      const errorMessage = err.message || 'خطأ في حذف طريقة الدفع';
      setError(errorMessage);
      console.error('❌ Error removing payment method:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedPaymentMethod]);

  // إنشاء معاملة دفع
  const makePayment = useCallback(async (paymentData) => {
    try {
      setIsLoading(true);
      setError(null);

      const payment = await createPayment(paymentData);
      setPayments((prev) => [payment, ...prev]);

      console.log('✅ Payment created successfully');
      return payment;
    } catch (err) {
      const errorMessage = err.message || 'خطأ في إنشاء المعاملة';
      setError(errorMessage);
      console.error('❌ Error creating payment:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // معالجة الدفع عند الاستلام
  const handleCashOnDelivery = useCallback(async (orderData) => {
    try {
      setIsLoading(true);
      setError(null);

      const payment = await processCashOnDelivery(orderData);
      setPayments((prev) => [payment, ...prev]);

      console.log('✅ Cash on delivery payment processed');
      return payment;
    } catch (err) {
      const errorMessage = err.message || 'خطأ في معالجة الدفع عند الاستلام';
      setError(errorMessage);
      console.error('❌ Error processing cash on delivery:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // تحويل الأموال بين المستخدمين
  const sendTransfer = useCallback(async (fromUserId, toUserId, amount, description) => {
    try {
      setIsLoading(true);
      setError(null);

      const transfer = await transferBalance(fromUserId, toUserId, amount, description);
      setTransactions((prev) => [transfer, ...prev]);

      // تحديث رصيد المحفظة
      if (wallet?.userId === fromUserId) {
        const newBalance = wallet.balance - amount;
        setWallet((prev) => ({
          ...prev,
          balance: newBalance,
        }));
      }

      console.log('✅ Transfer completed successfully');
      return transfer;
    } catch (err) {
      const errorMessage = err.message || 'خطأ في التحويل';
      setError(errorMessage);
      console.error('❌ Error transferring balance:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  // استرجاع الأموال
  const refund = useCallback(async (paymentId, amount, reason) => {
    try {
      setIsLoading(true);
      setError(null);

      const refundResult = await processRefund(paymentId, amount, reason);
      setTransactions((prev) => [refundResult, ...prev]);

      // تحديث حالة الدفع الأصلي
      await updatePaymentStatus(paymentId, PAYMENT_STATUS.REFUNDED, {
        refundId: refundResult.id,
        refundReason: reason,
      });

      console.log('✅ Refund processed successfully');
      return refundResult;
    } catch (err) {
      const errorMessage = err.message || 'خطأ في استرجاع الأموال';
      setError(errorMessage);
      console.error('❌ Error processing refund:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // تحديث حالة المعاملة
  const updatePaymentStatusHandler = useCallback(async (paymentId, status, additionalData) => {
    try {
      setIsLoading(true);
      setError(null);

      await updatePaymentStatus(paymentId, status, additionalData);

      // تحديث الدفعة في الحالة
      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === paymentId
            ? {
                ...payment,
                status,
                ...additionalData,
              }
            : payment
        )
      );

      console.log(`✅ Payment status updated to ${status}`);
      return true;
    } catch (err) {
      const errorMessage = err.message || 'خطأ في تحديث حالة الدفع';
      setError(errorMessage);
      console.error('❌ Error updating payment status:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // الحصول على تفاصيل معاملة
  const getPaymentDetails = useCallback(async (paymentId) => {
    try {
      setIsLoading(true);
      const payment = await getPayment(paymentId);
      return payment;
    } catch (err) {
      const errorMessage = err.message || 'خطأ في جلب تفاصيل المعاملة';
      setError(errorMessage);
      console.error('❌ Error getting payment details:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // الحصول على إجمالي مبيعات التاجر
  const getTotalSales = useCallback(async (merchantId) => {
    try {
      setIsLoading(true);
      const totalSales = await getMerchantTotalSales(merchantId);
      return totalSales;
    } catch (err) {
      const errorMessage = err.message || 'خطأ في حساب إجمالي المبيعات';
      setError(errorMessage);
      console.error('❌ Error getting total sales:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // تصفية المعاملات حسب الحالة
  const getTransactionsByStatus = useCallback((status) => {
    return transactions.filter((transaction) => transaction.status === status);
  }, [transactions]);

  // تصفية المعاملات حسب النوع
  const getTransactionsByType = useCallback((type) => {
    return transactions.filter((transaction) => transaction.type === type);
  }, [transactions]);

  const value = {
    // الحالة
    wallet,
    payments,
    transactions,
    paymentMethods,
    isLoading,
    error,
    selectedPaymentMethod,

    // الدوال
    initializeWallet,
    fetchTransactions,
    fetchPaymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    setSelectedPaymentMethod,
    makePayment,
    handleCashOnDelivery,
    sendTransfer,
    refund,
    updatePaymentStatusHandler,
    getPaymentDetails,
    getTotalSales,
    getTransactionsByStatus,
    getTransactionsByType,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
