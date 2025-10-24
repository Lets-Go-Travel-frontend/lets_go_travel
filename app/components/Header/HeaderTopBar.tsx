"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Divider, 
  Stack, 
  IconButton, 
  Box, 
  Typography,
  Drawer
} from "@mui/material";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import HeadsetMicRoundedIcon from "@mui/icons-material/HeadsetMicRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";
import LoginPopover from "../LoginPopover/LoginPopover";
import { LoginPopoverUser, RegisterPopoverUser } from "../Auth";
import { CarritoPopover } from "../Carrito";
import { useAuth } from "@/hooks/useAuth";

export default function HeaderTopBar() {
  const { getCurrentUser, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [agencyAnchorEl, setAgencyAnchorEl] = useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null); // ✅ UNICO anchorEl para usuario
  const [carritoAnchorEl, setCarritoAnchorEl] = useState<null | HTMLElement>(null);
  
  const [activeUserPopover, setActiveUserPopover] = useState<'login' | 'register' | null>(null); // ✅ Controlar qué popup mostrar
  
  const agencyButtonRef = useRef<HTMLButtonElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const carritoButtonRef = useRef<HTMLButtonElement>(null); 

  // Cargar usuario actual
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, [getCurrentUser]);

  const handleOpenAgencyLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAgencyAnchorEl(event.currentTarget);
  };

  const handleOpenUserPopover = (event: React.MouseEvent<HTMLButtonElement>, type: 'login' | 'register') => {
    setUserAnchorEl(event.currentTarget); // ✅ MISMO anchorEl
    setActiveUserPopover(type); // ✅ Controlar qué popup mostrar
  };

  const handleCloseAgencyLogin = () => {
    setAgencyAnchorEl(null);
  };

  const handleCloseUserPopover = () => {
    setUserAnchorEl(null);
    setActiveUserPopover(null);
  };

  // Switch entre login y registro - CORREGIDO
  const handleSwitchToRegister = () => {
    setActiveUserPopover('register'); // ✅ Solo cambiar el tipo, mantener el mismo anchorEl
  };

  const handleSwitchToLogin = () => {
    setActiveUserPopover('login'); // ✅ Solo cambiar el tipo, mantener el mismo anchorEl
  };

  // Switch a agencia desde usuario
  const handleSwitchToAgency = () => {
    setUserAnchorEl(null);
    setActiveUserPopover(null);
    if (agencyButtonRef.current) {
      setAgencyAnchorEl(agencyButtonRef.current);
    }
  };

  const handleOpenCarrito = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCarritoAnchorEl(event.currentTarget);
  };

  const handleCloseCarrito = () => {
    setCarritoAnchorEl(null);
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setUserAnchorEl(null);
    setActiveUserPopover(null);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const agencyOpen = Boolean(agencyAnchorEl);
  const userPopoverOpen = Boolean(userAnchorEl); // ✅ Unico estado para ambos popups de usuario
  const carritoOpen = Boolean(carritoAnchorEl); 

  return (
    <>
      {/* VERSIÓN ESCRITORIO */}
      <Stack
        direction="row"
        divider={
          <Divider orientation="vertical" flexItem className="rounded border-2 border-orange-500" />
        }
        spacing={2}
        className="hidden md:flex items-center justify-end px-4 md:px-10 py-2 md:py-4"
      >
        <Stack direction="row" spacing={2} className="items-center">
          <HeadsetMicRoundedIcon fontSize="large" className="text-blue-900" />
          <span className="text-lg md:text-xl text-cyan-500">+1 (832) 989 4525</span>
        </Stack>
        <div className="flex items-center gap-x-4 md:gap-x-7 text-blue-900">
          <a href="#">
            <FacebookRoundedIcon fontSize="large" />
          </a>
          <a href="#">
            <FontAwesomeIcon icon={faSquareInstagram} className="text-primary text-2xl md:text-3xl" />
          </a>
          <a href="#">
            <FontAwesomeIcon icon={faTiktok} className="text-primary text-2xl md:text-3xl" />
          </a>
        </div>
        <Stack direction="row" spacing={2} className="items-center text-blue-900">
          <IconButton 
            ref={carritoButtonRef}
            onClick={handleOpenCarrito}
            className="text-blue-900 hover:bg-blue-50"
          >
            <ShoppingCartRoundedIcon fontSize="large" />
          </IconButton>

          {/* SECCIÓN DE USUARIO - CAMBIA DINÁMICAMENTE */}
          {currentUser ? (
            // USUARIO LOGUEADO
            <Box className="flex items-center gap-2">
              <AccountCircleRoundedIcon fontSize="large" className="text-green-600" />
              <Box className="flex flex-col">
                <Typography variant="body2" className="text-blue-900 font-semibold">
                  Hola, {currentUser.firstName}
                </Typography>
                <Typography variant="caption" className="text-gray-600">
                  {currentUser.email}
                </Typography>
              </Box>
              <button 
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800 hover:underline ml-2"
              >
                Cerrar Sesión
              </button>
            </Box>
          ) : (
            // USUARIO NO LOGUEADO
            <>
              <button 
                ref={userButtonRef}
                onClick={(e) => handleOpenUserPopover(e, 'login')} // ✅ Usar función unificada
                className="flex-center hover:underline cursor-pointer text-sm md:text-base"
              >
                Iniciar Sesión
              </button>
              <AccountCircleRoundedIcon fontSize="large" />
            </>
          )}
          
          {/* Separador */}
          <span className="text-gray-400 hidden md:inline">|</span>
          
          {/* Botón para agencias (siempre visible) */}
          <button 
            ref={agencyButtonRef}
            onClick={handleOpenAgencyLogin}
            className="flex-center hover:underline cursor-pointer text-sm md:text-base"
          >
            Agencias B2B
          </button>
        </Stack>
      </Stack>

      {/* VERSIÓN MÓVIL - NUEVO ORDEN */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 bg-blue-50">
        {/* IZQUIERDA: Menú hamburguesa */}
        <IconButton 
          onClick={toggleMobileMenu}
          className="text-blue-900"
          size="small"
        >
          <MenuIcon />
        </IconButton>

        {/* CENTRO: Carrito */}
        <IconButton 
          ref={carritoButtonRef}
          onClick={handleOpenCarrito}
          className="text-blue-900"
          size="small"
        >
          <ShoppingCartRoundedIcon />
        </IconButton>

        {/* DERECHA: Iniciar Sesión o Usuario */}
        {currentUser ? (
          // Usuario logueado - mostrar icono de usuario
          <IconButton 
            ref={userButtonRef}
            className="text-blue-900"
            size="small"
          >
            <AccountCircleRoundedIcon className="text-green-600" />
          </IconButton>
        ) : (
          // Usuario no logueado - mostrar botón de login
          <button 
            ref={userButtonRef}
            onClick={(e) => handleOpenUserPopover(e, 'login')} // ✅ Usar función unificada
            className="text-blue-900 hover:underline cursor-pointer text-sm font-semibold px-2 py-1"
          >
            Iniciar Sesión
          </button>
        )}
      </div>

      {/* DRAWER MÓVIL - AHORA A LA IZQUIERDA */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: { width: 280 }
        }}
      >
        <div className="p-4">
          {/* Encabezado del drawer */}
          <Box className="flex items-center justify-between mb-4">
            <Typography variant="h6" className="text-blue-900 font-bold">
              Menú
            </Typography>
            <IconButton 
              onClick={toggleMobileMenu}
              className="text-blue-900"
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Teléfono dentro del drawer */}
          <Box className="mb-4 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
            <div className="flex items-center gap-3">
              <HeadsetMicRoundedIcon className="text-cyan-600" />
              <Box>
                <Typography variant="body2" className="text-cyan-800 font-semibold">
                  Soporte 24/7
                </Typography>
                <Typography variant="body1" className="text-cyan-600 font-bold">
                  +1 (832) 989 4525
                </Typography>
              </Box>
            </div>
          </Box>

          {/* Información del usuario en móvil */}
          {currentUser ? (
            <Box className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AccountCircleRoundedIcon className="text-green-600" />
                <Box>
                  <Typography variant="body2" className="text-blue-900 font-semibold">
                    Hola, {currentUser.firstName}
                  </Typography>
                  <Typography variant="caption" className="text-gray-600">
                    {currentUser.email}
                  </Typography>
                </Box>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full mt-2 text-sm text-red-600 hover:text-red-800 text-center"
              >
                Cerrar Sesión
              </button>
            </Box>
          ) : (
            <Box className="mb-4 space-y-2">
              <button 
                ref={userButtonRef}
                onClick={(e) => {
                  handleOpenUserPopover(e, 'login'); // ✅ Usar función unificada
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-3 hover:bg-blue-50 rounded border border-blue-100 text-blue-900 font-semibold"
              >
                Iniciar Sesión
              </button>
              <button 
                ref={agencyButtonRef}
                onClick={(e) => {
                  handleOpenAgencyLogin(e);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left p-3 hover:bg-blue-50 rounded border border-blue-100 text-blue-900 font-semibold"
              >
                Agencias B2B
              </button>
            </Box>
          )}

          {/* Redes sociales en móvil */}
          <Divider className="my-4" />
          <Typography variant="body2" className="text-blue-900 font-semibold mb-3">
            Síguenos en:
          </Typography>
          <div className="flex gap-4 justify-center mb-4">
            <a href="#" className="text-blue-700 hover:text-blue-900">
              <FacebookRoundedIcon />
            </a>
            <a href="#" className="text-pink-600 hover:text-pink-800">
              <FontAwesomeIcon icon={faSquareInstagram} className="text-xl" />
            </a>
            <a href="#" className="text-black hover:text-gray-800">
              <FontAwesomeIcon icon={faTiktok} className="text-xl" />
            </a>
          </div>
        </div>
      </Drawer>

      {/* Popovers - AHORA CON MISMO anchorEl */}
      {!currentUser && (
        <>
          <LoginPopoverUser 
            open={userPopoverOpen && activeUserPopover === 'login'} // ✅ Controlado por estado
            anchorEl={userAnchorEl} // ✅ MISMO anchorEl
            onClose={handleCloseUserPopover}
            onSwitchToAgency={handleSwitchToAgency}
            onSwitchToRegister={handleSwitchToRegister}
          />

          <RegisterPopoverUser 
            open={userPopoverOpen && activeUserPopover === 'register'} // ✅ Controlado por estado
            anchorEl={userAnchorEl} 
            onClose={handleCloseUserPopover}
            onSwitchToLogin={handleSwitchToLogin}
          />
        </>
      )}

      <LoginPopover 
        open={agencyOpen}
        anchorEl={agencyAnchorEl}
        onClose={handleCloseAgencyLogin}
      />

      <CarritoPopover 
        open={carritoOpen}
        anchorEl={carritoAnchorEl}
        onClose={handleCloseCarrito}
      />
    </>
  );
}