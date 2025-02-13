import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/socket.io": {
        target: "http://localhost:3000", // Прокси для WebSocket
        changeOrigin: true, // Необходимо для CORS
        ws: true, // Включаем поддержку WebSocket
      },
    },
  },
});
