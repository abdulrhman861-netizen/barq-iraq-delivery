// مكون لاختيار طريقة الدفع
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { PAYMENT_METHODS } from '../constants/payment';

const PaymentMethodSelector = ({ methods = [], selectedMethod, onSelectMethod }) => {
  const paymentMethodNames = {
    [PAYMENT_METHODS.CASH]: '💵 الدفع عند الاستلام',
    [PAYMENT_METHODS.CARD]: '🏧 بطاقة ائتمان/خصم',
    [PAYMENT_METHODS.WALLET]: '💰 المحفظة الرقمية',
    [PAYMENT_METHODS.PAYPAL]: '🅿️ PayPal',
    [PAYMENT_METHODS.STRIPE]: '💳 Stripe',
    [PAYMENT_METHODS.TELEBIRR]: '📱 Telebirr',
  };

  const renderMethod = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.methodCard,
        selectedMethod?.id === item.id && styles.selectedCard,
      ]}
      onPress={() => onSelectMethod(item)}
    >
      <View style={styles.methodContent}>
        <Text style={styles.methodName}>
          {paymentMethodNames[item.type] || item.type}
        </Text>
        {item.lastFourDigits && (
          <Text style={styles.cardDetails}>****{item.lastFourDigits}</Text>
        )}
      </View>
      {selectedMethod?.id === item.id && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>اختر طريقة الدفع</Text>
      <FlatList
        data={methods}
        renderItem={renderMethod}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'right',
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  selectedCard: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F0',
  },
  methodContent: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  cardDetails: {
    fontSize: 12,
    color: '#999',
  },
  checkmark: {
    fontSize: 24,
    color: '#FF6B35',
    fontWeight: 'bold',
  },
});

export default PaymentMethodSelector;
