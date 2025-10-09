"use client";

import { Button } from "@mui/material";

interface Carro {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
  tipo?: string;
  marca?: string;
  transmision?: string;
  combustible?: string;
  capacidad?: string;
  puntuacion?: number;
  reseñas?: number;
  seguro?: boolean;
  kilometraje?: string;
  proveedor?: string;
}

interface CarroCardProps {
  carro: Carro;
}

export default function CarroCard({ carro }: CarroCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Imagen del carro */}
        <div className="md:w-1/3 relative">
          <div className="w-full h-48 md:h-full bg-gray-200 relative">
            <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
              <span className="text-white text-lg text-center p-4 font-bold">
                {carro.nombre}
              </span>
            </div>
            <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
              <span className="text-red-500 text-xl">❤️</span>
            </button>
            {carro.seguro && (
              <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
                Seguro incluido
              </span>
            )}
          </div>
        </div>

        {/* Información del carro */}
        <div className="md:w-2/3 p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">{carro.nombre}</h3>
              
              {/* Marca y tipo */}
              <div className="flex items-center gap-3 mb-3">
                {carro.marca && (
                  <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">{carro.marca}</span>
                )}
                {carro.tipo && (
                  <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">{carro.tipo}</span>
                )}
              </div>
              
              {/* Especificaciones técnicas */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
                {carro.transmision && (
                  <div className="flex items-center gap-1">
                    <span>⚙️</span>
                    <span>{carro.transmision}</span>
                  </div>
                )}
                {carro.combustible && (
                  <div className="flex items-center gap-1">
                    <span>⛽</span>
                    <span>{carro.combustible}</span>
                  </div>
                )}
                {carro.capacidad && (
                  <div className="flex items-center gap-1">
                    <span>👥</span>
                    <span>{carro.capacidad}</span>
                  </div>
                )}
                {carro.kilometraje && (
                  <div className="flex items-center gap-1">
                    <span>📊</span>
                    <span>{carro.kilometraje}</span>
                  </div>
                )}
              </div>
              
              {/* Características adicionales */}
              <div className="flex items-center gap-2 mb-3">
                {carro.seguro && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    🛡️ Seguro incluido
                  </span>
                )}
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  🗺️ GPS opcional
                </span>
              </div>
            </div>

            {/* Puntuación */}
            {carro.puntuacion && (
              <div className="text-right mb-4 md:mb-0">
                <div className="bg-green-600 text-white px-3 py-2 rounded-lg inline-block">
                  <span className="font-bold text-lg">{carro.puntuacion}</span>
                </div>
                {carro.reseñas && (
                  <div className="text-sm text-gray-600 mt-2">
                    <strong>Confiable</strong>
                    <div>({carro.reseñas} reseñas)</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Precio y acción */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 pt-4 border-t border-gray-200">
            <div>
              {carro.proveedor && (
                <div className="text-sm text-gray-600 mb-1">{carro.proveedor}</div>
              )}
              <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded inline-block">
                Mejor precio garantizado
              </div>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <div className="text-3xl font-bold text-blue-900">${carro.precio}</div>
              <div className="text-sm text-gray-600 mb-3">por día</div>
              <Button 
                variant="contained" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full"
              >
                Reservar carro
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}