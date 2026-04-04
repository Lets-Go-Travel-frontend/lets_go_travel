// Original file: src/interfaces/gen/provider.proto

import type { DateRange as _gds_DateRange, DateRange__Output as _gds_DateRange__Output } from '../gds/DateRange';

export interface BookingListRequest {
  'bookingId'?: (string);
  'locator'?: (string);
  'agencyReference'?: (string);
  'dateRange'?: (_gds_DateRange | null);
  'bookingStatus'?: (string);
}

export interface BookingListRequest__Output {
  'bookingId': (string);
  'locator': (string);
  'agencyReference': (string);
  'dateRange': (_gds_DateRange__Output | null);
  'bookingStatus': (string);
}
