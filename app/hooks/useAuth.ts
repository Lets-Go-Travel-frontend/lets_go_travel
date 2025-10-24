// hooks/useAuth.ts - VERSIÓN CORREGIDA
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser, logoutUser, verifyUser } from '@/lib/api/auth';

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
        console.log('✅ Registro exitoso, haciendo login automático...', response);
        
        // HACER LOGIN AUTOMÁTICO después del registro
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
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser(data);
      
      if (response.success) {
        console.log('✅ Login exitoso:', response);
        
        const accessToken = response.data?.access_token;
        const userData = response.data?.user;

        if (accessToken && userData) {
          sessionStorage.setItem('pending_verification_token', accessToken);
          sessionStorage.setItem('pending_verification_email', data.email);
          sessionStorage.setItem('pending_user_data', JSON.stringify(userData));
          
          if (!userData.email_verified) {
            console.log('🔐 Usuario no verificado, redirigiendo a verificación...');
            router.push(`/auth/verify?email=${encodeURIComponent(data.email)}&access_token=${encodeURIComponent(accessToken)}`);
          } else {
            console.log('🎉 Usuario verificado, guardando en localStorage...');
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
        // Detectar errores específicos de credenciales
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
      const response = await verifyUser(data);
      
      if (response.success) {
        console.log('✅ Verificación exitosa:', response);
        
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
          
          // ✅ FINALMENTE guardar en localStorage
          localStorage.setItem('current_user', JSON.stringify(userInfo));
          localStorage.setItem('access_token', pendingToken);
          
          // Limpiar datos temporales
          sessionStorage.removeItem('pending_verification_token');
          sessionStorage.removeItem('pending_verification_email');
          sessionStorage.removeItem('pending_user_data');
          
          console.log('🎉 Usuario verificado y guardado en localStorage');
        }
        
        // ✅ CAMBIO 1: Redirigir a la raíz (home) después de verificación
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

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🚪 Iniciando logout...');
      
      // 1. Llamar al endpoint de logout en la API
      const response = await logoutUser();
      
      if (response.success) {
        console.log('✅ Logout exitoso en backend');
      }
    } catch (err) {
      console.error('❌ Error en logout del backend:', err);
    } finally {
      // 2. SIEMPRE limpiar todo el almacenamiento
      console.log('🧹 Limpiando almacenamiento...');
      localStorage.removeItem('current_user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      // También limpiar sessionStorage
      sessionStorage.removeItem('pending_verification_token');
      sessionStorage.removeItem('pending_verification_email');
      sessionStorage.removeItem('pending_user_data');
      
      setLoading(false);
      
      // 3. Redirigir al home
      console.log('🔀 Redirigiendo a home...');
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
    getCurrentUser,
    getAccessToken,
    isUserVerified,
    hasPendingVerification, 
    getPendingVerificationData, 
    loading,
    error,
  };
}