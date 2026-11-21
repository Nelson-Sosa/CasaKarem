import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Timestamp para forzar cache-busting en cada deploy
const buildTime = Date.now();

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
  build: {
    // Agrega el timestamp al nombre del entry point para que index.html
    // siempre apunte a un nombre único e invalide cualquier caché anterior.
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash]-${buildTime}.js`,
        chunkFileNames: `assets/[name]-[hash]-${buildTime}.js`,
        assetFileNames: `assets/[name]-[hash][extname]`,
        manualChunks(id) {
          // ═══════════════════════════════════════════════════════════
          // OPTIMIZACIÓN CRÍTICA: Separación Granular de Firebase
          // ═══════════════════════════════════════════════════════════
          // Firebase monolítico = 201 KB gzip → separar módulos:
          
          // 1. Firebase Core (siempre necesario) - ~15 KB
          if (id.includes('@firebase/app')) {
            return 'firebase-core';
          }
          
          // 2. Firestore (necesario en catálogo público) - ~120 KB
          if (id.includes('@firebase/firestore')) {
            return 'firebase-firestore';
          }
          
          // 3. Auth (SOLO /login, /register, /admin) - ~50 KB
          if (id.includes('@firebase/auth')) {
            return 'firebase-auth';
          }
          
          // 4. Storage (SOLO panel admin para uploads) - ~20 KB
          if (id.includes('@firebase/storage')) {
            return 'firebase-storage';
          }
          
          // 5. Analytics (opcional, bajo uso) - ~10 KB
          if (id.includes('@firebase/analytics')) {
            return 'firebase-analytics';
          }
          
          // ═══════════════════════════════════════════════════════════
          // Separación de Vendors Pesados
          // ═══════════════════════════════════════════════════════════
          
          // React Core (vendor principal)
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor';
          }
          
          // React Router (necesario en todas las rutas)
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          
          // Lucide Icons (íconos UI) - separar para lazy-load
          if (id.includes('node_modules/lucide-react')) {
            return 'ui';
          }
          
          // Formularios (react-hook-form + zod) - SOLO admin
          if (id.includes('node_modules/react-hook-form') || 
              id.includes('node_modules/@hookform') || 
              id.includes('node_modules/zod')) {
            return 'forms';
          }
          
          // Framer Motion (animaciones)
          if (id.includes('node_modules/framer-motion') || 
              id.includes('node_modules/motion')) {
            return 'motion';
          }
        },
      },
    },
  },
})
