/**
 * IVeturisCancel.ts
 */

export interface IVeturisXMLCancelRQ {
  BookingCancellationRQ: {
    "@_version": string;
    "@_language": string;
    Request: {
      BookingID: string;
      SecurityCode: string;
      CancelConfirm: "0" | "1"; // 0: Quote, 1: Execute
    };
  };
}

export interface IVeturisXMLCancelRS {
  BookingCancellationRS: {
    BookingStatus: "A" | string; // A = Cancelled
    HotelName: string;
    BookingPrice: string;
    CancellationPolicies?: any;
    CurrentCancellationPrice: string;
    ERROR: string;
    Errors?: {
      Error: string | string[];
    };
  };
}
