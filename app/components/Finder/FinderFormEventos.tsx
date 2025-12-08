import { useState } from "react";
import Box from "@mui/material/Box";
import { 
  Button, 
  Stack, 
  Typography, 
  TextField, 
  InputAdornment, 
  MenuItem,
  useMediaQuery,
  IconButton,
  Popover
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import FlagIcon from "@mui/icons-material/Flag";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HotelIcon from "@mui/icons-material/Hotel";

import { RoomsGuestsSelector } from "./index";


interface FinderFormProps {
  tipoViaje: string;
  onBuscar?: () => void;
}

export default function FinderForm({ tipoViaje, onBuscar }: FinderFormProps) {
  const isMobile = useMediaQuery('(max-width:900px)');
  
  const [nacionalidad, setNacionalidad] = useState("");
  const [clase, setClase] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [roomsGuestsAnchorEl, setRoomsGuestsAnchorEl] = useState<null | HTMLElement>(null);
  const [roomsGuests, setRoomsGuests] = useState({
    habitaciones: 1,
    adultos: 2,
    niños12_17: 0,
    niños2_11: 0,
    infantes: 0
  });

  const handleBuscar = () => {
    console.log('Búsqueda de eventos realizada:', { 
      nacionalidad, 
      clase,
      fechaInicio,
      roomsGuests
    });
    if (onBuscar) {
      onBuscar();
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "Seleccionar fecha";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleRoomsGuestsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setRoomsGuestsAnchorEl(event.currentTarget);
  };

  const handleRoomsGuestsClose = () => {
    setRoomsGuestsAnchorEl(null);
  };

  const handleRoomsGuestsChange = (newRoomsGuests: typeof roomsGuests) => {
    setRoomsGuests(newRoomsGuests);
  };

  // Calcular total de personas
  const totalPersonas = roomsGuests.adultos + roomsGuests.niños12_17 + roomsGuests.niños2_11 + roomsGuests.infantes;
  const displayRoomsGuests = `${roomsGuests.habitaciones} ${roomsGuests.habitaciones === 1 ? 'habitación' : 'habitaciones'}, ${totalPersonas} ${totalPersonas === 1 ? 'persona' : 'personas'}`;

  return (
    <Box className="flex flex-col items-center w-full">
      {/* Fila 1: Nacionalidad y Clase - MISMO TAMAÑO */}
      <Box className="mb-3 w-full max-w-6xl">
        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={isMobile ? 2 : 2} 
          alignItems={isMobile ? "stretch" : "flex-end"}
          justifyContent="flex-end" 
          className="w-full"
        >
          {/* Nacionalidad - MISMO TAMAÑO QUE CLASE */}
          <Box className={isMobile ? "w-full" : "flex-1"} sx={{ 
            minWidth: isMobile ? '100%' : '200px',
            maxWidth: isMobile ? '100%' : '250px'
          }}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              NACIONALIDAD
            </Typography>
            <TextField
              select
              fullWidth
              value={nacionalidad}
              onChange={(e) => setNacionalidad(e.target.value)}
              variant="outlined"
              size="small"
              className="bg-white rounded-lg"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FlagIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="mx">México</MenuItem>
              <MenuItem value="us">Estados Unidos</MenuItem>
              <MenuItem value="ca">Canadá</MenuItem>
              <MenuItem value="es">España</MenuItem>
              <MenuItem value="ar">Argentina</MenuItem>
              <MenuItem value="co">Colombia</MenuItem>
              <MenuItem value="br">Brasil</MenuItem>
              <MenuItem value="fr">Francia</MenuItem>
              <MenuItem value="de">Alemania</MenuItem>
              <MenuItem value="it">Italia</MenuItem>
            </TextField>
          </Box>

          {/* Clase - MISMO TAMAÑO QUE NACIONALIDAD */}
          <Box className={isMobile ? "w-full" : "flex-1"} sx={{ 
            minWidth: isMobile ? '100%' : '200px',
            maxWidth: isMobile ? '100%' : '250px'
          }}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              CLASE
            </Typography>
            <TextField
              select
              fullWidth
              value={clase}
              onChange={(e) => setClase(e.target.value)}
              variant="outlined"
              size="small"
              className="bg-white rounded-lg"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HotelIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="economy">Económica</MenuItem>
              <MenuItem value="business">Ejecutiva</MenuItem>
              <MenuItem value="first">Primera Clase</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
              <MenuItem value="luxury">Lujo</MenuItem>
            </TextField>
          </Box>
        </Stack>
      </Box>

      {/* Fila 2: Fecha, Habitaciones/Personas y Buscar */}
      <Box className="w-full max-w-6xl">
        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={isMobile ? 2 : 2} 
          alignItems={isMobile ? "stretch" : "flex-end"}
          className="w-full"
        >
          {/* Fecha de Inicio */}
          <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              FECHA DE INICIO
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                variant="outlined"
                size="small"
                className="bg-white rounded-lg"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& input[type="date"]': {
                    position: 'relative',
                    zIndex: 2,
                    color: 'transparent',
                    caretColor: '#000',
                    '&:focus': { color: 'transparent' },
                    '&:valid': { color: 'transparent' },
                    '&::-webkit-datetime-edit': { color: 'transparent' },
                    '&::-webkit-datetime-edit-fields-wrapper': { color: 'transparent' },
                    '&::-webkit-datetime-edit-text': { color: 'transparent' },
                    '&::-webkit-datetime-edit-month-field': { color: 'transparent' },
                    '&::-webkit-datetime-edit-day-field': { color: 'transparent' },
                    '&::-webkit-datetime-edit-year-field': { color: 'transparent' },
                    '&::-webkit-inner-spin-button': { display: 'none' },
                    '&::-webkit-calendar-picker-indicator': {
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      zIndex: 3,
                      opacity: 0,
                      width: '100%',
                      height: '100%',
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '40px',
                  transform: 'translateY(-50%)',
                  zIndex: 1,
                  pointerEvents: 'none',
                  color: fechaInicio ? '#000' : 'rgba(0, 0, 0, 0.6)',
                  fontSize: '0.875rem',
                }}
              >
                {formatDateForDisplay(fechaInicio)}
              </Box>
            </Box>
          </Box>

          {/* Seleccionar habitaciones y personas */}
          <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              HABITACIONES Y PERSONAS
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleRoomsGuestsClick}
              className="bg-white rounded-lg text-left justify-start normal-case"
              sx={{
                borderColor: 'rgba(0, 0, 0, 0.23)',
                color: '#000',
                height: '40px',
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'white !important',
                  borderColor: 'rgba(0, 0, 0, 1) !important',
                },
                '&.Mui-focusVisible': {
                  backgroundColor: 'white',
                },
                '&:focus': {
                  backgroundColor: 'white',
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                },
                '&:active': {
                  backgroundColor: 'white',
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                }
              }}
              endIcon={<ArrowDropDownIcon />}
              startIcon={<PersonIcon fontSize="small" color="action" />}
            >
              <Typography className="text-sm truncate">
                {displayRoomsGuests}
              </Typography>
            </Button>
          </Box>

          {/* Botón BUSCAR */}
          <Box className={isMobile ? "w-full flex justify-center mt-1" : "flex items-end"}>
            <Button
              variant="contained"
              className={`
                bg-white hover:bg-gray-100 text-blue-900 border-2 border-blue-900 
                ${isMobile ? "w-full max-w-xs py-2" : "px-6 py-2"} 
                rounded-full min-w-0 font-bold h-auto shadow-md
              `}
              startIcon={<SearchIcon className="text-orange-500 text-2xl md:text-3xl" />}
              onClick={handleBuscar}
              size={isMobile ? "large" : "medium"}
            >
              <Typography variant={isMobile ? "body1" : "h6"} className="font-bold text-blue-900">
                BUSCAR
              </Typography>
            </Button>
          </Box>
        </Stack>
      </Box>

      {/* Popover para selector de habitaciones y personas */}
      <Popover
        open={Boolean(roomsGuestsAnchorEl)}
        anchorEl={roomsGuestsAnchorEl}
        onClose={handleRoomsGuestsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: isMobile ? 'center' : 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: isMobile ? 'center' : 'left',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            minWidth: isMobile ? '90vw' : '350px',
            maxWidth: isMobile ? '95vw' : '400px',
            width: isMobile ? 'auto' : undefined,
            mx: isMobile ? 2 : 0,
            maxHeight: isMobile ? '80vh' : 'auto',
            overflow: 'auto',
          }
        }}
      >
        <RoomsGuestsSelector
          roomsGuests={roomsGuests}
          onChange={handleRoomsGuestsChange}
          onClose={handleRoomsGuestsClose}
          isMobile={isMobile}
        />
      </Popover>
    </Box>
  );
}