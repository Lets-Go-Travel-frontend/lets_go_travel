import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',
    '!src/proto/**',
    '!src/**/*.d.ts',
    '!src/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      lines: 80,
      functions: 80,
      branches: 70,
    },
  },
  moduleNameMapper: {
    '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '^@errors/(.*)$': '<rootDir>/src/errors/$1',
    '^@http/(.*)$': '<rootDir>/src/http/$1',
    '^@auth/(.*)$': '<rootDir>/src/auth/$1',
    '^@flows/(.*)$': '<rootDir>/src/flows/$1',
    '^@catalog/(.*)$': '<rootDir>/src/catalog/$1',
    '^@cache/(.*)$': '<rootDir>/src/cache/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
};

export default config;
