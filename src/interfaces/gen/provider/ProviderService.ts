// Original file: proto/provider.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { BookRequest as _provider_BookRequest, BookRequest__Output as _provider_BookRequest__Output } from '../provider/BookRequest';
import type { BookResponse as _provider_BookResponse, BookResponse__Output as _provider_BookResponse__Output } from '../provider/BookResponse';
import type { CancelRequest as _provider_CancelRequest, CancelRequest__Output as _provider_CancelRequest__Output } from '../provider/CancelRequest';
import type { CancelResponse as _provider_CancelResponse, CancelResponse__Output as _provider_CancelResponse__Output } from '../provider/CancelResponse';
import type { DetailsRequest as _provider_DetailsRequest, DetailsRequest__Output as _provider_DetailsRequest__Output } from '../provider/DetailsRequest';
import type { DetailsResponse as _provider_DetailsResponse, DetailsResponse__Output as _provider_DetailsResponse__Output } from '../provider/DetailsResponse';
import type { ListBookingsRequest as _provider_ListBookingsRequest, ListBookingsRequest__Output as _provider_ListBookingsRequest__Output } from '../provider/ListBookingsRequest';
import type { ListBookingsResponse as _provider_ListBookingsResponse, ListBookingsResponse__Output as _provider_ListBookingsResponse__Output } from '../provider/ListBookingsResponse';
import type { SearchRequest as _provider_SearchRequest, SearchRequest__Output as _provider_SearchRequest__Output } from '../provider/SearchRequest';
import type { SearchResponse as _provider_SearchResponse, SearchResponse__Output as _provider_SearchResponse__Output } from '../provider/SearchResponse';

export interface ProviderServiceClient extends grpc.Client {
  Book(argument: _provider_BookRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_BookResponse__Output>): grpc.ClientUnaryCall;
  Book(argument: _provider_BookRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_provider_BookResponse__Output>): grpc.ClientUnaryCall;
  Book(argument: _provider_BookRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_BookResponse__Output>): grpc.ClientUnaryCall;
  Book(argument: _provider_BookRequest, callback: grpc.requestCallback<_provider_BookResponse__Output>): grpc.ClientUnaryCall;
  book(argument: _provider_BookRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_BookResponse__Output>): grpc.ClientUnaryCall;
  book(argument: _provider_BookRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_provider_BookResponse__Output>): grpc.ClientUnaryCall;
  book(argument: _provider_BookRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_BookResponse__Output>): grpc.ClientUnaryCall;
  book(argument: _provider_BookRequest, callback: grpc.requestCallback<_provider_BookResponse__Output>): grpc.ClientUnaryCall;
  
  Cancel(argument: _provider_CancelRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_CancelResponse__Output>): grpc.ClientUnaryCall;
  Cancel(argument: _provider_CancelRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_provider_CancelResponse__Output>): grpc.ClientUnaryCall;
  Cancel(argument: _provider_CancelRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_CancelResponse__Output>): grpc.ClientUnaryCall;
  Cancel(argument: _provider_CancelRequest, callback: grpc.requestCallback<_provider_CancelResponse__Output>): grpc.ClientUnaryCall;
  cancel(argument: _provider_CancelRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_CancelResponse__Output>): grpc.ClientUnaryCall;
  cancel(argument: _provider_CancelRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_provider_CancelResponse__Output>): grpc.ClientUnaryCall;
  cancel(argument: _provider_CancelRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_CancelResponse__Output>): grpc.ClientUnaryCall;
  cancel(argument: _provider_CancelRequest, callback: grpc.requestCallback<_provider_CancelResponse__Output>): grpc.ClientUnaryCall;
  
  GetDetails(argument: _provider_DetailsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_DetailsResponse__Output>): grpc.ClientUnaryCall;
  GetDetails(argument: _provider_DetailsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_provider_DetailsResponse__Output>): grpc.ClientUnaryCall;
  GetDetails(argument: _provider_DetailsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_DetailsResponse__Output>): grpc.ClientUnaryCall;
  GetDetails(argument: _provider_DetailsRequest, callback: grpc.requestCallback<_provider_DetailsResponse__Output>): grpc.ClientUnaryCall;
  getDetails(argument: _provider_DetailsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_DetailsResponse__Output>): grpc.ClientUnaryCall;
  getDetails(argument: _provider_DetailsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_provider_DetailsResponse__Output>): grpc.ClientUnaryCall;
  getDetails(argument: _provider_DetailsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_DetailsResponse__Output>): grpc.ClientUnaryCall;
  getDetails(argument: _provider_DetailsRequest, callback: grpc.requestCallback<_provider_DetailsResponse__Output>): grpc.ClientUnaryCall;
  
  ListBookings(argument: _provider_ListBookingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_ListBookingsResponse__Output>): grpc.ClientUnaryCall;
  ListBookings(argument: _provider_ListBookingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_provider_ListBookingsResponse__Output>): grpc.ClientUnaryCall;
  ListBookings(argument: _provider_ListBookingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_ListBookingsResponse__Output>): grpc.ClientUnaryCall;
  ListBookings(argument: _provider_ListBookingsRequest, callback: grpc.requestCallback<_provider_ListBookingsResponse__Output>): grpc.ClientUnaryCall;
  listBookings(argument: _provider_ListBookingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_ListBookingsResponse__Output>): grpc.ClientUnaryCall;
  listBookings(argument: _provider_ListBookingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_provider_ListBookingsResponse__Output>): grpc.ClientUnaryCall;
  listBookings(argument: _provider_ListBookingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_ListBookingsResponse__Output>): grpc.ClientUnaryCall;
  listBookings(argument: _provider_ListBookingsRequest, callback: grpc.requestCallback<_provider_ListBookingsResponse__Output>): grpc.ClientUnaryCall;
  
  SearchAvailability(argument: _provider_SearchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_SearchResponse__Output>): grpc.ClientUnaryCall;
  SearchAvailability(argument: _provider_SearchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_provider_SearchResponse__Output>): grpc.ClientUnaryCall;
  SearchAvailability(argument: _provider_SearchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_SearchResponse__Output>): grpc.ClientUnaryCall;
  SearchAvailability(argument: _provider_SearchRequest, callback: grpc.requestCallback<_provider_SearchResponse__Output>): grpc.ClientUnaryCall;
  searchAvailability(argument: _provider_SearchRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_SearchResponse__Output>): grpc.ClientUnaryCall;
  searchAvailability(argument: _provider_SearchRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_provider_SearchResponse__Output>): grpc.ClientUnaryCall;
  searchAvailability(argument: _provider_SearchRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_provider_SearchResponse__Output>): grpc.ClientUnaryCall;
  searchAvailability(argument: _provider_SearchRequest, callback: grpc.requestCallback<_provider_SearchResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ProviderServiceHandlers extends grpc.UntypedServiceImplementation {
  Book: grpc.handleUnaryCall<_provider_BookRequest__Output, _provider_BookResponse>;
  
  Cancel: grpc.handleUnaryCall<_provider_CancelRequest__Output, _provider_CancelResponse>;
  
  GetDetails: grpc.handleUnaryCall<_provider_DetailsRequest__Output, _provider_DetailsResponse>;
  
  ListBookings: grpc.handleUnaryCall<_provider_ListBookingsRequest__Output, _provider_ListBookingsResponse>;
  
  SearchAvailability: grpc.handleUnaryCall<_provider_SearchRequest__Output, _provider_SearchResponse>;
  
}

export interface ProviderServiceDefinition extends grpc.ServiceDefinition {
  Book: MethodDefinition<_provider_BookRequest, _provider_BookResponse, _provider_BookRequest__Output, _provider_BookResponse__Output>
  Cancel: MethodDefinition<_provider_CancelRequest, _provider_CancelResponse, _provider_CancelRequest__Output, _provider_CancelResponse__Output>
  GetDetails: MethodDefinition<_provider_DetailsRequest, _provider_DetailsResponse, _provider_DetailsRequest__Output, _provider_DetailsResponse__Output>
  ListBookings: MethodDefinition<_provider_ListBookingsRequest, _provider_ListBookingsResponse, _provider_ListBookingsRequest__Output, _provider_ListBookingsResponse__Output>
  SearchAvailability: MethodDefinition<_provider_SearchRequest, _provider_SearchResponse, _provider_SearchRequest__Output, _provider_SearchResponse__Output>
}
