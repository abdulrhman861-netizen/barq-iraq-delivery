import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import DigitalSignature from '../components/DigitalSignature';
import CODVerification from '../components/CODVerification';
import { confirmCODReceipt } from '../services/codPaymentService';

const CODConfirmationScreen = ({ route, navigation }) => {
  const { paymentId } = route.params || {};
  const [signature, setSignature] = useState('');
  const [documentPhotoUri, setDocumentPhotoUri] = useState('captured://placeholder');
  const [identityVerified, setIdentityVerified] = useState(false);
  const [lat, setLat] = useState('33.3157');
  const [lng, setLng] = useState('44.3661');

  const handleConfirm = async () => {
    try {
      await confirmCODReceipt({
        paymentId,
        captainSignature: signature,
        documentPhotoUri,
        gps: { lat: Number(lat), lng: Number(lng) },
        identityVerified,
      });
      Alert.alert('نجاح', 'تم تأكيد الاستلام الآمن');
      navigation.goBack();
    } catch (error) {
      Alert.alert('خطأ', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تأكيد الدفع عند الاستلام</Text>
      <DigitalSignature value={signature} onSign={() => setSignature(`signed-${Date.now()}`)} />
      <CODVerification verified={identityVerified} onToggle={setIdentityVerified} />
      <TextInput style={styles.input} value={documentPhotoUri} onChangeText={setDocumentPhotoUri} placeholder="رابط صورة المستند" />
      <TextInput style={styles.input} value={lat} onChangeText={setLat} placeholder="خط العرض" keyboardType="numeric" />
      <TextInput style={styles.input} value={lng} onChangeText={setLng} placeholder="خط الطول" keyboardType="numeric" />
      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>تأكيد العملية من الطرفين</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16, textAlign: 'right' },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 10, marginBottom: 10, textAlign: 'right' },
  button: { backgroundColor: '#1FBF83', padding: 12, borderRadius: 8, marginTop: 8 },
  buttonText: { color: '#FFF', textAlign: 'center', fontWeight: '700' },
});

export default CODConfirmationScreen;
