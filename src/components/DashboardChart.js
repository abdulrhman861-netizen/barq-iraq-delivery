import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SIZES } from '../constants';

const DashboardChart = ({ title, data = [] }) => {
  const maxValue = Math.max(...data.map((item) => Number(item.value || 0)), 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {data.length === 0 ? (
        <Text style={styles.empty}>لا توجد بيانات</Text>
      ) : (
        data.map((item) => (
          <View key={item.label} style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.bar,
                  { width: `${Math.max(6, (Number(item.value || 0) / maxValue) * 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.value}>{Number(item.value || 0)}</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gray,
    borderRadius: SIZES.sm,
    padding: SIZES.md,
    marginBottom: SIZES.md,
  },
  title: {
    fontSize: FONT_SIZES.base,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.sm,
  },
  empty: {
    color: COLORS.darkGray,
    fontSize: FONT_SIZES.sm,
  },
  row: {
    marginBottom: SIZES.sm,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.darkGray,
    marginBottom: SIZES.xs,
  },
  barBackground: {
    height: 8,
    borderRadius: 8,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  value: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.darkGray,
    marginTop: SIZES.xs,
    textAlign: 'right',
  },
});

export default DashboardChart;
