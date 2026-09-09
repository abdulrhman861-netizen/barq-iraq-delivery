// مكون نموذج إدخال بيانات البطاقة
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { usePaymentValidation } from '../hooks/usePaymentValidation';

const CardInputForm = ({ onCardDataChange }) => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
  });

  const { errors, validateCard } = usePaymentValidation();

  const handleCardNumberChange = (text) => {
    // تنسيق رقم البطاقة (إضافة مسافات)
    const formatted = text.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    const updated = { ...cardData, cardNumber: text.replace(/\s/g, '') };
    setCardData(updated);
    onCardDataChange(updated);
  };

  const handleExpiryDateChange = (text) => {
    // تنسيق تاريخ الانتهاء (MM/YY)
    let formatted = text.replace(/\D/g, '');
    if (formatted.length > 2) {
      formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
    }
    const updated = { ...cardData, expiryDate: formatted };
    setCardData(updated);
    onCardDataChange(updated);
  };

  const handleCVVChange = (text) => {
    // قبول أرقام فقط (3-4 أرقام)
    const cvv = text.replace(/\D/g, '').slice(0, 4);
    const updated = { ...cardData, cvv };
    setCardData(updated);
    onCardDataChange(updated);
  };

  const handleCardholderNameChange = (text) => {
    const updated = { ...cardData, cardholderName: text };
    setCardData(updated);
    onCardDataChange(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 بيانات البطاقة</Text>

      {/* رقم البطاقة */}
      <View style={styles.field}>
        <Text style={styles.label}>رقم البطاقة</Text>
        <TextInput
          style={[styles.input, errors.cardNumber && styles.inputError]}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor="#999"
          value={cardData.cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
          onChangeText={handleCardNumberChange}
          keyboardType="numeric"
          maxLength={19}
        />
        {errors.cardNumber && (
          <Text style={styles.errorText}>{errors.cardNumber}</Text>
        )}
      </View>

      {/* اسم صاحب البطاقة */}
      <View style={styles.field}>
        <Text style={styles.label}>اسم صاحب البطاقة</Text>
        <TextInput
          style={[styles.input, errors.cardholderName && styles.inputError]}
          placeholder="AHMED HASSAN"
          placeholderTextColor="#999"
          value={cardData.cardholderName}
          onChangeText={handleCardholderNameChange}
        />
        {errors.cardholderName && (
          <Text style={styles.errorText}>{errors.cardholderName}</Text>
        )}
      </View>

      {/* صف واحد لتاريخ الانتهاء و CVV */}
      <View style={styles.row}>
        <View style={[styles.field, styles.fieldHalf]}>
          <Text style={styles.label}>تاريخ الانتهاء</Text>
          <TextInput
            style={[styles.input, errors.expiryDate && styles.inputError]}
            placeholder="MM/YY"
            placeholderTextColor="#999"
            value={cardData.expiryDate}
            onChangeText={handleExpiryDateChange}
            keyboardType="numeric"
            maxLength={5}
          />
          {errors.expiryDate && (
            <Text style={styles.errorText}>{errors.expiryDate}</Text>
          )}
        </View>

        <View style={[styles.field, styles.fieldHalf]}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={[styles.input, errors.cvv && styles.inputError]}
            placeholder="123"
            placeholderTextColor="#999"
            value={cardData.cvv}
            onChangeText={handleCVVChange}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
          {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
        </View>
      </View>

      {/* تحذير أمان */}
      <View style={styles.securityWarning}>
        <Text style={styles.warningIcon}>🔒</Text>
        <Text style={styles.warningText}>
          بيانات البطاقة مشفرة وآمنة. لا يتم تخزين البيانات الحساسة على الجهاز.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'right',
  },
  field: {
    marginBottom: 16,
  },
  fieldHalf: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    textAlign: 'right',
    backgroundColor: '#FFF',
  },
  inputError: {
    borderColor: '#E74C3C',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  securityWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  warningIcon: {
    fontSize: 18,
    marginHorizontal: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#2E7D32',
    textAlign: 'right',
  },
});

export default CardInputForm;
