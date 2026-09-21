"use client";

import type { PolicyVersion } from "@/api/types";
import { useTranslations } from "next-intl";

export function PolicyHistory({ versions }: { versions: PolicyVersion[] }) {
  const t = useTranslations("policies");
  return <section aria-labelledby="policy-history-title" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><h2 id="policy-history-title" className="text-lg font-semibold text-slate-900">{t("history.title")}</h2><ol className="mt-4 space-y-3">{versions.map((version) => <li key={`${version.id}-${version.version}`} className="border-s border-slate-200 ps-4"><div className="flex items-center justify-between gap-3"><span className="font-medium text-slate-800">{t("history.version", { version: version.version })}</span><time className="text-xs text-slate-500" dateTime={version.updatedAt}>{version.updatedAt}</time></div><pre className="mt-2 overflow-x-auto rounded-md bg-slate-50 p-3 text-xs text-slate-700">{JSON.stringify(version.policyValueJson, null, 2)}</pre></li>)}</ol></section>;
}