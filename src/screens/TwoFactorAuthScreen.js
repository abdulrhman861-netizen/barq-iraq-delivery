import React, { useContext, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SecurityContext } from '../contexts/SecurityContext';
import { AuthContext } from '../contexts/AuthContext';
import { SECURITY_CHANNELS } from '../constants/security';
import { COLORS, FONT_SIZES, SIZES } from '../constants';

const TwoFactorAuthScreen = ({ route }) => {
  const { user } = useContext(AuthContext);
  const userId = route?.params?.userId || user?.id;
  const target = route?.params?.target;
  const channel = route?.params?.channel || SECURITY_CHANNELS.SMS;

  const { sendCode, verifyCode } = useContext(SecurityContext);
  const [code, setCode] = useState('');

  const handleSendCode = async () => {
    try {
      await sendCode({ userId, channel, target });
      Alert.alert('تم', 'تم إرسال رمز التحقق');
    } catch (error) {
      Alert.alert('خطأ', error.message);
    }
  };

  const handleVerify = async () => {
    try {
      const result = await verifyCode({ userId, code });
      if (result.success) {
        Alert.alert('نجاح', 'تم التحقق بخطوتين بنجاح');
      } else {
        Alert.alert('فشل', 'الرمز غير صحيح أو منتهي');
      }
    } catch (error) {
      Alert.alert('خطأ', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>التحقق بخطوتين</Text>
        <TextInput
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
          placeholder="أدخل رمز التحقق"
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleSendCode}>
          <Text style={styles.buttonText}>إرسال الرمز</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>تأكيد</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SIZES.md },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', marginBottom: SIZES.md, color: COLORS.primary },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.sm,
    padding: SIZES.md,
    marginBottom: SIZES.md,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.sm,
    paddingVertical: SIZES.md,
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  buttonText: { color: COLORS.white, fontSize: FONT_SIZES.base, fontWeight: 'bold' },
});

export default TwoFactorAuthScreen;
