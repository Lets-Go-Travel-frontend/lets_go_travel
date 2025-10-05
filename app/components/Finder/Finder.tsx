import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { SyntheticEvent, useState } from "react";
import Image from "next/image";
import { Button, Stack, Typography } from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import HotelIcon from "@mui/icons-material/Hotel";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import FinderForm from "./FinderForm";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface FinderProps {
  value: number;
  onChange: (event: SyntheticEvent, newValue: number) => void;
}

const tabStyle = {
  textTransform: "none",
  fontSize: "1rem",
  color: "#FFFFFF",
  fontWeight: 700,
  "&.Mui-selected": {
    color: "#FFFFFF",
    backgroundColor: "rgb(249 115 22)",
    borderRadius: "1rem",
    padding: "0",
  },
};

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
    sx: { ...tabStyle },
  };
}

export default function Finder({ value, onChange }: FinderProps) {
  const [tipoViaje, setTipoViaje] = useState("vuelo-alojamiento");

  const handleTipoViajeChange = (nuevoTipo: string) => {
    setTipoViaje(nuevoTipo);
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
        rounded-full border-2 px-3 py-1 min-w-0 text-sm
        ${seleccionado 
          ? 'border-white bg-white text-blue-900' 
          : 'border-white text-white hover:border-white hover:bg-white hover:text-blue-900'
        }
        transition-all duration-200 group
      `}
    >
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Box className={`${seleccionado ? "text-blue-900" : "text-white group-hover:text-blue-900"}`}>{icono1}</Box>
        <Typography variant="body2" className="font-semibold text-xs">{texto1}</Typography>
        <Box className={`${seleccionado ? "text-blue-900" : "text-white group-hover:text-blue-900"}`}>+</Box>
        <Box className={`${seleccionado ? "text-blue-900" : "text-white group-hover:text-blue-900"}`}>{icono2}</Box>
        <Typography variant="body2" className="font-semibold text-xs">{texto2}</Typography>
      </Stack>
    </Button>
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 2, borderColor: "white" }}>
        <Tabs
          value={value}
          variant="scrollable"
          scrollButtons
          onChange={onChange}
          aria-label="visible arrows tabs example"
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              "&.Mui-disabled": { opacity: 0.3 },
            },
          }}
        >
          <Tab
            label="Ofertas"
            icon={<Image src="/images/icons/icon ofertas.png" width={35} height={35} alt="Ofertas" />}
            iconPosition="top"
            {...a11yProps(0)}
          />
          <Tab
            label="Paquetes"
            icon={<Image src="/images/icons/icon paquetes.png" width={35} height={35} alt="Paquetes" />}
            iconPosition="top"
            {...a11yProps(1)}
          />
          <Tab
            label="Destinos"
            icon={<Image src="/images/icons/icon destinos.png" width={35} height={35} alt="Destinos" />}
            iconPosition="top"
            {...a11yProps(2)}
          />
          <Tab
            label="Excursiones"
            icon={<Image src="/images/icons/icon excursiones.png" width={35} height={35} alt="Excursiones" />}
            iconPosition="top"
            {...a11yProps(3)}
          />
          <Tab
            label="Alojamientos"
            icon={<Image src="/images/icons/icon alojamiento.png" width={35} height={35} alt="Alojamientos" />}
            iconPosition="top"
            {...a11yProps(4)}
          />
          <Tab
            label="Carros"
            icon={<Image src="/images/icons/icon carros.png" width={42} height={42} alt="Carros" />}
            iconPosition="top"
            {...a11yProps(5)}
          />
          <Tab
            label="Vuelos"
            icon={<Image src="/images/icons/icon vuelos.png" width={35} height={35} alt="Vuelos" />}
            iconPosition="top"
            {...a11yProps(6)}
          />
          <Tab
            label="Alquiler"
            icon={<Image src="/images/icons/icon alquileres.png" width={35} height={35} alt="Alquiler" />}
            iconPosition="top"
            {...a11yProps(7)}
          />
          <Tab
            label="Eventos"
            icon={<Image src="/images/icons/icon eventos.png" width={35} height={35} alt="Eventos" />}
            iconPosition="top"
            {...a11yProps(8)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Box className="flex flex-col items-center">
          <Box className="mb-4 flex items-center gap-3 justify-center w-full">
            <Typography variant="h6" className="text-white font-bold text-sm">
              DESTINOS
            </Typography>
            
            <Stack direction="row" spacing={1} className="flex-wrap">
              <BotonTipoViaje
                tipo="vuelo-alojamiento"
                icono1={<FlightIcon fontSize="small" />}
                icono2={<HotelIcon fontSize="small" />}
                texto1="Vuelo"
                texto2="Alojamiento"
                seleccionado={tipoViaje === "vuelo-alojamiento"}
              />
              
              <BotonTipoViaje
                tipo="vuelo-2alojamientos"
                icono1={<FlightIcon fontSize="small" />}
                icono2={<HotelIcon fontSize="small" />}
                texto1="Vuelo"
                texto2="2 Alojamientos"
                seleccionado={tipoViaje === "vuelo-2alojamientos"}
              />
              
              <BotonTipoViaje
                tipo="vuelo-carro"
                icono1={<FlightIcon fontSize="small" />}
                icono2={<DirectionsCarIcon fontSize="small" />}
                texto1="Vuelo"
                texto2="Carro"
                seleccionado={tipoViaje === "vuelo-carro"}
              />
            </Stack>
          </Box>

          <FinderForm tipoViaje={tipoViaje} />

        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  );
}