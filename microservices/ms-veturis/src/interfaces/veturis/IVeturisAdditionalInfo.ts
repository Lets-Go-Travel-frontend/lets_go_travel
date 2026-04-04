/**
 * IVeturisAdditionalInfo.ts
 * Representa el paso B de la reserva (Pre-Reserva/Details).
 */

export interface IVeturisXMLAdditionalInfoRQ {
  AdditionalInformationRQ: {
    "@_version": string;
    "@_language": string;
    obj: string; // SessionID
    DATOS: string; // Token de la habitación
    Language?: string;
  };
}

export interface IVeturisXMLAdditionalInfoRS {
  AdditionalInformationRS: {
    obj: string;
    DATOS: string;
    PriceAgency: string;
    Price: string | { "#text": string, "@_mandatory"?: string };
    Currency: string;
    HotelDetails?: {
      Name: string;
      Category?: string;
      Address?: string;
      Photo?: { URL: string };
    };
    SearchAvailabilityDetails?: {
      RoomName?: string;
      BoardName?: string;
      Check_in_day_of_week?: string;
      Check_out_day_of_week?: string;
    };
    EssentialInformation?: {
      Information: { Description: string } | { Description: string }[];
    };
    Suplements?: unknown; // G10: Soporte para typo 'Suplements' con una p
    Supplements?: {
      Supplement: { "@_Type": string; Description?: string; Price?: string }
                  | { "@_Type": string; Description?: string; Price?: string }[];
    };
    PaymentTypes?: {
      Type: { "@_code": string; "#text": string } | { "@_code": string; "#text": string }[];
    };
    CancellationPolicies?: {
      CancellationPolicy: IVeturisXMLCancellationPeriod | IVeturisXMLCancellationPeriod[];
    };
    Cancellation?: {
      Period: IVeturisXMLCancellationPeriod | IVeturisXMLCancellationPeriod[];
    };
    MandatoryPaxes?: "Y" | "N" | "H";
    PriceChange?: string; // G-Audit: Es un float (el nuevo precio), no booleano
    AgencyBalance?: {
      Balance: string;
      Credit: string;
      AmountAvailable: string;
    };
    // Shortcut tags
    fechaInicioCancelacion?: string;
    horaInicioCancelacion?: string;
    fechaLimiteSinGastos?: string;
    horaLimiteSinGastos?: string;
    // G-Audit: Fail-Fast Maestro
    ERROR?: string;
    ErrorCode?: string;
    Errors?: { Error: string };
  };
}

export interface IVeturisXMLCancellationPeriod {
  From?: string;     // Support legacy
  To?: string;       // Support legacy
  FromDate?: string; // V3.9
  ToDate?: string;   // V3.9
  Hour?: string;     // Support legacy
  Time?: string;     // V3.9
  Amount?: string;   // Support legacy
  Price?: string;    // V3.9
  PriceAgency?: string; // Deprecated but present
}
