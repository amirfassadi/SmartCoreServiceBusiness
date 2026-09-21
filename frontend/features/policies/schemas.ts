import { z } from "zod";

export const policyKeySchema = z.string().trim().min(1, "keyRequired").max(100, "keyTooLong").regex(/^[a-z0-9]+(?:\.[a-z0-9]+)*$/, "keyInvalid");

export const policyEditorSchema = z.object({
  policyKey: policyKeySchema,
  policyValueText: z.string().min(1, "jsonRequired").superRefine((value, context) => {
    try {
      const parsed = JSON.parse(value);
      if (parsed === null || Array.isArray(parsed) || typeof parsed !== "object") {
        context.addIssue({ code: z.ZodIssueCode.custom, message: "jsonObjectRequired" });
      }
    } catch {
      context.addIssue({ code: z.ZodIssueCode.custom, message: "jsonInvalid" });
    }
  }),
});

export type PolicyEditorValues = z.infer<typeof policyEditorSchema>;