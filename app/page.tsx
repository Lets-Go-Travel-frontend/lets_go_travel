"use client";

import { Stack } from "@mui/material";
import Header from "./components/Header/Header";
import { useState } from "react";
import Banner from "./components/Banner/Banner";
import Testimonials from "./components/Testimonios/Testimonios";
import Footer from "./components/Footer/Footer";
import Poles from "./components/Poles/Poles";
import Finder from "./components/Finder/Finder";
import Image from "next/image";
import { OfertasSearchResults } from "./components/Ofertas";
import { PaquetesSearchResults } from "./components/Paquetes";
import { DestinosSearchResults } from "./components/Destinos";
import { ExcursionesSearchResults } from "./components/Excursiones";

export default function Home() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Renderizar contenido según el tab seleccionado
  const renderContent = () => {
    switch (value) {
      case 0: // Tab "Ofertas"
        return <OfertasSearchResults />;
      
      case 1: // Tab "Paquetes"
        return <PaquetesSearchResults />;
      
      case 2: // Tab "Destinos"
        return <DestinosSearchResults />;

      case 3: // Tab "Excursiones"
        return <ExcursionesSearchResults />;
      
      default:
        // Contenido original para otros tabs
        return (
          <>
            {/* BANNER */}
            <Banner></Banner>

            {/* POLES */}
            <Poles></Poles>

            {/* Disney */}
            <section className="w-full">
              <Image src="/images/disney1.png" alt="" width={1080} height={100} className="m-auto" />
            </section>

            {/* ABOUT */}
            <section className="text-center p-4">
              <h2 className="title-section">Quienes somos</h2>
              <p className="md:text-2xl text-xl text-center text-blue-900">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa, ex. Excepturi
                consequuntur unde perspiciatis cumque tenetur ea aspernatur quis fugit aut esse rerum
                minima, repellendus nostrum non! Eaque animi unde cum, excepturi perferendis delectus
                similique iste mollitia laboriosam placeat impedit laborum porro illum ut vitae quisquam
                amet expedita a veniam vel dignissimos nisi iusto totam? Ullam minus ad, dolorum
                excepturi asperiores sint quam laboriosam enim expedita suscipit quos ipsum aspernatur
                corrupti eveniet? Nihil fugit accusantium repellat voluptatum repellendus sed quae quas
                consequuntur asperiores provident, soluta voluptate assumenda laboriosam nam, voluptas
                quaerat quia odit vel, enim veniam cumque. Consequatur, corporis rerum.
              </p>
            </section>

            {/* TESTIMONIOS */}
            <Testimonials></Testimonials>
          </>
        );
    }
  };

  return (
    <>
      <Header />

      <Stack direction="column" spacing={4} className="py-4 md:px-10 px-2 m-auto">
        <div className="bg-[#062571] text-white p-4 rounded-[3rem]">
          <Finder value={value} onChange={handleChange} />
        </div>

        {/* CONTENIDO QUE CAMBIA SEGÚN EL TAB SELECCIONADO */}
        {renderContent()}
      </Stack>

      <Footer />
    </>
  );
}