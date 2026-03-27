/**
 * IProviderError.ts
 * Error estandarizado que el adaptador emite al interceptar errores nativos del proveedor.
 *
 * Skill: error-translator
 * Knowledge: 04_Traduccion_de_Errores, 07_Diccionario_de_Errores_y_Rate_Limits
 */

export interface IProviderErrorOptions {
  /** Código nativo del proveedor (ej: 114, "ERROR_PRERESERVA", "110") */
  nativeCode: string | number;
  /** Mensaje original del proveedor (sin PII) */
  nativeMessage: string;
  /** Código HTTP a devolver al Centralizador */
  httpStatus: 400 | 401 | 402 | 404 | 409 | 429 | 500 | 502 | 504;
  /** Nombre del proveedor para trazabilidad */
  providerName: string;
}

export class ProviderError extends Error {
  public readonly nativeCode: string | number;
  public readonly nativeMessage: string;
  public readonly httpStatus: number;
  public readonly providerName: string;

  constructor(options: IProviderErrorOptions) {
    super(`[${options.providerName}] ${options.nativeMessage}`);
    this.name = 'ProviderError';
    this.nativeCode = options.nativeCode;
    this.nativeMessage = options.nativeMessage;
    this.httpStatus = options.httpStatus;
    this.providerName = options.providerName;
  }

  toJSON() {
    return {
      error: this.message,
      provider: this.providerName,
      nativeCode: this.nativeCode,
      httpStatus: this.httpStatus,
    };
  }
}
