import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DigitalSignature = ({ value, onSign }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>توقيع الكابتن الرقمي</Text>
      <TouchableOpacity style={styles.button} onPress={onSign}>
        <Text style={styles.buttonText}>{value ? '✅ تم التوقيع' : 'توقيع الآن'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 8, textAlign: 'right' },
  button: { backgroundColor: '#004E89', padding: 10, borderRadius: 8 },
  buttonText: { color: '#FFF', textAlign: 'center', fontWeight: '600' },
});

export default DigitalSignature;
