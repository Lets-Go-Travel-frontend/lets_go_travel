import { z } from 'zod';

export const ModifyRequestSchema = z.object({
    bookingId: z.string(),
    securityCode: z.string(),
    passengers: z.array(z.object({
        name: z.string(),
        surname: z.string(),
        docNumber: z.string().optional(),
        dateOfBirth: z.string().optional()
    })).optional(),
    remarks: z.string().optional()
});

export type ModifyRequest = z.infer<typeof ModifyRequestSchema>;

export const ModifyResponseSchema = z.object({
    status: z.enum(['OK', 'ERROR']),
    message: z.string()
});

export type ModifyResponse = z.infer<typeof ModifyResponseSchema>;
