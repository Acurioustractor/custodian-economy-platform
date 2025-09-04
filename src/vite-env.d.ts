/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMPATHY_LEDGER_API_URL?: string
  readonly VITE_EMPATHY_LEDGER_API_KEY?: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}