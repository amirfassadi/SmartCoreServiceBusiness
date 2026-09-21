"use client";

import { useBusinessContext } from "@/shared/providers/business-context-provider";
import { Building2, BriefcaseBusiness, FolderTree, Home, MapPin, Menu, ShieldCheck, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useState } from "react";

const navItems = [
  { key: "dashboard", path: "", icon: Home },
  { key: "business", path: "business", icon: Building2 },
  { key: "locations", path: "locations", icon: MapPin },
  { key: "categories", path: "categories", icon: FolderTree },
  { key: "services", path: "services", icon: BriefcaseBusiness },
  { key: "policies", path: "policies", icon: ShieldCheck },
] as const;

function localePath(locale: string, path: string) {
  return path ? `/${locale}/${path}` : `/${locale}`;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("admin");
  const { businessId, business, isLoading, error, clearBusiness } = useBusinessContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const businessName = business?.profile?.name ?? business?.slug;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className={`${menuOpen ? "block" : "hidden"} w-full border-b border-slate-200 bg-white md:block md:w-72 md:border-b-0 md:border-e`}>
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">SmartCore</p>
              <h2 className="text-lg font-semibold">{t("product")}</h2>
            </div>
            <button type="button" className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden" aria-label={t("closeMenu")} onClick={() => setMenuOpen(false)}>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <nav aria-label={t("navigation")} className="space-y-1 p-3">
            {navItems.map(({ key, path, icon: Icon }) => {
              const href = localePath(locale, path);
              const active = pathname === href;
              return (
                <Link key={key} href={href} aria-current={active ? "page" : undefined} onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {t(`nav.${key}`)}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button type="button" className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden" aria-label={t("openMenu")} aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{t("section")}</p>
                  <h1 className="text-xl font-semibold">{t("title")}</h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={localePath(locale === "fa" ? "en" : "fa", "")} className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                  {locale === "fa" ? "EN" : "FA"}
                </Link>
                <BusinessSelector name={businessName} businessId={businessId} isLoading={isLoading} errorCode={error?.code} onClear={clearBusiness} t={t} />
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

function BusinessSelector({ name, businessId, isLoading, errorCode, onClear, t }: { name?: string; businessId: string | null; isLoading: boolean; errorCode?: string; onClear: () => void; t: ReturnType<typeof useTranslations> }) {
  let label = t("noBusiness");
  if (isLoading) label = t("loading");
  else if (errorCode === "BUSINESS_NOT_FOUND") label = t("errors.notFound");
  else if (errorCode === "BUSINESS_ACCESS_DENIED") label = t("errors.accessDenied");
  else if (name) label = name;
  else if (businessId) label = businessId;

  return (
    <div className="flex max-w-[12rem] items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm" aria-label={t("selector")}>
      <Building2 className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
      <span className="truncate text-slate-700">{label}</span>
      {businessId && <button type="button" onClick={onClear} className="shrink-0 text-xs text-slate-500 underline hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">{t("clear")}</button>}
    </div>
  );
}
