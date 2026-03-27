/**
 * ICacheService.ts
 * Interfaz universal para servicios de caché (Redis, InMemory, etc.)
 */
export interface ICacheService {
  /** Obtener un valor por clave */
  get<T>(key: string): Promise<T | null>;
  /** Guardar un valor con TTL (Time To Live) en segundos */
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  /** Eliminar una clave */
  delete(key: string): Promise<void>;
  /** Limpiar toda la caché (usar con precaución) */
  clear(): Promise<void>;
}
