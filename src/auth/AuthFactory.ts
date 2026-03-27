/**
 * AuthFactory.ts — Orquestador de autenticación agnóstico
 *
 * Crea la estrategia correcta según el tipo definido en el entorno.
 */
import { FormDataAuth } from './strategies/FormDataAuth';
import { IAuthStrategy } from './IAuthStrategy';

export class AuthFactory {
  /**
   * Crea una estrategia basada en la variable AUTH_STRATEGY_TYPE.
   * Valores sugeridos: 'FORM_DATA' | 'XML_SESSION'
   */
  static create(): IAuthStrategy {
    const strategyType = process.env.AUTH_STRATEGY_TYPE?.toUpperCase();

    switch (strategyType) {
      case 'FORM_DATA':
        const fCreeds = {
          user: process.env.VETURIS_USER || '',
          password: process.env.VETURIS_PASSWORD || '',
          agencyUser: process.env.VETURIS_AGENCY_USER || '',
          agencyPassword: process.env.VETURIS_AGENCY_PASSWORD || ''
        };
        return new FormDataAuth(fCreeds);

      /**
       * Nota: Las estrategias específicas (JWT, XML_SESSION) deben ser 
       * reimplementadas o restauradas desde /archive en el microservicio hijo.
       */
      
      default:
        console.warn(`[AuthFactory] No se detectó AUTH_STRATEGY_TYPE (${strategyType}). Usando NoOpAuth.`);
        return new class implements IAuthStrategy {
          async applyAuth(config: any) { return config; }
        };
    }
  }
}
