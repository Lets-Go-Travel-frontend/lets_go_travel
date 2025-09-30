"use client";

import { Stack } from "@mui/material";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Finder from "../components/Finder/Finder";
import { HotelSearchResults } from "../components/HotelSearch";

export default function HotelesPage() {
  return (
    <>
      <Header />

      <Stack direction="column" spacing={4} className="py-4 md:px-10 px-2 m-auto">
        <div className="bg-[#062571] text-white p-4 rounded-[3rem]">
          <Finder />
        </div>

        <HotelSearchResults />
      </Stack>

      <Footer />
    </>
  );
}