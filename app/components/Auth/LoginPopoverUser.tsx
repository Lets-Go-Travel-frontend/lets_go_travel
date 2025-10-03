"use client";

import { Popover, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import LoginForm from "./LoginForm";
import { useEffect, useRef } from "react";

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
  onSwitchToAgency,
  onSwitchToRegister 
}: LoginPopoverUserProps) {

  const popoverRef = useRef<HTMLDivElement>(null);

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
        <LoginForm 
            onClose={onClose}
            onSwitchToRegister={onSwitchToRegister} 
            onSwitchToAgency={onSwitchToAgency}
        />
      </div>
    </Popover>
  );
}