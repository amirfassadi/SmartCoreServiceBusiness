"use client";

import type { Service, ServiceCategory } from "@/api/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { serviceFormSchema, type ServiceFormValues } from "@/features/services/schemas";

export function ServiceForm({ service, categories, isSubmitting, error, onSubmit, onCancel }: { service?: Service | null; categories: ServiceCategory[]; isSubmitting: boolean; error?: { message?: string } | null; onSubmit: (values: ServiceFormValues) => void; onCancel: () => void }) {
  const t = useTranslations("services");
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: { categoryId: service?.categoryId ?? "", name: service?.name ?? "", slug: service?.slug ?? "", durationMinutes: service?.durationMinutes ?? 1 },
  });
  const fieldError = (field: keyof ServiceFormValues) => {
    const code = form.formState.errors[field]?.message;
    return code ? t(`validation.${code}`) : null;
  };

  return <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
    {error && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error.message ?? t("errors.generic")}</p>}
    <div><label htmlFor="service-category" className="mb-1 block text-sm font-medium text-slate-700">{t("fields.category")}</label><select id="service-category" {...form.register("categoryId")} aria-invalid={Boolean(form.formState.errors.categoryId)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"><option value="">{categories.length ? t("fields.selectCategory") : t("fields.noCategories")}</option>{categories.filter((category) => category.status === "active").map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>{fieldError("categoryId") && <p className="mt-1 text-xs text-red-600">{fieldError("categoryId")}</p>}</div>
    <div><label htmlFor="service-name" className="mb-1 block text-sm font-medium text-slate-700">{t("fields.name")}</label><input id="service-name" {...form.register("name")} aria-invalid={Boolean(form.formState.errors.name)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />{fieldError("name") && <p className="mt-1 text-xs text-red-600">{fieldError("name")}</p>}</div>
    <div><label htmlFor="service-slug" className="mb-1 block text-sm font-medium text-slate-700">{t("fields.slug")}</label><input id="service-slug" {...form.register("slug")} aria-invalid={Boolean(form.formState.errors.slug)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />{fieldError("slug") && <p className="mt-1 text-xs text-red-600">{fieldError("slug")}</p>}</div>
    <div><label htmlFor="service-duration" className="mb-1 block text-sm font-medium text-slate-700">{t("fields.duration")}</label><input id="service-duration" type="number" min={1} step={1} {...form.register("durationMinutes", { valueAsNumber: true })} aria-invalid={Boolean(form.formState.errors.durationMinutes)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />{fieldError("durationMinutes") && <p className="mt-1 text-xs text-red-600">{fieldError("durationMinutes")}</p>}</div>
    <div className="flex justify-end gap-2"><button type="button" onClick={onCancel} className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">{t("actions.cancel")}</button><button type="submit" disabled={isSubmitting || categories.length === 0} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">{isSubmitting ? t("loading") : t("actions.save")}</button></div>
  </form>;
}