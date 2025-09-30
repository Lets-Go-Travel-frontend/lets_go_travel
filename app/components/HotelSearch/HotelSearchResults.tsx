"use client";

import { Button } from "@mui/material";
import HotelCard from "./HotelCard";
import SearchFilters from "./SearchFilters";

const hotelesEjemplo = [
  {
    id: 1,
    nombre: "Hotel Playa Vista Azul",
    imagen: "/images/hotel-ejemplo1.jpg",
    estrellas: 5,
    tipo: "Hotel",
    ubicacion: "Junto a la playa",
    puntuacion: 8.3,
    reseñas: 6878,
    precio: 98,
    oferta: "Todo incluido",
    proveedor: "Stayforlong"
  },
  {
    id: 2,
    nombre: "Gran Caribe Resort",
    imagen: "/images/hotel-ejemplo2.jpg", 
    estrellas: 4,
    tipo: "Resort",
    ubicacion: "Primera línea de playa",
    puntuacion: 7.8,
    reseñas: 4231,
    precio: 125,
    oferta: "Desayuno incluido",
    proveedor: "Traventia"
  },
  {
    id: 3,
    nombre: "Paradisus Varadero",
    imagen: "/images/hotel-ejemplo3.jpg",
    estrellas: 5,
    tipo: "Resort Todo Incluido",
    ubicacion: "Playa Varadero",
    puntuacion: 8.9,
    reseñas: 8923,
    precio: 156,
    oferta: "Todo incluido premium",
    proveedor: "Booking.com"
  }
];

export default function HotelSearchResults() {
  return (
    <>
      <SearchFilters totalHoteles={37} totalSitios={231} />

      <div className="space-y-6">
        {hotelesEjemplo.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>

      <div className="text-center mt-8">
        <Button 
          variant="outlined" 
          className="border-blue-900 text-blue-900 py-3 px-8 rounded-full"
        >
          Cargar más resultados
        </Button>
      </div>
    </>
  );
}