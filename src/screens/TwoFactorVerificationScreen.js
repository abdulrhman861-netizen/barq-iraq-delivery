import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import OTPInput from '../components/OTPInput';
import ReportGenerator from '../components/ReportGenerator';
import { verifyTwoFactorChallenge } from '../services/twoFactorAuthService';

const TwoFactorVerificationScreen = () => {
  const [otp, setOtp] = useState('');

  const verify = () => {
    const result = verifyTwoFactorChallenge({ userId: 'demo', target: 'user@example.com', code: otp });
    Alert.alert(result.success ? 'نجاح' : 'فشل', result.success ? 'تم التحقق بنجاح' : result.reason);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5', padding: 12 }}>
      <Text style={{ fontWeight: '700', fontSize: 20, marginBottom: 10, textAlign: 'right' }}>التحقق بخطوتين</Text>
      <OTPInput value={otp} onChangeText={setOtp} />
      <ReportGenerator onGenerate={verify} />
    </View>
  );
};

export default TwoFactorVerificationScreen;
