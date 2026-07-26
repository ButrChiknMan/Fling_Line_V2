import { defineConfig } from 'vite'
import { resolve } from 'path';

export default defineConfig({
  base: '/Fling_Line_V2/',
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
      },
    },
  },
})