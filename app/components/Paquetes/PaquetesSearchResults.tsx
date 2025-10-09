"use client";

import { Box, Button } from "@mui/material";
import PaqueteCard from "./PaqueteCard";
import { FiltrosPopover } from "../Filtros";
import { OrdenarPopover } from "../Ordenar";
import { useState, useRef } from "react";

const paquetesEjemplo = [
  {
    id: 1,
    nombre: "Paquete Todo Incluido Caribe",
    imagen: "/images/paquete1.jpg",
    precio: 799,
    estrellas: 5,
    tipo: "Todo Incluido",
    ubicacion: "Punta Cana, República Dominicana",
    puntuacion: 4.8,
    reseñas: 234,
    oferta: "Incluye Vuelos + Hotel",
    proveedor: "Caribbean Tours",
    duracion: "7 días / 6 noches",
    incluye: ["Vuelos ida y vuelta", "Hotel 5 estrellas", "Alimentación completa", "Bebidas", "Actividades"]
  },
  {
    id: 2,
    nombre: "Aventura Europea", 
    imagen: "/images/paquete2.jpg",
    precio: 599,
    estrellas: 4,
    tipo: "Cultural",
    ubicacion: "Paris, Roma, Barcelona",
    puntuacion: 4.6,
    reseñas: 189,
    oferta: "3 Ciudades Incluidas",
    proveedor: "EuroTravel",
    duracion: "10 días / 9 noches",
    incluye: ["Hoteles 4 estrellas", "Tours guiados", "Desayunos", "Transporte entre ciudades"]
  },
  {
    id: 3,
    nombre: "Luna de Miel en Maldivas",
    imagen: "/images/paquete3.jpg",
    precio: 899,
    estrellas: 5,
    tipo: "Luna de Miel",
    ubicacion: "Maldivas",
    puntuacion: 4.9,
    reseñas: 156,
    oferta: "Solo Adultos",
    proveedor: "Luxury Vacations",
    duracion: "8 días / 7 noches",
    incluye: ["Bungalow sobre el agua", "Cena romántica", "Masajes de bienvenida", "Snorkeling"]
  },
  {
    id: 4,
    nombre: "Tour Asiático Express",
    imagen: "/images/paquete4.jpg",
    precio: 699,
    estrellas: 4,
    tipo: "Aventura",
    ubicacion: "Tokio, Bangkok, Singapur",
    puntuacion: 4.5,
    reseñas: 278,
    oferta: "Precio Especial",
    proveedor: "Asia Adventures",
    duracion: "12 días / 11 noches",
    incluye: ["Vuelos internacionales", "Hoteles 4 estrellas", "Algunas comidas", "Tours culturales"]
  }
];

export default function PaquetesSearchResults() {
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
            Encontramos <strong>{paquetesEjemplo.length}</strong> paquetes
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
        tipo="paquetes"
      />

      <OrdenarPopover 
        open={ordenarOpen}
        anchorEl={ordenarButtonRef.current}
        onClose={handleCloseOrdenar}
        tipo="paquetes"
      />

      {/* Layout vertical - una card debajo de otra */}
      <Box className="flex flex-col gap-6">
        {paquetesEjemplo.map((paquete) => (
          <PaqueteCard key={paquete.id} paquete={paquete} />
        ))}
      </Box>

      <Box className="text-center mt-8">
        <Button 
          variant="outlined" 
          className="border-blue-900 text-blue-900 py-3 px-8 rounded-full"
        >
          Cargar más paquetes
        </Button>
      </Box>
    </>
  );
}