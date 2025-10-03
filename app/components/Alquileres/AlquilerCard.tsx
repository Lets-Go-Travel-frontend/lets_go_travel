"use client";

import { Card, Box, Typography, Button } from "@mui/material";

interface Alquiler {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
}

interface AlquilerCardProps {
  alquiler: Alquiler;
}

export default function AlquilerCard({ alquiler }: AlquilerCardProps) {
  return (
    <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
      <Box className="flex flex-col">
        <Box className="w-full h-48 relative">
          <Box className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <Typography className="text-white text-center font-bold text-lg p-4">
              {alquiler.nombre}
            </Typography>
          </Box>
        </Box>
        <Box className="p-4">
          <Typography variant="h6" className="font-bold text-blue-900 mb-2">
            {alquiler.nombre}
          </Typography>
          <Box className="flex justify-between items-center">
            <Typography variant="h5" className="font-bold text-blue-900">
              ${alquiler.precio}
            </Typography>
            <Button variant="contained" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full">
              Ver Alquiler
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}