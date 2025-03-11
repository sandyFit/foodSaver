/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        'hawaii': '#f9faf7',
        'tahiti': {
          100: 'F6FFFE',
          200: '#D9EDEB',
          700: '#03776B',

          bluesky: {
            400: '#147995',
          }
        },
      },
      fontFamily: {
        condensed: ["Roboto Condensed", 'sans-serif'],
        monserrat: ["montserrat", 'sans-serif']
      },
    },
  },
  plugins: [],
};
