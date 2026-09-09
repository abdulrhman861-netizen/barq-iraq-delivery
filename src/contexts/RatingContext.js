// Context لإدارة التقييمات والتقيمات
import React, { createContext, useState, useCallback } from 'react';
import { addRating, getUserRatings, listenToData, readData } from '../services/firebase';
import { FIREBASE_PATHS } from '../constants/firebase';
import { RATING_SYSTEM } from '../constants/index';

export const RatingContext = createContext();

export const RatingProvider = ({ children }) => {
  const [ratings, setRatings] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // إضافة تقييم جديد
  const submitRating = useCallback(async (ratingData) => {
    try {
      setIsLoading(true);
      setError(null);

      const ratingId = Date.now().toString();
      const newRating = {
        id: ratingId,
        score: Math.min(RATING_SYSTEM.MAX_RATING, Math.max(RATING_SYSTEM.MIN_RATING, ratingData.score)),
        comment: ratingData.comment || '',
        raterId: ratingData.raterId,
        raterName: ratingData.raterName,
        ratedUserId: ratingData.ratedUserId,
        ratedUserName: ratingData.ratedUserName,
        orderId: ratingData.orderId || null,
        category: ratingData.category || 'general', // quality, speed, communication, etc.
        createdAt: new Date().toISOString(),
        helpful: 0,
        unhelpful: 0,
      };

      await addRating(ratingId, newRating);
      setRatings((prev) => [newRating, ...prev]);

      // تحديث متوسط التقييم للمستخدم
      await updateUserAverageRating(ratingData.ratedUserId);

      console.log('✅ Rating submitted successfully:', ratingId);
      return newRating;
    } catch (err) {
      const errorMessage = err.message || 'خطأ في إضافة التقييم';
      setError(errorMessage);
      console.error('❌ Error submitting rating:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // جلب تقييمات المستخدم
  const fetchUserRatings = useCallback(async (userId) => {
    try {
      setIsLoading(true);
      const data = await readData(FIREBASE_PATHS.RATINGS);
      
      if (data) {
        const userRatingsArray = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .filter((rating) => rating.ratedUserId === userId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setUserRatings((prev) => ({
          ...prev,
          [userId]: userRatingsArray,
        }));
        
        return userRatingsArray;
      }
      return [];
    } catch (err) {
      setError(err.message);
      console.error('❌ Error fetching user ratings:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // الاستماع إلى التقييمات بشكل حي
  const listenToUserRatings = useCallback((userId, callback) => {
    const unsubscribe = listenToData(FIREBASE_PATHS.RATINGS, (data) => {
      if (data) {
        const userRatingsArray = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .filter((rating) => rating.ratedUserId === userId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setUserRatings((prev) => ({
          ...prev,
          [userId]: userRatingsArray,
        }));
        
        if (callback) callback(userRatingsArray);
      }
    });
    return unsubscribe;
  }, []);

  // حساب متوسط التقييم
  const calculateAverageRating = useCallback((userRatingsArray) => {
    if (!userRatingsArray || userRatingsArray.length === 0) {
      return 0;
    }
    const sum = userRatingsArray.reduce((acc, rating) => acc + rating.score, 0);
    return parseFloat((sum / userRatingsArray.length).toFixed(2));
  }, []);

  // تحديث متوسط التقييم في Firebase
  const updateUserAverageRating = useCallback(async (userId) => {
    try {
      const data = await readData(FIREBASE_PATHS.RATINGS);
      if (data) {
        const userRatingsArray = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .filter((rating) => rating.ratedUserId === userId);
        
        const averageRating = calculateAverageRating(userRatingsArray);
        
        // تحديث متوسط التقييم في بيانات المستخدم
        // يمكن تطبيق هذا لاحقاً عند تطبيق UserContext
        console.log(`✅ Average rating for user ${userId}: ${averageRating}`);
      }
    } catch (err) {
      console.error('❌ Error updating average rating:', err);
    }
  }, [calculateAverageRating]);

  // الحصول على إحصائيات التقييم
  const getRatingStats = useCallback((userRatingsArray) => {
    if (!userRatingsArray || userRatingsArray.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const averageRating = calculateAverageRating(userRatingsArray);
    const totalRatings = userRatingsArray.length;
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    userRatingsArray.forEach((rating) => {
      ratingDistribution[rating.score]++;
    });

    const percentages = {};
    Object.keys(ratingDistribution).forEach((key) => {
      percentages[key] = ((ratingDistribution[key] / totalRatings) * 100).toFixed(1);
    });

    return {
      averageRating,
      totalRatings,
      ratingDistribution,
      percentages,
    };
  }, [calculateAverageRating]);

  // فلترة التقييمات حسب النقاط
  const filterRatingsByScore = useCallback((userRatingsArray, score) => {
    return userRatingsArray.filter((rating) => rating.score === score);
  }, []);

  // فلترة التقييمات حسب الفئة
  const filterRatingsByCategory = useCallback((userRatingsArray, category) => {
    return userRatingsArray.filter((rating) => rating.category === category);
  }, []);

  // تقييم مفيدية التقييم (helpful/unhelpful)
  const markRatingAsHelpful = useCallback(async (ratingId, isHelpful) => {
    try {
      // يمكن تطبيق هذا لاحقاً
      console.log(`Rating ${ratingId} marked as ${isHelpful ? 'helpful' : 'unhelpful'}`);
    } catch (err) {
      console.error('❌ Error marking rating:', err);
      throw err;
    }
  }, []);

  const value = {
    // الحالات
    ratings,
    userRatings,
    isLoading,
    error,
    // الدوال
    submitRating,
    fetchUserRatings,
    listenToUserRatings,
    calculateAverageRating,
    getRatingStats,
    filterRatingsByScore,
    filterRatingsByCategory,
    markRatingAsHelpful,
  };

  return (
    <RatingContext.Provider value={value}>
      {children}
    </RatingContext.Provider>
  );
};
