import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "warm-white": "#FBFBF9",
        aluminum: "#F3F4F6",
        graphite: "#5E5E5E",
        charcoal: "#1A1A1A",
        cobalt: "#2563EB",
        "dark-base": "#121212",
      },
      fontFamily: {
        display: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "1rem",
      },
      transitionTimingFunction: {
        "quintic-out": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
