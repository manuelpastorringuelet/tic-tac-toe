/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  fontFamily: {
    sans: ["Monospace", "sans-serif"],
    serif: ["Merriweather", "serif"],
  },
  theme: {
    extend: {
      fontFamily: {
        retro: ["'Press Start 2P'", "sans-serif"],
      },
      fontSize: {
        xxs: "0.5rem",
      },
      colors: {
        "retro-purple": "#8F43EE",
        "retro-yellow-200": "#F0EB8D",
        "retro-yellow-300": "#d8d37e",
        "retro-gray-800": "#413543",
      },
    },
  },
  plugins: [],
};
