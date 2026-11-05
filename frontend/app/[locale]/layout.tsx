import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales } from "@/next-intl.config";
import { QueryProvider } from "@/providers/query-provider";
import "@/app/globals.css";

export const dynamic = "force-dynamic";
export const metadata = {title: "SmartCore | Business", description: "SmartCore business workspace"};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const {locale} = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}><body><QueryProvider>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Tehran">{children}</NextIntlClientProvider>
    </QueryProvider></body></html>
  );
}
