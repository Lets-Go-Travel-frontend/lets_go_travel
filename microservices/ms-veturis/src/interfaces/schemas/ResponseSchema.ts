import { z } from 'zod';

const PenaltyTierSchema = z.object({
  amount: z.number().nonnegative(),
  fromDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

const PricingInfoSchema = z.object({
  netPrice: z.number().positive(),
  grossPrice: z.number().positive(),
  currency: z.string().length(3),
  isBindingRate: z.boolean()
});

const ResultSchema = z.object({
  bookingToken: z.string().min(1),
  hotelId: z.string().min(1),
  hotelName: z.string().min(1),
  stars: z.number().int().min(0).max(10),
  imageUrl: z.string().url(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  roomName: z.string().min(1),
  boardName: z.string().min(1),
  pricing: PricingInfoSchema,
  cancellationPolicy: z.object({
    refundable: z.boolean(),
    penaltyTiers: z.array(PenaltyTierSchema)
  }),
  extraData: z.object({
    amenities: z.array(z.string()).optional()
  }).passthrough().optional()
});

export const ResponseSchema = z.object({
  provider: z.string().default("veturis"),
  items: z.array(ResultSchema)
});

export type StandardResponse = z.infer<typeof ResponseSchema>;
