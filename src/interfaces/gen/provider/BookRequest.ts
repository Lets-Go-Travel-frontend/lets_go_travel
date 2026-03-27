// Original file: proto/provider.proto

import type { Passenger as _provider_Passenger, Passenger__Output as _provider_Passenger__Output } from '../provider/Passenger';

export interface BookRequest {
  'bookingToken'?: (string);
  'passengers'?: (_provider_Passenger)[];
  'holderName'?: (string);
  'holderSurname'?: (string);
  'email'?: (string);
  'clientReferenceId'?: (string);
  'extraData'?: ({[key: string]: string});
  'comments'?: (string);
}

export interface BookRequest__Output {
  'bookingToken': (string);
  'passengers': (_provider_Passenger__Output)[];
  'holderName': (string);
  'holderSurname': (string);
  'email': (string);
  'clientReferenceId': (string);
  'extraData': ({[key: string]: string});
  'comments': (string);
}
