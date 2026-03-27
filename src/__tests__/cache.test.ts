/**
 * cache.test.ts
 * Pruebas unitarias para la infraestructura de caché.
 */
import { InMemoryCache } from '../cache/InMemoryCache';

describe('InMemoryCache', () => {
  let cache: InMemoryCache;

  beforeEach(() => {
    cache = new InMemoryCache();
  });

  it('debe guardar y recuperar un valor', async () => {
    await cache.set('test-key', { foo: 'bar' });
    const val = await cache.get<{foo: string}>('test-key');
    expect(val?.foo).toBe('bar');
  });

  it('debe expirar valores después del TTL', async () => {
    await cache.set('short-lived', 'data', 1); // 1 segundo
    
    // Mocking time or just waiting a bit
    const valBefore = await cache.get('short-lived');
    expect(valBefore).toBe('data');

    // Forzar expiración manual para el test sin esperar realmente
    (cache as any).cache.get('short-lived').expiresAt = Date.now() - 1000;

    const valAfter = await cache.get('short-lived');
    expect(valAfter).toBe(null);
  });

  it('debe borrar valores correctamente', async () => {
    await cache.set('to-delete', 123);
    await cache.delete('to-delete');
    const val = await cache.get('to-delete');
    expect(val).toBe(null);
  });
});
