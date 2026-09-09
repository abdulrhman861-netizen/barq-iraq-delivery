// شاشة محفظة المستخدم
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { usePayment } from '../hooks/usePayment';
import { useAuth } from '../hooks/useAuth';
import WalletBalanceCard from '../components/WalletBalanceCard';
import TransactionHistory from '../components/TransactionHistory';

const WalletScreen = ({ navigation }) => {
  const { user } = useAuth();
  const {
    wallet,
    transactions,
    isLoading,
    error,
    initializeWallet,
    fetchTransactions,
  } = usePayment();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      initializeWalletData();
    }
  }, [user?.id]);

  const initializeWalletData = async () => {
    try {
      setRefreshing(true);
      await initializeWallet(user.id);
      await fetchTransactions(user.id);
    } catch (err) {
      Alert.alert('خطأ', 'فشل تحميل بيانات المحفظة');
      console.error('Error initializing wallet:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleTopUp = () => {
    navigation.navigate('TopUpScreen', { userId: user.id });
  };

  const handleWithdraw = () => {
    navigation.navigate('WithdrawalScreen', { userId: user.id });
  };

  const handleTransactionPress = (transaction) => {
    navigation.navigate('TransactionDetailsScreen', { transaction });
  };

  if (isLoading && !wallet) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>جاري تحميل المحفظة...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={{
        refreshing,
        onRefresh: initializeWalletData,
      }}
    >
      {/* رصيد المحفظة */}
      <WalletBalanceCard
        balance={wallet?.balance || 0}
        currency={wallet?.currency || 'IQD'}
        onTopUp={handleTopUp}
        onWithdraw={handleWithdraw}
      />

      {/* الإحصائيات */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>إجمالي المصروفات</Text>
          <Text style={styles.statValue}>
            {(wallet?.totalSpent || 0).toLocaleString('ar-IQ')}
          </Text>
          <Text style={styles.statCurrency}>د.ع</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>إجمالي الأرباح</Text>
          <Text style={styles.statValue}>
            {(wallet?.totalEarned || 0).toLocaleString('ar-IQ')}
          </Text>
          <Text style={styles.statCurrency}>د.ع</Text>
        </View>
      </View>

      {/* سجل المعاملات */}
      <TransactionHistory
        transactions={transactions}
        onTransactionPress={handleTransactionPress}
      />

      {/* رسالة الخطأ */}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={initializeWalletData}
          >
            <Text style={styles.retryButtonText}>إعادة محاولة</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statCurrency: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  errorBox: {
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#E74C3C',
    borderRadius: 6,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default WalletScreen;
