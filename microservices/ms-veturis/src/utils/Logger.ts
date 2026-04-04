/**
 * PII Shield Logger Utility Pro
 * Masks sensitive information with partial obfuscation for legal debugging.
 * STRICT: Anti-Any Law compliant.
 */

const SENSITIVE_FIELDS = ['passengers', 'name', 'surnames', 'email', 'phone', 'creditCard', 'firstName', 'lastName', 'docNumber', 'dateOfBirth', 'cif'];

export const safeLog = (message: string, data?: unknown): void => {
    if (data === undefined || data === null) {
        console.log(`[SAFE-LOG] ${message}`);
        return;
    }

    const sanitizedData = sanitize(data);
    console.log(`[SAFE-LOG] ${message}`, JSON.stringify(sanitizedData, null, 2));
};

const maskString = (value: string, type: string): string => {
    if (!value || value.length < 3) return '***';
    
    switch (type) {
        case 'email':
            const [user, domain] = value.split('@');
            return `${user[0]}***@${domain}`;
        case 'phone':
            return `${value.substring(0, 3)}****${value.substring(value.length - 3)}`;
        case 'docNumber':
        case 'cif':
            return `${value.substring(0, 3)}****${value.substring(value.length - 1)}`;
        default:
            return `${value[0]}***${value[value.length - 1]}`;
    }
};

export const sanitize = (obj: unknown): unknown => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitize(item));
    }

    const typedObj = obj as Record<string, unknown>;
    const sanitizedObj: Record<string, unknown> = {};
    
    for (const key in typedObj) {
        if (Object.prototype.hasOwnProperty.call(typedObj, key)) {
            const value = typedObj[key];
            if (SENSITIVE_FIELDS.includes(key) && typeof value === 'string') {
                sanitizedObj[key] = maskString(value, key);
            } else if (SENSITIVE_FIELDS.includes(key)) {
                // Si el campo sensible no es string (ej. array de pasajeros), sanitizamos recursivamente
                sanitizedObj[key] = sanitize(value);
            } else {
                sanitizedObj[key] = sanitize(value);
            }
        }
    }
    return sanitizedObj;
};
