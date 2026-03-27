/**
 * server.ts
 * Entry point del microservicio. Sistema Dual gRPC + REST.
 */
import 'dotenv/config';
import express from 'express';
import { startGrpcServer } from './grpc/grpcServer';
import { validateEnvironment } from './config';
import { providerService } from './services/ProviderService';
import { errorHandler } from './middleware/errorHandler';

// 1. Validar entorno antes de arrancar (Fail-fast)
validateEnvironment('veturis');

// 2. Servidor Express (REST)
import { requestContextMiddleware } from './middleware/request-context';

export const app = express();
app.use(express.json());
app.use(requestContextMiddleware);

// Endpoint de salud (Health Check)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'ms-veturis'
  });
});

// --- Rutas del Adaptador (Solo para QA/Debugging) ---

app.post('/search', async (req, res, next) => {
  try {
    const response = await providerService.searchAvailability(req.body);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

app.post('/book', async (req, res, next) => {
  try {
    const response = await providerService.book(req.body);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

app.post('/details', async (req, res, next) => {
  try {
    const response = await providerService.getDetails(req.body);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

app.post('/cancel', async (req, res, next) => {
  try {
    const response = await providerService.cancel(req.body);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Middleware centralizado de errores
app.use(errorHandler);

// 3. Arrancar gRPC
startGrpcServer();

// 4. Arrancar REST
const restPort = process.env.PORT_REST || '3000';
app.listen(restPort, () => {
  console.log(`[REST] Server running at http://localhost:${restPort}`);
});
