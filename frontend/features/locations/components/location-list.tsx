"use client";

import type { BusinessLocation } from "@/api/types";
import { useTranslations } from "next-intl";

type LocationListProps = {
  locations: BusinessLocation[];
  onEdit: (location: BusinessLocation) => void;
  onDeactivate: (location: BusinessLocation) => void;
};

export function LocationList({ locations, onEdit, onDeactivate }: LocationListProps) {
  const t = useTranslations("locations");

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {locations.map((location) => (
        <article key={location.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-slate-900">{location.name}</h2>
              <p className="mt-1 text-sm text-slate-600">{location.address || t("noAddress")}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${location.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
              {location.active ? t("status.active") : t("status.inactive")}
            </span>
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <div><dt className="text-xs text-slate-400">{t("fields.timezone")}</dt><dd>{location.timezone}</dd></div>
            <div><dt className="text-xs text-slate-400">{t("fields.id")}</dt><dd className="truncate">{location.id}</dd></div>
          </dl>
          <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
            <button type="button" onClick={() => onEdit(location)} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">{t("actions.edit")}</button>
            {location.active && <button type="button" onClick={() => onDeactivate(location)} className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">{t("actions.deactivate")}</button>}
          </div>
        </article>
      ))}
    </div>
  );
}