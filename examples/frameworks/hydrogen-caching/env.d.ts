/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Hydrogen expects a global ExecutionContext (normally provided by
// @shopify/oxygen-workers-types). We only need `waitUntil`.
declare global {
  interface ExecutionContext {
    waitUntil(promise: Promise<unknown>): void;
  }
}

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';
