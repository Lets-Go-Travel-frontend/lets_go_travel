// app/components/VerificationForm.tsx
"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Link,
  IconButton
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { verifyUser } from '@/lib/api/auth';

interface VerificationFormProps {
  email?: string;
  accessToken?: string;
  onBack?: () => void;
}

export default function VerificationForm({ 
  email, 
  accessToken, 
  onBack 
}: VerificationFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Obtener email y token de los props o de la URL
  const userEmail = email || searchParams.get('email') || '';
  const userAccessToken = accessToken || searchParams.get('access_token') || '';
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!userEmail || !userAccessToken) {
      setError('Falta información de verificación. Por favor, intenta iniciar sesión nuevamente.');
      setLoading(false);
      return;
    }

    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      setLoading(false);
      return;
    }

    try {
      const response = await verifyUser({
        access_token: userAccessToken,
        email: userEmail,
        code: code        
      });

      if (response.success) {
        // Verificación exitosa - redirigir al home
        console.log('✅ Verificación exitosa:', response);
        router.push('/');
      } else {
        setError(response.message || 'Error en la verificación');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleBackToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200 max-w-md mx-auto"
    >
      {/* Logo */}
      <Box className="text-center mb-4">
        <img 
          src="/images/logo.png" 
          alt="Let's Go Vacation" 
          width={180} 
          height={72}
          className="mx-auto"
        />
      </Box>

      {/* Título */}
      <Box className="text-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          Verifica tu cuenta
        </Typography>
        <Typography variant="body1" className="text-gray-600 mt-2">
          Ingresa el código de 6 dígitos que enviamos a:
        </Typography>
        <Typography variant="body2" className="text-blue-900 font-semibold mt-1">
          {userEmail}
        </Typography>
      </Box>

      {/* Botón volver */}
      <Box className="flex items-center mb-2">
        <IconButton
          onClick={onBack || handleBackToHome}
          size="small"
          className="text-gray-500 hover:text-gray-700"
          disabled={loading}
        >
          <ArrowBack fontSize="small" />
        </IconButton>
        <Typography variant="body2" className="text-gray-600 ml-2">
          Volver al inicio
        </Typography>
      </Box>

      {/* Mostrar errores */}
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Campo de código */}
      <TextField
        fullWidth
        label="Código de verificación"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        required
        size="small"
        placeholder="123456"
        disabled={loading}
        inputProps={{
          maxLength: 6,
          pattern: '[0-9]*',
          inputMode: 'numeric'
        }}
        helperText="Ingresa los 6 dígitos que recibiste por email"
      />

      {/* Botón de verificación */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading || code.length !== 6}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 disabled:bg-gray-400"
        size="large"
      >
        {loading ? 'Verificando...' : 'Verificar Cuenta'}
      </Button>
    </Box>
  );
}