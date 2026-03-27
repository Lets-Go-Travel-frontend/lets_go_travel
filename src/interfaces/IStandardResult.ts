/**
 * IStandardResult.ts
 * Tipos de salida del adaptador al Centralizador.
 *
 * Knowledge: 02_Contratos + 10_Modelo_de_Datos_Comun_y_Mapeo
 * Skills: field-mapper
 * Rules: binding-rates-and-pricing.md
 */

export interface IStandardSearchResponse {
  providerName: string;
  items: IStandardResult[];
}

export interface IStandardResult {
  /** ID nativo del hotel/actividad en el proveedor */
  providerItemId: string;
  /** Nombre comercial de la propiedad o actividad */
  itemName: string;
  /** Información económica y de pago */
  pricing: PricingInfo;
  /** 
   * Token dinámico para continuar el flujo transaccional.
   * Fuente: <DATOS> (Veturis), RateKey (HotelDo), sessionId (Hotetec).
   */
  bookingToken: string;
  /** Políticas de cancelación vigentes para esta tarifa */
  cancellationPolicy: CancellationPolicy;
  /**
   * Información de tasas locales o avisos legales obligatorios.
   * OBLIGATORIO propagar al frontend para evitar conflictos operativos.
   * Fuente: <EssentialInformation> (Veturis) / ChargeAtDestination (HotelDo).
   */
  essentialInfo?: string;
  /** Tipo de habitación (nombre e ID del proveedor) */
  roomType?: { id: string; name: string };
  /** Código numérico del régimen */
  boardTypeCode?: string;
  /** Nombre legible del régimen (ej: Media Pensión) */
  boardTypeName?: string;
  /** URL de la foto principal del hotel */
  photoUrl?: string;
  /** true si la tarifa es reembolsable */
  refundable?: boolean;
  /** 
   * Metadatos opacos específicos del proveedor. 
   */
  metadata?: Record<string, any>;
}

export interface PricingInfo {
  /** Precio neto para la agencia (Costo). Fuente: <PriceAgency> (Veturis) / Total (HotelDo) */
  netPrice: number;
  /** 
   * Precio de Venta al Público (PVP). 
   * Fuente: <Price> (Veturis) / AgencyPublic (HotelDo).
   */
  grossPrice: number;
  /** SIEMPRE código ISO 4217 (USD, EUR, MXN). */
  currency: string;
  /** true si el pago es directo en el hotel (<DirectPayment> en Veturis) */
  isDirectPayment: boolean;
  /**
   * REGLA DE PARIDAD: true si el proveedor obliga a vender al grossPrice.
   * Fuente: mandatory="1" (Veturis) / IsBindingRate=true (HotelDo).
   * Si es true, el Centralizador NO aplicará márgenes ni descuentos.
   */
  isBindingRate: boolean;
  /** Monto exacto a pagar en destino (Resort Fees, etc). Fuente: ChargeAtDestination (HotelDo) */
  payAtHotel?: number;
}

export interface CancellationPolicy {
  /** YYYY-MM-DD. Fecha límite para cancelar sin coste */
  freeCancellationUntil?: string;
  /** 
   * Tramos de penalización. 
   * Si el proveedor solo tiene uno, usar penaltyAmount y penaltyStartDate como fallback
   * o llenar este array con un solo elemento.
   */
  penaltyTiers?: PenaltyTier[];
  /** Fallback para proveedores simples: monto de la primera penalidad detectada */
  penaltyAmount?: number;
  /** Fallback para proveedores simples: fecha inicio de la primera penalidad */
  penaltyStartDate?: string;
  /** Zona horaria de las fechas (ej: Europe/Madrid). Importante para G12. */
  timezone?: string;
}

export interface PenaltyTier {
  /** ISO 8601: YYYY-MM-DD. Fecha desde la cual aplica este monto */
  startDate: string;
  /** HH:MM. Hora inicio de la penalidad (G12) */
  startTime?: string;
  /** Importe de la penalidad */
  amount: number;
}


export interface IDetailsResponse {
  item: IStandardResult;
  priceChange?: boolean;
  mandatoryPaxes?: boolean;
  agencyBalance?: { amountAvailable: number };
  cancellationPolicy?: CancellationPolicy;
  extraData?: Record<string, any>;
}

export interface ICancelResponse {
  success: boolean;
  errorMessage?: string;
}
