// خدمة الموقع الجغرافي
import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';

/**
 * طلب صلاحية الموقع من المستخدم
 * @returns {Promise<boolean>} هل تم الموافقة على الصلاحية
 */
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('⚠️ Location permission denied');
      return false;
    }
    console.log('✅ Location permission granted');
    return true;
  } catch (error) {
    console.error('❌ Error requesting location permission:', error);
    return false;
  }
};

/**
 * الحصول على الموقع الحالي
 * @returns {Promise<{latitude: number, longitude: number}>} الموقع الحالي
 */
export const getCurrentLocation = async () => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission not granted');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      altitude: location.coords.altitude,
      speed: location.coords.speed,
      heading: location.coords.heading,
    };
  } catch (error) {
    console.error('❌ Error getting current location:', error);
    throw error;
  }
};

/**
 * الاستماع إلى تغييرات الموقع (Real-time)
 * @param {function} callback - الدالة التي تستدعى عند تغيير الموقع
 * @param {object} options - الخيارات
 * @returns {function} دالة لإيقاف الاستماع
 */
export const watchLocation = async (callback, options = {}) => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission not granted');
    }

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: options.timeInterval || 1000, // التحديث كل ثانية
        distanceInterval: options.distanceInterval || 10, // التحديث عند تحرك 10 متر
      },
      (location) => {
        callback({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          speed: location.coords.speed,
          heading: location.coords.heading,
        });
      }
    );

    // إرجاع دالة لإيقاف المراقبة
    return () => subscription.remove();
  } catch (error) {
    console.error('❌ Error watching location:', error);
    throw error;
  }
};

/**
 * حساب المسافة بين نقطتين (بالكيلومتر)
 * @param {number} lat1 - خط العرض الأول
 * @param {number} lon1 - خط الطول الأول
 * @param {number} lat2 - خط العرض الثاني
 * @param {number} lon2 - خط الطول الثاني
 * @returns {number} المسافة بالكيلومتر
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return parseFloat(distance.toFixed(2));
};

/**
 * الحصول على عنوان من الإحداثيات (Reverse Geocoding)
 * @param {number} latitude - خط العرض
 * @param {number} longitude - خط الطول
 * @returns {Promise<string>} العنوان
 */
export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const addresses = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    if (addresses.length > 0) {
      const address = addresses[0];
      return `${address.street}, ${address.city}, ${address.region}`;
    }
    return 'Unknown Address';
  } catch (error) {
    console.error('❌ Error getting address:', error);
    return 'Unknown Address';
  }
};

/**
 * الحصول على إحداثيات من عنوان (Geocoding)
 * @param {string} address - العنوان
 * @returns {Promise<{latitude: number, longitude: number}>} الإحداثيات
 */
export const getCoordinatesFromAddress = async (address) => {
  try {
    const geocoding = await Location.geocodeAsync(address);
    if (geocoding.length > 0) {
      return {
        latitude: geocoding[0].latitude,
        longitude: geocoding[0].longitude,
      };
    }
    throw new Error('Address not found');
  } catch (error) {
    console.error('❌ Error geocoding address:', error);
    throw error;
  }
};

/**
 * فتح الخريطة (Google Maps أو Apple Maps)
 * @param {number} latitude - خط العرض
 * @param {number} longitude - خط الطول
 * @param {string} label - اسم الموقع
 */
export const openMapApp = async (latitude, longitude, label = 'Destination') => {
  try {
    const url = Platform.OS === 'ios'
      ? `maps://0,0?q=${label}@${latitude},${longitude}`
      : `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`;
    
    await Location.openSettings();
  } catch (error) {
    console.error('❌ Error opening map app:', error);
  }
};
