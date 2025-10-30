"use client";

import { Container, Box, Typography, Paper } from '@mui/material';
import AgencyRegistrationForm from '@/components/AgencyRegistration/AgencyRegistrationForm';
import { useRouter } from 'next/navigation';

export default function RegisterAgentPage() {
  const router = useRouter();

  const handleClose = () => {
    router.push('/');
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Paper elevation={0} className="p-8">
        {/* Header con logo */}
        <Box className="text-center mb-8">
          <img 
            src="/images/logo.png" 
            alt="Let's Go Vacation" 
            width={200} 
            height={80}
            className="mx-auto mb-4"
          />
          <Typography variant="h3" className="font-bold text-gray-800 mb-2">
            Registro de Agente de Viajes
          </Typography>
          <Typography variant="body1" className="text-gray-600 max-w-2xl mx-auto">
            Completa el formulario para registrarte como agente de viajes y acceder a todas 
            las herramientas profesionales de nuestra plataforma.
          </Typography>
        </Box>

        {/* Formulario */}
        <AgencyRegistrationForm onClose={handleClose} />
      </Paper>
    </Container>
  );
}