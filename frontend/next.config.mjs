import createNextIntlPlugin from "next-intl/plugin";
import {fileURLToPath} from "node:url";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
};

export default withNextIntl(nextConfig);
