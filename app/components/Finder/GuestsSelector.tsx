import { useState } from "react";
import Box from "@mui/material/Box";
import {
  Typography,
  IconButton,
  Button,
  Stack,
  Divider
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";

interface GuestsSelectorProps {
  guests: {
    adultos: number;
    niños12_17: number;
    niños2_11: number;
    infantes: number;
  };
  onChange: (guests: {
    adultos: number;
    niños12_17: number;
    niños2_11: number;
    infantes: number;
  }) => void;
  onClose: () => void;
  isMobile?: boolean;
}

export default function GuestsSelector({ guests, onChange, onClose, isMobile = false }: GuestsSelectorProps) {
  const [localGuests, setLocalGuests] = useState(guests);

  const handleIncrement = (type: keyof typeof guests) => {
    const newGuests = {
      ...localGuests,
      [type]: localGuests[type] + 1
    };
    setLocalGuests(newGuests);
    onChange(newGuests);
  };

  const handleDecrement = (type: keyof typeof guests) => {
    if (localGuests[type] > 0) {
      const newGuests = {
        ...localGuests,
        [type]: localGuests[type] - 1
      };
      setLocalGuests(newGuests);
      onChange(newGuests);
    }
  };

  const handleApply = () => {
    onChange(localGuests);
    onClose();
  };

  const totalGuests = localGuests.adultos + localGuests.niños12_17 + localGuests.niños2_11 + localGuests.infantes;

  const GuestCounter = ({ 
    title, 
    description, 
    value, 
    type 
  }: { 
    title: string; 
    description: string; 
    value: number; 
    type: keyof typeof guests 
  }) => (
    <Box className={`flex items-center justify-between py-4 ${isMobile ? 'px-4' : 'px-6'}`}>
      <Box className="flex-1">
        <Typography 
          variant={isMobile ? "body1" : "subtitle1"} 
          className="font-semibold text-gray-800"
          sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          className="text-gray-600 mt-1"
          sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
        >
          {description}
        </Typography>
      </Box>
      <Box className="flex items-center space-x-3">
        <IconButton
          size={isMobile ? "small" : "medium"}
          onClick={() => handleDecrement(type)}
          disabled={value === 0}
          className="border border-gray-300 rounded-full"
          sx={{
            '&.Mui-disabled': {
              borderColor: 'rgba(0, 0, 0, 0.12)',
              color: 'rgba(0, 0, 0, 0.26)',
            },
            padding: isMobile ? '4px' : '8px',
          }}
        >
          <RemoveIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
        <Typography 
          variant="body1" 
          className="font-semibold min-w-[28px] text-center"
          sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
        >
          {value}
        </Typography>
        <IconButton
          size={isMobile ? "small" : "medium"}
          onClick={() => handleIncrement(type)}
          className="border border-gray-300 rounded-full bg-blue-50 hover:bg-blue-100"
          sx={{
            padding: isMobile ? '4px' : '8px',
          }}
        >
          <AddIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box className="p-2" sx={{ width: '100%' }}>
      <Box className={`flex items-center justify-between ${isMobile ? 'px-3 py-2' : 'px-4 py-3'}`}>
        <Typography 
          variant={isMobile ? "h6" : "h6"} 
          className="font-bold text-gray-800"
          sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}
        >
          Seleccionar huéspedes
        </Typography>
        <IconButton 
          size={isMobile ? "small" : "medium"} 
          onClick={onClose}
          sx={{ padding: isMobile ? '4px' : '8px' }}
        >
          <CloseIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </Box>
      
      <Divider />

      <Box>
        <GuestCounter
          title="Adultos (+18)"
          description="Mayores de 18 años"
          value={localGuests.adultos}
          type="adultos"
        />
        <Divider />
        
        <GuestCounter
          title="Niños (12-17)"
          description="De 12 a 17 años"
          value={localGuests.niños12_17}
          type="niños12_17"
        />
        <Divider />
        
        <GuestCounter
          title="Niños pequeños (2-11)"
          description="De 2 a 11 años"
          value={localGuests.niños2_11}
          type="niños2_11"
        />
        <Divider />
        
        <GuestCounter
          title="Bebés (Menos de 2)"
          description="Menores de 2 años"
          value={localGuests.infantes}
          type="infantes"
        />
      </Box>

      <Divider />

      <Box className={`${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}>
        <Typography 
          variant="body2" 
          className="text-gray-600 text-center"
          sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}
        >
          Cualquier pasajero adicional puede ser agregado después
        </Typography>
      </Box>

      <Divider />

      <Box className={`${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}>
        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={isMobile ? 2 : 2} 
          justifyContent="space-between" 
          alignItems="center"
        >
          <Typography 
            variant={isMobile ? "body1" : "body1"} 
            className="font-semibold text-gray-800 mb-2 md:mb-0"
            sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
          >
            Total: {totalGuests} {totalGuests === 1 ? 'huésped' : 'huéspedes'}
          </Typography>
          <Button
            variant="contained"
            onClick={handleApply}
            className="bg-blue-900 hover:bg-blue-800 text-white"
            sx={{
              width: isMobile ? '100%' : 'auto',
              padding: isMobile ? '8px 24px' : '8px 32px',
              fontSize: isMobile ? '0.875rem' : '1rem',
            }}
          >
            Aplicar
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}