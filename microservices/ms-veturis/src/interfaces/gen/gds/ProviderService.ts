// Original file: src/interfaces/gen/provider.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { BookRequest as _gds_BookRequest, BookRequest__Output as _gds_BookRequest__Output } from '../gds/BookRequest';
import type { BookResponse as _gds_BookResponse, BookResponse__Output as _gds_BookResponse__Output } from '../gds/BookResponse';
import type { BookingListRequest as _gds_BookingListRequest, BookingListRequest__Output as _gds_BookingListRequest__Output } from '../gds/BookingListRequest';
import type { BookingListResponse as _gds_BookingListResponse, BookingListResponse__Output as _gds_BookingListResponse__Output } from '../gds/BookingListResponse';
import type { CancelRequest as _gds_CancelRequest, CancelRequest__Output as _gds_CancelRequest__Output } from '../gds/CancelRequest';
import type { CancelResponse as _gds_CancelResponse, CancelResponse__Output as _gds_CancelResponse__Output } from '../gds/CancelResponse';
import type { DetailsRequest as _gds_DetailsRequest, DetailsRequest__Output as _gds_DetailsRequest__Output } from '../gds/DetailsRequest';
import type { DetailsResponse as _gds_DetailsResponse, DetailsResponse__Output as _gds_DetailsResponse__Output } from '../gds/DetailsResponse';
import type { ModifyRequest as _gds_ModifyRequest, ModifyRequest__Output as _gds_ModifyRequest__Output } from '../gds/ModifyRequest';
import type { ModifyResponse as _gds_ModifyResponse, ModifyResponse__Output as _gds_ModifyResponse__Output } from '../gds/ModifyResponse';
import type { SearchRequest as _gds_SearchRequest, SearchRequest__Output as _gds_SearchRequest__Output } from '../gds/SearchRequest';
import type { SearchResponse as _gds_SearchResponse, SearchResponse__Output as _gds_SearchResponse__Output } from '../gds/SearchResponse';
import type { VoucherRequest as _gds_VoucherRequest, VoucherRequest__Output as _gds_VoucherRequest__Output } from '../gds/VoucherRequest';
import type { VoucherResponse as _gds_VoucherResponse, VoucherResponse__Output as _gds_VoucherResponse__Output } from '../gds/VoucherResponse';

export interface ProviderServiceClient extends grpc.Client {
  Book(argument: _gds_BookRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_BookResponse__Output>): grpc.ClientUnaryCall;
  Book(argument: _gds_BookRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_gds_BookResponse__Output>): grpc.ClientUnaryCall;
  Book(argument: _gds_BookRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_BookResponse__Output>): grpc.ClientUnaryCall;
  Book(argument: _gds_BookRequest, callback: grpc.requestCallback<_gds_BookResponse__Output>): grpc.ClientUnaryCall;
  book(argument: _gds_BookRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_BookResponse__Output>): grpc.ClientUnaryCall;
  book(argument: _gds_BookRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_gds_BookResponse__Output>): grpc.ClientUnaryCall;
  book(argument: _gds_BookRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_BookResponse__Output>): grpc.ClientUnaryCall;
  book(argument: _gds_BookRequest, callback: grpc.requestCallback<_gds_BookResponse__Output>): grpc.ClientUnaryCall;
  
  BookingList(argument: _gds_BookingListRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_BookingListResponse__Output>): grpc.ClientUnaryCall;
  BookingList(argument: _gds_BookingListRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_gds_BookingListResponse__Output>): grpc.ClientUnaryCall;
  BookingList(argument: _gds_BookingListRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_BookingListResponse__Output>): grpc.ClientUnaryCall;
  BookingList(argument: _gds_BookingListRequest, callback: grpc.requestCallback<_gds_BookingListResponse__Output>): grpc.ClientUnaryCall;
  bookingList(argument: _gds_BookingListRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_BookingListResponse__Output>): grpc.ClientUnaryCall;
  bookingList(argument: _gds_BookingListRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_gds_BookingListResponse__Output>): grpc.ClientUnaryCall;
  bookingList(argument: _gds_BookingListRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_BookingListResponse__Output>): grpc.ClientUnaryCall;
  bookingList(argument: _gds_BookingListRequest, callback: grpc.requestCallback<_gds_BookingListResponse__Output>): grpc.ClientUnaryCall;
  
  Cancel(argument: _gds_CancelRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_CancelResponse__Output>): grpc.ClientUnaryCall;
  Cancel(argument: _gds_CancelRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_gds_CancelResponse__Output>): grpc.ClientUnaryCall;
  Cancel(argument: _gds_CancelRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_CancelResponse__Output>): grpc.ClientUnaryCall;
  Cancel(argument: _gds_CancelRequest, callback: grpc.requestCallback<_gds_CancelResponse__Output>): grpc.ClientUnaryCall;
  cancel(argument: _gds_CancelRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_CancelResponse__Output>): grpc.ClientUnaryCall;
  cancel(argument: _gds_CancelRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_gds_CancelResponse__Output>): grpc.ClientUnaryCall;
  cancel(argument: _gds_CancelRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_CancelResponse__Output>): grpc.ClientUnaryCall;
  cancel(argument: _gds_CancelRequest, callback: grpc.requestCallback<_gds_CancelResponse__Output>): grpc.ClientUnaryCall;
  
  GetDetails(argument: _gds_DetailsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_DetailsResponse__Output>): grpc.ClientUnaryCall;
  GetDetails(argument: _gds_DetailsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_gds_DetailsResponse__Output>): grpc.ClientUnaryCall;
  GetDetails(argument: _gds_DetailsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_DetailsResponse__Output>): grpc.ClientUnaryCall;
  GetDetails(argument: _gds_DetailsRequest, callback: grpc.requestCallback<_gds_DetailsResponse__Output>): grpc.ClientUnaryCall;
  getDetails(argument: _gds_DetailsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_DetailsResponse__Output>): grpc.ClientUnaryCall;
  getDetails(argument: _gds_DetailsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_gds_DetailsResponse__Output>): grpc.ClientUnaryCall;
  getDetails(argument: _gds_DetailsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_DetailsResponse__Output>): grpc.ClientUnaryCall;
  getDetails(argument: _gds_DetailsRequest, callback: grpc.requestCallback<_gds_DetailsResponse__Output>): grpc.ClientUnaryCall;
  
  GetVoucher(argument: _gds_VoucherRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_VoucherResponse__Output>): grpc.ClientUnaryCall;
  GetVoucher(argument: _gds_VoucherRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_gds_VoucherResponse__Output>): grpc.ClientUnaryCall;
  GetVoucher(argument: _gds_VoucherRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_VoucherResponse__Output>): grpc.ClientUnaryCall;
  GetVoucher(argument: _gds_VoucherRequest, callback: grpc.requestCallback<_gds_VoucherResponse__Output>): grpc.ClientUnaryCall;
  getVoucher(argument: _gds_VoucherRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_VoucherResponse__Output>): grpc.ClientUnaryCall;
  getVoucher(argument: _gds_VoucherRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_gds_VoucherResponse__Output>): grpc.ClientUnaryCall;
  getVoucher(argument: _gds_VoucherRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_VoucherResponse__Output>): grpc.ClientUnaryCall;
  getVoucher(argument: _gds_VoucherRequest, callback: grpc.requestCallback<_gds_VoucherResponse__Output>): grpc.ClientUnaryCall;
  
  Modify(argument: _gds_ModifyRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_ModifyResponse__Output>): grpc.ClientUnaryCall;
  Modify(argument: _gds_ModifyRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_gds_ModifyResponse__Output>): grpc.ClientUnaryCall;
  Modify(argument: _gds_ModifyRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_ModifyResponse__Output>): grpc.ClientUnaryCall;
  Modify(argument: _gds_ModifyRequest, callback: grpc.requestCallback<_gds_ModifyResponse__Output>): grpc.ClientUnaryCall;
  modify(argument: _gds_ModifyRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_ModifyResponse__Output>): grpc.ClientUnaryCall;
  modify(argument: _gds_ModifyRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_gds_ModifyResponse__Output>): grpc.ClientUnaryCall;
  modify(argument: _gds_ModifyRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_ModifyResponse__Output>): grpc.ClientUnaryCall;
  modify(argument: _gds_ModifyRequest, callback: grpc.requestCallback<_gds_ModifyResponse__Output>): grpc.ClientUnaryCall;
  
  SearchAvailability(argument: _gds_SearchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_SearchResponse__Output>): grpc.ClientUnaryCall;
  SearchAvailability(argument: _gds_SearchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_gds_SearchResponse__Output>): grpc.ClientUnaryCall;
  SearchAvailability(argument: _gds_SearchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_SearchResponse__Output>): grpc.ClientUnaryCall;
  SearchAvailability(argument: _gds_SearchRequest, callback: grpc.requestCallback<_gds_SearchResponse__Output>): grpc.ClientUnaryCall;
  searchAvailability(argument: _gds_SearchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_SearchResponse__Output>): grpc.ClientUnaryCall;
  searchAvailability(argument: _gds_SearchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_gds_SearchResponse__Output>): grpc.ClientUnaryCall;
  searchAvailability(argument: _gds_SearchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_gds_SearchResponse__Output>): grpc.ClientUnaryCall;
  searchAvailability(argument: _gds_SearchRequest, callback: grpc.requestCallback<_gds_SearchResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ProviderServiceHandlers extends grpc.UntypedServiceImplementation {
  Book: grpc.handleUnaryCall<_gds_BookRequest__Output, _gds_BookResponse>;
  
  BookingList: grpc.handleUnaryCall<_gds_BookingListRequest__Output, _gds_BookingListResponse>;
  
  Cancel: grpc.handleUnaryCall<_gds_CancelRequest__Output, _gds_CancelResponse>;
  
  GetDetails: grpc.handleUnaryCall<_gds_DetailsRequest__Output, _gds_DetailsResponse>;
  
  GetVoucher: grpc.handleUnaryCall<_gds_VoucherRequest__Output, _gds_VoucherResponse>;
  
  Modify: grpc.handleUnaryCall<_gds_ModifyRequest__Output, _gds_ModifyResponse>;
  
  SearchAvailability: grpc.handleUnaryCall<_gds_SearchRequest__Output, _gds_SearchResponse>;
  
}

export interface ProviderServiceDefinition extends grpc.ServiceDefinition {
  Book: MethodDefinition<_gds_BookRequest, _gds_BookResponse, _gds_BookRequest__Output, _gds_BookResponse__Output>
  BookingList: MethodDefinition<_gds_BookingListRequest, _gds_BookingListResponse, _gds_BookingListRequest__Output, _gds_BookingListResponse__Output>
  Cancel: MethodDefinition<_gds_CancelRequest, _gds_CancelResponse, _gds_CancelRequest__Output, _gds_CancelResponse__Output>
  GetDetails: MethodDefinition<_gds_DetailsRequest, _gds_DetailsResponse, _gds_DetailsRequest__Output, _gds_DetailsResponse__Output>
  GetVoucher: MethodDefinition<_gds_VoucherRequest, _gds_VoucherResponse, _gds_VoucherRequest__Output, _gds_VoucherResponse__Output>
  Modify: MethodDefinition<_gds_ModifyRequest, _gds_ModifyResponse, _gds_ModifyRequest__Output, _gds_ModifyResponse__Output>
  SearchAvailability: MethodDefinition<_gds_SearchRequest, _gds_SearchResponse, _gds_SearchRequest__Output, _gds_SearchResponse__Output>
}
