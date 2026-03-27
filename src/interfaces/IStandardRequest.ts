/**
 * IStandardRequest.ts
 * Tipos de entrada del Centralizador al adaptador.
 *
 * Knowledge: 02_Contratos_de_Comunicacion_e_Interfaces_TypeScript.md
 * Skill: field-mapper
 */

export interface IStandardSearchRequest {
  /** 
   * IDs nativos que el proveedor espera.
   * Ej: ["1287113"] para Veturis, o ["activityId"] para Civitatis.
   */
  providerIds: string[];
  /** 
   * Fecha de check-in o fecha de actividad. 
   * SIEMPRE en ISO 8601: YYYY-MM-DD. 
   * El adaptador es responsable de convertirlo a YYYYMMDD (HotelDo) o DD/MM/YYYY (Hotetec/Restel).
   */
  checkIn: string;
  /** 
   * Fecha de check-out. 
   * SIEMPRE en ISO 8601: YYYY-MM-DD. 
   */
  checkOut: string;
  /** Distribución de habitaciones y pasajeros (mínimo 1 adulto por habitación) */
  occupancy: OccupancyRoom[];
  /** 
   * Parámetros adicionales específicos del proveedor.
   * OBLIGATORIO para campos que no existen en el contrato estándar pero son vitales 
   * para la búsqueda (ej: zoneId, destinationId, micrositeId).
   */
  extraData?: Record<string, any>;
}

export interface OccupancyRoom {
  rooms: number;
  adults: number;
  children: number;
  childrenAges: number[];
}


export interface IDetailsRequest {
  bookingToken: string;
}

export interface ICancelRequest {
  confirmationId: string;
  securityCode?: string;
}

export interface IListBookingsRequest {
  fromDate: string;
  toDate: string;
  status?: string;
}
