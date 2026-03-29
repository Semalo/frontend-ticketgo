import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // aceita conexões externas
    allowedHosts: [
      'ticketgo.semalo.com.br'
    ]
  },
  preview: {
    host: true,
    allowedHosts: [
      'ticketgo.semalo.com.br'
    ]
  }
})