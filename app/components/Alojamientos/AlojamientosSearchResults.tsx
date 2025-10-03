"use client";

import { Button } from "@mui/material";
import AlojamientoCard from "./AlojamientoCard";

const alojamientosEjemplo = [
  {
    id: 1,
    nombre: "Alojamiento 1",
    imagen: "/images/alojamiento1.jpg",
    precio: 120
  },
  {
    id: 2,
    nombre: "Alojamiento 2", 
    imagen: "/images/alojamiento2.jpg",
    precio: 150
  },
  {
    id: 3,
    nombre: "Alojamiento 3",
    imagen: "/images/alojamiento3.jpg",
    precio: 200
  }
];

export default function AlojamientosSearchResults() {
  return (
    <>
      {/* Filtros simples */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
        <div>
          <span className="text-lg text-blue-900">
            Encontramos <strong>{alojamientosEjemplo.length}</strong> alojamientos
          </span>
        </div>
        <div className="flex gap-4">
          <Button variant="outlined" size="small">Filtrar</Button>
          <Button variant="outlined" size="small">Ordenar</Button>
        </div>
      </div>

      {/* Lista de alojamientos */}
      <div className="space-y-6">
        {alojamientosEjemplo.map((alojamiento) => (
          <AlojamientoCard key={alojamiento.id} alojamiento={alojamiento} />
        ))}
      </div>

      {/* Paginación */}
      <div className="text-center mt-8">
        <Button 
          variant="outlined" 
          className="border-blue-900 text-blue-900 py-3 px-8 rounded-full"
        >
          Cargar más alojamientos
        </Button>
      </div>
    </>
  );
}