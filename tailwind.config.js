/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx,js,jsx}', // Scans all files in src for Tailwind classes
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px', // Ensures md breakpoint exists for md:hidden and md:block
      lg: '1024px',
      xl: '1280px',
    },
    extend: {}, // Add custom theme extensions if needed
  },
  plugins: [], // Add Tailwind plugins if needed
};