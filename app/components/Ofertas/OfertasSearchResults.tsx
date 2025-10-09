"use client";

import { Box, Button } from "@mui/material";
import OfertaCard from "./OfertaCard";
import { FiltrosPopover } from "../Filtros";
import { OrdenarPopover } from "../Ordenar";
import { useState, useRef } from "react";

const ofertasEjemplo = [
  {
    id: 1,
    nombre: "Oferta Especial #1",
    imagen: "/images/oferta1.jpg",
    precio: 299
  },
  {
    id: 2,
    nombre: "Oferta Especial #2", 
    imagen: "/images/oferta2.jpg",
    precio: 399
  },
  {
    id: 3,
    nombre: "Oferta Especial #3",
    imagen: "/images/oferta3.jpg",
    precio: 199
  },
  {
    id: 4,
    nombre: "Oferta Especial #4",
    imagen: "/images/oferta4.jpg",
    precio: 499
  }
];

export default function OfertasSearchResults() {
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
            Encontramos <strong>{ofertasEjemplo.length}</strong> ofertas
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
        tipo="ofertas"
      />

      <OrdenarPopover 
        open={ordenarOpen}
        anchorEl={ordenarButtonRef.current}
        onClose={handleCloseOrdenar}
        tipo="ofertas"
      />

      {/* Cambio principal: una columna vertical */}
      <Box className="flex flex-col gap-6">
        {ofertasEjemplo.map((oferta) => (
          <OfertaCard key={oferta.id} oferta={oferta} />
        ))}
      </Box>

      <Box className="text-center mt-8">
        <Button 
          variant="outlined" 
          className="border-blue-900 text-blue-900 py-3 px-8 rounded-full"
        >
          Cargar más ofertas
        </Button>
      </Box>
    </>
  );
}