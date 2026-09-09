// Context لإدارة الإشعارات
import React, { createContext, useState, useCallback, useEffect } from 'react';
import {
  sendLocalNotification,
  listenToNotifications,
  listenToForegroundNotifications,
} from '../services/notifications';
import { NOTIFICATION_TYPES } from '../constants/index';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationSettings, setNotificationSettings] = useState({
    orderCreated: true,
    orderAccepted: true,
    orderDelivered: true,
    chatMessage: true,
    ratingReceived: true,
    paymentReceived: true,
    systemAlert: true,
    sound: true,
    vibration: true,
  });

  // إضافة إشعار جديد
  const addNotification = useCallback(
    (notificationData) => {
      const notification = {
        id: Date.now().toString(),
        title: notificationData.title,
        body: notificationData.body,
        type: notificationData.type || NOTIFICATION_TYPES.SYSTEM_ALERT,
        data: notificationData.data || {},
        timestamp: new Date().toISOString(),
        isRead: false,
        icon: notificationData.icon || '📢',
        action: notificationData.action || null,
      };

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      console.log('✅ Notification added:', notification.title);
      return notification;
    },
    []
  );

  // إرسال إشعار محلي
  const sendNotification = useCallback(
    async (title, body, data = {}, notificationType = NOTIFICATION_TYPES.SYSTEM_ALERT) => {
      try {
        // التحقق من الإعدادات
        const settingKey = Object.keys(notificationSettings).find(
          (key) =>
            notificationSettings[key] &&
            key.toLowerCase().includes(notificationType.toLowerCase())
        );

        if (settingKey && !notificationSettings[settingKey]) {
          console.log('⚠️ Notification type disabled:', notificationType);
          return;
        }

        await sendLocalNotification(title, body, data);
        addNotification({ title, body, type: notificationType, data });
      } catch (error) {
        console.error('❌ Error sending notification:', error);
      }
    },
    [notificationSettings, addNotification]
  );

  // تحديث حالة الإشعار (مقروء/غير مقروء)
  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  // تحديث جميع الإشعارات كمقروءة
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
    setUnreadCount(0);
  }, []);

  // حذف إشعار
  const deleteNotification = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId)
    );
  }, []);

  // مسح جميع الإشعارات
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // الحصول على الإشعارات غير المقروءة
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter((notif) => !notif.isRead);
  }, [notifications]);

  // تحديث إعدادات الإشعارات
  const updateSettings = useCallback((newSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  }, []);

  // الاستماع إلى الإشعارات الواردة
  useEffect(() => {
    const unsubscribeResponse = listenToNotifications((notification) => {
      console.log('📬 Notification response received:', notification);
      // معالجة الإجراء المقابل للإشعار
      if (notification.request.content.data?.action) {
        // قد يتم تنفيذ إجراء معين هنا
      }
    });

    const unsubscribeForeground = listenToForegroundNotifications((notification) => {
      console.log('🔔 Foreground notification received:', notification);
      addNotification({
        title: notification.request.content.title,
        body: notification.request.content.body,
        type: notification.request.content.data?.type || NOTIFICATION_TYPES.SYSTEM_ALERT,
        data: notification.request.content.data,
      });
    });

    return () => {
      unsubscribeResponse();
      unsubscribeForeground();
    };
  }, [addNotification]);

  // إرسال إشعار عند إنشاء طلب جديد
  const notifyOrderCreated = useCallback(
    (orderId, merchantName) => {
      sendNotification(
        '✅ طلب جديد!',
        `تم استقبال طلب جديد من ${merchantName}`,
        { orderId, action: 'VIEW_ORDER' },
        NOTIFICATION_TYPES.ORDER_CREATED
      );
    },
    [sendNotification]
  );

  // إرسال إشعار عند قبول الطلب
  const notifyOrderAccepted = useCallback(
    (orderId, captainName) => {
      sendNotification(
        '✅ تم قبول الطلب!',
        `${captainName} قبل توصيل طلبك`,
        { orderId, action: 'TRACK_ORDER' },
        NOTIFICATION_TYPES.ORDER_ACCEPTED
      );
    },
    [sendNotification]
  );

  // إرسال إشعار عند توصيل الطلب
  const notifyOrderDelivered = useCallback(
    (orderId) => {
      sendNotification(
        '🎉 تم التسليم!',
        'تم تسليم طلبك بنجاح',
        { orderId, action: 'RATE_ORDER' },
        NOTIFICATION_TYPES.ORDER_DELIVERED
      );
    },
    [sendNotification]
  );

  // إرسال إشعار رسالة دردشة جديدة
  const notifyChatMessage = useCallback(
    (senderName, messagePreview) => {
      sendNotification(
        '💬 رسالة جديدة',
        `من ${senderName}: ${messagePreview}`,
        { action: 'OPEN_CHAT' },
        NOTIFICATION_TYPES.CHAT_MESSAGE
      );
    },
    [sendNotification]
  );

  // إرسال إشعار تقييم جديد
  const notifyRatingReceived = useCallback(
    (raterName, rating) => {
      sendNotification(
        '⭐ تقييم جديد!',
        `حصلت على تقييم ${rating} نجوم من ${raterName}`,
        { action: 'VIEW_RATING' },
        NOTIFICATION_TYPES.RATING_RECEIVED
      );
    },
    [sendNotification]
  );

  // إرسال إشعار دفع
  const notifyPaymentReceived = useCallback(
    (amount) => {
      sendNotification(
        '💳 تم استقبال الدفع',
        `تم استقبال ${amount} د.ع بنجاح`,
        { action: 'VIEW_PAYMENT' },
        NOTIFICATION_TYPES.PAYMENT_RECEIVED
      );
    },
    [sendNotification]
  );

  // إرسال تنبيه نظام
  const notifySystemAlert = useCallback(
    (title, message) => {
      sendNotification(
        title,
        message,
        { action: 'SYSTEM_ALERT' },
        NOTIFICATION_TYPES.SYSTEM_ALERT
      );
    },
    [sendNotification]
  );

  // الحصول على الإشعارات حسب النوع
  const getNotificationsByType = useCallback(
    (type) => {
      return notifications.filter((notif) => notif.type === type);
    },
    [notifications]
  );

  // الحصول على آخر إشعارات
  const getRecentNotifications = useCallback(
    (limit = 10) => {
      return notifications.slice(0, limit);
    },
    [notifications]
  );

  const value = {
    // الحالات
    notifications,
    unreadCount,
    notificationSettings,
    // الدوال
    addNotification,
    sendNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadNotifications,
    updateSettings,
    notifyOrderCreated,
    notifyOrderAccepted,
    notifyOrderDelivered,
    notifyChatMessage,
    notifyRatingReceived,
    notifyPaymentReceived,
    notifySystemAlert,
    getNotificationsByType,
    getRecentNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
