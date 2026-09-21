import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const normalizedLocale = locale ?? "fa";

  return {
    locale: normalizedLocale,
    messages: (await import(`../messages/${normalizedLocale}.json`)).default,
  };
});
