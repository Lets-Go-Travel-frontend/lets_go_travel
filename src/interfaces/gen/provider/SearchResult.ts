// Original file: proto/provider.proto

import type { PricingInfo as _provider_PricingInfo, PricingInfo__Output as _provider_PricingInfo__Output } from '../provider/PricingInfo';
import type { CancellationPolicy as _provider_CancellationPolicy, CancellationPolicy__Output as _provider_CancellationPolicy__Output } from '../provider/CancellationPolicy';

export interface SearchResult {
  'providerItemId'?: (string);
  'itemName'?: (string);
  'itemDescription'?: (string);
  'pricing'?: (_provider_PricingInfo | null);
  'bookingToken'?: (string);
  'cancellationPolicy'?: (_provider_CancellationPolicy | null);
}

export interface SearchResult__Output {
  'providerItemId': (string);
  'itemName': (string);
  'itemDescription': (string);
  'pricing': (_provider_PricingInfo__Output | null);
  'bookingToken': (string);
  'cancellationPolicy': (_provider_CancellationPolicy__Output | null);
}
