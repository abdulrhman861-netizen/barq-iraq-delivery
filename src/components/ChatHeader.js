// مكون رأس الدردشة
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { COLORS, SIZES, FONT_SIZES } from '../../constants/index';

const ChatHeader = ({ contactName, isOnline, lastSeen, onBackPress }) => {
  const getStatusText = () => {
    if (isOnline) return '🟢 ناشط الآن';
    if (lastSeen) {
      const lastSeenDate = new Date(lastSeen);
      const now = new Date();
      const diffMinutes = Math.floor((now - lastSeenDate) / 60000);

      if (diffMinutes < 1) return 'للتو برهة';
      if (diffMinutes < 60) return `نشط منذ ${diffMinutes} دقيقة`;
      if (diffMinutes < 1440)
        return `نشط منذ ${Math.floor(diffMinutes / 60)} ساعة`;
      return `نشط منذ ${Math.floor(diffMinutes / 1440)} يوم`;
    }
    return 'غير متاح';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{contactName}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, isOnline && styles.statusDotOnline]} />
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🔎</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: SIZES.sm,
  },
  backButtonText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.white,
  },
  contactInfo: {
    flex: 1,
    marginHorizontal: SIZES.md,
  },
  contactName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
    marginTop: SIZES.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
  },
  statusDotOnline: {
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.9,
  },
  actionButton: {
    padding: SIZES.sm,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.lg,
  },
});

export default ChatHeader;
