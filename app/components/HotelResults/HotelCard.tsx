import { Stack, Typography, Button } from "@mui/material";

interface HotelCardProps {
  hotelId: string;
  hotelName: string;
  roomName: string;
  boardName: string;
  price: number;
  currency: string;
  imageUrl?: string;
}

export default function HotelCard({ hotelId, hotelName, roomName, boardName, price, currency, imageUrl }: HotelCardProps) {
  // [Task 4.2.3] ADN Gráfico Corporativo: bg-white rounded-[3rem] shadow y azul navy
  return (
    <Stack
      direction="column"
      spacing={0}
      className="bg-white rounded-[3rem] shadow-2xl transition duration-300 hover:scale-[1.02] overflow-hidden"
      border="1px solid #e0e0e0"
    >
      {/* Imagen Dinámica del Hotel */}
      <div 
        className="w-full h-48 bg-gray-200"
        style={{
            backgroundImage: `url('${imageUrl || "https://placehold.co/600x400?text=No+Image"}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}
      />

      <Stack spacing={2} className="p-6">
        {/* Etiqueta de Agencia Veturis Simulada */}
        <div className="bg-[#062571] text-white text-xs font-bold rounded-full py-1 px-3 self-start mt-[-2rem] relative z-10">
            ID: {hotelId}
        </div>

        <Typography variant="h5" fontWeight="bold" className="text-[#062571]">
            {hotelName}
        </Typography>

        <Typography variant="body2" color="text.secondary">
            {roomName} • {boardName}
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center" className="mt-4">
            <Typography variant="h6" fontWeight="bold" className="text-green-600">
            {price.toFixed(2)} {currency}
            </Typography>
            <Button 
            variant="contained" 
            className="bg-[#062571] hover:bg-blue-800 rounded-full normal-case font-bold"
            >
            Book Now
            </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
