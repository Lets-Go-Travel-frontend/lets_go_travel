/**
 * config.test.ts — Test de la validación fail-fast de env vars
 * Sprint 1 — S1-T6.5
 *
 * Agente: 02-qa-certificador | Skill: testing-jest + env-config
 */
import { validateEnvironment } from '../config';

describe('validateEnvironment', () => {
  const originalEnv = process.env;
  const mockExit = jest.spyOn(process, 'exit').mockImplementation((_code?: string | number | null | undefined) => {
    throw new Error(`EXIT_CODE_${_code}`);
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockExit.mockRestore();
  });

  it('pasa sin errores cuando las variables globales existen', () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT_REST = '3000';
    process.env.PORT_GRPC = '50051';
    expect(() => validateEnvironment()).not.toThrow();
  });

  it('llama process.exit(1) si falta PORT_REST', () => {
    process.env.NODE_ENV = 'test';
    delete process.env.PORT_REST;
    process.env.PORT_GRPC = '50051';
    expect(() => validateEnvironment()).toThrow('EXIT_CODE_1');
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('llama process.exit(1) si falta variable de agencia específica', () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT_REST = '3000';
    process.env.PORT_GRPC = '50051';
    delete process.env.VETURIS_USER;
    expect(() => validateEnvironment('veturis')).toThrow('EXIT_CODE_1');
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
