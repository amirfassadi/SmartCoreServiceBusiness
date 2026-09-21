"use client";

import type { ApiError } from "@/api/errors";
import type { BusinessPolicy } from "@/api/types";
import { PolicyHistory } from "@/features/policies/components/policy-history";
import { useCreatePolicy, useCurrentPolicy, usePolicyVersions, useUpdatePolicy } from "@/features/policies/hooks/use-policies";
import { policyEditorSchema, type PolicyEditorValues } from "@/features/policies/schemas";
import { useBusinessContext } from "@/shared/providers/business-context-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import React from "react";
import { useForm } from "react-hook-form";

export default function PoliciesPage() {
  const t = useTranslations("policies");
  const { businessId, isLoading: businessLoading, error: businessError } = useBusinessContext();
  const [lookupKey, setLookupKey] = useState("");
  const [policyKey, setPolicyKey] = useState("");
  const [draft, setDraft] = useState<BusinessPolicy | null>(null);
  const currentQuery = useCurrentPolicy(businessId, policyKey);
  const historyQuery = usePolicyVersions(businessId, policyKey, Boolean(policyKey && !businessLoading && !businessError));
  const createMutation = useCreatePolicy(businessId ?? "", policyKey);
  const updateMutation = useUpdatePolicy(businessId ?? "", policyKey);
  const form = useForm<PolicyEditorValues>({ resolver: zodResolver(policyEditorSchema), defaultValues: { policyKey: "", policyValueText: "" } });
  const hasCurrentPolicy = Boolean(currentQuery.data);

  useEffect(() => {
    if (currentQuery.data) {
      setDraft(currentQuery.data);
      form.reset({ policyKey: currentQuery.data.policyKey, policyValueText: JSON.stringify(currentQuery.data.policyValueJson, null, 2) });
    }
  }, [currentQuery.data, form]);

  const lookup = () => {
    const key = lookupKey.trim();
    if (policyEditorSchema.shape.policyKey.safeParse(key).success) {
      setDraft(null);
      setPolicyKey(key);
      form.reset({ policyKey: key, policyValueText: form.getValues("policyValueText") });
    } else {
      setPolicyKey("");
    }
  };

  const submit = async (values: PolicyEditorValues) => {
    const parsed = JSON.parse(values.policyValueText) as Record<string, unknown>;
    if (hasCurrentPolicy) await updateMutation.mutateAsync({ policyValueJson: parsed });
    else await createMutation.mutateAsync({ policyKey: values.policyKey, policyValueJson: parsed });
    form.clearErrors();
  };

  const reloadLatest = () => {
    void currentQuery.refetch();
    void historyQuery.refetch();
  };
  const queryError = (currentQuery.error ?? businessError) as ApiError | null;
  const mutationError = (updateMutation.error ?? createMutation.error) as ApiError | null;
  const error = mutationError ?? queryError;
  const policyNotFound = currentQuery.error && getApiErrorCode(currentQuery.error) === "POLICY_NOT_FOUND";

  return <main className="p-4 sm:p-6"><div className="mx-auto max-w-6xl"><header><p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">{t("eyebrow")}</p><h1 className="mt-2 text-3xl font-semibold text-slate-900">{t("title")}</h1><p className="mt-2 text-sm text-slate-600">{t("description")}</p></header>
    <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={(event) => { event.preventDefault(); lookup(); }}><div className="min-w-0 flex-1"><label htmlFor="policy-lookup-key" className="mb-1 block text-sm font-medium text-slate-700">{t("fields.policyKey")}</label><input id="policy-lookup-key" value={lookupKey} onChange={(event) => setLookupKey(event.target.value)} aria-describedby="policy-key-help" className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" /><p id="policy-key-help" className="mt-1 text-xs text-slate-500">{t("fields.keyHelp")}</p></div><button type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">{t("actions.load")}</button></form></section>
    {!businessId && <StatePanel title={t("states.noBusiness")} message={t("states.noBusinessMessage")} />}
    {businessId && businessLoading && <StatePanel title={t("loading")} message={t("states.loadingMessage")} />}
    {businessId && !businessLoading && businessError && <StatePanel title={t("errors.businessTitle")} message={t("errors.business")} />}
    {businessId && policyKey && currentQuery.isLoading && <StatePanel title={t("loading")} message={t("states.loadingMessage")} />}
    {businessId && policyKey && currentQuery.error && !policyNotFound && <StatePanel title={errorTitle(getApiErrorCode(currentQuery.error), t)} message={errorMessage(getApiErrorCode(currentQuery.error), t)} />}
    {businessId && policyKey && !currentQuery.isLoading && (!currentQuery.error || policyNotFound) && <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"><section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-semibold text-slate-900">{hasCurrentPolicy ? t("current.title") : t("createTitle")}</h2>{draft && <p className="mt-1 text-sm text-slate-500">{t("current.version", { version: draft.version })}</p>}</div>{draft && <button type="button" onClick={reloadLatest} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">{t("actions.reload")}</button>}</div><form className="mt-5 space-y-4" onSubmit={form.handleSubmit(submit)} noValidate>{error?.code === "POLICY_VERSION_CONFLICT" && <div role="alert" className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{t("errors.versionConflict")}<button type="button" onClick={reloadLatest} className="mt-2 block font-medium underline">{t("actions.reload")}</button></div>}{form.formState.errors.policyKey && <p role="alert" className="text-sm text-red-700">{t(`validation.${form.formState.errors.policyKey.message}`)}</p>}<div><label htmlFor="policy-form-key" className="mb-1 block text-sm font-medium text-slate-700">{t("fields.policyKey")}</label><input id="policy-form-key" {...form.register("policyKey")} readOnly={hasCurrentPolicy} className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-sm" /></div><div><label htmlFor="policy-json" className="mb-1 block text-sm font-medium text-slate-700">{t("fields.jsonValue")}</label><p id="policy-json-help" className="mb-1 text-xs text-slate-500">{t("fields.jsonHelp")}</p><textarea id="policy-json" {...form.register("policyValueText")} aria-describedby="policy-json-help" aria-invalid={Boolean(form.formState.errors.policyValueText)} rows={14} className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />{form.formState.errors.policyValueText && <p role="alert" className="mt-1 text-sm text-red-700">{t(`validation.${form.formState.errors.policyValueText.message}`)}</p>}</div>{error && error.code !== "POLICY_VERSION_CONFLICT" && error.code !== "POLICY_NOT_FOUND" && <p role="alert" className="text-sm text-red-700">{error.message}</p>}<button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">{createMutation.isPending || updateMutation.isPending ? t("loading") : t("actions.save")}</button></form></section>{historyQuery.data && <PolicyHistory versions={historyQuery.data} />}</div>}
  </div></main>;
}

function StatePanel({ title, message }: { title: string; message: string }) { return <section className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center"><h2 className="text-lg font-semibold text-slate-900">{title}</h2><p className="mt-2 text-sm text-slate-600">{message}</p></section>; }
function errorTitle(code: string | undefined, t: ReturnType<typeof useTranslations>) { if (code === "POLICY_NOT_FOUND") return t("errors.notFoundTitle"); if (code === "BUSINESS_NOT_FOUND") return t("errors.businessTitle"); if (code === "BUSINESS_ACCESS_DENIED") return t("errors.accessTitle"); return t("errors.genericTitle"); }
function errorMessage(code: string | undefined, t: ReturnType<typeof useTranslations>) { if (code === "POLICY_NOT_FOUND") return t("errors.notFound"); if (code === "BUSINESS_NOT_FOUND") return t("errors.business"); if (code === "BUSINESS_ACCESS_DENIED") return t("errors.access"); if (code === "PERSISTENCE_FAILURE") return t("errors.persistence"); return t("errors.generic"); }
function getApiErrorCode(error: unknown) { return typeof error === "object" && error !== null && "code" in error && typeof error.code === "string" ? error.code : undefined; }