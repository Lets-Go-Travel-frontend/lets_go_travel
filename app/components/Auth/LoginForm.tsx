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
import { Visibility, VisibilityOff, Close } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToAgency: () => void;
}

export default function LoginForm({ onClose, onSwitchToRegister, onSwitchToAgency }: LoginFormProps) {
  const { login, loading, error } = useAuth();
  
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
      
      // Si el login es exitoso, el hook maneja la redirección
      onClose(); // Cerrar el popover
      
    } catch (err) {
      // El error ya está manejado por el hook
      console.log('Error en login:', err);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box className="w-80 max-w-sm">
      {/* Header */}
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h6" className="text-blue-900 font-bold">
          Iniciar Sesión
        </Typography>
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
          className="mb-4"
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
          className="mb-2"
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
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 mb-4 disabled:bg-gray-400"
        >
          {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
        </Button>

        {/* Divisor */}
        <Box className="flex items-center mb-4">
          <Divider className="flex-1" />
          <Typography variant="body2" className="mx-2 text-gray-500">
            o
          </Typography>
          <Divider className="flex-1" />
        </Box>

        {/* Registro */}
        <Box className="text-center">
          <Typography variant="body2" className="text-gray-600 mb-2">
            ¿No tienes una cuenta?
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            onClick={onSwitchToRegister}
            disabled={loading}
            className="border-blue-900 text-blue-900 hover:bg-blue-50 disabled:border-gray-400 disabled:text-gray-400"
          >
            Crear Cuenta
          </Button>
        </Box>

        {/* Agencias B2B */}
        <Box className="text-center mt-4 pt-4 border-t border-gray-200">
          <Typography variant="body2" className="text-gray-600 mb-2">
            ¿Eres una agencia de viajes?
          </Typography>
          <Button
            variant="text"
            size="small"
            className="text-blue-900 hover:text-blue-700"
            onClick={onSwitchToAgency}
            disabled={loading}
          >
            Registro para Agencias B2B
          </Button>
        </Box>
      </form>
    </Box>
  );
}