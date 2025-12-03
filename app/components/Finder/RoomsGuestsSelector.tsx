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
import HotelIcon from "@mui/icons-material/Hotel";
import PersonIcon from "@mui/icons-material/Person";

interface RoomsGuestsSelectorProps {
  roomsGuests: {
    habitaciones: number;
    adultos: number;
    niños12_17: number;
    niños2_11: number;
    infantes: number;
  };
  onChange: (roomsGuests: {
    habitaciones: number;
    adultos: number;
    niños12_17: number;
    niños2_11: number;
    infantes: number;
  }) => void;
  onClose: () => void;
  isMobile?: boolean;
}

export default function RoomsGuestsSelector({ 
  roomsGuests, 
  onChange, 
  onClose, 
  isMobile = false 
}: RoomsGuestsSelectorProps) {
  const [localRoomsGuests, setLocalRoomsGuests] = useState(roomsGuests);

  const handleIncrement = (type: keyof typeof roomsGuests) => {
    const newRoomsGuests = {
      ...localRoomsGuests,
      [type]: localRoomsGuests[type] + 1
    };
    setLocalRoomsGuests(newRoomsGuests);
  };

  const handleDecrement = (type: keyof typeof roomsGuests) => {
    if (localRoomsGuests[type] > (type === 'habitaciones' || type === 'adultos' ? 1 : 0)) {
      const newRoomsGuests = {
        ...localRoomsGuests,
        [type]: localRoomsGuests[type] - 1
      };
      setLocalRoomsGuests(newRoomsGuests);
    }
  };

  const handleApply = () => {
    onChange(localRoomsGuests);
    onClose();
  };

  const totalPersonas = localRoomsGuests.adultos + localRoomsGuests.niños12_17 + localRoomsGuests.niños2_11 + localRoomsGuests.infantes;

  const Counter = ({ 
    title, 
    description, 
    value, 
    type,
    icon
  }: { 
    title: string; 
    description: string; 
    value: number; 
    type: keyof typeof roomsGuests;
    icon: React.ReactNode;
  }) => (
    <Box className={`flex items-center justify-between py-4 ${isMobile ? 'px-4' : 'px-6'}`}>
      <Box className="flex items-center flex-1">
        <Box className="mr-3 text-gray-600">
          {icon}
        </Box>
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
      </Box>
      <Box className="flex items-center space-x-3">
        <IconButton
          size={isMobile ? "small" : "medium"}
          onClick={() => handleDecrement(type)}
          disabled={value <= (type === 'habitaciones' || type === 'adultos' ? 1 : 0)}
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
          Habitaciones y Personas
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
        <Counter
          title="Habitaciones"
          description="Número de habitaciones"
          value={localRoomsGuests.habitaciones}
          type="habitaciones"
          icon={<HotelIcon fontSize={isMobile ? "small" : "medium"} />}
        />
        <Divider />
        
        <Counter
          title="Adultos (+18)"
          description="Mayores de 18 años"
          value={localRoomsGuests.adultos}
          type="adultos"
          icon={<PersonIcon fontSize={isMobile ? "small" : "medium"} />}
        />
        <Divider />
        
        <Counter
          title="Niños (12-17)"
          description="De 12 a 17 años"
          value={localRoomsGuests.niños12_17}
          type="niños12_17"
          icon={<PersonIcon fontSize={isMobile ? "small" : "medium"} />}
        />
        <Divider />
        
        <Counter
          title="Niños pequeños (2-11)"
          description="De 2 a 11 años"
          value={localRoomsGuests.niños2_11}
          type="niños2_11"
          icon={<PersonIcon fontSize={isMobile ? "small" : "medium"} />}
        />
        <Divider />
        
        <Counter
          title="Bebés (Menos de 2)"
          description="Menores de 2 años"
          value={localRoomsGuests.infantes}
          type="infantes"
          icon={<PersonIcon fontSize={isMobile ? "small" : "medium"} />}
        />
      </Box>

      <Divider />

      <Box className={`${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}>
        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={isMobile ? 2 : 2} 
          justifyContent="space-between" 
          alignItems="center"
        >
          <Box>
            <Typography 
              variant={isMobile ? "body1" : "body1"} 
              className="font-semibold text-gray-800"
              sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
            >
              {localRoomsGuests.habitaciones} {localRoomsGuests.habitaciones === 1 ? 'habitación' : 'habitaciones'}
            </Typography>
            <Typography 
              variant="body2" 
              className="text-gray-600"
              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
            >
              {totalPersonas} {totalPersonas === 1 ? 'persona' : 'personas'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleApply}
            className="bg-blue-900 hover:bg-blue-800 text-white"
            sx={{
              width: isMobile ? '100%' : 'auto',
              padding: isMobile ? '8px 24px' : '8px 32px',
              fontSize: isMobile ? '0.875rem' : '1rem',
              marginTop: isMobile ? '12px' : '0',
            }}
          >
            Aplicar
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}