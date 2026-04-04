import axios, { AxiosInstance } from 'axios';
import xml2js from 'xml2js';
import FormData from 'form-data';
import { safeLog } from '../utils/Logger';

export class VeturisClient {
    private client: AxiosInstance;
    private parser: xml2js.Parser;
    private builder: xml2js.Builder;

    constructor(timeoutMs: number = 25000) {
        this.client = axios.create({
            baseURL: process.env.VETURIS_URL || 'https://xmlservices.veturis.com/xmlWebServices.php',
            timeout: timeoutMs,
            decompress: false
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
                    'Accept-Encoding': 'gzip',
                    'User-Agent': 'LetsGoTravel-GDS-Adapter/1.1',
                    'X-LTG-Trace-ID': traceId
                }
            });
            return response.data.toString();
        } catch (error: any) {
            if (error.response?.data) {
                return error.response.data.toString();
            }
            safeLog('❌ Veturis Communication Failure', { message: error.message });
            throw new Error(`ERROR_GDS_COMMUNICATION: ${error.message}`);
        }
    }

    public encodeBookingToken(sessionId: string, roomId: string): string {
        return Buffer.from(`${sessionId}|${roomId}`).toString('base64');
    }

    public decodeBookingToken(token: string): { sessionId: string, roomId: string } {
        const decoded = Buffer.from(token, 'base64').toString('ascii');
        const [sessionId, roomId] = decoded.split('|');
        return { sessionId, roomId };
    }

    public async parseXML<T>(xmlResult: string): Promise<T> {
        return await this.parser.parseStringPromise(xmlResult);
    }
    
    public buildXML(obj: Record<string, unknown>): string {
        return this.builder.buildObject(obj);
    }
}
