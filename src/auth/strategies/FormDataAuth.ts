import { InternalAxiosRequestConfig } from 'axios';
import { IAuthStrategy } from '../IAuthStrategy';

/**
 * FormDataAuth.ts
 * Estrategia para autenticación B2B mediante parámetros form-data (Veturis).
 * [Agent: Implementer | Skill: AuthManager | Rules: VeturisStandards]
 */
export class FormDataAuth implements IAuthStrategy {
  constructor(private credentials: Record<string, string>) {}

  /**
   * Aplica las credenciales al cuerpo de la petición (URLSearchParams).
   */
  async applyAuth(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    if (config.data instanceof URLSearchParams) {
      Object.entries(this.credentials).forEach(([key, value]) => {
        config.data.append(key, value);
      });
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
      console.warn('[FormDataAuth] Config.data no es instancia de URLSearchParams. Saltando inyección.');
    }
    return config;
  }
}
