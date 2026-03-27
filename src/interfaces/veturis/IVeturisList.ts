/**
 * IVeturisList.ts
 */

export interface IVeturisXMLListRQ {
  BookingListRQ: {
    Request: {
      BookingID?: string;
      Locator?: string;
      AgencyReference?: string;
      BookingDateRange?: {
        "@_type": string; // 1-5
        FromDate: string;
        ToDate: string;
      };
      CustomerName?: string;
      HotelID?: string;
      BookingStatus?: string;
    };
  };
}

export interface IVeturisXMLListRS {
  BookingListRS: {
    Booking?: IVeturisXMLBookingItem | IVeturisXMLBookingItem[];
  };
}

export interface IVeturisXMLBookingItem {
  BookingID: string;
  Locator: string;
  Status: string;
  HotelName: string;
  TotalNetPrice: string;
  Currency: string;
  SecurityCode: string;
}
