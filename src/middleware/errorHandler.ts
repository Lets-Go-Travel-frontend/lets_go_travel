/**
 * errorHandler.ts — Middleware Express para errores del proveedor
 * Sprint 1 — S1-T4.6
 *
 * Agente: 01-implementador | Skill: error-translator
 * Intercepta ProviderError y devuelve JSON estándar al Centralizador.
 */
import { Request, Response, NextFunction } from 'express';
import { ProviderError } from '../interfaces/IProviderError';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ProviderError) {
    res.status(err.httpStatus).json(err.toJSON());
    return;
  }

  // Error inesperado — no exponer detalles internos
  console.error('[errorHandler] Unhandled error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    provider: 'template',
    httpStatus: 500,
  });
}
