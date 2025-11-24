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
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FlagIcon from "@mui/icons-material/Flag";

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
const [huespedes, setHuespedes] = useState(1);

const handleBuscar = () => {
    console.log('Búsqueda de alojamiento realizada:', { 
    tipoAlojamiento,
    nacionalidad, 
    destino, 
    checkIn,
    checkOut,
    huespedes
    });
    if (onBuscar) {
    onBuscar();
    }
};

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

        {/* Nacionalidad */}
        <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
            NACIONALIDAD
            </Typography>
            <FormControl fullWidth size="small" className="bg-white rounded-lg">
            <InputLabel className="text-xs">Seleccionar</InputLabel>
            <Select
                value={nacionalidad}
                label="Seleccionar"
                onChange={(e) => setNacionalidad(e.target.value)}
                startAdornment={
                <InputAdornment position="start">
                    <FlagIcon fontSize="small" color="action" />
                </InputAdornment>
                }
                className="text-sm"
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
            </Select>
            </FormControl>
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
        {/* Destino */}
        <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
            DESTINO
            </Typography>
            <TextField
            fullWidth
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            placeholder="Ciudad, región o hotel..."
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

        {/* Check-In */}
        <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
            CHECK-IN
            </Typography>
            <TextField
            fullWidth
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
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

        {/* Check-Out */}
        <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
            CHECK-OUT
            </Typography>
            <TextField
            fullWidth
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
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

        {/* Huéspedes */}
        <Box className={isMobile ? "w-full" : "flex-1"}>
            <Typography variant="caption" className="text-white font-bold uppercase tracking-wide text-xs mb-1 block">
            HUÉSPEDES
            </Typography>
            <FormControl fullWidth size="small" className="bg-white rounded-lg">
            <InputLabel className="text-xs">Seleccionar</InputLabel>
            <Select
                value={huespedes}
                onChange={(e) => setHuespedes(Number(e.target.value))}
                startAdornment={
                <InputAdornment position="start">
                    <PersonIcon fontSize="small" color="action" />
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