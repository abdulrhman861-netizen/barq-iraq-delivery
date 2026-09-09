// مكون فقاعة الرسالة
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
const BUBBLE_MAX_WIDTH = width * 0.75;

const ChatBubble = ({ message, isOwnMessage, onLongPress }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ar-IQ', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.ownContainer : styles.otherContainer,
      ]}
    >
      {!isOwnMessage && (
        <Text style={styles.senderName}>{message.senderName}</Text>
      )}

      <TouchableOpacity
        style={[
          styles.bubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble,
        ]}
        onLongPress={() => onLongPress?.(message.id)}
      >
        {message.type === 'text' && (
          <Text
            style={[
              styles.messageText,
              isOwnMessage && styles.ownMessageText,
            ]}
          >
            {message.text}
          </Text>
        )}

        {message.type === 'image' && message.attachmentUrl && (
          <Text style={styles.messageText}>🖼️ رسالة صورة</Text>
        )}

        {message.type === 'location' && message.attachmentUrl && (
          <Text style={styles.messageText}>🗺️ رسالة موقع</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.timestamp}>
          {formatTime(message.timestamp)}
        </Text>
        {isOwnMessage && (
          <Text style={styles.readStatus}>
            {message.isRead ? '✓✓' : '✓'}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.sm,
    marginHorizontal: SIZES.md,
    flexDirection: 'column',
  },
  ownContainer: {
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    fontWeight: '600',
    marginBottom: SIZES.xs,
  },
  bubble: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.md,
    maxWidth: BUBBLE_MAX_WIDTH,
  },
  ownBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: SIZES.xs,
  },
  otherBubble: {
    backgroundColor: COLORS.gray,
    borderBottomLeftRadius: SIZES.xs,
  },
  messageText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.darkGray,
    textAlign: 'right',
  },
  ownMessageText: {
    color: COLORS.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: SIZES.xs,
    marginTop: SIZES.xs,
    marginHorizontal: SIZES.sm,
  },
  timestamp: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
  },
  readStatus: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default ChatBubble;
