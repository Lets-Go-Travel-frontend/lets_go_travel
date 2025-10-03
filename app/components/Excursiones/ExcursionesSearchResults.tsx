"use client";

import { Box, Button } from "@mui/material";
import ExcursionCard from "./ExcursionCard";

const excursionesEjemplo = [
  { id: 1, nombre: "Excursión 1", imagen: "/images/excursion1.jpg", precio: 99 },
  { id: 2, nombre: "Excursión 2", imagen: "/images/excursion2.jpg", precio: 129 },
  { id: 3, nombre: "Excursión 3", imagen: "/images/excursion3.jpg", precio: 79 },
  { id: 4, nombre: "Excursión 4", imagen: "/images/excursion4.jpg", precio: 149 }
];

export default function ExcursionesSearchResults() {
  return (
    <>
      <Box className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
        <Box>
          <span className="text-lg text-blue-900">
            Encontramos <strong>{excursionesEjemplo.length}</strong> excursiones
          </span>
        </Box>
        <Box className="flex gap-4">
          <Button variant="outlined" size="small">Filtrar</Button>
          <Button variant="outlined" size="small">Ordenar</Button>
        </Box>
      </Box>
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {excursionesEjemplo.map((excursion) => (
          <ExcursionCard key={excursion.id} excursion={excursion} />
        ))}
      </Box>
      <Box className="text-center mt-8">
        <Button variant="outlined" className="border-blue-900 text-blue-900 py-3 px-8 rounded-full">
          Cargar más excursiones
        </Button>
      </Box>
    </>
  );
}