// مكون مدخل الرسالة
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { COLORS, SIZES, FONT_SIZES } from '../../constants/index';

const MessageInput = ({ onSendMessage, onTyping, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleChange = (text) => {
    setMessage(text);
    if (onTyping) {
      onTyping(text.length > 0);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}
    >
      <View style={styles.container}>
        <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
          <TouchableOpacity style={styles.attachButton}>
            <Text style={styles.attachButtonText}>📎</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="اكتب رسالتك..."
            placeholderTextColor={COLORS.border}
            value={message}
            onChangeText={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            multiline
            maxLength={500}
            textAlign="right"
          />

          <TouchableOpacity
            style={[styles.emojiButton, message.trim() && styles.emojiButtonHidden]}
          >
            <Text style={styles.emojiButtonText}>😀</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            (!message.trim() || isLoading) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!message.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>✅</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SIZES.md,
    alignItems: 'flex-end',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray,
    borderRadius: SIZES.lg,
    paddingHorizontal: SIZES.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
  },
  attachButton: {
    padding: SIZES.sm,
  },
  attachButtonText: {
    fontSize: FONT_SIZES.lg,
  },
  input: {
    flex: 1,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    fontSize: FONT_SIZES.base,
    color: COLORS.darkGray,
    maxHeight: 100,
  },
  emojiButton: {
    padding: SIZES.sm,
  },
  emojiButtonHidden: {
    display: 'none',
  },
  emojiButtonText: {
    fontSize: FONT_SIZES.lg,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: FONT_SIZES.lg,
  },
});

export default MessageInput;
