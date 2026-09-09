import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import ReportGenerator from '../components/ReportGenerator';
import { isBiometricAvailable, authenticateWithBiometric } from '../services/biometricService';

const BiometricAuthScreen = () => {
  const [status, setStatus] = useState('جاهز');

  const login = async () => {
    const available = await isBiometricAvailable();
    if (!available) {
      setStatus('غير متوفر');
      return;
    }

    const result = await authenticateWithBiometric();
    const nextStatus = result.success ? 'تم التحقق' : 'فشل';
    setStatus(nextStatus);
    Alert.alert(result.success ? 'نجاح' : 'فشل', `الحالة: ${nextStatus}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5', padding: 12 }}>
      <Text style={{ fontWeight: '700', fontSize: 20, marginBottom: 10, textAlign: 'right' }}>المصادقة البيومترية</Text>
      <Text style={{ marginBottom: 10, textAlign: 'right' }}>الحالة: {status}</Text>
      <ReportGenerator onGenerate={login} />
    </View>
  );
};

export default BiometricAuthScreen;
