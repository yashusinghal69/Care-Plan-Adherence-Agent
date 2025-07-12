import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { cssFirstPlugin } from "./vite-plugins/css-first";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/agents/patient-care-agent/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    cssFirstPlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  build: {
    // Ensure CSS loads before JS to prevent FOUC
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Control chunk loading order
        manualChunks: undefined,
        // Ensure proper asset loading order
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "assets/styles-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },

  define: {
    "process.env": {
      VITE_LANGFLOW_FLOW_ADHERENCE_ID: JSON.stringify(
        process.env.VITE_LANGFLOW_FLOW_ADHERENCE_ID
      ),
      VITE_BASE_URL: JSON.stringify(process.env.VITE_BASE_URL),
      VITE_LANGFLOW_REGISTRATION_ID: JSON.stringify(
        process.env.VITE_LANGFLOW_REGISTRATION_ID
      ),
      VITE_LANGFLOW_FLOW_SCHEDULER_ID: JSON.stringify(
        process.env.VITE_LANGFLOW_FLOW_SCHEDULER_ID
      ),
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
