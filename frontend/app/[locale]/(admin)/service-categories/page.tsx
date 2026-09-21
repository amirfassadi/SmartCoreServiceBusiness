"use client";

import type { ServiceCategory } from "@/api/types";
import { CategoryForm } from "@/features/categories/components/category-form";
import { CategoryLifecycleDialog } from "@/features/categories/components/category-lifecycle-dialog";
import { CategoryList } from "@/features/categories/components/category-list";
import { useArchiveCategory, useCreateCategory, useRestoreCategory, useServiceCategories, useUpdateCategory } from "@/features/categories/hooks/use-service-categories";
import type { CategoryFormValues } from "@/features/categories/schemas";
import { useBusinessContext } from "@/shared/providers/business-context-provider";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { LifecycleStatus } from "@/api/types";

export default function ServiceCategoriesPage() {
  const t = useTranslations("categories");
  const { businessId, isLoading: isBusinessLoading, error: businessError } = useBusinessContext();
  const [status, setStatus] = useState<LifecycleStatus>("active");
  const categoriesQuery = useServiceCategories(businessId, status, !isBusinessLoading && !businessError);
  const parentQuery = useServiceCategories(businessId, "all", Boolean(businessId));
  const createMutation = useCreateCategory(businessId ?? "");
  const updateMutation = useUpdateCategory(businessId ?? "");
  const archiveMutation = useArchiveCategory(businessId ?? "");
  const restoreMutation = useRestoreCategory(businessId ?? "");
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [lifecycleCategory, setLifecycleCategory] = useState<ServiceCategory | null>(null);
  const [lifecycleAction, setLifecycleAction] = useState<"archive" | "restore">("archive");

  const openCreate = () => { setEditingCategory(null); setFormMode("create"); };
  const openEdit = (category: ServiceCategory) => { setEditingCategory(category); setFormMode("edit"); };
  const closeForm = () => { setFormMode(null); setEditingCategory(null); createMutation.reset(); updateMutation.reset(); };
  const submitForm = async (values: CategoryFormValues) => {
    const request = { name: values.name, slug: values.slug, ...(values.parentCategoryId ? { parentCategoryId: values.parentCategoryId } : {}) };
    if (formMode === "edit" && editingCategory) await updateMutation.mutateAsync({ categoryId: editingCategory.id, request });
    else await createMutation.mutateAsync(request);
    closeForm();
  };
  const openLifecycle = (category: ServiceCategory, action: "archive" | "restore") => { setLifecycleCategory(category); setLifecycleAction(action); };
  const closeLifecycle = () => { setLifecycleCategory(null); archiveMutation.reset(); restoreMutation.reset(); };
  const lifecycleMutation = lifecycleAction === "archive" ? archiveMutation : restoreMutation;
  const queryError = categoriesQuery.error as { code?: string } | null;
  const contextError = businessError;
  const errorCode = contextError?.code ?? queryError?.code;

  return <main className="p-4 sm:p-6"><div className="mx-auto max-w-6xl"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">{t("eyebrow")}</p><h1 className="mt-2 text-3xl font-semibold text-slate-900">{t("title")}</h1><p className="mt-2 text-sm text-slate-600">{t("description")}</p></div>{businessId && <button type="button" onClick={openCreate} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">{t("actions.create")}</button>}</div>
    {businessId && <div className="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label={t("filters.label")}>{(["active", "archived", "all"] as const).map((value) => <button key={value} type="button" onClick={() => setStatus(value)} aria-pressed={status === value} className={`rounded-md px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${status === value ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-700 hover:bg-slate-50"}`}>{t(`filters.${value}`)}</button>)}</div>}
    {!businessId && <StatePanel title={t("states.noBusiness")} message={t("states.noBusinessMessage")} />}
    {businessId && isBusinessLoading && <StatePanel title={t("loading")} message={t("states.loadingMessage")} />}
    {businessId && !isBusinessLoading && contextError && <StatePanel title={errorTitle(errorCode, t)} message={errorMessage(errorCode, t)} />}
    {businessId && !isBusinessLoading && !contextError && categoriesQuery.isLoading && <StatePanel title={t("loading")} message={t("states.loadingMessage")} />}
    {businessId && !isBusinessLoading && !contextError && categoriesQuery.error && <StatePanel title={errorTitle(errorCode, t)} message={errorMessage(errorCode, t)} />}
    {businessId && !isBusinessLoading && !contextError && categoriesQuery.data?.length === 0 && <StatePanel title={t("states.empty")} message={t("states.emptyMessage")} action={<button type="button" onClick={openCreate} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">{t("actions.create")}</button>} />}
    {businessId && !isBusinessLoading && !contextError && categoriesQuery.data && categoriesQuery.data.length > 0 && <div className="mt-6"><CategoryList categories={categoriesQuery.data} onEdit={openEdit} onArchive={(category) => openLifecycle(category, "archive")} onRestore={(category) => openLifecycle(category, "restore")} /></div>}
    </div>
    {formMode && <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onMouseDown={closeForm}><section role="dialog" aria-modal="true" aria-labelledby="category-form-title" className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl" onMouseDown={(event) => event.stopPropagation()}><h2 id="category-form-title" className="mb-5 text-lg font-semibold text-slate-900">{formMode === "create" ? t("createTitle") : t("editTitle")}</h2><CategoryForm category={editingCategory} parentCategories={parentQuery.data ?? []} isSubmitting={createMutation.isPending || updateMutation.isPending} error={(createMutation.error ?? updateMutation.error) as { message?: string } | null} onSubmit={submitForm} onCancel={closeForm} /></section></div>}
    {lifecycleCategory && <CategoryLifecycleDialog category={lifecycleCategory} action={lifecycleAction} isSubmitting={lifecycleMutation.isPending} error={lifecycleMutation.error as { code?: string; message?: string } | null} onConfirm={async () => { await lifecycleMutation.mutateAsync(lifecycleCategory.id); closeLifecycle(); }} onCancel={closeLifecycle} />}
  </main>;
}

function StatePanel({ title, message, action }: { title: string; message: string; action?: React.ReactNode }) { return <section className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center"><h2 className="text-lg font-semibold text-slate-900">{title}</h2><p className="mt-2 text-sm text-slate-600">{message}</p>{action && <div className="mt-4">{action}</div>}</section>; }
function errorTitle(code: string | undefined, t: ReturnType<typeof useTranslations>) { if (code === "BUSINESS_NOT_FOUND") return t("errors.businessNotFoundTitle"); if (code === "BUSINESS_ACCESS_DENIED") return t("errors.accessDeniedTitle"); return t("errors.genericTitle"); }
function errorMessage(code: string | undefined, t: ReturnType<typeof useTranslations>) { if (code === "BUSINESS_NOT_FOUND") return t("errors.businessNotFound"); if (code === "BUSINESS_ACCESS_DENIED") return t("errors.accessDenied"); if (code === "PERSISTENCE_FAILURE") return t("errors.persistence"); return t("errors.generic"); }