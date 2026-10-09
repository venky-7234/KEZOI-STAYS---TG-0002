import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/TG-0001/',
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
