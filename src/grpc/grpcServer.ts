import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { ProtoGrpcType } from '../interfaces/gen/provider';
import { ProviderServiceHandlers } from '../interfaces/gen/provider/ProviderService';
import { providerService } from '../services/ProviderService';
import { mapProviderErrorToGrpc } from './mapProviderErrorToGrpc';
import { ListBookingsRequest__Output } from '@interfaces/gen/provider/ListBookingsRequest';
import { ListBookingsResponse } from '@interfaces/gen/provider/ListBookingsResponse';
import { safeLog } from '../middleware/pii-filter';

const PROTO_PATH = path.resolve(__dirname, '../../proto/provider.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = (grpc.loadPackageDefinition(packageDefinition) as unknown) as ProtoGrpcType;

// Handler genérico asíncrono que envuelve llamadas al providerService
// y mapea errores automáticamente.
const createHandler = <TRequest, TResponse>(
  method: (req: TRequest) => Promise<TResponse>
): grpc.handleUnaryCall<TRequest, TResponse> => {
  return async (call, callback) => {
    try {
      const response = await method(call.request);
      callback(null, response);
    } catch (error: any) {
      safeLog.error(`[gRPC] Error in method:`, { message: error.message, stack: error.stack });
      const grpcError = mapProviderErrorToGrpc(error);
      callback({
        code: grpcError.code,
        message: grpcError.message,
      });
    }
  };
};

const handlers: ProviderServiceHandlers = {
  SearchAvailability: async (call, callback) => {
    try {
      const response = await providerService.searchAvailability({
        checkIn: call.request.checkIn || '',
        checkOut: call.request.checkOut || '',
        providerIds: [call.request.destinationId || ''],
        // CORRECCIÓN: gRPC Occupancy -> IStandard OccupancyRoom
        occupancy: (call.request.occupancies || []).map(occ => ({
          rooms: 1, // gRPC trata cada item como una habitación
          adults: occ.adults || 2,
          children: (occ.childrenAges || []).length,
          childrenAges: occ.childrenAges || [],
        })),
        extraData: call.request.extraData || undefined
      });

      callback(null, {
        results: response.items.map(item => ({
          providerItemId: item.providerItemId,
          itemName: item.itemName,
          pricing: item.pricing,
          bookingToken: item.bookingToken,
          cancellationPolicy: {
            penaltyStartDate: item.cancellationPolicy.penaltyStartDate,
            penaltyAmount: item.cancellationPolicy.penaltyAmount,
            currency: item.pricing.currency,
          },
        })),
      });
    } catch (error: any) {
      const grpcError = mapProviderErrorToGrpc(error);
      callback({ code: grpcError.code, message: grpcError.message });
    }
  },

  Book: async (call, callback) => {
    try {
      const response = await providerService.book({
        bookingToken: call.request.bookingToken || '',
        holder: {
          name: call.request.holderName || '',
          surname: call.request.holderSurname || '',
          email: call.request.email || '',
        },
        passengers: (call.request.passengers || []).map(p => ({
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          documentType: 'PASSPORT',
          documentNumber: p.documentNumber || '',
          dateOfBirth: p.birthDate || '',
        })),
        clientReferenceId: call.request.clientReferenceId || undefined,
        comments: call.request.comments || undefined,
        extraData: call.request.extraData || undefined
      });

      callback(null, {
        confirmationId: response.confirmationId,
        status: response.status,
        securityCode: response.securityCode, // CORRECCIÓN: Mapear SecurityCode
        pricing: undefined,
        cancellationPolicy: response.cancellationPolicy ? {
          penaltyStartDate: response.cancellationPolicy.penaltyStartDate,
          penaltyAmount: response.cancellationPolicy.penaltyAmount,
          currency: '',
        } : undefined,
      });
    } catch (error: any) {
      const grpcError = mapProviderErrorToGrpc(error);
      callback({ code: grpcError.code, message: grpcError.message });
    }
  },

  GetDetails: async (call, callback) => {
    try {
      // Veturis usa el bookingToken como ID dinámico para detalles
      const response = await providerService.getDetails({
        bookingToken: call.request.bookingToken || '',
      });
      callback(null, {
        result: {
          providerItemId: response.item.providerItemId,
          itemName: response.item.itemName,
          pricing: response.item.pricing,
          bookingToken: response.item.bookingToken,
          cancellationPolicy: {
            penaltyStartDate: response.item.cancellationPolicy.penaltyStartDate,
            penaltyAmount: response.item.cancellationPolicy.penaltyAmount,
            currency: response.item.pricing.currency,
          },
        },
      });
    } catch (error: any) {
      const grpcError = mapProviderErrorToGrpc(error);
      callback({ code: grpcError.code, message: grpcError.message });
    }
  },

  Cancel: async (call, callback) => {
    try {
      const response = await providerService.cancel({
        confirmationId: call.request.confirmationId || '',
        securityCode: call.request.securityCode || undefined // Soporte SecurityCode
      });
      callback(null, {
        status: response.success ? 'CANCELLED' : 'ERROR',
        cancellationId: '',
      });
    } catch (error: any) {
      const grpcError = mapProviderErrorToGrpc(error);
      callback({ code: grpcError.code, message: grpcError.message });
    }
  },
  ListBookings: async (call, callback) => {
    try {
      const response = await providerService.listBookings({
        fromDate: call.request.fromDate || '',
        toDate: call.request.toDate || '',
        status: call.request.status || undefined
      });
      callback(null, {
        bookings: response.map(b => ({
          confirmationId: b.confirmationId,
          status: b.status,
          securityCode: b.securityCode,
        }))
      });
    } catch (error: any) {
      const grpcError = mapProviderErrorToGrpc(error);
      callback({ code: grpcError.code, message: grpcError.message });
    }
  },
};

export function startGrpcServer() {
  const server = new grpc.Server();
  server.addService(proto.provider.ProviderService.service, handlers);
  
  const port = process.env.PORT_GRPC || '50051';
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      safeLog.error('[gRPC] server bind error:', err);
      return;
    }
    safeLog.info(`[gRPC] Server running at http://0.0.0.0:${port}`);
  });
}
