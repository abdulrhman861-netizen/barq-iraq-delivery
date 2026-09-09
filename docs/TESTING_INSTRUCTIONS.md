# دليل الاختبار الشامل

## 1) التحضير السريع

1. انسخ ملف البيئة:
   ```bash
   cp .env.example .env.local
   ```
2. املأ إعدادات Firebase وخرائط Google بمفاتيحك الفعلية.
3. ثبّت المتطلبات:
   ```bash
   npm install
   npm install -g expo-cli eas-cli
   ```

## 2) بيانات الاختبار

- الحسابات والأدوار: `src/testData/mockData.js`
- السيناريوهات: `src/testData/testScenarios.js`
- قائمة مجموعات الاختبار: `src/tests/testSuite.js`

## 3) سيناريوهات التجربة

نفّذ السيناريوهات الثمانية بالترتيب:
1. تسجيل دخول عميل
2. تسجيل طلبية
3. تتبع الطلب الحي
4. المحفظة الرقمية
5. التقييم والمراجعة
6. لوحة التاجر
7. لوحة الكابتن
8. الأمان والمصادقة

## 4) أوامر الاختبار

```bash
npm test
npm run test:full
npm run test:performance
npm run test:security
```

> هذه الأوامر تعرض قائمة تحقق (Checklist) منظمة لمسارات الاختبار المطلوبة وتُستخدم كمرجع تشغيلي سريع.

## 5) تشغيل التطبيق للتجربة

```bash
npm start
# داخل Expo CLI: اضغط w للويب، a للأندرويد، i للـ iOS
```
