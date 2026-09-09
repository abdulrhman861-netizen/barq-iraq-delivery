// مكون بطاقة الطلب مع معلومات التتبع
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { COLORS, SIZES, FONT_SIZES } from '../../constants/index';

const { width } = Dimensions.get('window');

const OrderTrackingCard = ({ order, onTrack, onDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return COLORS.warning;
      case 'accepted':
        return COLORS.accent;
      case 'in_transit':
        return COLORS.primary;
      case 'delivered':
        return COLORS.success;
      default:
        return COLORS.gray;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'قيد الانتظار',
      accepted: 'مقبول',
      in_transit: 'قيد التوصيل',
      delivered: 'تم التسليم',
    };
    return statusMap[status] || status;
  };

  return (
    <View style={styles.card}>
      {/* الرأس */}
      <View style={styles.header}>
        <View>
          <Text style={styles.orderId}>طلب #{order.id}</Text>
          <Text style={styles.timestamp}>
            {new Date(order.createdAt).toLocaleDateString('ar-IQ')}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(order.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
      </View>

      {/* المحتوى */}
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>من:</Text>
          <Text style={styles.value} numberOfLines={1}>
            {order.merchantName}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>إلى:</Text>
          <Text style={styles.value} numberOfLines={1}>
            {order.customerAddress}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>السعر:</Text>
          <Text style={[styles.value, { color: COLORS.success }]}>
            {order.totalToCollect} د.ع
          </Text>
        </View>

        {order.status === 'in_transit' && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>السائق:</Text>
            <Text style={styles.value}>{order.captainName || 'جاري التخصيص'}</Text>
          </View>
        )}
      </View>

      {/* الأزرار */}
      <View style={styles.footer}>
        {order.status === 'in_transit' && (
          <TouchableOpacity
            style={[styles.button, styles.trackButton]}
            onPress={() => onTrack(order.id)}
          >
            <Text style={styles.buttonText}>🗺️ تتبع</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.detailsButton]}
          onPress={() => onDetails(order.id)}
        >
          <Text style={styles.buttonText}>📋 التفاصيل</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.md,
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.sm,
    padding: SIZES.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
    paddingBottom: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  orderId: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  timestamp: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginTop: SIZES.xs,
  },
  statusBadge: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.sm,
  },
  statusText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
  content: {
    marginVertical: SIZES.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.sm,
  },
  label: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.darkGray,
    width: '25%',
  },
  value: {
    fontSize: FONT_SIZES.base,
    color: COLORS.darkGray,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: SIZES.sm,
    marginTop: SIZES.md,
  },
  button: {
    flex: 1,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackButton: {
    backgroundColor: COLORS.primary,
  },
  detailsButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
});

export default OrderTrackingCard;
