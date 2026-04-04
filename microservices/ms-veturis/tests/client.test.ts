import { VeturisClient } from '../src/api/VeturisClient';

describe('Infrastructure Suite: VeturisClient', () => {
    const client = new VeturisClient();

    describe('XML Engine', () => {
        test('Should build a valid XML string from a simple object', () => {
            const obj = { Root: { Node: 'Value', $: { attr: '1' } } };
            const xml = client.buildXML(obj);
            expect(xml).toContain('<Root attr="1">');
            expect(xml).toContain('<Node>Value</Node>');
        });

        test('Should parse a valid XML string into an object', async () => {
            const xml = '<?xml version="1.0" encoding="UTF-8"?><RS status="OK"><Data>Info</Data></RS>';
            const parsed = await client.parseXML<any>(xml);
            expect(parsed.RS.$.status).toBe('OK');
            expect(parsed.RS.Data).toBe('Info');
        });
    });

    describe('Token Cryptography', () => {
        test('Should encode and decode booking tokens with 100% integrity', () => {
            const sessionId = 'SESSION_ID_123456';
            const roomId = 'ROOM|DATA|COMPLEX';
            const token = client.encodeBookingToken(sessionId, roomId);
            
            // Verify Base64 format
            expect(token).toMatch(/^[A-Za-z0-9+/=]+$/);

            const decoded = client.decodeBookingToken(token);
            expect(decoded.sessionId).toBe(sessionId);
            expect(decoded.roomId).toBe(roomId);
        });

        test('Should handle special characters in tokens', () => {
            const session = 'SESS:1';
            const room = 'R#2';
            const token = client.encodeBookingToken(session, room);
            const decoded = client.decodeBookingToken(token);
            expect(decoded.sessionId).toBe(session);
            expect(decoded.roomId).toBe(room);
        });
    });
});
