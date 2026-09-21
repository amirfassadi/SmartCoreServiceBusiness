import { z } from "zod";

export const businessContextSchema = z.object({
  businessId: z.string().min(1).optional(),
});

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});
