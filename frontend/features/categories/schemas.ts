import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "nameRequired").max(200, "nameTooLong"),
  slug: z.string().trim().min(1, "slugRequired").max(100, "slugTooLong").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slugInvalid"),
  parentCategoryId: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;