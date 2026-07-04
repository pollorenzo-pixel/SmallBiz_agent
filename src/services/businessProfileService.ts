import type { BusinessProfile } from '../types'

const PROFILE_KEY = 'smallbiz.businessProfile'

function isBusinessProfile(value: unknown): value is BusinessProfile {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const profile = value as Record<string, unknown>
  const strings = ['id','founderName','businessName','stage','industry','productOrService','targetCustomer','currentGoal','biggestChallenge','budgetLevel','preferredTone','riskComfort','createdAt','updatedAt']
  return strings.every(key => typeof profile[key] === 'string') &&
    Array.isArray(profile.desiredIntegrations) && profile.desiredIntegrations.every(item => typeof item === 'string')
}

function removeCorruptedProfile() {
  try { localStorage.removeItem(PROFILE_KEY) } catch { /* Storage may be unavailable. */ }
}

export function getBusinessProfile(): BusinessProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (isBusinessProfile(parsed)) return parsed
    removeCorruptedProfile()
  } catch { removeCorruptedProfile() }
  return null
}

export function saveBusinessProfile(profile: BusinessProfile): BusinessProfile {
  if (!isBusinessProfile(profile)) throw new Error('Business profile is invalid.')
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)) } catch { /* Keep the app usable if storage is unavailable. */ }
  return profile
}

export function updateBusinessProfile(updates: Partial<BusinessProfile>): BusinessProfile | null {
  const current = getBusinessProfile()
  if (!current) return null
  return saveBusinessProfile({...current,...updates,id:current.id,createdAt:current.createdAt,updatedAt:new Date().toISOString()})
}

export function hasCompletedOnboarding(): boolean { return getBusinessProfile() !== null }
export function clearBusinessProfile(): void { removeCorruptedProfile() }

// Future Supabase/Postgres adapter: replace this module behind the same API.
// It must use authenticated server access, Row Level Security, and audited controls.
