import fs from 'fs';
import path from 'path';
import { VeturisClient } from '../api/VeturisClient';
import { IStandardSearchResponse, IStandardResult } from '../interfaces/standard/IStandardSearchResponse';
import { ResponseSchema } from '../interfaces/schemas/ResponseSchema';
import { 
    IVeturisRawHotel, 
    IVeturisRawRoom, 
    IVeturisRawBoard,
    IVeturisRawBookingResponse,
    IVeturisRawDetailsResponse
} from '../interfaces/veturis/IVeturisRawResponse';
import { SearchRequestParams } from '../interfaces/schemas/SearchSchema';
import { DetailsResponse, DetailsResponseSchema } from '../interfaces/schemas/DetailsSchema';
import { BookingRequest, BookingResponse, BookingResponseSchema } from '../interfaces/schemas/BookingSchema';
import { CancelRequest, CancelResponse, CancelResponseSchema } from '../interfaces/schemas/CancelSchema';
import { BookingListRequest, BookingListResponse, BookingListResponseSchema } from '../interfaces/schemas/BookingListSchema';
import { VoucherRequest, VoucherResponse, VoucherResponseSchema } from '../interfaces/schemas/VoucherSchema';
import { ModifyRequest, ModifyResponse, ModifyResponseSchema } from '../interfaces/schemas/ModifySchema';
import { ErrorMapper } from '../utils/ErrorMapper';
import { XmlSanitizer } from '../utils/XmlSanitizer';
import { safeLog } from '../utils/Logger';

export class VeturisService {
    private client: VeturisClient;

    constructor() {
        this.client = new VeturisClient();
    }

    public async getHotels(page: number = 1, limit: number = 20): Promise<{ hotels: any[], total: number }> {
        const csvPath = path.resolve(__dirname, '../../data/veturis_hotels.csv');
        if (!fs.existsSync(csvPath)) return { hotels: [], total: 0 };

        try {
            const content = await fs.promises.readFile(csvPath, 'utf8');
            const lines = content.split('\n');
            const allHotels: any[] = [];

            for (const line of lines) {
                if (!line.trim()) continue;
                const parts = line.split('|');
                if (parts.length > 5) {
                    allHotels.push({
                        id: parts[0],
                        name: parts[1],
                        category: parts[5],
                        address: parts[6],
                        city: parts[8]
                    });
                }
            }

            const start = (page - 1) * limit;
            return {
                hotels: allHotels.slice(start, start + limit),
                total: allHotels.length
            };
        } catch (error) {
            safeLog('❌ Error reading local catalog', error);
            return { hotels: [], total: 0 };
        }
    }

    private mapCategoryToStars(categoryId: string): number {
        const id = parseInt(categoryId);
        if (isNaN(id)) return 0;
        if (id >= 9) return 5;
        if (id >= 7) return 4;
        if (id >= 5) return 3;
        if (id >= 3) return 2;
        if (id >= 1) return 1;
        return 0;
    }

    /**
     * [EPIC 1: Saneamiento de SearchAvailability]
     * Manual v3.9 Compliance: Multi-Occupancy, Ages Structure, and CountryCode.
     */
    public async search(params: SearchRequestParams): Promise<IStandardSearchResponse> {
        const { hotelId, checkIn, checkOut, occupancies, countryCode, language } = params;

        // [Ticket QA-004]: Guardrail 1000 hotels limit
        const ids = (hotelId || '').split(',');
        if (ids.length > 1000) {
            throw new Error('GDS_LIMIT_EXCEEDED: Veturis supports max 1000 hotels per search.');
        }

        // [Ticket TRX-304]: Guardrails de Ocupación Física (Manual Pág 8)
        if (occupancies.length > 5) {
            throw new Error('GDS_LIMIT_EXCEEDED: Veturis supports a maximum of 5 rooms per search.');
        }
        for (const occ of occupancies) {
            if (occ.adults > 6) throw new Error('GDS_LIMIT_EXCEEDED: Veturis supports a maximum of 6 adults per room.');
            if (occ.children > 3) throw new Error('GDS_LIMIT_EXCEEDED: Veturis supports a maximum of 3 children per room.');
        }

        safeLog(`Search for Hotel: ${hotelId} | Rooms: ${occupancies.length}`, { checkIn, checkOut, language });
        
        const searchRequest = {
            SearchAvailabilityRQ: {
                $: { version: "2.0", language: language || "SPA" },
                Request: {
                    HotelList: hotelId,
                    Check_in_date: checkIn,
                    Check_out_date: checkOut,
                    TimeLimit: process.env.VETURIS_TIME_LIMIT || 20,
                    Occupancy: occupancies.map(occ => ({
                        Rooms: 1,
                        Adults: occ.adults,
                        Children: occ.children,
                        ...(occ.children > 0 && occ.childrenAges ? {
                            Ages: {
                                Age: occ.childrenAges
                            }
                        } : {})
                    })),
                    ...(countryCode ? { CountryCode: countryCode } : {})
                }
            }
        };

        const xmlRQ = this.client.buildXML(searchRequest);

        try {
            const xmlResponse = await this.client.sendMultipartXML(xmlRQ);
            if (xmlResponse.trim().startsWith('<!DOCTYPE html>') || xmlResponse.includes('<html')) {
                throw new Error('GDS returned HTML instead of XML (likely 403 Forbidden)');
            }

            const rawData = await this.client.parseXML<Record<string, any>>(xmlResponse);
            const rs = (rawData.resultadosRS || rawData.SearchAvailabilityRS) as any;
            if (!rs || rs.Error) {
                 const errText = rs?.Error || 'Unknown';
                 const mappedErr = ErrorMapper.map(errText);
                 throw new Error(`VeturisAPIError: ${mappedErr.message}`);
            }

            const globalCurrency = rs?.$?.currency || 'EUR';
            const items: IStandardResult[] = [];
            const hotelsRaw = rs.Hotels?.Hotel || rs.HotelList?.Hotel;

            if (hotelsRaw) {
                const hotels: IVeturisRawHotel[] = Array.isArray(hotelsRaw) ? (hotelsRaw as IVeturisRawHotel[]) : [hotelsRaw as IVeturisRawHotel];
                for (const h of hotels) {
                    const hId = h.Id || h.HotelDetails?.ID || h.HotelDetails?.Id;
                    const accsRaw = h.Accommodations?.Room;
                    const rooms: IVeturisRawRoom[] = Array.isArray(accsRaw) ? (accsRaw as IVeturisRawRoom[]) : (accsRaw ? [accsRaw as IVeturisRawRoom] : []);
                    for (const r of rooms) {
                        const roomName = r.RoomType?.Name || 'Room';
                        const boardsRaw = r.Board;
                        const boards: IVeturisRawBoard[] = Array.isArray(boardsRaw) ? (boardsRaw as IVeturisRawBoard[]) : (boardsRaw ? [boardsRaw as IVeturisRawBoard] : []);
                        for (const b of boards) {
                            const net = parseFloat(b.PriceAgency);
                            let gross = 0;
                            if (typeof b.Price === 'object') gross = parseFloat(b.Price._);
                            else gross = parseFloat(b.Price);
                            
                            const gdsHotelName = h.HotelDetails?.Name || 'Veturis Hotel';
                            const meta = await this.getHotelMeta(hId || '0');
                            const amenitiesRaw = r.RoomType?.Amenities?.Amenity;
                            const amenityIds = Array.isArray(amenitiesRaw) ? amenitiesRaw.map(a => a.ID).join(',') : (amenitiesRaw ? amenitiesRaw.ID : '');
                            const amenityNames = await this.getAmenities(amenityIds);
                            
                            items.push({
                                hotelId: hId || '0',
                                hotelName: meta.name !== 'Unknown Hotel' ? meta.name : gdsHotelName,
                                stars: meta.stars || 0,
                                imageUrl: meta.imageUrl,
                                lat: meta.lat || 0,
                                lng: meta.lng || 0,
                                roomName: roomName,
                                boardName: b.Board_type?.Name || 'N/A',
                                bookingToken: this.client.encodeBookingToken(rs.SessionId || rs.SessionID || rs.obj || 'NO-SESSION', b.DATOS),
                                pricing: {
                                    netPrice: net,
                                    grossPrice: gross || net, 
                                    currency: b.Currency || globalCurrency,
                                    isBindingRate: typeof b.Price === 'object' ? b.Price.$?.mandatory === "1" : false
                                },
                                cancellationPolicy: {
                                    refundable: b.Refundable === 'Y',
                                    penaltyTiers: b.Cancellation ? [{
                                        fromDate: b.Cancellation.From,
                                        amount: parseFloat(b.Cancellation.Price)
                                    }] : []
                                },
                                extraData: {
                                    amenities: amenityNames
                                }
                            });
                        }
                    }
                }
            }

            const finalResponse: IStandardSearchResponse = { provider: 'veturis', items };
            const validated = ResponseSchema.safeParse(finalResponse);
            if (!validated.success) {
                safeLog('❌ GDS Contract Violation', validated.error.flatten());
                throw new Error('GDS_CONTRACT_VIOLATION: Data from provider is malformed.');
            }
            return finalResponse;
        } catch (error: any) {
            safeLog('❌ Real Provider Error', error.message);
            throw error;
        }
    }

    public async details(bookingToken: string): Promise<DetailsResponse> {
        const { sessionId, roomId: datos } = this.client.decodeBookingToken(bookingToken);
        const request = {
            AdditionalInformationRQ: {
                $: { version: "3.8", language: "SPA" },
                Request: { obj: sessionId, DATOS: datos, ShowMoreRates: "Y" }
            }
        };

        const xmlRQ = this.client.buildXML(request);
        const xmlResponse = await this.client.sendMultipartXML(xmlRQ);
        const raw = await this.client.parseXML<IVeturisRawDetailsResponse>(xmlResponse);

        const rs = raw.AdditionalInformationRS;
        if (rs?.Error || rs?.ERROR) {
            const mappedErr = ErrorMapper.map(rs.Error || rs.ERROR || 'Unknown Details Error');
            throw new Error(`GDS_DETAILS_ERROR: ${mappedErr.message}`);
        }

        const roomRaw = Array.isArray(rs.Rooms.Room) ? rs.Rooms.Room[0] : rs.Rooms.Room;
        
        // [ETL-204]: Inyectar descripción real desde Redis
        let hotelDesc = 'Descripción no disponible.';
        try {
            const redis = require('../cache/RedisSingleton').RedisSingleton.getInstance();
            const descData = await redis.hgetall(`veturis:description:${rs.HotelDetails?.ID || '0'}`);
            if (descData && descData.name) hotelDesc = descData.name;
        } catch(e) {}

        const response: DetailsResponse = {
            status: 'DETAILS_CONFIRMED',
            price: parseFloat(rs.PriceAgency),
            currency: rs.$.currency || 'EUR', 
            hotelName: rs.HotelDetails?.Name,
            description: hotelDesc,
            address: rs.HotelDetails?.Address,
            city: rs.HotelDetails?.City,
            cancellationPolicy: {
                refundable: roomRaw.Refundable === 'Y',
                freeCancellationUntil: rs.fechaLimiteSinGastos,
                penaltyTiers: this.mapCancellationPeriods(roomRaw.Cancellation?.Period)
            },
            essentialInformation: this.mapEssentialInfo(rs.EssentialInformation?.Information),
            mandatoryPaxes: rs.MandatoryPaxes,
            priceChangeInfo: rs.PriceChange ? {
                hasChanged: true,
                newPrice: parseFloat(rs.PriceChange)
            } : { hasChanged: false },
            extraData: {
                agencyBalance: rs.AgencyBalance ? parseFloat(rs.AgencyBalance) : undefined,
                supplements: this.mapSupplements(roomRaw.Supplements?.Supplement),
                discounts: this.mapDiscounts(roomRaw.Discounts?.Discount)
            }
        };

        const validated = DetailsResponseSchema.safeParse(response);
        if (!validated.success) throw new Error(`GDS_CONTRACT_VIOLATION_DETAILS: ${JSON.stringify(validated.error.flatten())}`);
        return validated.data;
    }

    public async book(bookingRequest: BookingRequest): Promise<BookingResponse> {
        const { sessionId, roomId: datos } = this.client.decodeBookingToken(bookingRequest.bookingToken);
        const request = {
            BookingConfirmationRQ: {
                $: { version: "2.0", language: bookingRequest.language || "SPA" },
                Request: {
                    obj: sessionId,
                    DATOS: datos,
                    client: {
                        name: XmlSanitizer.wrapCDATA(bookingRequest.client.name),
                        surnames: XmlSanitizer.wrapCDATA(bookingRequest.client.surnames),
                        documentNumber: "12345678X", 
                        country: bookingRequest.client.country || "15", 
                        EMail: bookingRequest.client.email,
                        Phone: bookingRequest.client.phone || ""
                    },
                    ...(bookingRequest.company ? {
                        company: {
                            name: XmlSanitizer.wrapCDATA(bookingRequest.company.name),
                            cif: bookingRequest.company.cif,
                            address: XmlSanitizer.wrapCDATA(bookingRequest.company.address)
                        }
                    } : {}),
                    ...(bookingRequest.agencyReference ? { Reference: bookingRequest.agencyReference } : {}),
                    paxes: {
                        pax: bookingRequest.passengers.map(p => ({
                            name: XmlSanitizer.wrapCDATA(p.name),
                            surname: XmlSanitizer.wrapCDATA(p.surname),
                            documentNumber: p.docNumber || "12345678X",
                            dateOfBirth: p.dateOfBirth || "",
                            ...(p.expirationDocumentDate ? { expirationDocumentDate: p.expirationDocumentDate } : {})
                        }))
                    },
                    payment: { Type: "SL" },
                    ...(bookingRequest.acceptedPriceChange ? { PriceChange: bookingRequest.acceptedPriceChange } : {}),
                    comment: { text: XmlSanitizer.sanitize(bookingRequest.remarks || "Booking from Let's Go Travel") }
                }
            }
        };

        const xmlRQ = this.client.buildXML(request);
        const xmlResponse = await this.client.sendMultipartXML(xmlRQ);
        const raw = await this.client.parseXML<IVeturisRawBookingResponse>(xmlResponse);

        const rs = raw.BookingConfirmationRS;
        if (rs.ConfirmationStatus === '0' || rs.ERROR === '1') {
            const errDetail = rs.Errors?.Error || 'Rechazo de confirmación GDS';
            const mappedErr = ErrorMapper.map(typeof errDetail === 'string' ? errDetail : JSON.stringify(errDetail));
            return { status: 'ERROR', error: mappedErr.message };
        }

        return {
            status: 'CONFIRMED',
            locator: rs.Locator,
            bookingId: rs.BookingID,
            securityCode: rs.SecurityCode
        };
    }

    public async cancel(cancelRequest: CancelRequest): Promise<CancelResponse> {
        const { bookingId, securityCode, confirm } = cancelRequest;
        const request = {
            BookingCancellationRQ: { 
                $: { version: "2.0" }, 
                Request: {
                    BookingID: bookingId,
                    SecurityCode: securityCode,
                    CancelConfirm: confirm ? "1" : "0"
                }
            }
        };

        const xmlRQ = this.client.buildXML(request);
        const xmlResponse = await this.client.sendMultipartXML(xmlRQ);
        const raw = await this.client.parseXML<Record<string, any>>(xmlResponse);

        const rs = raw.BookingCancellationRS as Record<string, any>;
        if (rs.Error || rs.ERROR === '1') {
            const errDetail = rs.Errors?.Error || rs.Error || 'Error en cancelación';
            const mappedErr = ErrorMapper.map(typeof errDetail === 'string' ? errDetail : JSON.stringify(errDetail));
            return {
                status: 'ERROR',
                message: mappedErr.message,
                errorDetails: { type: mappedErr.type, isRecoverable: mappedErr.isRecoverable }
            };
        }

        const response: CancelResponse = {
            status: confirm ? 'CANCELLED' : 'QUOTED',
            message: confirm 
                ? `La reserva ${bookingId} ha sido anulada con éxito.`
                : `Cotización de cancelación para ${bookingId} obtenida.`,
            cancellationPrice: rs.CurrentCancellationPrice ? parseFloat(rs.CurrentCancellationPrice) : 0,
            currency: 'EUR'
        };

        const validated = CancelResponseSchema.safeParse(response);
        if (!validated.success) throw new Error(`GDS_CONTRACT_VIOLATION_CANCEL: ${JSON.stringify(validated.error.flatten())}`);
        return validated.data;
    }

    public async bookingList(req: BookingListRequest): Promise<BookingListResponse> {
        // [QA-004]: Guardrail 31 days limit
        if (req.dateRange) {
            const start = new Date(req.dateRange.fromDate);
            const end = new Date(req.dateRange.toDate);
            const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays > 31) {
                throw new Error('GDS_LIMIT_EXCEEDED: Veturis supports max 31 days range for BookingList.');
            }
        }

        const request = {
            BookingListRQ: {
                $: { version: "2.0", language: "SPA" },
                Request: {
                    ...(req.bookingId ? { BookingID: req.bookingId } : {}),
                    ...(req.locator ? { Locator: req.locator } : {}),
                    ...(req.agencyReference ? { AgencyReference: req.agencyReference } : {}),
                    ...(req.dateRange ? {
                        BookingDateRange: {
                            $: { type: req.dateRange.type },
                            FromDate: req.dateRange.fromDate,
                            ToDate: req.dateRange.toDate
                        }
                    } : {}),
                    ...(req.bookingStatus ? { BookingStatus: req.bookingStatus } : {})
                }
            }
        };

        const xmlRQ = this.client.buildXML(request);
        const xmlResponse = await this.client.sendMultipartXML(xmlRQ);
        const raw = await this.client.parseXML<Record<string, any>>(xmlResponse);

        const rs = raw.BookingListRS as Record<string, any>;
        if (!rs || rs.Error || rs.ERROR) {
            return { bookings: [] };
        }

        const bookingsRaw = rs.Booking;
        const bookingsList = Array.isArray(bookingsRaw) ? (bookingsRaw as Array<Record<string, any>>) : (bookingsRaw ? [bookingsRaw as Record<string, any>] : []);

        const bookings = bookingsList.map((b: Record<string, any>) => ({
            bookingId: b.$.id || b.BookingID || '',
            status: b.BookingStatus || 'UNKNOWN',
            locator: b.Locator || '',
            hotelName: b.Hotel?._ || b.Hotel || 'N/A',
            checkIn: b.CheckInDate || '',
            checkOut: b.CheckOutDate || '',
            price: b.Price ? parseFloat(b.Price) : 0
        }));

        const finalResponse = { bookings };
        const validated = BookingListResponseSchema.safeParse(finalResponse);
        if (!validated.success) {
            safeLog('BookingList Validation Error', validated.error.flatten());
        }
        return finalResponse;
    }

    public async getVoucher(req: VoucherRequest): Promise<VoucherResponse> {
        const request = {
            VoucherRQ: {
                Request: {
                    BookingID: req.bookingId,
                    Seg: req.securityCode
                }
            }
        };

        const xmlRQ = this.client.buildXML(request);
        const xmlResponse = await this.client.sendMultipartXML(xmlRQ);
        
        let html = xmlResponse;

        // [Ticket DOC-001]: Branding Injection (CSS + Header)
        const brandingStyle = `
            <style>
                body { font-family: sans-serif; }
                .ltg-header { 
                    background: #062571; 
                    color: white; 
                    padding: 20px; 
                    text-align: center; 
                    border-radius: 10px 10px 0 0; 
                }
                .ltg-header h1 { margin: 0; font-size: 24px; }
            </style>
            <div class="ltg-header">
                <h1>Let's Go Travel - GDS Voucher</h1>
            </div>
        `;

        if (html.includes('<html') || html.includes('<!DOCTYPE html>') || html.includes('<body')) {
            const injectedHtml = html.replace(/<body(.*?)>/i, `<body$1>${brandingStyle}`);
            return { status: 'OK', rawHtml: injectedHtml };
        }

        try {
            const raw = await this.client.parseXML<Record<string, any>>(html);
            const rs = raw.VoucherRS as Record<string, any>;
            
            if (rs?.Error || rs?.ERROR) {
                return { status: 'ERROR', rawHtml: `Error from GDS: ${rs.Error || rs.ERROR}` };
            }

            return {
                status: 'OK',
                voucherUrl: (rs.Booking as any)?.RetailAgency?.Logo || '',
                rawHtml: html 
            };
        } catch (e) {
            return { status: 'OK', rawHtml: html };
        }
    }

    public async modify(req: ModifyRequest): Promise<ModifyResponse> {
        const request = {
            BookingModificationRQ: {
                $: { version: "2.0", language: "SPA" },
                Request: {
                    BookingID: req.bookingId,
                    SecurityCode: req.securityCode,
                    ...(req.passengers ? {
                        paxes: {
                            pax: req.passengers.map(p => ({
                                name: XmlSanitizer.wrapCDATA(p.name),
                                surname: XmlSanitizer.wrapCDATA(p.surname),
                                ...(p.docNumber ? { documentNumber: p.docNumber } : {}),
                                ...(p.dateOfBirth ? { dateOfBirth: p.dateOfBirth } : {})
                            }))
                        }
                    } : {}),
                    ...(req.remarks ? { comment: { text: XmlSanitizer.sanitize(req.remarks) } } : {})
                }
            }
        };

        const xmlRQ = this.client.buildXML(request);
        const xmlResponse = await this.client.sendMultipartXML(xmlRQ);
        const raw = await this.client.parseXML<Record<string, any>>(xmlResponse);

        const rs = raw.BookingModificationRS as Record<string, any>;
        if (!rs || rs.Error || rs.ERROR === '1') {
            const err = rs?.Error || rs?.Errors?.Error || 'Error desconocido en modificación';
            return { status: 'ERROR', message: typeof err === 'string' ? err : JSON.stringify(err) };
        }

        return {
            status: 'OK',
            message: 'Reserva modificada con éxito en el GDS.'
        };
    }

    private mapCancellationPeriods(periodRaw: unknown): Array<{ amount: number, fromDate: string }> {
        if (!periodRaw) return [];
        const periods = Array.isArray(periodRaw) ? (periodRaw as any[]) : [periodRaw as any];
        return periods.map(p => ({
            amount: parseFloat(p.Amount || p.PriceAgency),
            fromDate: p.From
        }));
    }

    private mapEssentialInfo(infoRaw: unknown): string[] {
        if (!infoRaw) return [];
        const infos = Array.isArray(infoRaw) ? (infoRaw as any[]) : [infoRaw as any];
        return infos.map(i => i.Description);
    }

    private mapSupplements(suppRaw: unknown): Array<{ name: string, price: number, type: string }> {
        if (!suppRaw) return [];
        const supps = Array.isArray(suppRaw) ? (suppRaw as any[]) : [suppRaw as any];
        return supps.map(s => ({
            name: s.Description || 'Supplement',
            price: parseFloat(s.Price || '0'),
            type: s.Type || 'S'
        }));
    }

    private mapDiscounts(discRaw: unknown): Array<{ name: string, price: number }> {
        if (!discRaw) return [];
        const discs = Array.isArray(discRaw) ? (discRaw as any[]) : [discRaw as any];
        return discs.map(d => ({
            name: d.Description || 'Discount',
            price: parseFloat(d.Price || '0')
        }));
    }

    private async getHotelMeta(id: string): Promise<{ name: string, stars: number, imageUrl: string, lat: number, lng: number }> {
        try {
            const redis = require('../cache/RedisSingleton').RedisSingleton.getInstance();
            const normalizedId = id.trim().toLowerCase();
            const redisKey = `veturis:hotel:${normalizedId}`;
            const hotel = await redis.hgetall(redisKey);
            
            let imageUrl = 'https://placehold.co/600x400?text=No+Image';
            try {
                const photoData = await redis.hgetall(`veturis:photo:${normalizedId}`);
                if (photoData && photoData.url) imageUrl = photoData.url;
            } catch(e) {}

            if (hotel && hotel.name) {
                return {
                    name: hotel.name,
                    stars: this.mapCategoryToStars(hotel.category),
                    imageUrl: imageUrl,
                    lat: parseFloat(hotel.lat || '0'),
                    lng: parseFloat(hotel.lng || '0')
                };
            }
        } catch (err) {
            safeLog('⚠️ Redis error in getHotelMeta', { id, error: (err as Error).message });
        }

        return { name: 'Unknown Hotel', stars: 0, imageUrl: 'https://placehold.co/600x400?text=No+Image', lat: 0, lng: 0 };
    }

    private async getAmenities(idsStr: string): Promise<string[]> {
        if (!idsStr) return [];
        const ids = idsStr.split(',');
        const amenities: string[] = [];
        try {
            const redis = require('../cache/RedisSingleton').RedisSingleton.getInstance();
            for (const id of ids) {
                const data = await redis.hgetall(`veturis:amenity:${id.trim().toLowerCase()}`);
                if (data && data.name) amenities.push(data.name);
            }
        } catch(e) {
            // Silencioso, devuelve IDs si falla Redis
            return ids;
        }
        return amenities.length > 0 ? amenities : ids;
    }
}
