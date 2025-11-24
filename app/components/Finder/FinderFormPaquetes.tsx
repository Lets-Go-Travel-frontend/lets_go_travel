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
import HotelIcon from "@mui/icons-material/Hotel";

interface FinderFormProps {
  tipoViaje: string;
  onBuscar?: () => void;
}

export default function FinderForm({ tipoViaje, onBuscar }: FinderFormProps) {
  const isMobile = useMediaQuery('(max-width:900px)');
  
  const [destino, setDestino] = useState("");
  const [fecha, setFecha] = useState("");
  const [noches, setNoches] = useState(7);

  const handleBuscar = () => {
    console.log('Búsqueda de paquetes realizada:', { 
      destino, 
      fecha,
      noches
    });
    if (onBuscar) {
      onBuscar();
    }
  };

  return (
    <Box className="flex flex-col items-center w-full">
      {/* FORMULARIO COMPACTO PARA PAQUETES */}
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
              PAÍSES O DESTINOS
            </Typography>
            <TextField
              fullWidth
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              placeholder="Seleccione países o destinos..."
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

          {/* Fecha */}
          <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              CUÁNDO
            </Typography>
            <TextField
              fullWidth
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
              className="bg-white rounded-lg"
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          {/* Número de Noches */}
          <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
              NÚMERO DE NOCHES
            </Typography>
            <FormControl fullWidth size="small" className="bg-white rounded-lg">
              <InputLabel className="text-xs">Noches</InputLabel>
              <Select
                value={noches}
                label="Noches"
                onChange={(e) => setNoches(Number(e.target.value))}
                startAdornment={
                  <InputAdornment position="start">
                    <HotelIcon fontSize="small" color="action" />
                  </InputAdornment>
                }
                className="text-sm"
              >
                <MenuItem value={3}>3 noches</MenuItem>
                <MenuItem value={4}>4 noches</MenuItem>
                <MenuItem value={5}>5 noches</MenuItem>
                <MenuItem value={6}>6 noches</MenuItem>
                <MenuItem value={7}>7 noches</MenuItem>
                <MenuItem value={8}>8 noches</MenuItem>
                <MenuItem value={9}>9 noches</MenuItem>
                <MenuItem value={10}>10 noches</MenuItem>
                <MenuItem value={11}>11 noches</MenuItem>
                <MenuItem value={12}>12 noches</MenuItem>
                <MenuItem value={13}>13 noches</MenuItem>
                <MenuItem value={14}>14 noches</MenuItem>
                <MenuItem value={15}>15 noches</MenuItem>
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