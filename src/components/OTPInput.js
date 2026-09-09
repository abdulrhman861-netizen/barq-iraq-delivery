import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const OTPInput = ({ value, onChangeText }) => (
  <TextInput
    style={styles.input}
    value={value}
    onChangeText={onChangeText}
    keyboardType="number-pad"
    maxLength={6}
    placeholder="ادخل رمز OTP"
    textAlign="center"
  />
);

const styles = StyleSheet.create({
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, fontSize: 18, letterSpacing: 6 },
});

export default OTPInput;
