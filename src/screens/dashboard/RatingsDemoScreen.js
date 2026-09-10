import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { COLORS, FONT_SIZES, SIZES } from '../../constants';
import { fetchRecentRatings, submitRatingRecord } from '../../services/firestoreDemo';

const starList = [1, 2, 3, 4, 5];

const RatingsDemoScreen = ({ userId, role, onBack }) => {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await fetchRecentRatings(15);
      setList(data);
    } catch (e) {
      setError(e?.message || 'تعذر تحميل التقييمات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!score) {
      setError('اختر عدد النجوم أولاً');
      return;
    }

    setError('');
    try {
      await submitRatingRecord({
        orderId: 'demo-order-1',
        fromUserId: userId,
        toUserId: 'demo-driver-1',
        role,
        score,
        comment: comment.trim(),
      });
      setScore(0);
      setComment('');
      await load();
    } catch (e) {
      setError(e?.message || 'فشل الإرسال');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>‹ العودة للوحة</Text>
      </TouchableOpacity>
      <Text style={styles.title}>التقييمات</Text>

      <View style={styles.starsRow}>
        {starList.map((star) => (
          <TouchableOpacity key={star} onPress={() => setScore(star)}>
            <Text style={[styles.star, score >= star && styles.starActive]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        value={comment}
        onChangeText={setComment}
        style={styles.input}
        placeholder="تعليق اختياري"
        placeholderTextColor={COLORS.border}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.submit} onPress={submit}>
        <Text style={styles.submitText}>إرسال التقييم</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>أحدث التقييمات</Text>
      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.empty}>لا توجد تقييمات</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardScore}>{item.score} / 5</Text>
              <Text style={styles.cardText}>{item.comment || 'بدون تعليق'}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: SIZES.md, backgroundColor: COLORS.white },
  back: { color: COLORS.primary, fontWeight: '700', marginBottom: SIZES.sm },
  title: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', marginBottom: SIZES.sm, textAlign: 'right' },
  starsRow: { flexDirection: 'row', marginBottom: SIZES.sm },
  star: { fontSize: 32, color: COLORS.border, marginRight: SIZES.sm },
  starActive: { color: COLORS.warning },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: SIZES.sm, marginBottom: SIZES.sm },
  error: { color: COLORS.danger, textAlign: 'right', marginBottom: SIZES.sm },
  submit: { backgroundColor: COLORS.primary, borderRadius: 10, padding: SIZES.sm, alignItems: 'center', marginBottom: SIZES.md },
  submitText: { color: COLORS.white, fontWeight: '700' },
  subtitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', marginBottom: SIZES.sm, textAlign: 'right' },
  empty: { color: COLORS.gray, textAlign: 'center', marginTop: SIZES.md },
  card: { backgroundColor: COLORS.gray, padding: SIZES.sm, borderRadius: 10, marginBottom: SIZES.xs },
  cardScore: { fontWeight: '700' },
  cardText: { color: COLORS.darkGray },
});

export default RatingsDemoScreen;
