/**
 * ProviderService.ts
 * Sprint 4/5 — T1.1
 *
 * Implementación universal del contrato IProviderService.
 * Orquestador principal que delega la lógica compleja al FlowExecutor.
 */
import { 
  IProviderService,
  IStandardSearchRequest,
  IStandardSearchResponse,
  IStandardBookRequest,
  IStandardBookResponse,
  IDetailsRequest,
  IDetailsResponse,
  ICancelRequest,
  ICancelResponse,
  IListBookingsRequest
} from '../interfaces';
import { safeLog } from '../middleware/pii-filter';
import { ICacheService } from '../cache/ICacheService';
import { CacheFactory } from '../cache/CacheFactory';
import { VeturisMapper } from '../mappers/VeturisMapper';
import { IAuthStrategy } from '../auth/IAuthStrategy';
import { AuthFactory } from '../auth/AuthFactory';
import { create } from 'xmlbuilder2';
import { XMLParser } from 'fast-xml-parser';
import axios from 'axios';

export class ProviderService implements IProviderService {
  private parser: XMLParser;
  private authStrategy: IAuthStrategy;

  constructor(private cache: ICacheService) {
    this.parser = new XMLParser({ 
      ignoreAttributes: false, 
      attributeNamePrefix: "@_",
      allowBooleanAttributes: true
    });
    this.authStrategy = AuthFactory.create();
  }

  /**
   * Realiza la búsqueda de disponibilidad en Veturis.
   * Utiliza un patrón de caché de 5 minutos para optimizar costes y latencia.
   * Valida errores nativos de Veturis (ERROR tag) antes de retornar.
   */
  async searchAvailability(req: IStandardSearchRequest): Promise<IStandardSearchResponse> {
    const provider = process.env.PROVIDER_NAME || 'veturis';
    const cacheKey = `${provider}:search:${JSON.stringify(req.providerIds)}:${req.checkIn}:${req.checkOut}`;

    try {
      // 1. Intentar hit de caché (Recomendado para Step 1)
      const cached = await this.cache.get<IStandardSearchResponse>(cacheKey);
      if (cached) {
        safeLog.info(`Cache HIT for ${cacheKey}`);
        return cached;
      }
    } catch (err) {
      safeLog.warn('Cache error (GET):', err);
    }

    safeLog.info('searchAvailability called for:', req.providerIds);
    
    // 1. Mapeo a Estructura XML Anidada
    const xmlObj = VeturisMapper.mapSearchRequest(req);
    const xmlStr = create({ version: '1.0' }).ele(xmlObj).end({ prettyPrint: false });

    safeLog.info('Enviando Payload Veturis:', xmlObj);

    // 2. HTTP Request (Form Data)
    let rawResponseData = '';
      const rawResponse = await this.executeVeturisCall(xmlObj, 15000); // Timeout más corto para Search
      const parsedNative = this.parser.parse(rawResponse);
      this.validateVeturisResponse(parsedNative);

    // 4. Mapeo al Centralizador Estándar
    // Asumimos que la respuesta está envuelta en <SearchAvailabilityRS>
    const responseNode = parsedNative.SearchAvailabilityRS || parsedNative;
    const response = VeturisMapper.mapSearchResponse(responseNode);

    // 3. Guardar en caché si hay resultados (TTL configurable)
    if (response.items.length > 0) {
      try {
        await this.cache.set(cacheKey, response, 300);
        safeLog.info(`Cache SET for ${cacheKey}`);
      } catch (err) {
        safeLog.warn('Cache error (SET):', err);
      }
    }

    return response;
  }

  /**
   * book (Reserva)
   * Pattern: Flow (Multi-Step).
   * Veturis: Search -> AdditionalInformation -> BookingConfirmation
   */
  async book(req: IStandardBookRequest): Promise<IStandardBookResponse> {
    safeLog.info('book called', req);

    try {
      // 1. Mapeo a XML RQ
      const xmlObj = VeturisMapper.mapBookRequest(req);
      const rawResponse = await this.executeVeturisCall(xmlObj);

      // 2. Parsing
      const parsedNative = this.parser.parse(rawResponse);
      this.validateVeturisResponse(parsedNative);

      // 3. Mapeo de salida
      const responseNode = parsedNative.BookingConfirmationRS || parsedNative;
      if (responseNode.err) throw new Error(`VeturisBookError: ${responseNode.err}`);

      return VeturisMapper.mapBookResponse(parsedNative);
    } catch (err: any) {
      safeLog.error('Error en book (Veturis):', err.message);
      throw err;
    }
  }

  /**
   * getDetails (Detalles / Cotización)
   * Veturis: Llama a AdditionalInformationRQ.
   */
  async getDetails(req: IDetailsRequest): Promise<IDetailsResponse> {
    safeLog.info('getDetails called', req);

    try {
      const xmlObj = VeturisMapper.mapDetailsRequest(req);
      const rawResponse = await this.executeVeturisCall(xmlObj, 20000); // 20s for Details
      const parsedNative = this.parser.parse(rawResponse);
      this.validateVeturisResponse(parsedNative);

      const responseNode = parsedNative.AdditionalInformationRS || parsedNative;
      const response = VeturisMapper.mapDetailsResponse(parsedNative);

      // 4. Validación de Saldo (Fail-fast según Auditoría G10)
      if (!response.extraData?.paymentAllowed) {
        safeLog.error(`ABORT: Agencia sin crédito SL o bloqueo operativo detected en AdditionalInformationRS.`);
        throw new Error('VeturisPaymentError: La agencia no dispone de crédito SL para confirmar esta tarifa.');
      }

      const balance = response.item.metadata?.agencyBalance;
      if (balance) {
        const available = parseFloat(balance.AmountAvailable);
        const cost = response.item.pricing.netPrice;
        if (cost > available) {
          safeLog.warn(`Saldo Insuficiente: Costo=${cost}, Disponible=${available}`);
          // G10: Solo advertimos si no es bloqueante por código, pero bloqueamos si es aritmético.
          throw new Error('VeturisCreditLimit: Saldo disponible insuficiente para completar la transacción.');
        }
      }

      return response;
    } catch (err: any) {
      safeLog.error('Error en getDetails (Veturis):', err.message);
      throw err;
    }
  }

  /**
   * cancel (Cancelación)
   */
  async cancel(req: ICancelRequest): Promise<ICancelResponse> {
    safeLog.info('cancel called', req);
    
    try {
      const xmlObj = VeturisMapper.mapCancelRequest(req);
      const rawResponse = await this.executeVeturisCall(xmlObj, 25000); // 25s for Cancel
      // 2. Parsing
      const parsedNative = this.parser.parse(rawResponse);
      this.validateVeturisResponse(parsedNative);

      const responseNode = parsedNative.BookingCancellationRS || parsedNative;
      return VeturisMapper.mapCancelResponse(parsedNative);
    } catch (err: any) {
      safeLog.error('Error en cancel (Veturis):', err.message);
      throw err;
    }
  }

  /**
   * listBookings (Listado)
   */
  async listBookings(req: IListBookingsRequest): Promise<IStandardBookResponse[]> {
    safeLog.info('listBookings called', req);
    
    try {
      const xmlObj = VeturisMapper.mapListRequest(req);
      const rawResponse = await this.executeVeturisCall(xmlObj, 60000); // 1m for List (can be many)
      // 2. Parsing
      const parsedNative = this.parser.parse(rawResponse);
      this.validateVeturisResponse(parsedNative);

      const responseNode = parsedNative.BookingListRS || parsedNative;
      return VeturisMapper.mapListResponse(parsedNative);
    } catch (err: any) {
      safeLog.error('Error en listBookings (Veturis):', err.message);
      throw err;
    }
  }

  /**
   * Valida errores nativos de Veturis que no vienen como tag 'err' estándar.
   */
  private validateVeturisResponse(parsedNative: any): void {
    const root = parsedNative.SearchAvailabilityRS || 
                 parsedNative.AdditionalInformationRS || 
                 parsedNative.BookingConfirmationRQ || // Nota: Veturis a veces manda RS parcial
                 parsedNative.BookingConfirmationRS || 
                 parsedNative.BookingCancellationRS ||
                 parsedNative.BookingListRS ||
                 parsedNative;

    // 1. FAIL-FAST: Nodo ERROR global (Veturis Master Error)
    if (root.ERROR === '1') {
      const msgs = Array.isArray(root.Errors?.Error)
        ? root.Errors.Error.join(' | ')
        : root.Errors?.Error ?? 'Error desconocido';
      throw new Error(`VeturisFastFail: ${msgs}`);
    }

    if (root.err) throw new Error(`VeturisError: ${root.err}`);
    
    // 2. Errores estructurales KO
    if (parsedNative.ResponseDetails && parsedNative.ResponseDetails.Status === "KO") {
      throw new Error(`VeturisStructuralError: ${parsedNative.ResponseDetails.Error || 'Fallado'}`);
    }

    if (root.ERROR && root.ERROR !== "0") {
      const errorMsg = root.Errors?.Error || root.ERROR;
      throw new Error(`VeturisNativeError: ${JSON.stringify(errorMsg)}`);
    }
  }

  /**
   * Helper privado para centralizar la comunicación con Veturis
   */
  private async executeVeturisCall(xmlObj: any, timeoutMs: number = 30000): Promise<string> {
    const xmlStr = create({ version: '1.0', encoding: 'UTF-8' }).ele(xmlObj).end({ prettyPrint: false });
    const formData = new URLSearchParams();
    formData.append('xmlRQ', xmlStr);

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://xmlservices.veturis.com/xmlWebServices.php'
      : (process.env.VETURIS_BASE_URL_DEV || 'http://testxmlservices.veturis.com/xmlWebServices.php');
    
    // Inyectar autenticación (User, Password, AgencyUser, AgencyPassword)
    const config = await this.authStrategy.applyAuth({
      data: formData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    } as any);

    const result = await axios.post(baseUrl, config.data.toString(), {
      headers: config.headers,
      timeout: timeoutMs
    });

    return result.data;
  }
}

// Exportar instancia única inyectada con la caché configurada
export const providerService = new ProviderService(CacheFactory.getInstance());
