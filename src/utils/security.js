// أدوات الأمان والتشفير
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'barq-iraq-secure-key-2024';

// =================== تشفير البيانات ===================

/**
 * تشفير البيانات الحساسة
 * @param {string} data - البيانات المراد تشفيرها
 * @returns {string}
 */
export const encryptData = (data) => {
  try {
    if (!data) return '';
    return CryptoJS.AES.encrypt(data.toString(), ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('❌ Encryption error:', error);
    return '';
  }
};

/**
 * فك تشفير البيانات
 * @param {string} encryptedData - البيانات المشفرة
 * @returns {string}
 */
export const decryptData = (encryptedData) => {
  try {
    if (!encryptedData) return '';
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('❌ Decryption error:', error);
    return '';
  }
};

/**
 * عمل Hash لبيانات حساسة (بدون إمكانية استرجاع)
 * @param {string} data - البيانات المراد عمل Hash لها
 * @returns {string}
 */
export const hashSensitiveData = (data) => {
  try {
    return CryptoJS.SHA256(data).toString();
  } catch (error) {
    console.error('❌ Hashing error:', error);
    return '';
  }
};

// =================== التحقق من صحة البيانات ===================

/**
 * التحقق من صحة رقم البطاقة (Luhn Algorithm)
 * @param {string} cardNumber - رقم البطاقة
 * @returns {boolean}
 */
export const validateCardNumber = (cardNumber) => {
  if (!cardNumber) return false;
  
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * التحقق من صحة CVV
 * @param {string} cvv - رمز CVV
 * @returns {boolean}
 */
export const validateCVV = (cvv) => {
  return /^\d{3,4}$/.test(cvv);
};

/**
 * التحقق من صحة تاريخ انتهاء البطاقة
 * @param {string} expiryDate - تاريخ الانتهاء (MM/YY)
 * @returns {boolean}
 */
export const validateExpiryDate = (expiryDate) => {
  if (!expiryDate || expiryDate.length !== 5) return false;

  const [month, year] = expiryDate.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const expYear = parseInt(year, 10);
  const expMonth = parseInt(month, 10);

  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;

  return true;
};

/**
 * التحقق من صحة رقم الهاتف العراقي
 * @param {string} phone - رقم الهاتف
 * @returns {boolean}
 */
export const validateIraqiPhone = (phone) => {
  return /^(\+964|0)?[5-7][0-9]{9}$/.test(phone);
};

/**
 * التحقق من صحة البريد الإلكتروني
 * @param {string} email - البريد الإلكتروني
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// =================== حماية من الاحتيال ===================

/**
 * كشف محاولات الاحتيال بناءً على السلوك
 * @param {object} paymentData - بيانات المعاملة
 * @returns {object} نتيجة الفحص
 */
export const fraudDetection = (paymentData) => {
  const flags = [];
  const { amount, userId, location, deviceId, lastPaymentTime } = paymentData;

  // فحص 1: مبلغ غير عادي
  if (amount > 5000000) {
    flags.push({ level: 'warning', message: 'مبلغ كبير جداً' });
  }

  // فحص 2: عمليات متتالية سريعة
  if (lastPaymentTime) {
    const timeDiff = Date.now() - new Date(lastPaymentTime).getTime();
    if (timeDiff < 60000) {
      // أقل من دقيقة
      flags.push({ level: 'danger', message: 'محاولات دفع متتالية سريعة' });
    }
  }

  // فحص 3: تغيير الموقع الجغرافي بسرعة
  if (location && paymentData.lastLocation) {
    const distance = calculateDistance(location, paymentData.lastLocation);
    if (distance > 500) {
      // أكثر من 500 كم
      flags.push({ level: 'warning', message: 'تغيير موقع جغرافي مريب' });
    }
  }

  // فحص 4: جهاز جديد
  if (paymentData.isNewDevice) {
    flags.push({ level: 'info', message: 'جهاز جديد' });
  }

  return {
    isFraudulent: flags.some((f) => f.level === 'danger'),
    riskLevel: flags.length > 2 ? 'high' : flags.length > 0 ? 'medium' : 'low',
    flags,
  };
};

/**
 * حساب المسافة بين نقطتين جغرافيتين
 * @param {object} location1 - الموقع الأول {latitude, longitude}
 * @param {object} location2 - الموقع الثاني {latitude, longitude}
 * @returns {number} المسافة بالكيلومتر
 */
function calculateDistance(location1, location2) {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = (location2.latitude - location1.latitude) * (Math.PI / 180);
  const dLon = (location2.longitude - location1.longitude) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(location1.latitude * (Math.PI / 180)) *
      Math.cos(location2.latitude * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// =================== توليد رموز آمنة ===================

/**
 * توليد رمز فريد آمن
 * @returns {string}
 */
export const generateSecureToken = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `${timestamp}${randomStr}`.toUpperCase();
};

/**
 * توليد OTP (كود التحقق لمرة واحدة)
 * @param {number} length - طول الكود (افتراضي 6)
 * @returns {string}
 */
export const generateOTP = (length = 6) => {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1))
    .toString()
    .substring(0, length);
};

// =================== السجل الأمني ===================

/**
 * تسجيل النشاط الأمني (للتدقيق)
 * @param {object} auditData - بيانات الحدث
 */
export const logSecurityEvent = (auditData) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...auditData,
  };

  console.log('🔐 Security Audit:', logEntry);
  // هنا يمكن إرسال البيانات إلى خادم logging مركزي
};
