import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SIZES } from '../constants';

const DashboardStatCard = ({ title, value, icon = '📊' }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.gray,
    borderRadius: SIZES.sm,
    padding: SIZES.md,
    marginBottom: SIZES.sm,
  },
  icon: {
    fontSize: FONT_SIZES.xl,
    marginBottom: SIZES.xs,
  },
  title: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.darkGray,
  },
  value: {
    marginTop: SIZES.xs,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default DashboardStatCard;
