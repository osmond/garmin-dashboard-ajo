/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // fallback to Tailwind’s built‑in Zinc palette
        ...require('tailwindcss/colors').zinc,
      },
    },
  },
  plugins: [],
};
