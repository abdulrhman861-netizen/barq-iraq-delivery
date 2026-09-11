import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, FONT_SIZES, SIZES } from '../../constants';
import { createRating, subscribeRecentRatings } from '../../services/firestoreWebDemo';

const RatingsPanel = ({ currentUser, setupState }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [toUserId, setToUserId] = useState('demo-captain-user');
  const [orderId, setOrderId] = useState('demo-order-1');
  const [score, setScore] = useState('5');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!setupState.isConfigured) {
      setLoading(false);
      return undefined;
    }

    return subscribeRecentRatings(
      (next) => {
        setRatings(next);
        setLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      }
    );
  }, [setupState.isConfigured]);

  const handleSubmit = async () => {
    const scoreNumber = Number(score);
    if (scoreNumber < 1 || scoreNumber > 5) {
      setError('Score must be between 1 and 5');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await createRating({
        orderId: orderId.trim() || null,
        fromUserId: currentUser.uid,
        toUserId: toUserId.trim(),
        role: currentUser.role,
        score: scoreNumber,
        comment: comment.trim(),
      });
      setComment('');
      setSuccess('Rating saved successfully');
    } catch (submitError) {
      setError(submitError.message);
      setSuccess('');
    } finally {
      setSaving(false);
    }
  };

  if (!setupState.isConfigured) {
    return <Text style={styles.placeholder}>Firebase config required for ratings.</Text>;
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Ratings</Text>
      <View style={styles.formBox}>
        <View style={styles.row}>
          <TextInput value={toUserId} onChangeText={setToUserId} style={styles.input} placeholder="toUserId" />
          <TextInput value={orderId} onChangeText={setOrderId} style={styles.input} placeholder="orderId" />
          <TextInput value={score} onChangeText={setScore} style={styles.scoreInput} keyboardType="numeric" placeholder="5" />
        </View>
        <TextInput value={comment} onChangeText={setComment} style={styles.input} placeholder="Optional comment" />
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={saving}>
          <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Submit Rating'}</Text>
        </TouchableOpacity>
      </View>

      {success ? <Text style={styles.success}>{success}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : ratings.length === 0 ? (
        <Text style={styles.empty}>No ratings yet.</Text>
      ) : (
        <FlatList
          data={ratings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemTitle}>⭐ {item.score} | {item.role}</Text>
              <Text style={styles.itemText}>from {item.fromUserId} to {item.toUserId}</Text>
              {item.comment ? <Text style={styles.itemText}>{item.comment}</Text> : null}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, gap: SIZES.sm },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.darkGray },
  formBox: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SIZES.sm, gap: SIZES.sm },
  row: { flexDirection: 'row', gap: SIZES.sm },
  input: { flex: 1, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SIZES.sm },
  scoreInput: { width: 60, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SIZES.sm },
  button: { backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: SIZES.sm, alignItems: 'center' },
  buttonText: { color: COLORS.white, fontWeight: '700' },
  success: { color: COLORS.success },
  error: { color: COLORS.danger },
  empty: { color: COLORS.gray },
  item: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SIZES.sm, marginBottom: SIZES.sm },
  itemTitle: { color: COLORS.darkGray, fontWeight: '700' },
  itemText: { color: COLORS.gray, marginTop: 4 },
  placeholder: { color: COLORS.gray },
});

export default RatingsPanel;
