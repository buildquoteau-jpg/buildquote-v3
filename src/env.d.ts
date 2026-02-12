/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY?: string;
  readonly VITE_CONVEX_URL?: string;
  readonly VITE_ADMIN_EMAILS?: string;
  readonly VITE_GOOGLE_PLACES_API_KEY?: string;
  readonly GOOGLE_PLACES_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
