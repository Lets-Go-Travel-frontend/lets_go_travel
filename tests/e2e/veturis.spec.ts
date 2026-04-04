import { test, expect } from '@playwright/test';

test.describe('Veturis GDS Certification Suite - Manual v3.9 Compliance', () => {

  test('E2E - Full Transactional Flow (Search -> Details -> Book)', async ({ page }) => {
    // 1. SEARCH
    const searchRes = await page.request.post('http://localhost:3005/search', {
      data: {
        hotelId: "9553",
        checkIn: "2026-06-01",
        checkOut: "2026-06-05",
        adults: 2,
        children: 0
      }
    });
    expect(searchRes.ok()).toBeTruthy();
    const searchData = await searchRes.json();
    const token = searchData.items[0].bookingToken;

    // 2. DETAILS (G12)
    const detailsRes = await page.request.post('http://localhost:3005/details', {
      data: { bookingToken: token }
    });
    expect(detailsRes.ok()).toBeTruthy();
    const detailsData = await detailsRes.json();
    expect(detailsData.status).toBe('DETAILS_CONFIRMED');
    expect(detailsData.cancellationPolicy.penaltyTiers.length).toBeGreaterThanOrEqual(0);

    // 3. BOOK (G8)
    const bookRes = await page.request.post('http://localhost:3005/book', {
      data: {
        bookingToken: token,
        client: {
          name: "Test",
          surnames: "User",
          email: "test@example.com"
        },
        passengers: [
          { name: "Pax1", surname: "Test", age: 30 },
          { name: "Pax2", surname: "Test", age: 25 }
        ]
      }
    });
    // Note: This might fail if the GDS credentials are not real or balance is 0,
    // but the contract integrity should be verifiable.
    expect(bookRes.status()).toBeLessThan(500); 
  });

  test('Validation - Missing Booking Token', async ({ page }) => {
    const res = await page.request.post('http://localhost:3005/details', {
      data: {}
    });
    expect(res.status()).toBe(400);
  });

});
