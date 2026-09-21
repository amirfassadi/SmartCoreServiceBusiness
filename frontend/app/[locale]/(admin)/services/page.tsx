"use client";

import type { LifecycleStatus, Service } from "@/api/types";
import { useServiceCategories } from "@/features/categories/hooks/use-service-categories";
import { ServiceForm } from "@/features/services/components/service-form";
import { ServiceLifecycleDialog } from "@/features/services/components/service-lifecycle-dialog";
import { ServiceList } from "@/features/services/components/service-list";
import { useArchiveService, useCreateService, useRestoreService, useServices, useUpdateService } from "@/features/services/hooks/use-services";
import type { ServiceFormValues } from "@/features/services/schemas";
import { useBusinessContext } from "@/shared/providers/business-context-provider";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function ServicesPage() {
  const t = useTranslations("services");
  const { businessId, isLoading: businessLoading, error: businessError } = useBusinessContext();
  const [status, setStatus] = useState<LifecycleStatus>("active");
  const servicesQuery = useServices(businessId, status, Boolean(businessId) && !businessLoading && !businessError);
  const categoriesQuery = useServiceCategories(businessId, "active", Boolean(businessId) && !businessLoading && !businessError);
  const createMutation = useCreateService(businessId ?? "");
  const updateMutation = useUpdateService(businessId ?? "");
  const archiveMutation = useArchiveService(businessId ?? "");
  const restoreMutation = useRestoreService(businessId ?? "");
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [lifecycleService, setLifecycleService] = useState<Service | null>(null);
  const [lifecycleAction, setLifecycleAction] = useState<"archive" | "restore">("archive");

  const openCreate = () => { setEditingService(null); setFormMode("create"); };
  const openEdit = (service: Service) => { setEditingService(service); setFormMode("edit"); };
  const closeForm = () => { setFormMode(null); setEditingService(null); createMutation.reset(); updateMutation.reset(); };
  const submitForm = async (values: ServiceFormValues) => {
    const request = { categoryId: values.categoryId, name: values.name, slug: values.slug, durationMinutes: values.durationMinutes };
    if (formMode === "edit" && editingService) await updateMutation.mutateAsync({ serviceId: editingService.id, request });
    else await createMutation.mutateAsync(request);
    closeForm();
  };
  const openLifecycle = (service: Service, action: "archive" | "restore") => { setLifecycleService(service); setLifecycleAction(action); };
  const closeLifecycle = () => { setLifecycleService(null); archiveMutation.reset(); restoreMutation.reset(); };
  const lifecycleMutation = lifecycleAction === "archive" ? archiveMutation : restoreMutation;
  const contextError = businessError;
  const queryError = servicesQuery.error as { code?: string } | null;
  const errorCode = contextError?.code ?? queryError?.code;

  return <main className="p-4 sm:p-6"><div className="mx-auto max-w-6xl"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">{t("eyebrow")}</p><h1 className="mt-2 text-3xl font-semibold text-slate-900">{t("title")}</h1><p className="mt-2 text-sm text-slate-600">{t("description")}</p></div>{businessId && <button type="button" onClick={openCreate} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">{t("actions.create")}</button>}</div>
    {businessId && <div className="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label={t("filters.label")}>{(["active", "archived", "all"] as const).map((value) => <button key={value} type="button" onClick={() => setStatus(value)} aria-pressed={status === value} className={`rounded-md px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${status === value ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-700 hover:bg-slate-50"}`}>{t(`filters.${value}`)}</button>)}</div>}
    {!businessId && <StatePanel title={t("states.noBusiness")} message={t("states.noBusinessMessage")} />}
    {businessId && businessLoading && <StatePanel title={t("loading")} message={t("states.loadingMessage")} />}
    {businessId && !businessLoading && contextError && <StatePanel title={errorTitle(errorCode, t)} message={errorMessage(errorCode, t)} />}
    {businessId && !businessLoading && !contextError && servicesQuery.isLoading && <StatePanel title={t("loading")} message={t("states.loadingMessage")} />}
    {businessId && !businessLoading && !contextError && servicesQuery.error && <StatePanel title={errorTitle(errorCode, t)} message={errorMessage(errorCode, t)} />}
    {businessId && !businessLoading && !contextError && servicesQuery.data?.length === 0 && <StatePanel title={t("states.empty")} message={t("states.emptyMessage")} action={<button type="button" onClick={openCreate} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">{t("actions.create")}</button>} />}
    {businessId && !businessLoading && !contextError && servicesQuery.data && servicesQuery.data.length > 0 && <div className="mt-6"><ServiceList services={servicesQuery.data} categories={categoriesQuery.data ?? []} onEdit={openEdit} onArchive={(service) => openLifecycle(service, "archive")} onRestore={(service) => openLifecycle(service, "restore")} /></div>}
    </div>
    {formMode && <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onMouseDown={closeForm}><section role="dialog" aria-modal="true" aria-labelledby="service-form-title" className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl" onMouseDown={(event) => event.stopPropagation()}><h2 id="service-form-title" className="mb-5 text-lg font-semibold text-slate-900">{formMode === "create" ? t("createTitle") : t("editTitle")}</h2><ServiceForm service={editingService} categories={categoriesQuery.data ?? []} isSubmitting={createMutation.isPending || updateMutation.isPending} error={(createMutation.error ?? updateMutation.error) as { message?: string } | null} onSubmit={submitForm} onCancel={closeForm} /></section></div>}
    {lifecycleService && <ServiceLifecycleDialog service={lifecycleService} action={lifecycleAction} isSubmitting={lifecycleMutation.isPending} error={lifecycleMutation.error as { code?: string; message?: string } | null} onConfirm={async () => { await lifecycleMutation.mutateAsync(lifecycleService.id); closeLifecycle(); }} onCancel={closeLifecycle} />}
  </main>;
}

function StatePanel({ title, message, action }: { title: string; message: string; action?: React.ReactNode }) { return <section className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center"><h2 className="text-lg font-semibold text-slate-900">{title}</h2><p className="mt-2 text-sm text-slate-600">{message}</p>{action && <div className="mt-4">{action}</div>}</section>; }
function errorTitle(code: string | undefined, t: ReturnType<typeof useTranslations>) { if (code === "BUSINESS_NOT_FOUND") return t("errors.businessNotFoundTitle"); if (code === "BUSINESS_ACCESS_DENIED") return t("errors.accessDeniedTitle"); return t("errors.genericTitle"); }
function errorMessage(code: string | undefined, t: ReturnType<typeof useTranslations>) { if (code === "BUSINESS_NOT_FOUND") return t("errors.businessNotFound"); if (code === "BUSINESS_ACCESS_DENIED") return t("errors.accessDenied"); if (code === "PERSISTENCE_FAILURE") return t("errors.persistence"); return t("errors.generic"); }