// Original file: src/interfaces/gen/provider.proto


export interface CancelResponse {
  'status'?: (string);
  'message'?: (string);
  'cancellationPrice'?: (number | string);
  'currency'?: (string);
}

export interface CancelResponse__Output {
  'status': (string);
  'message': (string);
  'cancellationPrice': (number);
  'currency': (string);
}
