/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx,js,jsx}', // Scans all files in src for Tailwind classes
  ],
  safelist: [
    'block',
    'hidden',
    'md:grid',
    'md:hidden',
    'grid', // just in case
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {},
  },
  plugins: [],
};
