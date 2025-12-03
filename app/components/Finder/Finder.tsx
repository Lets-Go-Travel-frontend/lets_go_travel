import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { SyntheticEvent } from "react";
import Image from "next/image";
import FinderForm from "./FinderForm";
import FinderFormTraslados from "./FinderFormTraslados";
import FinderFormAlojamientos from "./FinderFormAlojamientos";
import FinderFormPaquetes from "./FinderFormPaquetes";
import FinderFormExcursiones from "./FinderFormExcursiones";
import FinderFormEventos from "./FinderFormEventos";


import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

import FlightIcon from '@mui/icons-material/Flight';
import HotelIcon from '@mui/icons-material/Hotel';
import FinderFormTransporteHotel from "./FinderFormTransporteHotel"; 


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface FinderProps {
  value: number;
  onChange: (event: SyntheticEvent, newValue: number) => void;
  onBuscar?: () => void;
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

export default function Finder({ value, onChange, onBuscar }: FinderProps) {
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
          {/* <Tab
            label="Ofertas"
            icon={<Image src="/images/icons/icon ofertas.png" width={35} height={35} alt="Ofertas" />}
            iconPosition="top"
            {...a11yProps(0)}
          /> */}
          <Tab
            label="Paquetes"
            icon={<Image src="/images/icons/icon paquetes.png" width={35} height={35} alt="Paquetes" />}
            iconPosition="top"
            {...a11yProps(1)}
          />
          {/* <Tab
            label="Destinos"
            icon={<Image src="/images/icons/icon destinos.png" width={35} height={35} alt="Destinos" />}
            iconPosition="top"
            {...a11yProps(2)}
          /> */}
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
            label="Renta de autos"
            icon={<Image src="/images/icons/icon carros.png" width={42} height={42} alt="Carros" />}
            iconPosition="top"
            {...a11yProps(5)}
          />
          <Tab
            label="Traslados"
            icon={<DirectionsBusIcon sx={{ fontSize: 35 }} />}
            iconPosition="top"
            {...a11yProps(9)}
          />
          {/* <Tab
            label="Vuelos"
            icon={<Image src="/images/icons/icon vuelos.png" width={35} height={35} alt="Vuelos" />}
            iconPosition="top"
            {...a11yProps(6)}
          /> */}
          {/* <Tab
            label="Alquiler"
            icon={<Image src="/images/icons/icon alquileres.png" width={35} height={35} alt="Alquiler" />}
            iconPosition="top"
            {...a11yProps(7)}
          /> */}
          <Tab
            label="Eventos"
            icon={<Image src="/images/icons/icon eventos.png" width={35} height={35} alt="Eventos" />}
            iconPosition="top"
            {...a11yProps(8)}
          />
          <Tab
            label="Transporte+Hotel"
            icon={
              <Box sx={{ position: 'relative', width: 35, height: 35 }}>
                <FlightIcon 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    fontSize: 20,
                    color: '#FFFFFF'
                  }} 
                />
                <HotelIcon 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    right: 0, 
                    fontSize: 20,
                    color: '#FFFFFF'
                  }} 
                />
              </Box>
            }
            iconPosition="top"
            {...a11yProps(10)}
          />
        </Tabs>
      </Box>
      
      {/* <CustomTabPanel value={value} index={0}>
        <FinderForm tipoViaje="ofertas" onBuscar={onBuscar} />
      </CustomTabPanel> */}
     
      <CustomTabPanel value={value} index={0}>
        <FinderFormPaquetes tipoViaje="paquetes" onBuscar={onBuscar} />
      </CustomTabPanel>

      {/* <CustomTabPanel value={value} index={2}>
        <FinderForm tipoViaje="destinos" onBuscar={onBuscar} />
      </CustomTabPanel> */}

      <CustomTabPanel value={value} index={1}>
        <FinderFormExcursiones tipoViaje="excursiones" onBuscar={onBuscar} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <FinderFormAlojamientos tipoViaje="alojamientos" onBuscar={onBuscar} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={3}>
        <FinderForm tipoViaje="carros" onBuscar={onBuscar} />
      </CustomTabPanel>
      

      <CustomTabPanel value={value} index={4}>
        <FinderFormTraslados tipoViaje="traslados" onBuscar={onBuscar} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={5}>
        <FinderFormEventos tipoViaje="eventos" onBuscar={onBuscar} />
      </CustomTabPanel>  
    
      <CustomTabPanel value={value} index={6}> 
        <FinderFormTransporteHotel tipoViaje="transporte-hotel" onBuscar={onBuscar} />
      </CustomTabPanel>

    {/* <CustomTabPanel value={value} index={7}>
        <FinderForm tipoViaje="vuelos" onBuscar={onBuscar} />
      </CustomTabPanel> */}

      {/* <CustomTabPanel value={value} index={8}>
        <FinderForm tipoViaje="alquileres" onBuscar={onBuscar} />
      </CustomTabPanel> */}
      
    </Box>
  );
}