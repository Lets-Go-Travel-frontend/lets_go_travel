import { createClient, RedisClientType } from 'redis';
import { ICacheService } from './ICacheService';

/**
 * RedisCache.ts
 * Implementación de caché persistente usando Redis.
 * Escala horizontalmente y persiste reinicios del contenedor.
 */
export class RedisCache implements ICacheService {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor(url?: string) {
    this.client = createClient({
      url: url || process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    this.client.on('error', (err) => console.error('[Redis] Error:', err));
    this.client.on('connect', () => {
      this.isConnected = true;
      console.log('[Redis] Connected');
    });
  }

  private async ensureConnected() {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    await this.ensureConnected();
    const value = await this.client.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.ensureConnected();
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    
    if (ttlSeconds) {
      await this.client.setEx(key, ttlSeconds, stringValue);
    } else {
      await this.client.set(key, stringValue);
    }
  }

  async delete(key: string): Promise<void> {
    await this.ensureConnected();
    await this.client.del(key);
  }

  async clear(): Promise<void> {
    await this.ensureConnected();
    await this.client.flushAll();
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }
}
