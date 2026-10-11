import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dns from 'dns'

// Force Vite to respect the IP literal rather than mapping to localhost
dns.setDefaultResultOrder('verbatim') 

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    watch: {
      usePolling: true,
      interval: 100,
    },
    hmr: {
      host: '127.0.0.1',
    },
  },
})