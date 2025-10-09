"use client";

import { Box, Button } from "@mui/material";
import DestinoCard from "./DestinoCard";
import { FiltrosPopover } from "../Filtros";
import { OrdenarPopover } from "../Ordenar";
import { useState, useRef } from "react";

const destinosEjemplo = [
  {
    id: 1,
    nombre: "París, Francia",
    imagen: "/images/destino1.jpg",
    precio: 499,
    pais: "Francia",
    continente: "Europa",
    puntuacion: 4.9,
    reseñas: 1256,
    temporada: "Primavera",
    clima: "Templado",
    actividades: ["Torre Eiffel", "Museo del Louvre", "Catedral de Notre-Dame", "Crucero por el Sena"],
    descuento: "25% OFF"
  },
  {
    id: 2,
    nombre: "Tokio, Japón", 
    imagen: "/images/destino2.jpg",
    precio: 599,
    pais: "Japón",
    continente: "Asia",
    puntuacion: 4.8,
    reseñas: 892,
    temporada: "Otoño",
    clima: "Templado",
    actividades: ["Monte Fuji", "Shibuya Crossing", "Templos antiguos", "Gastronomía local"]
  },
  {
    id: 3,
    nombre: "Cancún, México",
    imagen: "/images/destino3.jpg",
    precio: 699,
    pais: "México",
    continente: "América",
    puntuacion: 4.7,
    reseñas: 1567,
    temporada: "Todo el año",
    clima: "Tropical",
    actividades: ["Playas cristalinas", "Chichén Itzá", "Snorkeling", "Parques acuáticos"],
    descuento: "15% OFF"
  },
  {
    id: 4,
    nombre: "Santorini, Grecia",
    imagen: "/images/destino4.jpg",
    precio: 799,
    pais: "Grecia",
    continente: "Europa",
    puntuacion: 4.9,
    reseñas: 978,
    temporada: "Verano",
    clima: "Mediterráneo",
    actividades: ["Puestas de sol", "Playas únicas", "Viñedos", "Arquitectura tradicional"]
  }
];

export default function DestinosSearchResults() {
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
            Encontramos <strong>{destinosEjemplo.length}</strong> destinos
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
        tipo="destinos"
      />

      <OrdenarPopover 
        open={ordenarOpen}
        anchorEl={ordenarButtonRef.current}
        onClose={handleCloseOrdenar}
        tipo="destinos"
      />

      {/* Layout vertical - una card debajo de otra */}
      <Box className="flex flex-col gap-6">
        {destinosEjemplo.map((destino) => (
          <DestinoCard key={destino.id} destino={destino} />
        ))}
      </Box>

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