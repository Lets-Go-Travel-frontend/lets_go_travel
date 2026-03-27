import { ProviderError, IProviderErrorOptions } from '../interfaces/IProviderError';

/**
 * ProviderAuthError — Lanzar cuando el proveedor devuelve 401 o falla el login.
 */
export class ProviderAuthError extends ProviderError {
  constructor(options: Omit<IProviderErrorOptions, 'httpStatus'>) {
    super({ ...options, httpStatus: 401 });
    this.name = 'ProviderAuthError';
  }
}

/**
 * ProviderRateLimitError — Lanzar ante errores 429 de cualquier proveedor.
 */
export class ProviderRateLimitError extends ProviderError {
  constructor(options: Omit<IProviderErrorOptions, 'httpStatus'>) {
    super({ ...options, httpStatus: 429 });
    this.name = 'ProviderRateLimitError';
  }
}

/**
 * ProviderTimeoutError — Lanzar cuando el proveedor excede el tiempo configurado (504).
 */
export class ProviderTimeoutError extends ProviderError {
  constructor(options: Omit<IProviderErrorOptions, 'httpStatus'>) {
    super({ ...options, httpStatus: 504 });
    this.name = 'ProviderTimeoutError';
  }
}

/**
 * ProviderParsingError — Lanzar cuando el XML o JSON está mal formado (502).
 */
export class ProviderParsingError extends ProviderError {
  constructor(options: Omit<IProviderErrorOptions, 'httpStatus'>) {
    super({ ...options, httpStatus: 502 });
    this.name = 'ProviderParsingError';
  }
}
