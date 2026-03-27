// Original file: proto/provider.proto

import type { PricingInfo as _provider_PricingInfo, PricingInfo__Output as _provider_PricingInfo__Output } from '../provider/PricingInfo';
import type { CancellationPolicy as _provider_CancellationPolicy, CancellationPolicy__Output as _provider_CancellationPolicy__Output } from '../provider/CancellationPolicy';

export interface BookResponse {
  'confirmationId'?: (string);
  'status'?: (string);
  'pricing'?: (_provider_PricingInfo | null);
  'cancellationPolicy'?: (_provider_CancellationPolicy | null);
  'securityCode'?: (string);
}

export interface BookResponse__Output {
  'confirmationId': (string);
  'status': (string);
  'pricing': (_provider_PricingInfo__Output | null);
  'cancellationPolicy': (_provider_CancellationPolicy__Output | null);
  'securityCode': (string);
}
