"use client";

import { Popover } from "@mui/material";

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
          }
        }
      }}
    >
      <div className="p-4">
        <p>Formulario de login/registro aparecerá aquí...</p>
        {/* Aquí luego pondrás el formulario real */}
      </div>
    </Popover>
  );
}