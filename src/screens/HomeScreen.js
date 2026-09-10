// screens/HomeScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS, SIZES, FONT_SIZES } from '../constants/index';

const HomeScreen = ({ onLogout }) => {
  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل تريد فعلاً تسجيل الخروج؟',
      [
        { text: 'إلغاء', onPress: () => {}, style: 'cancel' },
        {
          text: 'خروج',
          onPress: () => {
            onLogout();
            Alert.alert('نجاح', 'تم تسجيل الخروج بنجاح');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>أهلاً وسهلاً! 👋</Text>
            <Text style={styles.userName}>عم محمد</Text>
          </View>
          <TouchableOpacity style={styles.profileIcon}>
            <Text style={styles.profileEmoji}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <StatCard icon="📦" label="الطلبات" value="12" color={COLORS.primary} />
          <StatCard icon="⭐" label="التقييم" value="4.8" color={COLORS.success} />
          <StatCard icon="💰" label="المحفظة" value="150ك" color={COLORS.warning} />
        </View>

        {/* Main Menu */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>الخدمات الرئيسية</Text>

          <MenuItemLarge
            icon="📦"
            title="الطلبات"
            subtitle="إنشاء وإدارة طلباتك"
            onPress={() => Alert.alert('قريباً', 'سيتم إضافة صفحة الطلبات')}
          />

          <MenuItemLarge
            icon="📍"
            title="التتبع الحي"
            subtitle="تابع طلباتك في الوقت الفعلي"
            onPress={() => Alert.alert('قريباً', 'سيتم إضافة التتبع الحي')}
          />

          <MenuItemLarge
            icon="💬"
            title="الدردشة"
            subtitle="تواصل مع الكابتنز والمتاجر"
            onPress={() => Alert.alert('قريباً', 'سيتم إضافة الدردشة')}
          />

          <MenuItemLarge
            icon="⭐"
            title="التقييمات"
            subtitle="قيّم الطلبات والخدمات"
            onPress={() => Alert.alert('قريباً', 'سيتم إضافة التقييمات')}
          />
        </View>

        {/* Additional Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsTitle}>الخيارات الأخرى</Text>

          <MenuItemSmall
            icon="⚙️"
            title="الإعدادات"
            onPress={() => Alert.alert('قريباً', 'سيتم إضافة الإعدادات')}
          />

          <MenuItemSmall
            icon="❓"
            title="المساعدة والدعم"
            onPress={() => Alert.alert('المساعدة', 'يمكنك التواصل معنا عبر 📞 0700123456')}
          />

          <MenuItemSmall
            icon="📋"
            title="شروط الخدمة"
            onPress={() => Alert.alert('الشروط', 'شروط وسياسات الخدمة')}
          />

          <MenuItemSmall
            icon="🚪"
            title="تسجيل الخروج"
            isLogout={true}
            onPress={handleLogout}
          />
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>الإصدار: 1.0.0</Text>
          <Text style={styles.footerText}>© 2024 برق العراق</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <View style={styles.statCard}>
    <Text style={[styles.statIcon, { color }]}>{icon}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
  </View>
);

const MenuItemLarge = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.menuItemLarge} onPress={onPress}>
    <Text style={styles.menuItemIcon}>{icon}</Text>
    <View style={styles.menuItemContent}>
      <Text style={styles.menuItemTitle}>{title}</Text>
      <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
    </View>
    <Text style={styles.menuItemArrow}>›</Text>
  </TouchableOpacity>
);

const MenuItemSmall = ({ icon, title, isLogout, onPress }) => (
  <TouchableOpacity
    style={[styles.menuItemSmall, isLogout && styles.menuItemSmallLogout]}
    onPress={onPress}
  >
    <Text style={styles.menuItemSmallIcon}>{icon}</Text>
    <Text style={[styles.menuItemSmallText, isLogout && styles.menuItemSmallTextLogout]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SIZES.xxl,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.lg,
    paddingHorizontal: SIZES.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: SIZES.xl,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
    opacity: 0.9,
  },
  userName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEmoji: {
    fontSize: FONT_SIZES.huge,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.xl,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.md,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: SIZES.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statIcon: {
    fontSize: FONT_SIZES.huge,
    marginBottom: SIZES.sm,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    fontWeight: '600',
    marginBottom: SIZES.xs,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
  },
  menuContainer: {
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.xl,
  },
  menuTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.md,
    textAlign: 'right',
  },
  menuItemLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.md,
    borderRadius: 15,
    marginBottom: SIZES.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuItemIcon: {
    fontSize: FONT_SIZES.huge,
    marginRight: SIZES.md,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.xs,
  },
  menuItemSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  menuItemArrow: {
    fontSize: FONT_SIZES.xxxl,
    color: COLORS.primary,
  },
  optionsContainer: {
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.xl,
  },
  optionsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.md,
    textAlign: 'right',
  },
  menuItemSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.md,
    borderRadius: 12,
    marginBottom: SIZES.md,
  },
  menuItemSmallIcon: {
    fontSize: FONT_SIZES.lg,
    marginRight: SIZES.md,
  },
  menuItemSmallText: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  menuItemSmallLogout: {
    backgroundColor: '#FFE5E5',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  menuItemSmallTextLogout: {
    color: COLORS.danger,
  },
  footer: {
    paddingHorizontal: SIZES.md,
    paddingTop: SIZES.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginVertical: SIZES.xs,
  },
});

export default HomeScreen;
