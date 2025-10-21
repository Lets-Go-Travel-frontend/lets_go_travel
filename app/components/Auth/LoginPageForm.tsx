"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  Link
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPageForm() {
  const { login, loading, error } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      
      // El hook maneja la redirección automáticamente
      
    } catch (err) {
      console.log('Error en login:', err);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleGoToRegister = () => {
    router.push('/auth/register');
  };

  const handleForgotPassword = () => {
    // Aquí podrías redirigir a recuperación de contraseña después
    console.log('Ir a recuperar contraseña');
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200"
    >
      {/* Logo centrado arriba */}
      <Box className="text-center mb-4">
        <img 
          src="/images/logo.png" 
          alt="Let's Go Vacation" 
          width={180} 
          height={72}
          className="mx-auto"
        />
      </Box>

      {/* Título en gris oscuro */}
      <Box className="text-center mb-6">
        <Typography 
          variant="h4" 
          className="font-bold text-gray-800"
        >
          Iniciar Sesión
        </Typography>
      </Box>

      {/* Botón volver */}
      <Box className="flex items-center mb-2">
        <IconButton
          onClick={handleBackToHome}
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

      {/* Campos del formulario */}
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        required
        size="small"
        placeholder="tu@email.com"
        disabled={loading}
      />

      <TextField
        fullWidth
        label="Contraseña"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleInputChange}
        required
        size="small"
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleTogglePassword}
                edge="end"
                size="small"
                disabled={loading}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Olvidé mi contraseña */}
      <Box className="text-right mb-4">
        <Button 
          size="small" 
          className="text-blue-900 hover:text-blue-700 text-xs"
          onClick={handleForgotPassword}
          disabled={loading}
        >
          ¿Olvidaste tu contraseña?
        </Button>
      </Box>

      {/* Botón de login */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 disabled:bg-gray-400"
        size="large"
      >
        {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
      </Button>

      {/* Divisor */}
      <Box className="flex items-center my-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <Typography variant="body2" className="mx-4 text-gray-500">
          o
        </Typography>
        <div className="flex-1 border-t border-gray-300"></div>
      </Box>

      {/* Enlace a registro */}
      <Box className="text-center">
        <Typography variant="body2" className="text-gray-600 mb-2">
          ¿No tienes una cuenta?
        </Typography>
        <Button
          variant="outlined"
          fullWidth
          onClick={handleGoToRegister}
          disabled={loading}
          className="border-blue-900 text-blue-900 hover:bg-blue-50 disabled:border-gray-400 disabled:text-gray-400"
        >
          Crear Cuenta
        </Button>
      </Box>
    </Box>
  );
}