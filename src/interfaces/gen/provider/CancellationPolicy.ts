// Original file: proto/provider.proto


export interface CancellationPolicy {
  'penaltyStartDate'?: (string);
  'penaltyAmount'?: (number | string);
  'currency'?: (string);
}

export interface CancellationPolicy__Output {
  'penaltyStartDate': (string);
  'penaltyAmount': (number);
  'currency': (string);
}
