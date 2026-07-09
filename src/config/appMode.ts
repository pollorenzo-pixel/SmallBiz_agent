export type AppMode = 'prototype' | 'production-preview'

const rawMode = import.meta.env.VITE_APP_MODE

export const APP_MODE: AppMode = rawMode === 'prototype' ? 'prototype' : 'production-preview'

export const appMode = {
  mode: APP_MODE,
  allowsDemoData: APP_MODE === 'prototype',
  label: APP_MODE === 'prototype' ? 'Prototype mode' : 'Production-preview mode',
  storageBoundary:
    APP_MODE === 'prototype'
      ? 'Optional demo/sample records may be seeded for local development.'
      : 'Starts from clean localStorage defaults and only shows records created in this browser.',
  integrationBoundary:
    'Real integrations require backend OAuth, server-side secrets, permission review, audit logs, and approval gates.'
}

export function demoDataUnavailableSummary(source: 'Gmail' | 'Google Calendar' | 'Founder Community') {
  return `${source} has no connected account and demo data is disabled in production-preview mode.`
}
