import React, { useEffect, useMemo, useState } from 'react';
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
import {
  addWalletTransaction,
  ensureWallet,
  subscribeAllWallets,
  subscribeWallet,
  subscribeWalletTransactions,
  upsertUserRole,
} from '../../services/firestoreWebDemo';

const FinancePanel = ({ currentUser, setupState }) => {
  const [walletId, setWalletId] = useState('');
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [type, setType] = useState('credit');
  const [amount, setAmount] = useState('1000');
  const [description, setDescription] = useState('Manual adjustment');
  const [relatedOrderId, setRelatedOrderId] = useState('');

  const showAdminTools = useMemo(
    () => currentUser.role === 'admin' || currentUser.role === 'employee',
    [currentUser.role]
  );

  useEffect(() => {
    if (!setupState.isConfigured) {
      setLoading(false);
      return undefined;
    }

    let unsubWallet = () => {};
    let unsubTransactions = () => {};

    const bootstrapWallet = async () => {
      try {
        setLoading(true);
        const ensuredWalletId = await ensureWallet({
          ownerUserId: currentUser.uid,
          ownerRole: currentUser.role,
        });

        if (!ensuredWalletId) {
          setLoading(false);
          return;
        }

        setWalletId(ensuredWalletId);
        await upsertUserRole({
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          role: currentUser.role,
          walletId: ensuredWalletId,
        });

        unsubWallet = subscribeWallet(
          ensuredWalletId,
          (nextWallet) => {
            setWallet(nextWallet);
            setLoading(false);
          },
          (snapshotError) => {
            setError(snapshotError.message);
            setLoading(false);
          }
        );

        unsubTransactions = subscribeWalletTransactions(
          ensuredWalletId,
          setTransactions,
          (snapshotError) => setError(snapshotError.message)
        );
      } catch (walletError) {
        setError(walletError.message);
        setLoading(false);
      }
    };

    bootstrapWallet();

    return () => {
      unsubWallet();
      unsubTransactions();
    };
  }, [currentUser.displayName, currentUser.role, currentUser.uid, setupState.isConfigured]);

  useEffect(() => {
    if (!setupState.isConfigured || !showAdminTools) return undefined;

    return subscribeAllWallets(setWallets, (snapshotError) => setError(snapshotError.message));
  }, [setupState.isConfigured, showAdminTools]);

  const handleTransaction = async () => {
    if (!walletId || Number(amount) <= 0) return;

    try {
      setSaving(true);
      setError('');
      await addWalletTransaction({
        walletId,
        type,
        amount: Number(amount),
        description: description.trim(),
        relatedOrderId: relatedOrderId.trim() || null,
        createdBy: currentUser.uid,
      });
    } catch (transactionError) {
      setError(transactionError.message);
    } finally {
      setSaving(false);
    }
  };

  if (!setupState.isConfigured) {
    return <Text style={styles.placeholder}>Firebase config required for wallet operations.</Text>;
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Finance & Wallets</Text>

      {loading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : wallet ? (
        <View style={styles.walletCard}>
          <Text style={styles.walletTitle}>Wallet: {wallet.id}</Text>
          <Text style={styles.walletBalance}>Balance: {wallet.balance || 0} {wallet.currency || 'IQD'}</Text>
          <Text style={styles.walletMeta}>Owner: {wallet.ownerUserId} ({wallet.ownerRole})</Text>
        </View>
      ) : (
        <Text style={styles.empty}>No wallet found.</Text>
      )}

      <View style={styles.formBox}>
        <View style={styles.row}>
          <TextInput value={type} onChangeText={setType} style={styles.input} placeholder="credit/debit" />
          <TextInput value={amount} onChangeText={setAmount} style={styles.input} keyboardType="numeric" placeholder="amount" />
        </View>
        <TextInput value={description} onChangeText={setDescription} style={styles.input} placeholder="description" />
        <TextInput value={relatedOrderId} onChangeText={setRelatedOrderId} style={styles.input} placeholder="related order id (optional)" />
        <TouchableOpacity style={styles.button} disabled={saving} onPress={handleTransaction}>
          <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Add Transaction'}</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.listTitle}>Transactions</Text>
      {transactions.length === 0 ? (
        <Text style={styles.empty}>No transactions.</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.type} - {item.amount}</Text>
              <Text style={styles.itemText}>{item.description || '-'}</Text>
            </View>
          )}
        />
      )}

      {showAdminTools && (
        <>
          <Text style={styles.listTitle}>Admin Wallet Review</Text>
          {wallets.length === 0 ? (
            <Text style={styles.empty}>No wallets to review.</Text>
          ) : (
            <FlatList
              data={wallets}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.itemTitle}>{item.ownerUserId}</Text>
                  <Text style={styles.itemText}>{item.balance || 0} {item.currency || 'IQD'}</Text>
                </View>
              )}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, gap: SIZES.sm },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.darkGray },
  walletCard: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SIZES.sm },
  walletTitle: { color: COLORS.darkGray, fontWeight: '700' },
  walletBalance: { color: COLORS.primary, marginTop: 4, fontWeight: '700' },
  walletMeta: { color: COLORS.gray, marginTop: 4 },
  formBox: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SIZES.sm, gap: SIZES.sm },
  row: { flexDirection: 'row', gap: SIZES.sm },
  input: { flex: 1, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SIZES.sm },
  button: { backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: SIZES.sm, alignItems: 'center' },
  buttonText: { color: COLORS.white, fontWeight: '700' },
  error: { color: COLORS.danger },
  listTitle: { color: COLORS.darkGray, fontWeight: '700' },
  empty: { color: COLORS.gray },
  item: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SIZES.sm, marginBottom: SIZES.sm },
  itemTitle: { color: COLORS.darkGray, fontWeight: '700' },
  itemText: { color: COLORS.gray, marginTop: 4 },
  placeholder: { color: COLORS.gray },
});

export default FinancePanel;
