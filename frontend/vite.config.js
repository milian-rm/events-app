import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5149',
        changeOrigin: true,
      },
      '/eventsService': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/eventSystem': {
        target: 'http://localhost:3101',
        changeOrigin: true,
      },
    },
  },
})