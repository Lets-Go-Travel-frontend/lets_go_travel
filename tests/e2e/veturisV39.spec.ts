import { test, expect } from '@playwright/test';

test.describe('Veturis Manual v3.9 Compliance - Comprehensive Suite', () => {

  const BASE_URL = 'http://127.0.0.1:3005';

  test('Search - Multi-Occupancy and Ages Structure', async ({ page }) => {
    const res = await page.request.post(`${BASE_URL}/search`, {
      data: {
        hotelId: "9553",
        checkIn: "2026-06-01",
        checkOut: "2026-06-05",
        occupancies: [
          { adults: 2, children: 1, childrenAges: [5] },
          { adults: 1, children: 0 }
        ],
        countryCode: "ESP"
      }
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.items.length).toBeGreaterThan(0);
    expect(data.items[0].extraData.amenityIds).toBeDefined();
  });

  test('Details - PriceChange and EssentialInformation', async ({ page }) => {
    // 1. Get token with a marker for price change
    const searchRes = await page.request.post(`${BASE_URL}/search`, {
      data: {
        hotelId: "TRIGGER_PRICE_CHANGE",
        checkIn: "2026-06-01",
        checkOut: "2026-06-05",
        occupancies: [{ adults: 2, children: 0 }]
      }
    });
    const searchData = await searchRes.json();
    const token = searchData.items[0].bookingToken;

    // 2. Get Details
    const detailsRes = await page.request.post(`${BASE_URL}/details`, {
      data: { bookingToken: token }
    });
    expect(detailsRes.ok()).toBeTruthy();
    const detailsData = await detailsRes.json();
    
    expect(detailsData.priceChangeInfo.hasChanged).toBe(true);
    expect(detailsData.essentialInformation).toContain('Passport required at check-in');
    expect(detailsData.mandatoryPaxes).toBe('Y');
  });

  test('Booking - SecurityCode Capture and CDATA', async ({ page }) => {
    const searchRes = await page.request.post(`${BASE_URL}/search`, {
      data: {
        hotelId: "9553",
        checkIn: "2026-06-01",
        checkOut: "2026-06-05",
        occupancies: [{ adults: 1, children: 0 }]
      }
    });
    const token = (await searchRes.json()).items[0].bookingToken;

    const bookRes = await page.request.post(`${BASE_URL}/book`, {
      data: {
        bookingToken: token,
        client: {
          name: "Juan & Maria / Test", // Special chars for CDATA test
          surnames: "Perez > Rodriguez",
          email: "test@example.com",
          country: "ESP"
        },
        passengers: [
          { name: "Juan", surname: "Perez", age: 30, docNumber: "12345678X", dateOfBirth: "1994-01-01" }
        ],
        remarks: "Needs extra pillows & / < >"
      }
    });
    expect(bookRes.ok()).toBeTruthy();
    const bookData = await bookRes.json();
    expect(bookData.status).toBe('CONFIRMED');
    expect(bookData.securityCode).toBe('SEC-12345');
    expect(bookData.bookingId).toBe('BK-999');
  });

  test('Cancellation - BookingID + SecurityCode Flow', async ({ page }) => {
    const cancelRes = await page.request.post(`${BASE_URL}/cancel`, {
      data: {
        bookingId: "BK-999",
        securityCode: "SEC-12345",
        confirm: true
      }
    });
    expect(cancelRes.ok()).toBeTruthy();
    const cancelData = await cancelRes.json();
    expect(cancelData.status).toBe('CANCELLED');
  });

  test('BookingList - Audit Requirement', async ({ page }) => {
    const listRes = await page.request.post(`${BASE_URL}/booking-list`, {
      data: {
        bookingId: "BK-999"
      }
    });
    expect(listRes.ok()).toBeTruthy();
    const listData = await listRes.json();
    expect(listData.bookings.length).toBeGreaterThan(0);
    expect(listData.bookings[0].bookingId).toBe('BK-999');
  });

  test('Voucher - Recovery Flow', async ({ page }) => {
    const voucherRes = await page.request.post(`${BASE_URL}/voucher`, {
      data: {
        bookingId: "BK-999",
        securityCode: "SEC-12345"
      }
    });
    expect(voucherRes.ok()).toBeTruthy();
    const voucherData = await voucherRes.json();
    expect(voucherData.rawHtml).toContain('Voucher for BK-999');
  });

  test('Error Handling - Error 1824 Validation', async ({ page }) => {
    const res = await page.request.post(`${BASE_URL}/search`, {
      data: {
        hotelId: "ERROR_1824",
        checkIn: "2026-06-01",
        checkOut: "2026-06-05",
        occupancies: [{ adults: 2, children: 0 }]
      }
    });
    // The service should return 500 or a mapped error
    const data = await res.json();
    expect(data.message).toContain('Error 1824');
  });

});
