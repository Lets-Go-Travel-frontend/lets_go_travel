// Original file: src/interfaces/gen/provider.proto

import type { HotelResult as _gds_HotelResult, HotelResult__Output as _gds_HotelResult__Output } from '../gds/HotelResult';

export interface SearchResponse {
  'provider'?: (string);
  'items'?: (_gds_HotelResult)[];
}

export interface SearchResponse__Output {
  'provider': (string);
  'items': (_gds_HotelResult__Output)[];
}
