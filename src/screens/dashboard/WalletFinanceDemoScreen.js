import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONT_SIZES, SIZES } from '../../constants';
import {
  addWalletTransaction,
  ensureWallet,
  listWallets,
  subscribeWallet,
} from '../../services/firestoreDemo';

const WalletFinanceDemoScreen = ({ userId, role, onBack }) => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('credit');
  const [adminWallets, setAdminWallets] = useState([]);
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const isAdmin = role === 'admin';

  useEffect(() => {
    let unsubscribe = () => {};

    const init = async () => {
      try {
        setIsLoading(true);
        const createdWallet = await ensureWallet({ ownerUserId: userId, ownerRole: role });
        unsubscribe = subscribeWallet({
          walletId: createdWallet.id,
          onWallet: setWallet,
          onTransactions: setTransactions,
          onError: (e) => setError(e?.message || 'فشل تحميل بيانات المحفظة'),
        });

        if (isAdmin) {
          const wallets = await listWallets();
          setAdminWallets(wallets);
          if (wallets.length) {
            setSelectedWalletId(wallets[0].id);
          }
        }
      } catch (e) {
        setError(e?.message || 'تعذر تهيئة المحفظة');
      } finally {
        setIsLoading(false);
      }
    };

    init();

    return () => unsubscribe();
  }, [userId, role, isAdmin]);

  const selectedAdminWallet = useMemo(
    () => adminWallets.find((item) => item.id === selectedWalletId),
    [adminWallets, selectedWalletId]
  );

  const submitTransaction = async (targetWalletId = wallet?.id) => {
    if (!targetWalletId) return;

    setError('');
    setMessage('');
    try {
      await addWalletTransaction({
        walletId: targetWalletId,
        type,
        amount,
        description: description.trim() || 'حركة رصيد من واجهة التجربة',
        createdBy: userId,
      });
      setAmount('');
      setDescription('');
      setMessage('تمت إضافة الحركة بنجاح');

      if (isAdmin) {
        const wallets = await listWallets();
        setAdminWallets(wallets);
      }
    } catch (e) {
      setError(e?.message || 'فشل إضافة الحركة');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>‹ العودة للوحة</Text>
      </TouchableOpacity>

      <Text style={styles.title}>المحفظة والحسابات المالية</Text>

      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>الرصيد الحالي</Text>
            <Text style={styles.balanceValue}>{wallet?.balance || 0} IQD</Text>
            <Text style={styles.balanceMeta}>الدور: {role}</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>إضافة حركة مالية</Text>
            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[styles.typeButton, type === 'credit' && styles.typeButtonActive]}
                onPress={() => setType('credit')}
              >
                <Text style={styles.typeText}>Credit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, type === 'debit' && styles.typeButtonActive]}
                onPress={() => setType('debit')}
              >
                <Text style={styles.typeText}>Debit</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="المبلغ"
              keyboardType="numeric"
              placeholderTextColor={COLORS.border}
            />
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="الوصف"
              placeholderTextColor={COLORS.border}
            />
            <TouchableOpacity style={styles.submitButton} onPress={() => submitTransaction()}>
              <Text style={styles.submitButtonText}>تنفيذ الحركة</Text>
            </TouchableOpacity>
            {message ? <Text style={styles.success}>{message}</Text> : null}
          </View>

          <Text style={styles.sectionTitle}>سجل العمليات</Text>
          <FlatList
            style={styles.txList}
            data={transactions}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.empty}>لا توجد عمليات حتى الآن</Text>}
            renderItem={({ item }) => (
              <View style={styles.txCard}>
                <Text style={styles.txType}>{item.type}</Text>
                <Text style={styles.txAmount}>{item.amount} IQD</Text>
                <Text style={styles.txDesc}>{item.description}</Text>
              </View>
            )}
          />

          {isAdmin && (
            <View style={styles.adminBox}>
              <Text style={styles.sectionTitle}>أدوات الإدارة - تسوية المحافظ</Text>
              <FlatList
                data={adminWallets}
                keyExtractor={(item) => item.id}
                horizontal
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.walletItem, selectedWalletId === item.id && styles.walletItemActive]}
                    onPress={() => setSelectedWalletId(item.id)}
                  >
                    <Text style={styles.walletItemText}>{item.ownerRole}</Text>
                    <Text style={styles.walletItemText}>{item.balance} IQD</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => submitTransaction(selectedAdminWallet?.id)}
                disabled={!selectedAdminWallet}
              >
                <Text style={styles.submitButtonText}>تسوية على المحفظة المحددة</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: SIZES.md },
  back: { color: COLORS.primary, fontWeight: '700', marginBottom: SIZES.sm },
  title: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: SIZES.sm, textAlign: 'right' },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.darkGray, marginBottom: SIZES.sm, textAlign: 'right' },
  balanceCard: { backgroundColor: COLORS.gray, borderRadius: 10, padding: SIZES.md, marginBottom: SIZES.sm },
  balanceLabel: { color: COLORS.gray, marginBottom: SIZES.xs },
  balanceValue: { fontSize: FONT_SIZES.xxxl, fontWeight: 'bold', color: COLORS.primary },
  balanceMeta: { marginTop: SIZES.xs, color: COLORS.darkGray },
  formCard: { backgroundColor: COLORS.gray, borderRadius: 10, padding: SIZES.md, marginBottom: SIZES.sm },
  typeRow: { flexDirection: 'row', gap: SIZES.sm, marginBottom: SIZES.sm },
  typeButton: { flex: 1, padding: SIZES.sm, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  typeButtonActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  typeText: { color: COLORS.darkGray, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SIZES.sm, marginBottom: SIZES.sm, backgroundColor: COLORS.white },
  submitButton: { backgroundColor: COLORS.secondary, borderRadius: 8, padding: SIZES.sm, alignItems: 'center' },
  submitButtonText: { color: COLORS.white, fontWeight: '700' },
  error: { color: COLORS.danger, marginBottom: SIZES.sm, textAlign: 'right' },
  success: { color: COLORS.success, marginTop: SIZES.sm, textAlign: 'right' },
  txList: { maxHeight: 210 },
  txCard: { backgroundColor: COLORS.gray, borderRadius: 8, padding: SIZES.sm, marginBottom: SIZES.xs },
  txType: { fontWeight: '700', color: COLORS.darkGray },
  txAmount: { color: COLORS.primary, fontWeight: '700' },
  txDesc: { color: COLORS.darkGray },
  empty: { color: COLORS.gray, textAlign: 'center', marginTop: SIZES.sm },
  adminBox: { marginTop: SIZES.sm, backgroundColor: COLORS.gray, borderRadius: 10, padding: SIZES.md },
  walletItem: { marginRight: SIZES.sm, backgroundColor: COLORS.white, borderRadius: 8, padding: SIZES.sm, minWidth: 120, borderWidth: 1, borderColor: COLORS.border },
  walletItemActive: { borderColor: COLORS.primary },
  walletItemText: { color: COLORS.darkGray },
});

export default WalletFinanceDemoScreen;
