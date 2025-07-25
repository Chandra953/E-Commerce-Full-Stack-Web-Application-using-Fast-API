import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// Since we're using postcss.config.cjs, we don't need to specify PostCSS config here
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  }
})
