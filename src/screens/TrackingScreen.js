// شاشة تتبع الطلب الحي
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { TrackingContext } from '../../contexts/TrackingContext';
import { OrderContext } from '../../contexts/OrderContext';
import LiveTrackingMap from '../../components/LiveTrackingMap';
import { COLORS, SIZES, FONT_SIZES } from '../../constants/index';

const TrackingScreen = ({ route, navigation }) => {
  const { orderId } = route.params || {};
  const { captainLocation, isTracking, eta, distance, startCaptainTracking, stopTracking, getCaptainLocationFromDB } = useContext(TrackingContext);
  const { orders } = useContext(OrderContext);
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unwatch, setUnwatch] = useState(null);

  useEffect(() => {
    if (orders && orderId) {
      const foundOrder = orders.find((o) => o.id === orderId);
      setOrder(foundOrder);
      setIsLoading(false);
    }
  }, [orders, orderId]);

  useEffect(() => {
    if (order && order.captainId && !isTracking) {
      startTracking();
    }

    return () => {
      if (unwatch) {
        stopTracking(unwatch);
      }
    };
  }, [order]);

  const startTracking = async () => {
    try {
      if (order && order.captainId) {
        const unwatchFn = await startCaptainTracking(order.captainId);
        setUnwatch(unwatchFn);
      }
    } catch (error) {
      Alert.alert('خطأ', 'فشل بدء التتبع');
      console.error('❌ Error starting tracking:', error);
    }
  };

  const handleStopTracking = () => {
    if (unwatch) {
      stopTracking(unwatch);
      setUnwatch(null);
      Alert.alert('تم', 'تم إيقاف التتبع');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>لم يتم العثور على الطلب</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>العودة</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>تتبع الطلب #{order.id}</Text>
        <Text style={styles.headerSubtitle}>
          {isTracking ? '🟢 قيد التتبع' : '⚫ غير مفعل'}
        </Text>
      </View>

      {/* الخريطة */}
      <LiveTrackingMap
        merchantLat={order.merchantLat}
        merchantLng={order.merchantLng}
        captainLat={captainLocation?.latitude}
        captainLng={captainLocation?.longitude}
        customerLat={order.customerLat}
        customerLng={order.customerLng}
        orderId={orderId}
      />

      {/* معلومات تفصيلية */}
      <ScrollView style={styles.infoContainer}>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>📍 معلومات التتبع</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.label}>المسافة المتبقية:</Text>
            <Text style={styles.value}>{distance ? `${distance} كم` : 'جاري الحساب...'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>الوقت المتوقع:</Text>
            <Text style={styles.value}>{eta ? `${eta} دقيقة` : 'جاري الحساب...'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>حالة الطلب:</Text>
            <Text style={[styles.value, { color: COLORS.warning }]}>
              {order.status}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>👤 بيانات الكابتن</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.label}>الاسم:</Text>
            <Text style={styles.value}>{order.captainName || 'غير محدد'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>الهاتف:</Text>
            <Text style={styles.value}>{order.captainPhone || 'غير محدد'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>المركبة:</Text>
            <Text style={styles.value}>{order.vehicleType || 'غير محددة'}</Text>
          </View>
        </View>
      </ScrollView>

      {/* أزرار التحكم */}
      <View style={styles.buttonContainer}>
        {isTracking ? (
          <TouchableOpacity
            style={[styles.button, styles.stopButton]}
            onPress={handleStopTracking}
          >
            <Text style={styles.buttonText}>🛑 إيقاف التتبع</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={startTracking}
          >
            <Text style={styles.buttonText}>▶️ بدء التتبع</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>← رجوع</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray,
  },
  loadingText: {
    marginTop: SIZES.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.darkGray,
  },
  header: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    marginTop: SIZES.xs,
  },
  infoContainer: {
    flex: 1,
    padding: SIZES.md,
  },
  infoSection: {
    marginBottom: SIZES.md,
    backgroundColor: COLORS.gray,
    padding: SIZES.md,
    borderRadius: SIZES.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.sm,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontSize: FONT_SIZES.base,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  value: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.danger,
    marginBottom: SIZES.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: SIZES.md,
    gap: SIZES.md,
  },
  button: {
    flex: 1,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: COLORS.success,
  },
  stopButton: {
    backgroundColor: COLORS.danger,
  },
  backButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: 'bold',
  },
});

export default TrackingScreen;
