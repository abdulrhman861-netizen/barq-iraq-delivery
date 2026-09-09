// مكون بطاقة الإشعار
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { COLORS, SIZES, FONT_SIZES } from '../../constants/index';

const { width } = Dimensions.get('window');

const NotificationCard = ({ notification, onPress, onDismiss }) => {
  const getColorByType = (type) => {
    const typeColors = {
      order_created: COLORS.accent,
      order_accepted: COLORS.primary,
      order_delivered: COLORS.success,
      chat_message: COLORS.secondary,
      rating_received: COLORS.warning,
      payment_received: COLORS.success,
      system_alert: COLORS.danger,
    };
    return typeColors[type] || COLORS.primary;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / 60000);

    if (diffMinutes < 1) return 'للتو';
    if (diffMinutes < 60) return `${diffMinutes}د`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}س`;
    return date.toLocaleDateString('ar-IQ');
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        !notification.isRead && styles.cardUnread,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.leftBorder,
          { backgroundColor: getColorByType(notification.type) },
        ]}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>{notification.icon}</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {notification.title}
            </Text>
            <Text style={styles.time}>{formatTime(notification.timestamp)}</Text>
          </View>
        </View>

        <Text style={styles.body} numberOfLines={2}>
          {notification.body}
        </Text>

        {notification.action && (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={onPress}>
              <Text style={styles.actionButtonText}>عرض</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
              <Text style={styles.dismissButtonText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.sm,
    borderRadius: SIZES.md,
    flexDirection: 'row',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardUnread: {
    backgroundColor: COLORS.gray,
  },
  leftBorder: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: SIZES.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SIZES.md,
    marginBottom: SIZES.sm,
  },
  icon: {
    fontSize: FONT_SIZES.xl,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.base,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.xs,
  },
  time: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
  },
  body: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.darkGray,
    lineHeight: 18,
    marginBottom: SIZES.sm,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.sm,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
  dismissButton: {
    flex: 1,
    backgroundColor: COLORS.border,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.sm,
    alignItems: 'center',
  },
  dismissButtonText: {
    color: COLORS.darkGray,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
});

export default NotificationCard;
