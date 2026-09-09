// مكون عرض سجل المعاملات
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { PAYMENT_STATUS, TRANSACTION_TYPES } from '../constants/payment';

const TransactionHistory = ({ transactions = [], onTransactionPress }) => {
  const getTransactionIcon = (type) => {
    const icons = {
      [TRANSACTION_TYPES.PAYMENT]: '💳',
      [TRANSACTION_TYPES.TRANSFER]: '🔄',
      [TRANSACTION_TYPES.REFUND]: '↩️',
      [TRANSACTION_TYPES.WITHDRAWAL]: '🏧',
      [TRANSACTION_TYPES.TOP_UP]: '💰',
    };
    return icons[type] || '💸';
  };

  const getStatusColor = (status) => {
    const colors = {
      [PAYMENT_STATUS.COMPLETED]: '#4CAF50',
      [PAYMENT_STATUS.PENDING]: '#FF9800',
      [PAYMENT_STATUS.FAILED]: '#E74C3C',
      [PAYMENT_STATUS.REFUNDED]: '#2196F3',
    };
    return colors[status] || '#999';
  };

  const getStatusLabel = (status) => {
    const labels = {
      [PAYMENT_STATUS.COMPLETED]: 'مكتملة',
      [PAYMENT_STATUS.PENDING]: 'قيد الانتظار',
      [PAYMENT_STATUS.FAILED]: 'فاشلة',
      [PAYMENT_STATUS.REFUNDED]: 'مسترجعة',
    };
    return labels[status] || status;
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString('ar-IQ');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTransaction = ({ item }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => onTransactionPress?.(item)}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getTransactionIcon(item.type)}</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>{formatDate(item.timestamp || item.createdAt)}</Text>
      </View>

      <View style={styles.amountSection}>
        <Text
          style={[
            styles.amount,
            { color: item.type === TRANSACTION_TYPES.WITHDRAWAL ? '#E74C3C' : '#4CAF50' },
          ]}
        >
          {item.type === TRANSACTION_TYPES.WITHDRAWAL ? '-' : '+'}
          {formatAmount(item.amount)}
        </Text>
        <Text
          style={[
            styles.status,
            { color: getStatusColor(item.status) },
          ]}
        >
          {getStatusLabel(item.status)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 السجل المالي</Text>
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>لا توجد معاملات حتى الآن</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'right',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 6,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'right',
  },
  date: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  amountSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  status: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default TransactionHistory;
