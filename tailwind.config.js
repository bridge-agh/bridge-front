/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "fade-in": "fade_in 0.5s linear",
        "fade-out": "fade_out 0.5s linear"
      },
      keyframes: {
        fade_in: {
          "0%": {opacity: 100},
          "100%": {opacity: 0}
        },
        fade_out: {
          "0%": {opacity: 0},
          "100%": {opacity: 100}
        }
      }
    },
    screens: {
      xs: "320px",
      ms: "480px",
      ...defaultTheme.screens
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
};
