"use client";

import { Button } from "@mui/material";
import Image from "next/image";

interface Oferta {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
  estrellas?: number;
  tipo?: string;
  ubicacion?: string;
  puntuacion?: number;
  reseñas?: number;
  oferta?: string;
  proveedor?: string;
}

interface OfertaCardProps {
  oferta: Oferta;
}

export default function OfertaCard({ oferta }: OfertaCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Imagen de la oferta */}
        <div className="md:w-1/3 relative">
          <div className="w-full h-48 md:h-full bg-gray-200 relative">
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <span className="text-white text-lg text-center p-4 font-bold">
                {oferta.nombre}
              </span>
            </div>
            <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
              <span className="text-red-500 text-xl">❤️</span>
            </button>
            <span className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              1 / 10
            </span>
          </div>
        </div>

        {/* Información de la oferta */}
        <div className="md:w-2/3 p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">{oferta.nombre}</h3>
              
              {/* Estrellas y tipo */}
              <div className="flex items-center gap-3 mb-3">
                {oferta.estrellas && (
                  <div className="flex text-yellow-500">
                    {"★".repeat(oferta.estrellas)}
                    <span className="text-gray-400">{"★".repeat(5 - oferta.estrellas)}</span>
                  </div>
                )}
                {oferta.tipo && (
                  <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">{oferta.tipo}</span>
                )}
              </div>
              
              {/* Ubicación */}
              {oferta.ubicacion && (
                <div className="flex items-center gap-2 mb-2 text-gray-600">
                  <span>📍 {oferta.ubicacion}</span>
                </div>
              )}
              
              {/* Características */}
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  🏖️ Incluye actividades
                </span>
              </div>
            </div>

            {/* Puntuación */}
            {oferta.puntuacion && (
              <div className="text-right mb-4 md:mb-0">
                <div className="bg-green-600 text-white px-3 py-2 rounded-lg inline-block">
                  <span className="font-bold text-lg">{oferta.puntuacion}</span>
                </div>
                {oferta.reseñas && (
                  <div className="text-sm text-gray-600 mt-2">
                    <strong>Muy bueno</strong>
                    <div>({oferta.reseñas} puntuaciones)</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Oferta y precio */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 pt-4 border-t border-gray-200">
            <div>
              {oferta.proveedor && (
                <div className="text-sm text-gray-600 mb-1">{oferta.proveedor}</div>
              )}
              {oferta.oferta && (
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded inline-block">
                  {oferta.oferta}
                </div>
              )}
            </div>
            <div className="text-right mt-4 md:mt-0">
              <div className="text-3xl font-bold text-blue-900">${oferta.precio}</div>
              <div className="text-sm text-gray-600 mb-3">Precio por persona</div>
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