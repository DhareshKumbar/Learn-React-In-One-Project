import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/proxy-image": {
        target: "https://image.tmdb.org",
        changeOrigin: true,
        rewrite: (path) => {
          // Extract the original image path from the URL parameters
          const url = new URL("http://example.com" + path);
          const imagePath = url.searchParams.get("path");
          return imagePath || path;
        },
      },
    },
  },
});
