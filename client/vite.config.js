import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // REST API calls from the client (e.g. fetch('/api/...')) get forwarded
      // to the Express server during local dev.
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      // Socket.io handshake/websocket traffic.
      '/socket.io': {
        target: 'http://localhost:4000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
