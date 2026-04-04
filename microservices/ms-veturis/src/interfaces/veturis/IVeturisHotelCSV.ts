/**
 * IVeturisHotelCSV.ts
 * Representa la ingesta CRUDA y ESTATICA nativa de Veturis
 * CSV "Pipe" (|)
 */

export interface IVeturisHotelCSV {
    Id: string;
    HotelId?: string; // Fallback
    Name: string;
    HotelName?: string; // Fallback
    Category?: string;
    CategoryID?: string; // Ingesta real
    Latitude?: string;
    Longitude?: string;
    Roulette?: "0" | "1";
    Ruleta?: "0" | "1";
    DestinationCode?: string;
    CountryCode?: string;
    ZipCode?: string;
    Address?: string;
}
