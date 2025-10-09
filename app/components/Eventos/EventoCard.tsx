"use client";

import { Button } from "@mui/material";

interface Evento {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
  tipo?: string;
  ubicacion?: string;
  fecha?: string;
  hora?: string;
  duracion?: string;
  puntuacion?: number;
  reseñas?: number;
  organizador?: string;
  categoria?: string;
  asientos?: string;
  edadMinima?: number;
  incluye?: string[];
}

interface EventoCardProps {
  evento: Evento;
}

export default function EventoCard({ evento }: EventoCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Imagen del evento */}
        <div className="md:w-1/3 relative">
          <div className="w-full h-48 md:h-full bg-gray-200 relative">
            <div className="w-full h-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
              <span className="text-white text-lg text-center p-4 font-bold">
                {evento.nombre}
              </span>
            </div>
            <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
              <span className="text-red-500 text-xl">❤️</span>
            </button>
            {evento.categoria && (
              <span className="absolute top-3 left-3 bg-purple-500 text-white px-2 py-1 rounded text-sm font-bold">
                {evento.categoria}
              </span>
            )}
          </div>
        </div>

        {/* Información del evento */}
        <div className="md:w-2/3 p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">{evento.nombre}</h3>
              
              {/* Tipo y ubicación */}
              <div className="flex items-center gap-3 mb-3">
                {evento.tipo && (
                  <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">{evento.tipo}</span>
                )}
                {evento.edadMinima && (
                  <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">👤 +{evento.edadMinima}</span>
                )}
              </div>
              
              {/* Fecha, hora y ubicación */}
              <div className="grid grid-cols-2 gap-4 mb-3 text-sm text-gray-600">
                {evento.fecha && (
                  <div>
                    <div className="font-semibold">Fecha</div>
                    <div>🗓️ {evento.fecha}</div>
                  </div>
                )}
                {evento.hora && (
                  <div>
                    <div className="font-semibold">Hora</div>
                    <div>⏰ {evento.hora}</div>
                  </div>
                )}
                {evento.ubicacion && (
                  <div className="col-span-2">
                    <div className="font-semibold">Ubicación</div>
                    <div>📍 {evento.ubicacion}</div>
                  </div>
                )}
                {evento.duracion && (
                  <div>
                    <div className="font-semibold">Duración</div>
                    <div>⏱️ {evento.duracion}</div>
                  </div>
                )}
                {evento.asientos && (
                  <div>
                    <div className="font-semibold">Asientos</div>
                    <div>💺 {evento.asientos}</div>
                  </div>
                )}
              </div>
              
              {/* Incluye */}
              {evento.incluye && evento.incluye.length > 0 && (
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {evento.incluye.slice(0, 2).map((item, index) => (
                    <span key={index} className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-sm">
                      {item}
                    </span>
                  ))}
                  {evento.incluye.length > 2 && (
                    <span className="text-gray-500 text-sm">+{evento.incluye.length - 2} más</span>
                  )}
                </div>
              )}
            </div>

            {/* Puntuación */}
            {evento.puntuacion && (
              <div className="text-right mb-4 md:mb-0">
                <div className="bg-green-600 text-white px-3 py-2 rounded-lg inline-block">
                  <span className="font-bold text-lg">{evento.puntuacion}</span>
                </div>
                {evento.reseñas && (
                  <div className="text-sm text-gray-600 mt-2">
                    <strong>Popular</strong>
                    <div>({evento.reseñas} reseñas)</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Precio y acción */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 pt-4 border-t border-gray-200">
            <div>
              {evento.organizador && (
                <div className="text-sm text-gray-600 mb-1">Organizado por: {evento.organizador}</div>
              )}
              <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded inline-block">
                Entradas limitadas
              </div>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <div className="text-3xl font-bold text-blue-900">${evento.precio}</div>
              <div className="text-sm text-gray-600 mb-3">por persona</div>
              <Button 
                variant="contained" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full"
              >
                Comprar entradas
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}