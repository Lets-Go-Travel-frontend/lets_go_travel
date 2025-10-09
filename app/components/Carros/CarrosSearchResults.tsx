"use client";

import { Box, Button } from "@mui/material";
import CarroCard from "./CarroCard";
import { FiltrosPopover } from "../Filtros";
import { OrdenarPopover } from "../Ordenar";
import { useState, useRef } from "react";

const carrosEjemplo = [
  {
    id: 1,
    nombre: "Toyota Corolla 2023",
    imagen: "/images/carro1.jpg",
    precio: 45,
    tipo: "Sedán",
    marca: "Toyota",
    transmision: "Automática",
    combustible: "Gasolina",
    capacidad: "5 pasajeros",
    puntuacion: 4.7,
    reseñas: 324,
    seguro: true,
    kilometraje: "Ilimitado",
    proveedor: "RentACar Premium"
  },
  {
    id: 2,
    nombre: "SUV Familiar Grande", 
    imagen: "/images/carro2.jpg",
    precio: 60,
    tipo: "SUV",
    marca: "Honda",
    transmision: "Automática",
    combustible: "Híbrido",
    capacidad: "7 pasajeros",
    puntuacion: 4.8,
    reseñas: 189,
    seguro: true,
    kilometraje: "Ilimitado",
    proveedor: "Family Rentals"
  },
  {
    id: 3,
    nombre: "Compacto Económico",
    imagen: "/images/carro3.jpg",
    precio: 35,
    tipo: "Compacto",
    marca: "Hyundai",
    transmision: "Manual",
    combustible: "Gasolina",
    capacidad: "4 pasajeros",
    puntuacion: 4.5,
    reseñas: 267,
    seguro: false,
    kilometraje: "200 km/día",
    proveedor: "EcoRent"
  },
  {
    id: 4,
    nombre: "BMW Serie 3 Luxury",
    imagen: "/images/carro4.jpg",
    precio: 85,
    tipo: "Lujo",
    marca: "BMW",
    transmision: "Automática",
    combustible: "Gasolina",
    capacidad: "5 pasajeros",
    puntuacion: 4.9,
    reseñas: 156,
    seguro: true,
    kilometraje: "Ilimitado",
    proveedor: "Luxury Car Rentals"
  }
];

export default function CarrosSearchResults() {
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
            Encontramos <strong>{carrosEjemplo.length}</strong> carros
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
        tipo="carros"
      />

      <OrdenarPopover 
        open={ordenarOpen}
        anchorEl={ordenarButtonRef.current}
        onClose={handleCloseOrdenar}
        tipo="carros"
      />

      {/* Layout vertical - una card debajo de otra */}
      <Box className="flex flex-col gap-6">
        {carrosEjemplo.map((carro) => (
          <CarroCard key={carro.id} carro={carro} />
        ))}
      </Box>

      <Box className="text-center mt-8">
        <Button 
          variant="outlined" 
          className="border-blue-900 text-blue-900 py-3 px-8 rounded-full"
        >
          Cargar más carros
        </Button>
      </Box>
    </>
  );
}