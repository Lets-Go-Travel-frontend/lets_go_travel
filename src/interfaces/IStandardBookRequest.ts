/**
 * IStandardBookRequest.ts / IStandardBookResponse.ts
 * Tipos del ciclo de vida de reserva.
 *
 * Skills: field-mapper, pii-masking
 * ⚠️ Los campos de PassengerData contienen PII — nunca loguear en texto plano.
 */

export interface IStandardBookRequest {
  /** Token capturado en searchAvailability: <DATOS> (Veturis), RateKey (HotelDo), cartId (Civitatis) */
  bookingToken: string;
  holder: {
    name: string;
    surname: string;
    email: string;
  };
  passengers: PassengerData[];
  /** ID de referencia del cliente para trazabilidad (ej: AgencyReferenceId) */
  clientReferenceId?: string;
  /** Comentarios/Peticiones especiales al hotel */
  comments?: string;
  /** Metadatos opacos específicos del proveedor (ej: priceChange) */
  extraData?: Record<string, any>;
  /** Fechas de estancia (requerido por Veturis para redundancia en Book RQ) */
  checkIn?: string;  // YYYY-MM-DD
  checkOut?: string; // YYYY-MM-DD
}

export interface PassengerData {
  firstName: string;      // PII — aplicar pii-masking en logs
  lastName: string;       // PII
  documentType: 'PASSPORT' | 'DNI' | 'NIE' | 'OTHER';
  documentNumber: string; // PII
  /** Requerido por algunos proveedores como Civitatis para preguntas de checkout */
  dateOfBirth?: string;   // YYYY-MM-DD
  nationality?: string;   // ISO 3166-1 alpha-2
}

export interface IStandardBookResponse {
  /** ID de confirmación del proveedor (localizador final) */
  confirmationId: string;
  providerName: string;
  status?: 'CONFIRMED' | 'FAILED' | 'PENDING';
  cancellationPolicy?: import('./IStandardResult').CancellationPolicy;
  /** Código de seguridad requerido para cancelaciones (ej: Veturis) */
  securityCode?: string;
  /** Metadatos adicionales (G8 Veturis: CompleteRoomName, OtherFields) */
  extraData?: Record<string, any>;
}
