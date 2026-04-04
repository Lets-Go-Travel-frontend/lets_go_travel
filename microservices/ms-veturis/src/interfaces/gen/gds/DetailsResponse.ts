// Original file: src/interfaces/gen/provider.proto

import type { CancellationPolicy as _gds_CancellationPolicy, CancellationPolicy__Output as _gds_CancellationPolicy__Output } from '../gds/CancellationPolicy';
import type { PriceChangeInfo as _gds_PriceChangeInfo, PriceChangeInfo__Output as _gds_PriceChangeInfo__Output } from '../gds/PriceChangeInfo';

export interface DetailsResponse {
  'status'?: (string);
  'price'?: (number | string);
  'currency'?: (string);
  'hotelName'?: (string);
  'cancellationPolicy'?: (_gds_CancellationPolicy | null);
  'essentialInformation'?: (string)[];
  'mandatoryPaxes'?: (string);
  'priceChangeInfo'?: (_gds_PriceChangeInfo | null);
  'description'?: (string);
}

export interface DetailsResponse__Output {
  'status': (string);
  'price': (number);
  'currency': (string);
  'hotelName': (string);
  'cancellationPolicy': (_gds_CancellationPolicy__Output | null);
  'essentialInformation': (string)[];
  'mandatoryPaxes': (string);
  'priceChangeInfo': (_gds_PriceChangeInfo__Output | null);
  'description': (string);
}
