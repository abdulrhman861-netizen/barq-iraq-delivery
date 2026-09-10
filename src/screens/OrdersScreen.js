// screens/OrdersScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import { COLORS, SIZES, FONT_SIZES, ORDER_STATUS } from '../constants/index';

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState('all');

  // بيانات الطلبات الوهمية
  const [orders] = useState([
    {
      id: '1',
      orderNumber: '#ORD001',
      merchant: 'مطعم الأرز',
      items: '3 أطباق',
      total: 45000,
      status: ORDER_STATUS.PENDING,
      time: '10:30',
      date: 'اليوم',
      address: 'شارع الرشيد، بغداد',
    },
    {
      id: '2',
      orderNumber: '#ORD002',
      merchant: 'مخبزة الفرات',
      items: 'خبز وحلويات',
      total: 15000,
      status: ORDER_STATUS.IN_TRANSIT,
      time: '11:45',
      date: 'اليوم',
      address: 'الكرادة، بغداد',
    },
    {
      id: '3',
      orderNumber: '#ORD003',
      merchant: 'مجمع الحلويات',
      items: 'باكو وكيك',
      total: 25000,
      status: ORDER_STATUS.DELIVERED,
      time: '09:15',
      date: 'اليوم',
      address: 'المنصور، بغداد',
    },
    {
      id: '4',
      orderNumber: '#ORD004',
      merchant: 'محل الفواكه',
      items: 'فواكه طازة',
      total: 30000,
      status: ORDER_STATUS.ACCEPTED,
      time: '12:00',
      date: 'اليوم',
      address: 'بغداد الجديدة، بغداد',
    },
    {
      id: '5',
      orderNumber: '#ORD005',
      merchant: 'محل الخضار',
      items: 'خضار مشكلة',
      total: 20000,
      status: ORDER_STATUS.CANCELLED,
      time: 'أمس',
      date: 'أمس',
      address: 'الأعظمية، بغداد',
    },
  ]);

  // تصفية الطلبات حسب الحالة
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return COLORS.warning;
      case ORDER_STATUS.ACCEPTED:
        return COLORS.secondary;
      case ORDER_STATUS.IN_TRANSIT:
        return COLORS.primary;
      case ORDER_STATUS.DELIVERED:
        return COLORS.success;
      case ORDER_STATUS.CANCELLED:
        return COLORS.danger;
      default:
        return COLORS.gray;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return 'قيد الانتظار';
      case ORDER_STATUS.ACCEPTED:
        return 'مقبول';
      case ORDER_STATUS.IN_TRANSIT:
        return 'قيد التوصيل';
      case ORDER_STATUS.DELIVERED:
        return 'تم التسليم';
      case ORDER_STATUS.CANCELLED:
        return 'ملغي';
      default:
        return 'غير معروف';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return '⏳';
      case ORDER_STATUS.ACCEPTED:
        return '✅';
      case ORDER_STATUS.IN_TRANSIT:
        return '🚗';
      case ORDER_STATUS.DELIVERED:
        return '🎉';
      case ORDER_STATUS.CANCELLED:
        return '❌';
      default:
        return '📦';
    }
  };

  const handleOrderPress = (order) => {
    Alert.alert(
      order.orderNumber,
      `من: ${order.merchant}\nالعنوان: ${order.address}\nالمجموع: ${order.total} د.ع`,
      [
        { text: 'إلغاء', onPress: () => {} },
        { text: 'التفاصيل', onPress: () => {} },
      ]
    );
  };

  const renderOrderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => handleOrderPress(item)}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderMerchant}>{item.merchant}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>📦 الطلب:</Text>
          <Text style={styles.detailValue}>{item.items}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>💰 المجموع:</Text>
          <Text style={[styles.detailValue, styles.total]}>
            {item.total} د.ع
          </Text>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.timestamp}>🕐 {item.time}</Text>
        <Text style={styles.address}>📍 {item.address}</Text>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>عرض التفاصيل ›</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الطلبات</Text>
        <Text style={styles.headerSubtitle}>
          إجمالي الطلبات: {orders.length}
        </Text>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        <TabButton
          label="الكل"
          icon="📦"
          active={activeTab === 'all'}
          onPress={() => setActiveTab('all')}
          count={orders.length}
        />
        <TabButton
          label="قيد الانتظار"
          icon="⏳"
          active={activeTab === ORDER_STATUS.PENDING}
          onPress={() => setActiveTab(ORDER_STATUS.PENDING)}
          count={orders.filter(o => o.status === ORDER_STATUS.PENDING).length}
        />
        <TabButton
          label="قيد التوصيل"
          icon="🚗"
          active={activeTab === ORDER_STATUS.IN_TRANSIT}
          onPress={() => setActiveTab(ORDER_STATUS.IN_TRANSIT)}
          count={orders.filter(o => o.status === ORDER_STATUS.IN_TRANSIT).length}
        />
        <TabButton
          label="مُنجز"
          icon="✅"
          active={activeTab === ORDER_STATUS.DELIVERED}
          onPress={() => setActiveTab(ORDER_STATUS.DELIVERED)}
          count={orders.filter(o => o.status === ORDER_STATUS.DELIVERED).length}
        />
      </ScrollView>

      {/* Orders List */}
      <View style={styles.listContainer}>
        {filteredOrders.length > 0 ? (
          <FlatList
            data={filteredOrders}
            renderItem={renderOrderCard}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>لا توجد طلبات</Text>
            <Text style={styles.emptySubtitle}>
              لم تقم بأي طلبات في هذه الفئة
            </Text>
            <TouchableOpacity style={styles.createOrderButton}>
              <Text style={styles.createOrderButtonText}>إنشاء طلب جديد</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const TabButton = ({ label, icon, active, onPress, count }) => (
  <TouchableOpacity
    style={[styles.tabButton, active && styles.tabButtonActive]}
    onPress={onPress}
  >
    <Text style={styles.tabIcon}>{icon}</Text>
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
      {label}
    </Text>
    <View
      style={[styles.tabCount, active && styles.tabCountActive]}
    >
      <Text style={[styles.tabCountText, active && styles.tabCountTextActive]}>
        {count}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray,
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
  tabsContainer: {
    marginVertical: SIZES.md,
  },
  tabsContent: {
    paddingHorizontal: SIZES.md,
  },
  tabButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    marginHorizontal: SIZES.sm,
    borderRadius: 12,
    backgroundColor: COLORS.white,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabIcon: {
    fontSize: FONT_SIZES.huge,
    marginBottom: SIZES.xs,
  },
  tabLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.darkGray,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabLabelActive: {
    color: COLORS.white,
  },
  tabCount: {
    backgroundColor: COLORS.gray,
    borderRadius: 10,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    marginTop: SIZES.xs,
  },
  tabCountActive: {
    backgroundColor: COLORS.white,
  },
  tabCountText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.darkGray,
    fontWeight: 'bold',
  },
  tabCountTextActive: {
    color: COLORS.primary,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SIZES.md,
    paddingBottom: SIZES.xl,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
    paddingBottom: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  orderNumber: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  orderMerchant: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginTop: SIZES.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 10,
  },
  statusIcon: {
    fontSize: FONT_SIZES.base,
    marginRight: SIZES.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    fontWeight: '600',
  },
  orderDetails: {
    marginBottom: SIZES.md,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SIZES.xs,
  },
  detailLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  detailValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  total: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.base,
  },
  orderFooter: {
    paddingVertical: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    marginBottom: SIZES.md,
  },
  timestamp: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginBottom: SIZES.xs,
  },
  address: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.sm,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: FONT_SIZES.huge * 2,
    marginBottom: SIZES.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray,
    marginBottom: SIZES.xl,
    textAlign: 'center',
  },
  createOrderButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    borderRadius: 12,
  },
  createOrderButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: 'bold',
  },
});

export default OrdersScreen;
