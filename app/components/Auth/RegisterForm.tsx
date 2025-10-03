"use client";

import { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, Close, ArrowBack } from '@mui/icons-material';

interface RegisterFormProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onClose, onSwitchToLogin }: RegisterFormProps) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    console.log('Register data:', formData);
    // Register Logic
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box className="w-80 max-w-sm">
      {/* Header */}
      <Box className="flex justify-between items-center mb-6">
        <Box className="flex items-center gap-2">
          <IconButton
            onClick={onSwitchToLogin}
            size="small"
            className="text-gray-500 hover:text-gray-700"
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
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit}>
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
          />
          <TextField
            fullWidth
            label="Apellido"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            size="small"
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
        />

        <TextField
          fullWidth
          label="Teléfono"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          size="small"
          className="mb-4"
          placeholder="+1 (000) 000-0000"
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
          className="mb-3"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePassword}
                  edge="end"
                  size="small"
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
          className="mb-4"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleToggleConfirmPassword}
                  edge="end"
                  size="small"
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
            <Button variant="text" size="small" className="text-blue-900 p-0 min-w-0">
              Términos y Condiciones
            </Button>{' '}
            y la{' '}
            <Button variant="text" size="small" className="text-blue-900 p-0 min-w-0">
              Política de Privacidad
            </Button>
          </Typography>
        </Box>

        {/* Botón de registro */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 mb-4"
        >
          Crear Cuenta
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
            className="border-blue-900 text-blue-900 hover:bg-blue-50"
          >
            Iniciar Sesión
          </Button>
        </Box>
      </form>
    </Box>
  );
}