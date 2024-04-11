import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'es2021',
    rollupOptions: {
      input: {
        order: 'src/apps/order/main.ts',
      },
      output: {
        format: 'iife',
        entryFileNames: '[name].js', // 使用[name]來動態命名輸出檔案
        inlineDynamicImports: false, // 修改這個選項為 false
      },
    }
  }
})
