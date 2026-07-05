import type { BusinessProfile, FounderProfile } from '../types'

const KEY='smallbiz.founderProfile'
function valid(value:unknown):value is FounderProfile {
 if(!value||typeof value!=='object'||Array.isArray(value))return false
 const item=value as Record<string,unknown>
 return ['id','name','companyName','businessStage','preferredTone','riskPreference','createdAt','updatedAt'].every(key=>typeof item[key]==='string')&&
  Array.isArray(item.mainProjects)&&item.mainProjects.every(v=>typeof v==='string')&&Array.isArray(item.currentPriorities)&&item.currentPriorities.every(v=>typeof v==='string')&&
  [0,1,2,3].includes(item.defaultPermissionLevel as number)&&typeof item.businessType==='string'&&
  Array.isArray(item.goals)&&item.goals.every(v=>typeof v==='string')&&Array.isArray(item.projects)&&item.projects.every(v=>typeof v==='string')&&
  typeof item.helpLevel==='string'&&typeof item.onboardingCompleted==='boolean'
}
function remove(){try{localStorage.removeItem(KEY)}catch{/* unavailable storage */}}
function migrate(value:unknown):FounderProfile|null{
 if(!value||typeof value!=='object'||Array.isArray(value))return null
 const old=value as Partial<FounderProfile>
 if(typeof old.id!=='string'||typeof old.name!=='string'||typeof old.companyName!=='string'||!Array.isArray(old.mainProjects)||!Array.isArray(old.currentPriorities))return null
 return {...old,businessType:typeof old.businessType==='string'?old.businessType:'Small business',goals:Array.isArray(old.goals)?old.goals:old.currentPriorities,
  projects:Array.isArray(old.projects)?old.projects:old.mainProjects,helpLevel:typeof old.helpLevel==='string'?old.helpLevel:'Just suggestions',onboardingCompleted:old.onboardingCompleted===true} as FounderProfile
}
export function getFounderProfile():FounderProfile|null{try{const raw=localStorage.getItem(KEY);if(!raw)return null;const parsed:unknown=JSON.parse(raw);if(valid(parsed))return parsed;const migrated=migrate(parsed);if(migrated&&valid(migrated)){saveFounderProfile(migrated);return migrated}remove()}catch{remove()}return null}
export function saveFounderProfile(profile:FounderProfile):FounderProfile{if(!valid(profile))throw new Error('Founder profile is invalid.');try{localStorage.setItem(KEY,JSON.stringify(profile))}catch{/* keep local app usable */}return profile}
export function updateFounderProfile(profile:FounderProfile):FounderProfile{return saveFounderProfile({...profile,updatedAt:new Date().toISOString()})}
export function createFounderProfile(business:BusinessProfile):FounderProfile{const now=new Date().toISOString();return saveFounderProfile({id:crypto.randomUUID(),name:business.founderName,companyName:business.businessName,mainProjects:[business.businessName],businessStage:business.stage,currentPriorities:[business.currentGoal],preferredTone:business.preferredTone,riskPreference:business.riskComfort,defaultPermissionLevel:1,businessType:business.industry,goals:[business.currentGoal],projects:[business.businessName],helpLevel:'Just suggestions',onboardingCompleted:true,createdAt:now,updatedAt:now})}
export function getOrCreateFounderProfile(business:BusinessProfile|null):FounderProfile|null{return getFounderProfile()||(business?createFounderProfile(business):null)}
export function syncFounderFromBusiness(founder:FounderProfile,business:BusinessProfile):FounderProfile{return updateFounderProfile({...founder,name:business.founderName,companyName:business.businessName,businessStage:business.stage,preferredTone:business.preferredTone,riskPreference:business.riskComfort})}
export function clearFounderProfile(){remove()}

// Future Supabase migration keeps this interface and adds auth, RLS, validation, and audit history.
