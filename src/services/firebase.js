// خدمة Firebase الرئيسية
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, update, remove, onValue } from 'firebase/database';
import { FIREBASE_CONFIG, FIREBASE_PATHS } from '../constants/firebase';

let app = null;
let database = null;

// تهيئة Firebase
export const initializeFirebase = () => {
  try {
    if (!app) {
      app = initializeApp(FIREBASE_CONFIG);
      database = getDatabase(app);
      console.log('✅ Firebase initialized successfully');
    }
    return { app, database };
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    return null;
  }
};

// الحصول على instance Firebase
export const getFirebaseApp = () => app;
export const getFirebaseDatabase = () => database;

// ============= عمليات CRUD الأساسية =============

/**
 * قراءة البيانات من مسار معين
 * @param {string} path - مسار قاعدة البيانات
 * @returns {Promise}
 */
export const readData = async (path) => {
  try {
    if (!database) initializeFirebase();
    const dbRef = ref(database, path);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error(`❌ Error reading data from ${path}:`, error);
    throw error;
  }
};

/**
 * كتابة البيانات إلى مسار معين
 * @param {string} path - مسار قاعدة البيانات
 * @param {object} data - البيانات المراد كتابتها
 * @returns {Promise}
 */
export const writeData = async (path, data) => {
  try {
    if (!database) initializeFirebase();
    const dbRef = ref(database, path);
    await set(dbRef, data);
    console.log(`✅ Data written successfully to ${path}`);
    return true;
  } catch (error) {
    console.error(`❌ Error writing data to ${path}:`, error);
    throw error;
  }
};

/**
 * تحديث البيانات في مسار معين
 * @param {string} path - مسار قاعدة البيانات
 * @param {object} updates - البيانات المراد تحديثها
 * @returns {Promise}
 */
export const updateData = async (path, updates) => {
  try {
    if (!database) initializeFirebase();
    const dbRef = ref(database, path);
    await update(dbRef, updates);
    console.log(`✅ Data updated successfully at ${path}`);
    return true;
  } catch (error) {
    console.error(`❌ Error updating data at ${path}:`, error);
    throw error;
  }
};

/**
 * حذف البيانات من مسار معين
 * @param {string} path - مسار قاعدة البيانات
 * @returns {Promise}
 */
export const deleteData = async (path) => {
  try {
    if (!database) initializeFirebase();
    const dbRef = ref(database, path);
    await remove(dbRef);
    console.log(`✅ Data deleted successfully from ${path}`);
    return true;
  } catch (error) {
    console.error(`❌ Error deleting data from ${path}:`, error);
    throw error;
  }
};

/**
 * الاستماع إلى التغييرات في البيانات (Real-time)
 * @param {string} path - مسار قاعدة البيانات
 * @param {function} callback - الدالة التي تستدعى عند التغيير
 * @returns {function} دالة لإيقاف الاستماع
 */
export const listenToData = (path, callback) => {
  try {
    if (!database) initializeFirebase();
    const dbRef = ref(database, path);
    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.val());
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error(`❌ Error listening to ${path}:`, error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error(`❌ Error setting up listener for ${path}:`, error);
    throw error;
  }
};

// ============= عمليات المستخدمين =============

/**
 * الحصول على بيانات المستخدم
 * @param {string} userId - معرف المستخدم
 * @returns {Promise}
 */
export const getUserData = (userId) => {
  return readData(`${FIREBASE_PATHS.USERS}/${userId}`);
};

/**
 * إنشاء حساب مستخدم جديد
 * @param {string} userId - معرف المستخدم
 * @param {object} userData - بيانات المستخدم
 * @returns {Promise}
 */
export const createUser = (userId, userData) => {
  const userObj = {
    ...userData,
    id: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return writeData(`${FIREBASE_PATHS.USERS}/${userId}`, userObj);
};

/**
 * تحديث بيانات المستخدم
 * @param {string} userId - معرف المستخدم
 * @param {object} updates - البيانات المراد تحديثها
 * @returns {Promise}
 */
export const updateUser = (userId, updates) => {
  return updateData(`${FIREBASE_PATHS.USERS}/${userId}`, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

// ============= عمليات الطلبات =============

/**
 * الحصول على جميع الطلبات
 * @returns {Promise}
 */
export const getAllOrders = () => {
  return readData(FIREBASE_PATHS.ORDERS);
};

/**
 * الحصول على طلب معين
 * @param {string} orderId - معرف الطلب
 * @returns {Promise}
 */
export const getOrder = (orderId) => {
  return readData(`${FIREBASE_PATHS.ORDERS}/${orderId}`);
};

/**
 * إنشاء طلب جديد
 * @param {string} orderId - معرف الطلب
 * @param {object} orderData - بيانات الطلب
 * @returns {Promise}
 */
export const createOrder = (orderId, orderData) => {
  const orderObj = {
    ...orderData,
    id: orderId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return writeData(`${FIREBASE_PATHS.ORDERS}/${orderId}`, orderObj);
};

/**
 * تحديث حالة الطلب
 * @param {string} orderId - معرف الطلب
 * @param {object} updates - البيانات المراد تحديثها
 * @returns {Promise}
 */
export const updateOrder = (orderId, updates) => {
  return updateData(`${FIREBASE_PATHS.ORDERS}/${orderId}`, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

/**
 * حذف طلب
 * @param {string} orderId - معرف الطلب
 * @returns {Promise}
 */
export const deleteOrder = (orderId) => {
  return deleteData(`${FIREBASE_PATHS.ORDERS}/${orderId}`);
};

// ============= عمليات الدردشة =============

/**
 * الحصول على الرسائل بين مستخدمين
 * @param {string} userId1 - معرف المستخدم الأول
 * @param {string} userId2 - معرف المستخدم الثاني
 * @returns {Promise}
 */
export const getMessages = (userId1, userId2) => {
  const chatId = [userId1, userId2].sort().join('_');
  return readData(`${FIREBASE_PATHS.MESSAGES}/${chatId}`);
};

/**
 * إرسال رسالة
 * @param {string} userId1 - معرف المستخدم الأول
 * @param {string} userId2 - معرف المستخدم الثاني
 * @param {object} message - الرسالة
 * @returns {Promise}
 */
export const sendMessage = (userId1, userId2, message) => {
  const chatId = [userId1, userId2].sort().join('_');
  const messageId = Date.now().toString();
  return writeData(`${FIREBASE_PATHS.MESSAGES}/${chatId}/${messageId}`, {
    ...message,
    id: messageId,
    timestamp: new Date().toISOString(),
  });
};

// ============= عمليات التقييمات =============

/**
 * إضافة تقييم
 * @param {string} ratingId - معرف التقييم
 * @param {object} ratingData - بيانات التقييم
 * @returns {Promise}
 */
export const addRating = (ratingId, ratingData) => {
  const ratingObj = {
    ...ratingData,
    id: ratingId,
    createdAt: new Date().toISOString(),
  };
  return writeData(`${FIREBASE_PATHS.RATINGS}/${ratingId}`, ratingObj);
};

/**
 * الحصول على تقييمات المستخدم
 * @param {string} userId - معرف المستخدم
 * @returns {Promise}
 */
export const getUserRatings = (userId) => {
  return readData(`${FIREBASE_PATHS.RATINGS}`);
};
