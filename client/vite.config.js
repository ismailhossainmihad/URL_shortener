import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/*
 * Vite configuration for the React frontend.  It enables React support
 * through the plugin and sets up a proxy during development for API
 * requests.  When the frontend requests `/api/*`, Vite will forward the
 * request to the backend running on localhost:4000.  Adjust the target if
 * your backend runs on a different host or port.
 */

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4000"
    }
  }
});