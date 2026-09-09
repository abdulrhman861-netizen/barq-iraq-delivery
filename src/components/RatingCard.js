// بطاقة التقييم الفردية
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { COLORS, SIZES, FONT_SIZES } from '../../constants/index';

const { width } = Dimensions.get('window');

const RatingCard = ({ rating, onHelpful }) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(rating.helpful || 0);
  const [unhelpfulCount, setUnhelpfulCount] = useState(rating.unhelpful || 0);

  const handleHelpful = () => {
    if (!isHelpful) {
      setHelpfulCount((prev) => prev + 1);
      setIsHelpful(true);
      if (onHelpful) onHelpful(rating.id, true);
    }
  };

  const handleUnhelpful = () => {
    if (!isHelpful) {
      setUnhelpfulCount((prev) => prev + 1);
      setIsHelpful(true);
      if (onHelpful) onHelpful(rating.id, false);
    }
  };

  const renderStars = () => {
    return [...Array(5).keys()].map((index) => (
      <Text
        key={index}
        style={[
          styles.star,
          { color: index < rating.score ? COLORS.warning : COLORS.border },
        ]}
      >
        ★
      </Text>
    ));
  };

  return (
    <View style={styles.card}>
      {/* الرأس */}
      <View style={styles.header}>
        <View>
          <Text style={styles.raterName}>{rating.raterName}</Text>
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
        </View>
        <Text style={styles.date}>
          {new Date(rating.createdAt).toLocaleDateString('ar-IQ')}
        </Text>
      </View>

      {/* التقييم */}
      {rating.comment && (
        <Text style={styles.comment}>{rating.comment}</Text>
      )}

      {/* الفئة */}
      {rating.category && rating.category !== 'general' && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {getCategoryLabel(rating.category)}
          </Text>
        </View>
      )}

      {/* التفاعلات */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.actionButton, isHelpful && styles.actionButtonDisabled]}
          onPress={handleHelpful}
          disabled={isHelpful}
        >
          <Text style={styles.actionButtonText}>👍 مفيد ({helpfulCount})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, isHelpful && styles.actionButtonDisabled]}
          onPress={handleUnhelpful}
          disabled={isHelpful}
        >
          <Text style={styles.actionButtonText}>👎 غير مفيد ({unhelpfulCount})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getCategoryLabel = (category) => {
  const labels = {
    quality: '🎯 الجودة',
    speed: '⚡ السرعة',
    communication: '💬 التواصل',
    cleanliness: '🧹 النظافة',
    professionalism: '👔 الاحترافية',
  };
  return labels[category] || category;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.md,
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.sm,
    padding: SIZES.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.md,
    paddingBottom: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  raterName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: SIZES.xs,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: SIZES.xs,
  },
  star: {
    fontSize: 16,
  },
  date: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  comment: {
    fontSize: FONT_SIZES.base,
    color: COLORS.darkGray,
    lineHeight: 20,
    marginVertical: SIZES.sm,
    textAlign: 'right',
  },
  categoryBadge: {
    backgroundColor: COLORS.gray,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.sm,
    alignSelf: 'flex-start',
    marginVertical: SIZES.sm,
  },
  categoryText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: SIZES.md,
    marginTop: SIZES.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    backgroundColor: COLORS.gray,
    borderRadius: SIZES.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
});

export default RatingCard;
