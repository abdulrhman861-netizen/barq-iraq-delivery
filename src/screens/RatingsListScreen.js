// قائمة التقييمات
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { RatingContext } from '../../contexts/RatingContext';
import RatingCard from '../../components/RatingCard';
import { COLORS, SIZES, FONT_SIZES } from '../../constants/index';

const { width } = Dimensions.get('window');

const RatingsListScreen = ({ route, navigation }) => {
  const { userId, userName } = route.params || {};
  const { userRatings, listenToUserRatings, getRatingStats, isLoading } = useContext(RatingContext);
  const [filteredRatings, setFilteredRatings] = useState([]);
  const [selectedScore, setSelectedScore] = useState(null);
  const [ratingStats, setRatingStats] = useState(null);

  useEffect(() => {
    if (userId) {
      const unsubscribe = listenToUserRatings(userId, (ratings) => {
        setFilteredRatings(ratings);
        const stats = getRatingStats(ratings);
        setRatingStats(stats);
      });

      return () => unsubscribe();
    }
  }, [userId, listenToUserRatings, getRatingStats]);

  const handleFilterByScore = (score) => {
    if (selectedScore === score) {
      setSelectedScore(null);
      setFilteredRatings(userRatings[userId] || []);
    } else {
      setSelectedScore(score);
      const ratings = userRatings[userId] || [];
      setFilteredRatings(ratings.filter((r) => r.score === score));
    }
  };

  const renderRatingDistribution = () => {
    if (!ratingStats) return null;

    return (
      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <View style={styles.averageRatingContainer}>
            <Text style={styles.averageRating}>
              {ratingStats.averageRating.toFixed(1)}
            </Text>
            <View style={styles.starsContainer}>
              {[...Array(5).keys()].map((index) => (
                <Text
                  key={index}
                  style={[
                    styles.starSmall,
                    {
                      color:
                        index < Math.round(ratingStats.averageRating)
                          ? COLORS.warning
                          : COLORS.border,
                    },
                  ]}
                >
                  ★
                </Text>
              ))}
            </View>
            <Text style={styles.totalRatings}>
              {ratingStats.totalRatings} تقييم
            </Text>
          </View>

          <View style={styles.distributionContainer}>
            {[5, 4, 3, 2, 1].map((score) => (
              <TouchableOpacity
                key={score}
                style={[
                  styles.distributionRow,
                  selectedScore === score && styles.distributionRowSelected,
                ]}
                onPress={() => handleFilterByScore(score)}
              >
                <Text style={styles.distributionScore}>{score}★</Text>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        width: `${ratingStats.percentages[score]}%`,
                        backgroundColor: COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.distributionPercent}>
                  {ratingStats.percentages[score]}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>⭐ لا توجد تقييمات حتى الآن</Text>
        <Text style={styles.emptySubtitle}>
          كن أول من يقيم {userName || 'هذا المستخدم'}
        </Text>
        <TouchableOpacity
          style={styles.addRatingButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.addRatingButtonText}>إضافة تقييم</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading && !filteredRatings.length) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* الرأس */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>التقييمات</Text>
        <Text style={styles.headerSubtitle}>
          تقييمات {userName || 'المستخدم'}
        </Text>
      </View>

      {/* إحصائيات التقييم */}
      {ratingStats && ratingStats.totalRatings > 0 && renderRatingDistribution()}

      {/* قائمة التقييمات */}
      {filteredRatings.length > 0 ? (
        <FlatList
          data={filteredRatings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RatingCard rating={item} onHelpful={() => {}} />
          )}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  statsCard: {
    margin: SIZES.md,
    backgroundColor: COLORS.gray,
    borderRadius: SIZES.md,
    padding: SIZES.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsHeader: {
    gap: SIZES.md,
  },
  averageRatingContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  averageRating: {
    fontSize: FONT_SIZES.huge,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: SIZES.xs,
    marginVertical: SIZES.sm,
  },
  starSmall: {
    fontSize: 20,
  },
  totalRatings: {
    fontSize: FONT_SIZES.base,
    color: COLORS.darkGray,
  },
  distributionContainer: {
    gap: SIZES.sm,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.sm,
  },
  distributionRowSelected: {
    backgroundColor: COLORS.gray,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  distributionScore: {
    fontSize: FONT_SIZES.base,
    fontWeight: 'bold',
    color: COLORS.warning,
    width: 35,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: SIZES.xs,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: SIZES.xs,
  },
  distributionPercent: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.darkGray,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  listContent: {
    paddingVertical: SIZES.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray,
    marginBottom: SIZES.md,
    textAlign: 'center',
  },
  addRatingButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.md,
  },
  addRatingButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: 'bold',
  },
});

export default RatingsListScreen;
