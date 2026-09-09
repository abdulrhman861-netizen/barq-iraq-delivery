import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SIZES } from '../constants';

const SecurityEventCard = ({ event }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.type}>{event.eventType}</Text>
      <Text style={styles.time}>{event.createdAt}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SIZES.sm,
    borderRadius: SIZES.sm,
    backgroundColor: COLORS.gray,
    marginBottom: SIZES.xs,
  },
  type: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  time: {
    marginTop: SIZES.xs,
    fontSize: FONT_SIZES.xs,
    color: COLORS.secondary,
  },
});

export default SecurityEventCard;
