const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
      },
      fontSize: {
        "2xs": ["0.625rem" /* 10px */, "0.875rem" /* 14px */],
      },
      keyframes: {
        "progress-bar-left": {
          "0%": { width: "0%", right: "50%" },
          "50%": { width: "50%", right: "50%" },
          "100%": { width: "50%", right: "100%" },
        },
        "progress-bar-right": {
          "0%": { width: "0%", left: "50%" },
          "50%": { width: "50%", left: "50%" },
          "100%": { width: "50%", left: "100%" },
        },
      },
      animation: {
        "progress-bar-left": "progress-bar-left 2s linear infinite",
        "progress-bar-right": "progress-bar-right 2s linear infinite",
      },
      screens: {
        sm: "768px",
        md: "1024px",
        lg: "1280px",
        xl: "1536px",
      },
    },
  },
  plugins: [],
}
