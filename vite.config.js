import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Production hardening:
 * - No source maps → DevTools cannot map bundles back to original .jsx/.js
 * - Minify + drop console/debugger
 * - Legal comments stripped
 *
 * NOTE: Browser-delivered JS/HTML can never be made truly unreadable.
 * Anyone can open Network → JS and inspect the minified bundle.
 * Do not put secrets, API keys, or proprietary logic in the frontend.
 */
export default defineConfig({
  plugins: [react()],
  server: { port: 5174, open: true },
  build: {
    sourcemap: false,
    minify: "esbuild",
    cssMinify: true,
    reportCompressedSize: false,
    // Keep chunk names opaque (hashed); avoid leaking original module paths
    rollupOptions: {
      output: {
        entryFileNames: "assets/[hash].js",
        chunkFileNames: "assets/[hash].js",
        assetFileNames: "assets/[hash][extname]",
      },
    },
  },
  esbuild: {
    drop: ["console", "debugger"],
    legalComments: "none",
  },
});
