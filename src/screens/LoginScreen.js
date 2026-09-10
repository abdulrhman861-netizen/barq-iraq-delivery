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
  Alert,
} from 'react-native';
import { COLORS, SIZES, FONT_SIZES } from '../constants/index';

const LoginScreen = ({ onLoginSuccess }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if (!phone.trim()) {
        Alert.alert('خطأ', 'الرجاء إدخال رقم الهاتف');
        return;
      }
      if (!password.trim()) {
        Alert.alert('خطأ', 'الرجاء إدخال كلمة المرور');
        return;
      }

      setIsLoading(true);
      
      // محاكاة عملية تسجيل الدخول
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('نجاح', 'تم تسجيل الدخول بنجاح ✅');
        onLoginSuccess();
      }, 1500);
    } catch (err) {
      setIsLoading(false);
      Alert.alert('خطأ', 'فشل تسجيل الدخول');
    }
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
          <Text style={styles.welcomeText}>تسجيل الدخول</Text>
          <Text style={styles.subtitle}>ادخل بيانات حسابك</Text>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>رقم الهاتف</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefix}>🇮🇶 +964</Text>
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

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} size="large" />
            ) : (
              <Text style={styles.loginButtonText}>دخول</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>هل نسيت كلمة المرور؟</Text>
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>ليس لديك حساب؟ </Text>
          <TouchableOpacity>
            <Text style={styles.registerLink}>إنشاء حساب جديد</Text>
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
  inputPrefix: {
    fontSize: FONT_SIZES.base,
    color: COLORS.darkGray,
    marginRight: SIZES.sm,
    fontWeight: '600',
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
