"use client";

import { Popover, Box, Typography, Button, IconButton, FormControlLabel, Checkbox, Slider, Divider } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";

interface FiltrosPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  tipo: string; // 'ofertas', 'paquetes', 'destinos', etc.
}

export default function FiltrosPopover({ open, anchorEl, onClose, tipo }: FiltrosPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  
  // Estado para los filtros
  const [filtros, setFiltros] = useState({
    precio: [0, 1000],
    categorias: [] as string[],
    estrellas: [] as number[],
  });

  // Opciones de filtro según el tipo
  const opcionesFiltro = {
    ofertas: {
      categorias: ["Todo Incluido", "Desayuno Incluido", "Solo Alojamiento", "Con Vuelo"],
      rangoPrecio: [0, 2000]
    },
    paquetes: {
      categorias: ["Familiar", "Romántico", "Aventura", "Lujo", "Económico"],
      rangoPrecio: [0, 3000]
    },
    destinos: {
      categorias: ["Playa", "Montaña", "Ciudad", "Aventura", "Cultural"],
      rangoPrecio: [0, 1500]
    },
    alojamientos: {
      categorias: ["Hotel", "Resort", "Hostal", "Apartamento", "Villa"],
      rangoPrecio: [0, 1000]
    },
    default: {
      categorias: ["Popular", "Recomendado", "Oferta Especial"],
      rangoPrecio: [0, 1000]
    }
  };

  const opciones = opcionesFiltro[tipo as keyof typeof opcionesFiltro] || opcionesFiltro.default;

  const manejarCambioPrecio = (event: Event, newValue: number | number[]) => {
    setFiltros(prev => ({
      ...prev,
      precio: newValue as number[]
    }));
  };

  const manejarCambioCategoria = (categoria: string) => {
    setFiltros(prev => ({
      ...prev,
      categorias: prev.categorias.includes(categoria)
        ? prev.categorias.filter(c => c !== categoria)
        : [...prev.categorias, categoria]
    }));
  };

  const aplicarFiltros = () => {
    console.log('Filtros aplicados:', filtros);
    onClose();
  };

  const limpiarFiltros = () => {
    setFiltros({
      precio: [0, opciones.rangoPrecio[1]],
      categorias: [],
      estrellas: [],
    });
  };

  // Manejar clic fuera del popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !anchorEl?.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, anchorEl, onClose]);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      slotProps={{
        paper: {
          style: {
            width: '320px',
            maxHeight: '80vh',
          }
        }
      }}
    >
      <Box ref={popoverRef} className="p-4">
        {/* Header */}
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6" className="font-bold text-blue-900">
            Filtrar Resultados
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close fontSize="small" />
          </IconButton>
        </Box>

        {/* Rango de Precio */}
        <Box className="mb-6">
          <Typography variant="subtitle1" className="font-semibold text-blue-900 mb-3">
            Rango de Precio
          </Typography>
          <Slider
            value={filtros.precio}
            onChange={manejarCambioPrecio}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `$${value}`}
            min={0}
            max={opciones.rangoPrecio[1]}
            className="mb-2"
          />
          <Box className="flex justify-between text-sm text-gray-600">
            <span>${filtros.precio[0]}</span>
            <span>${filtros.precio[1]}</span>
          </Box>
        </Box>

        <Divider className="my-4" />

        {/* Categorías */}
        <Box className="mb-6">
          <Typography variant="subtitle1" className="font-semibold text-blue-900 mb-3">
            Categorías
          </Typography>
          <Box className="space-y-2">
            {opciones.categorias.map((categoria) => (
              <FormControlLabel
                key={categoria}
                control={
                  <Checkbox
                    checked={filtros.categorias.includes(categoria)}
                    onChange={() => manejarCambioCategoria(categoria)}
                    size="small"
                  />
                }
                label={categoria}
                className="w-full"
              />
            ))}
          </Box>
        </Box>

        <Divider className="my-4" />

        {/* Botones de acción */}
        <Box className="flex gap-3">
          <Button 
            variant="outlined" 
            fullWidth
            onClick={limpiarFiltros}
            className="border-gray-300 text-gray-600"
          >
            Limpiar
          </Button>
          <Button 
            variant="contained" 
            fullWidth
            onClick={aplicarFiltros}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Aplicar
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}