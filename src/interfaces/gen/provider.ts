import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ProviderServiceClient as _provider_ProviderServiceClient, ProviderServiceDefinition as _provider_ProviderServiceDefinition } from './provider/ProviderService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  provider: {
    BookRequest: MessageTypeDefinition
    BookResponse: MessageTypeDefinition
    CancelRequest: MessageTypeDefinition
    CancelResponse: MessageTypeDefinition
    CancellationPolicy: MessageTypeDefinition
    DetailsRequest: MessageTypeDefinition
    DetailsResponse: MessageTypeDefinition
    ListBookingsRequest: MessageTypeDefinition
    ListBookingsResponse: MessageTypeDefinition
    Occupancy: MessageTypeDefinition
    Passenger: MessageTypeDefinition
    PricingInfo: MessageTypeDefinition
    ProviderService: SubtypeConstructor<typeof grpc.Client, _provider_ProviderServiceClient> & { service: _provider_ProviderServiceDefinition }
    SearchRequest: MessageTypeDefinition
    SearchResponse: MessageTypeDefinition
    SearchResult: MessageTypeDefinition
  }
}

