"use client";

import { Button } from "@mui/material";

interface Alojamiento {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
}

interface AlojamientoCardProps {
  alojamiento: Alojamiento;
}

export default function AlojamientoCard({ alojamiento }: AlojamientoCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      <div className="flex flex-col md:flex-row">
        {/* Imagen */}
        <div className="md:w-1/3 relative">
          <div className="w-full h-48 md:h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
            <span className="text-white text-lg text-center p-4">{alojamiento.nombre}</span>
          </div>
        </div>

        {/* Información simplificada */}
        <div className="md:w-2/3 p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">{alojamiento.nombre}</h3>
              <div className="flex items-center gap-2 mb-3 text-gray-600">
                <span>🏨 Alojamiento</span>
              </div>
            </div>

            {/* Precio y botón */}
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-900">${alojamiento.precio}</div>
              <div className="text-sm text-gray-600 mb-3">por noche</div>
              <Button 
                variant="contained" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full"
              >
                Ver Alojamiento
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}