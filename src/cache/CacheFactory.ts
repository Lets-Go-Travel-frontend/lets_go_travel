/**
 * CacheFactory.ts
 * Sprint 5 — T4.1
 *
 * Selecciona la implementación de caché basada en variables de entorno.
 */
import { ICacheService } from './ICacheService';
import { InMemoryCache } from './InMemoryCache';
import { RedisCache } from './RedisCache';

export class CacheFactory {
  private static instance: ICacheService;

  static getInstance(): ICacheService {
    if (this.instance) return this.instance;

    const useRedis = process.env.USE_REDIS === 'true' || !!process.env.REDIS_URL;
    
    if (useRedis) {
      console.log('[CacheFactory] Using RedisCache');
      this.instance = new RedisCache();
    } else {
      console.log('[CacheFactory] Using InMemoryCache');
      this.instance = new InMemoryCache();
    }

    return this.instance;
  }
}
