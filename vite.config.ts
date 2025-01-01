import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import polyfillNode from 'rollup-plugin-polyfill-node';

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': '/src' // Egyszerű alias beállítás
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        'process.env': '{}', // Üres process.env
        global: 'window',   // Node.js global változó helyettesítése
      },
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        polyfillNode(), // Polyfill a Node.js modulokra
      ],
    },
    commonjsOptions: {
      transformMixedEsModules: true, // Mixed ES/CJS modulok támogatása
    },
  },
  server: {
    fs: {
      allow: ['.'] // Fájl elérésének engedélyezése
    }
  }
});
