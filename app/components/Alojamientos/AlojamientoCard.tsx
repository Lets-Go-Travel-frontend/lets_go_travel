"use client";

import { Button } from "@mui/material";

interface Alojamiento {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
  estrellas?: number;
  tipo?: string;
  ubicacion?: string;
  puntuacion?: number;
  reseñas?: number;
  servicios?: string[];
  desayuno?: boolean;
  cancelacion?: string;
  distancia?: string;
}

interface AlojamientoCardProps {
  alojamiento: Alojamiento;
}

export default function AlojamientoCard({ alojamiento }: AlojamientoCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Imagen del alojamiento */}
        <div className="md:w-1/3 relative">
          <div className="w-full h-48 md:h-full bg-gray-200 relative">
            <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-lg text-center p-4 font-bold">
                {alojamiento.nombre}
              </span>
            </div>
            <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
              <span className="text-red-500 text-xl">❤️</span>
            </button>
            {alojamiento.cancelacion && (
              <span className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
                {alojamiento.cancelacion}
              </span>
            )}
          </div>
        </div>

        {/* Información del alojamiento */}
        <div className="md:w-2/3 p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">{alojamiento.nombre}</h3>
              
              {/* Estrellas y tipo */}
              <div className="flex items-center gap-3 mb-3">
                {alojamiento.estrellas && (
                  <div className="flex text-yellow-500">
                    {"★".repeat(alojamiento.estrellas)}
                    <span className="text-gray-400">{"★".repeat(5 - alojamiento.estrellas)}</span>
                  </div>
                )}
                {alojamiento.tipo && (
                  <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">{alojamiento.tipo}</span>
                )}
              </div>
              
              {/* Ubicación y distancia */}
              <div className="flex items-center gap-4 mb-3 text-gray-600">
                {alojamiento.ubicacion && <span>📍 {alojamiento.ubicacion}</span>}
                {alojamiento.distancia && <span>🚗 {alojamiento.distancia}</span>}
              </div>
              
              {/* Servicios destacados */}
              {alojamiento.servicios && alojamiento.servicios.length > 0 && (
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {alojamiento.desayuno && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      🍳 Desayuno incluido
                    </span>
                  )}
                  {alojamiento.servicios.slice(0, 2).map((servicio, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {servicio}
                    </span>
                  ))}
                  {alojamiento.servicios.length > 2 && (
                    <span className="text-gray-500 text-sm">+{alojamiento.servicios.length - 2} más</span>
                  )}
                </div>
              )}
            </div>

            {/* Puntuación */}
            {alojamiento.puntuacion && (
              <div className="text-right mb-4 md:mb-0">
                <div className="bg-green-600 text-white px-3 py-2 rounded-lg inline-block">
                  <span className="font-bold text-lg">{alojamiento.puntuacion}</span>
                </div>
                {alojamiento.reseñas && (
                  <div className="text-sm text-gray-600 mt-2">
                    <strong>Excelente</strong>
                    <div>({alojamiento.reseñas} reseñas)</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Precio y acción */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 pt-4 border-t border-gray-200">
            <div>
              <div className="text-sm text-gray-600 mb-1">Mejor precio garantizado</div>
              {alojamiento.cancelacion && (
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded inline-block">
                  {alojamiento.cancelacion}
                </div>
              )}
            </div>
            <div className="text-right mt-4 md:mt-0">
              <div className="text-3xl font-bold text-blue-900">${alojamiento.precio}</div>
              <div className="text-sm text-gray-600 mb-3">por noche</div>
              <Button 
                variant="contained" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full"
              >
                Reservar ahora
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}