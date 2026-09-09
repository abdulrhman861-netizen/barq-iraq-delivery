# SETUP GUIDE - Barq Iraq Delivery

## 1. متغيرات البيئة

أنشئ ملف `.env.local` بنفس مفاتيح `.env.example` ثم ضع القيم الفعلية.

## 2. تثبيت الأدوات

```bash
npm install
npm install -g expo-cli
npm install -g eas-cli
```

## 3. إعداد Firebase

- تفعيل Authentication (Phone + Email)
- تفعيل Realtime Database
- تفعيل Cloud Storage
- تفعيل Firestore (اختياري)
- تطبيق قواعد أمان مناسبة

## 4. تشغيل التطبيق

```bash
npm start
npm run android
npm run ios
npm run web
```

## 5. التحقق المبدئي

- تأكد من تحميل التطبيق بدون أخطاء.
- نفّذ سيناريو تسجيل الدخول والطلب والتتبع.
- راجع الملفات داخل `docs/` لبقية الخطوات.
