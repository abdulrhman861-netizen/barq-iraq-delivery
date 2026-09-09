// شاشة ملف المستخدم مع التقييمات
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { RatingContext } from '../../contexts/RatingContext';
import { COLORS, SIZES, FONT_SIZES } from '../../constants/index';

const UserProfileScreen = ({ route, navigation }) => {
  const { userId, userName, userRole } = route.params || {};
  const { userRatings, getRatingStats, fetchUserRatings, isLoading } = useContext(RatingContext);
  const [ratingStats, setRatingStats] = useState(null);
  const [recentRatings, setRecentRatings] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchUserRatings(userId).then((ratings) => {
        const stats = getRatingStats(ratings);
        setRatingStats(stats);
        setRecentRatings(ratings.slice(0, 3));
      });
    }
  }, [userId, fetchUserRatings, getRatingStats]);

  const renderStars = (score) => {
    return [...Array(5).keys()].map((index) => (
      <Text
        key={index}
        style={[
          styles.star,
          { color: index < score ? COLORS.warning : COLORS.border },
        ]}
      >
        ★
      </Text>
    ));
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* بطاقة الملف الشخصي */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userName?.charAt(0) || 'U'}
              </Text>
            </View>
          </View>

          <Text style={styles.userName}>{userName || 'المستخدم'}</Text>
          <Text style={styles.userRole}>
            {userRole || 'عضو'}
          </Text>

          {/* درجة التقييم الإجمالية */}
          {ratingStats && ratingStats.totalRatings > 0 && (
            <View style={styles.ratingBadge}>
              <View style={styles.ratingContent}>
                <Text style={styles.ratingScore}>
                  {ratingStats.averageRating.toFixed(1)}
                </Text>
                <View style={styles.starsContainer}>
                  {renderStars(Math.round(ratingStats.averageRating))}
                </View>
              </View>
              <Text style={styles.ratingCount}>
                {ratingStats.totalRatings} تقييم
              </Text>
            </View>
          )}
        </View>

        {/* الإحصائيات */}
        {ratingStats && ratingStats.totalRatings > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>متوسط التقييم</Text>
              <Text style={styles.statValue}>
                {ratingStats.averageRating.toFixed(1)}/5
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>إجمالي التقييمات</Text>
              <Text style={styles.statValue}>
                {ratingStats.totalRatings}
              </Text>
            </View>
          </View>
        )}

        {/* التقييمات الأخيرة */}
        {recentRatings.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>أحدث التقييمات</Text>
            {recentRatings.map((rating) => (
              <View key={rating.id} style={styles.ratingItem}>
                <View style={styles.ratingHeader}>
                  <Text style={styles.raterName}>{rating.raterName}</Text>
                  <View style={styles.ratingStars}>
                    {renderStars(rating.score)}
                  </View>
                </View>
                {rating.comment && (
                  <Text style={styles.ratingComment} numberOfLines={2}>
                    {rating.comment}
                  </Text>
                )}
                <Text style={styles.ratingDate}>
                  {new Date(rating.createdAt).toLocaleDateString('ar-IQ')}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* أزرار التفاعل */}
      <View style={styles.footer}>
        {ratingStats && ratingStats.totalRatings > 0 && (
          <TouchableOpacity
            style={[styles.button, styles.allRatingsButton]}
            onPress={() =>
              navigation.navigate('RatingsList', {
                userId,
                userName,
              })
            }
          >
            <Text style={styles.buttonText}>👁️ عرض جميع التقييمات</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.addRatingButton]}
          onPress={() =>
            navigation.navigate('Rating', {
              ratedUserId: userId,
              ratedUserName: userName,
            })
          }
        >
          <Text style={styles.buttonText}>⭐ إضافة تقييم</Text>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: COLORS.primary,
    padding: SIZES.lg,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: SIZES.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZES.huge,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  userName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  userRole: {
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SIZES.md,
  },
  ratingBadge: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.md,
    padding: SIZES.md,
    alignItems: 'center',
  },
  ratingContent: {
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  ratingScore: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: SIZES.xs,
    marginVertical: SIZES.xs,
  },
  star: {
    fontSize: 18,
  },
  ratingCount: {
    fontSize: FONT_SIZES.base,
    color: COLORS.darkGray,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: SIZES.md,
    marginHorizontal: SIZES.md,
    backgroundColor: COLORS.gray,
    borderRadius: SIZES.md,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.md,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginBottom: SIZES.xs,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  recentSection: {
    padding: SIZES.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.md,
  },
  ratingItem: {
    backgroundColor: COLORS.gray,
    borderRadius: SIZES.sm,
    padding: SIZES.md,
    marginBottom: SIZES.sm,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  raterName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: SIZES.xs,
  },
  ratingComment: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.darkGray,
    lineHeight: 18,
    marginBottom: SIZES.sm,
  },
  ratingDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
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
    borderRadius: SIZES.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allRatingsButton: {
    backgroundColor: COLORS.secondary,
  },
  addRatingButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: 'bold',
  },
});

export default UserProfileScreen;
