"use client";

import type { BusinessLocation } from "@/api/types";
import { useBusinessContext } from "@/shared/providers/business-context-provider";
import { DeactivateLocationDialog } from "@/features/locations/components/deactivate-location-dialog";
import { LocationForm } from "@/features/locations/components/location-form";
import { LocationList } from "@/features/locations/components/location-list";
import { getLocationMutationError, useCreateLocation, useDeactivateLocation, useLocations, useUpdateLocation } from "@/features/locations/hooks/use-locations";
import type { LocationFormValues } from "@/features/locations/schemas";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function LocationsPage() {
  const t = useTranslations("locations");
  const { businessId, isLoading: isBusinessLoading, error: businessError } = useBusinessContext();
  const locationsQuery = useLocations(businessId, !isBusinessLoading && !businessError);
  const createMutation = useCreateLocation(businessId ?? "");
  const updateMutation = useUpdateLocation(businessId ?? "");
  const deactivateMutation = useDeactivateLocation(businessId ?? "");
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingLocation, setEditingLocation] = useState<BusinessLocation | null>(null);
  const [deactivatingLocation, setDeactivatingLocation] = useState<BusinessLocation | null>(null);

  const openCreate = () => { setEditingLocation(null); setFormMode("create"); };
  const openEdit = (location: BusinessLocation) => { setEditingLocation(location); setFormMode("edit"); };
  const closeForm = () => { setFormMode(null); setEditingLocation(null); createMutation.reset(); updateMutation.reset(); };

  const submitForm = async (values: LocationFormValues) => {
    const request = { name: values.name, timezone: values.timezone, ...(values.address ? { address: values.address } : {}) };
    if (formMode === "edit" && editingLocation) {
      await updateMutation.mutateAsync({ locationId: editingLocation.id, request });
    } else {
      await createMutation.mutateAsync(request);
    }
    closeForm();
  };

  const contextError = businessError ?? null;
  const queryError = getLocationMutationError(locationsQuery.error);
  const formError = getLocationMutationError(createMutation.error ?? updateMutation.error);

  return (
    <main className="p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">{t("eyebrow")}</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{t("title")}</h1>
            <p className="mt-2 text-sm text-slate-600">{t("description")}</p>
          </div>
          {businessId && <button type="button" onClick={openCreate} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">{t("actions.create")}</button>}
        </div>

        {!businessId && <StatePanel title={t("states.noBusiness")} message={t("states.noBusinessMessage")} />}
        {businessId && isBusinessLoading && <StatePanel title={t("loading")} message={t("states.loadingMessage")} />}
        {businessId && !isBusinessLoading && contextError && <StatePanel title={getErrorTitle(contextError.code, t)} message={getErrorMessage(contextError.code, t)} />}
        {businessId && !isBusinessLoading && !contextError && locationsQuery.isLoading && <StatePanel title={t("loading")} message={t("states.loadingMessage")} />}
        {businessId && !isBusinessLoading && !contextError && locationsQuery.error && <StatePanel title={getErrorTitle(queryError?.code, t)} message={getErrorMessage(queryError?.code, t)} />}
        {businessId && !isBusinessLoading && !contextError && locationsQuery.data && locationsQuery.data.length === 0 && <StatePanel title={t("states.empty")} message={t("states.emptyMessage")} action={<button type="button" onClick={openCreate} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">{t("actions.create")}</button>} />}
        {businessId && !isBusinessLoading && !contextError && locationsQuery.data && locationsQuery.data.length > 0 && <div className="mt-6"><LocationList locations={locationsQuery.data} onEdit={openEdit} onDeactivate={setDeactivatingLocation} /></div>}
      </div>

      {formMode && <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onMouseDown={closeForm}><section role="dialog" aria-modal="true" aria-labelledby="location-form-title" className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl" onMouseDown={(event) => event.stopPropagation()}><h2 id="location-form-title" className="mb-5 text-lg font-semibold text-slate-900">{formMode === "create" ? t("createTitle") : t("editTitle")}</h2><LocationForm location={editingLocation} isSubmitting={createMutation.isPending || updateMutation.isPending} error={formError} onSubmit={submitForm} onCancel={closeForm} /></section></div>}
      {deactivatingLocation && <DeactivateLocationDialog location={deactivatingLocation} isSubmitting={deactivateMutation.isPending} onCancel={() => { setDeactivatingLocation(null); deactivateMutation.reset(); }} onConfirm={async () => { await deactivateMutation.mutateAsync(deactivatingLocation.id); setDeactivatingLocation(null); }} />}
    </main>
  );
}

function StatePanel({ title, message, action }: { title: string; message: string; action?: React.ReactNode }) {
  return <section className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center"><h2 className="text-lg font-semibold text-slate-900">{title}</h2><p className="mt-2 text-sm text-slate-600">{message}</p>{action && <div className="mt-4">{action}</div>}</section>;
}

function getErrorTitle(code: string | undefined, t: ReturnType<typeof useTranslations>) {
  if (code === "BUSINESS_NOT_FOUND") return t("errors.businessNotFoundTitle");
  if (code === "BUSINESS_ACCESS_DENIED") return t("errors.accessDeniedTitle");
  return t("errors.genericTitle");
}

function getErrorMessage(code: string | undefined, t: ReturnType<typeof useTranslations>) {
  if (code === "BUSINESS_NOT_FOUND") return t("errors.businessNotFound");
  if (code === "BUSINESS_ACCESS_DENIED") return t("errors.accessDenied");
  if (code === "PERSISTENCE_FAILURE") return t("errors.persistence");
  return t("errors.generic");
}