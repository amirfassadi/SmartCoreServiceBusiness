import { useTranslations } from "next-intl";

export default function AdminResourcePlaceholder() {
  const t = useTranslations("admin");

  return (
    <main className="p-6">
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">{t("notImplemented")}</h1>
      </div>
    </main>
  );
}