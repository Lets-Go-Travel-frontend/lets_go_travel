// Original file: src/interfaces/gen/provider.proto

import type { Passenger as _gds_Passenger, Passenger__Output as _gds_Passenger__Output } from '../gds/Passenger';

export interface ModifyRequest {
  'bookingId'?: (string);
  'securityCode'?: (string);
  'passengers'?: (_gds_Passenger)[];
  'remarks'?: (string);
}

export interface ModifyRequest__Output {
  'bookingId': (string);
  'securityCode': (string);
  'passengers': (_gds_Passenger__Output)[];
  'remarks': (string);
}
