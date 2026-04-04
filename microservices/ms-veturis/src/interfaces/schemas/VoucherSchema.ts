import { z } from 'zod';

export const VoucherRequestSchema = z.object({
  bookingId: z.string().min(1),
  securityCode: z.string().min(1)
});

export const VoucherResponseSchema = z.object({
  status: z.string(),
  voucherUrl: z.string().optional(),
  rawHtml: z.string().optional()
});

export type VoucherRequest = z.infer<typeof VoucherRequestSchema>;
export type VoucherResponse = z.infer<typeof VoucherResponseSchema>;
