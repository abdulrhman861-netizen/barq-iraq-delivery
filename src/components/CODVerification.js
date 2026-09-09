import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const CODVerification = ({ verified, onToggle }) => (
  <View style={styles.container}>
    <Text style={styles.label}>التحقق من هوية المستلم</Text>
    <Switch value={verified} onValueChange={onToggle} />
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  label: { fontSize: 14 },
});

export default CODVerification;
