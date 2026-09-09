// Context للتتبع الحي
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { listenToData, updateData } from '../services/firebase';
import { watchLocation } from '../services/location';
import { FIREBASE_PATHS } from '../constants/firebase';

export const TrackingContext = createContext();

export const TrackingProvider = ({ children }) => {
  // حالات التتبع
  const [captainLocation, setCaptainLocation] = useState(null);
  const [orderLocation, setOrderLocation] = useState(null);
  const [liveOrders, setLiveOrders] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  // بدء تتبع موقع الكابتن
  const startCaptainTracking = useCallback(async (captainId, onLocationUpdate) => {
    try {
      setIsTracking(true);
      const unwatch = await watchLocation(
        (location) => {
          // تحديث الموقع المحلي
          setCaptainLocation(location);
          setSpeed(location.speed || 0);
          setAccuracy(location.accuracy || 0);

          // حفظ في Firebase
          updateData(`${FIREBASE_PATHS.CAPTAINS}/${captainId}/location`, {
            latitude: location.latitude,
            longitude: location.longitude,
            speed: location.speed,
            heading: location.heading,
            timestamp: new Date().toISOString(),
          });

          // إضافة إلى السجل
          setTrackingHistory((prev) => [
            ...prev,
            {
              ...location,
              timestamp: new Date().toISOString(),
            },
          ]);

          // استدعاء callback إذا تم توفيره
          if (onLocationUpdate) onLocationUpdate(location);
        },
        { timeInterval: 5000, distanceInterval: 10 }
      );

      return unwatch;
    } catch (error) {
      console.error('❌ Error starting captain tracking:', error);
      setIsTracking(false);
      throw error;
    }
  }, []);

  // إيقاف التتبع
  const stopTracking = useCallback((unwatch) => {
    if (unwatch) {
      unwatch();
      setIsTracking(false);
      console.log('✅ Tracking stopped');
    }
  }, []);

  // حساب ETA (الوقت المتبقي)
  const calculateETA = useCallback((currentLat, currentLng, destLat, destLng, avgSpeed = 50) => {
    // صيغة Haversine لحساب المسافة
    const R = 6371; // نصف قطر الأرض بالكيلومتر
    const dLat = (destLat - currentLat) * (Math.PI / 180);
    const dLng = (destLng - currentLng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(currentLat * (Math.PI / 180)) *
        Math.cos(destLat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;

    setDistance(parseFloat(distanceKm.toFixed(2)));

    // حساب الوقت بالدقائق
    const timeMinutes = (distanceKm / avgSpeed) * 60;
    setEta(Math.round(timeMinutes));

    return { distance: distanceKm, timeMinutes: Math.round(timeMinutes) };
  }, []);

  // الاستماع إلى تحديثات الطلبات الحية
  const listenToLiveOrders = useCallback(() => {
    const unsubscribe = listenToData(FIREBASE_PATHS.ORDERS, (data) => {
      if (data) {
        const ordersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setLiveOrders(
          ordersArray.filter((order) => order.status === 'in_transit')
        );
      }
    });
    return unsubscribe;
  }, []);

  // الحصول على موقع الكابتن من Firebase
  const getCaptainLocationFromDB = useCallback(async (captainId) => {
    try {
      const unsubscribe = listenToData(
        `${FIREBASE_PATHS.CAPTAINS}/${captainId}/location`,
        (data) => {
          if (data) {
            setCaptainLocation(data);
          }
        }
      );
      return unsubscribe;
    } catch (error) {
      console.error('❌ Error getting captain location:', error);
      throw error;
    }
  }, []);

  // تحديث موقع الطلب
  const updateOrderLocation = useCallback(async (orderId, location) => {
    try {
      await updateData(`${FIREBASE_PATHS.ORDERS}/${orderId}/location`, {
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date().toISOString(),
      });
      setOrderLocation(location);
    } catch (error) {
      console.error('❌ Error updating order location:', error);
      throw error;
    }
  }, []);

  // حساب مسار التوصيل
  const calculateRoute = useCallback((startLat, startLng, endLat, endLng) => {
    // هنا يمكن استخدام Google Maps API لحساب المسار الفعلي
    // للآن نحسب المسافة المباشرة فقط
    const R = 6371;
    const dLat = (endLat - startLat) * (Math.PI / 180);
    const dLng = (endLng - startLng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(startLat * (Math.PI / 180)) *
        Math.cos(endLat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return {
      distance: parseFloat(distance.toFixed(2)),
      duration: Math.round((distance / 50) * 60), // بافتراض سرعة 50 كم/س
    };
  }, []);

  const value = {
    // الحالات
    captainLocation,
    orderLocation,
    liveOrders,
    isTracking,
    trackingHistory,
    eta,
    distance,
    speed,
    accuracy,
    // الدوال
    startCaptainTracking,
    stopTracking,
    calculateETA,
    listenToLiveOrders,
    getCaptainLocationFromDB,
    updateOrderLocation,
    calculateRoute,
  };

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
};
