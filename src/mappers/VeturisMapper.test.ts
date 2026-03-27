import { VeturisMapper } from './VeturisMapper';
import { IStandardSearchRequest } from '../interfaces';

describe('VeturisMapper', () => {
  it('should map search request to native Veturis XML format', () => {
    const standardReq: IStandardSearchRequest = {
      providerIds: ['9553'],
      checkIn: '2024-12-01',
      checkOut: '2024-12-05',
      occupancy: [{ adults: 2, childrenAges: [7] }]
    };

    const nativeReq = VeturisMapper.mapSearchRequest(standardReq);

    expect(nativeReq.SearchAvailabilityRQ.Check_in_date).toBe('2024-12-01');
    expect(nativeReq.SearchAvailabilityRQ.HotelList?.Hotel[0].Id).toBe('9553');
    expect(nativeReq.SearchAvailabilityRQ.Room[0].Children).toBe(1);
    expect(nativeReq.SearchAvailabilityRQ.Room[0].ChildAges?.[0].Age).toBe(7);
  });

  it('should map native Veturis XML response back to standard format with parities', () => {
    const xmlResponse = {
      HotelList: {
        Hotel: {
          Id: '9553',
          PriceAgency: '120.00',
          Price: { '#text': '150.00', '@_mandatory': '1' },
          DATOS: 'booking_hash_token_mock',
          EssentialInformation: {
            Information: { Description: 'Tasa turística 3 EUR' }
          }
        }
      }
    };

    const result = VeturisMapper.mapSearchResponse(xmlResponse);

    expect(result.providerName).toBe('veturis');
    expect(result.items[0].providerItemId).toBe('9553');
    expect(result.items[0].pricing.netPrice).toBe(120);
    expect(result.items[0].pricing.grossPrice).toBe(150);
    expect(result.items[0].pricing.isBindingRate).toBe(true);
    expect(result.items[0].essentialInfo).toBe('Tasa turística 3 EUR');
  });
});
