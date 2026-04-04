// Original file: src/interfaces/gen/provider.proto


export interface BookingSummary {
  'bookingId'?: (string);
  'status'?: (string);
  'locator'?: (string);
  'hotelName'?: (string);
  'checkIn'?: (string);
  'checkOut'?: (string);
  'price'?: (number | string);
}

export interface BookingSummary__Output {
  'bookingId': (string);
  'status': (string);
  'locator': (string);
  'hotelName': (string);
  'checkIn': (string);
  'checkOut': (string);
  'price': (number);
}
