import { useState, useCallback } from "react";
import { IStandardSearchResponse } from "../types/standard";

export const useCentralizer = () => {
  const [data, setData] = useState<IStandardSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // [Task 4.3.1] Fetch Asíncrono puro con manejo de estados transparentes.
  const searchHotels = useCallback(async (params: { hotelId: string, checkIn: string, checkOut: string, adults: number, children: number, childrenAges?: number[] }) => {
    // AbortController para cancelar peticiones si el componente se desmonta o cambia de página
    const controller = new AbortController();
    
    setIsLoading(true);
    setIsError(false);

    try {
      // Conexión directa a la capa de integración de Node.js (El Adapter de Veturis)
      const res = await fetch("http://localhost:3005/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // [VETURIS_FUNCTION_TEST]: Parámetros dinámicos desde el Sandbox o Finder
        body: JSON.stringify({ 
          hotelId: params.hotelId, 
          checkIn: params.checkIn, 
          checkOut: params.checkOut, 
          occupancies: [{
            adults: params.adults,
            children: params.children,
            childrenAges: params.childrenAges || []
          }]
        }),
        signal: controller.signal
      });

      if (!res.ok) throw new Error("Fallback HTTP from Microservice");
      
      const payload: IStandardSearchResponse = await res.json();
      setData(payload);
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name !== "AbortError") {
        console.error("[Centralizer Error]:", error);
        setIsError(true);
        setData(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, isError, searchHotels };
};
