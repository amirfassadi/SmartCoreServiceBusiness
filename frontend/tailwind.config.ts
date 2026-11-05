import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        slate: {
          50: "var(--sc-bg)", 100: "var(--sc-bg)",
          200: "var(--sc-border)", 300: "#ccd3e1", 400: "#929fb6",
          500: "var(--sc-muted)", 600: "#53617d", 700: "#3b4965",
          800: "#29354e", 900: "var(--sc-text)", 950: "#10192c",
        },
      },
    },
  },
  plugins: [],
};
export default config;
