import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // The app already owns public/manifest.json; keep a single manifest.
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{html,js,css,json,ico,png,svg}'],
        navigateFallback: '/index.html',
      },
    }),
  ],
})
