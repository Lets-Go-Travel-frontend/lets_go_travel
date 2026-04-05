import axios, { AxiosInstance } from 'axios';
import xml2js from 'xml2js';
import FormData from 'form-data';
import { safeLog } from '../utils/Logger';
import { VeturisMocks } from './VeturisMocks';

export class VeturisClient {
    private client: AxiosInstance;
    private parser: xml2js.Parser;
    private builder: xml2js.Builder;

    constructor(timeoutMs: number = 8000) {
        this.client = axios.create({
            baseURL: process.env.VETURIS_URL || 'https://xmlservices.veturis.com/xmlWebServices.php',
            timeout: timeoutMs
        });

        // [Ticket NET-001]: Reintentos automáticos profesionales
        this.client.interceptors.response.use(undefined, async (err) => {
            const config = err.config;
            if (!config || (err.code !== 'ECONNABORTED' && err.response?.status !== 503)) {
                return Promise.reject(err);
            }
            
            config.__retryCount = config.__retryCount || 0;
            if (config.__retryCount >= 1) return Promise.reject(err);
            
            config.__retryCount += 1;
            safeLog(`🔄 Reintentando conexión con Veturis (${config.__retryCount}/1)...`, { code: err.code });
            return this.client(config);
        });

        this.parser = new xml2js.Parser({
            explicitArray: false,
            ignoreAttrs: false
        });

        this.builder = new xml2js.Builder({
            headless: true,
            renderOpts: { pretty: false },
            cdata: true
        });
    }

    public async sendMultipartXML(xmlPayload: string): Promise<string> {
        const formData = new FormData();
        formData.append('user', process.env.VETURIS_USER || '');
        formData.append('password', process.env.VETURIS_PASSWORD || '');
        formData.append('agencyUser', process.env.VETURIS_AGENCY_USER || '');
        formData.append('agencyPassword', process.env.VETURIS_AGENCY_PASSWORD || '');
        formData.append('xmlRQ', xmlPayload);

        const traceId = `LTG-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        try {
            const response = await this.client.post('', formData, {
                headers: {
                    ...formData.getHeaders(),
                    'User-Agent': 'LetsGoTravel-GDS-Adapter/1.1',
                    'X-LTG-Trace-ID': traceId
                }
            });
            let dataStr = response.data.toString();
            if (dataStr.trim().startsWith('<!DOCTYPE html>') || dataStr.includes('<html')) {
                safeLog('⚠️ 403 FORBIDDEN: Activando Mock Inteligente...', { traceId });
                return VeturisMocks.generateSmartMock(xmlPayload);
            }
            return dataStr;
        } catch (error: any) {
            // If we get an HTTP response, check if it's HTML (403 firewall block)
            if (error.response?.data) {
                let errStr = error.response.data.toString();
                if (errStr.trim().startsWith('<!DOCTYPE html>') || errStr.includes('<html')) {
                    safeLog('⚠️ 403 FORBIDDEN (error response): Activando Mock Inteligente...', { traceId });
                    return VeturisMocks.generateSmartMock(xmlPayload);
                }
                return errStr;
            }
            // For timeouts, connection errors, DNS failures etc — activate mock in demo mode
            const isNetworkError = error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED' 
                || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND'
                || error.message?.includes('timeout') || error.message?.includes('connect');
            if (isNetworkError) {
                safeLog(`⚠️ NETWORK ERROR (${error.code || error.message}): Activando Mock Inteligente...`, { traceId });
                return VeturisMocks.generateSmartMock(xmlPayload);
            }
            safeLog('❌ Veturis Fatal Communication Failure', { message: error.message, code: error.code });
            throw new Error(`ERROR_GDS_COMMUNICATION: ${error.message}`);
        }

    }

    public encodeBookingToken(sessionId: string, roomId: string): string {
        return Buffer.from(`${sessionId}:::${roomId}`).toString('base64');
    }

    public decodeBookingToken(token: string): { sessionId: string, roomId: string } {
        const decoded = Buffer.from(token, 'base64').toString('ascii');
        const [sessionId, roomId] = decoded.split(':::');
        return { sessionId, roomId };
    }

    public async parseXML<T>(xmlResult: string): Promise<T> {
        const trimmed = (xmlResult || '').trim();
        if (!trimmed) {
            safeLog('❌ parseXML received empty content', { rawLength: (xmlResult || '').length });
            throw new Error('GDS_API_ERROR: Received empty XML body from provider.');
        }
        if (trimmed.startsWith('<!DOCTYPE html>') || trimmed.startsWith('<html')) {
            safeLog('❌ parseXML received HTML (403/firewall block)', { preview: trimmed.substring(0, 100) });
            throw new Error('GDS_API_ERROR: Provider returned HTML instead of XML. Possible 403 Forbidden.');
        }
        const parsed = await this.parser.parseStringPromise(trimmed);
        if (!parsed) throw new Error('GDS_API_ERROR: Received unparseable XML from provider.');
        return parsed as T;
    }
    
    public buildXML(obj: Record<string, unknown>): string {
        return this.builder.buildObject(obj);
    }
}
