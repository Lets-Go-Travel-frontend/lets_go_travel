"use client";

import { Box, Button } from "@mui/material";
import TrasladoCard from "./TrasladoCard";
import { FiltrosPopover } from "../Filtros";
import { OrdenarPopover } from "../Ordenar";
import { useState, useRef } from "react";

const trasladosEjemplo = [
  {
    id: 1,
    tipo: "Aeropuerto-Hotel",
    desde: "Aeropuerto Internacional (MIA)",
    hacia: "Hotel South Beach",
    vehiculo: "SUV Ejecutivo",
    imagen: "/images/traslado1.jpg",
    precio: 65,
    capacidad: "4 pasajeros + equipaje",
    duracion: "30-45 min",
    puntuacion: 4.8,
    reseñas: 156,
    incluido: ["Conductor profesional", "WiFi gratis", "Agua mineral", "Asistencia 24/7"],
    proveedor: "Miami Traslados Premium",
    tipoServicio: "Privado" as const
  },
  {
    id: 2,
    tipo: "Hotel-Aeropuerto", 
    desde: "Hotel Downtown",
    hacia: "Aeropuerto Internacional (MIA)",
    vehiculo: "Van Familiar",
    imagen: "/images/traslado2.jpg",
    precio: 45,
    capacidad: "8 pasajeros + equipaje",
    duracion: "25-40 min",
    puntuacion: 4.6,
    reseñas: 89,
    incluido: ["Conductor profesional", "Seguro de viaje", "Sistema GPS"],
    proveedor: "Family Transfer Services",
    tipoServicio: "Compartido" as const
  },
  {
    id: 3,
    tipo: "Ciudad-Ciudad",
    desde: "Miami Downtown",
    hacia: "Fort Lauderdale",
    vehiculo: "Sedán de Lujo",
    imagen: "/images/traslado3.jpg",
    precio: 120,
    capacidad: "3 pasajeros + equipaje",
    duracion: "45-60 min",
    puntuacion: 4.9,
    reseñas: 203,
    incluido: ["Conductor profesional", "WiFi gratis", "Refrescos", "Periódicos"],
    proveedor: "Executive Car Service",
    tipoServicio: "Privado" as const
  },
  {
    id: 4,
    tipo: "Aeropuerto-Hotel",
    desde: "Aeropuerto FLL",
    hacia: "Orlando Disney Area",
    vehiculo: "Minibús Turístico",
    imagen: "/images/traslado4.jpg",
    precio: 180,
    capacidad: "15 pasajeros + equipaje",
    duracion: "3-4 horas",
    puntuacion: 4.7,
    reseñas: 134,
    incluido: ["Conductor bilingüe", "Aire acondicionado", "Paradas técnicas", "Asientos cómodos"],
    proveedor: "Florida Tour Transfers",
    tipoServicio: "Compartido" as const
  }
];

export default function TrasladosSearchResults() {
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
            Encontramos <strong>{trasladosEjemplo.length}</strong> opciones de traslado
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
        tipo="traslados"
      />

      <OrdenarPopover 
        open={ordenarOpen}
        anchorEl={ordenarButtonRef.current}
        onClose={handleCloseOrdenar}
        tipo="traslados"
      />

      {/* Layout vertical - una card debajo de otra */}
      <Box className="flex flex-col gap-6">
        {trasladosEjemplo.map((traslado) => (
          <TrasladoCard key={traslado.id} traslado={traslado} />
        ))}
      </Box>

      <Box className="text-center mt-8">
        <Button 
          variant="outlined" 
          className="border-blue-900 text-blue-900 py-3 px-8 rounded-full"
        >
          Cargar más opciones
        </Button>
      </Box>
    </>
  );
}