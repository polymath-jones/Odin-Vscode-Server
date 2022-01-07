import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import liveReload from 'vite-plugin-live-reload'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),liveReload('**/src/**/*.vue')],
  server: {
    open: '/app.html'
  }
})
