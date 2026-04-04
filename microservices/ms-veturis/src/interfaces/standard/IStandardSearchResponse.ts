/**
 * IStandardSearchResponse.ts
 * Contrato de estandarización universal de JSON para el ecosistema lets_go_travel.
 * NINGÚN Adaptador enviará XML nativo al Centralizador. Todos usarán esta base.
 */

export interface IStandardSearchResponse {
  provider: string; // Ej: 'veturis'
  items: IStandardResult[];
}

export interface IStandardResult {
  bookingToken: string; // Token opaco base64
  hotelId: string;
  hotelName: string; // [VETURIS_METADATA_ENRICHMENT]
  stars: number; // [VETURIS_METADATA_ENRICHMENT]
  imageUrl: string; // [VETURIS_METADATA_ENRICHMENT]
  lat: number;
  lng: number;
  roomName: string;
  boardName: string;
  pricing: PricingInfo;
  cancellationPolicy: CancellationPolicy;
  extraData?: {
    amenities?: string[];
    [key: string]: any;
  };
}

export interface PricingInfo {
  netPrice: number;
  grossPrice: number;
  currency: string;
  isBindingRate: boolean; // Vital: `@_mandatory` flag mapeo (G-Rule)
}

export interface CancellationPolicy {
  refundable: boolean;
  penaltyTiers: PenaltyTier[];
}

export interface PenaltyTier {
  amount: number;
  fromDate: string; // ISO String recomendado
}
