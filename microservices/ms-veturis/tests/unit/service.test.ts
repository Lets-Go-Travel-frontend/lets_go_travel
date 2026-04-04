import { VeturisService } from '../../src/services/VeturisService';
import { VeturisClient } from '../../src/api/VeturisClient';
import xml2js from 'xml2js';
import fs from 'fs';

jest.mock('../../src/api/VeturisClient');
jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: jest.fn(),
    readFileSync: jest.fn()
}));
jest.mock('../../src/cache/RedisSingleton', () => {
    return {
        RedisSingleton: {
            getInstance: jest.fn(() => ({
                hgetall: jest.fn().mockResolvedValue({ name: 'Mock Hotel', stars: '4', lat: '40.0', lng: '-3.0' }),
                ping: jest.fn().mockResolvedValue('PONG')
            }))
        }
    };
});

describe('VeturisService Mapping Logic', () => {
    let service: VeturisService;
    let mockClient: jest.Mocked<VeturisClient>;

    beforeAll(() => {
        (VeturisService as any).hotelMetaCache = null;
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockReturnValue(`HotelID|Name|CountryID|DestinationID|ZoneID|CategoryID
9553|Mock Hotel 5|1|1|1|9`);
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockClient = new VeturisClient() as jest.Mocked<VeturisClient>;
        service = new VeturisService();
        (service as any).client = mockClient;

        mockClient.parseXML.mockImplementation(async (xml: string) => {
            const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: false });
            return await parser.parseStringPromise(xml);
        });

        mockClient.encodeBookingToken.mockImplementation((s, r) => Buffer.from(`${s}|${r}`).toString('base64'));
        mockClient.decodeBookingToken.mockImplementation((t) => {
            const decoded = Buffer.from(t, 'base64').toString('ascii');
            const [sessionId, roomId] = decoded.split('|');
            return { sessionId, roomId };
        });
    });

    test('Details - Should map AgencyBalance, Supplements and Discounts (Ticket FIN-002)', async () => {
        mockClient.sendMultipartXML.mockResolvedValue(`<?xml version="1.0" encoding="UTF-8"?>
            <AdditionalInformationRS currency="EUR">
                <PriceAgency>100.00</PriceAgency>
                <AgencyBalance>5000.50</AgencyBalance>
                <HotelDetails><Name>H</Name></HotelDetails>
                <Rooms><Room>
                    <Price>120.00</Price>
                    <Refundable>Y</Refundable>
                    <Supplements>
                        <Supplement>
                            <Description>Tourist Tax</Description>
                            <Price>2.50</Price>
                            <Type>D</Type>
                        </Supplement>
                    </Supplements>
                    <Discounts>
                        <Discount>
                            <Description>Early Bird</Description>
                            <Price>10.00</Price>
                        </Discount>
                    </Discounts>
                </Room></Rooms>
                <MandatoryPaxes>Y</MandatoryPaxes>
            </AdditionalInformationRS>`);

        const res = await service.details('token');
        expect(res.extraData?.agencyBalance).toBe(5000.50);
        expect(res.extraData?.supplements?.[0].name).toBe('Tourist Tax');
        expect(res.extraData?.supplements?.[0].type).toBe('D');
        expect(res.extraData?.discounts?.[0].price).toBe(10.00);
    });

    test('Booking - Should include Company and Reference (Ticket B2B-001)', async () => {
        mockClient.buildXML.mockReturnValue('<xml/>');
        mockClient.sendMultipartXML.mockResolvedValue(`<?xml version="1.0" encoding="UTF-8"?>
            <BookingConfirmationRS>
                <ConfirmationStatus>1</ConfirmationStatus>
                <BookingID>BK1</BookingID>
                <SecurityCode>SEC1</SecurityCode>
                <Locator>LOC1</Locator>
            </BookingConfirmationRS>`);
        
        await service.book({
            bookingToken: 'token',
            client: { name: 'J', surnames: 'P', email: 'e@e.com', country: '15' },
            company: { name: 'Corp', cif: 'B123', address: 'Addr' },
            agencyReference: 'REF123',
            language: 'SPA',
            passengers: [{ name: 'P1', surname: 'S1', docNumber: 'D1' }]
        });

        const callArgs = mockClient.buildXML.mock.calls[0][0] as any;
        expect(callArgs.BookingConfirmationRQ.Request.company.name).toContain('Corp');
        expect(callArgs.BookingConfirmationRQ.Request.Reference).toBe('REF123');
    });

    test('Modify - Should map BookingModificationRQ correctly (Ticket MOD-001)', async () => {
        mockClient.buildXML.mockReturnValue('<xml/>');
        mockClient.sendMultipartXML.mockResolvedValue(`<?xml version="1.0" encoding="UTF-8"?>
            <BookingModificationRS><Status>OK</Status></BookingModificationRS>`);
        
        const res = await service.modify({
            bookingId: 'BK1',
            securityCode: 'SEC1',
            remarks: 'New note'
        });

        expect(res.status).toBe('OK');
        const callArgs = mockClient.buildXML.mock.calls[0][0] as any;
        expect(callArgs.BookingModificationRQ.Request.BookingID).toBe('BK1');
        expect(callArgs.BookingModificationRQ.Request.comment.text).toBe('New note');
    });

    test('Guardrails - Search should fail if more than 1000 hotels (Ticket QA-004)', async () => {
        const manyIds = Array(1001).fill('1').join(',');
        await expect(service.search({
            hotelId: manyIds,
            checkIn: '2026-01-01',
            checkOut: '2026-01-05',
            language: 'SPA',
            occupancies: [{ adults: 2, children: 0 }]
        })).rejects.toThrow('GDS_LIMIT_EXCEEDED');
    });
});
