"use client";

import { Button } from "@mui/material";

interface SearchFiltersProps {
  totalHoteles: number;
  totalSitios: number;
}

export default function SearchFilters({ totalHoteles, totalSitios }: SearchFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <span className="text-lg text-blue-900">
          Encontramos <strong>{totalHoteles}</strong> hoteles de <strong>{totalSitios}</strong> sitios web
        </span>
      </div>
      <div className="flex gap-4">
        <Button 
          variant="outlined" 
          size="small" 
          className="border-orange-500 text-orange-500 hover:bg-orange-50"
        >
          Ordenar
        </Button>
        <Button 
          variant="outlined" 
          size="small"
          className="border-orange-500 text-orange-500 hover:bg-orange-50"
        >
          Filtrar
        </Button>
      </div>
    </div>
  );
}