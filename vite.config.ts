import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/agents/patient-care-agent/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),

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
