import { SearchSchema } from '../src/interfaces/schemas/SearchSchema';
import { BookingResponseSchema } from '../src/interfaces/schemas/BookingSchema';
import { DetailsResponseSchema } from '../src/interfaces/schemas/DetailsSchema';

describe('Contracts Suite: Zod Deep Validation', () => {

    describe('SearchSchema', () => {
        test('Should fail if check-out is before check-in', () => {
            const data = {
                hotelId: '1',
                checkIn: '2026-05-10',
                checkOut: '2026-05-01',
                occupancies: [{ adults: 2, children: 0 }]
            };
            const result = SearchSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('Check-out date must be after check-in date');
            }
        });

        test('Should fail if children count does not match childrenAges array length', () => {
            const data = {
                hotelId: '1',
                checkIn: '2026-05-01',
                checkOut: '2026-05-05',
                occupancies: [{ adults: 2, children: 2, childrenAges: [5] }] // Only 1 age for 2 children
            };
            const result = SearchSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        test('Should accept valid multi-room occupancy', () => {
            const data = {
                hotelId: '1,2,3',
                checkIn: '2026-05-01',
                checkOut: '2026-05-05',
                occupancies: [
                    { adults: 2, children: 0 },
                    { adults: 1, children: 1, childrenAges: [12] }
                ]
            };
            const result = SearchSchema.safeParse(data);
            expect(result.success).toBe(true);
        });
    });

    describe('Response Validation', () => {
        test('Should validate a correct BookingResponse', () => {
            const valid = {
                status: 'CONFIRMED',
                bookingId: 'BK-123',
                locator: 'LOC-XYZ',
                securityCode: 'SEC-456'
            };
            expect(BookingResponseSchema.safeParse(valid).success).toBe(true);
        });

        test('Should validate a correct DetailsResponse with penalty tiers', () => {
            const valid = {
                status: 'DETAILS_CONFIRMED',
                price: 150.50,
                currency: 'EUR',
                hotelName: 'Grand Hotel',
                description: 'Luxury stay',
                cancellationPolicy: {
                    refundable: true,
                    penaltyTiers: [
                        { fromDate: '2026-04-20', amount: 50 }
                    ]
                },
                essentialInformation: ['Passport required'],
                mandatoryPaxes: 'Y',
                priceChangeInfo: { hasChanged: false }
            };
            const result = DetailsResponseSchema.safeParse(valid);
            expect(result.success).toBe(true);
        });
    });
});
