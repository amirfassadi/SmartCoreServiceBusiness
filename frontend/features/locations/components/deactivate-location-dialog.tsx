"use client";

import type { BusinessLocation } from "@/api/types";
import { useTranslations } from "next-intl";

export function DeactivateLocationDialog({ location, isSubmitting, onConfirm, onCancel }: { location: BusinessLocation; isSubmitting: boolean; onConfirm: () => void; onCancel: () => void }) {
  const t = useTranslations("locations");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onMouseDown={onCancel}>
      <section role="dialog" aria-modal="true" aria-labelledby="deactivate-location-title" className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl" onMouseDown={(event) => event.stopPropagation()}>
        <h2 id="deactivate-location-title" className="text-lg font-semibold text-slate-900">{t("confirm.title")}</h2>
        <p className="mt-2 text-sm text-slate-600">{t("confirm.message", { name: location.name })}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">{t("actions.cancel")}</button>
          <button type="button" onClick={onConfirm} disabled={isSubmitting} className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">{isSubmitting ? t("loading") : t("actions.deactivate")}</button>
        </div>
      </section>
    </div>
  );
}