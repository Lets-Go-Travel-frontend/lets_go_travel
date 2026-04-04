import { ErrorMapper } from '../src/utils/ErrorMapper';
import { XmlSanitizer } from '../src/utils/XmlSanitizer';

describe('Utility Suite: Helpers & Mappers', () => {

    describe('ErrorMapper (Manual Veturis v3.9 Compliance)', () => {
        test('Should map Error 1824 correctly (Validation)', () => {
            const result = ErrorMapper.map('Error 1824: Some field missing');
            expect(result.type).toBe('GDS_VALIDATION_ERROR');
            expect(result.message).toContain('Error de validación GDS');
        });

        test('Should map Error 1825 correctly (Availability)', () => {
            const result = ErrorMapper.map('Error 1825: No availability');
            expect(result.type).toBe('GDS_AVAILABILITY_ERROR');
            expect(result.message).toContain('No hay disponibilidad');
        });

        test('Should return unknown error for unlisted strings', () => {
            const result = ErrorMapper.map('Nuclear meltdown');
            expect(result.type).toBe('GDS_UNKNOWN_ERROR');
            expect(result.message).toContain('Nuclear meltdown');
        });
    });

    describe('XmlSanitizer', () => {
        test('Should sanitize dangerous XML characters', () => {
            const dirty = 'Hotel < & > / Name';
            const clean = XmlSanitizer.sanitize(dirty);
            expect(clean).toBe('Hotel         Name');
        });

        test('Should wrap content in CDATA tags', () => {
            const text = 'Complex Content';
            const wrapped = XmlSanitizer.wrapCDATA(text);
            expect(wrapped).toBe('<![CDATA[Complex Content]]>');
        });
    });
});
