// screens/TrackingScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { COLORS, SIZES, FONT_SIZES } from '../constants/index';

const { width } = Dimensions.get('window');

const TrackingScreen = ({ onOpenChat }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [driverLocation, setDriverLocation] = useState({ x: 30, y: 40 });

  // بيانات الطلبات قيد التوصيل
  const [activeOrders] = useState([
    {
      id: '1',
      orderNumber: '#ORD001',
      merchant: 'مطعم الأرز',
      driverId: 'driver_ahmed_1',
      status: 'قيد التوصيل',
      progress: 60,
      pickupLocation: 'شارع الرشيد',
      deliveryLocation: 'المنصور',
      driverName: 'أحمد محمد',
      driverPhone: '07901234567',
      driverRating: 4.8,
      eta: '5 دقائق',
      distance: '2.3 كم',
    },
    {
      id: '2',
      orderNumber: '#ORD002',
      merchant: 'مخبزة الفرات',
      driverId: 'driver_ali_1',
      status: 'تم التوصيل',
      progress: 100,
      pickupLocation: 'كركوك سنتر',
      deliveryLocation: 'الكاظمية',
      driverName: 'علي حسن',
      driverPhone: '07902345678',
      driverRating: 5.0,
      eta: 'وصل',
      distance: '0 كم',
    },
  ]);

  // محاكاة حركة السائق
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation(prev => ({
        x: prev.x + Math.random() * 3 - 1.5,
        y: prev.y + Math.random() * 3 - 1.5,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleCallDriver = (phone) => {
    Alert.alert('اتصال', `سيتم الاتصال برقم ${phone}`);
  };

  const handleChatDriver = (order) => {
    if (onOpenChat) {
      onOpenChat(order);
      return;
    }
    Alert.alert('دردشة', 'فتح نافذة الدردشة مع السائق');
  };

  const handleShareLocation = () => {
    Alert.alert('مشاركة الموقع', 'تم مشاركة موقعك مع السائق');
  };

  const renderMapSimulation = () => {
    return (
      <View style={styles.mapContainer}>
        {/* خطوط الطريق */}
        <View style={styles.mapBackground}>
          <Text style={styles.mapText}>🗺️ خريطة التتبع</Text>
          
          {/* نقطة البداية */}
          <View style={[styles.locationPin, styles.startPin]}>
            <Text style={styles.pinIcon}>📍</Text>
          </View>

          {/* موقع السائق الحالي */}
          <View
            style={[
              styles.driverPin,
              {
                left: `${Math.max(0, Math.min(100, driverLocation.x))}%`,
                top: `${Math.max(0, Math.min(100, driverLocation.y))}%`,
              },
            ]}
          >
            <Text style={styles.driverIcon}>🚗</Text>
          </View>

          {/* نقطة الوجهة */}
          <View style={[styles.locationPin, styles.endPin]}>
            <Text style={styles.pinIcon}>🏠</Text>
          </View>

          {/* خط التقدم */}
          <View style={styles.progressLine} />
        </View>
      </View>
    );
  };

  const renderOrderDetails = (order) => {
    return (
      <View key={order.id} style={styles.orderDetailsCard}>
        {/* الرأس */}
        <View style={styles.detailsHeader}>
          <View>
            <Text style={styles.orderNum}>{order.orderNumber}</Text>
            <Text style={styles.merchantName}>{order.merchant}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusIcon}>🚗</Text>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>

        {/* شريط التقدم */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[styles.progressBar, { width: `${order.progress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{order.progress}%</Text>
        </View>

        {/* معلومات الموقع */}
        <View style={styles.locationInfo}>
          <View style={styles.locationItem}>
            <Text style={styles.locationLabel}>📍 من:</Text>
            <Text style={styles.locationValue}>{order.pickupLocation}</Text>
          </View>
          <View style={styles.arrow}>
            <Text style={styles.arrowIcon}>→</Text>
          </View>
          <View style={styles.locationItem}>
            <Text style={styles.locationLabel}>🏠 إلى:</Text>
            <Text style={styles.locationValue}>{order.deliveryLocation}</Text>
          </View>
        </View>

        {/* معلومات السائق */}
        <View style={styles.driverInfo}>
          <View style={styles.driverHeader}>
            <Text style={styles.driverIcon}>👤 السائق</Text>
          </View>
          
          <View style={styles.driverCard}>
            <View style={styles.driverLeftSection}>
              <Text style={styles.driverAvatar}>👨‍🚗</Text>
            </View>

            <View style={styles.driverMiddleSection}>
              <Text style={styles.driverName}>{order.driverName}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.stars}>⭐ {order.driverRating}</Text>
              </View>
            </View>

            <View style={styles.driverRightSection}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleCallDriver(order.driverPhone)}
              >
                <Text style={styles.iconButtonText}>📞</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleChatDriver(order)}
              >
                <Text style={styles.iconButtonText}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* معلومات إضافية */}
        <View style={styles.additionalInfo}>
          <InfoRow icon="⏱️" label="الوقت المتبقي:" value={order.eta} />
          <InfoRow icon="🛣️" label="المسافة:" value={order.distance} />
        </View>

        {/* الأزرار الإجرائية */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShareLocation}>
            <Text style={styles.shareButtonText}>مشاركة الموقع 📤</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>التتبع الحي</Text>
          <Text style={styles.headerSubtitle}>
            عدد الطلبات الجارية: {activeOrders.length}
          </Text>
        </View>

        {/* Map Simulation */}
        <View style={styles.mapSection}>
          {renderMapSimulation()}
        </View>

        {/* Active Orders */}
        <View style={styles.ordersSection}>
          <Text style={styles.sectionTitle}>الطلبات قيد التوصيل</Text>
          {activeOrders.map(order => renderOrderDetails(order))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 معلومات مهمة</Text>
          <InfoBox
            icon="📞"
            title="تواصل مع السائق"
            description="يمكنك الاتصال أو إرسال رسائل للسائق مباشرة"
          />
          <InfoBox
            icon="🚫"
            title="إلغاء الطلب"
            description="يمكنك إلغاء الطلب قبل وصول السائق إليك"
          />
          <InfoBox
            icon="⭐"
            title="تقييم السائق"
            description="قيّم السائق بعد وصول الطلب"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const InfoBox = ({ icon, title, description }) => (
  <View style={styles.infoBox}>
    <Text style={styles.infoBoxIcon}>{icon}</Text>
    <View style={styles.infoBoxContent}>
      <Text style={styles.infoBoxTitle}>{title}</Text>
      <Text style={styles.infoBoxDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SIZES.xl,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.lg,
    paddingHorizontal: SIZES.md,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SIZES.xs,
    textAlign: 'right',
  },
  mapSection: {
    margin: SIZES.md,
  },
  mapContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  mapBackground: {
    width: '100%',
    height: 250,
    backgroundColor: '#E8F5E9',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    position: 'absolute',
    top: SIZES.md,
    left: SIZES.md,
  },
  locationPin: {
    position: 'absolute',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  startPin: {
    top: '20%',
    left: '20%',
  },
  endPin: {
    bottom: '20%',
    right: '20%',
  },
  pinIcon: {
    fontSize: FONT_SIZES.huge,
  },
  driverPin: {
    position: 'absolute',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  driverIcon: {
    fontSize: FONT_SIZES.huge,
  },
  progressLine: {
    position: 'absolute',
    width: '60%',
    height: 3,
    backgroundColor: COLORS.primary,
    top: '50%',
    left: '20%',
  },
  ordersSection: {
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.md,
    textAlign: 'right',
  },
  orderDetailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
    paddingBottom: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  orderNum: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  merchantName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginTop: SIZES.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 10,
  },
  statusIcon: {
    fontSize: FONT_SIZES.base,
    marginRight: SIZES.sm,
  },
  statusText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: SIZES.lg,
  },
  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: COLORS.lightGray,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: SIZES.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  progressText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    textAlign: 'right',
  },
  locationInfo: {
    marginBottom: SIZES.lg,
  },
  locationItem: {
    marginVertical: SIZES.sm,
  },
  locationLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginBottom: SIZES.xs,
  },
  locationValue: {
    fontSize: FONT_SIZES.base,
    color: COLORS.darkGray,
    fontWeight: '600',
    backgroundColor: COLORS.gray,
    padding: SIZES.sm,
    borderRadius: 8,
  },
  arrow: {
    alignItems: 'center',
    marginVertical: SIZES.sm,
  },
  arrowIcon: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.primary,
  },
  driverInfo: {
    marginBottom: SIZES.lg,
    paddingBottom: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  driverHeader: {
    marginBottom: SIZES.md,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray,
    padding: SIZES.md,
    borderRadius: 12,
  },
  driverLeftSection: {
    marginRight: SIZES.md,
  },
  driverAvatar: {
    fontSize: FONT_SIZES.huge,
  },
  driverMiddleSection: {
    flex: 1,
  },
  driverName: {
    fontSize: FONT_SIZES.base,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  ratingContainer: {
    marginTop: SIZES.xs,
  },
  stars: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.warning,
    fontWeight: '600',
  },
  driverRightSection: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.sm,
  },
  iconButtonText: {
    fontSize: FONT_SIZES.lg,
  },
  additionalInfo: {
    marginBottom: SIZES.lg,
    paddingBottom: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SIZES.sm,
  },
  infoIcon: {
    fontSize: FONT_SIZES.lg,
  },
  infoLabel: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.gray,
    marginLeft: SIZES.md,
  },
  infoValue: {
    fontSize: FONT_SIZES.base,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  actionButtons: {
    gap: SIZES.md,
  },
  shareButton: {
    backgroundColor: COLORS.success,
    paddingVertical: SIZES.md,
    borderRadius: 10,
    alignItems: 'center',
  },
  shareButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  infoSection: {
    paddingHorizontal: SIZES.md,
  },
  infoTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.md,
    textAlign: 'right',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    padding: SIZES.md,
    borderRadius: 12,
    marginBottom: SIZES.md,
  },
  infoBoxIcon: {
    fontSize: FONT_SIZES.lg,
    marginRight: SIZES.md,
  },
  infoBoxContent: {
    flex: 1,
  },
  infoBoxTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.xs,
  },
  infoBoxDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
});

export default TrackingScreen;