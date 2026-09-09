// مكون لشاشة تأكيد الدفع
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PaymentSummary = ({ orderData, paymentMethod, totalAmount }) => {
  const formatAmount = (amount) => {
    return amount.toLocaleString('ar-IQ');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📋 ملخص الطلب</Text>

      {/* تفاصيل الطلب */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>التفاصيل</Text>
        <View style={styles.row}>
          <Text style={styles.label}>رقم الطلب:</Text>
          <Text style={styles.value}>{orderData?.orderId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>الحالة:</Text>
          <Text style={styles.value}>{orderData?.status}</Text>
        </View>
      </View>

      {/* الأسعار */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>السعر</Text>
        <View style={styles.row}>
          <Text style={styles.label}>سعر المنتج:</Text>
          <Text style={styles.value}>{formatAmount(orderData?.itemPrice || 0)} د.ع</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>رسوم التوصيل:</Text>
          <Text style={styles.value}>{formatAmount(orderData?.deliveryFee || 0)} د.ع</Text>
        </View>
        {orderData?.discount > 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>الخصم:</Text>
            <Text style={[styles.value, styles.discount]}>-{formatAmount(orderData.discount)} د.ع</Text>
          </View>
        )}
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>الإجمالي:</Text>
          <Text style={styles.totalAmount}>{formatAmount(totalAmount)} د.ع</Text>
        </View>
      </View>

      {/* طريقة الدفع */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>طريقة الدفع</Text>
        <View style={styles.paymentMethodBox}>
          <Text style={styles.paymentMethodText}>
            {paymentMethod?.name || paymentMethod?.type}
          </Text>
          {paymentMethod?.lastFourDigits && (
            <Text style={styles.cardDetails}>****{paymentMethod.lastFourDigits}</Text>
          )}
        </View>
      </View>

      {/* تحذير أمان */}
      <View style={styles.securityBox}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityText}>
          جميع المعاملات محمية بتشفير من الدرجة الأولى (SSL/TLS)
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'right',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'right',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  discount: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  totalRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    marginTop: 6,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  paymentMethodBox: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
  cardDetails: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    marginVertical: 16,
  },
  securityIcon: {
    fontSize: 20,
    marginHorizontal: 8,
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    color: '#2E7D32',
    textAlign: 'right',
  },
});

export default PaymentSummary;
