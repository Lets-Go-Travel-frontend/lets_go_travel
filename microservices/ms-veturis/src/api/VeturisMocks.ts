/**
 * ─────────────────────────────────────────────────────────
 * VeturisMocks — Intelligent Fallback Engine v2.0
 * Activa cuando el GDS devuelve 403/HTML (IP no whitelisted).
 * Genera XML que el VeturisService puede parsear correctamente.
 * ─────────────────────────────────────────────────────────
 */

/** Fecha ISO relativa: "hoy + N días" → "YYYY-MM-DD" */
function relativeDate(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
}

export class VeturisMocks {
    public static generateSmartMock(xmlRQ: string): string {
        try {
            if (xmlRQ.includes('SearchAvailabilityRQ')) {
                return this.mockAvailability(xmlRQ);
            } else if (xmlRQ.includes('AdditionalInformationRQ')) {
                return this.mockDetails(xmlRQ);
            } else if (xmlRQ.includes('BookingConfirmationRQ')) {
                return this.mockBooking();
            } else if (xmlRQ.includes('BookingCancellationRQ')) {
                return this.mockCancellation(xmlRQ);
            } else if (xmlRQ.includes('BookingListRQ')) {
                return this.mockBookingList();
            } else if (xmlRQ.includes('VoucherRQ')) {
                return this.mockVoucher();
            } else if (xmlRQ.includes('BookingModificationRQ')) {
                return this.mockModification();
            }
        } catch (err) {
            console.error('[VeturisMocks] Error generating mock', err);
        }
        return `<Error>Unsupported Mock Action</Error>`;
    }

    private static extractTag(xml: string, tag: string): string {
        const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i');
        const match = xml.match(regex);
        return match ? match[1].trim() : '';
    }

    // ─── SEARCH AVAILABILITY ──────────────────────────────
    private static mockAvailability(xml: string): string {
        let hotelId = this.extractTag(xml, 'HotelList') || '9553';
        if (hotelId.includes(',')) hotelId = hotelId.split(',')[0];
        const freeCancelDate = relativeDate(5);

        return [
            `<?xml version="1.0" encoding="UTF-8"?>`,
            `<SearchAvailabilityRS currency="EUR">`,
            `<SessionId>MOCK-SESSION-${Date.now()}</SessionId>`,
            `<Hotels>`,
            `<Hotel>`,
            `<Id>${hotelId}</Id>`,
            `<HotelDetails><ID>${hotelId}</ID><Name>Hotel Veturis Demo Resort</Name></HotelDetails>`,
            `<Accommodations>`,
            `<Room>`,
            `<RoomType><Name>Habitación Doble Superior (Demo)</Name></RoomType>`,
            `<Board>`,
            `<Board_type><Name>Solo Alojamiento</Name></Board_type>`,
            `<Currency>EUR</Currency>`,
            `<PriceAgency>125.50</PriceAgency>`,
            `<Price mandatory="0">145.00</Price>`,
            `<Refundable>Y</Refundable>`,
            `<DATOS>MOCK-ROOM-DATOS-SUP-001</DATOS>`,
            `<Cancellation><From>${freeCancelDate}</From><Price>35.00</Price></Cancellation>`,
            `</Board>`,
            `<Board>`,
            `<Board_type><Name>Media Pensión</Name></Board_type>`,
            `<Currency>EUR</Currency>`,
            `<PriceAgency>165.00</PriceAgency>`,
            `<Price mandatory="0">189.00</Price>`,
            `<Refundable>Y</Refundable>`,
            `<DATOS>MOCK-ROOM-DATOS-MP-002</DATOS>`,
            `<Cancellation><From>${freeCancelDate}</From><Price>42.00</Price></Cancellation>`,
            `</Board>`,
            `</Room>`,
            `<Room>`,
            `<RoomType><Name>Suite Junior con Vistas (Demo)</Name></RoomType>`,
            `<Board>`,
            `<Board_type><Name>Todo Incluido</Name></Board_type>`,
            `<Currency>EUR</Currency>`,
            `<PriceAgency>295.00</PriceAgency>`,
            `<Price mandatory="0">350.00</Price>`,
            `<Refundable>N</Refundable>`,
            `<DATOS>MOCK-ROOM-DATOS-TI-003</DATOS>`,
            `</Board>`,
            `</Room>`,
            `</Accommodations>`,
            `</Hotel>`,
            `</Hotels>`,
            `</SearchAvailabilityRS>`
        ].join('');
    }

    // ─── ADDITIONAL INFORMATION (DETAILS / VALUATION) ─────
    private static mockDetails(xml: string): string {
        const cancelDate = relativeDate(5);
        const freeCancelDate = relativeDate(4);

        return [
            `<?xml version="1.0" encoding="UTF-8"?>`,
            `<AdditionalInformationRS currency="EUR">`,
            `<HotelDetails>`,
            `<ID>9553</ID>`,
            `<Name>Hotel Veturis Demo Resort</Name>`,
            `<Address>Av. de la Libertad, 123</Address>`,
            `<City>Madrid</City>`,
            `</HotelDetails>`,
            `<Rooms>`,
            `<Room>`,
            `<Refundable>Y</Refundable>`,
            `<Cancellation>`,
            `<Period>`,
            `<From>${cancelDate}</From>`,
            `<Amount>35.00</Amount>`,
            `<PriceAgency>35.00</PriceAgency>`,
            `</Period>`,
            `</Cancellation>`,
            `</Room>`,
            `</Rooms>`,
            `<PriceAgency>125.50</PriceAgency>`,
            `<fechaLimiteSinGastos>${freeCancelDate}</fechaLimiteSinGastos>`,
            `<AgencyBalance>5000.00</AgencyBalance>`,
            `<EssentialInformation>`,
            `<Information><Description>Check-in a partir de las 15:00 hrs. Check-out antes de las 12:00 hrs.</Description></Information>`,
            `<Information><Description>Impuesto turístico a pagar en destino: 3,50€ por noche por persona adulta.</Description></Information>`,
            `</EssentialInformation>`,
            `<MandatoryPaxes>Y</MandatoryPaxes>`,
            `<PriceChange>125.50</PriceChange>`,
            `</AdditionalInformationRS>`
        ].join('');
    }

    // ─── BOOKING CONFIRMATION ─────────────────────────────
    private static mockBooking(): string {
        const locator = `LTG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const bookingId = `B-${Math.floor(Math.random() * 900000 + 100000)}`;
        const secCode = `${Math.random().toString(36).substring(2, 6).toUpperCase()}${Math.floor(Math.random() * 9000 + 1000)}`;

        return `<?xml version="1.0" encoding="UTF-8"?>
<BookingConfirmationRS>
  <ConfirmationStatus>1</ConfirmationStatus>
  <Locator>${locator}</Locator>
  <BookingID>${bookingId}</BookingID>
  <SecurityCode>${secCode}</SecurityCode>
</BookingConfirmationRS>`;
    }

    // ─── BOOKING CANCELLATION ─────────────────────────────
    private static mockCancellation(xml: string): string {
        const isConfirm = this.extractTag(xml, 'CancelConfirm') === '1';
        return `<?xml version="1.0" encoding="UTF-8"?>
<BookingCancellationRS>
  <CurrentCancellationPrice>${isConfirm ? '35.00' : '0.00'}</CurrentCancellationPrice>
</BookingCancellationRS>`;
    }

    // ─── BOOKING LIST ─────────────────────────────────────
    private static mockBookingList(): string {
        const checkIn = relativeDate(10);
        const checkOut = relativeDate(15);
        return `<?xml version="1.0" encoding="UTF-8"?>
<BookingListRS>
  <Booking id="B-111222">
    <BookingStatus>CONFIRMED</BookingStatus>
    <Locator>LTG-DEMO01</Locator>
    <Hotel>Hotel Veturis Demo Resort</Hotel>
    <CheckInDate>${checkIn}</CheckInDate>
    <CheckOutDate>${checkOut}</CheckOutDate>
    <Price>125.50</Price>
  </Booking>
  <Booking id="B-333444">
    <BookingStatus>CANCELLED</BookingStatus>
    <Locator>LTG-DEMO02</Locator>
    <Hotel>Hotel Playa Demo</Hotel>
    <CheckInDate>${relativeDate(20)}</CheckInDate>
    <CheckOutDate>${relativeDate(25)}</CheckOutDate>
    <Price>89.00</Price>
  </Booking>
</BookingListRS>`;
    }

    // ─── VOUCHER ─────────────────────────────────────────
    private static mockVoucher(): string {
        return `<html><head><title>Voucher LTG</title></head>
<body style="font-family:sans-serif;padding:20px;max-width:600px;margin:0 auto">
  <div style="background:#062571;color:white;padding:20px;border-radius:10px 10px 0 0;text-align:center">
    <h1 style="margin:0">Let's Go Travel</h1>
    <p style="margin:5px 0">Confirmación de Reserva — Demo</p>
  </div>
  <div style="border:1px solid #ccc;border-top:none;padding:20px;border-radius:0 0 10px 10px">
    <h2>Hotel Veturis Demo Resort ⭐⭐⭐⭐</h2>
    <p><strong>Localizador:</strong> LTG-DEMO01</p>
    <p><strong>Check-in:</strong> ${relativeDate(10)}</p>
    <p><strong>Check-out:</strong> ${relativeDate(15)}</p>
    <p><strong>Habitación:</strong> Doble Superior</p>
    <p><strong>Régimen:</strong> Solo Alojamiento</p>
    <hr>
    <p style="color:#888;font-size:12px">Este es un voucher generado en modo Demo. Los datos son ficticios.</p>
  </div>
</body></html>`;
    }

    // ─── MODIFICATION ─────────────────────────────────────
    private static mockModification(): string {
        return `<?xml version="1.0" encoding="UTF-8"?>
<BookingModificationRS>
  <Status>OK</Status>
  <Message>Modification applied successfully (Demo Mode).</Message>
</BookingModificationRS>`;
    }
}
