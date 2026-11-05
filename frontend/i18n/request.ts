import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const normalizedLocale = requested === "en" ? "en" : "fa";

  return {
    locale: normalizedLocale,
    timeZone: "Asia/Tehran",
    messages: (await import(`../messages/${normalizedLocale}.json`)).default,
  };
});
