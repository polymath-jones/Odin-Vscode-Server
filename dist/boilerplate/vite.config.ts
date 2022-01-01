import vue from "@vitejs/plugin-vue";
import { join } from "path";
import liveReload from "vite-plugin-live-reload";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), liveReload("**/*.vue", { alwaysReload: true })],
  resolve: {
    alias: {
      "@": join(__dirname, "src"),
    },
  },
  server: {
    open: "/app.html",
  },
});
