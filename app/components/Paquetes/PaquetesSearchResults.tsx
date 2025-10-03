"use client";

import { Box, Button } from "@mui/material";
import PaqueteCard from "./PaqueteCard";

// Datos de ejemplo minimalistas
const paquetesEjemplo = [
  {
    id: 1,
    nombre: "Paquete 1",
    imagen: "/images/paquete1.jpg",
    precio: 799
  },
  {
    id: 2,
    nombre: "Paquete 2", 
    imagen: "/images/paquete2.jpg",
    precio: 599
  },
  {
    id: 3,
    nombre: "Paquete 3",
    imagen: "/images/paquete3.jpg",
    precio: 899
  },
  {
    id: 4,
    nombre: "Paquete 4",
    imagen: "/images/paquete4.jpg",
    precio: 699
  }
];

export default function PaquetesSearchResults() {
  return (
    <>
      {/* FILTROS SIMPLES */}
      <Box className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
        <Box>
          <span className="text-lg text-blue-900">
            Encontramos <strong>{paquetesEjemplo.length}</strong> paquetes
          </span>
        </Box>
        <Box className="flex gap-4">
          <Button variant="outlined" size="small">
            Filtrar
          </Button>
          <Button variant="outlined" size="small">
            Ordenar
          </Button>
        </Box>
      </Box>

      {/* LISTA DE PAQUETES */}
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paquetesEjemplo.map((paquete) => (
          <PaqueteCard key={paquete.id} paquete={paquete} />
        ))}
      </Box>

      {/* PAGINACIÓN */}
      <Box className="text-center mt-8">
        <Button 
          variant="outlined" 
          className="border-blue-900 text-blue-900 py-3 px-8 rounded-full"
        >
          Cargar más paquetes
        </Button>
      </Box>
    </>
  );
}