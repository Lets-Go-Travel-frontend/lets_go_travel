// Original file: proto/provider.proto


export interface PricingInfo {
  'netPrice'?: (number | string);
  'grossPrice'?: (number | string);
  'currency'?: (string);
  'isBindingRate'?: (boolean);
  'isDirectPayment'?: (boolean);
}

export interface PricingInfo__Output {
  'netPrice': (number);
  'grossPrice': (number);
  'currency': (string);
  'isBindingRate': (boolean);
  'isDirectPayment': (boolean);
}
