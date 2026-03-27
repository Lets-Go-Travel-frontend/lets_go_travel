import { VeturisMapper } from '../mappers/VeturisMapper';
import { mockSearchRS, mockDetailsRS, mockBookRS } from './fixtures/veturis-fixtures';

describe('VeturisMapper Technical Audit Validation', () => {

  describe('mapBookRequest (L4/G1/P0/P1)', () => {
    it('debe segregar pasajeros por edad (Adults/Children/Babies) y formatear DOB', () => {
      const standardReq: any = {
        bookingToken: 'SESSION|DATOS',
        holder: { name: 'Juan', surname: 'Perez', email: 'juan@test.com' },
        passengers: [
          { firstName: 'Adult', lastName: 'One', type: 'ADULT', dateOfBirth: '1990-01-01', documentType: 'DNI', documentNumber: '123' },
          { firstName: 'Child', lastName: 'Two', type: 'CHILD', dateOfBirth: '2018-05-20', documentType: 'PASSPORT', documentNumber: '456', age: 9 },
          { firstName: 'Baby', lastName: 'Three', type: 'BABY', dateOfBirth: '2025-01-01', age: 1 }
        ],
        checkIn: '2025-06-01',
        checkOut: '2025-06-05',
        extraData: { priceChange: '0', commentsAllow: 'Y' }
      };

      const xmlObj = VeturisMapper.mapBookRequest(standardReq);
      const bookRQ = xmlObj.BookingConfirmationRQ;

      // G1: Versión dinámica
      expect(bookRQ["@_version"]).toBe("2.0");

      // G-Age: Segregación de Pasajeros (1 Adulto, 1 Niño, 1 Bebé)
      // Nota: Niño (2018) tiene 8 años, Adulto (1990) tiene 36.
      expect(bookRQ.Passengers.Adults.Passenger).toHaveLength(1);
      expect(bookRQ.Passengers.Adults["@_number"]).toBe(1);
      expect(bookRQ.Passengers.Children?.["@_number"]).toBe(1);
      expect(bookRQ.Passengers.Babies?.["@_number"]).toBe(1);

      // PAX IDs secuenciales (G6)
      expect(bookRQ.Passengers.Adults.Passenger[0]["@_id"]).toBe("1");
      expect(bookRQ.Passengers.Children?.Child[0]["@_id"]).toBe("2");

      // G4: Formato Fecha de Nacimiento
      expect(bookRQ.Passengers.Adults.Passenger[0].dateOfBirth).toBe('01/01/1990');
      
      // G5: Truncado Documentos
      expect(bookRQ.Passengers.Adults.Passenger[0].documentNumber).toBe('123');
      
      // G7: País Numérico
      expect(bookRQ.Passengers.Adults.Passenger[0].country).toBe('15');

      // G1: CamelCase en Book
      expect(bookRQ.CheckInDate).toBe('01/06/2025');
      // G-Audit: Redundancia de fechas obligatoria en nodo Room
      expect(bookRQ.Passengers.Room?.[0].CheckInDate).toBe('01/06/2025');
      expect(bookRQ.Passengers.Room?.[0].CheckOutDate).toBe('05/06/2025');
    });

    it('debe truncar clientReferenceId a 20 caracteres', () => {
      const standardReq: any = {
        bookingToken: 'S|D',
        holder: { name: 'X', surname: 'Y', email: 'e' },
        passengers: [],
        clientReferenceId: 'REFERENCIA_MUY_LARGA_QUE_SUPERA_LOS_VEINTE'
      };
      const xmlObj = VeturisMapper.mapBookRequest(standardReq);
      expect(xmlObj.BookingConfirmationRQ.Reference).toBe('REFERENCIA_MUY_LARGA');
    });
  });

  describe('mapSearchRequest (G-Audit)', () => {
    it('debe usar formato DD/MM/YYYY y mapear CityCode para un solo destino', () => {
      const standardReq: any = {
        checkIn: '2025-06-01',
        checkOut: '2025-06-05',
        occupancy: [{ adults: 2, childrenAges: [] }],
        providerIds: ['123'] // Un solo ID = Destino/Ciudad
      };

      const xmlObj = VeturisMapper.mapSearchRequest(standardReq);
      const searchRQ = xmlObj.SearchAvailabilityRQ;

      expect(searchRQ.Check_in_date).toBe('01/06/2025');
      expect(searchRQ.Check_out_date).toBe('05/06/2025');
      expect(searchRQ.CityCode).toBe('123');
      expect(searchRQ.HotelList).toBeUndefined();
    });

    it('debe usar HotelList si hay múltiples IDs', () => {
      const standardReq: any = {
        checkIn: '2025-06-01',
        checkOut: '2025-06-05',
        occupancy: [{ adults: 2, childrenAges: [] }],
        providerIds: ['123', '456']
      };

      const xmlObj = VeturisMapper.mapSearchRequest(standardReq);
      const searchRQ = xmlObj.SearchAvailabilityRQ;

      expect(searchRQ.HotelList).toBe('123/456');
      expect(searchRQ.CityCode).toBeUndefined();
    });
  });

  describe('mapSearchResponse (G10/G4)', () => {
    it('debe normalizar roomType.id con amenidades ordenadas (G10)', () => {
      const mapped = VeturisMapper.mapSearchResponse(mockSearchRS as any);
      // console.log(JSON.stringify(mapped, null, 2));
      const item = mapped.items?.[0];
      
      expect(item).toBeDefined();
      // WiFi y AC -> AC-WiFi (orden alfabético con guion medio G8)
      expect(item?.roomType?.id).toBe('DBL_AC-WiFi');
    });
  });

  describe('mapDetailsResponse (G12/G11)', () => {
    it('debe capturar horas de cancelación (G12) y categoría mutada (G11)', () => {
      const details = VeturisMapper.mapDetailsResponse(mockDetailsRS as any);
      
     expect(details.item.itemName).toBe('Hotel Test');
     expect(details.item.cancellationPolicy.penaltyTiers![0].startTime).toBe('18:00');
     expect(details.item.cancellationPolicy.timezone).toBe('Europe/Madrid');
     expect(details.extraData!.category).toBe('4 ESTRELLAS');
    });

    it('debe detectar crédito SL permitido (G10)', () => {
      const details = VeturisMapper.mapDetailsResponse(mockDetailsRS as any);
      expect(details.extraData!.paymentAllowed).toBe(true);
    });

    it('debe detectar crédito SL denegado si falta el código (G10)', () => {
      const noCreditRS = JSON.parse(JSON.stringify(mockDetailsRS));
      delete noCreditRS.AdditionalInformationRS.PaymentTypes;
      const details = VeturisMapper.mapDetailsResponse(noCreditRS);
      expect(details.extraData!.paymentAllowed).toBe(false);
    });
  });

  describe('mapSearchResponse Edge Cases (G9)', () => {
    it('debe manejar SessionID ausente en búsquedas sin resultados (G9)', () => {
      const emptyRS = { SearchAvailabilityRS: { HotelList: {} } };
      const mapped = VeturisMapper.mapSearchResponse(emptyRS);
      expect(mapped.items).toHaveLength(0);
      // No debe lanzar excepción
    });
  });

  describe('mapBookRequest Audit Fixes (G-Audit)', () => {
    it('debe generar solo nodo payment (minúscula) y manejar PriceChange como float', () => {
      const standardReq: any = {
        bookingToken: 'S|D',
        holder: { name: 'J', surname: 'P', email: 'e' },
        passengers: [{ firstName: 'A', lastName: 'B', dateOfBirth: '1980-01-01' }],
        checkIn: '2025-01-01',
        checkOut: '2025-01-05',
        extraData: { priceChange: '160.25' }
      };
      const xmlObj = VeturisMapper.mapBookRequest(standardReq);
      // G-Audit: Solo payment en minúscula y sin atributo @_type
      expect(xmlObj.BookingConfirmationRQ.payment).toBeDefined();
      expect((xmlObj.BookingConfirmationRQ as any).Payment).toBeUndefined();
      expect(xmlObj.BookingConfirmationRQ.payment?.Type["#text"]).toBe("SL");
      expect(xmlObj.BookingConfirmationRQ.PriceChange).toBe('160.25');
    });
  });

  describe('mapBookResponse Triple Status Validation (G-Audit)', () => {
    it('debe marcar como CONFIRMED solo si ReservationStatus, PaymentStatus y ConfirmationStatus son 1', () => {
      const successRS = {
        BookingConfirmationRS: {
          BookingID: '123456',
          SecurityCode: 'XYZ',
          ReservationStatus: "1",
          PaymentStatus: "1",
          ConfirmationStatus: "1",
          TotalNetPrice: "100.00",
          Currency: "EUR"
        }
      };
      const response = VeturisMapper.mapBookResponse(successRS as any);
      expect(response.status).toBe('CONFIRMED');
    });

    it('debe marcar como FAILED si falta alguno de los 3 estados (Fail-safe)', () => {
      const partialRS = {
        BookingConfirmationRS: {
          BookingID: '123456',
          ReservationStatus: "1",
          PaymentStatus: "0", // Fallo en pago
          ConfirmationStatus: "1"
        }
      };
      const response = VeturisMapper.mapBookResponse(partialRS as any);
      expect(response.status).toBe('FAILED');
    });
  });

  describe('mapCancelRequest (G8)', () => {
    it('debe enviar CancelConfirm="0" en modo dryRun', () => {
      const xmlObj = VeturisMapper.mapCancelRequest({ confirmationId: '123', dryRun: true });
      expect(xmlObj.BookingCancellationRQ.Request.CancelConfirm).toBe('0');
    });
  });
});
