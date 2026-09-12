import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT_SIZES, SIZES } from '../../constants';
import { createOrder } from '../../services/firestoreWebDemo';

const CreateOrderPanel = ({ currentUser, setupState }) => {
  const [customerId, setCustomerId] = useState(currentUser.uid);
  const [merchantId, setMerchantId] = useState(
    currentUser.role === 'merchant' ? currentUser.uid : 'demo-merchant-user'
  );
  const [pickup, setPickup] = useState('Baghdad - Pickup Point');
  const [dropoff, setDropoff] = useState('Baghdad - Dropoff Point');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setCustomerId(currentUser.uid);
    setMerchantId(currentUser.role === 'merchant' ? currentUser.uid : 'demo-merchant-user');
  }, [currentUser.role, currentUser.uid]);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setStatus('');
      await createOrder({
        customerId: customerId.trim(),
        merchantId: merchantId.trim(),
        status: 'pending',
        pickup: pickup.trim(),
        dropoff: dropoff.trim(),
        notes: notes.trim(),
      });
      setStatus('Order created successfully');
      setNotes('');
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!setupState.isConfigured) {
    return <Text style={styles.placeholder}>Firebase config required for creating orders.</Text>;
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Create Order</Text>
      <View style={styles.formBox}>
        <TextInput style={styles.input} value={customerId} onChangeText={setCustomerId} placeholder="customerId" />
        <TextInput style={styles.input} value={merchantId} onChangeText={setMerchantId} placeholder="merchantId" />
        <TextInput style={styles.input} value={pickup} onChangeText={setPickup} placeholder="pickup" />
        <TextInput style={styles.input} value={dropoff} onChangeText={setDropoff} placeholder="dropoff" />
        <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="notes" />

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={saving}>
          <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Create Order'}</Text>
        </TouchableOpacity>
      </View>
      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { gap: SIZES.sm },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.darkGray },
  formBox: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SIZES.sm, gap: SIZES.sm },
  input: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SIZES.sm },
  button: { backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: SIZES.sm, alignItems: 'center' },
  buttonText: { color: COLORS.white, fontWeight: '700' },
  status: { color: COLORS.darkGray },
  placeholder: { color: COLORS.gray },
});

export default CreateOrderPanel;
