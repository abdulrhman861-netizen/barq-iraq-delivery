# 💳 دليل نظام الدفع الآمن

## 📋 نظرة عامة

نظام الدفع الآمن لتطبيق برق العراق يوفر:
- ✅ طرق دفع متعددة (نقدي، بطاقة، محفظة رقمية)
- ✅ تشفير آمن للبيانات الحساسة
- ✅ كشف الاحتيال المتقدم
- ✅ سجل معاملات شامل
- ✅ إدارة محفظة رقمية

---

## 🚀 البدء السريع

### 1. تثبيت المكتبات المطلوبة

```bash
npm install crypto-js
```

### 2. دمج PaymentProvider

```javascript
import { PaymentProvider } from './src/contexts/PaymentContext';

<PaymentProvider>
  <YourApp />
</PaymentProvider>
```

### 3. استخدام Hook الدفع

```javascript
import { usePayment } from '../hooks/usePayment';

const MyComponent = () => {
  const { wallet, makePayment, fetchTransactions } = usePayment();
  // استخدام الدوال والحالة
};
```

---

## 🔧 الدوال الرئيسية

### إدارة المحفظة

#### getWalletBalance(userId)
```javascript
const balance = await getWalletBalance(userId);
console.log(balance); // 50000
```

#### createWallet(userId)
```javascript
const wallet = await createWallet(userId);
// ينشئ محفظة جديدة برصيد 0
```

#### updateWalletBalance(userId, amount, type)
```javascript
// إضافة أموال
await updateWalletBalance(userId, 10000, 'add');

// خصم أموال
await updateWalletBalance(userId, 5000, 'subtract');
```

### المعاملات المالية

#### makePayment(paymentData)
```javascript
const payment = await makePayment({
  orderId: 'ORD123',
  userId: 'USER456',
  amount: 50000,
  method: 'card',
  description: 'دفع للطلب #ORD123'
});
```

#### handleCashOnDelivery(orderData)
```javascript
const payment = await handleCashOnDelivery({
  orderId: 'ORD123',
  customerId: 'USER456',
  totalAmount: 50000
});
```

#### processRefund(paymentId, amount, reason)
```javascript
const refund = await processRefund('PAY123', 50000, 'طلب الزبون');
```

### طرق الدفع

#### savePaymentMethod(userId, paymentMethodData)
```javascript
const method = await savePaymentMethod(userId, {
  type: 'card',
  cardNumber: '1234567890123456',
  cardholderName: 'AHMED HASSAN',
  expiryDate: '12/25',
  cvv: '123'
});
// ملاحظة: يتم تشفير البيانات وحفظ آخر 4 أرقام فقط
```

#### getPaymentMethods(userId)
```javascript
const methods = await getPaymentMethods(userId);
// يرجع مصفوفة من طرق الدفع المحفوظة
```

---

## 🔐 الأمان

### تشفير البيانات

```javascript
import { encryptData, decryptData } from '../utils/security';

const encrypted = encryptData('sensitive-data');
const decrypted = decryptData(encrypted);
```

### التحقق من صحة البيانات

```javascript
import {
  validateCardNumber,
  validateCVV,
  validateExpiryDate,
  validateIraqiPhone
} from '../utils/security';

validateCardNumber('1234567890123456'); // true/false
validateCVV('123'); // true/false
validateExpiryDate('12/25'); // true/false
validateIraqiPhone('07700000000'); // true/false
```

### كشف الاحتيال

```javascript
import { fraudDetection } from '../utils/security';

const result = fraudDetection({
  amount: 5000000,
  userId: 'USER123',
  location: { latitude: 33.3128, longitude: 44.3615 },
  deviceId: 'DEVICE123',
  isNewDevice: false
});

console.log(result.isFraudulent); // true/false
console.log(result.riskLevel); // 'low' / 'medium' / 'high'
console.log(result.flags); // تفاصيل الأعلام
```

---

## 📊 استخدام Hook التحقق من البيانات

```javascript
import { usePaymentValidation } from '../hooks/usePaymentValidation';

const MyForm = () => {
  const {
    errors,
    isValid,
    validateCard,
    validateTopUp,
    validateTransfer,
    validateWithdrawal
  } = usePaymentValidation();

  const handleCardSubmit = (cardData) => {
    if (validateCard(cardData)) {
      // معالجة الدفع
    }
    // errors يحتوي على رسائل الخطأ
  };
};
```

---

## 💻 الشاشات المتاحة

### 1. WalletScreen (شاشة المحفظة)
- عرض رصيد المحفظة
- إحصائيات المصروفات والأرباح
- سجل المعاملات
- أزرار الشحن والسحب

### 2. PaymentScreen (شاشة الدفع)
- اختيار طريقة الدفع
- إدخال بيانات البطاقة
- ملخص الطلب
- معالجة الدفع

---

## 🔄 تدفق الدفع الكامل

1. **اختيار الطريقة**: المستخدم يختار طريقة الدفع
2. **إدخال البيانات**: إدخال بيانات البطاقة (إذا لزم الأمر)
3. **التحقق**: التحقق من صحة البيانات والكشف عن الاحتيال
4. **المعالجة**: معالجة الدفع عبر الخدمة
5. **التأكيد**: تحديث حالة الطلب والمحفظة
6. **الإشعار**: إرسال إشعار للمستخدم

---

## 📝 ملاحظات مهمة

### الأمان
- ✅ لا تحفظ بيانات البطاقات الكاملة على الجهاز
- ✅ استخدم Tokenization من البوابات المعتمدة
- ✅ فعّل SSL/TLS لجميع الاتصالات
- ✅ استخدم 2FA للمعاملات الكبيرة

### الأداء
- استخدم pagination لسجل المعاملات الكبير
- خزّن بيانات المستخدم محلياً مع متزامنة دورية
- استخدم قائمة الانتظار للمعاملات غير المكتملة

### التطوير المستقبلي
- [ ] تكامل مع Stripe API
- [ ] تكامل مع PayPal API
- [ ] تكامل مع Telebirr API
- [ ] نظام الفواتير الرقمية
- [ ] تقارير المبيعات المتقدمة

---

## 🐛 استكشاف الأخطاء

### خطأ: "رصيد المحفظة غير كافي"
```javascript
// تحقق من الرصيد قبل الدفع
const balance = await getWalletBalance(userId);
if (balance < amount) {
  // عرض رسالة خطأ
}
```

### خطأ: "بيانات البطاقة غير صحيحة"
```javascript
// استخدم دوال التحقق
if (!validateCardNumber(cardNumber)) {
  // عرض خطأ التحقق
}
```

### خطأ: "تم اكتشاف نشاط مريب"
```javascript
// تحقق من نتائج كشف الاحتيال
const fraudCheck = fraudDetection(paymentData);
if (fraudCheck.isFraudulent) {
  // اطلب تحقق إضافي
}
```

---

## 📞 الدعم
للمزيد من المعلومات أو المساعدة، يرجى فتح issue على GitHub.
