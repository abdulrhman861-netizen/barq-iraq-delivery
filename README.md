# 🚚 برق العراق للتوصيل

**تطبيق توصيل متكامل يربط بين التجار والكابتن والزبائن بأمان وسرعة**

---

## 📋 نظرة عامة

تطبيق **برق العراق** هو منصة توصيل حديثة مكتوبة بـ **React Native + Expo** وتستخدم **Firebase** كسحابة لتخزين البيانات.

### ✨ الميزات الرئيسية:

1. **🗺️ التتبع الحي (Real-time Tracking)** - تتبع موقع الكابتن بشكل فوري على الخريطة
2. **⭐ نظام التقييم والتقيمات** - تقييم الكابتن والخدمة من جميع الأطراف
3. **💬 نظام الدردشة (Chat System)** - تواصل مباشر بين المستخدمين
4. **📱 الإشعارات (Push Notifications)** - إشعارات فورية للتحديثات المهمة
5. **💳 نظام الدفع الآمن** - دفع نقدي وإلكتروني
6. **📊 لوحة التحكم (Dashboard)** - احصائيات وتقارير تفصيلية
7. **🔐 تحسينات الأمان** - تشفير وحماية البيانات الحساسة

---

## 🏗️ بنية المشروع

```
barq-iraq-delivery/
├── src/
│   ├── screens/              # الشاشات والواجهات
│   │   ├── auth/             # شاشات التسجيل والدخول
│   │   ├── merchant/         # واجهة التاجر
│   │   ├── captain/          # واجهة الكابتن
│   │   ├── customer/         # واجهة الزبون
│   │   ├── admin/            # واجهة الإدارة
│   │   └── common/           # شاشات عامة
│   ├── components/           # المكونات المعاد استخدامها
│   ├── services/             # خدمات Firebase والـ APIs
│   ├── contexts/             # React Context للبيانات المشتركة
│   ├── constants/            # الثوابت والإعدادات
│   ├── hooks/                # React Hooks المخصصة
│   ├── utils/                # دوال مساعدة
│   ├── styles/               # أنماط عامة
│   └── navigation/           # ملفات التنقل
├── assets/                   # الصور والأيقونات
├── App.js                    # الملف الرئيسي
├── app.json                  # إعدادات Expo
├── package.json              # المعتمديات
├── .env.example              # متغيرات البيئة
└── README.md                 # التوثيق
```

---

## 🚀 البدء السريع

### المتطلبات:
- Node.js v16 أو أحدث
- npm أو yarn
- Expo CLI
- حساب Firebase

### التثبيت:

```bash
# استنساخ المستودع
git clone https://github.com/abdulrhman861-netizen/barq-iraq-delivery.git
cd barq-iraq-delivery

# تثبيت المعتمديات
npm install
# أو
yarn install

# نسخ ملف البيئة
cp .env.example .env
# ثم عدّل .env بمفاتيح Firebase الخاصة بك
```

### التشغيل:

```bash
# تشغيل على المتصفح
npm start

# تشغيل على Android
npm run android

# تشغيل على iOS
npm run ios
```

### تجربة Web Dashboard (Firestore)

بعد تسجيل الدخول، ستظهر لوحة تجربة موحدة على الويب تشمل:
- Chat
- Ratings
- Create Order
- Notifications
- Role switch (captain / merchant / employee / admin)
- Finance & Wallets

إذا بقيت قيم Firebase افتراضية في `.env` سيعمل التطبيق بوضع واجهة تجريبية فقط، وستظهر رسالة إعداد واضحة داخل الـ Dashboard.

---

## 👥 الأدوار (User Roles)

### 1. **التاجر (Merchant)**
   - إنشاء وإدارة الطلبات
   - تحديد الأسعار والعروض
   - عرض الإحصائيات
   - إدارة المحفظة

### 2. **الكابتن/السائق (Captain/Driver)**
   - قبول وإدارة الطلبات
   - تحديث الموقع الحي
   - استلام وتسليم الشحنات
   - عرض الأرباح والتقييمات

### 3. **الزبون/العميل (Customer)**
   - تتبع الطلبات الحية
   - تقييم الخدمة
   - التواصل مع الكابتن
   - عرض سجل الطلبات

### 4. **الإدارة (Admin)**
   - **المدير** (Manager): التحكم الكامل بالنظام
   - **المحاسب** (Accountant): إدارة المحافظ والدفوعات
   - **المتابعة** (Follow-up): متابعة الطلبات والأداء

---

## 🔥 Firebase Structure

```json
{
  "chats": {
    "chatId": {
      "orderId": "order_1",
      "customerId": "user_1",
      "driverId": "user_2",
      "lastMessage": "مرحبا",
      "lastMessageAt": "timestamp",
      "messages": {
        "messageId": {
          "senderId": "user_1",
          "text": "مرحبا",
          "createdAt": "timestamp",
          "type": "text"
        }
      }
    }
  },
  "ratings": {
    "ratingId": {
      "orderId": "order_1",
      "fromUserId": "user_1",
      "toUserId": "user_2",
      "role": "merchant",
      "score": 5,
      "comment": "سريع",
      "createdAt": "timestamp"
    }
  },
  "notifications": {
    "notificationId": {
      "userId": "user_1",
      "title": "عنوان",
      "body": "محتوى",
      "type": "system",
      "isRead": false,
      "createdAt": "timestamp"
    }
  },
  "wallets": {
    "walletId": {
      "ownerUserId": "user_1",
      "ownerRole": "merchant",
      "currency": "IQD",
      "balance": 0,
      "updatedAt": "timestamp",
      "transactions": {
        "txId": {
          "type": "credit|debit",
          "amount": 1000,
          "description": "manual",
          "relatedOrderId": "order_1",
          "createdAt": "timestamp",
          "createdBy": "admin_1"
        }
      }
    }
  },
  "users": {
    "user_id": {
      "name": "اسم المستخدم",
      "phone": "رقم الهاتف",
      "role": "merchant|captain|customer|admin",
      "email": "البريد الإلكتروني",
      "wallet": 0,
      "rating": 0,
      "createdAt": "timestamp"
    }
  },
  "orders": {
    "order_id": {
      "merchantId": "معرف التاجر",
      "customerId": "معرف الزبون",
      "captainId": "معرف الكابتن",
      "itemPrice": 0,
      "deliveryFee": 0,
      "status": "pending|assigned|in_transit|delivered",
      "createdAt": "timestamp",
      "deliveredAt": "timestamp"
    }
  },
  "chats": {
    "chat_id": {
      "participants": [],
      "messages": [],
      "createdAt": "timestamp"
    }
  },
  "ratings": {
    "rating_id": {
      "raterId": "معرف المُقيّم",
      "ratedUserId": "معرف المستخدم المُقيّم",
      "score": 5,
      "comment": "التعليق",
      "createdAt": "timestamp"
    }
  }
}
```

---

## 🛠️ التكنولوجيا المستخدمة

| الاستخدام | التكنولوجيا |
|----------|------------|
| **الإطار الأساسي** | React Native + Expo |
| **لغة البرمجة** | JavaScript |
| **قاعدة البيانات** | Firebase Realtime Database |
| **الخريطة** | React Native Maps |
| **الموقع** | expo-location |
| **الإشعارات** | expo-notifications |
| **التنقل** | React Navigation |
| **التخزين المحلي** | AsyncStorage |
| **الصوت** | expo-av |

---

## 📚 التوثيق التفصيلي

- [دليل التثبيت](./docs/INSTALLATION.md)
- [هندسة التطبيق](./docs/ARCHITECTURE.md)
- [دليل المطورين](./docs/DEVELOPER_GUIDE.md)
- [API Firebase](./docs/FIREBASE_API.md)

---

## 🤝 المساهمة

نرحب بمساهماتك! يرجى:

1. Fork المستودع
2. إنشاء فرع جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى الفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

---

## 📞 الدعم

إذا واجهت مشاكل:

- 📧 البريد الإلكتروني: support@barqiraq.com
- 📱 الهاتف: 07700000000
- 🐛 [فتح Issue على GitHub](https://github.com/abdulrhman861-netizen/barq-iraq-delivery/issues)

---

## 📄 الترخيص

جميع الحقوق محفوظة © 2024 برق العراق للتوصيل

---

## 👨‍💻 الفريق

- **المطور الرئيسي**: [عبدالرحمن](https://github.com/abdulrhman861-netizen)

---

**شكراً لاستخدامك برق العراق! 🚀**
