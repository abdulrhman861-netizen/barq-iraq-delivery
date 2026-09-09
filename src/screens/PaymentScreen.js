// شاشة الدفع - اختيار طريقة الدفع وتأكيد العملية
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { usePayment } from '../hooks/usePayment';
import { useAuth } from '../hooks/useAuth';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import CardInputForm from '../components/CardInputForm';
import PaymentSummary from '../components/PaymentSummary';
import { PAYMENT_METHODS, PAYMENT_STATUS } from '../constants/payment';
import { fraudDetection } from '../utils/security';

const PaymentScreen = ({ route, navigation }) => {
  const { orderData } = route.params || {};
  const { user } = useAuth();
  const {
    paymentMethods,
    selectedPaymentMethod,
    isLoading,
    error,
    fetchPaymentMethods,
    setSelectedPaymentMethod,
    makePayment,
    handleCashOnDelivery,
  } = usePayment();

  const [cardData, setCardData] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchPaymentMethods(user.id);
    }
  }, [user?.id]);

  const calculateTotal = () => {
    if (!orderData) return 0;
    return (orderData.itemPrice || 0) + (orderData.deliveryFee || 0) - (orderData.discount || 0);
  };

  const handlePayment = async () => {
    try {
      if (!selectedPaymentMethod) {
        Alert.alert('تنبيه', 'يرجى اختيار طريقة دفع');
        return;
      }

      // كشف الاحتيال
      const fraudCheck = fraudDetection({
        amount: calculateTotal(),
        userId: user.id,
        isNewDevice: false,
      });

      if (fraudCheck.isFraudulent) {
        Alert.alert('تحذير أمان', 'تم اكتشاف نشاط مريب. لم يتم معالجة الدفع.');
        return;
      }

      setProcessingPayment(true);

      // معالجة الدفع حسب نوع الطريقة
      if (selectedPaymentMethod.type === PAYMENT_METHODS.CASH) {
        const payment = await handleCashOnDelivery({
          ...orderData,
          customerId: user.id,
          totalAmount: calculateTotal(),
        });
        Alert.alert('نجاح', 'تم تسجيل الطلب. سيتم دفع المبلغ عند الاستلام.');
        navigation.goBack();
      } else if (selectedPaymentMethod.type === PAYMENT_METHODS.CARD) {
        // هنا يتم التكامل مع بوابة الدفع (Stripe, PayPal, إلخ)
        const payment = await makePayment({
          orderId: orderData.orderId,
          userId: user.id,
          amount: calculateTotal(),
          method: selectedPaymentMethod.type,
          paymentMethodId: selectedPaymentMethod.id,
          status: PAYMENT_STATUS.PROCESSING,
          description: `دفع الطلب #${orderData.orderId}`,
        });
        Alert.alert('نجاح', 'تمت معالجة الدفع بنجاح!');
        navigation.goBack();
      } else if (selectedPaymentMethod.type === PAYMENT_METHODS.WALLET) {
        // استخدام رصيد المحفظة
        const payment = await makePayment({
          orderId: orderData.orderId,
          userId: user.id,
          amount: calculateTotal(),
          method: PAYMENT_METHODS.WALLET,
          status: PAYMENT_STATUS.COMPLETED,
          description: `دفع من المحفظة للطلب #${orderData.orderId}`,
        });
        Alert.alert('نجاح', 'تمت عملية الدفع من المحفظة!');
        navigation.goBack();
      }
    } catch (err) {
      Alert.alert('خطأ', err.message || 'فشل معالجة الدفع');
      console.error('Payment error:', err);
    } finally {
      setProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* ملخص الطلب */}
      <PaymentSummary
        orderData={orderData}
        paymentMethod={selectedPaymentMethod}
        totalAmount={calculateTotal()}
      />

      {/* اختيار طريقة الدفع */}
      <PaymentMethodSelector
        methods={paymentMethods}
        selectedMethod={selectedPaymentMethod}
        onSelectMethod={setSelectedPaymentMethod}
      />

      {/* إدخال بيانات البطاقة (إذا تم اختيار البطاقة) */}
      {selectedPaymentMethod?.type === PAYMENT_METHODS.CARD && (
        <CardInputForm onCardDataChange={setCardData} />
      )}

      {/* رسالة الخطأ */}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* زر الدفع */}
      <TouchableOpacity
        style={[
          styles.payButton,
          (!selectedPaymentMethod || processingPayment) && styles.payButtonDisabled,
        ]}
        onPress={handlePayment}
        disabled={!selectedPaymentMethod || processingPayment}
      >
        {processingPayment ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <>
            <Text style={styles.payButtonText}>تأكيد الدفع</Text>
            <Text style={styles.payAmount}>
              {calculateTotal().toLocaleString('ar-IQ')} د.ع
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* معلومات الأمان */}
      <View style={styles.securityInfo}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityText}>
          جميع بيانات الدفع محمية بتشفير من الدرجة الأولى (SSL/TLS). نحن لا نحفظ بيانات البطاقات الكاملة على خوادمنا.
        </Text>
      </View>
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
  },
  payButton: {
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 16,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  payAmount: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  securityIcon: {
    fontSize: 20,
    marginHorizontal: 8,
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    color: '#2E7D32',
    textAlign: 'right',
  },
});

export default PaymentScreen;
