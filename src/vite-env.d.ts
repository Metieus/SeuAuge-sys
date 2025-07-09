/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_API_URL?: string;
  readonly VITE_PAYMENT_URL?: string;
  readonly VITE_ADMIN_EMAIL?: string;
  readonly VITE_BYPASS_PLAN_GUARD?: string;
  readonly VITE_STORE_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
