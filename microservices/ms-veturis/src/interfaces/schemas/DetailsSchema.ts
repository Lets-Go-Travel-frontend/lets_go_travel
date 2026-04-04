import { z } from 'zod';

export const DetailsRequestSchema = z.object({
  bookingToken: z.string().min(1, "Booking token is required")
});

export const DetailsResponseSchema = z.object({
  status: z.string(),
  price: z.number(),
  currency: z.string().length(3),
  hotelName: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  cancellationPolicy: z.object({
    refundable: z.boolean(),
    freeCancellationUntil: z.string().optional(), // [G-RULE]: Pág 22 fechaLimiteSinGastos
    penaltyTiers: z.array(z.object({
      amount: z.number(),
      fromDate: z.string()
    }))
  }),
  essentialInformation: z.array(z.string()).optional(),
  mandatoryPaxes: z.enum(['Y', 'N', 'H']).optional(),
  priceChangeInfo: z.object({
    hasChanged: z.boolean(),
    newPrice: z.number().optional()
  }).optional(),
  extraData: z.object({
    agencyBalance: z.number().optional(),
    supplements: z.array(z.object({
        name: z.string(),
        price: z.number(),
        type: z.string() // 'D' for Direct payment
    })).optional(),
    discounts: z.array(z.object({
        name: z.string(),
        price: z.number()
    })).optional()
  }).optional()
});

export type DetailsRequest = z.infer<typeof DetailsRequestSchema>;
export type DetailsResponse = z.infer<typeof DetailsResponseSchema>;
