import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@supabase')) return 'vendor-supabase'
          if (id.includes('i18next') || id.includes('react-i18next')) return 'vendor-i18n'
          if (id.includes('@tanstack')) return 'vendor-query'
          if (id.includes('zustand')) return 'vendor-state'
          if (id.includes('node_modules/react')) return 'vendor-react'
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
  server: { port: 3000 },
})
