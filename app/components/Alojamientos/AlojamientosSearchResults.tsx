"use client";

import { Box, Button } from "@mui/material";
import AlojamientoCard from "./AlojamientoCard";
import { FiltrosPopover } from "../Filtros";
import { OrdenarPopover } from "../Ordenar";
import { useState, useRef } from "react";

const alojamientosEjemplo = [
  {
    id: 1,
    nombre: "Hotel Paradise Beach Resort",
    imagen: "/images/alojamiento1.jpg",
    precio: 120,
    estrellas: 5,
    tipo: "Resort Todo Incluido",
    ubicacion: "Cancún, México",
    puntuacion: 4.8,
    reseñas: 1247,
    servicios: ["Piscina infinita", "Spa", "Gimnasio", "Restaurante gourmet"],
    desayuno: true,
    cancelacion: "Cancelación gratuita",
    distancia: "A 5 min de la playa"
  },
  {
    id: 2,
    nombre: "Boutique Hotel Downtown", 
    imagen: "/images/alojamiento2.jpg",
    precio: 150,
    estrellas: 4,
    tipo: "Hotel Boutique",
    ubicacion: "Barcelona, España",
    puntuacion: 4.6,
    reseñas: 892,
    servicios: ["WiFi gratis", "Terraza", "Bar", "Recepcion 24h"],
    desayuno: true,
    cancelacion: "Flexible",
    distancia: "Centro histórico"
  },
  {
    id: 3,
    nombre: "Mountain Lodge & Spa",
    imagen: "/images/alojamiento3.jpg",
    precio: 200,
    estrellas: 5,
    tipo: "Lodge de Montaña",
    ubicacion: "Alpes Suizos",
    puntuacion: 4.9,
    reseñas: 567,
    servicios: ["Spa completo", "Chimenea", "Restaurante alpino", "Actividades guiadas"],
    desayuno: true,
    cancelacion: "Cancelación gratuita",
    distancia: "Vistas a la montaña"
  },
  {
    id: 4,
    nombre: "City Business Hotel",
    imagen: "/images/alojamiento4.jpg",
    precio: 180,
    estrellas: 4,
    tipo: "Hotel Ejecutivo",
    ubicacion: "Nueva York, USA",
    puntuacion: 4.5,
    reseñas: 1345,
    servicios: ["Centro de negocios", "Room service", "Valet parking", "Lavandería"],
    desayuno: false,
    cancelacion: "Estándar",
    distancia: "A 2 cuadras de Times Square"
  }
];

export default function AlojamientosSearchResults() {
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
            Encontramos <strong>{alojamientosEjemplo.length}</strong> alojamientos
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
        tipo="alojamientos"
      />

      <OrdenarPopover 
        open={ordenarOpen}
        anchorEl={ordenarButtonRef.current}
        onClose={handleCloseOrdenar}
        tipo="alojamientos"
      />

      {/* Layout vertical - una card debajo de otra */}
      <Box className="flex flex-col gap-6">
        {alojamientosEjemplo.map((alojamiento) => (
          <AlojamientoCard key={alojamiento.id} alojamiento={alojamiento} />
        ))}
      </Box>

      <Box className="text-center mt-8">
        <Button 
          variant="outlined" 
          className="border-blue-900 text-blue-900 py-3 px-8 rounded-full"
        >
          Cargar más alojamientos
        </Button>
      </Box>
    </>
  );
}