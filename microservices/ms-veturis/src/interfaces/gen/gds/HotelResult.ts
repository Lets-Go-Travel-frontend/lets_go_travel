// Original file: src/interfaces/gen/provider.proto

import type { PricingInfo as _gds_PricingInfo, PricingInfo__Output as _gds_PricingInfo__Output } from '../gds/PricingInfo';
import type { CancellationPolicy as _gds_CancellationPolicy, CancellationPolicy__Output as _gds_CancellationPolicy__Output } from '../gds/CancellationPolicy';

export interface HotelResult {
  'hotelId'?: (string);
  'hotelName'?: (string);
  'stars'?: (number);
  'imageUrl'?: (string);
  'roomName'?: (string);
  'boardName'?: (string);
  'bookingToken'?: (string);
  'pricing'?: (_gds_PricingInfo | null);
  'cancellationPolicy'?: (_gds_CancellationPolicy | null);
  'lat'?: (number | string);
  'lng'?: (number | string);
  'amenities'?: (string)[];
}

export interface HotelResult__Output {
  'hotelId': (string);
  'hotelName': (string);
  'stars': (number);
  'imageUrl': (string);
  'roomName': (string);
  'boardName': (string);
  'bookingToken': (string);
  'pricing': (_gds_PricingInfo__Output | null);
  'cancellationPolicy': (_gds_CancellationPolicy__Output | null);
  'lat': (number);
  'lng': (number);
  'amenities': (string)[];
}
