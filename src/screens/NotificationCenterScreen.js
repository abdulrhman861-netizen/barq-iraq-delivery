// شاشة مركز الإشعارات
import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { NotificationContext } from '../../contexts/NotificationContext';
import NotificationCard from '../../components/NotificationCard';
import { COLORS, SIZES, FONT_SIZES } from '../../constants/index';

const NotificationCenterScreen = ({ navigation }) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useContext(NotificationContext);

  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const onRefresh = async () => {
    setRefreshing(true);
    // محاكاة التحديث
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredNotifications =
    filterType === 'all'
      ? notifications
      : notifications.filter((n) => n.type === filterType);

  const handleNotificationPress = (notificationId) => {
    markAsRead(notificationId);
    // قد يتم التنقل إلى الشاشة المناسبة حسب نوع الإشعار
  };

  const renderNotification = ({ item }) => (
    <NotificationCard
      notification={item}
      onPress={() => handleNotificationPress(item.id)}
      onDismiss={() => deleteNotification(item.id)}
    />
  );

  const renderFilterButton = (type, label) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterType === type && styles.filterButtonActive,
      ]}
      onPress={() => setFilterType(type)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filterType === type && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📭</Text>
        <Text style={styles.emptyTitle}>لا توجد إشعارات</Text>
        <Text style={styles.emptySubtitle}>
          ستظهر إشعاراتك هنا عند حدوثها
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* الرأس */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>الإشعارات 🔔</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {notifications.length > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllReadButton}>تحديد الكل كمقروء</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* أزرار الفلترة */}
      {notifications.length > 0 && (
        <View style={styles.filterContainer}>
          {renderFilterButton('all', 'الكل')}
          {renderFilterButton('order_created', 'الطلبات')}
          {renderFilterButton('chat_message', 'الرسائل')}
          {renderFilterButton('rating_received', 'التقييمات')}
        </View>
      )}

      {/* قائمة الإشعارات */}
      {filteredNotifications.length > 0 ? (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      ) : (
        renderEmptyState()
      )}

      {/* زر مسح الكل */}
      {notifications.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAllNotifications}
          >
            <Text style={styles.clearButtonText}>🗑️ مسح جميع الإشعارات</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
    marginBottom: SIZES.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  unreadBadge: {
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
  },
  unreadBadgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: 'bold',
  },
  markAllReadButton: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    textDecorationLine: 'underline',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    gap: SIZES.sm,
  },
  filterButton: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.gray,
    borderRadius: SIZES.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.darkGray,
  },
  filterButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  listContent: {
    paddingVertical: SIZES.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SIZES.md,
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
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  clearButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.md,
    alignItems: 'center',
  },
  clearButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: 'bold',
  },
});

export default NotificationCenterScreen;
