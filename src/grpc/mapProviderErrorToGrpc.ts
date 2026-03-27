/**
 * mapProviderErrorToGrpc.ts
 * Sprint 4 — T3.1
 *
 * Convierte ProviderError (códigos HTTP) a status codes de gRPC nativos.
 * Basado en la skill grpc-protobuf.
 */
import * as grpc from '@grpc/grpc-js';
import { ProviderError } from '../interfaces/IProviderError';

export interface GrpcErrorResponse {
  code: grpc.status;
  message: string;
}

export function mapProviderErrorToGrpc(err: any): GrpcErrorResponse {
  // 1. Si es un ProviderError instanciado
  if (err instanceof ProviderError) {
    const { httpStatus, message } = err;
    
    switch (httpStatus) {
      case 400: return { code: grpc.status.INVALID_ARGUMENT, message };
      case 401: return { code: grpc.status.PERMISSION_DENIED, message };
      case 404: return { code: grpc.status.NOT_FOUND, message };
      case 409: return { code: grpc.status.ALREADY_EXISTS, message }; // O FAILED_PRECONDITION
      case 429: return { code: grpc.status.RESOURCE_EXHAUSTED, message };
      case 504: return { code: grpc.status.DEADLINE_EXCEEDED, message };
      case 502: case 500: return { code: grpc.status.UNAVAILABLE, message };
      default: return { code: grpc.status.INTERNAL, message };
    }
  }

  // 2. Si es un error genérico (no debería pasar si el flujo está bien protegido)
  console.error('[mapProviderErrorToGrpc] Unexpected error type:', err);
  return {
    code: grpc.status.INTERNAL,
    message: err.message || 'Unknown internal error in adapter template',
  };
}
