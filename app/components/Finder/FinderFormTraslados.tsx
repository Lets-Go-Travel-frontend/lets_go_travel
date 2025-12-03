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
import PeopleIcon from "@mui/icons-material/People"; // Nuevo ícono para múltiples personas
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
        >
        {/* Fecha y Hora de Llegada */}
        <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
            LLEGADA - FECHA Y HORA
            </Typography>
            <Stack direction="row" spacing={1}>
            <Box sx={{ position: 'relative', flex: 1 }}>
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
                    color: fechaLlegada ? '#000' : 'rgba(0, 0, 0, 0.6)',
                    fontSize: '0.875rem',
                }}
                >
                {formatDateForDisplay(fechaLlegada)}
                </Box>
            </Box>
            <TextField
                fullWidth
                type="time"
                value={horaLlegada}
                onChange={(e) => setHoraLlegada(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    <AccessTimeIcon fontSize="small" color="action" />
                    </InputAdornment>
                ),
                }}
                className="bg-white rounded-lg"
                InputLabelProps={{ shrink: true }}
            />
            </Stack>
        </Box>

        {/* Fecha y Hora de Salida (solo si es ida y vuelta) */}
        {tipoTraslado === "ida-vuelta" && (
            <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
                SALIDA - FECHA Y HORA
            </Typography>
            <Stack direction="row" spacing={1}>
                <Box sx={{ position: 'relative', flex: 1 }}>
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
                    color: fechaSalida ? '#000' : 'rgba(0, 0, 0, 0.6)',
                    fontSize: '0.875rem',
                    }}
                >
                    {formatDateForDisplay(fechaSalida)}
                </Box>
                </Box>
                <TextField
                fullWidth
                type="time"
                value={horaSalida}
                onChange={(e) => setHoraSalida(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <AccessTimeIcon fontSize="small" color="action" />
                    </InputAdornment>
                    ),
                }}
                className="bg-white rounded-lg"
                InputLabelProps={{ shrink: true }}
                />
            </Stack>
            </Box>
        )}

        {/* Cantidad de Pasajeros */}
        <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
            PASAJEROS
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
            >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <MenuItem key={num} value={num}>
                    {num} {num === 1 ? 'pasajero' : 'pasajeros'}
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