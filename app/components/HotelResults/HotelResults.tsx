import { Stack, Skeleton, Typography } from "@mui/material";
import { useEffect } from "react";
import HotelCard from "./HotelCard";
import { useCentralizer } from "../../hooks/useCentralizer";

export default function HotelResults() {
  const { data, isLoading, isError, searchHotels } = useCentralizer();

  // Activa la búsqueda GDS on-mount para mockup visual (Puedes moverlo al botón del Finder luego)
  useEffect(() => {
    searchHotels({
        hotelId: "9553", // Hotel de prueba (Ritz Madrid)
        checkIn: "2026-06-01",
        checkOut: "2026-06-05",
        adults: 2,
        children: 1,
        childrenAges: [7]
    });
  }, [searchHotels]);

  // [Task 4.3.3] Atajar Caídas de Veturis
  if (isError) {
    return (
      <Stack className="my-8 w-full p-8 bg-red-50 rounded-[3rem] border border-red-200" alignItems="center">
         <Typography variant="h6" color="error">
            Servidores de hoteles ocupados. No pudimos conectar con los proveedores.
         </Typography>
      </Stack>
    );
  }

  return (
    <Stack direction="column" spacing={4} className="w-full my-8">
      <Typography variant="h4" fontWeight="bold" className="text-[#062571] px-4">
        Resultados GDS
      </Typography>

      {/* [Task 4.2.2] Responsividad "Mobile-First" 1 Columna a 3 Columnas Tailwind */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* [Task 4.3.2] UI Fallback Skeletons mientras la promesa Axios carga */}
        {isLoading &&
          [1, 2, 3].map((skeletonIndex) => (
            <Skeleton
              key={skeletonIndex}
              variant="rectangular"
              height={320}
              className="rounded-[3rem] shadow-2xl"
              animation="pulse"
              sx={{ borderRadius: "3rem" }}
            />
          ))}

        {/* Dibujar data del Standard DTO Universal */}
        {!isLoading &&
          data?.items.map((hotel, index) => (
            <HotelCard
              key={index}
              hotelId={hotel.hotelId}
              hotelName={hotel.hotelName}
              roomName={hotel.roomName}
              boardName={hotel.boardName}
              price={hotel.pricing.grossPrice}
              currency={hotel.pricing.currency}
              imageUrl={hotel.imageUrl}
            />
          ))}

        {/* State vacío si no hay data */}
        {!isLoading && data?.items.length === 0 && (
          <Typography className="col-span-1 md:col-span-3 text-center text-gray-500 py-10">
            No se encontraron hoteles con los parámetros.
          </Typography>
        )}
      </div>
    </Stack>
  );
}
