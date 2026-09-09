// خدمة التخزين المحلي (AsyncStorage)
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_DATA: 'user_data',
  AUTH_TOKEN: 'auth_token',
  USER_LOCATION: 'user_location',
  APP_SETTINGS: 'app_settings',
  RECENT_ORDERS: 'recent_orders',
  FAVORITES: 'favorites',
};

/**
 * حفظ البيانات
 * @param {string} key - مفتاح التخزين
 * @param {object} data - البيانات المراد حفظها
 * @returns {Promise<void>}
 */
export const saveData = async (key, data) => {
  try {
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonData);
    console.log(`✅ Data saved to ${key}`);
  } catch (error) {
    console.error(`❌ Error saving data to ${key}:`, error);
    throw error;
  }
};

/**
 * قراءة البيانات
 * @param {string} key - مفتاح التخزين
 * @returns {Promise<object>} البيانات المحفوظة
 */
export const getData = async (key) => {
  try {
    const jsonData = await AsyncStorage.getItem(key);
    return jsonData ? JSON.parse(jsonData) : null;
  } catch (error) {
    console.error(`❌ Error reading data from ${key}:`, error);
    return null;
  }
};

/**
 * حذف البيانات
 * @param {string} key - مفتاح التخزين
 * @returns {Promise<void>}
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`✅ Data removed from ${key}`);
  } catch (error) {
    console.error(`❌ Error removing data from ${key}:`, error);
    throw error;
  }
};

/**
 * حفظ بيانات المستخدم
 * @param {object} userData - بيانات المستخدم
 */
export const saveUserData = (userData) => {
  return saveData(STORAGE_KEYS.USER_DATA, userData);
};

/**
 * قراءة بيانات المستخدم
 * @returns {Promise<object>}
 */
export const getUserData = () => {
  return getData(STORAGE_KEYS.USER_DATA);
};

/**
 * حفظ توكن المصادقة
 * @param {string} token - التوكن
 */
export const saveAuthToken = (token) => {
  return saveData(STORAGE_KEYS.AUTH_TOKEN, { token });
};

/**
 * قراءة توكن المصادقة
 * @returns {Promise<string>}
 */
export const getAuthToken = async () => {
  const data = await getData(STORAGE_KEYS.AUTH_TOKEN);
  return data?.token || null;
};

/**
 * حفظ الموقع الحالي
 * @param {object} location - الموقع الجغرافي
 */
export const saveUserLocation = (location) => {
  return saveData(STORAGE_KEYS.USER_LOCATION, location);
};

/**
 * قراءة آخر موقع محفوظ
 * @returns {Promise<object>}
 */
export const getUserLocation = () => {
  return getData(STORAGE_KEYS.USER_LOCATION);
};

/**
 * حفظ إعدادات التطبيق
 * @param {object} settings - الإعدادات
 */
export const saveAppSettings = (settings) => {
  return saveData(STORAGE_KEYS.APP_SETTINGS, settings);
};

/**
 * قراءة إعدادات التطبيق
 * @returns {Promise<object>}
 */
export const getAppSettings = () => {
  return getData(STORAGE_KEYS.APP_SETTINGS);
};

/**
 * مسح جميع البيانات المحفوظة
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    console.log('✅ All data cleared');
  } catch (error) {
    console.error('❌ Error clearing all data:', error);
    throw error;
  }
};

export default {
  STORAGE_KEYS,
  saveData,
  getData,
  removeData,
  saveUserData,
  getUserData,
  saveAuthToken,
  getAuthToken,
  saveUserLocation,
  getUserLocation,
  saveAppSettings,
  getAppSettings,
  clearAllData,
};
