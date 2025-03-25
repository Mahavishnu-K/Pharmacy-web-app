import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  server: {
    port: Number(process.env.VITE_PORT) || 5173,
    host: true
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png',  'icons/*.png', 'screenshots/*.png'],
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/in-mumbai-1\.inpharmaco\.in\/.*/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 86400,
              }
            }
          }
        ]
      }
    })
  ]
})
