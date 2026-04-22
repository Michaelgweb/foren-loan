import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr'; // <-- এইটা অবশ্যই যোগ করতে হবে

export default defineConfig({
  plugins: [
    react(),
    svgr(), // <-- plugin register
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
