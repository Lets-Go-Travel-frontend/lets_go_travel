import { z } from 'zod';

const PaxSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  age: z.number().int().min(0).max(120).optional(),
  docNumber: z.string().optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  expirationDocumentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

const ClientSchema = z.object({
  name: z.string().min(1),
  surnames: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().default("15") // 15 = Spain in Veturis (Pág 34)
});

const CompanySchema = z.object({
  name: z.string(),
  cif: z.string(),
  address: z.string()
});

export const BookingRequestSchema = z.object({
  bookingToken: z.string().min(1),
  client: ClientSchema,
  company: CompanySchema.optional(),
  agencyReference: z.string().optional(),
  passengers: z.array(PaxSchema).min(1),
  remarks: z.string().optional(),
  acceptedPriceChange: z.number().optional(),
  language: z.string().optional().default('SPA')
});

export const BookingResponseSchema = z.object({
  status: z.enum(['CONFIRMED', 'ERROR', 'PENDING']),
  locator: z.string().optional(),
  bookingId: z.string().optional(),
  securityCode: z.string().optional(),
  price: z.number().optional(),
  currency: z.string().length(3).optional(),
  error: z.string().optional()
});

export type BookingRequest = z.infer<typeof BookingRequestSchema>;
export type BookingResponse = z.infer<typeof BookingResponseSchema>;
