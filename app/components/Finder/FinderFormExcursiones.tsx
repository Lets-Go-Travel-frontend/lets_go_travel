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
  useMediaQuery
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People"; // Nuevo ícono para múltiples personas

interface FinderFormProps {
  tipoViaje: string;
  onBuscar?: () => void;
}

export default function FinderForm({ tipoViaje, onBuscar }: FinderFormProps) {
  const isMobile = useMediaQuery('(max-width:900px)');
  
  const [destino, setDestino] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaTermino, setFechaTermino] = useState("");
  const [huespedes, setHuespedes] = useState(1);

  const handleBuscar = () => {
    console.log('Búsqueda realizada:', { 
      destino, 
      fechaInicio,
      fechaTermino,
      huespedes
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

  return (
    <Box className="flex flex-col items-center w-full">
      {/* FORMULARIO DE UNA SOLA LÍNEA */}
      <Box className="w-full max-w-6xl">
        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={isMobile ? 2 : 2} 
          alignItems={isMobile ? "stretch" : "flex-end"}
          className="w-full"
        >
          {/* Destino */}
          <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              DESTINO
            </Typography>
            <TextField
              fullWidth
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              placeholder="Ingrese destino..."
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
            />
          </Box>

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
                    color: 'transparent', // Oculta el texto nativo
                    caretColor: '#000', // Muestra el cursor
                    '&:focus': {
                      color: 'transparent',
                    },
                    '&:valid': {
                      color: 'transparent',
                    },
                    '&::-webkit-datetime-edit': {
                      color: 'transparent',
                    },
                    '&::-webkit-datetime-edit-fields-wrapper': {
                      color: 'transparent',
                    },
                    '&::-webkit-datetime-edit-text': {
                      color: 'transparent',
                    },
                    '&::-webkit-datetime-edit-month-field': {
                      color: 'transparent',
                    },
                    '&::-webkit-datetime-edit-day-field': {
                      color: 'transparent',
                    },
                    '&::-webkit-datetime-edit-year-field': {
                      color: 'transparent',
                    },
                    '&::-webkit-inner-spin-button': {
                      display: 'none',
                    },
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
              {/* Texto personalizado para mostrar la fecha */}
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

          {/* Fecha de Término */}
          <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              FECHA DE TÉRMINO
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                type="date"
                value={fechaTermino}
                onChange={(e) => setFechaTermino(e.target.value)}
                variant="outlined"
                size="small"
                className="bg-white rounded-lg"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& input[type="date"]': {
                    position: 'relative',
                    zIndex: 2,
                    color: 'transparent', // Oculta el texto nativo
                    caretColor: '#000', // Muestra el cursor
                    '&:focus': {
                      color: 'transparent',
                    },
                    '&:valid': {
                      color: 'transparent',
                    },
                    '&::-webkit-datetime-edit': {
                      color: 'transparent',
                    },
                    '&::-webkit-datetime-edit-fields-wrapper': {
                      color: 'transparent',
                    },
                    '&::-webkit-datetime-edit-text': {
                      color: 'transparent',
                    },
                    '&::-webkit-datetime-edit-month-field': {
                      color: 'transparent',
                    },
                    '&::-webkit-datetime-edit-day-field': {
                      color: 'transparent',
                    },
                    '&::-webkit-datetime-edit-year-field': {
                      color: 'transparent',
                    },
                    '&::-webkit-inner-spin-button': {
                      display: 'none',
                    },
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
              {/* Texto personalizado para mostrar la fecha */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '40px',
                  transform: 'translateY(-50%)',
                  zIndex: 1,
                  pointerEvents: 'none',
                  color: fechaTermino ? '#000' : 'rgba(0, 0, 0, 0.6)',
                  fontSize: '0.875rem',
                }}
              >
                {formatDateForDisplay(fechaTermino)}
              </Box>
            </Box>
          </Box>

          {/* Huéspedes */}
          <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              HUÉSPEDES
            </Typography>
            <FormControl fullWidth size="small" className="bg-white rounded-lg">
              <Select
                value={huespedes}
                onChange={(e) => setHuespedes(Number(e.target.value))}
                startAdornment={
                  <InputAdornment position="start">
                    {huespedes === 1 ? (
                      <PersonIcon fontSize="small" color="action" />
                    ) : (
                      <PeopleIcon fontSize="small" color="action" />
                    )}
                  </InputAdornment>
                }
                className="text-sm"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num} {num === 1 ? 'huésped' : 'huéspedes'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
    </Box>
  );
}