"use client";

import { Box, Button } from "@mui/material";
import EventoCard from "./EventoCard";

const eventosEjemplo = [
  { id: 1, nombre: "Evento 1", imagen: "/images/evento1.jpg", precio: 75 },
  { id: 2, nombre: "Evento 2", imagen: "/images/evento2.jpg", precio: 50 },
  { id: 3, nombre: "Evento 3", imagen: "/images/evento3.jpg", precio: 100 },
  { id: 4, nombre: "Evento 4", imagen: "/images/evento4.jpg", precio: 65 }
];

export default function EventosSearchResults() {
  return (
    <>
      <Box className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
        <Box>
          <span className="text-lg text-blue-900">Encontramos <strong>{eventosEjemplo.length}</strong> eventos</span>
        </Box>
        <Box className="flex gap-4">
          <Button variant="outlined" size="small">Filtrar</Button>
          <Button variant="outlined" size="small">Ordenar</Button>
        </Box>
      </Box>
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventosEjemplo.map((evento) => (
          <EventoCard key={evento.id} evento={evento} />
        ))}
      </Box>
      <Box className="text-center mt-8">
        <Button variant="outlined" className="border-blue-900 text-blue-900 py-3 px-8 rounded-full">
          Cargar más eventos
        </Button>
      </Box>
    </>
  );
}