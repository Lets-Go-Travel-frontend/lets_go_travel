// Original file: src/interfaces/gen/provider.proto


export interface CancelRequest {
  'bookingId'?: (string);
  'securityCode'?: (string);
  'confirm'?: (boolean);
}

export interface CancelRequest__Output {
  'bookingId': (string);
  'securityCode': (string);
  'confirm': (boolean);
}
