"use client";

import { Popover, useMediaQuery, Box, Typography, Link } from "@mui/material";
import LoginForm from "./LoginForm";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation"; 

interface LoginPopoverUserProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToAgency: () => void;
}

export default function LoginPopoverUser({ 
  open, 
  anchorEl, 
  onClose, 
  onSwitchToRegister, 
  onSwitchToAgency 
}: LoginPopoverUserProps) {
  const { getCurrentUser, logout, isUserVerified } = useAuth();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width:768px)');

  // Cargar usuario actual cuando se abre el popover
  useEffect(() => {
    if (open) {
      const user = getCurrentUser();
      setCurrentUser(user);
    }
  }, [open, getCurrentUser]);

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

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    onClose();
  };

  const handleViewProfile = () => {
    onClose();
  };

  // Verificar si el usuario necesita verificación
  const userNeedsVerification = currentUser && !isUserVerified();

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
        {currentUser && !userNeedsVerification ? (
          // USUARIO LOGUEADO Y VERIFICADO
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold text-blue-900">
                Mi Cuenta
              </h3>
            </div>

            {/* Información del usuario */}
            <div className="bg-blue-50 rounded-lg p-3 md:p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg">
                  {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-blue-900 text-sm md:text-base">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">{currentUser.email}</p>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    ✅ Cuenta verificada
                  </p>
                </div>
              </div>
            </div>

            {/* Opciones del usuario */}
            <div className="space-y-2 md:space-y-3">
              <button
                onClick={handleViewProfile}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-blue-900 font-medium text-sm md:text-base"
              >
                👤 Ver Mi Perfil
              </button>
              
              <button
                onClick={handleViewProfile}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-blue-900 font-medium text-sm md:text-base"
              >
                ❤️ Mis Favoritos
              </button>
              
              <button
                onClick={handleViewProfile}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-blue-900 font-medium text-sm md:text-base"
              >
                📋 Mis Reservas
              </button>
            </div>

            {/* Botón de logout */}
            <button
              onClick={handleLogout}
              className="w-full mt-4 md:mt-6 py-3 px-4 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition-colors text-sm md:text-base"
            >
              Cerrar Sesión
            </button>

            {/* Información adicional */}
            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Sesión activa
              </p>
            </div>
          </div>
        ) : userNeedsVerification ? (
          // USUARIO LOGUEADO PERO NO VERIFICADO
          <div className="w-full max-w-sm text-center">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold text-blue-900">
                Verifica tu cuenta
              </h3>
            </div>

            <div className="bg-yellow-50 rounded-lg p-3 md:p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg">
                  ⚠️
                </div>
                <div>
                  <p className="font-semibold text-yellow-800 text-sm md:text-base">
                    Verificación pendiente
                  </p>
                  <p className="text-xs md:text-sm text-yellow-700">
                    Verifica tu cuenta para acceder a todas las funciones.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4 text-sm md:text-base">
              Hemos enviado un código de verificación a <strong>{currentUser?.email}</strong>.
            </p>

            <button
              onClick={() => {
                onClose();
                router.push('/auth/verify');
              }}
              className="w-full py-3 px-4 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors mb-3 text-sm md:text-base"
            >
              Completar Verificación
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors text-sm md:text-base"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          // USUARIO NO LOGUEADO - Mostrar formulario de login
          <>
            <LoginForm 
              onClose={onClose}
              onSwitchToRegister={onSwitchToRegister}
              onSwitchToAgency={onSwitchToAgency}
            />
            
            {/* Enlace a página completa de login */}
            <Box className="text-center mt-4 pt-4 border-t border-gray-200">
              <Typography variant="body2" className="text-gray-600 text-xs md:text-sm">
                ¿Prefieres página completa?{' '}
                <Link 
                  component="button"
                  onClick={() => {
                    onClose();
                    router.push('/auth/login');
                  }}
                  className="text-blue-900 hover:underline font-semibold text-xs md:text-sm"
                >
                  Ir a página de login
                </Link>
              </Typography>
            </Box>
          </>
        )}
      </div>
    </Popover>
  );
}