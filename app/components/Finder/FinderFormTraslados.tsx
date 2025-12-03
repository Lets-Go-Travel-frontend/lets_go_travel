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
  FormControlLabel
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People"; 
import SearchIcon from "@mui/icons-material/Search";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

interface FinderFormProps {
  tipoViaje: string;
  onBuscar?: () => void;
}

export default function FinderForm({ tipoViaje, onBuscar }: FinderFormProps) {
  const isMobile = useMediaQuery('(max-width:900px)');

  const [tipoTraslado, setTipoTraslado] = useState("solo-ida");
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fechaLlegada, setFechaLlegada] = useState("");
  const [horaLlegada, setHoraLlegada] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [pasajeros, setPasajeros] = useState(1);

  const handleBuscar = () => {
    console.log('Búsqueda de traslados realizada:', { 
      tipoTraslado,
      origen, 
      destino, 
      fechaLlegada,
      horaLlegada,
      fechaSalida,
      horaSalida,
      pasajeros
    });
    if (onBuscar) {
      onBuscar();
    }
  };

  // Función para formatear la fecha en un placeholder personalizado
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "Seleccionar";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Función para formatear la hora en un placeholder personalizado
  const formatTimeForDisplay = (timeString: string) => {
    if (!timeString) return "Seleccionar";
    return timeString;
  };

  return (
    <Box className="flex flex-col items-center w-full">
      {/* BLOQUE 1: Tipo de Traslado */}
      <Box className="mb-4 w-full max-w-6xl">
        <FormControl component="fieldset">
          <RadioGroup
            row
            value={tipoTraslado}
            onChange={(e) => setTipoTraslado(e.target.value)}
            className="flex flex-wrap gap-3 justify-center"
          >
            <FormControlLabel 
              value="solo-ida" 
              control={
                <Radio 
                  className="text-orange-500"
                  sx={{
                    '&.Mui-checked': {
                      color: 'rgb(249 115 22)',
                    },
                  }}
                />
              } 
              label={
                <Typography className="text-white font-semibold text-sm md:text-base">
                  Solo Ida
                </Typography>
              } 
            />
            <FormControlLabel 
              value="ida-vuelta" 
              control={
                <Radio 
                  className="text-orange-500"
                  sx={{
                    '&.Mui-checked': {
                      color: 'rgb(249 115 22)',
                    },
                  }}
                />
              } 
              label={
                <Typography className="text-white font-semibold text-sm md:text-base">
                  Ida y Vuelta
                </Typography>
              } 
            />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* BLOQUE 2: Origen y Destino */}
      <Box className="mb-4 w-full max-w-6xl">
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
              placeholder="Aeropuerto, hotel, dirección..."
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
              placeholder="Aeropuerto, hotel, dirección..."
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

      {/* BLOQUE 3: Fechas, Horas, Pasajeros y Buscar */}
      <Box className="w-full max-w-6xl">
        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={isMobile ? 2 : 2} 
          alignItems={isMobile ? "stretch" : "flex-end"}
          className="w-full"
          sx={{
            flexWrap: 'nowrap', // Evita que haga wrap
            overflowX: 'visible', // Permite que salga del contenedor
            position: 'relative',
          }}
        >
          {/* Fecha y Hora de Llegada - MÁS COMPACTO */}
          <Box className={isMobile ? "w-full" : ""} sx={{ 
            minWidth: isMobile ? '100%' : '250px', // Ancho mínimo
            flexShrink: 0, // No se reduce
          }}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              LLEGADA - FECHA Y HORA
            </Typography>
            <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
              {/* Fecha de Llegada - CON PADDING */}
              <Box sx={{ position: 'relative', flex: 1, minWidth: '110px' }}>
                <TextField
                  fullWidth
                  type="date"
                  value={fechaLlegada}
                  onChange={(e) => setFechaLlegada(e.target.value)}
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
                      fontSize: '0.8rem',
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
                        left: '8px',
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
                      <InputAdornment position="start" sx={{ pr: 1 }}> {/* ← PADDING AQUÍ */}
                        <CalendarTodayIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                {/* Texto personalizado para mostrar la fecha - AJUSTADO */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '44px', // ← AUMENTADO de 32px a 44px
                    transform: 'translateY(-50%)',
                    zIndex: 1,
                    pointerEvents: 'none',
                    color: fechaLlegada ? '#000' : 'rgba(0, 0, 0, 0.6)',
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: 'calc(100% - 48px)', // ← AJUSTADO
                  }}
                >
                  {formatDateForDisplay(fechaLlegada)}
                </Box>
              </Box>
              
              {/* Hora de Llegada - CON PADDING */}
              <Box sx={{ position: 'relative', flex: 1, minWidth: '100px' }}>
                <TextField
                  fullWidth
                  type="time"
                  value={horaLlegada}
                  onChange={(e) => setHoraLlegada(e.target.value)}
                  variant="outlined"
                  size="small"
                  className="bg-white rounded-lg"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& input[type="time"]': {
                      position: 'relative',
                      zIndex: 2,
                      color: 'transparent',
                      caretColor: '#000',
                      fontSize: '0.8rem',
                      '&:focus': { color: 'transparent' },
                      '&:valid': { color: 'transparent' },
                      '&::-webkit-calendar-picker-indicator': {
                        position: 'absolute',
                        left: '0px',
                        top: '0px',
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                        zIndex: 3,
                        opacity: 0,
                      },
                      '&::-webkit-clear-button': {
                        display: 'none',
                      },
                      '&::-webkit-inner-spin-button': {
                        display: 'none',
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ pr: 1 }}> {/* ← PADDING AQUÍ */}
                        <AccessTimeIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                {/* Texto personalizado para mostrar la hora - AJUSTADO */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '44px', // ← AUMENTADO de 32px a 44px
                    transform: 'translateY(-50%)',
                    zIndex: 1,
                    pointerEvents: 'none',
                    color: horaLlegada ? '#000' : 'rgba(0, 0, 0, 0.6)',
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: 'calc(100% - 48px)', // ← AJUSTADO
                  }}
                >
                  {formatTimeForDisplay(horaLlegada)}
                </Box>
              </Box>
            </Stack>
          </Box>

          {/* Fecha y Hora de Salida (solo si es ida y vuelta) */}
          {tipoTraslado === "ida-vuelta" && (
            <Box className={isMobile ? "w-full mt-3" : ""} sx={{ 
              minWidth: isMobile ? '100%' : '250px', // Mismo ancho mínimo
              flexShrink: 0, // No se reduce
            }}>
              <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
                SALIDA - FECHA Y HORA
              </Typography>
              <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                {/* Fecha de Salida - CON PADDING */}
                <Box sx={{ position: 'relative', flex: 1, minWidth: '110px' }}>
                  <TextField
                    fullWidth
                    type="date"
                    value={fechaSalida}
                    onChange={(e) => setFechaSalida(e.target.value)}
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
                        fontSize: '0.8rem',
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
                          left: '8px',
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
                        <InputAdornment position="start" sx={{ pr: 1 }}> {/* ← PADDING AQUÍ */}
                          <CalendarTodayIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {/* Texto personalizado para mostrar la fecha - AJUSTADO */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '44px', // ← AUMENTADO de 32px a 44px
                      transform: 'translateY(-50%)',
                      zIndex: 1,
                      pointerEvents: 'none',
                      color: fechaSalida ? '#000' : 'rgba(0, 0, 0, 0.6)',
                      fontSize: '0.8rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: 'calc(100% - 48px)', // ← AJUSTADO
                    }}
                  >
                    {formatDateForDisplay(fechaSalida)}
                  </Box>
                </Box>
                
                {/* Hora de Salida - CON PADDING */}
                <Box sx={{ position: 'relative', flex: 1, minWidth: '100px' }}>
                  <TextField
                    fullWidth
                    type="time"
                    value={horaSalida}
                    onChange={(e) => setHoraSalida(e.target.value)}
                    variant="outlined"
                    size="small"
                    className="bg-white rounded-lg"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& input[type="time"]': {
                        position: 'relative',
                        zIndex: 2,
                        color: 'transparent',
                        caretColor: '#000',
                        fontSize: '0.8rem',
                        '&:focus': { color: 'transparent' },
                        '&:valid': { color: 'transparent' },
                        '&::-webkit-calendar-picker-indicator': {
                          position: 'absolute',
                          left: '0px',
                          top: '0px',
                          width: '100%',
                          height: '100%',
                          cursor: 'pointer',
                          zIndex: 3,
                          opacity: 0,
                        },
                        '&::-webkit-clear-button': {
                          display: 'none',
                        },
                        '&::-webkit-inner-spin-button': {
                          display: 'none',
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ pr: 1 }}> {/* ← PADDING AQUÍ */}
                          <AccessTimeIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {/* Texto personalizado para mostrar la hora - AJUSTADO */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '44px', // ← AUMENTADO de 32px a 44px
                      transform: 'translateY(-50%)',
                      zIndex: 1,
                      pointerEvents: 'none',
                      color: horaSalida ? '#000' : 'rgba(0, 0, 0, 0.6)',
                      fontSize: '0.8rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: 'calc(100% - 48px)', // ← AJUSTADO
                    }}
                  >
                    {formatTimeForDisplay(horaSalida)}
                  </Box>
                </Box>
              </Stack>
            </Box>
          )}

          {/* Cantidad de Pasajeros - MÁS COMPACTO */}
          <Box className={isMobile ? "w-full" : ""} sx={{ 
            minWidth: isMobile ? '100%' : '150px',
            flexShrink: 0,
          }}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              HUÉSPEDES
            </Typography>
            <FormControl fullWidth size="small" className="bg-white rounded-lg">
              <Select
                value={pasajeros}
                onChange={(e) => setPasajeros(Number(e.target.value))}
                startAdornment={
                  <InputAdornment position="start">
                    {pasajeros === 1 ? (
                      <PersonIcon fontSize="small" color="action" />
                    ) : (
                      <PeopleIcon fontSize="small" color="action" />
                    )}
                  </InputAdornment>
                }
                className="text-sm"
                sx={{
                  fontSize: '0.8rem',
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <MenuItem key={num} value={num} sx={{ fontSize: '0.8rem' }}>
                    {num} {num === 1 ? 'pasajero' : 'pasajeros'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Botón BUSCAR - FIJO */}
          <Box className={isMobile ? "w-full flex justify-center mt-1" : ""} sx={{ 
            minWidth: isMobile ? '100%' : '140px',
            flexShrink: 0,
          }}>
            <Button
              variant="contained"
              className={`
                bg-white hover:bg-gray-100 text-blue-900 border-2 border-blue-900 
                ${isMobile ? "w-full max-w-xs py-2" : "px-4 py-2"} 
                rounded-full min-w-0 font-bold h-auto shadow-md
              `}
              startIcon={<SearchIcon className="text-orange-500" sx={{ fontSize: '20px' }} />}
              onClick={handleBuscar}
              size={isMobile ? "large" : "medium"}
              sx={{
                fontSize: '0.8rem',
                minHeight: '40px',
                whiteSpace: 'nowrap',
              }}
            >
              <Typography className="font-bold text-blue-900" sx={{ fontSize: '0.8rem' }}>
                BUSCAR
              </Typography>
            </Button>
          </Box>
        </Stack>
        
        {/* Contenedor para scroll en móvil cuando hay muchos campos */}
        {tipoTraslado === "ida-vuelta" && !isMobile && (
          <Box sx={{ 
            width: '100%', 
            overflowX: 'auto',
            mt: 1,
            pb: 1,
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '3px',
            }
          }}>
            <Box sx={{ height: '6px' }}></Box> {/* Espacio para el scroll */}
          </Box>
        )}
      </Box>
    </Box>
  );
}