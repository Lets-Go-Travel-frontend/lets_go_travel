// components/FinderForm/FinderForm.tsx
import { useState } from "react";
import Box from "@mui/material/Box";
import { 
  Button, 
  Stack, 
  Typography, 
  TextField, 
  InputAdornment, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  useMediaQuery,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Popover
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People"; // Nuevo ícono para múltiples personas
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FlagIcon from "@mui/icons-material/Flag";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { GuestsSelector } from "./index";

interface FinderFormProps {
  tipoViaje: string;
  onBuscar?: () => void;
}

export default function FinderForm({ tipoViaje, onBuscar }: FinderFormProps) {
  const isMobile = useMediaQuery('(max-width:900px)');

  const [tipoAlojamiento, setTipoAlojamiento] = useState("un-alojamiento");
  const [nacionalidad, setNacionalidad] = useState("");
  const [destino, setDestino] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  
  // Estado para el selector de huéspedes
  const [guestsAnchorEl, setGuestsAnchorEl] = useState<null | HTMLElement>(null);
  const [guests, setGuests] = useState({
    adultos: 2,
    niños12_17: 0,
    niños2_11: 0,
    infantes: 0
  });

  const handleBuscar = () => {
    console.log('Búsqueda de alojamiento realizada:', { 
      tipoAlojamiento,
      nacionalidad, 
      destino, 
      checkIn,
      checkOut,
      guests
    });
    if (onBuscar) {
      onBuscar();
    }
  };

  // Función para formatear la fecha en un placeholder personalizado
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "Seleccionar fecha";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Funciones para el selector de huéspedes
  const handleGuestsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setGuestsAnchorEl(event.currentTarget);
  };

  const handleGuestsClose = () => {
    setGuestsAnchorEl(null);
  };

  const handleGuestsChange = (newGuests: typeof guests) => {
    setGuests(newGuests);
  };

  // Calcular el total de huéspedes
  const totalGuests = guests.adultos + guests.niños12_17 + guests.niños2_11;
  const displayGuests = totalGuests === 0 ? "Seleccionar" : 
    `${totalGuests} ${totalGuests === 1 ? 'huésped' : 'huéspedes'}${guests.infantes > 0 ? `, ${guests.infantes} ${guests.infantes === 1 ? 'infante' : 'infantes'}` : ''}`;

  return (
    <Box className="flex flex-col items-center w-full">
      <Box className="mb-3 w-full max-w-6xl">
        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={isMobile ? 2 : 2} 
          alignItems={isMobile ? "stretch" : "flex-end"}
          className="w-full"
        >
          <Box className={isMobile ? "w-full" : "flex-1"}>
            <FormControl component="fieldset" className="w-full">
              <RadioGroup
                row
                value={tipoAlojamiento}
                onChange={(e) => setTipoAlojamiento(e.target.value)}
                className="flex gap-1"
              >
                <FormControlLabel 
                  value="un-alojamiento" 
                  control={
                    <Radio 
                      size="small"
                      className="text-orange-500"
                      sx={{
                        '&.Mui-checked': {
                          color: 'rgb(249 115 22)',
                        },
                        padding: '4px', 
                        '& .MuiSvgIcon-root': {
                          fontSize: '18px', 
                        }
                      }}
                    />
                  } 
                  label={
                    <Typography className="text-white font-semibold text-xs md:text-sm whitespace-nowrap">
                      Un alojamiento
                    </Typography>
                  } 
                  sx={{
                    marginRight: '8px', 
                  }}
                />
                <FormControlLabel 
                  value="multiples-alojamientos" 
                  control={
                    <Radio 
                      size="small"
                      className="text-orange-500"
                      sx={{
                        '&.Mui-checked': {
                          color: 'rgb(249 115 22)',
                        },
                        padding: '4px', 
                        '& .MuiSvgIcon-root': {
                          fontSize: '18px',
                        }
                      }}
                    />
                  } 
                  label={
                    <Typography className="text-white font-semibold text-xs md:text-sm whitespace-nowrap">
                      Múltiples alojamientos
                    </Typography>
                  } 
                  sx={{
                    marginLeft: '0px', 
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {/* Nacionalidad - Más pequeño */}
          <Box className={isMobile ? "w-full" : ""} sx={{ 
            width: isMobile ? '100%' : 'auto',
            minWidth: isMobile ? '100%' : '180px',
            maxWidth: isMobile ? '100%' : '220px'
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
        </Stack>
      </Box>

      <Box className="w-full max-w-6xl">
        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={isMobile ? 2 : 2} 
          alignItems={isMobile ? "stretch" : "flex-end"}
          className="w-full"
        >
          {/* Destino - MÁS GRANDE */}
          <Box className={isMobile ? "w-full" : "flex-2"}> {/* flex-2 para más ancho */}
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              DESTINO
            </Typography>
            <TextField
              fullWidth
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              placeholder="Ciudad, región, hotel o dirección..."
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
              className="bg-white rounded-lg"
              sx={{
                '& .MuiOutlinedInput-root': {
                  paddingRight: '8px',
                }
              }}
            />
          </Box>

          {/* Check-In */}
          <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              CHECK-IN
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
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
                  color: checkIn ? '#000' : 'rgba(0, 0, 0, 0.6)',
                  fontSize: '0.875rem',
                }}
              >
                {formatDateForDisplay(checkIn)}
              </Box>
            </Box>
          </Box>

          {/* Check-Out */}
          <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              CHECK-OUT
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
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
                  color: checkOut ? '#000' : 'rgba(0, 0, 0, 0.6)',
                  fontSize: '0.875rem',
                }}
              >
                {formatDateForDisplay(checkOut)}
              </Box>
            </Box>
          </Box>

          {/* Huéspedes - Ahora con popover */}
          <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              HUÉSPEDES
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGuestsClick}
              className="bg-white rounded-lg text-left justify-start normal-case"
              sx={{
                borderColor: 'rgba(0, 0, 0, 0.23)',
                color: '#000',
                height: '40px',
                '&:hover': {
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
              endIcon={<ArrowDropDownIcon />}
              startIcon={
                totalGuests === 1 ? (
                  <PersonIcon fontSize="small" color="action" />
                ) : (
                  <PeopleIcon fontSize="small" color="action" />
                )
              }
            >
              <Typography className="text-sm truncate">
                {displayGuests}
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

      {/* Popover para selector de huéspedes */}
      <Popover
        open={Boolean(guestsAnchorEl)}
        anchorEl={guestsAnchorEl}
        onClose={handleGuestsClose}
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
            minWidth: isMobile ? '90vw' : '320px',
            maxWidth: isMobile ? '95vw' : '400px',
            width: isMobile ? 'auto' : undefined,
            mx: isMobile ? 2 : 0,
            maxHeight: isMobile ? '80vh' : 'auto',
            overflow: 'auto',
          }
        }}
        sx={{
          '& .MuiPopover-paper': {
            margin: isMobile ? 'auto' : undefined,
            left: isMobile ? '50%' : undefined,
            transform: isMobile ? 'translateX(-50%)' : undefined,
          }
        }}
      >
        <GuestsSelector
          guests={guests}
          onChange={handleGuestsChange}
          onClose={handleGuestsClose}
          isMobile={isMobile}
        />
      </Popover>
    </Box>
  );
}