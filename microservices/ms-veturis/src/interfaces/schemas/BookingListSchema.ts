import { z } from 'zod';

export const BookingListRequestSchema = z.object({
  bookingId: z.string().optional(),
  locator: z.string().optional(),
  agencyReference: z.string().optional(),
  dateRange: z.object({
    fromDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    toDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    type: z.number().int().min(1).max(5)
  }).optional(),
  bookingStatus: z.string().optional()
});

export const BookingListResponseSchema = z.object({
  bookings: z.array(z.object({
    bookingId: z.string(),
    status: z.string(),
    locator: z.string().optional(),
    hotelName: z.string().optional(),
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
    price: z.number().optional()
  }))
});

export type BookingListRequest = z.infer<typeof BookingListRequestSchema>;
export type BookingListResponse = z.infer<typeof BookingListResponseSchema>;
