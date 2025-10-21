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

export default function RegisterPageForm() {
  const { register, loading, error } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (localError) setLocalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setLocalError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
      });
      
    } catch (err) {
      console.log('Error en registro:', err);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleGoToLogin = () => {
    router.push('/auth/login');
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
          Crea tu cuenta
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
      {(error || localError) && (
        <Alert severity="error" className="mb-4">
          {error || localError}
        </Alert>
      )}

      {/* Campos del formulario */}
      <Box className="grid grid-cols-2 gap-4">
        <TextField
          fullWidth
          label="Nombre"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          required
          size="small"
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Apellido"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          required
          size="small"
          disabled={loading}
        />
      </Box>

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
        label="Teléfono"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        size="small"
        placeholder="+1 (000) 000-0000"
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

      <TextField
        fullWidth
        label="Confirmar Contraseña"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        value={formData.confirmPassword}
        onChange={handleInputChange}
        required
        size="small"
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleToggleConfirmPassword}
                edge="end"
                size="small"
                disabled={loading}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Términos y condiciones */}
      <Box className="text-center">
        <Typography variant="body2" className="text-gray-600">
          Al crear una cuenta, aceptas nuestros{' '}
          <Link href="/terminos" className="text-blue-900 hover:underline">
            Términos y Condiciones
          </Link>{' '}
          y la{' '}
          <Link href="/privacidad" className="text-blue-900 hover:underline">
            Política de Privacidad
          </Link>
        </Typography>
      </Box>

      {/* Botón de registro */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 disabled:bg-gray-400"
        size="large"
      >
        {loading ? 'Creando Cuenta...' : 'Crear Cuenta'}
      </Button>

      {/* Enlace a login */}
      <Box className="text-center pt-4 border-t border-gray-200">
        <Typography variant="body2" className="text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link 
            component="button" 
            type="button"
            onClick={handleGoToLogin}
            className="text-blue-900 hover:underline font-semibold"
            disabled={loading}
          >
            Iniciar Sesión
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}