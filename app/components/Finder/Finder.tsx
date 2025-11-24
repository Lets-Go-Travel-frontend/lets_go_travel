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

import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

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
        <FinderForm tipoViaje="ofertas" onBuscar={onBuscar} />
      </CustomTabPanel>
     
      <CustomTabPanel value={value} index={1}>
        <FinderFormPaquetes tipoViaje="paquetes" onBuscar={onBuscar} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <FinderForm tipoViaje="destinos" onBuscar={onBuscar} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={3}>
        <FinderFormExcursiones tipoViaje="excursiones" onBuscar={onBuscar} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={4}>
        <FinderFormAlojamientos tipoViaje="alojamientos" onBuscar={onBuscar} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={5}>
        <FinderForm tipoViaje="carros" onBuscar={onBuscar} />
      </CustomTabPanel>
      

      <CustomTabPanel value={value} index={6}>
        <FinderFormTraslados tipoViaje="traslados" onBuscar={onBuscar} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={7}>
        <FinderForm tipoViaje="vuelos" onBuscar={onBuscar} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={8}>
        <FinderForm tipoViaje="alquileres" onBuscar={onBuscar} />
      </CustomTabPanel>
      
      <CustomTabPanel value={value} index={9}>
        <FinderForm tipoViaje="eventos" onBuscar={onBuscar} />
      </CustomTabPanel>
    
    </Box>
  );
}