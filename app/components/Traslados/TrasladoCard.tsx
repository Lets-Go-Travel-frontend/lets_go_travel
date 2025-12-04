"use client";

import { Button } from "@mui/material";

interface Traslado {
  id: number;
  tipo: string; // "Aeropuerto-Hotel", "Hotel-Aeropuerto", "Ciudad-Ciudad"
  desde: string;
  hacia: string;
  vehiculo: string;
  imagen: string;
  precio: number;
  capacidad: string;
  duracion: string;
  puntuacion?: number;
  reseñas?: number;
  incluido: string[];
  proveedor: string;
  tipoServicio: "Privado" | "Compartido";
}

interface TrasladoCardProps {
  traslado: Traslado;
}

export default function TrasladoCard({ traslado }: TrasladoCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Imagen y tipo de servicio */}
        <div className="md:w-1/3 relative">
          <div className="w-full h-48 md:h-full bg-gray-200 relative">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-white text-lg text-center p-4 font-bold">
                {traslado.vehiculo}
              </span>
            </div>
            <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
              <span className="text-red-500 text-xl">❤️</span>
            </button>
            <span className={`absolute top-3 left-3 text-white px-2 py-1 rounded text-sm font-bold ${
              traslado.tipoServicio === "Privado" ? "bg-purple-500" : "bg-green-500"
            }`}>
              {traslado.tipoServicio}
            </span>
          </div>
        </div>

        {/* Información del traslado */}
        <div className="md:w-2/3 p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">{traslado.vehiculo}</h3>
              
              {/* Ruta */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Desde</div>
                    <div className="font-bold text-blue-900">{traslado.desde}</div>
                  </div>
                  <div className="mx-4">
                    <span className="text-blue-500 text-xl">➡️</span>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Hacia</div>
                    <div className="font-bold text-blue-900">{traslado.hacia}</div>
                  </div>
                </div>
              </div>
              
              {/* Especificaciones */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <span>👥</span>
                  <span>{traslado.capacidad}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⏱️</span>
                  <span>{traslado.duracion}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🚗</span>
                  <span>{traslado.tipoServicio}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🏢</span>
                  <span>{traslado.proveedor}</span>
                </div>
              </div>
              
              {/* Servicios incluidos */}
              <div className="mb-3">
                <div className="text-sm text-gray-600 mb-1">Incluye:</div>
                <div className="flex flex-wrap gap-1">
                  {traslado.incluido.map((servicio, index) => (
                    <span 
                      key={index}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                    >
                      ✓ {servicio}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Puntuación */}
            {traslado.puntuacion && (
              <div className="text-right mb-4 md:mb-0">
                <div className="bg-green-600 text-white px-3 py-2 rounded-lg inline-block">
                  <span className="font-bold text-lg">{traslado.puntuacion}</span>
                </div>
                {traslado.reseñas && (
                  <div className="text-sm text-gray-600 mt-2">
                    <strong>Excelente</strong>
                    <div>({traslado.reseñas} reseñas)</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Precio y acción */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 pt-4 border-t border-gray-200">
            <div>
              <div className="text-sm text-gray-600 mb-1">{traslado.proveedor}</div>
              <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded inline-block">
                Cancelación gratuita
              </div>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <div className="text-3xl font-bold text-blue-900">${traslado.precio}</div>
              <div className="text-sm text-gray-600 mb-3">por traslado</div>
              <Button 
                variant="contained" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full"
              >
                Reservar traslado
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}