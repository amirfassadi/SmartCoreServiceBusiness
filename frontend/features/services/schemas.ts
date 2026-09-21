import { z } from "zod";

export const serviceFormSchema = z.object({
  categoryId: z.string().min(1, "categoryRequired"),
  name: z.string().trim().min(1, "nameRequired").max(200, "nameTooLong"),
  slug: z.string().trim().min(1, "slugRequired").max(100, "slugTooLong").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slugInvalid"),
  durationMinutes: z.coerce.number().int("durationInteger").min(1, "durationPositive"),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;