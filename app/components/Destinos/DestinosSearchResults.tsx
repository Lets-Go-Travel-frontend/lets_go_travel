"use client";

import { Box, Button } from "@mui/material";
import DestinoCard from "./DestinoCard";

// Datos de ejemplo minimalistas
const destinosEjemplo = [
  {
    id: 1,
    nombre: "Destino 1",
    imagen: "/images/destino1.jpg",
    precio: 499
  },
  {
    id: 2,
    nombre: "Destino 2", 
    imagen: "/images/destino2.jpg",
    precio: 599
  },
  {
    id: 3,
    nombre: "Destino 3",
    imagen: "/images/destino3.jpg",
    precio: 699
  },
  {
    id: 4,
    nombre: "Destino 4",
    imagen: "/images/destino4.jpg",
    precio: 799
  }
];

export default function DestinosSearchResults() {
  return (
    <>
      {/* FILTROS SIMPLES */}
      <Box className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
        <Box>
          <span className="text-lg text-blue-900">
            Encontramos <strong>{destinosEjemplo.length}</strong> destinos
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

      {/* LISTA DE DESTINOS */}
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinosEjemplo.map((destino) => (
          <DestinoCard key={destino.id} destino={destino} />
        ))}
      </Box>

      {/* PAGINACIÓN */}
      <Box className="text-center mt-8">
        <Button 
          variant="outlined" 
          className="border-blue-900 text-blue-900 py-3 px-8 rounded-full"
        >
          Cargar más destinos
        </Button>
      </Box>
    </>
  );
}