"use client";

import { useState, useRef } from "react";
import { Divider, Stack } from "@mui/material";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import HeadsetMicRoundedIcon from "@mui/icons-material/HeadsetMicRounded";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";
import LoginPopover from "../LoginPopover/LoginPopover";
import { LoginPopoverUser, RegisterPopoverUser } from "../Auth";

export default function HeaderTopBar() {
  const [agencyAnchorEl, setAgencyAnchorEl] = useState<null | HTMLElement>(null);
  const [loginAnchorEl, setLoginAnchorEl] = useState<null | HTMLElement>(null);
  const [registerAnchorEl, setRegisterAnchorEl] = useState<null | HTMLElement>(null);
  
  const agencyButtonRef = useRef<HTMLButtonElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpenAgencyLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAgencyAnchorEl(event.currentTarget);
  };

  const handleOpenUserLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoginAnchorEl(event.currentTarget);
  };

  const handleCloseAgencyLogin = () => {
    setAgencyAnchorEl(null);
  };

  const handleCloseUserLogin = () => {
    setLoginAnchorEl(null);
  };

  const handleCloseUserRegister = () => {
    setRegisterAnchorEl(null);
  };

  // Switch entre login y registro
  const handleSwitchToRegister = () => {
    console.log('🔄 Switch to Register - Closing login, opening register');
    setLoginAnchorEl(null);
    if (userButtonRef.current) {
      setRegisterAnchorEl(userButtonRef.current);
    }
  };

  const handleSwitchToLogin = () => {
    console.log('🔄 Switch to Login - Closing register, opening login');
    setRegisterAnchorEl(null);
    if (userButtonRef.current) {
      setLoginAnchorEl(userButtonRef.current);
    }
  };

  // Switch a agencia desde usuario
  const handleSwitchToAgency = () => {
    setLoginAnchorEl(null);
    setRegisterAnchorEl(null);
    if (agencyButtonRef.current) {
      setAgencyAnchorEl(agencyButtonRef.current);
    }
  };

  const agencyOpen = Boolean(agencyAnchorEl);
  const loginOpen = Boolean(loginAnchorEl);
  const registerOpen = Boolean(registerAnchorEl);

  return (
    <>
      <Stack
        direction="row"
        divider={
          <Divider orientation="vertical" flexItem className="rounded border-2 border-orange-500" />
        }
        spacing={2}
        className="md:flex hidden items-center justify-end px-10 py-4"
      >
        <Stack direction="row" spacing={2} className="items-center">
          <HeadsetMicRoundedIcon fontSize="large" className="text-blue-900"></HeadsetMicRoundedIcon>
          <span className="text-xl text-cyan-500">+1 (832) 989 4525</span>
        </Stack>
        <div className="flex items-center gap-x-7 text-blue-900">
          <a href="#">
            <FacebookRoundedIcon fontSize="large"></FacebookRoundedIcon>
          </a>
          <a href="#">
            <FontAwesomeIcon icon={faSquareInstagram} className="text-primary text-3xl" />
          </a>
          <a href="#">
            <FontAwesomeIcon icon={faTiktok} className="text-primary text-3xl" />
          </a>
        </div>
        <Stack direction="row" spacing={2} className="items-center text-blue-900">
          {/* Botón para usuarios normales */}
          <button 
            ref={userButtonRef}
            onClick={handleOpenUserLogin}
            className="flex-center hover:underline cursor-pointer"
          >
            Iniciar Sesión
          </button>
          <AccountCircleRoundedIcon fontSize="large"></AccountCircleRoundedIcon>
          
          {/* Separador */}
          <span className="text-gray-400">|</span>
          
          {/* Botón para agencias */}
          <button 
            ref={agencyButtonRef}
            onClick={handleOpenAgencyLogin}
            className="flex-center hover:underline cursor-pointer"
          >
            Agencias B2B
          </button>
        </Stack>
      </Stack>

      {/* Popover para login de usuarios */}
      <LoginPopoverUser 
        open={loginOpen}
        anchorEl={loginAnchorEl}
        onClose={handleCloseUserLogin}
        onSwitchToAgency={handleSwitchToAgency}
        onSwitchToRegister={handleSwitchToRegister}
      />

      <RegisterPopoverUser 
        open={registerOpen}
        anchorEl={registerAnchorEl}
        onClose={handleCloseUserRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />

      <LoginPopover 
        open={agencyOpen}
        anchorEl={agencyAnchorEl}
        onClose={handleCloseAgencyLogin}
      />
    </>
  );
}