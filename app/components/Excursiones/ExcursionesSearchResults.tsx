"use client";

import { Box, Button } from "@mui/material";
import ExcursionCard from "./ExcursionCard";
import { FiltrosPopover } from "../Filtros";
import { OrdenarPopover } from "../Ordenar";
import { useState, useRef } from "react";

const excursionesEjemplo = [
  {
    id: 1,
    nombre: "Tour por las Ruinas Mayas",
    imagen: "/images/excursion1.jpg",
    precio: 99,
    duracion: "8 horas",
    ubicacion: "Chichén Itzá, México",
    dificultad: "Moderada",
    puntuacion: 4.8,
    reseñas: 234,
    incluye: ["Transporte ida y vuelta", "Guía certificado", "Entradas", "Almuerzo típico"],
    guia: "Guía bilingüe",
    tipo: "Cultural",
    grupo: "Grupo pequeño"
  },
  {
    id: 2,
    nombre: "Snorkeling en Arrecife", 
    imagen: "/images/excursion2.jpg",
    precio: 129,
    duracion: "6 horas",
    ubicacion: "Gran Barrera de Coral, Australia",
    dificultad: "Fácil",
    puntuacion: 4.9,
    reseñas: 189,
    incluye: ["Equipo de snorkel", "Guía marino", "Refrigerios", "Fotos submarinas"],
    guia: "Guía marino especializado",
    tipo: "Acuática",
    grupo: "Grupo mediano"
  },
  {
    id: 3,
    nombre: "Senderismo Montañoso",
    imagen: "/images/excursion3.jpg",
    precio: 79,
    duracion: "5 horas",
    ubicacion: "Alpes Suizos",
    dificultad: "Difícil",
    puntuacion: 4.7,
    reseñas: 156,
    incluye: ["Guía de montaña", "Equipo de seguridad", "Snacks energéticos", "Botella de agua"],
    guia: "Guía de montaña certificado",
    tipo: "Aventura",
    grupo: "Grupo pequeño"
  },
  {
    id: 4,
    nombre: "Tour Gastronómico Nocturno",
    imagen: "/images/excursion4.jpg",
    precio: 149,
    duracion: "4 horas",
    ubicacion: "Roma, Italia",
    dificultad: "Fácil",
    puntuacion: 4.9,
    reseñas: 278,
    incluye: ["Degustación 5 platos", "Vinos locales", "Guía gastronómico", "Recetario"],
    guia: "Chef local",
    tipo: "Gastronómica",
    grupo: "Grupo privado"
  }
];

export default function ExcursionesSearchResults() {
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
            Encontramos <strong>{excursionesEjemplo.length}</strong> excursiones
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
        tipo="excursiones"
      />

      <OrdenarPopover 
        open={ordenarOpen}
        anchorEl={ordenarButtonRef.current}
        onClose={handleCloseOrdenar}
        tipo="excursiones"
      />

      {/* Layout vertical - una card debajo de otra */}
      <Box className="flex flex-col gap-6">
        {excursionesEjemplo.map((excursion) => (
          <ExcursionCard key={excursion.id} excursion={excursion} />
        ))}
      </Box>

      <Box className="text-center mt-8">
        <Button 
          variant="outlined" 
          className="border-blue-900 text-blue-900 py-3 px-8 rounded-full"
        >
          Cargar más excursiones
        </Button>
      </Box>
    </>
  );
}