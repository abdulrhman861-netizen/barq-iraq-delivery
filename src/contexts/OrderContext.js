// Context لإدارة الطلبات
import React, { createContext, useState, useCallback } from 'react';
import {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../services/firebase';
import { ORDER_STATUS } from '../constants/index';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // جلب جميع الطلبات
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllOrders();
      if (data) {
        const ordersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setOrders(ordersArray);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // إنشاء طلب جديد
  const createNewOrder = useCallback(async (orderData) => {
    try {
      setIsLoading(true);
      const orderId = Date.now().toString();
      const newOrder = {
        ...orderData,
        id: orderId,
        status: ORDER_STATUS.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await createOrder(orderId, newOrder);
      setOrders((prev) => [newOrder, ...prev]);

      console.log('✅ Order created:', orderId);
      return newOrder;
    } catch (err) {
      setError(err.message);
      console.error('❌ Error creating order:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // تحديث حالة الطلب
  const updateOrderStatus = useCallback(async (orderId, status, additionalData = {}) => {
    try {
      setIsLoading(true);
      const updates = {
        status,
        updatedAt: new Date().toISOString(),
        ...additionalData,
      };

      await updateOrder(orderId, updates);

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, ...updates } : order
        )
      );

      console.log(`✅ Order ${orderId} status updated to ${status}`);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('❌ Error updating order status:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // حذف طلب
  const deleteOrderData = useCallback(async (orderId) => {
    try {
      setIsLoading(true);
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      console.log('✅ Order deleted:', orderId);
    } catch (err) {
      setError(err.message);
      console.error('❌ Error deleting order:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // فلترة الطلبات حسب الحالة
  const getOrdersByStatus = useCallback(
    (status) => {
      return orders.filter((order) => order.status === status);
    },
    [orders]
  );

  // فلترة الطلبات حسب المستخدم
  const getOrdersByUser = useCallback(
    (userId) => {
      return orders.filter(
        (order) => order.merchantId === userId || order.captainId === userId
      );
    },
    [orders]
  );

  const value = {
    orders,
    isLoading,
    error,
    fetchOrders,
    createNewOrder,
    updateOrderStatus,
    deleteOrderData,
    getOrdersByStatus,
    getOrdersByUser,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
