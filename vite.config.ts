import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/vue.ts',
      formats: ['es'],
      fileName: () => 'vue.js'
    },
    rollupOptions: {
      external: ['vue', '@mojojs/core', '@mojojs/path']
    }
  }
});
