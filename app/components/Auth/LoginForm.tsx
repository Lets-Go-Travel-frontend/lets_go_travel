"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToAgency: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginForm({ 
  onClose, 
  onSwitchToRegister, 
  onSwitchToAgency,
  onLoginSuccess 
}: LoginFormProps) {
  const { login, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      await login({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      }, onLoginSuccess);
      
    } catch (error) {
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleForgotPassword = () => {
    onClose();
    router.push('/auth/forgot-password');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-4">
      <Typography variant="h5" className="text-blue-900 font-bold text-center">
        Iniciar Sesión
      </Typography>

      {error && (
        <Typography className="text-red-500 text-center text-sm">
          {error}
        </Typography>
      )}

      <TextField
        fullWidth
        name="email"
        label="Email"
        type="email"
        required
        variant="outlined"
        size="small"
      />

      <TextField
        fullWidth
        name="password"
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        required
        variant="outlined"
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box className="text-right -mt-2">
        <Link
          component="button"
          type="button"
          onClick={handleForgotPassword}
          className="text-blue-900 hover:underline text-xs"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 py-2"
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      <Box className="text-center space-y-2">
        <Link
          component="button"
          type="button"
          onClick={onSwitchToRegister}
          className="text-blue-900 hover:underline text-sm"
        >
          ¿No tienes cuenta? Regístrate
        </Link>
        
        <Box className="block">
          <Link
            component="button"
            type="button"
            onClick={onSwitchToAgency}
            className="text-blue-900 hover:underline text-sm"
          >
            ¿Eres una agencia? Acceso B2B
          </Link>
        </Box>
      </Box>
    </Box>
  );
}