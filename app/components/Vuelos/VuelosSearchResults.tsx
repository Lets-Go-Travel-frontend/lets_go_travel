"use client";

import { Box, Button } from "@mui/material";
import VueloCard from "./VueloCard";
import { FiltrosPopover } from "../Filtros";
import { OrdenarPopover } from "../Ordenar";
import { useState, useRef } from "react";

const vuelosEjemplo = [
  {
    id: 1,
    nombre: "Vuelo Madrid - Nueva York",
    imagen: "/images/vuelo1.jpg",
    precio: 250,
    aerolinea: "Iberia",
    origen: "Madrid (MAD)",
    destino: "Nueva York (JFK)",
    escala: "Directo",
    duracion: "8h 15m",
    fechaSalida: "15 Dic • 09:30",
    fechaLlegada: "15 Dic • 12:45",
    puntuacion: 4.6,
    reseñas: 892,
    clase: "Económica",
    maleta: "1 maleta 23kg",
    proveedor: "SkyTravel"
  },
  {
    id: 2,
    nombre: "Vuelo Barcelona - Roma", 
    imagen: "/images/vuelo2.jpg",
    precio: 180,
    aerolinea: "Vueling",
    origen: "Barcelona (BCN)",
    destino: "Roma (FCO)",
    escala: "Directo",
    duracion: "1h 45m",
    fechaSalida: "20 Dic • 14:20",
    fechaLlegada: "20 Dic • 16:05",
    puntuacion: 4.4,
    reseñas: 567,
    clase: "Económica",
    maleta: "Mochila 10kg",
    proveedor: "EuroFlights"
  },
  {
    id: 3,
    nombre: "Vuelo París - Tokio",
    imagen: "/images/vuelo3.jpg",
    precio: 320,
    aerolinea: "Air France",
    origen: "París (CDG)",
    destino: "Tokio (NRT)",
    escala: "1 escala",
    duracion: "13h 30m",
    fechaSalida: "10 Ene • 22:15",
    fechaLlegada: "11 Ene • 18:45",
    puntuacion: 4.8,
    reseñas: 1234,
    clase: "Premium",
    maleta: "2 maletas 23kg",
    proveedor: "Global Airlines"
  },
  {
    id: 4,
    nombre: "Vuelo Londres - Bangkok",
    imagen: "/images/vuelo4.jpg",
    precio: 195,
    aerolinea: "British Airways",
    origen: "Londres (LHR)",
    destino: "Bangkok (BKK)",
    escala: "Directo",
    duracion: "11h 45m",
    fechaSalida: "5 Ene • 13:40",
    fechaLlegada: "6 Ene • 07:25",
    puntuacion: 4.7,
    reseñas: 789,
    clase: "Económica",
    maleta: "1 maleta 20kg",
    proveedor: "Asia Connect"
  }
];

export default function VuelosSearchResults() {
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
            Encontramos <strong>{vuelosEjemplo.length}</strong> vuelos
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
        tipo="vuelos"
      />

      <OrdenarPopover 
        open={ordenarOpen}
        anchorEl={ordenarButtonRef.current}
        onClose={handleCloseOrdenar}
        tipo="vuelos"
      />

      {/* Layout vertical - una card debajo de otra */}
      <Box className="flex flex-col gap-6">
        {vuelosEjemplo.map((vuelo) => (
          <VueloCard key={vuelo.id} vuelo={vuelo} />
        ))}
      </Box>

      <Box className="text-center mt-8">
        <Button 
          variant="outlined" 
          className="border-blue-900 text-blue-900 py-3 px-8 rounded-full"
        >
          Cargar más vuelos
        </Button>
      </Box>
    </>
  );
}