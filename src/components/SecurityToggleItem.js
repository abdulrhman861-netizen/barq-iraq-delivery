import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SIZES } from '../constants';

const SecurityToggleItem = ({ label, value, onValueChange }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={Boolean(value)}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.border, true: COLORS.primary }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.darkGray,
    marginRight: SIZES.md,
  },
});

export default SecurityToggleItem;
