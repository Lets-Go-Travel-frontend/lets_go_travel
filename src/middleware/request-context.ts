import { Request, Response, NextFunction } from 'express';
import { setCorrelationId } from './pii-filter';

/**
 * Middleware para extraer el x-correlation-id de las cabeceras
 * y establecerlo en el contexto del logger.
 */
export const requestContextMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.header('x-correlation-id') || null;
  setCorrelationId(correlationId);
  next();
};
