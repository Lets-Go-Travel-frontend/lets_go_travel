"use client";

import { Popover } from "@mui/material";
import LoginForm from "./LoginForm";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation"; 
import { Box, Typography, Link } from "@mui/material";

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
    // Aquí podrías redirigir al perfil después
    console.log('Ver perfil');
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
          className: "popover-with-arrow",
          style: {
            overflow: 'visible',
            width: 'fit-content',
            display: 'inline-block',
            position: 'relative',
            maxWidth: '400px',
          }
        }
      }}
    >
      <div ref={popoverRef} className="p-6">
        {currentUser && !userNeedsVerification ? (
          // USUARIO LOGUEADO Y VERIFICADO - Mostrar información y opciones
          <div className="w-80 max-w-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-blue-900">
                Mi Cuenta
              </h3>
            </div>

            {/* Información del usuario */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-blue-900">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{currentUser.email}</p>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    ✅ Cuenta verificada
                  </p>
                </div>
              </div>
            </div>

            {/* Opciones del usuario */}
            <div className="space-y-3">
              <button
                onClick={handleViewProfile}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-blue-900 font-medium"
              >
                👤 Ver Mi Perfil
              </button>
              
              <button
                onClick={handleViewProfile}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-blue-900 font-medium"
              >
                ❤️ Mis Favoritos
              </button>
              
              <button
                onClick={handleViewProfile}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-blue-900 font-medium"
              >
                📋 Mis Reservas
              </button>
            </div>

            {/* Botón de logout */}
            <button
              onClick={handleLogout}
              className="w-full mt-6 py-3 px-4 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              Cerrar Sesión
            </button>

            {/* Información adicional */}
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Sesión activa
              </p>
            </div>
          </div>
        ) : userNeedsVerification ? (
          // USUARIO LOGUEADO PERO NO VERIFICADO
          <div className="w-80 max-w-sm text-center">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-blue-900">
                Verifica tu cuenta
              </h3>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    ⚠️
                </div>
                <div>
                  <p className="font-semibold text-yellow-800">
                    Verificación pendiente
                  </p>
                  <p className="text-sm text-yellow-700">
                    Necesitas verificar tu cuenta para acceder a todas las funciones.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              Hemos enviado un código de verificación a <strong>{currentUser?.email}</strong>. 
              Por favor verifica tu cuenta para continuar.
            </p>

            <button
              onClick={() => {
                onClose();
                router.push('/auth/verify');
              }}
              className="w-full py-3 px-4 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors mb-3"
            >
              Completar Verificación
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
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
              <Typography variant="body2" className="text-gray-600">
                ¿Prefieres página completa?{' '}
                <Link 
                  component="button"
                  onClick={() => {
                    onClose();
                    router.push('/auth/login');
                  }}
                  className="text-blue-900 hover:underline font-semibold"
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