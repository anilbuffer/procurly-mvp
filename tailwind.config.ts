import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: {
            DEFAULT: "#FE0000",
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#FE0000",
            600: "#D81419",
            700: "#9B0A0F",
            800: "#7A070B",
            900: "#520507",
          },
          navy: {
            DEFAULT: "#2B4499",
            50: "#eef2ff",
            100: "#e0e7ff",
            200: "#c7d2fe",
            300: "#a5b4fc",
            400: "#818cf8",
            500: "#2B4499",
            600: "#23377d",
            700: "#1b2a60",
            800: "#131e44",
            900: "#0b1229",
          },
          dark: {
            sidebar: "#0C101A",
            border: "#1E2538",
            card: "#141B2B",
            hover: "#182033",
          },
        },
      },
      fontFamily: {
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
