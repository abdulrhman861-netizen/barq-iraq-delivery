// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES, FONT_SIZES } from '../constants/index';
import {
  loginWithEmail,
  registerWithEmail,
  resetPasswordByEmail,
} from '../services/firebaseAuth';

const LoginScreen = ({ isFirebaseConfigured, onOpenDemoMode }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: '' });
  const isConfigured = Boolean(isFirebaseConfigured);

  const showError = (message) => setFeedback({ type: 'error', message });
  const showSuccess = (message) => setFeedback({ type: 'success', message });

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleLogin = async () => {
    try {
      if (!email.trim()) {
        showError('الرجاء إدخال البريد الإلكتروني.');
        return;
      }
      if (!password.trim()) {
        showError('الرجاء إدخال كلمة المرور.');
        return;
      }
      if (!validateEmail(email.trim())) {
        showError('الرجاء إدخال بريد إلكتروني صحيح.');
        return;
      }

      setIsLoading(true);
      setFeedback({ type: null, message: '' });
      await loginWithEmail({ email, password });
      showSuccess('تم تسجيل الدخول بنجاح ✅');
    } catch (err) {
      showError(err?.arabicMessage || 'فشل تسجيل الدخول.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      if (!email.trim()) {
        showError('الرجاء إدخال البريد الإلكتروني.');
        return;
      }
      if (!validateEmail(email.trim())) {
        showError('الرجاء إدخال بريد إلكتروني صحيح.');
        return;
      }
      if (!password.trim()) {
        showError('الرجاء إدخال كلمة المرور.');
        return;
      }
      if (password.length < 6) {
        showError('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
        return;
      }
      if (password !== confirmPassword) {
        showError('تأكيد كلمة المرور غير مطابق.');
        return;
      }

      setIsLoading(true);
      setFeedback({ type: null, message: '' });
      await registerWithEmail({
        email,
        password,
        displayName: fullName,
        phone,
      });
      showSuccess('تم إنشاء الحساب بنجاح ✅');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setPhone('');
      setIsRegisterMode(false);
    } catch (err) {
      showError(err?.arabicMessage || 'فشل إنشاء الحساب.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      if (!isConfigured) {
        showError('يرجى إكمال إعدادات Firebase أولاً لاستخدام إعادة تعيين كلمة المرور.');
        return;
      }
      if (!email.trim()) {
        showError('أدخل البريد الإلكتروني أولاً لإرسال رابط إعادة التعيين.');
        return;
      }
      if (!validateEmail(email.trim())) {
        showError('الرجاء إدخال بريد إلكتروني صحيح.');
        return;
      }

      setIsLoading(true);
      setFeedback({ type: null, message: '' });
      await resetPasswordByEmail(email);
      showSuccess('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
    } catch (err) {
      showError(err?.arabicMessage || 'تعذر إرسال رابط إعادة التعيين.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsRegisterMode((prev) => !prev);
    setFeedback({ type: null, message: '' });
    setFullName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🚀</Text>
          <Text style={styles.appName}>برق العراق</Text>
          <Text style={styles.tagline}>تطبيق التوصيل السريع</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>
            {isRegisterMode ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </Text>
          <Text style={styles.subtitle}>
            {isRegisterMode ? 'أنشئ حساباً جديداً بالبريد الإلكتروني' : 'ادخل بيانات حسابك'}
          </Text>

          {isRegisterMode && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>الاسم الكامل (اختياري)</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="اكتب اسمك"
                  placeholderTextColor={COLORS.border}
                  value={fullName}
                  onChangeText={setFullName}
                  editable={!isLoading}
                />
              </View>
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>البريد الإلكتروني</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="example@email.com"
                placeholderTextColor={COLORS.border}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
          </View>

          {isRegisterMode && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>رقم الهاتف (اختياري)</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="7XXXXXXXXX"
                  placeholderTextColor={COLORS.border}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />
              </View>
            </View>
          )}

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>كلمة المرور</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="أدخل كلمة المرور"
                placeholderTextColor={COLORS.border}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {isRegisterMode && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>تأكيد كلمة المرور</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="أعد إدخال كلمة المرور"
                  placeholderTextColor={COLORS.border}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
              </View>
            </View>
          )}

          {!!feedback.message && (
            <View
              style={[
                styles.feedbackBox,
                feedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess,
              ]}
            >
              <Text
                style={[
                  styles.feedbackText,
                  feedback.type === 'error' ? styles.feedbackErrorText : styles.feedbackSuccessText,
                ]}
              >
                {feedback.message}
              </Text>
            </View>
          )}

          {!isConfigured && (
            <View style={[styles.feedbackBox, styles.feedbackWarning]}>
              <Text style={[styles.feedbackText, styles.feedbackWarningText]}>
                يرجى إكمال إعدادات Firebase في ملف .env باستخدام متغيرات EXPO_PUBLIC_FIREBASE_*.
              </Text>
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, (isLoading || !isConfigured) && styles.loginButtonDisabled]}
            onPress={isRegisterMode ? handleRegister : handleLogin}
            disabled={isLoading || !isConfigured}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} size="large" />
            ) : (
              <Text style={styles.loginButtonText}>{isRegisterMode ? 'إنشاء الحساب' : 'دخول'}</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password */}
          {!isRegisterMode && (
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
              disabled={isLoading || !isConfigured}
            >
              <Text style={styles.forgotPasswordText}>هل نسيت كلمة المرور؟</Text>
            </TouchableOpacity>
          )}

          {!isConfigured && (
            <TouchableOpacity
              style={styles.demoButton}
              onPress={onOpenDemoMode}
              disabled={isLoading}
            >
              <Text style={styles.demoButtonText}>الدخول للوضع التجريبي بدون Firebase</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            {isRegisterMode ? 'لديك حساب بالفعل؟ ' : 'ليس لديك حساب؟ '}
          </Text>
          <TouchableOpacity
            onPress={handleToggleMode}
            disabled={isLoading}
          >
            <Text style={styles.registerLink}>
              {isRegisterMode ? 'العودة لتسجيل الدخول' : 'إنشاء حساب جديد'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <FeatureItem icon="🔒" title="آمن تماماً" />
          <FeatureItem icon="⚡" title="سريع وفعّال" />
          <FeatureItem icon="📱" title="سهل الاستخدام" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const FeatureItem = ({ icon, title }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SIZES.xxl,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.xxl,
    paddingHorizontal: SIZES.md,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: SIZES.xxl,
  },
  logo: {
    fontSize: FONT_SIZES.huge * 2,
    marginBottom: SIZES.md,
  },
  appName: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  tagline: {
    fontSize: FONT_SIZES.base,
    color: COLORS.white,
    opacity: 0.9,
  },
  formContainer: {
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.xl,
  },
  welcomeText: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.xs,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray,
    marginBottom: SIZES.xl,
    textAlign: 'right',
  },
  inputContainer: {
    marginBottom: SIZES.lg,
  },
  label: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: SIZES.sm,
    textAlign: 'right',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SIZES.md,
    backgroundColor: COLORS.gray,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.darkGray,
    textAlign: 'right',
  },
  eyeIcon: {
    padding: SIZES.sm,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SIZES.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  demoButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingVertical: SIZES.sm,
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  demoButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT_SIZES.base,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SIZES.xxl,
    paddingHorizontal: SIZES.md,
  },
  registerText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.darkGray,
  },
  registerLink: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  feedbackBox: {
    borderRadius: 10,
    padding: SIZES.sm,
    marginBottom: SIZES.md,
  },
  feedbackText: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'right',
    fontWeight: '600',
  },
  feedbackError: {
    backgroundColor: '#FDECEC',
    borderColor: '#F5A3A3',
    borderWidth: 1,
  },
  feedbackErrorText: {
    color: '#9F1D1D',
  },
  feedbackSuccess: {
    backgroundColor: '#E9F8EE',
    borderColor: '#8FD5A6',
    borderWidth: 1,
  },
  feedbackSuccessText: {
    color: '#176B37',
  },
  feedbackWarning: {
    backgroundColor: '#FFF4E5',
    borderColor: '#F2C078',
    borderWidth: 1,
  },
  feedbackWarningText: {
    color: '#9A5A00',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SIZES.md,
    paddingTop: SIZES.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: FONT_SIZES.huge,
    marginBottom: SIZES.xs,
  },
  featureTitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.darkGray,
    fontWeight: '600',
  },
});

export default LoginScreen;
