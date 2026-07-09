/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_MODE?: 'prototype' | 'production-preview'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
