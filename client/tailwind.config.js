/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  mode: 'jit',
  theme: {
    screens: {
      'xs': '22.5rem',    // 360px
      'sm': '40rem',      // 640px
      'md': '48rem',      // 768px
      'lg': '64rem',      // 1024px
      'xl': '80rem',      // 1280px
      '2xl': '96rem',     // 1536px
    },
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
