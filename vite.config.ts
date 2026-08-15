import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative assets work at both custom domains and /repository-name/ GitHub Pages sites.
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: true,
    // The scene is lazy-loaded; this only separates large renderer dependencies further.
    rollupOptions: { output: { manualChunks: { 'three-core': ['three'], 'math-typesetting': ['katex'] } } },
    chunkSizeWarningLimit: 800,
  },
})
