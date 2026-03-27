// Original file: proto/provider.proto

import type { BookResponse as _provider_BookResponse, BookResponse__Output as _provider_BookResponse__Output } from '../provider/BookResponse';

export interface ListBookingsResponse {
  'bookings'?: (_provider_BookResponse)[];
}

export interface ListBookingsResponse__Output {
  'bookings': (_provider_BookResponse__Output)[];
}
