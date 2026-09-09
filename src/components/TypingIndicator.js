// مكون مئشر الكتابة
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { COLORS, SIZES, FONT_SIZES } from '../../constants/index';

const TypingIndicator = ({ typingUsers }) => {
  const [dotAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(dotAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [dotAnim]);

  if (!typingUsers || Object.keys(typingUsers).length === 0) {
    return null;
  }

  const typingNames = Object.values(typingUsers).join(', ');

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.typingText}>{typingNames}</Text>
        <View style={styles.dotsContainer}>
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dotAnim,
              },
            ]}
          >
            <Text style={styles.dot}>•</Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: Animated.add(
                  Animated.multiply(dotAnim, -1),
                  1
                ),
              },
            ]}
          >
            <Text style={styles.dot}>•</Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: Animated.add(
                  Animated.multiply(
                    Animated.add(
                      Animated.multiply(dotAnim, -1),
                      1
                    ),
                    -1
                  ),
                  1
                ),
              },
            ]}
          >
            <Text style={styles.dot}>•</Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.sm,
    marginHorizontal: SIZES.md,
    alignItems: 'flex-start',
  },
  bubble: {
    backgroundColor: COLORS.gray,
    borderRadius: SIZES.md,
    borderBottomLeftRadius: SIZES.xs,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  typingText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: SIZES.xs,
  },
  dot: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.primary,
  },
});

export default TypingIndicator;
