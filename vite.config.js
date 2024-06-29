import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { historyApiFallback } from 'connect-history-api-fallback';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [vue(),
    {
      name: 'html-fallback',
      configureServer({ middlewares }) {
        middlewares.use(historyApiFallback());
      }
    }
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  
});
