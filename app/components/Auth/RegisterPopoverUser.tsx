"use client";

import { Popover } from "@mui/material";
import RegisterForm from "./RegisterForm";
import { useEffect, useRef } from "react";

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
        <RegisterForm 
          onClose={onClose}
          onSwitchToLogin={onSwitchToLogin}
        />
      </div>
    </Popover>
  );
}