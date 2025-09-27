"use client";

import { Popover, Typography, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import AgencyRegistrationForm from "./AgencyRegistrationForm";

interface LoginPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export default function LoginPopover({ open, anchorEl, onClose }: LoginPopoverProps) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose} // 👈 Esto hace que se cierre al clickear fuera
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
          className: "popover-with-arrow",
          style: {
            overflow: 'visible',
            width: 'fit-content',
            display: 'inline-block',
            position: 'relative',
            maxWidth: '600px',
          }
        }
      }}
    >
      <div className="p-6 relative">
        <IconButton
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          size="small"
        >
          <Close fontSize="small" />
        </IconButton>
        
        <Typography variant="h6" className="text-blue-900 font-bold mb-4 pr-8">
          Registro de Agencia
        </Typography>
        
        <AgencyRegistrationForm onClose={onClose} />
      </div>
    </Popover>
  );
}