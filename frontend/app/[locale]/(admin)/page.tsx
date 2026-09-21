import { useTranslations } from "next-intl";

export default function AdminHomePage() {
  const t = useTranslations("admin");

  return (
    <main className="p-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">{t("nav.dashboard")}</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">{t("dashboardHeading")}</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">{t("dashboardDescription")}</p>
      </div>
    </main>
  );
}
