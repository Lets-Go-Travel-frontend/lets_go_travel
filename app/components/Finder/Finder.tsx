import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { SyntheticEvent } from "react";
import Image from "next/image";

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
            icon={<Image src="/images/icons/icon ofertas.png" width={50} height={50} alt="" />}
            iconPosition="top"
            {...a11yProps(0)}
          />
          <Tab
            label="Paquetes"
            icon={<Image src="/images/icons/icon paquetes.png" width={50} height={50} alt="" />}
            iconPosition="top"
            {...a11yProps(1)}
          />
          <Tab
            label="Destinos"
            icon={<Image src="/images/icons/icon destinos.png" width={50} height={50} alt="" />}
            iconPosition="top"
            {...a11yProps(2)}
          />
          <Tab
            label="Excursiones"
            icon={<Image src="/images/icons/icon excursiones.png" width={50} height={50} alt="" />}
            iconPosition="top"
            {...a11yProps(3)}
          />
          <Tab
            label="Alojamientos"
            icon={<Image src="/images/icons/icon alojamiento.png" width={50} height={50} alt="" />}
            iconPosition="top"
            {...a11yProps(4)}
          />
          <Tab
            label="Carros"
            icon={<Image src="/images/icons/icon carros.png" width={60} height={60} alt="" />}
            iconPosition="top"
            {...a11yProps(5)}
          />
          <Tab
            label="Vuelos"
            icon={<Image src="/images/icons/icon vuelos.png" width={50} height={50} alt="" />}
            iconPosition="top"
            {...a11yProps(6)}
          />
          <Tab
            label="Alquiler"
            icon={<Image src="/images/icons/icon alquileres.png" width={50} height={50} alt="" />}
            iconPosition="top"
            {...a11yProps(7)}
          />
          <Tab
            label="Eventos"
            icon={<Image src="/images/icons/icon eventos.png" width={50} height={50} alt="" />}
            iconPosition="top"
            {...a11yProps(8)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Image src="/images/form.png" alt="" width={1000} height={200} />
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