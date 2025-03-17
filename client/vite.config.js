import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: Number(process.env.VITE_PORT) || 5173,
    host: true
  },
  plugins: [react()],
})
