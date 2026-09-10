import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, FONT_SIZES, SIZES } from '../../constants';
import { createOrderRecord } from '../../services/firestoreDemo';

const CreateOrderDemoScreen = ({ userId, onBack }) => {
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    pickup: '',
    dropoff: '',
    notes: '',
    estimatedPrice: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    if (!form.customerName.trim() || !form.phone.trim() || !form.pickup.trim() || !form.dropoff.trim()) {
      setError('يرجى تعبئة الحقول الأساسية');
      return;
    }

    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const id = await createOrderRecord({
        customerId: userId,
        merchantId: userId,
        pickup: form.pickup.trim(),
        dropoff: form.dropoff.trim(),
        notes: form.notes.trim(),
        estimatedPrice: Number(form.estimatedPrice || 0),
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
      });
      setMessage(`تم إنشاء الطلب بنجاح. رقم الطلب: ${id}`);
      setForm({ customerName: '', phone: '', pickup: '', dropoff: '', notes: '', estimatedPrice: '' });
    } catch (e) {
      setError(e?.message || 'فشل إنشاء الطلب');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>‹ العودة للوحة</Text>
      </TouchableOpacity>
      <Text style={styles.title}>إنشاء طلب جديد</Text>

      {[
        ['customerName', 'اسم العميل'],
        ['phone', 'رقم الهاتف'],
        ['pickup', 'موقع الاستلام'],
        ['dropoff', 'موقع التسليم'],
        ['notes', 'ملاحظات'],
        ['estimatedPrice', 'سعر تقديري'],
      ].map(([key, label]) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={label}
          value={form[key]}
          onChangeText={(value) => onChange(key, value)}
          keyboardType={key === 'estimatedPrice' || key === 'phone' ? 'numeric' : 'default'}
          placeholderTextColor={COLORS.border}
        />
      ))}

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {message ? <Text style={styles.success}>{message}</Text> : null}

      <TouchableOpacity style={styles.submit} onPress={submit} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitText}>حفظ الطلب</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: SIZES.md, backgroundColor: COLORS.white },
  back: { color: COLORS.primary, fontWeight: '700', marginBottom: SIZES.sm },
  title: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', marginBottom: SIZES.sm, textAlign: 'right' },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: SIZES.sm, marginBottom: SIZES.sm },
  error: { color: COLORS.danger, marginBottom: SIZES.sm, textAlign: 'right' },
  success: { color: COLORS.success, marginBottom: SIZES.sm, textAlign: 'right' },
  submit: { backgroundColor: COLORS.primary, padding: SIZES.md, borderRadius: 10, alignItems: 'center' },
  submitText: { color: COLORS.white, fontWeight: '700' },
});

export default CreateOrderDemoScreen;
