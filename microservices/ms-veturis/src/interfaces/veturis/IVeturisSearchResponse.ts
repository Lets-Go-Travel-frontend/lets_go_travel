/**
 * IVeturisSearchResponse.ts
 * Representa la salida XML nativa devuelta por Veturis
 * que debe ser parseada a JSON por fast-xml-parser.
 */

export interface IVeturisXMLSearchResponse {
  HotelList?: {
    Hotel: IVeturisXMLHotelResponse[] | IVeturisXMLHotelResponse;
  };
  obj?: string; // SessionID
  SessionId?: string; 
  err?: string; 
  ERROR?: string; // G-Audit: "1" = Fallo Maestro
  ErrorCode?: string;
  Errors?: { Error: string };
}

export interface IVeturisXMLHotelResponse {
  Id: string;
  HotelDetails?: {
    Name: string;
    Photo?: { URL: string };
  };
  Accommodations?: {
    Room: IVeturisXMLRoom[] | IVeturisXMLRoom;
  };
}

export interface IVeturisXMLRoom {
  NumberRooms?: number; // G9: Agrupamiento dinámico
  RoomType?: { 
    ID: string; 
    Name: string; 
    Amenities?: { Amenity: { ID: string }[] } 
  };
  Board: IVeturisXMLBoard[] | IVeturisXMLBoard;
}

export interface IVeturisXMLBoard {
  Board_type?: { ID: string };
  DATOS: string; // El token de tarifa vive aquí
  PriceAgency: string; // netPrice
  Price: number | string | { "#text": string; "@_mandatory"?: string }; // grossPrice y flag isBindingRate
  Currency: string;
  DirectPayment?: "0" | "1";
  Refundable?: "Y" | "N" | "-";
  Cancellation?: { 
    From: string; 
    Price: string; 
  };
}
