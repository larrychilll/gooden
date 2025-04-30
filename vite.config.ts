import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss'; // Use ESM import
import autoprefixer from 'autoprefixer'; // Use ESM import

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss, // Reference the imported module
        autoprefixer,
      ],
    },
  },
});