"use client";

import { Box, Button } from "@mui/material";
import AlquilerCard from "./AlquilerCard";

const alquileresEjemplo = [
  { id: 1, nombre: "Alquiler 1", imagen: "/images/alquiler1.jpg", precio: 80 },
  { id: 2, nombre: "Alquiler 2", imagen: "/images/alquiler2.jpg", precio: 120 },
  { id: 3, nombre: "Alquiler 3", imagen: "/images/alquiler3.jpg", precio: 95 },
  { id: 4, nombre: "Alquiler 4", imagen: "/images/alquiler4.jpg", precio: 150 }
];

export default function AlquilerSearchResults() {
  return (
    <>
      <Box className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
        <Box>
          <span className="text-lg text-blue-900">Encontramos <strong>{alquileresEjemplo.length}</strong> alquileres</span>
        </Box>
        <Box className="flex gap-4">
          <Button variant="outlined" size="small">Filtrar</Button>
          <Button variant="outlined" size="small">Ordenar</Button>
        </Box>
      </Box>
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alquileresEjemplo.map((alquiler) => (
          <AlquilerCard key={alquiler.id} alquiler={alquiler} />
        ))}
      </Box>
      <Box className="text-center mt-8">
        <Button variant="outlined" className="border-blue-900 text-blue-900 py-3 px-8 rounded-full">
          Cargar más alquileres
        </Button>
      </Box>
    </>
  );
}