import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Reduce memory by disabling sourcemaps in production
    sourcemap: false,
    // Split chunks to reduce memory pressure during bundling
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          chakra: [
            "@chakra-ui/react",
            "@emotion/react",
            "@emotion/styled",
            "framer-motion",
          ],
          charts: ["echarts", "echarts-for-react"],
          pdf: ["pdfjs-dist", "@react-pdf-viewer/core"],
        },
      },
    },
    // Increase chunk warning limit
    chunkSizeWarningLimit: 1000,
  },
});
