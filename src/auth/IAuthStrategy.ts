/**
 * IAuthStrategy.ts
 * Interfaz común para todos los mecanismos de autenticación.
 *
 * Agente: 01-implementador | Skill: auth-manager
 */
import { InternalAxiosRequestConfig } from 'axios';

export interface IAuthStrategy {
  /**
   * Aplica la lógica de autenticación a la configuración de Axios.
   * Puede modificar headers, params o body (data).
   */
  applyAuth(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig>;

  /**
   * Opcional: Maneja errores 401 para renovar tokens/sesiones.
   * @returns true si se renovó con éxito y se debe reintentar.
   */
  handleUnauthorized?(): Promise<boolean>;
}
