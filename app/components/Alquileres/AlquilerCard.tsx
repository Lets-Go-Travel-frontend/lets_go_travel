"use client";

import { Button } from "@mui/material";

interface Alquiler {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
  tipo?: string;
  ubicacion?: string;
  habitaciones?: number;
  banos?: number;
  capacidad?: number;
  puntuacion?: number;
  reseñas?: number;
  servicios?: string[];
  minimoNoches?: number;
  propietario?: string;
  categoria?: string;
}

interface AlquilerCardProps {
  alquiler: Alquiler;
}

export default function AlquilerCard({ alquiler }: AlquilerCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Imagen del alquiler */}
        <div className="md:w-1/3 relative">
          <div className="w-full h-48 md:h-full bg-gray-200 relative">
            <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-white text-lg text-center p-4 font-bold">
                {alquiler.nombre}
              </span>
            </div>
            <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
              <span className="text-red-500 text-xl">❤️</span>
            </button>
            {alquiler.categoria && (
              <span className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded text-sm font-bold">
                {alquiler.categoria}
              </span>
            )}
          </div>
        </div>

        {/* Información del alquiler */}
        <div className="md:w-2/3 p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">{alquiler.nombre}</h3>
              
              {/* Tipo y ubicación */}
              <div className="flex items-center gap-3 mb-3">
                {alquiler.tipo && (
                  <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">{alquiler.tipo}</span>
                )}
                {alquiler.capacidad && (
                  <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">👥 {alquiler.capacidad}</span>
                )}
              </div>
              
              {/* Ubicación */}
              {alquiler.ubicacion && (
                <div className="flex items-center gap-2 mb-3 text-gray-600">
                  <span>📍 {alquiler.ubicacion}</span>
                </div>
              )}
              
              {/* Características de la propiedad */}
              <div className="grid grid-cols-3 gap-2 mb-3 text-sm text-gray-600">
                {alquiler.habitaciones && (
                  <div className="flex items-center gap-1">
                    <span>🛏️</span>
                    <span>{alquiler.habitaciones} hab.</span>
                  </div>
                )}
                {alquiler.banos && (
                  <div className="flex items-center gap-1">
                    <span>🚿</span>
                    <span>{alquiler.banos} baños</span>
                  </div>
                )}
                {alquiler.minimoNoches && (
                  <div className="flex items-center gap-1">
                    <span>🏠</span>
                    <span>Mín. {alquiler.minimoNoches} noches</span>
                  </div>
                )}
              </div>
              
              {/* Servicios destacados */}
              {alquiler.servicios && alquiler.servicios.length > 0 && (
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {alquiler.servicios.slice(0, 3).map((servicio, index) => (
                    <span key={index} className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm">
                      {servicio}
                    </span>
                  ))}
                  {alquiler.servicios.length > 3 && (
                    <span className="text-gray-500 text-sm">+{alquiler.servicios.length - 3} más</span>
                  )}
                </div>
              )}
            </div>

            {/* Puntuación */}
            {alquiler.puntuacion && (
              <div className="text-right mb-4 md:mb-0">
                <div className="bg-green-600 text-white px-3 py-2 rounded-lg inline-block">
                  <span className="font-bold text-lg">{alquiler.puntuacion}</span>
                </div>
                {alquiler.reseñas && (
                  <div className="text-sm text-gray-600 mt-2">
                    <strong>Excelente</strong>
                    <div>({alquiler.reseñas} reseñas)</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Precio y acción */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 pt-4 border-t border-gray-200">
            <div>
              {alquiler.propietario && (
                <div className="text-sm text-gray-600 mb-1">Anfitrión: {alquiler.propietario}</div>
              )}
              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded inline-block">
                Reserva instantánea
              </div>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <div className="text-3xl font-bold text-blue-900">${alquiler.precio}</div>
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