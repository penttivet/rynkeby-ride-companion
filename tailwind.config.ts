import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        rynkeby: {
          red: "#C8102E",
          yellow: "#FFD700",
          dark: "#1A1A2E",
          card: "#16213E",
          surface: "#0F3460",
        },
      },
      fontFamily: {
        display: ["'Barlow Condensed'", "sans-serif"],
        body: ["'Barlow'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
