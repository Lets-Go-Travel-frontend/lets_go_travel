/**
 * veturis-fixtures.ts
 * Datos de ejemplo para pruebas unitarias de Veturis.
 */

export const mockSearchRS = {
  SearchAvailabilityRS: {
    obj: 'SESSION-123',
    HotelList: {
      Hotel: [{
        Id: '9553',
        HotelDetails: { Name: 'Hotel Test', Photo: { URL: 'http://img.test' } },
        Accommodations: {
          Room: [{
            RoomType: { 
              ID: 'DBL', 
              Name: 'Double Room',
              Amenities: { Amenity: [{ ID: 'WiFi' }, { ID: 'AC' }] }
            },
            Board: [{
              Board_type: { ID: '1' },
              PriceAgency: '100.00',
              Price: { '#text': '120.00', '@_mandatory': '1' },
              Currency: 'EUR',
              DATOS: 'TOKEN-ABC',
              Refundable: 'Y',
              DirectPayment: '0'
            }]
          }]
        }
      }]
    }
  }
};

export const mockDetailsRS = {
  AdditionalInformationRS: {
    obj: 'SESSION-123',
    DATOS: 'TOKEN-ABC',
    PriceAgency: '100.00',
    Price: { '#text': '120.00', '@_mandatory': '0' },
    Currency: 'EUR',
    HotelDetails: {
      Name: 'Hotel Test',
      Category: { '#text': '4 ESTRELLAS', '@_id': '7' },
      Address: 'Calle Falsa 123'
    },
    SearchAvailabilityDetails: {
       RoomName: 'Double Room',
       BoardName: 'Desayuno'
    },
    Cancellation: {
      Period: [
        { From: '01/01/2025', Hour: '18:00', Amount: '50.00' },
        { From: '05/01/2025', Hour: '18:00', Amount: '100.00' }
      ]
    },
    PaymentTypes: {
      Type: { "@_code": "SL", "#text": "Saldo" }
    },
    MandatoryPaxes: 'Y',
    PriceChange: '0'
  }
};

export const mockBookRS = {
  BookingConfirmationRS: {
    BookingID: '123456',
    SecurityCode: 'SEC-789',
    Status: '1',
    ReservationStatus: '1',
    PaymentStatus: '1',
    ConfirmationStatus: '1',
    TotalNetPrice: '100.00',
    Currency: 'EUR',
    CompleteRoomName: 'Double Room Sea View'
  }
};
