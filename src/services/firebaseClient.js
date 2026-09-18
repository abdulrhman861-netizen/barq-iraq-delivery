import { getApp, getApps, initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '../constants/firebase';

const FIREBASE_REQUIRED_FIELDS = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const isPlaceholder = (value = '') => {
  const normalized = String(value).toLowerCase();
  return (
    !normalized ||
    normalized.includes('your_') ||
    normalized.includes('yourproject') ||
    normalized.includes('example')
  );
};

export const getFirebaseSetupState = () => {
  const missingFields = FIREBASE_REQUIRED_FIELDS.filter((field) => !FIREBASE_CONFIG[field]);
  const hasPlaceholderValues = FIREBASE_REQUIRED_FIELDS.some((field) => isPlaceholder(FIREBASE_CONFIG[field]));

  return {
    isConfigured: missingFields.length === 0 && !hasPlaceholderValues,
    missingFields,
    hasPlaceholderValues,
  };
};

export const getFirebaseApp = () => {
  const { isConfigured } = getFirebaseSetupState();
  if (!isConfigured) return null;

  return getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);
};
