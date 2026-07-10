import { loadLocal, saveLocal } from './storage'

export type FounderSignalStatus = 'active' | 'viewed' | 'snoozed' | 'resolved' | 'dismissed'
export interface FounderSignalState { signalKey:string; status:FounderSignalStatus; firstSeenAt:string; lastSeenAt:string; viewedAt?:string; snoozedUntil?:string; resolvedAt?:string; dismissedAt?:string; relatedEntityType:string; relatedEntityId:string }

export const SIGNAL_STATES_KEY='founderIntelligence.signalStates.v1'
export const LEGACY_DISMISSED_KEY='founderIntelligence.dismissedSignals'
export const RECENT_CHANGE_WINDOW_MS=72*60*60*1000
export const RECENT_WORKFLOW_SUPPRESSION_MS=12*60*60*1000

const isStatus=(v:unknown):v is FounderSignalStatus=>['active','viewed','snoozed','resolved','dismissed'].includes(String(v))
const isState=(v:unknown):v is FounderSignalState=>typeof v==='object'&&v!==null&&!Array.isArray(v)&&typeof (v as FounderSignalState).signalKey==='string'&&isStatus((v as FounderSignalState).status)&&typeof (v as FounderSignalState).firstSeenAt==='string'&&typeof (v as FounderSignalState).lastSeenAt==='string'&&typeof (v as FounderSignalState).relatedEntityType==='string'&&typeof (v as FounderSignalState).relatedEntityId==='string'
export const isFounderSignalStateArray=(v:unknown):v is FounderSignalState[]=>Array.isArray(v)&&v.every(isState)
const legacyKeys=()=>loadLocal(LEGACY_DISMISSED_KEY,[],(v):v is string[]=>Array.isArray(v)&&v.every(x=>typeof x==='string'))

export function loadFounderSignalStates():FounderSignalState[]{
 const states=loadLocal(SIGNAL_STATES_KEY,[],isFounderSignalStateArray)
 const existing=new Set(states.map(s=>s.signalKey)); const now=new Date().toISOString()
 const migrated=legacyKeys().filter(key=>!existing.has(key)).map(key=>({signalKey:key,status:'dismissed' as const,firstSeenAt:now,lastSeenAt:now,dismissedAt:now,relatedEntityType:key.split(':')[0]||'legacy',relatedEntityId:key.split(':')[1]||key}))
 return [...states,...migrated].slice(-300)
}
export function saveFounderSignalStates(states:FounderSignalState[]):boolean{return saveLocal(SIGNAL_STATES_KEY,states.slice(-300))}
export const getFounderSignalState=(states:FounderSignalState[],key:string)=>states.find(s=>s.signalKey===key)
export function updateFounderSignalState(states:FounderSignalState[], patch:Omit<Partial<FounderSignalState>,'signalKey'> & Pick<FounderSignalState,'signalKey'|'relatedEntityType'|'relatedEntityId'>):FounderSignalState[]{
 const now=new Date().toISOString(); const current=getFounderSignalState(states,patch.signalKey)
 const next:FounderSignalState={...current,firstSeenAt:current?.firstSeenAt||now,lastSeenAt:now,status:'active',...patch}
 return [next,...states.filter(s=>s.signalKey!==patch.signalKey)].slice(0,300)
}
export function markFounderSignalViewed(states:FounderSignalState[], signalKey:string, relatedEntityType:string, relatedEntityId:string):FounderSignalState[]{const now=new Date().toISOString();return updateFounderSignalState(states,{signalKey,relatedEntityType,relatedEntityId,status:'viewed',viewedAt:now})}
export function snoozeFounderSignal(states:FounderSignalState[], signalKey:string, relatedEntityType:string, relatedEntityId:string, snoozedUntil:string):FounderSignalState[]{return updateFounderSignalState(states,{signalKey,relatedEntityType,relatedEntityId,status:'snoozed',snoozedUntil})}
export function dismissFounderSignal(states:FounderSignalState[], signalKey:string, relatedEntityType:string, relatedEntityId:string):FounderSignalState[]{const now=new Date().toISOString();return updateFounderSignalState(states,{signalKey,relatedEntityType,relatedEntityId,status:'dismissed',dismissedAt:now})}
export function resolveFounderSignal(states:FounderSignalState[], signalKey:string, relatedEntityType:string, relatedEntityId:string):FounderSignalState[]{const now=new Date().toISOString();return updateFounderSignalState(states,{signalKey,relatedEntityType,relatedEntityId,status:'resolved',resolvedAt:now})}
export function snoozeUntil(option:'later_today'|'tomorrow'|'next_week',now=new Date()):string{const d=new Date(now); if(option==='later_today')d.setHours(d.getHours()+4); else if(option==='tomorrow')d.setDate(d.getDate()+1); else d.setDate(d.getDate()+7); return d.toISOString()}
