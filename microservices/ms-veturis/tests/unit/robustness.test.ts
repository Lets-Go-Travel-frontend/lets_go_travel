import { XmlSanitizer } from '../../src/utils/XmlSanitizer';
import { ErrorMapper, GdsErrorType } from '../../src/utils/ErrorMapper';
import { VeturisClient } from '../../src/api/VeturisClient';
import axios from 'axios';

jest.mock('axios', () => {
    return {
        create: jest.fn(() => ({
            post: jest.fn(),
            interceptors: {
                response: {
                    use: jest.fn()
                }
            }
        }))
    };
});

describe('Veturis Robustness - Unit Tests', () => {
    
    describe('XmlSanitizer', () => {
        test('Should remove forbidden characters according to Manual Pág 35', () => {
            const dirty = "Hotel & Resort / Spa > Best < ever";
            const clean = XmlSanitizer.sanitize(dirty);
            expect(clean).toBe("Hotel   Resort   Spa   Best   ever");
            expect(clean).not.toContain('&');
            expect(clean).not.toContain('/');
            expect(clean).not.toContain('>');
            expect(clean).not.toContain('<');
        });

        test('Should wrap text in CDATA safely', () => {
            const text = "O'Connor & Sons";
            const wrapped = XmlSanitizer.wrapCDATA(text);
            expect(wrapped).toBe("<![CDATA[O'Connor & Sons]]>");
        });
    });

    describe('ErrorMapper', () => {
        test('Should map ERROR_PRERESERVA to recoverable error', () => {
            const raw = "ERROR_PRERESERVA: Room no longer available";
            const mapped = ErrorMapper.map(raw);
            expect(mapped.type).toBe(GdsErrorType.PRERESERVA);
            expect(mapped.isRecoverable).toBe(true);
        });

        test('Should map confirmation failure to non-recoverable error', () => {
            const raw = "ERROR_CONFIRMACION: Internal GDS Timeout";
            const mapped = ErrorMapper.map(raw);
            expect(mapped.type).toBe(GdsErrorType.CONFIRMATION);
            expect(mapped.isRecoverable).toBe(false);
        });

        test('Should handle unknown errors gracefully', () => {
            const raw = "SOME_WEIRD_XML_ERROR";
            const mapped = ErrorMapper.map(raw);
            expect(mapped.type).toBe(GdsErrorType.UNKNOWN);
        });
    });

    describe('VeturisClient Network Errors', () => {
        let client: VeturisClient;
        let mockAxios: jest.Mocked<any>;

        beforeEach(() => {
            mockAxios = {
                post: jest.fn(),
                interceptors: {
                    response: {
                        use: jest.fn()
                    }
                }
            };
            (axios.create as jest.Mock).mockReturnValue(mockAxios);
            client = new VeturisClient();
        });

        test('Should throw an error instead of returning a string on communication failure', async () => {
            const err = new Error('Network Timeout');
            (err as any).config = {};
            mockAxios.post.mockRejectedValue(err);
            
            await expect(client.sendMultipartXML('<xml/>')).rejects.toThrow('ERROR_GDS_COMMUNICATION: Network Timeout');
        });

        test('Should return data if response is an error with data (GDS specific errors)', async () => {
            mockAxios.post.mockRejectedValue({
                config: {},
                response: {
                    status: 500,
                    data: '<Error>GDS Server Error</Error>'
                }
            });
            
            const result = await client.sendMultipartXML('<xml/>');
            expect(result).toBe('<Error>GDS Server Error</Error>');
        });
    });
});
