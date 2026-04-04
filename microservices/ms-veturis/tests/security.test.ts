import { sanitize } from '../src/utils/Logger';

describe('Security Suite: PII Shield Audit', () => {
    
    test('Should redact direct sensitive fields in a flat object', () => {
        const data = {
            name: 'John',
            email: 'john.doe@example.com',
            other: 'Safe'
        };
        const sanitized = sanitize(data) as any;
        expect(sanitized.name).toBe('J***n');
        expect(sanitized.email).toBe('j***@example.com');
        expect(sanitized.other).toBe('Safe');
    });

    test('Should redact sensitive fields in nested objects', () => {
        const data = {
            request: {
                client: {
                    email: 'secret@hidden.com',
                    passengers: [
                        { name: 'Alice' }
                    ]
                }
            }
        };
        const sanitized = sanitize(data) as any;
        expect(sanitized.request.client.email).toBe('s***@hidden.com');
        expect(sanitized.request.client.passengers[0].name).toBe('A***e');
    });

    test('Should redact credit card and phone numbers with patterns', () => {
        const data = { creditCard: '1234567812345678', phone: '123456789' };
        const sanitized = sanitize(data) as any;
        expect(sanitized.creditCard).toBe('1***8');
        expect(sanitized.phone).toBe('123****789');
    });

    test('Should handle non-object inputs safely', () => {
        expect(sanitize('Direct String')).toBe('Direct String');
        expect(sanitize(100)).toBe(100);
        expect(sanitize(null)).toBe(null);
    });
});
