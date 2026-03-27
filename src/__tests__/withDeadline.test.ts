/**
 * withDeadline.test.ts — Test del AbortController wrapper
 * Sprint 1 — S1-T6.4
 *
 * Agente: 02-qa-certificador | Skill: testing-jest
 */
import { withDeadline } from '../http/withDeadline';
import { ProviderError } from '../interfaces/IProviderError';

describe('withDeadline', () => {
  it('resuelve normalmente si la promesa termina antes del deadline', async () => {
    const result = await withDeadline(
      async () => 'OK',
      500,
      'TestProvider',
    );
    expect(result).toBe('OK');
  });

  it('lanza ProviderError(504) si la promesa tarda más que el deadline', async () => {
    // La promesa escucha el signal y rechaza cuando se aborta
    const slowFn = (signal: AbortSignal) =>
      new Promise<string>((_resolve, reject) => {
        const timer = setTimeout(() => _resolve('late'), 500);
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new Error('aborted'));
        });
      });

    await expect(withDeadline(slowFn, 80, 'TestProvider')).rejects.toMatchObject({
      httpStatus: 504,
      nativeCode: 'TIMEOUT',
      providerName: 'TestProvider',
    });
  });

  it('el error lanzado es instancia de ProviderError', async () => {
    const slowFn = (signal: AbortSignal) =>
      new Promise<string>((_resolve, reject) => {
        const timer = setTimeout(() => _resolve('late'), 500);
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new Error('aborted'));
        });
      });

    try {
      await withDeadline(slowFn, 50, 'TestProvider');
    } catch (e) {
      expect(e).toBeInstanceOf(ProviderError);
    }
  });
});
