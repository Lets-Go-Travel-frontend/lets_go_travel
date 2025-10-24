"use client";

import { Popover, Box, Typography, Button, IconButton, Divider, useMediaQuery } from "@mui/material";
import { Close, Add, Remove, Delete } from "@mui/icons-material";
import { useEffect, useRef } from "react";

interface CarritoItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  tipo: string;
}

interface CarritoPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

// Datos de ejemplo para el carrito
const itemsEjemplo: CarritoItem[] = [
  {
    id: 1,
    nombre: "Hotel Playa Vista Azul",
    precio: 98,
    cantidad: 1,
    tipo: "Alojamiento"
  },
  {
    id: 2,
    nombre: "Vuelo Miami - Cancún", 
    precio: 250,
    cantidad: 2,
    tipo: "Vuelo"
  },
  {
    id: 3,
    nombre: "Excursión a Chichén Itzá",
    precio: 75,
    cantidad: 1,
    tipo: "Excursión"
  }
];

export default function CarritoPopover({ open, anchorEl, onClose }: CarritoPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width:768px)');

  // Calcular total
  const total = itemsEjemplo.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

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
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      slotProps={{
        paper: {
          sx: {
            width: isMobile ? '95vw' : 400,
            maxWidth: '95vw',
            margin: isMobile ? 'auto' : 'inherit',
            position: 'fixed',
            top: isMobile ? '50%' : 'inherit',
            left: isMobile ? '50%' : 'inherit',
            transform: isMobile ? 'translate(-50%, -50%)' : 'inherit',
            maxHeight: isMobile ? '85vh' : 'none',
            overflow: 'auto',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }
        }
      }}
    >
      <Box ref={popoverRef} className="p-4">
        {/* Header */}
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6" className="font-bold text-blue-900 text-lg md:text-xl">
            Carrito de Compras
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close fontSize="small" />
          </IconButton>
        </Box>

        {/* Lista de items */}
        <Box sx={{ maxHeight: isMobile ? '45vh' : '300px', overflowY: 'auto' }}>
          {itemsEjemplo.map((item) => (
            <Box key={item.id} className="mb-4">
              <Box className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                <Box className="flex-1">
                  <Typography variant="body2" className="font-semibold text-blue-900 text-sm md:text-base">
                    {item.nombre}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500 text-xs md:text-sm">
                    {item.tipo}
                  </Typography>
                  <Typography variant="body2" className="font-bold text-orange-500 mt-1 text-sm md:text-base">
                    ${item.precio}
                  </Typography>
                </Box>
                
                {/* Controles de cantidad */}
                <Box className="flex items-center justify-between sm:justify-end gap-2">
                  <Box className="flex items-center gap-1">
                    <IconButton size="small" className="border border-gray-300" sx={{ minWidth: '32px', width: '32px', height: '32px' }}>
                      <Remove fontSize="small" />
                    </IconButton>
                    
                    <Typography variant="body2" className="mx-2 min-w-[20px] text-center">
                      {item.cantidad}
                    </Typography>
                    
                    <IconButton size="small" className="border border-gray-300" sx={{ minWidth: '32px', width: '32px', height: '32px' }}>
                      <Add fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <IconButton size="small" className="text-red-500 ml-2" sx={{ minWidth: '32px', width: '32px', height: '32px' }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Divider />
            </Box>
          ))}
        </Box>

        {/* Total */}
        <Box className="border-t border-gray-200 pt-4 mt-4">
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h6" className="font-bold text-base md:text-lg">
              Total:
            </Typography>
            <Typography variant="h6" className="font-bold text-blue-900 text-base md:text-lg">
              ${total}
            </Typography>
          </Box>

          {/* Botones de acción */}
          <Box className="flex flex-col gap-2">
            <Button 
              variant="contained" 
              fullWidth
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 text-sm md:text-base"
              size={isMobile ? "large" : "medium"}
            >
              Proceder al Pago
            </Button>
            
            <Button 
              variant="outlined" 
              fullWidth
              className="border-blue-900 text-blue-900 hover:bg-blue-50 py-2 text-sm md:text-base"
              size={isMobile ? "large" : "medium"}
            >
              Seguir Explorando
            </Button>
          </Box>

          <Typography variant="caption" className="text-gray-500 text-center block mt-3 text-xs">
            El carrito se vacía después de 24 horas de inactividad
          </Typography>
        </Box>
      </Box>
    </Popover>
  );
}