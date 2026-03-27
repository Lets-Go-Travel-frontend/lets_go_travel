// Original file: proto/provider.proto

import type { Occupancy as _provider_Occupancy, Occupancy__Output as _provider_Occupancy__Output } from '../provider/Occupancy';

export interface SearchRequest {
  'checkIn'?: (string);
  'checkOut'?: (string);
  'destinationId'?: (string);
  'occupancies'?: (_provider_Occupancy)[];
  'extraData'?: ({[key: string]: string});
}

export interface SearchRequest__Output {
  'checkIn': (string);
  'checkOut': (string);
  'destinationId': (string);
  'occupancies': (_provider_Occupancy__Output)[];
  'extraData': ({[key: string]: string});
}
