// app/components/RegisterForm.tsx
"use client";

import { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff, Close, ArrowBack } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

interface RegisterFormProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onClose, onSwitchToLogin }: RegisterFormProps) {
  const { register, loading, error } = useAuth();
  
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
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value) return 'El email es requerido';
        if (!emailRegex.test(value)) return 'Ingresa un email válido';
        return '';
      
      case 'password':
        if (!value) return 'La contraseña es requerida';
        if (value.length < 8) return 'Mínimo 8 caracteres';
        if (!passwordRegex.test(value)) 
          return 'Mayúscula, minúscula, número y símbolo';
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Confirma tu contraseña';
        if (value !== formData.password) return 'Las contraseñas no coinciden';
        return '';
      
      case 'firstName':
        if (!value) return 'El nombre es requerido';
        if (value.length < 2) return 'Mínimo 2 caracteres';
        return '';
      
      case 'lastName':
        if (!value) return 'El apellido es requerido';
        if (value.length < 2) return 'Mínimo 2 caracteres';
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
        // phone: formData.phone // Omitido temporalmente por bug en backend
      });
      
      // El hook se encarga del login automático y redirección a verificación
      // onClose() se llamará automáticamente
      
    } catch (err) {
      console.log('Error en el formulario de registro:', err);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Función para mostrar requisitos de contraseña
  const PasswordRequirements = () => (
    <Box className="mt-1 p-2 bg-blue-50 rounded-lg">
      <Typography variant="caption" className="text-blue-800 font-semibold block mb-1">
        La contraseña debe contener:
      </Typography>
      <Box className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-blue-700">
        <span className={formData.password.length >= 8 ? 'text-green-600' : ''}>
          ✓ 8+ caracteres
        </span>
        <span className={/[a-z]/.test(formData.password) ? 'text-green-600' : ''}>
          ✓ Minúscula
        </span>
        <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
          ✓ Mayúscula
        </span>
        <span className={/\d/.test(formData.password) ? 'text-green-600' : ''}>
          ✓ Número
        </span>
        <span className={/[@$!%*?&]/.test(formData.password) ? 'text-green-600' : ''}>
          ✓ Símbolo
        </span>
      </Box>
    </Box>
  );

  return (
    <Box className="w-80 max-w-sm">
      {/* Header */}
      <Box className="flex justify-between items-center mb-6">
        <Box className="flex items-center gap-2">
          <IconButton
            onClick={onSwitchToLogin}
            size="small"
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <ArrowBack fontSize="small" />
          </IconButton>
          <Typography variant="h6" className="text-blue-900 font-bold">
            Crear Cuenta
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          className="text-gray-500 hover:text-gray-700"
          disabled={loading}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit}>
        {/* Mostrar errores */}
        {(error || localError) && (
          <Alert severity="error" className="mb-4">
            {error || localError}
          </Alert>
        )}

        {/* Campos del formulario */}
        <Box className="grid grid-cols-2 gap-3 mb-4">
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
          className="mb-4"
          placeholder="tu@email.com"
          disabled={loading}
          error={!!fieldErrors.email}
          helperText={fieldErrors.email}
        />

        {/* Teléfono comentado temporalmente */}
        {/*
        <TextField
          fullWidth
          label="Teléfono (opcional)"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          size="small"
          className="mb-4"
          placeholder="+1234567890"
          disabled={loading}
        />
        */}

        <Box className="mb-3">
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
          className="mb-4"
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
        <Box className="text-center mb-4">
          <Typography variant="body2" className="text-gray-600">
            Al crear una cuenta, aceptas nuestros{' '}
            <Button variant="text" size="small" className="text-blue-900 p-0 min-w-0" disabled={loading}>
              Términos y Condiciones
            </Button>{' '}
            y la{' '}
            <Button variant="text" size="small" className="text-blue-900 p-0 min-w-0" disabled={loading}>
              Política de Privacidad
            </Button>
          </Typography>
        </Box>

        {/* Botón de registro */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 mb-4 disabled:bg-gray-400"
        >
          {loading ? 'Creando Cuenta...' : 'Crear Cuenta'}
        </Button>

        {/* Divisor */}
        <Box className="flex items-center mb-4">
          <Divider className="flex-1" />
          <Typography variant="body2" className="mx-2 text-gray-500">
            o
          </Typography>
          <Divider className="flex-1" />
        </Box>

        {/* Volver a login */}
        <Box className="text-center">
          <Typography variant="body2" className="text-gray-600 mb-2">
            ¿Ya tienes una cuenta?
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            onClick={onSwitchToLogin}
            disabled={loading}
            className="border-blue-900 text-blue-900 hover:bg-blue-50 disabled:border-gray-400 disabled:text-gray-400"
          >
            Iniciar Sesión
          </Button>
        </Box>

        {/* Información sobre verificación */}
        <Box className="text-center mt-4 pt-4 border-t border-gray-200">
          <Typography variant="body2" className="text-gray-600">
            Después del registro, serás redirigido al login para iniciar sesión y luego verificar tu cuenta.
          </Typography>
        </Box>
      </form>
    </Box>
  );
}