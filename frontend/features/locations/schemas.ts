import { z } from "zod";

export const locationFormSchema = z.object({
  name: z.string().trim().min(1, "nameRequired").max(200, "nameTooLong"),
  address: z.string().max(2000, "addressTooLong"),
  timezone: z.string().trim().min(1, "timezoneRequired").max(200, "timezoneTooLong"),
});

export type LocationFormValues = z.infer<typeof locationFormSchema>;