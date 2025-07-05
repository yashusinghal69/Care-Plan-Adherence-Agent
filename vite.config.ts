import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  
  define:{
    "process.env": {
      LANGFLOW_FLOW_ADHERENCE_ID: JSON.stringify(process.env.LANGFLOW_FLOW_ADHERENCE_ID),
      BASE_URL: JSON.stringify(process.env.BASE_URL),
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
