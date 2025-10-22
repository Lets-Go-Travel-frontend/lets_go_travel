// hooks/useAuth.ts - Versión simple
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser, logoutUser } from '@/lib/api/auth';

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

        if (accessToken) {
          // Guardar tokens
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', response.data.refresh_token);
          
          const userInfo = {
            email: data.email,
            firstName: response.data?.user?.first_name,
            lastName: response.data?.user?.last_name,
            userId: response.data?.user?.user_id,
            userType: response.data?.user?.user_type,
            needsVerification: true // SIEMPRE asumir que necesita verificación después del login
          };
          localStorage.setItem('current_user', JSON.stringify(userInfo));
          
          // SIEMPRE redirigir a verificación después del login
          console.log('🔐 Redirigiendo a verificación...');
          router.push(`/auth/verify?email=${encodeURIComponent(data.email)}&access_token=${encodeURIComponent(accessToken)}`);
        }
        
        return response;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
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
      const { verifyUser } = await import('@/lib/api/auth');
      const response = await verifyUser(data);
      
      if (response.success) {
        console.log('✅ Verificación exitosa:', response);
        
        // Marcar como verificado
        const currentUser = getCurrentUser();
        const updatedUser = {
          ...currentUser,
          needsVerification: false,
          isVerified: true,
          verifiedAt: new Date().toISOString()
        };
        
        localStorage.setItem('current_user', JSON.stringify(updatedUser));
        router.push('/');
        
        return response;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('current_user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/');
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
    return user && user.isVerified;
  };

  return {
    register,
    login,
    verify,
    logout,
    getCurrentUser,
    getAccessToken,
    isUserVerified,
    loading,
    error,
  };
}