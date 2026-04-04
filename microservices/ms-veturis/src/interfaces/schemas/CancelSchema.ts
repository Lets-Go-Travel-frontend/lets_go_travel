import { z } from 'zod';

export const CancelRequestSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  securityCode: z.string().min(1, "Security Code is required"),
  confirm: z.boolean().default(true) // true = Cancelar real, false = Cotizar cancelación
});

export const CancelResponseSchema = z.object({
  status: z.enum(['CANCELLED', 'QUOTED', 'ERROR']),
  message: z.string(),
  cancellationPrice: z.number().optional(),
  currency: z.string().optional(),
  errorDetails: z.object({
      type: z.string(),
      isRecoverable: z.boolean()
  }).optional()
});

export type CancelRequest = z.infer<typeof CancelRequestSchema>;
export type CancelResponse = z.infer<typeof CancelResponseSchema>;
