import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { BookRequest as _gds_BookRequest, BookRequest__Output as _gds_BookRequest__Output } from './gds/BookRequest';
import type { BookResponse as _gds_BookResponse, BookResponse__Output as _gds_BookResponse__Output } from './gds/BookResponse';
import type { BookingListRequest as _gds_BookingListRequest, BookingListRequest__Output as _gds_BookingListRequest__Output } from './gds/BookingListRequest';
import type { BookingListResponse as _gds_BookingListResponse, BookingListResponse__Output as _gds_BookingListResponse__Output } from './gds/BookingListResponse';
import type { BookingSummary as _gds_BookingSummary, BookingSummary__Output as _gds_BookingSummary__Output } from './gds/BookingSummary';
import type { CancelRequest as _gds_CancelRequest, CancelRequest__Output as _gds_CancelRequest__Output } from './gds/CancelRequest';
import type { CancelResponse as _gds_CancelResponse, CancelResponse__Output as _gds_CancelResponse__Output } from './gds/CancelResponse';
import type { CancellationPolicy as _gds_CancellationPolicy, CancellationPolicy__Output as _gds_CancellationPolicy__Output } from './gds/CancellationPolicy';
import type { ClientInfo as _gds_ClientInfo, ClientInfo__Output as _gds_ClientInfo__Output } from './gds/ClientInfo';
import type { CompanyInfo as _gds_CompanyInfo, CompanyInfo__Output as _gds_CompanyInfo__Output } from './gds/CompanyInfo';
import type { DateRange as _gds_DateRange, DateRange__Output as _gds_DateRange__Output } from './gds/DateRange';
import type { DetailsRequest as _gds_DetailsRequest, DetailsRequest__Output as _gds_DetailsRequest__Output } from './gds/DetailsRequest';
import type { DetailsResponse as _gds_DetailsResponse, DetailsResponse__Output as _gds_DetailsResponse__Output } from './gds/DetailsResponse';
import type { HotelResult as _gds_HotelResult, HotelResult__Output as _gds_HotelResult__Output } from './gds/HotelResult';
import type { ModifyRequest as _gds_ModifyRequest, ModifyRequest__Output as _gds_ModifyRequest__Output } from './gds/ModifyRequest';
import type { ModifyResponse as _gds_ModifyResponse, ModifyResponse__Output as _gds_ModifyResponse__Output } from './gds/ModifyResponse';
import type { Occupancy as _gds_Occupancy, Occupancy__Output as _gds_Occupancy__Output } from './gds/Occupancy';
import type { Passenger as _gds_Passenger, Passenger__Output as _gds_Passenger__Output } from './gds/Passenger';
import type { PenaltyTier as _gds_PenaltyTier, PenaltyTier__Output as _gds_PenaltyTier__Output } from './gds/PenaltyTier';
import type { PriceChangeInfo as _gds_PriceChangeInfo, PriceChangeInfo__Output as _gds_PriceChangeInfo__Output } from './gds/PriceChangeInfo';
import type { PricingInfo as _gds_PricingInfo, PricingInfo__Output as _gds_PricingInfo__Output } from './gds/PricingInfo';
import type { ProviderServiceClient as _gds_ProviderServiceClient, ProviderServiceDefinition as _gds_ProviderServiceDefinition } from './gds/ProviderService';
import type { SearchRequest as _gds_SearchRequest, SearchRequest__Output as _gds_SearchRequest__Output } from './gds/SearchRequest';
import type { SearchResponse as _gds_SearchResponse, SearchResponse__Output as _gds_SearchResponse__Output } from './gds/SearchResponse';
import type { VoucherRequest as _gds_VoucherRequest, VoucherRequest__Output as _gds_VoucherRequest__Output } from './gds/VoucherRequest';
import type { VoucherResponse as _gds_VoucherResponse, VoucherResponse__Output as _gds_VoucherResponse__Output } from './gds/VoucherResponse';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  gds: {
    BookRequest: MessageTypeDefinition<_gds_BookRequest, _gds_BookRequest__Output>
    BookResponse: MessageTypeDefinition<_gds_BookResponse, _gds_BookResponse__Output>
    BookingListRequest: MessageTypeDefinition<_gds_BookingListRequest, _gds_BookingListRequest__Output>
    BookingListResponse: MessageTypeDefinition<_gds_BookingListResponse, _gds_BookingListResponse__Output>
    BookingSummary: MessageTypeDefinition<_gds_BookingSummary, _gds_BookingSummary__Output>
    CancelRequest: MessageTypeDefinition<_gds_CancelRequest, _gds_CancelRequest__Output>
    CancelResponse: MessageTypeDefinition<_gds_CancelResponse, _gds_CancelResponse__Output>
    CancellationPolicy: MessageTypeDefinition<_gds_CancellationPolicy, _gds_CancellationPolicy__Output>
    ClientInfo: MessageTypeDefinition<_gds_ClientInfo, _gds_ClientInfo__Output>
    CompanyInfo: MessageTypeDefinition<_gds_CompanyInfo, _gds_CompanyInfo__Output>
    DateRange: MessageTypeDefinition<_gds_DateRange, _gds_DateRange__Output>
    DetailsRequest: MessageTypeDefinition<_gds_DetailsRequest, _gds_DetailsRequest__Output>
    DetailsResponse: MessageTypeDefinition<_gds_DetailsResponse, _gds_DetailsResponse__Output>
    HotelResult: MessageTypeDefinition<_gds_HotelResult, _gds_HotelResult__Output>
    ModifyRequest: MessageTypeDefinition<_gds_ModifyRequest, _gds_ModifyRequest__Output>
    ModifyResponse: MessageTypeDefinition<_gds_ModifyResponse, _gds_ModifyResponse__Output>
    Occupancy: MessageTypeDefinition<_gds_Occupancy, _gds_Occupancy__Output>
    Passenger: MessageTypeDefinition<_gds_Passenger, _gds_Passenger__Output>
    PenaltyTier: MessageTypeDefinition<_gds_PenaltyTier, _gds_PenaltyTier__Output>
    PriceChangeInfo: MessageTypeDefinition<_gds_PriceChangeInfo, _gds_PriceChangeInfo__Output>
    PricingInfo: MessageTypeDefinition<_gds_PricingInfo, _gds_PricingInfo__Output>
    ProviderService: SubtypeConstructor<typeof grpc.Client, _gds_ProviderServiceClient> & { service: _gds_ProviderServiceDefinition }
    SearchRequest: MessageTypeDefinition<_gds_SearchRequest, _gds_SearchRequest__Output>
    SearchResponse: MessageTypeDefinition<_gds_SearchResponse, _gds_SearchResponse__Output>
    VoucherRequest: MessageTypeDefinition<_gds_VoucherRequest, _gds_VoucherRequest__Output>
    VoucherResponse: MessageTypeDefinition<_gds_VoucherResponse, _gds_VoucherResponse__Output>
  }
}

