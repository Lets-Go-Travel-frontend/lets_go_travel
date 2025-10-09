"use client";

import { Button } from "@mui/material";

interface Vuelo {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
  aerolinea?: string;
  origen?: string;
  destino?: string;
  escala?: string;
  duracion?: string;
  fechaSalida?: string;
  fechaLlegada?: string;
  puntuacion?: number;
  reseñas?: number;
  clase?: string;
  maleta?: string;
  proveedor?: string;
}

interface VueloCardProps {
  vuelo: Vuelo;
}

export default function VueloCard({ vuelo }: VueloCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Imagen del vuelo */}
        <div className="md:w-1/3 relative">
          <div className="w-full h-48 md:h-full bg-gray-200 relative">
            <div className="w-full h-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
              <span className="text-white text-lg text-center p-4 font-bold">
                {vuelo.aerolinea || vuelo.nombre}
              </span>
            </div>
            <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
              <span className="text-red-500 text-xl">❤️</span>
            </button>
            {vuelo.clase && (
              <span className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded text-sm font-bold">
                {vuelo.clase}
              </span>
            )}
          </div>
        </div>

        {/* Información del vuelo */}
        <div className="md:w-2/3 p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                {vuelo.origen} → {vuelo.destino}
              </h3>
              
              {/* Aerolínea y detalles */}
              <div className="flex items-center gap-3 mb-3">
                {vuelo.aerolinea && (
                  <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">{vuelo.aerolinea}</span>
                )}
                {vuelo.escala && (
                  <span className="text-gray-600 bg-yellow-100 px-2 py-1 rounded">{vuelo.escala}</span>
                )}
              </div>
              
              {/* Horarios y duración */}
              <div className="grid grid-cols-2 gap-4 mb-3 text-sm text-gray-600">
                {vuelo.fechaSalida && (
                  <div>
                    <div className="font-semibold">Salida</div>
                    <div>{vuelo.fechaSalida}</div>
                  </div>
                )}
                {vuelo.fechaLlegada && (
                  <div>
                    <div className="font-semibold">Llegada</div>
                    <div>{vuelo.fechaLlegada}</div>
                  </div>
                )}
                {vuelo.duracion && (
                  <div className="col-span-2">
                    <div className="font-semibold">Duración</div>
                    <div>⏱️ {vuelo.duracion}</div>
                  </div>
                )}
              </div>
              
              {/* Servicios incluidos */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {vuelo.maleta && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    🧳 {vuelo.maleta}
                  </span>
                )}
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  🍱 Comida incluida
                </span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                  💺 Asiento estándar
                </span>
              </div>
            </div>

            {/* Puntuación */}
            {vuelo.puntuacion && (
              <div className="text-right mb-4 md:mb-0">
                <div className="bg-green-600 text-white px-3 py-2 rounded-lg inline-block">
                  <span className="font-bold text-lg">{vuelo.puntuacion}</span>
                </div>
                {vuelo.reseñas && (
                  <div className="text-sm text-gray-600 mt-2">
                    <strong>Puntual</strong>
                    <div>({vuelo.reseñas} reseñas)</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Precio y acción */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 pt-4 border-t border-gray-200">
            <div>
              {vuelo.proveedor && (
                <div className="text-sm text-gray-600 mb-1">{vuelo.proveedor}</div>
              )}
              <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded inline-block">
                Precio final
              </div>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <div className="text-3xl font-bold text-blue-900">${vuelo.precio}</div>
              <div className="text-sm text-gray-600 mb-3">por persona</div>
              <Button 
                variant="contained" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full"
              >
                Reservar vuelo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}