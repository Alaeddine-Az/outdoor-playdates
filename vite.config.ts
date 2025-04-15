
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // 👇 This enables history fallback in dev
    fs: {
      allow: ['.'],
    },
    middlewareMode: false, // Just ensures regular server, not SSR
    watch: {
      usePolling: true,
    },
    // 👇 Add this to ensure fallback to index.html on unknown routes
    historyApiFallback: true,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Make sure environment variables are explicitly defined
  define: {
    // Expose VITE_ prefixed env variables to the client
    'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.VITE_GOOGLE_MAPS_API_KEY),
  },
}));
