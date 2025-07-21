import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Tailwind CSS is handled via PostCSS (see postcss.config.js), not as a Vite plugin.

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
});
