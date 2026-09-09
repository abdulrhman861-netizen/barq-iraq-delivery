// خدمة الإشعارات
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

/**
 * تهيئة الإشعارات
 */
export const initializeNotifications = async () => {
  try {
    // طلب صلاحية الإشعارات
    if (Platform.OS !== 'web') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('⚠️ Notification permission not granted');
        return false;
      }
    }

    // ضبط سلوك الإشعارات
    await Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        console.log('📨 Notification received:', notification);
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        };
      },
    });

    console.log('✅ Notifications initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing notifications:', error);
    return false;
  }
};

/**
 * الحصول على رمز الدفع (Push Token)
 * @returns {Promise<string>} رمز الدفع
 */
export const getPushToken = async () => {
  try {
    if (Platform.OS === 'web') {
      console.warn('⚠️ Push notifications not supported on web');
      return null;
    }

    if (!Device.isDevice) {
      console.warn('⚠️ Push notifications only work on physical devices');
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('🔑 Push token:', token);
    return token;
  } catch (error) {
    console.error('❌ Error getting push token:', error);
    return null;
  }
};

/**
 * إرسال إشعار محلي
 * @param {string} title - العنوان
 * @param {string} body - المحتوى
 * @param {object} data - البيانات الإضافية
 */
export const sendLocalNotification = async (title, body, data = {}) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        badge: 1,
        data,
      },
      trigger: {
        seconds: 1,
      },
    });
    console.log('✅ Local notification sent:', title);
  } catch (error) {
    console.error('❌ Error sending notification:', error);
  }
};

/**
 * الاستماع إلى الإشعارات الواردة
 * @param {function} callback - الدالة التي تستدعى عند استقبال إشعار
 * @returns {function} دالة لإيقاف الاستماع
 */
export const listenToNotifications = (callback) => {
  if (Platform.OS === 'web') {
    return () => {};
  }

  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log('📬 Notification response received:', response);
      callback(response.notification);
    }
  );

  return () => subscription.remove();
};

/**
 * الاستماع إلى الإشعارات التي تصل أثناء التطبيق
 * @param {function} callback - الدالة التي تستدعى عند استقبال إشعار
 * @returns {function} دالة لإيقاف الاستماع
 */
export const listenToForegroundNotifications = (callback) => {
  if (Platform.OS === 'web') {
    return () => {};
  }

  const subscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('🔔 Foreground notification received:', notification);
      callback(notification);
    }
  );

  return () => subscription.remove();
};

/**
 * إلغاء جميع الإشعارات
 */
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('✅ All notifications cancelled');
  } catch (error) {
    console.error('❌ Error cancelling notifications:', error);
  }
};
