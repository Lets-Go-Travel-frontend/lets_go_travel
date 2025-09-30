"use client";

import { Button } from "@mui/material";
import Image from "next/image";

interface Hotel {
  id: number;
  nombre: string;
  imagen: string;
  estrellas: number;
  tipo: string;
  ubicacion: string;
  puntuacion: number;
  reseñas: number;
  precio: number;
  oferta: string;
  proveedor: string;
}

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      <div className="flex flex-col md:flex-row">
        {/* Imagen del hotel */}
        <div className="md:w-1/3 relative">
          <div className="w-full h-48 md:h-full bg-gray-200 relative">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-white text-lg">Imagen de {hotel.nombre}</span>
            </div>
            <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
              <span className="text-red-500 text-xl">❤️</span>
            </button>
            <span className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              1 / 36
            </span>
          </div>
        </div>

        {/* Información del hotel */}
        <div className="md:w-2/3 p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">{hotel.nombre}</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex text-yellow-500">
                  {"★".repeat(hotel.estrellas)}
                  <span className="text-gray-400">{"★".repeat(5 - hotel.estrellas)}</span>
                </div>
                <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">{hotel.tipo}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-2 text-gray-600">
                <span>📍 {hotel.ubicacion}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  🏖️ Suites con vistas al mar
                </span>
              </div>
            </div>

            {/* Puntuación */}
            <div className="text-right mb-4 md:mb-0">
              <div className="bg-green-600 text-white px-3 py-2 rounded-lg inline-block">
                <span className="font-bold text-lg">{hotel.puntuacion}</span>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                <strong>Muy bueno</strong>
                <div>({hotel.reseñas} puntuaciones)</div>
              </div>
            </div>
          </div>

          {/* Oferta principal */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 pt-4 border-t border-gray-200">
            <div>
              <div className="text-sm text-gray-600 mb-1">{hotel.proveedor}</div>
              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded inline-block">
                {hotel.oferta}
              </div>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <div className="text-3xl font-bold text-blue-900">€{hotel.precio}</div>
              <div className="text-sm text-gray-600 mb-3">25 noches por €{hotel.precio * 25}</div>
              <Button 
                variant="contained" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full"
              >
                Ver oferta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}