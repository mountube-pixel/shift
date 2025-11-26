
import path from 'path';

export default {
  // Impostiamo la root dentro src se preferisci lavorare lì, 
  // ma solitamente Vite si aspetta index.html nella root del progetto.
  // Per semplicità standard Vite + F7:
  root: './', 
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true, // Espone l'IP per testare da cellulare nella stessa rete
  }
};