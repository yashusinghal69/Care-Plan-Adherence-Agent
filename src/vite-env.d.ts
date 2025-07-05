// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BASE_DEPLOYED_URL: string
    readonly VITE_LANGFLOW_FLOW_ADHERENCE_ID: string
    readonly VITE_LANGFLOW_REGISTRATION_ID: string
    readonly VITE_LANGFLOW_FLOW_SCHEDULER_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 