import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // iistelle-Markenfarben (Personio-inspirierte Petrol-Palette)
        petrol: {
          50: "#eef6f7",
          100: "#d5e8ea",
          200: "#a8cfd4",
          300: "#74b0b8",
          400: "#45909a",
          500: "#2b747e",
          600: "#1f5d66",
          700: "#1a4b53",
          800: "#143b42",
          900: "#0f2e34",
          950: "#0a2026",
        },
        coral: {
          400: "#ff7a6e",
          500: "#ff5a50",
          600: "#e8453c",
        },
        surface: "#f6f8f9",
      },
      boxShadow: {
        card: "0 1px 3px rgba(15,46,52,0.08), 0 1px 2px rgba(15,46,52,0.04)",
        cardHover: "0 6px 20px rgba(15,46,52,0.12)",
      },
      borderRadius: {
        xl2: "14px",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        handwriting: ["Caveat", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
