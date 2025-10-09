"use client";

import { Button } from "@mui/material";

interface Excursion {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
  duracion?: string;
  ubicacion?: string;
  dificultad?: string;
  puntuacion?: number;
  reseñas?: number;
  incluye?: string[];
  guia?: string;
  tipo?: string;
  grupo?: string;
}

interface ExcursionCardProps {
  excursion: Excursion;
}

export default function ExcursionCard({ excursion }: ExcursionCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Imagen de la excursión */}
        <div className="md:w-1/3 relative">
          <div className="w-full h-48 md:h-full bg-gray-200 relative">
            <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <span className="text-white text-lg text-center p-4 font-bold">
                {excursion.nombre}
              </span>
            </div>
            <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
              <span className="text-red-500 text-xl">❤️</span>
            </button>
            {excursion.tipo && (
              <span className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded text-sm font-bold">
                {excursion.tipo}
              </span>
            )}
          </div>
        </div>

        {/* Información de la excursión */}
        <div className="md:w-2/3 p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">{excursion.nombre}</h3>
              
              {/* Duración y ubicación */}
              <div className="flex items-center gap-4 mb-3 text-gray-600">
                {excursion.duracion && <span>⏱️ {excursion.duracion}</span>}
                {excursion.ubicacion && <span>📍 {excursion.ubicacion}</span>}
              </div>
              
              {/* Dificultad y tipo de grupo */}
              <div className="flex items-center gap-4 mb-3 text-sm">
                {excursion.dificultad && (
                  <span className={`px-2 py-1 rounded ${
                    excursion.dificultad === 'Fácil' ? 'bg-green-100 text-green-800' :
                    excursion.dificultad === 'Moderada' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    🏃 {excursion.dificultad}
                  </span>
                )}
                {excursion.grupo && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    👥 {excursion.grupo}
                  </span>
                )}
              </div>
              
              {/* Guía e inclusiones */}
              <div className="flex flex-col gap-2 mb-3">
                {excursion.guia && (
                  <div className="text-sm text-gray-600">
                    <strong>Guía:</strong> {excursion.guia}
                  </div>
                )}
                {excursion.incluye && excursion.incluye.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {excursion.incluye.slice(0, 2).map((item, index) => (
                      <span key={index} className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-sm">
                        {item}
                      </span>
                    ))}
                    {excursion.incluye.length > 2 && (
                      <span className="text-gray-500 text-sm">+{excursion.incluye.length - 2} más</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Puntuación */}
            {excursion.puntuacion && (
              <div className="text-right mb-4 md:mb-0">
                <div className="bg-green-600 text-white px-3 py-2 rounded-lg inline-block">
                  <span className="font-bold text-lg">{excursion.puntuacion}</span>
                </div>
                {excursion.reseñas && (
                  <div className="text-sm text-gray-600 mt-2">
                    <strong>Excelente</strong>
                    <div>({excursion.reseñas} reseñas)</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Precio y acción */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 pt-4 border-t border-gray-200">
            <div>
              <div className="text-sm text-gray-600 mb-1">Excursión disponible</div>
              {excursion.tipo && (
                <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block">
                  {excursion.tipo}
                </div>
              )}
            </div>
            <div className="text-right mt-4 md:mt-0">
              <div className="text-3xl font-bold text-blue-900">${excursion.precio}</div>
              <div className="text-sm text-gray-600 mb-3">Por persona</div>
              <Button 
                variant="contained" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full"
              >
                Reservar excursión
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}