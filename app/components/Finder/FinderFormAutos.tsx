import { useState } from "react";
import Box from "@mui/material/Box";
import { 
  Button, 
  Stack, 
  Typography, 
  TextField, 
  InputAdornment, 
  useMediaQuery,
  Checkbox,
  FormControlLabel,
  Paper
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationOffIcon from "@mui/icons-material/LocationOff";

interface FinderFormProps {
  tipoViaje: string;
  onBuscar?: () => void;
}

export default function FinderFormRentaAutos({ tipoViaje, onBuscar }: FinderFormProps) {
  const isMobile = useMediaQuery('(max-width:900px)');
  
  const [mismaOficina, setMismaOficina] = useState(false);
  const [conductor30_65, setConductor30_65] = useState(false);
  const [origen, setOrigen] = useState("");
  const [devolucion, setDevolucion] = useState("");
  const [fechaRecogida, setFechaRecogida] = useState("");
  const [horaRecogida, setHoraRecogida] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [horaEntrega, setHoraEntrega] = useState("");

  const handleBuscar = () => {
    console.log('Búsqueda de renta de autos realizada:', { 
      mismaOficina,
      conductor30_65,
      origen,
      devolucion,
      fechaRecogida,
      horaRecogida,
      fechaEntrega,
      horaEntrega
    });
    if (onBuscar) {
      onBuscar();
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "Fecha";
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatTimeForDisplay = (timeString: string) => {
    if (!timeString) return "Hora";
    return timeString;
  };

  const validateHoraEntrega = (nuevaHora: string) => {
    if (fechaRecogida === fechaEntrega && horaRecogida && nuevaHora < horaRecogida) {
      return horaRecogida;
    }
    return nuevaHora;
  };

  return (
    <Box className="flex flex-col items-center w-full">
      <Box className="mb-4 w-full max-w-6xl">
        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={isMobile ? 1 : 1.5} 
          className="w-full justify-start"
          alignItems={isMobile ? "flex-start" : "center"}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={mismaOficina}
                onChange={(e) => {
                  setMismaOficina(e.target.checked);
                  if (e.target.checked) {
                    setDevolucion(origen);
                  }
                }}
                size="small"
                className="text-orange-500"
                sx={{
                  '&.Mui-checked': {
                    color: 'rgb(249 115 22)',
                  },
                  padding: '1px 2px',
                  '& .MuiSvgIcon-root': {
                    fontSize: '16px',
                  }
                }}
              />
            }
            label={
              <Typography className="text-white font-semibold whitespace-nowrap"
                sx={{ fontSize: '0.85rem' }}
              >
                Misma oficina de devolución
              </Typography>
            }
            sx={{ marginRight: '12px' }}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={conductor30_65}
                onChange={(e) => setConductor30_65(e.target.checked)}
                size="small"
                className="text-orange-500"
                sx={{
                  '&.Mui-checked': {
                    color: 'rgb(249 115 22)',
                  },
                  padding: '1px 2px',
                  '& .MuiSvgIcon-root': {
                    fontSize: '16px',
                  }
                }}
              />
            }
            label={
              <Typography className="text-white font-semibold whitespace-nowrap"
                sx={{ fontSize: '0.85rem' }}
              >
                Conductor entre 30 y 65 años
              </Typography>
            }
          />
        </Stack>
      </Box>

      <Stack 
        direction={isMobile ? "column" : "row"} 
        spacing={isMobile ? 2 : 1.5} 
        alignItems="flex-start" 
        className="w-full max-w-6xl"
      >
        <Box className={isMobile ? "w-full" : "flex-[1.8]"} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Typography 
              className="text-white font-bold uppercase tracking-wide"
              sx={{ fontSize: '0.75rem' }}
            >
              Origen y Devolución
            </Typography>
          </Box>
          
          <Paper 
            className="rounded-xl border border-gray-200 shadow-sm relative min-h-[50px] w-full"
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
          >
            <Box className="p-2">
              <Stack direction="row" className="h-full" spacing={0} alignItems="center">
                <Box className="flex-1 pr-2">
                  <TextField
                    fullWidth
                    value={origen}
                    onChange={(e) => {
                      console.log('Origen cambiado:', e.target.value);
                      setOrigen(e.target.value);
                      if (mismaOficina) {
                        setDevolucion(e.target.value);
                      }
                    }}
                    placeholder="Ciudad o aeropuerto"
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon sx={{ fontSize: '18px' }} color="action" />
                        </InputAdornment>
                      ),
                    }}
                    className="bg-white rounded-lg"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                          borderColor: 'transparent',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'transparent',
                        },
                        height: '40px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '10.5px 14px',
                      }
                    }}
                  />
                </Box>
                
                <Box className="absolute left-1/2 top-1/4 bottom-1/4 w-px bg-gray-300 transform -translate-x-1/2"></Box>
                
                <Box className="flex-1 pl-2">
                  <TextField
                    fullWidth
                    value={devolucion}
                    onChange={(e) => {
                      console.log('Devolución cambiada:', e.target.value);
                      setDevolucion(e.target.value);
                    }}
                    placeholder="Ciudad o aeropuerto"
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOffIcon sx={{ fontSize: '18px' }} color="action" />
                        </InputAdornment>
                      ),
                    }}
                    className="bg-white rounded-lg"
                    disabled={mismaOficina}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                          borderColor: 'transparent',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'transparent',
                        },
                        height: '40px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '10.5px 14px',
                      },
                      '& .MuiInputBase-root.Mui-disabled': {
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      }
                    }}
                  />
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Box>

        <Box className={isMobile ? "w-full mt-3" : "flex-[0.7]"} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Typography 
              className="text-white font-bold uppercase tracking-wide"
              sx={{ fontSize: '0.75rem' }}
            >
              Recogida - Fecha y Hora
            </Typography>
          </Box>
          
          <Paper 
            className="rounded-xl border border-gray-200 shadow-sm min-h-[50px] w-full"
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
          >
            <Box className="p-2">
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ height: '40px' }}>
                <Box sx={{ position: 'relative', width: '52%' }}>
                  <TextField
                    fullWidth
                    type="date"
                    value={fechaRecogida}
                    onChange={(e) => {
                      console.log('Fecha recogida seleccionada:', e.target.value);
                      const nuevaFecha = e.target.value;
                      setFechaRecogida(nuevaFecha);
                      if (fechaEntrega && nuevaFecha > fechaEntrega) {
                        setFechaEntrega("");
                        setHoraEntrega("");
                      }
                      if (nuevaFecha === fechaEntrega && horaRecogida && horaEntrega && horaEntrega < horaRecogida) {
                        setHoraEntrega(horaRecogida);
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
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                          borderColor: 'transparent',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'transparent',
                        },
                        minWidth: '100px',
                        maxWidth: '120px',
                        height: '40px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '10.5px 8px',
                        paddingLeft: '34px',
                      },
                      '& input[type="date"]': {
                        position: 'relative',
                        zIndex: 2,
                        color: 'transparent',
                        caretColor: '#000',
                        fontSize: '0.85rem',
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
                        <InputAdornment position="start" sx={{ marginRight: '6px' }}>
                          <CalendarTodayIcon sx={{ fontSize: '16px' }} color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '34px',
                      transform: 'translateY(-50%)',
                      zIndex: 1,
                      pointerEvents: 'none',
                      color: fechaRecogida ? '#000' : 'rgba(0, 0, 0, 0.6)',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: 'calc(100% - 40px)',
                      maxWidth: '90px',
                    }}
                  >
                    {formatDateForDisplay(fechaRecogida)}
                  </Box>
                </Box>
                
                <Box sx={{ position: 'relative', width: '48%' }}>
                  <TextField
                    fullWidth
                    type="time"
                    value={horaRecogida}
                    onChange={(e) => {
                      console.log('Hora recogida seleccionada:', e.target.value);
                      const nuevaHora = e.target.value;
                      setHoraRecogida(nuevaHora);
                      if (fechaRecogida === fechaEntrega && horaEntrega && nuevaHora > horaEntrega) {
                        setHoraEntrega(nuevaHora);
                      }
                    }}
                    variant="outlined"
                    size="small"
                    className="bg-white rounded-lg"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                          borderColor: 'transparent',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'transparent',
                        },
                        minWidth: '90px',
                        maxWidth: '110px',
                        height: '40px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '10.5px 8px',
                        paddingLeft: '34px',
                        fontSize: '0.85rem',
                      },
                      '& input[type="time"]': {
                        position: 'relative',
                        zIndex: 2,
                        color: 'transparent',
                        caretColor: '#000',
                        fontSize: '0.85rem',
                        padding: 0,
                        margin: 0,
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
                          margin: 0,
                          padding: 0,
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
                        <InputAdornment position="start" sx={{ marginRight: '6px' }}>
                          <AccessTimeIcon sx={{ fontSize: '16px' }} color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '34px',
                      transform: 'translateY(-50%)',
                      zIndex: 1,
                      pointerEvents: 'none',
                      color: horaRecogida ? '#000' : 'rgba(0, 0, 0, 0.6)',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: 'calc(100% - 40px)',
                      maxWidth: '90px',
                    }}
                  >
                    {formatTimeForDisplay(horaRecogida)}
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Box>

        <Box className={isMobile ? "w-full mt-3" : "flex-[0.7]"} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Typography 
              className="text-white font-bold uppercase tracking-wide"
              sx={{ fontSize: '0.75rem' }}
            >
              Entrega - Fecha y Hora
            </Typography>
          </Box>
          
          <Paper 
            className="rounded-xl border border-gray-200 shadow-sm min-h-[50px] w-full"
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
          >
            <Box className="p-2">
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ height: '40px' }}>
                <Box sx={{ position: 'relative', width: '52%' }}>
                  <TextField
                    fullWidth
                    type="date"
                    value={fechaEntrega}
                    onChange={(e) => {
                      console.log('Fecha entrega seleccionada:', e.target.value);
                      const nuevaFecha = e.target.value;
                      setFechaEntrega(nuevaFecha);
                      if (nuevaFecha === fechaRecogida && horaRecogida && horaEntrega && horaEntrega < horaRecogida) {
                        setHoraEntrega(horaRecogida);
                      }
                    }}
                    variant="outlined"
                    size="small"
                    className="bg-white rounded-lg"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: fechaRecogida || new Date().toISOString().split('T')[0]
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                          borderColor: 'transparent',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'transparent',
                        },
                        minWidth: '100px',
                        maxWidth: '120px',
                        height: '40px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '10.5px 8px',
                        paddingLeft: '34px',
                      },
                      '& input[type="date"]': {
                        position: 'relative',
                        zIndex: 2,
                        color: 'transparent',
                        caretColor: '#000',
                        fontSize: '0.85rem',
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
                        <InputAdornment position="start" sx={{ marginRight: '6px' }}>
                          <CalendarTodayIcon sx={{ fontSize: '16px' }} color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '34px',
                      transform: 'translateY(-50%)',
                      zIndex: 1,
                      pointerEvents: 'none',
                      color: fechaEntrega ? '#000' : 'rgba(0, 0, 0, 0.6)',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: 'calc(100% - 40px)',
                      maxWidth: '90px',
                    }}
                  >
                    {formatDateForDisplay(fechaEntrega)}
                  </Box>
                </Box>
                
                <Box sx={{ position: 'relative', width: '48%' }}>
                  <TextField
                    fullWidth
                    type="time"
                    value={horaEntrega}
                    onChange={(e) => {
                      console.log('Hora entrega seleccionada:', e.target.value);
                      const nuevaHora = validateHoraEntrega(e.target.value);
                      setHoraEntrega(nuevaHora);
                    }}
                    variant="outlined"
                    size="small"
                    className="bg-white rounded-lg"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: fechaRecogida === fechaEntrega ? horaRecogida || "00:00" : "00:00"
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                          borderColor: 'transparent',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'transparent',
                        },
                        minWidth: '90px',
                        maxWidth: '110px',
                        height: '40px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '10.5px 8px',
                        paddingLeft: '34px',
                        fontSize: '0.85rem',
                      },
                      '& input[type="time"]': {
                        position: 'relative',
                        zIndex: 2,
                        color: 'transparent',
                        caretColor: '#000',
                        fontSize: '0.85rem',
                        padding: 0,
                        margin: 0,
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
                          margin: 0,
                          padding: 0,
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
                        <InputAdornment position="start" sx={{ marginRight: '6px' }}>
                          <AccessTimeIcon sx={{ fontSize: '16px' }} color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '34px',
                      transform: 'translateY(-50%)',
                      zIndex: 1,
                      pointerEvents: 'none',
                      color: horaEntrega ? '#000' : 'rgba(0, 0, 0, 0.6)',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: 'calc(100% - 40px)',
                      maxWidth: '90px',
                    }}
                  >
                    {formatTimeForDisplay(horaEntrega)}
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Box>
        
        <Box className={isMobile ? "w-full mt-3" : ""} sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'flex-end',
          minWidth: isMobile ? '100%' : '120px'
        }}>
          <Box sx={{ mb: 1, height: '21px' }}></Box>
          
          <Button
            variant="contained"
            className={`
              bg-white hover:bg-gray-100 text-blue-900 border-2 border-blue-900 
              ${isMobile ? "w-full py-2" : "px-4 py-2"} 
              rounded-full min-w-0 font-bold h-auto shadow-md
            `}
            startIcon={<SearchIcon className="text-orange-500" sx={{ fontSize: '20px' }} />}
            onClick={handleBuscar}
            size="medium"
            sx={{
              fontSize: '0.85rem',
              minHeight: '40px',
              height: '40px',
              width: isMobile ? '100%' : 'auto',
              minWidth: isMobile ? '100%' : '120px',
            }}
          >
            <Typography className="font-bold text-blue-900" sx={{ fontSize: '0.85rem' }}>
              BUSCAR
            </Typography>
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}