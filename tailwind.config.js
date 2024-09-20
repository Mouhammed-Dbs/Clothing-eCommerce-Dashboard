/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/theme");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          DEFAULT: "#4d4e49", // Default primary color
          100: "#d3d5d0", // Light gray
          200: "#c1c3bd", // Light gray 2
          300: "#a8aba5", // Medium gray
          400: "#8f918a", // Medium dark gray
          500: "#4d4e49", // Your original primary color
          600: "#4a4c42", // Darker shade
          700: "#3d3f36", // Even darker shade
          800: "#30322a", // Dark gray
          900: "#222525", // Darkest gray
        },
        "primary-dark": "#4a4c42",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
