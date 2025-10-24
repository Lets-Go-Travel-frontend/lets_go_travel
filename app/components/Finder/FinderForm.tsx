import { useState } from "react";
import Box from "@mui/material/Box";
import { 
  Button, 
  Stack, 
  Typography, 
  TextField, 
  InputAdornment, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  Paper,
  useMediaQuery
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BedIcon from "@mui/icons-material/Bed";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import FlightIcon from "@mui/icons-material/Flight";
import HotelIcon from "@mui/icons-material/Hotel";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

interface FinderFormProps {
  tipoViaje: string;
  onBuscar?: () => void;
}

export default function FinderForm({ tipoViaje, onBuscar }: FinderFormProps) {
  const isMobile = useMediaQuery('(max-width:900px)');
  
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fechaIda, setFechaIda] = useState("");
  const [fechaVuelta, setFechaVuelta] = useState("");
  const [habitaciones, setHabitaciones] = useState(1);
  const [personas, setPersonas] = useState(1);
  const [tipoViajeSeleccionado, setTipoViajeSeleccionado] = useState("vuelo-alojamiento");

  const intercambiarOrigenDestino = () => {
    const temp = origen;
    setOrigen(destino);
    setDestino(temp);
  };

  const handleTipoViajeChange = (nuevoTipo: string) => {
    setTipoViajeSeleccionado(nuevoTipo);
  };

  const handleBuscar = () => {
    console.log('Búsqueda realizada:', { 
      origen, 
      destino, 
      fechaIda, 
      fechaVuelta, 
      habitaciones, 
      personas, 
      tipoViaje,
      tipoViajeSeleccionado 
    });
    if (onBuscar) {
      onBuscar();
    }
  };

  const BotonTipoViaje = ({ 
    tipo, 
    icono1, 
    icono2, 
    texto1, 
    texto2, 
    seleccionado 
  }: { 
    tipo: string;
    icono1: React.ReactNode;
    icono2: React.ReactNode;
    texto1: string;
    texto2: string;
    seleccionado: boolean;
  }) => (
    <Button
      variant="outlined"
      onClick={() => handleTipoViajeChange(tipo)}
      className={`
        rounded-full border-2 px-2 py-1 min-w-0 text-xs md:text-sm
        ${seleccionado 
          ? 'border-white bg-white text-blue-900' 
          : 'border-white text-white hover:border-white hover:bg-white hover:text-blue-900'
        }
        transition-all duration-200 group
      `}
      size={isMobile ? "small" : "medium"}
    >
      <Stack direction="row" spacing={0.5} alignItems="center" className="flex-wrap">
        <Box className={`${seleccionado ? "text-blue-900" : "text-white group-hover:text-blue-900"} text-xs md:text-sm`}>
          {icono1}
        </Box>
        <Typography variant="body2" className="font-semibold text-xs whitespace-nowrap">
          {texto1}
        </Typography>
        <Box className={`${seleccionado ? "text-blue-900" : "text-white group-hover:text-blue-900"} text-xs`}>+</Box>
        <Box className={`${seleccionado ? "text-blue-900" : "text-white group-hover:text-blue-900"} text-xs md:text-sm`}>
          {icono2}
        </Box>
        <Typography variant="body2" className="font-semibold text-xs whitespace-nowrap">
          {texto2}
        </Typography>
      </Stack>
    </Button>
  );

  return (
    <Box className="flex flex-col items-center w-full">
      {/* Sección de DESTINOS */}
      <Box className="mb-4 flex flex-col md:flex-row items-center gap-3 justify-center w-full">
        <Typography variant="h6" className="text-white font-bold text-sm md:text-base whitespace-nowrap">
          DESTINOS
        </Typography>
        
        <Stack 
          direction="row" 
          spacing={1} 
          className="flex-wrap justify-center"
          sx={{ maxWidth: '100%' }}
        >
          <BotonTipoViaje
            tipo="vuelo-alojamiento"
            icono1={<FlightIcon fontSize={isMobile ? "small" : "medium"} />}
            icono2={<HotelIcon fontSize={isMobile ? "small" : "medium"} />}
            texto1="Vuelo"
            texto2="Alojamiento"
            seleccionado={tipoViajeSeleccionado === "vuelo-alojamiento"}
          />
          
          <BotonTipoViaje
            tipo="vuelo-2alojamientos"
            icono1={<FlightIcon fontSize={isMobile ? "small" : "medium"} />}
            icono2={<HotelIcon fontSize={isMobile ? "small" : "medium"} />}
            texto1="Vuelo"
            texto2="2 Alojamientos"
            seleccionado={tipoViajeSeleccionado === "vuelo-2alojamientos"}
          />
          
          <BotonTipoViaje
            tipo="vuelo-carro"
            icono1={<FlightIcon fontSize={isMobile ? "small" : "medium"} />}
            icono2={<DirectionsCarIcon fontSize={isMobile ? "small" : "medium"} />}
            texto1="Vuelo"
            texto2="Carro"
            seleccionado={tipoViajeSeleccionado === "vuelo-carro"}
          />
        </Stack>
      </Box>

      {/* Formulario principal - Stack vertical en móvil manteniendo pares */}
      <Stack 
        direction={isMobile ? "column" : "row"} 
        spacing={isMobile ? 2 : 2} 
        alignItems="flex-start" 
        className="w-full max-w-6xl"
      >
        {/* PAR 1: Origen/Destino */}
        <Paper className={`${isMobile ? "w-full" : "flex-1"} rounded-xl border border-gray-200 shadow-sm relative min-h-[70px]`}>
          <Box className="p-2">
            <Stack direction="row" className="h-full" spacing={0}>
              {/* Origen */}
              <Box className="flex-1 pr-2 relative">
                <Typography variant="caption" className="text-gray-500 font-bold uppercase tracking-wide text-xs">
                  ORIGEN
                </Typography>
                <TextField
                  fullWidth
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value)}
                  placeholder="¿Desde dónde?"
                  variant="standard"
                  size="small"
                  InputProps={{ disableUnderline: true }}
                  className="bg-gray-50 rounded-lg px-2 py-1 mt-1"
                />
              </Box>
              
              {/* Botón intercambiar - posición centrada */}
              <Box className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <Button
                  variant="outlined"
                  onClick={intercambiarOrigenDestino}
                  className="min-w-0 p-1 bg-white border-2 border-gray-300 rounded-lg hover:bg-orange-500 hover:border-orange-500 hover:text-white shadow-md"
                  size="small"
                >
                  <SwapHorizIcon fontSize="small" className="text-gray-600 hover:text-white" />
                </Button>
              </Box>
              
              {/* Destino */}
              <Box className="flex-1 pl-2 relative">
                <Typography variant="caption" className="text-gray-500 font-bold uppercase tracking-wide text-xs">
                  DESTINO
                </Typography>
                <TextField
                  fullWidth
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  placeholder="¿Hacia dónde?"
                  variant="standard"
                  size="small"
                  InputProps={{ disableUnderline: true }}
                  className="bg-gray-50 rounded-lg px-2 py-1 mt-1"
                />
              </Box>
            </Stack>
          </Box>
        </Paper>

        {/* PAR 2: Fechas Ida/Vuelta */}
        <Paper className={`${isMobile ? "w-full" : "flex-1"} rounded-xl border border-gray-200 shadow-sm relative min-h-[70px]`}>
          <Box className="p-2">
            <Stack direction="row" className="h-full" spacing={0}>
              {/* Fecha Ida */}
              <Box className="flex-1 pr-2">
                <Typography variant="caption" className="text-gray-500 font-bold uppercase tracking-wide text-xs">
                  IDA
                </Typography>
                <TextField
                  fullWidth
                  value={fechaIda}
                  onChange={(e) => setFechaIda(e.target.value)}
                  placeholder="Ida"
                  variant="standard"
                  size="small"
                  InputProps={{ 
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                  className="bg-gray-50 rounded-lg px-2 py-1 mt-1"
                />
              </Box>
              
              {/* Separador visual */}
              <Box className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-1/2"></Box>
              
              {/* Fecha Vuelta */}
              <Box className="flex-1 pl-2">
                <Typography variant="caption" className="text-gray-500 font-bold uppercase tracking-wide text-xs">
                  VUELTA
                </Typography>
                <TextField
                  fullWidth
                  value={fechaVuelta}
                  onChange={(e) => setFechaVuelta(e.target.value)}
                  placeholder="Vuelta"
                  variant="standard"
                  size="small"
                  InputProps={{ 
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                  className="bg-gray-50 rounded-lg px-2 py-1 mt-1"
                />
              </Box>
            </Stack>
          </Box>
        </Paper>

        {/* PAR 3: Habitaciones/Personas */}
        <Paper className={`${isMobile ? "w-full" : "flex-1"} rounded-xl border border-gray-200 shadow-sm min-h-[70px]`}>
          <Box className="p-2">
            <Typography variant="caption" className="text-gray-500 font-bold uppercase tracking-wide text-xs">
              HUÉSPEDES
            </Typography>
            
            <Stack direction="row" spacing={1} className="items-center mt-1">
              <FormControl fullWidth size="small" className="bg-gray-50 rounded-lg">
                <InputLabel className="text-xs">Habitaciones</InputLabel>
                <Select
                  value={habitaciones}
                  label="Habitaciones"
                  onChange={(e) => setHabitaciones(Number(e.target.value))}
                  startAdornment={
                    <InputAdornment position="start">
                      <BedIcon fontSize="small" color="action" />
                    </InputAdornment>
                  }
                  className="text-sm"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" className="bg-gray-50 rounded-lg">
                <InputLabel className="text-xs">Personas</InputLabel>
                <Select
                  value={personas}
                  label="Personas"
                  onChange={(e) => setPersonas(Number(e.target.value))}
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" color="action" />
                    </InputAdornment>
                  }
                  className="text-sm"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Box>
        </Paper>
        
        {/* Botón BUSCAR - posición responsive */}
        <Box className={`${isMobile ? "w-full flex justify-center" : "flex items-end"}`}>
          <Button
            variant="contained"
            className={`
              bg-white hover:bg-gray-100 text-blue-900 border-2 border-blue-900 
              ${isMobile ? "w-full max-w-xs py-3" : "px-6 py-2"} 
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
  );
}