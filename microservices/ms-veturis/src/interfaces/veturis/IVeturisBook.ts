/**
 * IVeturisBook.ts
 * Representa el paso C de la reserva (Confirmación).
 */

export interface IVeturisXMLBookRQ {
  BookingConfirmationRQ: {
    "@_version": string;
    "@_language": string;
    obj: string;
    DATOS: string;
    CheckInDate?: string;
    CheckOutDate?: string;
    Customer: {
      Name: string;
      Surname: string;
      Email: string;
      Phone?: string;
    };
    Passengers: {
      Adults: {
        "@_number": number;
        Passenger: IVeturisXMLPassenger[];
      };
      Children?: {
        "@_number": number;
        Child: (IVeturisXMLPassenger & { "@_Age": string })[];
      };
      Babies?: {
        "@_number": number;
      };
      Room?: {
        CheckInDate: string;
        CheckOutDate: string;
      }[];
    };
    // G10: Nodo de pago (solo se envía <payment>)
    payment?: {
      Type: { "#text": string };
    };
    Reference?: string;
    PriceChange?: string; // G-Audit: Float con el nuevo precio
    comment?: {
      text: string;
    };
    Language?: string;
  };
}

export interface IVeturisXMLPassenger {
  "@_id": string; // G6: Secuenciación obligatoria <pax id="1">
  Name: string;
  Surname: string;
  dateOfBirth: string; // Mandatorio (vacío autofirma si no hay)
  countryID?: string; // Mandatorio (vacío autofirma si no hay)
  IsChild: "0" | "1";
  documentNumber?: string; // G5: Truncado a 15 car.
  expirationDocumentDate?: string; // Required (empty allowed)
  country?: string; // G7: Reemplaza Nationality por country (numérico)
}

export interface IVeturisXMLBookRS {
  BookingConfirmationRS: {
    BookingID: string;
    SecurityCode: string;
    Status: string;
    ReservationStatus?: string; // G9: Éxito = 1
    PaymentStatus?: string;     // G9: Éxito = 1
    ConfirmationStatus?: string; // G9: Éxito = 1
    TotalNetPrice: string;
    Currency: string;
    CompleteRoomName?: string; // G8: Nombre truncado a 255/50
    OtherFields?: {
      Field: { Name: string; Value: string } | { Name: string; Value: string }[];
    };
    err?: string;
  };
}
