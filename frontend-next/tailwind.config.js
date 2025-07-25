/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ...require('tailwindcss/colors').zinc,
      },
    },
  },
  plugins: [],
};
