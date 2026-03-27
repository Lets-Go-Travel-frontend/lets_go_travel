/**
 * config.ts — Validación fail-fast de variables de entorno
 */

/** Variables que SIEMPRE deben existir */
const GLOBAL_REQUIRED: string[] = ['NODE_ENV', 'PORT_REST', 'PORT_GRPC'];

export const VETURIS_LANGUAGES = ['ENG', 'SPA', 'CHI', 'FRE', 'GER', 'ITA', 'PT', 'RUS', 'CZE', 'DUT', 'POL', 'RUM', 'ARA'];

export const CONTINGENCY_CONTACTS = {
  ASIA_PACIFIC: ['+662 2 116 7646', '+662 2 116 7648']
};

/**
 * Variables requeridas por agencia.
 */
const PROVIDER_REQUIRED: Record<string, string[]> = {
  veturis: [
    'VETURIS_USER', 'VETURIS_PASSWORD', 'VETURIS_AGENCY_USER', 'VETURIS_AGENCY_PASSWORD', 
    'VETURIS_BASE_URL_DEV', 'VETURIS_BASE_URL_PROD'
  ]
};

export function validateEnvironment(provider?: string): void {
  const required = [
    ...GLOBAL_REQUIRED,
    ...(provider ? (PROVIDER_REQUIRED[provider] ?? []) : []),
  ];

  const missing = required.filter(
    (key) => !process.env[key] || process.env[key]!.trim() === '',
  );

  if (missing.length > 0) {
    console.error(`[CONFIG] ❌ Variables de entorno faltantes: ${missing.join(', ')}`);
    console.error('[CONFIG] Copia .env.example a .env y completa las credenciales.');
    process.exit(1);
  }

  if (CONTINGENCY_CONTACTS.ASIA_PACIFIC.length > 0) {
    console.log(`[CONFIG] 🌏 Soporte Asia activo: ${CONTINGENCY_CONTACTS.ASIA_PACIFIC.join(' / ')}`);
  }

  console.log(`[CONFIG] ✅ Entorno validado — provider: ${provider ?? 'veturis'}`);
}
