import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import QRCodeGenerator from '../components/QRCodeGenerator';
import ReportGenerator from '../components/ReportGenerator';
import { startTwoFactorChallenge } from '../services/twoFactorAuthService';

const TwoFactorSetupScreen = () => {
  const [target, setTarget] = useState('user@example.com');

  const setup = () => {
    const challenge = startTwoFactorChallenge({ userId: 'demo', method: 'email', target });
    Alert.alert('تم الإعداد', `OTP: ${challenge.code}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5', padding: 12 }}>
      <Text style={{ fontWeight: '700', fontSize: 20, marginBottom: 10, textAlign: 'right' }}>إعداد المصادقة الثنائية</Text>
      <TextInput value={target} onChangeText={setTarget} style={{ backgroundColor: '#FFF', borderRadius: 8, padding: 10, marginBottom: 10, textAlign: 'right' }} />
      <QRCodeGenerator value={`otpauth://barq/demo?target=${encodeURIComponent(target)}`} />
      <ReportGenerator onGenerate={setup} />
    </View>
  );
};

export default TwoFactorSetupScreen;
