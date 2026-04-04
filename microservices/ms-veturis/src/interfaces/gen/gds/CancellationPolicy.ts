// Original file: src/interfaces/gen/provider.proto

import type { PenaltyTier as _gds_PenaltyTier, PenaltyTier__Output as _gds_PenaltyTier__Output } from '../gds/PenaltyTier';

export interface CancellationPolicy {
  'refundable'?: (boolean);
  'penaltyTiers'?: (_gds_PenaltyTier)[];
}

export interface CancellationPolicy__Output {
  'refundable': (boolean);
  'penaltyTiers': (_gds_PenaltyTier__Output)[];
}
