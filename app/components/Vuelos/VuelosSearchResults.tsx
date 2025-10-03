"use client";

import { Box, Button } from "@mui/material";
import VueloCard from "./VueloCard";

const vuelosEjemplo = [
  { id: 1, nombre: "Vuelo 1", imagen: "/images/vuelo1.jpg", precio: 250 },
  { id: 2, nombre: "Vuelo 2", imagen: "/images/vuelo2.jpg", precio: 180 },
  { id: 3, nombre: "Vuelo 3", imagen: "/images/vuelo3.jpg", precio: 320 },
  { id: 4, nombre: "Vuelo 4", imagen: "/images/vuelo4.jpg", precio: 195 }
];

export default function VuelosSearchResults() {
  return (
    <>
      <Box className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
        <Box>
          <span className="text-lg text-blue-900">Encontramos <strong>{vuelosEjemplo.length}</strong> vuelos</span>
        </Box>
        <Box className="flex gap-4">
          <Button variant="outlined" size="small">Filtrar</Button>
          <Button variant="outlined" size="small">Ordenar</Button>
        </Box>
      </Box>
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vuelosEjemplo.map((vuelo) => (
          <VueloCard key={vuelo.id} vuelo={vuelo} />
        ))}
      </Box>
      <Box className="text-center mt-8">
        <Button variant="outlined" className="border-blue-900 text-blue-900 py-3 px-8 rounded-full">
          Cargar más vuelos
        </Button>
      </Box>
    </>
  );
}