"use client";

import { Box, Button } from "@mui/material";
import AlquilerCard from "./AlquilerCard";
import { FiltrosPopover } from "../Filtros";
import { OrdenarPopover } from "../Ordenar";
import { useState, useRef } from "react";

const alquileresEjemplo = [
  {
    id: 1,
    nombre: "Villa con Piscina Privada",
    imagen: "/images/alquiler1.jpg",
    precio: 80,
    tipo: "Casa completa",
    ubicacion: "Málaga, España",
    habitaciones: 3,
    banos: 2,
    capacidad: 6,
    puntuacion: 4.9,
    reseñas: 156,
    servicios: ["Piscina privada", "WiFi", "Cocina completa", "Parking"],
    minimoNoches: 3,
    propietario: "María López",
    categoria: "SuperAnfitrión"
  },
  {
    id: 2,
    nombre: "Apartamento Céntrico", 
    imagen: "/images/alquiler2.jpg",
    precio: 120,
    tipo: "Apartamento",
    ubicacion: "Barcelona, España",
    habitaciones: 2,
    banos: 1,
    capacidad: 4,
    puntuacion: 4.7,
    reseñas: 89,
    servicios: ["Terraza", "Ascensor", "Lavadora", "Aire acondicionado"],
    minimoNoches: 2,
    propietario: "Carlos Martínez",
    categoria: "Premium"
  },
  {
    id: 3,
    nombre: "Cabaña en la Montaña",
    imagen: "/images/alquiler3.jpg",
    precio: 95,
    tipo: "Cabaña",
    ubicacion: "Pirineos, España",
    habitaciones: 1,
    banos: 1,
    capacidad: 2,
    puntuacion: 4.8,
    reseñas: 67,
    servicios: ["Chimenea", "Vistas montaña", "Jardín", "Barbacoa"],
    minimoNoches: 4,
    propietario: "Ana Rodríguez",
    categoria: "Experiencia única"
  },
  {
    id: 4,
    nombre: "Loft de Diseño Moderno",
    imagen: "/images/alquiler4.jpg",
    precio: 150,
    tipo: "Loft",
    ubicacion: "Madrid, España",
    habitaciones: 1,
    banos: 1,
    capacidad: 2,
    puntuacion: 4.9,
    reseñas: 234,
    servicios: ["Diseño moderno", "Smart TV", "Cocina equipada", "Gimnasio acceso"],
    minimoNoches: 2,
    propietario: "Design Stays",
    categoria: "Lujo"
  }
];

export default function AlquilerSearchResults() {
  const [filtrosOpen, setFiltrosOpen] = useState(false);
  const [ordenarOpen, setOrdenarOpen] = useState(false);
  const filtrosButtonRef = useRef<HTMLButtonElement>(null);
  const ordenarButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpenFiltros = () => {
    setFiltrosOpen(true);
  };

  const handleCloseFiltros = () => {
    setFiltrosOpen(false);
  };

  const handleOpenOrdenar = () => {
    setOrdenarOpen(true);
  };

  const handleCloseOrdenar = () => {
    setOrdenarOpen(false);
  };

  return (
    <>
      <Box className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
        <Box>
          <span className="text-lg text-blue-900">
            Encontramos <strong>{alquileresEjemplo.length}</strong> alquileres
          </span>
        </Box>
        <Box className="flex gap-4">
          <Button 
            variant="outlined" 
            size="small"
            ref={filtrosButtonRef}
            onClick={handleOpenFiltros}
            className="border-orange-500 text-orange-500 hover:bg-orange-50"
          >
            Filtrar
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            ref={ordenarButtonRef}
            onClick={handleOpenOrdenar}
            className="border-orange-500 text-orange-500 hover:bg-orange-50"
          >
            Ordenar
          </Button>
        </Box>
      </Box>

      <FiltrosPopover 
        open={filtrosOpen}
        anchorEl={filtrosButtonRef.current}
        onClose={handleCloseFiltros}
        tipo="alquileres"
      />

      <OrdenarPopover 
        open={ordenarOpen}
        anchorEl={ordenarButtonRef.current}
        onClose={handleCloseOrdenar}
        tipo="alquileres"
      />

      {/* Layout vertical - una card debajo de otra */}
      <Box className="flex flex-col gap-6">
        {alquileresEjemplo.map((alquiler) => (
          <AlquilerCard key={alquiler.id} alquiler={alquiler} />
        ))}
      </Box>

      <Box className="text-center mt-8">
        <Button 
          variant="outlined" 
          className="border-blue-900 text-blue-900 py-3 px-8 rounded-full"
        >
          Cargar más alquileres
        </Button>
      </Box>
    </>
  );
}