import { defineConfig } from 'vite'
import { resolve } from 'path';

export default defineConfig({
  base: '/my-new-project/',
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
      },
    },
  },
})