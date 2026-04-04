/**
 * IVeturisSearchRequest.ts
 * Representa la estructura XML nativa requerida por Veturis
 * en el envelope <SearchAvailabilityRQ>.
 */

export interface IVeturisXMLSearchBody {
  SearchAvailabilityRQ: {
    "@_version": string;  // "2.0"
    "@_language": string; // "SPA"
    CityCode?: string;      // ID de destino/ciudad G-Audit
    HotelList?: string;     // ID1/ID2/ID3
    HotelInformation?: 'Y' | 'N';
    Check_in_date: string;  // YYYY-MM-DD
    Check_out_date: string; // YYYY-MM-DD
    Language: string;
    Currency: string;
    CountryCode: string;   // ISO 3166-1 alpha-3 (MANDATORIO para evitar default)
    TimeLimit?: number;    // SEGUN MANUAL: Segundos para truncar búsqueda
    Filters?: {
      Prices?: { MaxPrice?: number };
      Boards?: { ID?: string[] };
      Refundable?: 'Y' | 'N';
    };
    Room: IVeturisXMLRoom[];
  };
}

export interface IVeturisXMLHotelId {
  Id: string;
}

export interface IVeturisXMLRoom {
  Adults: number;
  Children?: number;
  // G1: Ages es obligatorio si Children > 0
  Ages?: { Age: number[] };
}
