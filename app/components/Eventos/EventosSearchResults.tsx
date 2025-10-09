"use client";

import { Box, Button } from "@mui/material";
import EventoCard from "./EventoCard";
import { FiltrosPopover } from "../Filtros";
import { OrdenarPopover } from "../Ordenar";
import { useState, useRef } from "react";

const eventosEjemplo = [
  {
    id: 1,
    nombre: "Festival de Música Electrónica",
    imagen: "/images/evento1.jpg",
    precio: 75,
    tipo: "Festival",
    ubicacion: "Madrid Arena, Madrid",
    fecha: "15 Julio 2024",
    hora: "20:00 - 06:00",
    duracion: "10 horas",
    puntuacion: 4.8,
    reseñas: 456,
    organizador: "Music Events SL",
    categoria: "Música",
    asientos: "General",
    edadMinima: 18,
    incluye: ["Acceso general", "Barra libre opcional", "Zona VIP disponible"]
  },
  {
    id: 2,
    nombre: "Concierto de Jazz Intimo", 
    imagen: "/images/evento2.jpg",
    precio: 50,
    tipo: "Concierto",
    ubicacion: "Teatro Principal, Barcelona",
    fecha: "22 Junio 2024",
    hora: "21:00 - 23:30",
    duracion: "2.5 horas",
    puntuacion: 4.9,
    reseñas: 189,
    organizador: "Jazz Club Barcelona",
    categoria: "Música",
    asientos: "Numerados",
    edadMinima: 16,
    incluye: ["Concierto completo", "Programa especial", "Meet & greet"]
  },
  {
    id: 3,
    nombre: "Feria Gastronómica Internacional",
    imagen: "/images/evento3.jpg",
    precio: 100,
    tipo: "Feria Gastronómica",
    ubicacion: "Fira de Barcelona",
    fecha: "5-7 Agosto 2024",
    hora: "11:00 - 20:00",
    duracion: "3 días",
    puntuacion: 4.7,
    reseñas: 324,
    organizador: "Foodie Events",
    categoria: "Gastronomía",
    asientos: "Acceso libre",
    edadMinima: 12,
    incluye: ["Degustaciones ilimitadas", "Talleres culinarios", "Chefs internacionales"]
  },
  {
    id: 4,
    nombre: "Convención de Tecnología",
    imagen: "/images/evento4.jpg",
    precio: 65,
    tipo: "Convención",
    ubicacion: "IFEMA, Madrid",
    fecha: "12 Septiembre 2024",
    hora: "09:00 - 18:00",
    duracion: "9 horas",
    puntuacion: 4.6,
    reseñas: 278,
    organizador: "Tech Summit 2024",
    categoria: "Tecnología",
    asientos: "Acceso general + Workshops",
    edadMinima: 16,
    incluye: ["Acceso a conferencias", "Networking", "Goodie bag tecnológico"]
  }
];

export default function EventosSearchResults() {
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
            Encontramos <strong>{eventosEjemplo.length}</strong> eventos
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
        tipo="eventos"
      />

      <OrdenarPopover 
        open={ordenarOpen}
        anchorEl={ordenarButtonRef.current}
        onClose={handleCloseOrdenar}
        tipo="eventos"
      />

      {/* Layout vertical - una card debajo de otra */}
      <Box className="flex flex-col gap-6">
        {eventosEjemplo.map((evento) => (
          <EventoCard key={evento.id} evento={evento} />
        ))}
      </Box>

      <Box className="text-center mt-8">
        <Button 
          variant="outlined" 
          className="border-blue-900 text-blue-900 py-3 px-8 rounded-full"
        >
          Cargar más eventos
        </Button>
      </Box>
    </>
  );
}