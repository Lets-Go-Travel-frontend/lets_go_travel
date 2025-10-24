"use client";

import { Popover, useMediaQuery, Box, Typography, Link } from "@mui/material";
import RegisterForm from "./RegisterForm";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface RegisterPopoverUserProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterPopoverUser({ 
  open, 
  anchorEl, 
  onClose, 
  onSwitchToLogin 
}: RegisterPopoverUserProps) {
  const router = useRouter();
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
      <div ref={popoverRef} className="p-4 md:p-6">
        <RegisterForm 
          onClose={onClose}
          onSwitchToLogin={onSwitchToLogin}
        />
        
        {/* Enlace a página completa de registro */}
        <Box className="text-center mt-4 pt-4 border-t border-gray-200">
          <Typography variant="body2" className="text-gray-600 text-xs md:text-sm">
            ¿Prefieres página completa?{' '}
            <Link 
              component="button"
              onClick={() => {
                onClose();
                router.push('/auth/register');
              }}
              className="text-blue-900 hover:underline font-semibold text-xs md:text-sm"
            >
              Ir a página de registro
            </Link>
          </Typography>
        </Box>
      </div>
    </Popover>
  );
}