// مكون النجوم التفاعلي لتقييم المنتج
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONT_SIZES } from '../../constants/index';

const StarRating = ({ rating = 0, onRatingChange, readOnly = false, size = 'medium' }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSize = size === 'large' ? 40 : size === 'small' ? 20 : 30;
  const displayRating = hoverRating || rating;

  const renderStars = () => {
    return [
      ...Array(5).keys(),
    ].map((index) => (
      <TouchableOpacity
        key={index}
        disabled={readOnly}
        onPress={() => onRatingChange && onRatingChange(index + 1)}
        onMouseEnter={() => !readOnly && setHoverRating(index + 1)}
        onMouseLeave={() => setHoverRating(0)}
        style={styles.starButton}
      >
        <Text
          style={[
            styles.star,
            {
              fontSize: starSize,
              color: index < displayRating ? COLORS.warning : COLORS.border,
            },
          ]}
        >
          ★
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {renderStars()}
      </View>
      {displayRating > 0 && (
        <Text style={styles.ratingText}>
          {displayRating} / 5
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: SIZES.sm,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  starButton: {
    padding: SIZES.xs,
  },
  star: {
    textAlign: 'center',
  },
  ratingText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.warning,
    marginTop: SIZES.sm,
  },
});

export default StarRating;
