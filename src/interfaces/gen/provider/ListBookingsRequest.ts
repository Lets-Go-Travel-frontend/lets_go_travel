// Original file: proto/provider.proto


export interface ListBookingsRequest {
  'fromDate'?: (string);
  'toDate'?: (string);
  'status'?: (string);
}

export interface ListBookingsRequest__Output {
  'fromDate': (string);
  'toDate': (string);
  'status': (string);
}
