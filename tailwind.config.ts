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
            DEFAULT: "#ED2025",
            50: "#fdf2f2",
            100: "#fde8e8",
            200: "#fbd5d5",
            300: "#f8b4b4",
            400: "#f98080",
            500: "#ED2025",
            600: "#d11a1f",
            700: "#b5151a",
            800: "#9b1116",
            900: "#771d1d",
          },
          navy: {
            DEFAULT: "#263b9f",
            50: "#eef2ff",
            100: "#e0e7ff",
            200: "#c7d2fe",
            300: "#a5b4fc",
            400: "#818cf8",
            500: "#263b9f",
            600: "#1d2e7e",
            700: "#182667",
            800: "#131e52",
            900: "#0f1741",
          },
        },
      },
      fontFamily: {
        roboto: ["var(--font-roboto)", "Roboto", "sans-serif"],
        sans: ["var(--font-roboto)", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
