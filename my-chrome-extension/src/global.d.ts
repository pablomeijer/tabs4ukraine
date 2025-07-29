/// <reference types="vite/client" />

declare const __APP_VERSION__: string

// Chrome Extension API types
declare namespace chrome {
  namespace storage {
    namespace sync {
      function get(keys: string[], callback: (result: any) => void): void;
      function set(items: any, callback?: () => void): void;
    }
  }
}
