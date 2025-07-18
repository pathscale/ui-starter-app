/// <reference types="solid-js" />

interface ImportMetaEnv {
  readonly VERSION: string;
  readonly API_URL?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
