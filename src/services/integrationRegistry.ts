import { integrations } from '../data/integrations'
export function listIntegrations() { return integrations }
export function invokeIntegration(): never { throw new Error('External integrations are disabled in this MVP.') }
