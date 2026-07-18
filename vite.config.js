import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Production: minify + no source maps (DevTools won't show original .jsx).
 * Keep default hashed chunk names from Vite — do not over-customize.
 */
export default defineConfig({
  plugins: [react()],
  server: { port: 5174, open: true },
  build: {
    sourcemap: false,
    minify: "esbuild",
    cssMinify: true,
  },
  esbuild: {
    legalComments: "none",
  },
});
