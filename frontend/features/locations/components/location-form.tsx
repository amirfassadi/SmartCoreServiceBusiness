"use client";

import type { BusinessLocation } from "@/api/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { locationFormSchema, type LocationFormValues } from "@/features/locations/schemas";

type LocationFormProps = {
  location?: BusinessLocation | null;
  isSubmitting: boolean;
  error?: { message?: string } | null;
  onSubmit: (values: LocationFormValues) => void;
  onCancel: () => void;
};

export function LocationForm({ location, isSubmitting, error, onSubmit, onCancel }: LocationFormProps) {
  const t = useTranslations("locations");
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: location?.name ?? "",
      address: location?.address ?? "",
      timezone: location?.timezone ?? "",
    },
  });

  const fieldError = (field: keyof LocationFormValues) => {
    const code = form.formState.errors[field]?.message;
    return code ? t(`validation.${code}`) : null;
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {error && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error.message ?? t("errors.generic")}</p>}
      <div>
        <label htmlFor="location-name" className="mb-1 block text-sm font-medium text-slate-700">{t("fields.name")}</label>
        <input id="location-name" {...form.register("name")} aria-invalid={Boolean(form.formState.errors.name)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />
        {fieldError("name") && <p className="mt-1 text-xs text-red-600">{fieldError("name")}</p>}
      </div>
      <div>
        <label htmlFor="location-address" className="mb-1 block text-sm font-medium text-slate-700">{t("fields.address")}</label>
        <textarea id="location-address" {...form.register("address")} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />
        {fieldError("address") && <p className="mt-1 text-xs text-red-600">{fieldError("address")}</p>}
      </div>
      <div>
        <label htmlFor="location-timezone" className="mb-1 block text-sm font-medium text-slate-700">{t("fields.timezone")}</label>
        <input id="location-timezone" {...form.register("timezone")} aria-invalid={Boolean(form.formState.errors.timezone)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />
        {fieldError("timezone") && <p className="mt-1 text-xs text-red-600">{fieldError("timezone")}</p>}
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">{t("actions.cancel")}</button>
        <button type="submit" disabled={isSubmitting} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">{isSubmitting ? t("loading") : t("actions.save")}</button>
      </div>
    </form>
  );
}