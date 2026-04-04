import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import dotenv from 'dotenv';
import http from 'http';
import { VeturisService } from './services/VeturisService';
import { safeLog } from './utils/Logger';
import { SearchSchema } from './interfaces/schemas/SearchSchema';
import { DetailsRequestSchema } from './interfaces/schemas/DetailsSchema';
import { BookingRequestSchema } from './interfaces/schemas/BookingSchema';
import { CancelRequestSchema } from './interfaces/schemas/CancelSchema';
import { BookingListRequestSchema } from './interfaces/schemas/BookingListSchema';
import { VoucherRequestSchema } from './interfaces/schemas/VoucherSchema';
import { ModifyRequestSchema } from './interfaces/schemas/ModifySchema';

// Inyectar variables locales
dotenv.config();

// ==========================================
// 🚨 FAIL-FAST (Auditoría Medioambiental)
// ==========================================
const requiredEnvVars = [
    'VETURIS_USER', 
    'VETURIS_PASSWORD', 
    'VETURIS_AGENCY_USER', 
    'VETURIS_AGENCY_PASSWORD',
    'BRIDGE_API_KEY'
];

requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        console.error(`[CRITICAL BOOT FAILURE] ❌ Variable global faltante: ${envVar}`);
        process.exit(1);
    }
});

const PROTO_PATH = path.resolve(__dirname, './interfaces/gen/provider.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const gdsProto = (grpc.loadPackageDefinition(packageDefinition) as unknown as Record<string, Record<string, any>>).gds;
const vetService = new VeturisService();

/**
 * gRPC Handlers: Mapeo directo al Service Pureza Hollow Shell
 */
const handlers: Record<string, grpc.UntypedHandleCall> = {
    SearchAvailability: async (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
        try {
            safeLog('Search Request (gRPC)', call.request);
            const result = await vetService.search(call.request);
            callback(null, result);
        } catch (error: any) {
            callback({ code: grpc.status.INTERNAL, details: error.message });
        }
    },
    GetDetails: async (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
        try {
            safeLog('Details Request (gRPC)', call.request);
            const result = await vetService.details(call.request.bookingToken);
            callback(null, result);
        } catch (error: any) {
            callback({ code: grpc.status.INTERNAL, details: error.message });
        }
    },
    Book: async (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
        try {
            safeLog('Book Request (gRPC)', call.request);
            const result = await vetService.book(call.request);
            callback(null, result);
        } catch (error: any) {
            callback({ code: grpc.status.INTERNAL, details: error.message });
        }
    },
    Cancel: async (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
        try {
            safeLog('Cancel Request (gRPC)', call.request);
            const result = await vetService.cancel(call.request);
            callback(null, result);
        } catch (error: any) {
            callback({ code: grpc.status.INTERNAL, details: error.message });
        }
    },
    BookingList: async (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
        try {
            safeLog('BookingList Request (gRPC)', call.request);
            const result = await vetService.bookingList(call.request);
            callback(null, result);
        } catch (error: any) {
            callback({ code: grpc.status.INTERNAL, details: error.message });
        }
    },
    GetVoucher: async (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
        try {
            safeLog('Voucher Request (gRPC)', call.request);
            const validated = VoucherRequestSchema.safeParse(call.request);
            if (!validated.success) {
                callback({ code: grpc.status.INVALID_ARGUMENT, details: JSON.stringify(validated.error.flatten()) });
                return;
            }
            const voucher = await vetService.getVoucher(validated.data);
            callback(null, voucher);
        } catch (error: any) {
            callback({ code: grpc.status.INTERNAL, details: error.message });
        }
    },
    Modify: async (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
        try {
            safeLog('Modify Request', call.request);
            const validated = ModifyRequestSchema.safeParse(call.request);
            if (!validated.success) {
                callback({ code: grpc.status.INVALID_ARGUMENT, details: JSON.stringify(validated.error.flatten()) });
                return;
            }
            const result = await vetService.modify(validated.data);
            callback(null, result);
        } catch (error: any) {
            callback({ code: grpc.status.INTERNAL, details: error.message });
        }
    }
};

/**
 * [Fase FINAL: La Última Milla]
 * REST Bridge para Next.js (bypass gRPC por compatibilidad frontend)
 */
const startRestBridge = () => {
    const port = process.env.PORT || 3005;
    http.createServer(async (req, res) => {
        console.log(`[BRIDGE DEBUG] Incoming: ${req.method} ${req.url}`);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        // --- RUTA GET CATALOGO (SIN BODY) ---
        if (req.url?.startsWith('/hotels') && req.method === 'GET') {
            try {
                const url = new URL(req.url, `http://${req.headers.host}`);
                const page = parseInt(url.searchParams.get('page') || '1');
                const limit = parseInt(url.searchParams.get('limit') || '20');
                const data = vetService.getHotels(page, limit);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            } catch (err: any) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'CATALOG_ERROR', message: err.message }));
            }
            return;
        }

        // --- RUTAS POST (CON BODY) ---
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                if (req.url === '/health' && req.method === 'GET') {
                    let redisStatus = 'DOWN';
                    let veturisStatus = 'DOWN';

                    try {
                        const redis = require('./cache/RedisSingleton').RedisSingleton.getInstance();
                        const pong = await redis.ping();
                        if (pong === 'PONG') redisStatus = 'UP';
                    } catch {}

                    try {
                        // Check de conectividad TCP básica con Veturis puerto 443
                        const net = require('net');
                        const socket = net.createConnection(443, 'xmlservices.veturis.com');
                        await new Promise((resolve, reject) => {
                            socket.on('connect', () => { socket.end(); resolve(true); });
                            socket.on('error', reject);
                            socket.setTimeout(2000, () => { socket.destroy(); reject(); });
                        });
                        veturisStatus = 'UP';
                    } catch {}

                    const isHealthy = redisStatus === 'UP' && veturisStatus === 'UP';
                    res.writeHead(isHealthy ? 200 : 503, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        status: isHealthy ? 'HEALTHY' : 'DEGRADED',
                        checks: { redis: redisStatus, veturis: veturisStatus },
                        bridge: 'ACTIVE'
                    }));
                    return;
                }

                if (req.method !== 'POST') {
                    res.writeHead(405);
                    res.end();
                    return;
                }

                const params = body ? JSON.parse(body) : {};
                let result: any;

                if (req.url === '/search') {
                    const validated = SearchSchema.safeParse(params);
                    if (!validated.success) throw validated.error;
                    result = await vetService.search(validated.data);
                } 
                else if (req.url === '/details') {
                    const validated = DetailsRequestSchema.safeParse(params);
                    if (!validated.success) throw validated.error;
                    result = await vetService.details(validated.data.bookingToken);
                }
                else if (req.url === '/book') {
                    const validated = BookingRequestSchema.safeParse(params);
                    if (!validated.success) throw validated.error;
                    result = await vetService.book(validated.data);
                }
                else if (req.url === '/cancel') {
                    const validated = CancelRequestSchema.safeParse(params);
                    if (!validated.success) throw validated.error;
                    result = await vetService.cancel(validated.data);
                }
                else if (req.url === '/booking-list') {
                    const validated = BookingListRequestSchema.safeParse(params);
                    if (!validated.success) throw validated.error;
                    result = await vetService.bookingList(validated.data);
                }
                else if (req.url === '/voucher') {
                    const validated = VoucherRequestSchema.safeParse(params);
                    if (!validated.success) throw validated.error;
                    result = await vetService.getVoucher(validated.data);
                }
                else if (req.url === '/modify') {
                    const validated = ModifyRequestSchema.safeParse(params);
                    if (!validated.success) throw validated.error;
                    result = await vetService.modify(validated.data);
                }
                else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'NOT_FOUND' }));
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (error: any) {
                safeLog('❌ REST Bridge Error', { 
                    message: error.message || 'Internal Server Error',
                    issues: error.issues,
                    stack: error.stack 
                });
                res.writeHead(error.name === 'ZodError' ? 400 : 500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    status: 'KO', 
                    message: error.message || 'Internal Server Error',
                    errors: error.issues 
                }));
            }
        });
    }).listen(port, () => {
        console.log(`[REST Bridge] 🌉 Bridge activo en puerto ${port}`);
    });
};

const startServer = () => {
    const server = new grpc.Server();
    const serviceDef = gdsProto.ProviderService.service;
    
    server.addService(serviceDef, handlers);

    const port = process.env.PORT_GRPC || 50052;
    server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error(`[Veturis gRPC] ❌ Error binding server: ${err.message}`);
            return;
        }
        console.log(`[Veturis gRPC] 🚀 Servidor principal en puerto ${port}`);
        startRestBridge();
    });
};

startServer();
