import { z } from 'zod';

const OccupancySchema = z.object({
  adults: z.number().int().min(1, "At least one adult is required"),
  children: z.number().int().min(0),
  childrenAges: z.array(z.number().int().min(0).max(17)).optional()
}).refine((data) => {
  if (data.children > 0) {
    return data.childrenAges && data.childrenAges.length === data.children;
  }
  return true;
}, {
  message: "Children ages array must match children count",
  path: ["childrenAges"]
});

export const SearchSchema = z.object({
  hotelId: z.string().min(1, "Hotel ID is required"),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  language: z.string().optional().default('SPA'),
  occupancies: z.array(OccupancySchema).min(1, "At least one occupancy is required"),
  countryCode: z.string().min(2).max(3).optional()
}).refine((data) => {
  const checkInDate = new Date(data.checkIn);
  const checkOutDate = new Date(data.checkOut);
  return checkOutDate > checkInDate;
}, {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"]
});

export type SearchRequestParams = z.infer<typeof SearchSchema>;
