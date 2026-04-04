// Original file: src/interfaces/gen/provider.proto

import type { ClientInfo as _gds_ClientInfo, ClientInfo__Output as _gds_ClientInfo__Output } from '../gds/ClientInfo';
import type { Passenger as _gds_Passenger, Passenger__Output as _gds_Passenger__Output } from '../gds/Passenger';
import type { CompanyInfo as _gds_CompanyInfo, CompanyInfo__Output as _gds_CompanyInfo__Output } from '../gds/CompanyInfo';

export interface BookRequest {
  'bookingToken'?: (string);
  'client'?: (_gds_ClientInfo | null);
  'passengers'?: (_gds_Passenger)[];
  'remarks'?: (string);
  'acceptedPriceChange'?: (number | string);
  'company'?: (_gds_CompanyInfo | null);
  'agencyReference'?: (string);
}

export interface BookRequest__Output {
  'bookingToken': (string);
  'client': (_gds_ClientInfo__Output | null);
  'passengers': (_gds_Passenger__Output)[];
  'remarks': (string);
  'acceptedPriceChange': (number);
  'company': (_gds_CompanyInfo__Output | null);
  'agencyReference': (string);
}
