// مكون عرض رصيد المحفظة
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const WalletBalanceCard = ({ balance = 0, currency = 'IQD', onTopUp, onWithdraw }) => {
  const formattedBalance = balance.toLocaleString('ar-IQ');

  return (
    <View style={styles.container}>
      <View style={styles.balanceSection}>
        <Text style={styles.label}>رصيد محفظتك</Text>
        <View style={styles.balanceDisplay}>
          <Text style={styles.amount}>{formattedBalance}</Text>
          <Text style={styles.currency}>{currency}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={onTopUp}>
          <Text style={styles.buttonIcon}>➕</Text>
          <Text style={styles.buttonText}>شحن</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onWithdraw}>
          <Text style={styles.buttonIcon}>➖</Text>
          <Text style={styles.buttonText}>سحب</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
    padding: 20,
    elevation: 4,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  balanceSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    textAlign: 'right',
  },
  balanceDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginRight: 8,
  },
  currency: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  buttonIcon: {
    fontSize: 18,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default WalletBalanceCard;
