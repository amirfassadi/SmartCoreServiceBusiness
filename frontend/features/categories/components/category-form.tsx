"use client";

import type { ServiceCategory } from "@/api/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { categoryFormSchema, type CategoryFormValues } from "@/features/categories/schemas";

export function CategoryForm({ category, parentCategories, isSubmitting, error, onSubmit, onCancel }: { category?: ServiceCategory | null; parentCategories: ServiceCategory[]; isSubmitting: boolean; error?: { message?: string } | null; onSubmit: (values: CategoryFormValues) => void; onCancel: () => void }) {
  const t = useTranslations("categories");
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: category?.name ?? "", slug: category?.slug ?? "", parentCategoryId: category?.parentCategoryId ?? "" },
  });
  const fieldError = (field: keyof CategoryFormValues) => {
    const code = form.formState.errors[field]?.message;
    return code ? t(`validation.${code}`) : null;
  };

  return <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
    {error && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error.message ?? t("errors.generic")}</p>}
    <div><label htmlFor="category-name" className="mb-1 block text-sm font-medium text-slate-700">{t("fields.name")}</label><input id="category-name" {...form.register("name")} aria-invalid={Boolean(form.formState.errors.name)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />{fieldError("name") && <p className="mt-1 text-xs text-red-600">{fieldError("name")}</p>}</div>
    <div><label htmlFor="category-slug" className="mb-1 block text-sm font-medium text-slate-700">{t("fields.slug")}</label><input id="category-slug" {...form.register("slug")} aria-invalid={Boolean(form.formState.errors.slug)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />{fieldError("slug") && <p className="mt-1 text-xs text-red-600">{fieldError("slug")}</p>}</div>
    <div><label htmlFor="category-parent" className="mb-1 block text-sm font-medium text-slate-700">{t("fields.parent")}</label><select id="category-parent" {...form.register("parentCategoryId")} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"><option value="">{t("fields.noParent")}</option>{parentCategories.filter((item) => item.id !== category?.id).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
    <div className="flex justify-end gap-2"><button type="button" onClick={onCancel} className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">{t("actions.cancel")}</button><button type="submit" disabled={isSubmitting} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">{isSubmitting ? t("loading") : t("actions.save")}</button></div>
  </form>;
}