"use client";

import { Popover, Typography, IconButton, useMediaQuery } from "@mui/material";
import { Close } from "@mui/icons-material";
import AgencyRegistrationForm from "./AgencyRegistrationForm";
import { useEffect, useRef } from "react";

interface LoginPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export default function LoginPopover({ open, anchorEl, onClose }: LoginPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width:768px)');

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
            width: isMobile ? '95vw' : 'auto',
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
      <div ref={popoverRef} className="p-4 md:p-6 relative">
        <IconButton
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          size="small"
        >
          <Close fontSize="small" />
        </IconButton>
        
        <Typography variant="h6" className="text-blue-900 font-bold mb-4 pr-8 text-lg md:text-xl">
          Registssro de Agencia
        </Typography>
        
        <div className={isMobile ? "max-h-[60vh] overflow-y-auto" : ""}>
          <AgencyRegistrationForm onClose={onClose} />
        </div>
      </div>
    </Popover>
  );
}