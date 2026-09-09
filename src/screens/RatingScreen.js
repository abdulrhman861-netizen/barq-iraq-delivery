// شاشة إضافة التقييم
import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RatingContext } from '../../contexts/RatingContext';
import { AuthContext } from '../../contexts/AuthContext';
import StarRating from '../../components/StarRating';
import { COLORS, SIZES, FONT_SIZES } from '../../constants/index';

const RatingScreen = ({ route, navigation }) => {
  const { ratedUserId, ratedUserName, orderId } = route.params || {};
  const { user } = useContext(AuthContext);
  const { submitRating, isLoading } = useContext(RatingContext);

  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('general');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: 'quality', label: '🎯 الجودة' },
    { id: 'speed', label: '⚡ السرعة' },
    { id: 'communication', label: '💬 التواصل' },
    { id: 'professionalism', label: '👔 الاحترافية' },
  ];

  const handleSubmit = async () => {
    if (score === 0) {
      Alert.alert('تنبيه', 'يرجى اختيار نقييم (عدد النجوم)');
      return;
    }

    if (!user) {
      Alert.alert('خطأ', 'يجب تسجيل الدخول أولاً');
      return;
    }

    try {
      const ratingData = {
        score,
        comment: comment.trim(),
        raterId: user.id,
        raterName: user.name,
        ratedUserId,
        ratedUserName,
        orderId: orderId || null,
        category: selectedCategory || 'general',
      };

      await submitRating(ratingData);

      Alert.alert('تم بنجاح ✅', 'شكراً لتقييمك!', [
        {
          text: 'حسناً',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('خطأ', 'فشل إضافة التقييم: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* الرأس */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>إضافة تقييم</Text>
          <Text style={styles.headerSubtitle}>
            قيّم {ratedUserName || 'المستخدم'}
          </Text>
        </View>

        {/* قسم النجوم */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ ما رأيك في الخدمة؟</Text>
          <View style={styles.sectionContent}>
            <StarRating
              rating={score}
              onRatingChange={setScore}
              size="large"
            />
          </View>
        </View>

        {/* قسم الفئة */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏷️ اختر فئة التقييم (اختياري)</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === cat.id && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === cat.id && styles.categoryButtonTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* قسم التعليق */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 أضف تعليقك (اختياري)</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="شارك تجربتك مع الآخرين..."
            placeholderTextColor={COLORS.border}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={comment}
            onChangeText={setComment}
          />
          <Text style={styles.charCount}>
            {comment.length}/500 حرف
          </Text>
        </View>

        {/* ملخص التقييم */}
        {score > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>📋 ملخص التقييم</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>النقييم:</Text>
              <Text style={styles.summaryValue}>{score} / 5 نجوم</Text>
            </View>
            {selectedCategory && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>الفئة:</Text>
                <Text style={styles.summaryValue}>
                  {categories.find((c) => c.id === selectedCategory)?.label}
                </Text>
              </View>
            )}
            {comment.trim() && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>التعليق:</Text>
                <Text style={styles.summaryValue} numberOfLines={2}>
                  {comment.trim()}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* الأزرار */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !score && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!score || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>✅ إرسال التقييم</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>❌ إلغاء</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
    paddingBottom: SIZES.md,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SIZES.md,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    marginTop: SIZES.xs,
  },
  section: {
    padding: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.md,
  },
  sectionContent: {
    alignItems: 'center',
    paddingVertical: SIZES.md,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  categoryButton: {
    backgroundColor: COLORS.gray,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.darkGray,
  },
  categoryButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: COLORS.white,
  },
  commentInput: {
    backgroundColor: COLORS.gray,
    borderRadius: SIZES.sm,
    padding: SIZES.md,
    fontSize: FONT_SIZES.base,
    textAlign: 'right',
    color: COLORS.darkGray,
    minHeight: 120,
  },
  charCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginTop: SIZES.sm,
    textAlign: 'right',
  },
  summaryCard: {
    margin: SIZES.md,
    padding: SIZES.md,
    backgroundColor: COLORS.gray,
    borderRadius: SIZES.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  summaryTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.md,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  summaryValue: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primary,
    textAlign: 'right',
    flex: 1,
    marginLeft: SIZES.md,
  },
  footer: {
    flexDirection: 'row',
    gap: SIZES.md,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.gray,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  button: {
    flex: 1,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButton: {
    backgroundColor: COLORS.danger,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: 'bold',
  },
});

export default RatingScreen;
