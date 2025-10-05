import { useState } from "react";
import Box from "@mui/material/Box";
import { Button, Stack, Typography, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Paper } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BedIcon from "@mui/icons-material/Bed";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";

interface FinderFormProps {
  tipoViaje: string;
}

export default function FinderForm({ tipoViaje }: FinderFormProps) {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fechaIda, setFechaIda] = useState("");
  const [fechaVuelta, setFechaVuelta] = useState("");
  const [habitaciones, setHabitaciones] = useState(1);
  const [personas, setPersonas] = useState(1);

  const intercambiarOrigenDestino = () => {
    const temp = origen;
    setOrigen(destino);
    setDestino(temp);
  };

  return (
      <Stack direction="row" spacing={2} alignItems="flex-start" className="w-full max-w-6xl">
        
        <Paper className="flex-1 rounded-xl border border-gray-200 shadow-sm relative min-h-[70px]">
          <Box className="p-1">
            <Stack direction="row" className="h-full">
              <Box className="flex-1 pr-8">
                <Typography variant="caption" className="text-gray-500 font-bold uppercase tracking-wide pl-3 text-xs">
                  ORIGEN
                </Typography>
              </Box>
              <Box className="flex-1 pl-8">
                <Typography variant="caption" className="text-gray-500 font-bold uppercase tracking-wide text-xs">
                  DESTINO
                </Typography>
              </Box>
            </Stack>
          </Box>
          
          <Box className="p-1">
            <Stack direction="row" className="items-center">
              <Box className="flex-1 pr-8">
                <TextField
                  fullWidth
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value)}
                  placeholder="¿Desde dónde?"
                  variant="standard"
                  size="small"
                  InputProps={{ disableUnderline: true }}
                  className="bg-gray-50 rounded-lg px-2 py-1"
                />
              </Box>
              
              <Box className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-1/2"></Box>
              
              <Box className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <Button
                  variant="outlined"
                  onClick={intercambiarOrigenDestino}
                  className="min-w-0 p-1 bg-white border-2 border-gray-300 rounded-lg hover:bg-orange-500 hover:border-orange-500 hover:text-white shadow-md"
                >
                  <SwapHorizIcon fontSize="small" className="text-gray-600 hover:text-white" />
                </Button>
              </Box>
              
              <Box className="flex-1 pl-8">
                <TextField
                  fullWidth
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  placeholder="¿Hacia dónde?"
                  variant="standard"
                  size="small"
                  InputProps={{ disableUnderline: true }}
                  className="bg-gray-50 rounded-lg px-2 py-1"
                />
              </Box>
            </Stack>
          </Box>
        </Paper>

        <Paper className="flex-1 rounded-xl border border-gray-200 shadow-sm relative min-h-[70px]">
          <Box className="p-1">
            <Stack direction="row" className="h-full">
              <Box className="flex-1 pr-8">
                <Typography variant="caption" className="text-gray-500 font-bold uppercase tracking-wide pl-3 text-xs">
                  IDA
                </Typography>
              </Box>
              <Box className="flex-1 pl-8">
                <Typography variant="caption" className="text-gray-500 font-bold uppercase tracking-wide text-xs">
                  VUELTA
                </Typography>
              </Box>
            </Stack>
          </Box>
          
          <Box className="p-1">
            <Stack direction="row" className="items-center">
              <Box className="flex-1 pr-8">
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
                  className="bg-gray-50 rounded-lg px-2 py-1"
                />
              </Box>
              
              <Box className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-1/2"></Box>
              
              <Box className="flex-1 pl-8">
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
                  className="bg-gray-50 rounded-lg px-2 py-1"
                />
              </Box>
            </Stack>
          </Box>
        </Paper>

        <Paper className="flex-1 rounded-xl border border-gray-200 shadow-sm min-h-[70px]">
          <Box className="p-1">
            <Typography variant="caption" className="text-gray-500 font-bold uppercase tracking-wide pl-3 text-xs">
              HUÉSPEDES
            </Typography>
          </Box>
          
          <Box className="p-1">
            <Stack direction="row" spacing={1} className="items-center">
              <FormControl fullWidth size="small" className="bg-gray-50 rounded-lg">
                <InputLabel className="my-0">Habitaciones</InputLabel>
                <Select
                  value={habitaciones}
                  label="Habitaciones"
                  onChange={(e) => setHabitaciones(Number(e.target.value))}
                  startAdornment={
                    <InputAdornment position="start">
                      <BedIcon fontSize="small" color="action" />
                    </InputAdornment>
                  }
                  className="my-0"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" className="bg-gray-50 rounded-lg">
                <InputLabel className="my-0">Personas</InputLabel>
                <Select
                  value={personas}
                  label="Personas"
                  onChange={(e) => setPersonas(Number(e.target.value))}
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" color="action" />
                    </InputAdornment>
                  }
                  className="my-0"
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

        <Button
          variant="contained"
          className="bg-white hover:bg-gray-100 text-blue-900 border-2 border-blue-900 px-8 py-2 rounded-full min-w-0 font-bold h-auto shadow-md"
          startIcon={<SearchIcon className="text-orange-500 text-3xl" />}
        >
          <Typography variant="h6" className="font-bold text-blue-900">
            BUSCAR
          </Typography>
        </Button>
      </Stack>
  );
}