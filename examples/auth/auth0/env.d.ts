/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly PUBLIC_AUTH0_DOMAIN: string;
    readonly PUBLIC_AUTH0_CLIENT_ID: string;
    readonly PUBLIC_AUTH0_AUDIENCE: string;    
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }