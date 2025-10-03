"use client";

import { Box, Button } from "@mui/material";
import CarroCard from "./CarroCard";

const carrosEjemplo = [
  { id: 1, nombre: "Carro 1", imagen: "/images/carro1.jpg", precio: 45 },
  { id: 2, nombre: "Carro 2", imagen: "/images/carro2.jpg", precio: 60 },
  { id: 3, nombre: "Carro 3", imagen: "/images/carro3.jpg", precio: 35 },
  { id: 4, nombre: "Carro 4", imagen: "/images/carro4.jpg", precio: 55 }
];

export default function CarrosSearchResults() {
  return (
    <>
      <Box className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
        <Box>
          <span className="text-lg text-blue-900">Encontramos <strong>{carrosEjemplo.length}</strong> carros</span>
        </Box>
        <Box className="flex gap-4">
          <Button variant="outlined" size="small">Filtrar</Button>
          <Button variant="outlined" size="small">Ordenar</Button>
        </Box>
      </Box>
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carrosEjemplo.map((carro) => (
          <CarroCard key={carro.id} carro={carro} />
        ))}
      </Box>
      <Box className="text-center mt-8">
        <Button variant="outlined" className="border-blue-900 text-blue-900 py-3 px-8 rounded-full">
          Cargar más carros
        </Button>
      </Box>
    </>
  );
}