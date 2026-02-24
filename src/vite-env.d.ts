/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY: string
  readonly VITE_FUNDING_SUPABASE_URL: string
  readonly VITE_FUNDING_SUPABASE_ANON_KEY: string
  readonly VITE_FUNDING_SUPABASE_SERVICE_ROLE_KEY: string
  readonly VITE_MAGIC_LINK_BASE_URL: string
  readonly VITE_SMTP_HOST: string
  readonly VITE_SMTP_PORT: string
  readonly VITE_SMTP_USER: string
  readonly VITE_SMTP_PASS: string
  readonly VITE_FROM_EMAIL: string
  readonly VITE_FROM_NAME: string
  readonly VITE_EMAIL_SERVER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}