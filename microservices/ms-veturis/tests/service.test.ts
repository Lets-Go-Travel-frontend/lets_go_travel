import { VeturisService } from '../src/services/VeturisService';

describe('Domain Suite: VeturisService Guardrails', () => {
    let service: VeturisService;

    beforeEach(() => {
        service = new VeturisService();
    });

    test('Guardrail: Should reject search with more than 1000 hotels', async () => {
        const manyIds = Array(1001).fill('1').join(',');
        await expect(service.search({
            hotelId: manyIds,
            checkIn: '2026-05-01',
            checkOut: '2026-05-05',
            language: 'SPA',
            occupancies: [{ adults: 2, children: 0 }]
        })).rejects.toThrow('GDS_LIMIT_EXCEEDED');
    });

    test('Guardrail: Should reject search with more than 5 rooms', async () => {
        const manyRooms = Array(6).fill({ adults: 2, children: 0 });
        await expect(service.search({
            hotelId: '9553',
            checkIn: '2026-05-01',
            checkOut: '2026-05-05',
            language: 'SPA',
            occupancies: manyRooms
        })).rejects.toThrow('GDS_LIMIT_EXCEEDED');
    });

    test('Guardrail: Should reject if adults per room > 6', async () => {
        await expect(service.search({
            hotelId: '9553',
            checkIn: '2026-05-01',
            checkOut: '2026-05-05',
            language: 'SPA',
            occupancies: [{ adults: 7, children: 0 }]
        })).rejects.toThrow('GDS_LIMIT_EXCEEDED');
    });

    test('Helper: mapCategoryToStars should handle various category strings', () => {
        // Accessing private method for deep testing
        const map = (service as any).mapCategoryToStars.bind(service);
        expect(map('9')).toBe(5);
        expect(map('7')).toBe(4);
        expect(map('5')).toBe(3);
        expect(map('invalid')).toBe(0);
    });
});
