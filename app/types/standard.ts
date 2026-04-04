export interface IStandardResult {
  hotelId: string;
  hotelName: string;
  stars: number;
  imageUrl: string;
  roomName: string;
  boardName: string;
  bookingToken: string;
  pricing: {
    grossPrice: number;
    netPrice: number;
    currency: string;
    isBindingRate?: boolean;
  };
  cancellationPolicy: {
      refundable: boolean;
      penaltyTiers?: Array<{
          amount: number;
          fromDate: string;
      }>;
  };
  extraData?: any;
}

export interface IStandardSearchResponse {
  provider: string;
  items: IStandardResult[];
}

export interface IDetailsResponse {
    status: string;
    price: number;
    currency: string;
    hotelName?: string;
    cancellationPolicy: {
        refundable: boolean;
        penaltyTiers: Array<{
            amount: number;
            fromDate: string;
        }>;
    };
    essentialInformation?: string[];
    mandatoryPaxes?: 'Y' | 'N' | 'H';
    priceChangeInfo?: {
        hasChanged: boolean;
        newPrice?: number;
    };
    extraData?: {
        agencyBalance?: number;
        supplements?: Array<{ name: string, price: number, type: string }>;
        discounts?: Array<{ name: string, price: number }>;
    };
}

export interface IBookingRequest {
    bookingToken: string;
    client: {
        name: string;
        surnames: string;
        email: string;
        phone?: string;
        country?: string;
    };
    company?: {
        name: string;
        cif: string;
        address: string;
    };
    agencyReference?: string;
    passengers: Array<{
        name: string;
        surname: string;
        age?: number;
        docNumber?: string;
        dateOfBirth?: string;
        expirationDocumentDate?: string;
    }>;
    remarks?: string;
    acceptedPriceChange?: number;
    language?: string;
}

export interface IBookingResponse {
    status: 'CONFIRMED' | 'ERROR' | 'PENDING';
    locator?: string;
    bookingId?: string;
    securityCode?: string;
    error?: string;
}

export interface ICancelRequest {
    bookingId: string;
    securityCode: string;
    confirm: boolean;
}

export interface ICancelResponse {
    status: 'CANCELLED' | 'QUOTED' | 'ERROR';
    message: string;
    cancellationPrice?: number;
    currency?: string;
}

export interface IBookingListRequest {
    bookingId?: string;
    locator?: string;
    agencyReference?: string;
    dateRange?: {
      fromDate: string;
      toDate: string;
      type: number;
    };
    bookingStatus?: string;
}

export interface IBookingListResponse {
    bookings: Array<{
      bookingId: string;
      status: string;
      locator?: string;
      hotelName?: string;
      checkIn?: string;
      checkOut?: string;
      price?: number;
    }>;
}

export interface IVoucherResponse {
    status: string;
    voucherUrl?: string;
    rawHtml?: string;
}

export interface IModifyRequest {
    bookingId: string;
    securityCode: string;
    passengers?: Array<{
        name: string;
        surname: string;
        docNumber?: string;
        dateOfBirth?: string;
    }>;
    remarks?: string;
}

export interface IModifyResponse {
    status: 'OK' | 'ERROR';
    message: string;
}
