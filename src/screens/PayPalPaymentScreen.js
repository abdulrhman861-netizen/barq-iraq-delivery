import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import PaymentGatewayButton from '../components/PaymentGatewayButton';
import PaymentGatewayStatus from '../components/PaymentGatewayStatus';
import { createPayPalPayment, capturePayPalPayment } from '../services/paypalService';

const PayPalPaymentScreen = () => {
  const [amount, setAmount] = useState('0');
  const [status, setStatus] = useState('جاهز');

  const handlePay = async () => {
    try {
      const created = await createPayPalPayment({ amount: Number(amount), walletId: 'wallet_mock' });
      const captured = await capturePayPalPayment(created);
      setStatus(captured.status);
      Alert.alert('نجاح', `تم إتمام معاملة PayPal: ${captured.id}`);
    } catch (error) {
      setStatus('failed');
      Alert.alert('فشل', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PayPal Payment</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} placeholder="قيمة الدفع" />
      <PaymentGatewayButton label="دفع عبر PayPal" onPress={handlePay} />
      <PaymentGatewayStatus status={status} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FAFAFA' },
  title: { fontWeight: '700', fontSize: 18, marginBottom: 12, textAlign: 'right' },
  input: { backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#DDD', padding: 10, marginBottom: 10, textAlign: 'right' },
});

export default PayPalPaymentScreen;
