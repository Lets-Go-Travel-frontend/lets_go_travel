"use client";

import { Popover, Box, Typography, IconButton, Radio, RadioGroup, FormControlLabel, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";

interface OrdenarPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  tipo: string;
}

export default function OrdenarPopover({ open, anchorEl, onClose, tipo }: OrdenarPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [ordenSeleccionado, setOrdenSeleccionado] = useState("recomendado");

  const opcionesOrden = {
    ofertas: [
      { value: "recomendado", label: "Recomendado" },
      { value: "precio-asc", label: "Precio: Menor a Mayor" },
      { value: "precio-desc", label: "Precio: Mayor a Menor" },
      { value: "descuento", label: "Mayor Descuento" },
    ],
    paquetes: [
      { value: "recomendado", label: "Recomendado" },
      { value: "precio-asc", label: "Precio: Menor a Mayor" },
      { value: "precio-desc", label: "Precio: Mayor a Menor" },
      { value: "duracion", label: "Duración" },
    ],
    destinos: [
      { value: "recomendado", label: "Recomendado" },
      { value: "precio-asc", label: "Precio: Menor a Mayor" },
      { value: "precio-desc", label: "Precio: Mayor a Menor" },
      { value: "popularidad", label: "Popularidad" },
    ],
    alojamientos: [
      { value: "recomendado", label: "Recomendado" },
      { value: "precio-asc", label: "Precio: Menor a Mayor" },
      { value: "precio-desc", label: "Precio: Mayor a Menor" },
      { value: "estrellas", label: "Más Estrellas" },
    ],
    default: [
      { value: "recomendado", label: "Recomendado" },
      { value: "precio-asc", label: "Precio: Menor a Mayor" },
      { value: "precio-desc", label: "Precio: Mayor a Menor" },
    ]
  };

  const opciones = opcionesOrden[tipo as keyof typeof opcionesOrden] || opcionesOrden.default;

  const aplicarOrden = () => {
    console.log('Orden aplicado:', ordenSeleccionado);
    onClose();
  };

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
            width: '280px',
          }
        }
      }}
    >
      <Box ref={popoverRef} className="p-4">
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6" className="font-bold text-blue-900">
            Ordenar por
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close fontSize="small" />
          </IconButton>
        </Box>

        <RadioGroup
          value={ordenSeleccionado}
          onChange={(e) => setOrdenSeleccionado(e.target.value)}
          className="mb-4"
        >
          {opciones.map((opcion) => (
            <FormControlLabel
              key={opcion.value}
              value={opcion.value}
              control={<Radio size="small" />}
              label={opcion.label}
              className="w-full mb-2"
            />
          ))}
        </RadioGroup>

        <Button 
          variant="contained" 
          fullWidth
          onClick={aplicarOrden}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Aplicar
        </Button>
      </Box>
    </Popover>
  );
}