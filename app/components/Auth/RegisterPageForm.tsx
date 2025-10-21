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
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  // Expresiones regulares para validación
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value) return 'El email es requerido';
        if (!emailRegex.test(value)) return 'Ingresa un email válido';
        return '';
      
      case 'password':
        if (!value) return 'La contraseña es requerida';
        if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        if (!passwordRegex.test(value)) 
          return 'La contraseña debe contener mayúscula, minúscula, número y símbolo';
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Confirma tu contraseña';
        if (value !== formData.password) return 'Las contraseñas no coinciden';
        return '';
      
      case 'firstName':
        if (!value) return 'El nombre es requerido';
        if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return '';
      
      case 'lastName':
        if (!value) return 'El apellido es requerido';
        if (value.length < 2) return 'El apellido debe tener al menos 2 caracteres';
        return '';
      
      case 'phone':
        if (value && !phoneRegex.test(value)) 
          return 'Formato de teléfono inválido. Ejemplo: +1234567890';
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validación en tiempo real
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    if (localError) setLocalError('');
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    // Validar todos los campos requeridos
    errors.firstName = validateField('firstName', formData.firstName);
    errors.lastName = validateField('lastName', formData.lastName);
    errors.email = validateField('email', formData.email);
    errors.password = validateField('password', formData.password);
    errors.confirmPassword = validateField('confirmPassword', formData.confirmPassword);
    errors.phone = validateField('phone', formData.phone);
    
    setFieldErrors(errors);
    
    // Verificar si hay algún error
    return !Object.values(errors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Validar todo el formulario
    if (!validateForm()) {
      setLocalError('Por favor corrige los errores en el formulario');
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

  // Función para mostrar requisitos de contraseña
  const PasswordRequirements = () => (
    <Box className="mt-2 p-3 bg-blue-50 rounded-lg">
      <Typography variant="caption" className="text-blue-800 font-semibold block mb-2">
        La contraseña debe contener:
      </Typography>
      <ul className="text-xs text-blue-700 space-y-1">
        <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
          ✓ Mínimo 8 caracteres
        </li>
        <li className={/[a-z]/.test(formData.password) ? 'text-green-600' : ''}>
          ✓ Una letra minúscula
        </li>
        <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
          ✓ Una letra mayúscula
        </li>
        <li className={/\d/.test(formData.password) ? 'text-green-600' : ''}>
          ✓ Un número
        </li>
        <li className={/[@$!%*?&]/.test(formData.password) ? 'text-green-600' : ''}>
          ✓ Un símbolo (@$!%*?&)
        </li>
      </ul>
    </Box>
  );

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200 max-w-md mx-auto"
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

      {/* Mostrar errores generales */}
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
          error={!!fieldErrors.firstName}
          helperText={fieldErrors.firstName}
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
          error={!!fieldErrors.lastName}
          helperText={fieldErrors.lastName}
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
        error={!!fieldErrors.email}
        helperText={fieldErrors.email}
      />

      <TextField
        fullWidth
        label="Teléfono"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        size="small"
        placeholder="+1234567890"
        disabled={loading}
        error={!!fieldErrors.phone}
        helperText={fieldErrors.phone || "Ejemplo: +1234567890"}
      />

      <Box>
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
          error={!!fieldErrors.password}
          helperText={fieldErrors.password}
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
        {formData.password && <PasswordRequirements />}
      </Box>

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
        error={!!fieldErrors.confirmPassword}
        helperText={fieldErrors.confirmPassword}
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