/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ntc: {
          black: "#000000",
          zinc: "#0A0A0A",
          lime: "#D2FF00", // NTC 螢光色
          gray: "#1C1C1E"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}