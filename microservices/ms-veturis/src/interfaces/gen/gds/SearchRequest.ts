// Original file: src/interfaces/gen/provider.proto

import type { Occupancy as _gds_Occupancy, Occupancy__Output as _gds_Occupancy__Output } from '../gds/Occupancy';

export interface SearchRequest {
  'hotelId'?: (string);
  'checkIn'?: (string);
  'checkOut'?: (string);
  'occupancies'?: (_gds_Occupancy)[];
  'countryCode'?: (string);
  'language'?: (string);
}

export interface SearchRequest__Output {
  'hotelId': (string);
  'checkIn': (string);
  'checkOut': (string);
  'occupancies': (_gds_Occupancy__Output)[];
  'countryCode': (string);
  'language': (string);
}
