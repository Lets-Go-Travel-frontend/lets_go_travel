import { useState } from "react";
import Box from "@mui/material/Box";
import { 
  FormControl,
  Button, 
  Stack, 
  Typography, 
  TextField, 
  InputAdornment, 
  useMediaQuery,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Popover
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import GuestsSelector from "./GuestsSelector";

interface FinderFormProps {
  tipoViaje: string;
  onBuscar?: () => void;
}

export default function FinderFormDestinos({ tipoViaje, onBuscar }: FinderFormProps) {
  const isMobile = useMediaQuery('(max-width:900px)');
  
  const [tipoViajeDestino, setTipoViajeDestino] = useState("solo-ida");
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fechaIda, setFechaIda] = useState("");
  const [fechaRegreso, setFechaRegreso] = useState("");
  const [guestsAnchorEl, setGuestsAnchorEl] = useState<null | HTMLElement>(null);
  const [guests, setGuests] = useState({
    adultos: 2,
    niños12_17: 0,
    niños2_11: 0,
    infantes: 0
  });

  const handleBuscar = () => {
    console.log('Búsqueda de destinos realizada:', { 
      tipoViajeDestino,
      origen,
      destino,
      fechaIda,
      fechaRegreso,
      guests
    });
    if (onBuscar) {
      onBuscar();
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "Seleccionar fecha";
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleGuestsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setGuestsAnchorEl(event.currentTarget);
  };

  const handleGuestsClose = () => {
    setGuestsAnchorEl(null);
  };

  const handleGuestsChange = (newGuests: typeof guests) => {
    setGuests(newGuests);
  };

  const totalGuests = guests.adultos + guests.niños12_17 + guests.niños2_11 + guests.infantes;
  const displayGuests = totalGuests === 0 ? "Seleccionar" : 
    `${totalGuests} ${totalGuests === 1 ? 'pasajero' : 'pasajeros'}`;

  return (
    <Box className="flex flex-col items-center w-full">
      {/* Fila 1: Tipo de Viaje */}
      <Box className="mb-3 w-full max-w-6xl">
        <FormControl component="fieldset" className="w-full">
          <RadioGroup
            row
            value={tipoViajeDestino}
            onChange={(e) => setTipoViajeDestino(e.target.value)}
            className="flex gap-4 justify-start"
          >
            <FormControlLabel 
              value="solo-ida" 
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
                  Solo Ida
                </Typography>
              } 
            />
            <FormControlLabel 
              value="ida-vuelta" 
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
                  Ida y Vuelta
                </Typography>
              } 
            />
            <FormControlLabel 
              value="multiples-destinos" 
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
                  Múltiples Destinos
                </Typography>
              } 
            />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Fila 2: Origen y Destino */}
      <Box className="mb-3 w-full max-w-6xl">
        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={isMobile ? 2 : 2} 
          className="w-full"
        >
          {/* Origen */}
          <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              ORIGEN
            </Typography>
            <TextField
              fullWidth
              value={origen}
              onChange={(e) => setOrigen(e.target.value)}
              placeholder="Ciudad o aeropuerto..."
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FlightTakeoffIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
              className="bg-white rounded-lg"
            />
          </Box>
          
          {/* Destino */}
          <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              DESTINO
            </Typography>
            <TextField
              fullWidth
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              placeholder="Ciudad o aeropuerto..."
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FlightLandIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
              className="bg-white rounded-lg"
            />
          </Box>
        </Stack>
      </Box>

      {/* Fila 3: Fechas, Pasajeros y Buscar */}
      <Box className="w-full max-w-6xl">
        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={isMobile ? 2 : 2} 
          alignItems={isMobile ? "stretch" : "flex-end"}
          className="w-full"
        >
          {/* Fecha de Ida */}
          <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              FECHA DE IDA
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                type="date"
                value={fechaIda}
                onChange={(e) => {
                  const nuevaFecha = e.target.value;
                  setFechaIda(nuevaFecha);
                  // Si la fecha de ida es posterior a la de regreso, resetear fecha de regreso
                  if (fechaRegreso && nuevaFecha > fechaRegreso) {
                    setFechaRegreso("");
                  }
                }}
                variant="outlined"
                size="small"
                className="bg-white rounded-lg"
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}
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
                  color: fechaIda ? '#000' : 'rgba(0, 0, 0, 0.6)',
                  fontSize: '0.875rem',
                }}
              >
                {formatDateForDisplay(fechaIda)}
              </Box>
            </Box>
          </Box>

          {/* Fecha de Regreso (solo si es ida y vuelta) */}
          {tipoViajeDestino === "ida-vuelta" && (
            <Box className={isMobile ? "w-full" : "flex-1"}>
              <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
                FECHA DE REGRESO
              </Typography>
              <Box sx={{ position: 'relative' }}>
                <TextField
                  fullWidth
                  type="date"
                  value={fechaRegreso}
                  onChange={(e) => setFechaRegreso(e.target.value)}
                  variant="outlined"
                  size="small"
                  className="bg-white rounded-lg"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: fechaIda || new Date().toISOString().split('T')[0]
                  }}
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
                    color: fechaRegreso ? '#000' : 'rgba(0, 0, 0, 0.6)',
                    fontSize: '0.875rem',
                  }}
                >
                  {formatDateForDisplay(fechaRegreso)}
                </Box>
              </Box>
            </Box>
          )}

          {/* Seleccionar pasajeros */}
          <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              PASAJEROS
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
              startIcon={<PersonIcon fontSize="small" color="action" />}
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

      {/* Popover para selector de pasajeros */}
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