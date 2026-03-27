/**
 * IProviderService.ts
 * Contrato universal que TODO adaptador DEBE implementar.
 * ⚠️ NO modificar entre clones de agencia.
 *
 * Agente: 00-arquitecto (diseño) + 01-implementador (código)
 * Skill: api-adapter-pattern
 */
import {
  IStandardSearchRequest,
  IStandardSearchResponse,
  IStandardBookRequest,
  IStandardBookResponse,
  IDetailsRequest,
  IDetailsResponse,
  ICancelRequest,
  ICancelResponse,
  IListBookingsRequest
} from './index';

export interface IProviderService {
  searchAvailability(req: IStandardSearchRequest): Promise<IStandardSearchResponse>;
  getDetails(req: IDetailsRequest): Promise<IDetailsResponse>;
  book(req: IStandardBookRequest): Promise<IStandardBookResponse>;
  cancel(req: ICancelRequest): Promise<ICancelResponse>;
  listBookings(req: IListBookingsRequest): Promise<IStandardBookResponse[]>;
}
