import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import PaymentGatewayButton from '../components/PaymentGatewayButton';
import PaymentGatewayStatus from '../components/PaymentGatewayStatus';
import { chargeStripeCard, handleStripeError } from '../services/stripeService';

const StripePaymentScreen = () => {
  const [amount, setAmount] = useState('0');
  const [status, setStatus] = useState('جاهز');

  const handleCharge = async () => {
    try {
      const transaction = await chargeStripeCard({ amount: Number(amount), cardToken: 'tok_mock' });
      setStatus(transaction.status);
      Alert.alert('نجاح', `تم إنشاء معاملة Stripe: ${transaction.id}`);
    } catch (error) {
      const parsed = handleStripeError(error);
      setStatus(parsed.status);
      Alert.alert('فشل', parsed.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stripe Payment</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} placeholder="قيمة الدفع" />
      <PaymentGatewayButton label="دفع عبر Stripe" onPress={handleCharge} />
      <PaymentGatewayStatus status={status} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FAFAFA' },
  title: { fontWeight: '700', fontSize: 18, marginBottom: 12, textAlign: 'right' },
  input: { backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#DDD', padding: 10, marginBottom: 10, textAlign: 'right' },
});

export default StripePaymentScreen;
