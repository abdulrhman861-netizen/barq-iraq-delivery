const fs = require('fs');
const path = require('path');

const mode = process.argv[2] || 'unit';
const allowedModes = new Set(['unit', 'full', 'performance', 'security']);

if (!allowedModes.has(mode)) {
  console.error(`❌ نمط اختبار غير مدعوم: ${mode}`);
  process.exit(1);
}

const root = path.resolve(__dirname, '..', '..');
const requiredFiles = ['App.js', 'package.json', '.env.example'];
const requiredEnvKeys = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'FIREBASE_DB_URL',
  'ENCRYPTION_KEY',
  'APP_VERSION',
  'APP_ENVIRONMENT',
  'SUPPORT_PHONE',
  'GOOGLE_MAPS_API_KEY',
  'WAZE_API_KEY',
  'PAYMENT_GATEWAY_KEY',
  'PAYMENT_GATEWAY_SECRET',
];

function checkRequiredFiles() {
  const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
  if (missing.length) {
    console.error(`❌ ملفات أساسية مفقودة: ${missing.join(', ')}`);
    return false;
  }
  console.log('✅ الملفات الأساسية موجودة');
  return true;
}

function checkEnvTemplate() {
  const envPath = path.join(root, '.env.example');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const missingKeys = requiredEnvKeys.filter((key) => !envContent.includes(`${key}=`));
  if (missingKeys.length) {
    console.error(`❌ مفاتيح بيئة مفقودة في .env.example: ${missingKeys.join(', ')}`);
    return false;
  }
  console.log('✅ ملف .env.example يحتوي جميع المفاتيح المطلوبة');
  return true;
}

function run() {
  console.log(`🧪 تشغيل اختبار: ${mode}`);
  const checks = [checkRequiredFiles];

  if (mode === 'security' || mode === 'full') {
    checks.push(checkEnvTemplate);
  }

  const ok = checks.every((check) => check());

  if (!ok) {
    console.error('❌ فشل تنفيذ مجموعة الاختبار');
    process.exit(1);
  }

  console.log('✅ اكتمل الاختبار بنجاح');
}

run();
