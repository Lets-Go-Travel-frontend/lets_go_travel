'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api/auth';

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
        // Guardar sesión mock
        localStorage.setItem('current_user', JSON.stringify({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          id: response.data?.user_id
        }));
        
        // Redirigir al home (podemos cambiar esto después)
        router.push('/');
        
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

  const logout = () => {
    localStorage.removeItem('current_user');
    router.push('/');
  };

  const getCurrentUser = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('current_user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  };

  return {
    register,
    logout,
    getCurrentUser,
    loading,
    error,
  };
}