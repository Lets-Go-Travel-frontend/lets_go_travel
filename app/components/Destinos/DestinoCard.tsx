"use client";

import { Button } from "@mui/material";

interface Destino {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
  pais?: string;
  continente?: string;
  puntuacion?: number;
  reseñas?: number;
  temporada?: string;
  clima?: string;
  actividades?: string[];
  descuento?: string;
}

interface DestinoCardProps {
  destino: Destino;
}

export default function DestinoCard({ destino }: DestinoCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Imagen del destino */}
        <div className="md:w-1/3 relative">
          <div className="w-full h-48 md:h-full bg-gray-200 relative">
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <span className="text-white text-lg text-center p-4 font-bold">
                {destino.nombre}
              </span>
            </div>
            <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
              <span className="text-red-500 text-xl">❤️</span>
            </button>
            {destino.descuento && (
              <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                {destino.descuento}
              </span>
            )}
          </div>
        </div>

        {/* Información del destino */}
        <div className="md:w-2/3 p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">{destino.nombre}</h3>
              
              {/* Ubicación y continente */}
              <div className="flex items-center gap-4 mb-3 text-gray-600">
                {destino.pais && <span>📍 {destino.pais}</span>}
                {destino.continente && <span>🌍 {destino.continente}</span>}
              </div>
              
              {/* Temporada y clima */}
              <div className="flex items-center gap-4 mb-3 text-sm">
                {destino.temporada && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    🗓️ {destino.temporada}
                  </span>
                )}
                {destino.clima && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    ☀️ {destino.clima}
                  </span>
                )}
              </div>
              
              {/* Actividades populares */}
              {destino.actividades && destino.actividades.length > 0 && (
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {destino.actividades.slice(0, 3).map((actividad, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {actividad}
                    </span>
                  ))}
                  {destino.actividades.length > 3 && (
                    <span className="text-gray-500 text-sm">+{destino.actividades.length - 3} más</span>
                  )}
                </div>
              )}
            </div>

            {/* Puntuación */}
            {destino.puntuacion && (
              <div className="text-right mb-4 md:mb-0">
                <div className="bg-green-600 text-white px-3 py-2 rounded-lg inline-block">
                  <span className="font-bold text-lg">{destino.puntuacion}</span>
                </div>
                {destino.reseñas && (
                  <div className="text-sm text-gray-600 mt-2">
                    <strong>Recomendado</strong>
                    <div>({destino.reseñas} viajeros)</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Precio y acción */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 pt-4 border-t border-gray-200">
            <div>
              <div className="text-sm text-gray-600 mb-1">Destino popular</div>
              {destino.descuento && (
                <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded inline-block">
                  Oferta especial
                </div>
              )}
            </div>
            <div className="text-right mt-4 md:mt-0">
              <div className="text-3xl font-bold text-blue-900">${destino.precio}</div>
              <div className="text-sm text-gray-600 mb-3">Precio promedio</div>
              <Button 
                variant="contained" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full"
              >
                Explorar destino
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}