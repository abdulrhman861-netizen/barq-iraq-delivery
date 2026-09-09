import React, { createContext, useCallback, useMemo, useState, useContext } from 'react';
import { OrderContext } from './OrderContext';
import { NotificationContext } from './NotificationContext';
import { ChatContext } from './ChatContext';
import { PAYMENT_STATUS, getUserTransactions, processOrderPayment } from '../services/paymentService';

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const { updateOrderStatus } = useContext(OrderContext);
  const { notifyPaymentReceived } = useContext(NotificationContext);
  const { sendNewMessage } = useContext(ChatContext);

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncPaymentWithFeatures = useCallback(async (order, paymentResult) => {
    const paymentStatus = paymentResult?.payment?.status || PAYMENT_STATUS.FAILED;

    await updateOrderStatus(order.id, order.status, {
      paymentStatus,
      isPaid: paymentStatus === PAYMENT_STATUS.SUCCESS,
      allowRating: paymentStatus === PAYMENT_STATUS.SUCCESS,
    });

    if (paymentStatus === PAYMENT_STATUS.SUCCESS) {
      notifyPaymentReceived(paymentResult.payment.amount);

      if (order.customerId && order.merchantId) {
        await sendNewMessage(order.customerId, order.merchantId, {
          senderName: 'نظام الدفع',
          text: `تم دفع الطلب #${order.id} بمبلغ ${paymentResult.payment.amount}`,
          type: 'payment_update',
        });
      }

      if (order.customerId && order.captainId) {
        await sendNewMessage(order.customerId, order.captainId, {
          senderName: 'نظام الدفع',
          text: `تم تأكيد دفع الطلب #${order.id} ويمكن متابعة التسليم.`,
          type: 'payment_update',
        });
      }
    }
  }, [notifyPaymentReceived, sendNewMessage, updateOrderStatus]);

  const payForOrder = useCallback(async ({ order, userId, method, amount }) => {
    try {
      setIsLoading(true);
      setError(null);

      const paymentResult = await processOrderPayment({ order, userId, method, amount });
      await syncPaymentWithFeatures(order, paymentResult);

      setTransactions((prev) => [paymentResult.transaction, ...prev]);

      return {
        ...paymentResult,
        canRate: paymentResult.payment.status === PAYMENT_STATUS.SUCCESS,
      };
    } catch (err) {
      setError(err.message || 'Payment failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [syncPaymentWithFeatures]);

  const fetchTransactions = useCallback(async (userId) => {
    try {
      setIsLoading(true);
      const data = await getUserTransactions(userId);
      setTransactions(data);
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const canOrderBeRated = useCallback((order) => {
    return Boolean(order?.allowRating || order?.paymentStatus === PAYMENT_STATUS.SUCCESS);
  }, []);

  const value = useMemo(() => ({
    transactions,
    isLoading,
    error,
    payForOrder,
    fetchTransactions,
    canOrderBeRated,
  }), [transactions, isLoading, error, payForOrder, fetchTransactions, canOrderBeRated]);

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};
