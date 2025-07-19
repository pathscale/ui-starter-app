/// <reference types="solid-js" />

// biome-ignore lint/correctness/noUnusedVariables: used globally by TypeScript
interface ImportMetaEnv {
  readonly VERSION: string;
  readonly API_URL?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

// biome-ignore lint/correctness/noUnusedVariables: used globally by TypeScript
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.svg" {
  const content: string;
  export default content;
}
