// Context للمستخدم والمصادقة
import React, { createContext, useState, useCallback } from 'react';
import { createUser, getUserData, updateUser } from '../services/firebase';
import { saveUserData, getUserData as getLocalUserData, clearAllData } from '../services/storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // تسجيل مستخدم جديد
  const register = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      const userId = Date.now().toString();
      const newUser = {
        id: userId,
        ...userData,
        createdAt: new Date().toISOString(),
        wallet: 0,
        rating: 0,
      };

      await createUser(userId, newUser);
      await saveUserData(newUser);
      setUser(newUser);

      console.log('✅ User registered successfully:', newUser.name);
      return newUser;
    } catch (err) {
      const errorMessage = err.message || 'خطأ في التسجيل';
      setError(errorMessage);
      console.error('❌ Registration error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // تسجيل دخول
  const login = useCallback(async (phone, password) => {
    try {
      setIsLoading(true);
      setError(null);

      // هنا يتم البحث عن المستخدم في Firebase
      // للآن نفترض أن البيانات تحتوي على بيانات تسجيل الدخول
      const userData = await getLocalUserData();

      if (userData && userData.phone === phone && userData.pass === password) {
        setUser(userData);
        await saveUserData(userData);
        console.log('✅ Login successful');
        return userData;
      } else {
        throw new Error('بيانات تسجيل الدخول غير صحيحة');
      }
    } catch (err) {
      const errorMessage = err.message || 'خطأ في تسجيل الدخول';
      setError(errorMessage);
      console.error('❌ Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // تسجيل خروج
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await clearAllData();
      setUser(null);
      setError(null);
      console.log('✅ Logout successful');
    } catch (err) {
      console.error('❌ Logout error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // تحديث بيانات المستخدم
  const updateUserData = useCallback(async (updates) => {
    try {
      setIsLoading(true);
      if (!user) throw new Error('No user logged in');

      const updatedUser = { ...user, ...updates };
      await updateUser(user.id, updates);
      await saveUserData(updatedUser);
      setUser(updatedUser);

      console.log('✅ User data updated');
      return updatedUser;
    } catch (err) {
      const errorMessage = err.message || 'خطأ في التحديث';
      setError(errorMessage);
      console.error('❌ Update error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // تحميل بيانات المستخدم من التخزين المحلي
  const restoreUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const savedUser = await getLocalUserData();
      if (savedUser) {
        setUser(savedUser);
        console.log('✅ User restored from storage');
      }
    } catch (err) {
      console.error('❌ Error restoring user:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    isLoading,
    error,
    register,
    login,
    logout,
    updateUserData,
    restoreUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
