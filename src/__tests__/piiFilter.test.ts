/**
 * piiFilter.test.ts — Test del filtro PII
 * Sprint 1 — S1-T6
 *
 * Agente: 02-qa-certificador | Skill: testing-jest + pii-masking
 */
import { maskPII } from '../middleware/pii-filter';

describe('maskPII', () => {
  it('redacta campos PII de primer nivel', () => {
    const input = { firstName: 'Juan', lastName: 'Pérez', city: 'Madrid' };
    const result = maskPII(input) as Record<string, unknown>;
    expect(result.firstName).toBe('[REDACTADO]');
    expect(result.lastName).toBe('[REDACTADO]');
    expect(result.city).toBe('Madrid'); // Campo no-PII intacto
  });

  it('redacta PII en objetos anidados', () => {
    const input = { passenger: { documentNumber: 'AB123456', age: 30 } };
    const result = maskPII(input) as { passenger: Record<string, unknown> };
    expect(result.passenger.documentNumber).toBe('[REDACTADO]');
    expect(result.passenger.age).toBe(30);
  });

  it('redacta PII dentro de arrays', () => {
    const input = [{ passport: 'XY789', name: 'Test' }];
    const result = maskPII(input) as Array<Record<string, unknown>>;
    expect(result[0].passport).toBe('[REDACTADO]');
    expect(result[0].name).toBe('Test');
  });

  it('no modifica valores primitivos', () => {
    expect(maskPII('hello')).toBe('hello');
    expect(maskPII(42)).toBe(42);
    expect(maskPII(null)).toBeNull();
  });
});
