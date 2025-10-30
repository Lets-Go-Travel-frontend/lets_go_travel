// app/auth/forgot-password/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Container,
  Paper,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

type Step = 'email' | 'reset';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { 
    requestPasswordReset, 
    resetPassword, 
    loading, 
    error 
  } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const steps = ['Ingresa tu email', 'Código y nueva contraseña'];

  const validatePassword = (password: string): string => {
    if (!password) return 'La contraseña es requerida';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!passwordRegex.test(password)) 
      return 'La contraseña debe contener mayúscula, minúscula, número y símbolo';
    return '';
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'code':
        if (!value) return 'El código es requerido';
        if (value.length !== 6) return 'El código debe tener 6 dígitos';
        return '';
      case 'newPassword':
        return validatePassword(value);
      case 'confirmPassword':
        if (!value) return 'Confirma tu contraseña';
        if (value !== newPassword) return 'Las contraseñas no coinciden';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'email') setEmail(value);
    if (field === 'code') setCode(value.replace(/\D/g, '').slice(0, 6));
    if (field === 'newPassword') setNewPassword(value);
    if (field === 'confirmPassword') setConfirmPassword(value);
    
    const error = validateField(field, value);
    setFieldErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    try {
      await requestPasswordReset(email);
      setCurrentStep('reset');
      setSuccessMessage('Código enviado a tu email');
    } catch (err) {
      // El error se maneja en el hook
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    // Validar todos los campos
    const errors = {
      code: validateField('code', code),
      newPassword: validateField('newPassword', newPassword),
      confirmPassword: validateField('confirmPassword', confirmPassword),
    };

    setFieldErrors(errors);

    if (Object.values(errors).some(error => error !== '')) {
      return;
    }

    try {
      await resetPassword({
        email: email,
        code: code,
        new_password: newPassword,
      });
      
      setSuccessMessage('¡Contraseña actualizada correctamente!');
      
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      // Si hay error de código, volver al paso de email
      if (err instanceof Error && err.message.toLowerCase().includes('código')) {
        setCurrentStep('email');
      }
    }
  };

  const getActiveStep = () => {
    return currentStep === 'email' ? 0 : 1;
  };

  const PasswordRequirements = () => (
    <Box className="mt-2 p-3 bg-blue-50 rounded-lg">
      <Typography variant="caption" className="text-blue-800 font-semibold block mb-2">
        La contraseña debe contener:
      </Typography>
      <ul className="text-xs text-blue-700 space-y-1">
        <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
          ✓ Mínimo 8 caracteres
        </li>
        <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>
          ✓ Una letra minúscula
        </li>
        <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
          ✓ Una letra mayúscula
        </li>
        <li className={/\d/.test(newPassword) ? 'text-green-600' : ''}>
          ✓ Un número
        </li>
        <li className={/[@$!%*?&]/.test(newPassword) ? 'text-green-600' : ''}>
          ✓ Un símbolo (@$!%*?&)
        </li>
      </ul>
    </Box>
  );

  return (
    <Container maxWidth="sm" className="py-8">
      <Paper elevation={3} className="p-8 rounded-2xl">
        <Box className="text-center mb-8">
          <img 
            src="/images/logo.png" 
            alt="Let's Go Vacation" 
            width={200} 
            height={80}
            className="mx-auto mb-4"
          />
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Recuperar Contraseña
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Sigue los pasos para restablecer tu contraseña
          </Typography>
        </Box>

        <Stepper activeStep={getActiveStep()} alternativeLabel className="mb-8">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" className="mb-4">
            {successMessage}
          </Alert>
        )}

        {currentStep === 'email' && (
          <Box component="form" onSubmit={handleSendCode} className="space-y-6">
            <Typography variant="body1" className="text-gray-600 text-center">
              Ingresa tu email y te enviaremos un código de verificación
            </Typography>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="medium"
              disabled={loading}
              placeholder="tu@email.com"
            />

            <Box className="flex gap-4 pt-4">
              <Button
                onClick={() => router.push('/auth/login')}
                variant="outlined"
                fullWidth
                disabled={loading}
                className="border-gray-300 py-3"
                size="large"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !email}
                className="bg-orange-500 hover:bg-orange-600 py-3 text-lg"
                size="large"
              >
                {loading ? <CircularProgress size={24} /> : 'Enviar Código'}
              </Button>
            </Box>
          </Box>
        )}

        {currentStep === 'reset' && (
          <Box component="form" onSubmit={handleResetPassword} className="space-y-6">
            <Typography variant="body1" className="text-gray-600 text-center">
              Ingresa el código y tu nueva contraseña
              <br />
              <strong>{email}</strong>
            </Typography>

            <TextField
              fullWidth
              label="Código de verificación"
              value={code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              required
              size="medium"
              disabled={loading}
              placeholder="123456"
              inputProps={{ maxLength: 6 }}
              error={!!fieldErrors.code}
              helperText={fieldErrors.code}
            />

            <TextField
              fullWidth
              label="Nueva contraseña"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              required
              size="medium"
              disabled={loading}
              error={!!fieldErrors.newPassword}
              helperText={fieldErrors.newPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
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
              label="Confirmar contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
              size="medium"
              disabled={loading}
              error={!!fieldErrors.confirmPassword}
              helperText={fieldErrors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

            {newPassword && <PasswordRequirements />}

            <Box className="flex gap-4">
              <Button
                onClick={() => setCurrentStep('email')}
                variant="outlined"
                fullWidth
                disabled={loading}
                className="border-gray-300 py-3"
                size="large"
              >
                Atrás
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !code || !newPassword || !confirmPassword}
                className="bg-orange-500 hover:bg-orange-600 py-3"
                size="large"
              >
                {loading ? <CircularProgress size={24} /> : 'Cambiar Contraseña'}
              </Button>
            </Box>

            <Box className="text-center">
              <Button
                onClick={() => {
                  setSuccessMessage('');
                  requestPasswordReset(email);
                }}
                disabled={loading}
                className="text-blue-900 hover:text-blue-700"
              >
                Reenviar código
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}