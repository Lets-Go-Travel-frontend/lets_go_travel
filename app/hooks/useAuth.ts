'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser, logoutUser, verifyUser, forgotPassword, refreshToken } from '@/lib/api/auth';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await registerUser(data);
      
      if (response.success) {
        await login({
          email: data.email,
          password: data.password
        });
        
        return response;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: {
    email: string;
    password: string;
  }, onSuccess?: () => void) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser(data);
      
      if (response.success) {
        const accessToken = response.data?.access_token;
        const userData = response.data?.user;

        if (accessToken && userData) {
          sessionStorage.setItem('pending_verification_token', accessToken);
          sessionStorage.setItem('pending_verification_email', data.email);
          sessionStorage.setItem('pending_user_data', JSON.stringify(userData));
          
          if (!userData.email_verified) {
            router.push(`/auth/verify?email=${encodeURIComponent(data.email)}&access_token=${encodeURIComponent(accessToken)}`);
          } else {
            const userInfo = {
              email: userData.email,
              firstName: userData.first_name,
              lastName: userData.last_name,
              userId: userData.user_id,
              userType: userData.user_type,
              emailVerified: true,
              needsVerification: false
            };
            
            localStorage.setItem('current_user', JSON.stringify(userInfo));
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            
            if (onSuccess) {
              onSuccess();
            }
            
            router.push('/');
          }
        }
        
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      let errorMessage = 'Error de inicio de sesión';
      
      if (err instanceof Error) {
        if (err.message.includes('401') || 
            err.message.includes('Unauthorized') || 
            err.message.includes('invalid') ||
            err.message.includes('credenciales') ||
            err.message.toLowerCase().includes('password') ||
            err.message.toLowerCase().includes('email')) {
          errorMessage = 'Usuario o contraseña incorrectos';
        } else if (err.message.includes('429')) {
          errorMessage = 'Demasiados intentos. Por favor, espera unos minutos.';
        } else if (err.message.includes('400')) {
          errorMessage = 'Datos de inicio de sesión inválidos';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verify = async (data: {
    access_token: string;
    email: string;
    code: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await verifyUser({
        access_token: data.access_token,
        email: data.email,
        code: data.code,
        operation_type: 'email_verification',
      });
      
      if (response.success) {
        const pendingUserData = sessionStorage.getItem('pending_user_data');
        const pendingToken = sessionStorage.getItem('pending_verification_token');
        
        if (pendingUserData && pendingToken) {
          const userData = JSON.parse(pendingUserData);
          
          const userInfo = {
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name,
            userId: userData.user_id,
            userType: userData.user_type,
            emailVerified: true,
            needsVerification: false,
            verifiedAt: new Date().toISOString()
          };
          
          localStorage.setItem('current_user', JSON.stringify(userInfo));
          localStorage.setItem('access_token', pendingToken);
          
          sessionStorage.removeItem('pending_verification_token');
          sessionStorage.removeItem('pending_verification_email');
          sessionStorage.removeItem('pending_user_data');
        }
        
        router.push('/');
        
        return response;
      } else {
        throw new Error(response.message || 'Verification failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await refreshToken({
        email: email,
        operation: 'forgot_password',
      });
      
      if (response.success) {
        sessionStorage.setItem('reset_password_email', email);
        return response;
      } else {
        throw new Error(response.message || 'Failed to send reset code');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset code';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data: {
    email: string;
    code: string;
    new_password: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      // Usar el endpoint /verify con operation_type: 'forgot_password'
      const response = await verifyUser({
        email: data.email,
        code: data.code,
        new_password: data.new_password,
        operation_type: 'forgot_password',
      });
      
      if (response.success) {
        // Limpiar storage después del reset exitoso
        sessionStorage.removeItem('reset_password_email');
        sessionStorage.removeItem('reset_code_verified');
        sessionStorage.removeItem('reset_code');
        return response;
      } else {
        throw new Error(response.message || 'Failed to reset password');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data: {
    current_password: string;
    new_password: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      
      const response = await refreshToken({
        refresh_token: refreshTokenValue || undefined,
        current_password: data.current_password,
        new_password: data.new_password,
        operation: 'change_password',
      });
      
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Failed to change password');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setLoading(true);
    setError(null);

    try {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      
      const response = await refreshToken({
        refresh_token: refreshTokenValue || undefined,
        resend_verification: 'True',
        operation: 'token_refresh',
      });
      
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Failed to resend verification code');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend verification code';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await logoutUser();
      
      if (response.success) {
      }
    } catch (err) {
    } finally {
      localStorage.removeItem('current_user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      sessionStorage.removeItem('pending_verification_token');
      sessionStorage.removeItem('pending_verification_email');
      sessionStorage.removeItem('pending_user_data');
      
      setLoading(false);
      
      router.push('/');
      router.refresh();
    }
  };

  const getCurrentUser = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('current_user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  };

  const getAccessToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  };

  const isUserVerified = () => {
    const user = getCurrentUser();
    return user && user.emailVerified;
  };

  const hasPendingVerification = () => {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem('pending_verification_token');
    }
    return false;
  };

  const getPendingVerificationData = () => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('pending_verification_token');
      const email = sessionStorage.getItem('pending_verification_email');
      const userData = sessionStorage.getItem('pending_user_data');
      
      return {
        token,
        email,
        userData: userData ? JSON.parse(userData) : null
      };
    }
    return null;
  };

  return {
    register,
    login,
    verify,
    logout,
    forgotPassword: requestPasswordReset,
    resetPassword,
    changePassword,
    resendVerification,
    getCurrentUser,
    getAccessToken,
    isUserVerified,
    hasPendingVerification, 
    getPendingVerificationData, 
    requestPasswordReset,
    loading,
    error,
  };
}