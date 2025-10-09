"use client";

import { Button } from "@mui/material";

interface Paquete {
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
  duracion?: string;
  incluye?: string[];
}

interface PaqueteCardProps {
  paquete: Paquete;
}

export default function PaqueteCard({ paquete }: PaqueteCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Imagen del paquete */}
        <div className="md:w-1/3 relative">
          <div className="w-full h-48 md:h-full bg-gray-200 relative">
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <span className="text-white text-lg text-center p-4 font-bold">
                {paquete.nombre}
              </span>
            </div>
            <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
              <span className="text-red-500 text-xl">❤️</span>
            </button>
            <span className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              1 / 8
            </span>
          </div>
        </div>

        {/* Información del paquete */}
        <div className="md:w-2/3 p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">{paquete.nombre}</h3>
              
              {/* Estrellas y tipo */}
              <div className="flex items-center gap-3 mb-3">
                {paquete.estrellas && (
                  <div className="flex text-yellow-500">
                    {"★".repeat(paquete.estrellas)}
                    <span className="text-gray-400">{"★".repeat(5 - paquete.estrellas)}</span>
                  </div>
                )}
                {paquete.tipo && (
                  <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">{paquete.tipo}</span>
                )}
              </div>
              
              {/* Ubicación y duración */}
              <div className="flex items-center gap-4 mb-2 text-gray-600">
                {paquete.ubicacion && <span>📍 {paquete.ubicacion}</span>}
                {paquete.duracion && <span>⏱️ {paquete.duracion}</span>}
              </div>
              
              {/* Incluye */}
              {paquete.incluye && paquete.incluye.length > 0 && (
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {paquete.incluye.slice(0, 2).map((item, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {item}
                    </span>
                  ))}
                  {paquete.incluye.length > 2 && (
                    <span className="text-gray-500 text-sm">+{paquete.incluye.length - 2} más</span>
                  )}
                </div>
              )}
            </div>

            {/* Puntuación */}
            {paquete.puntuacion && (
              <div className="text-right mb-4 md:mb-0">
                <div className="bg-green-600 text-white px-3 py-2 rounded-lg inline-block">
                  <span className="font-bold text-lg">{paquete.puntuacion}</span>
                </div>
                {paquete.reseñas && (
                  <div className="text-sm text-gray-600 mt-2">
                    <strong>Excelente</strong>
                    <div>({paquete.reseñas} reseñas)</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Oferta y precio */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 pt-4 border-t border-gray-200">
            <div>
              {paquete.proveedor && (
                <div className="text-sm text-gray-600 mb-1">{paquete.proveedor}</div>
              )}
              {paquete.oferta && (
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded inline-block">
                  {paquete.oferta}
                </div>
              )}
            </div>
            <div className="text-right mt-4 md:mt-0">
              <div className="text-3xl font-bold text-blue-900">${paquete.precio}</div>
              <div className="text-sm text-gray-600 mb-3">Todo incluido</div>
              <Button 
                variant="contained" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full"
              >
                Ver paquete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}