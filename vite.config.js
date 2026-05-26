import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (id.includes("leaflet") || id.includes("react-leaflet")) {
            return "maps";
          }

          if (id.includes("react-router-dom")) {
            return "router";
          }

          if (id.includes("@tanstack/react-query") || id.includes("axios") || id.includes("zustand")) {
            return "data";
          }

          if (
            id.includes("react-toastify") ||
            id.includes("react-hook-form") ||
            id.includes("@hookform/resolvers") ||
            id.includes("zod")
          ) {
            return "forms-ui";
          }

          if (id.includes("react") || id.includes("react-dom")) {
            return "react-vendor";
          }

          return "vendor";
        }
      }
    }
  },
  server: {
    port: 5173
  }
});
