import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirebaseApp } from './firebaseClient';

const getFirebaseAuth = () => {
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
};

const getFirebaseFirestore = () => {
  const app = getFirebaseApp();
  return app ? getFirestore(app) : null;
};

const createNotConfiguredError = () => {
  const error = new Error('Firebase not configured');
  error.arabicMessage =
    'إعدادات Firebase غير مكتملة. يرجى تعبئة متغيرات EXPO_PUBLIC_FIREBASE_* في ملف .env.';
  return error;
};

const mapAuthErrorToArabic = (error) => {
  const code = error?.code || '';
  const fallback = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';

  const messages = {
    'auth/invalid-email': 'صيغة البريد الإلكتروني غير صحيحة.',
    'auth/user-disabled': 'تم تعطيل هذا الحساب.',
    'auth/user-not-found': 'لا يوجد حساب بهذا البريد الإلكتروني.',
    'auth/wrong-password': 'كلمة المرور غير صحيحة.',
    'auth/invalid-credential': 'بيانات تسجيل الدخول غير صحيحة.',
    'auth/email-already-in-use': 'هذا البريد الإلكتروني مستخدم بالفعل.',
    'auth/weak-password': 'كلمة المرور ضعيفة. يجب أن تكون 6 أحرف على الأقل.',
    'auth/too-many-requests': 'تم حظر المحاولات مؤقتاً. حاول لاحقاً.',
    'auth/network-request-failed': 'تعذر الاتصال بالإنترنت. تحقق من الشبكة.',
    'auth/missing-password': 'يرجى إدخال كلمة المرور.',
  };

  return messages[code] || fallback;
};

const upsertAuthUserProfile = async ({
  uid,
  email,
  displayName,
  phone,
  includeCreatedAt = false,
  defaultRole,
}) => {
  const db = getFirebaseFirestore();
  if (!db || !uid) return;

  const payload = {
    email: email || '',
    displayName: displayName || '',
    phone: phone || '',
    updatedAt: serverTimestamp(),
  };

  if (defaultRole) {
    payload.role = defaultRole;
  }

  if (includeCreatedAt) {
    payload.createdAt = serverTimestamp();
  }

  await setDoc(
    doc(db, 'users', uid),
    payload,
    { merge: true }
  );
};

export const subscribeToAuthState = (onChange) => {
  const auth = getFirebaseAuth();
  if (!auth) {
    onChange(null);
    return () => {};
  }

  return onAuthStateChanged(auth, onChange);
};

export const registerWithEmail = async ({ email, password, displayName, phone }) => {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw createNotConfiguredError();
  }

  try {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);

    if (displayName?.trim()) {
      await updateProfile(credential.user, { displayName: displayName.trim() });
    }

    await upsertAuthUserProfile({
      uid: credential.user.uid,
      email: credential.user.email,
      displayName: displayName?.trim() || credential.user.displayName || '',
      phone: phone?.trim() || '',
      includeCreatedAt: true,
      defaultRole: 'merchant',
    });

    return credential.user;
  } catch (error) {
    error.arabicMessage = mapAuthErrorToArabic(error);
    throw error;
  }
};

export const loginWithEmail = async ({ email, password }) => {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw createNotConfiguredError();
  }

  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    await upsertAuthUserProfile({
      uid: credential.user.uid,
      email: credential.user.email,
      displayName: credential.user.displayName || '',
      phone: credential.user.phoneNumber || '',
    });
    return credential.user;
  } catch (error) {
    error.arabicMessage = mapAuthErrorToArabic(error);
    throw error;
  }
};

export const resetPasswordByEmail = async (email) => {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw createNotConfiguredError();
  }

  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error) {
    error.arabicMessage = mapAuthErrorToArabic(error);
    throw error;
  }
};

export const signOutUser = async () => {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await signOut(auth);
};

export const getArabicAuthErrorMessage = mapAuthErrorToArabic;
