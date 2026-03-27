/**
 * pii-filter.ts — Filtro de PII para logging
 * Sprint 1 — S1-T5.4
 *
 * Agente: 01-implementador | Skill: pii-masking
 * Rules: 00-global-master.md (restricción absoluta: PROHIBIDO loguear PII)
 *
 * Redacta automáticamente campos sensibles antes de escribir en logs.
 */

const PII_FIELDS = new Set([
  'firstName', 'lastName', 'first_name', 'last_name',
  'Surname', 'surname', 'email', 'phone', // Campos Veturis sensibles
  'documentNumber', 'document_number', 'passport',
  'dateOfBirth', 'date_of_birth',
  'creditCard', 'credit_card', 'cardNumber', 'card_number',
  'password', 'token', 'sessionId', 'session_id',
  // Credenciales de agencias
  'VETURIS_PASSWORD', 'VETURIS_AGENCY_PASSWORD',
]);

const REDACTED = '[REDACTADO]';

/**
 * Filtra recursivamente un objeto eliminando campos PII.
 */
export function maskPII(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) return obj.map(maskPII);

  const masked: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const isPII = PII_FIELDS.has(key) || PII_FIELDS.has(key.toLowerCase());
    masked[key] = isPII ? REDACTED : maskPII(value);
  }
  return masked;
}

let currentCorrelationId: string | null = null;

export const setCorrelationId = (id: string | null) => {
  currentCorrelationId = id;
};

export const safeLog = {
  info: (msg: string, data?: unknown) => {
    const idPrefix = currentCorrelationId ? `[${currentCorrelationId}] ` : '';
    console.log(`${idPrefix}[INFO] ${msg}`, data ? JSON.stringify(maskPII(data)) : '');
  },
  warn: (msg: string, data?: unknown) => {
    const idPrefix = currentCorrelationId ? `[${currentCorrelationId}] ` : '';
    console.warn(`${idPrefix}[WARN] ${msg}`, data ? JSON.stringify(maskPII(data)) : '');
  },
  error: (msg: string, data?: unknown) => {
    const idPrefix = currentCorrelationId ? `[${currentCorrelationId}] ` : '';
    console.error(`${idPrefix}[ERROR] ${msg}`, data ? JSON.stringify(maskPII(data)) : '');
  },
};
