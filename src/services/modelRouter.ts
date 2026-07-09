import type { AIModelRoute, AIGatewayRequest, PermissionLevel } from '../types'

const restrictedPattern = /\b(payment|pay supplier|tax submission|submit tax|bank reconciliation|reconcile bank|delete production|production data|sign contract|legal commitment|financial commitment|irreversible)\b/i
const codingPattern = /\b(code|coding|github|codex|openhands|repository|pull request|typescript|react|bug|implement|deploy)\b/i
const reasoningPattern = /\b(research plan|business plan|strategy|complex|workflow plan|automation blueprint|roadmap|funding)\b/i
const draftPattern = /\b(reply|draft|marketing|email|post|message|follow-up|response)\b/i

function route(id:AIModelRoute['id'],reason:string,permissionLevel:PermissionLevel):AIModelRoute{
 const base:Record<AIModelRoute['id'],Omit<AIModelRoute,'id'|'reason'|'defaultPermissionLevel'>>={
  'cheap-admin':{displayName:'Cheap admin route',intendedModelTier:'small/local admin model',estimatedCostBand:'low'},
  'standard-draft':{displayName:'Standard draft route',intendedModelTier:'balanced drafting model',estimatedCostBand:'medium'},
  'reasoning-plan':{displayName:'Reasoning plan route',intendedModelTier:'strong planning model',estimatedCostBand:'high'},
  'coding-bounded':{displayName:'Bounded coding route',intendedModelTier:'coding-capable model with strict scope',estimatedCostBand:'high'},
  'restricted-blocked':{displayName:'Restricted blocked route',intendedModelTier:'none',estimatedCostBand:'blocked'}
 }
 return {id,reason,defaultPermissionLevel:permissionLevel,...base[id]}
}

export function routeAIModelTask(request:AIGatewayRequest):AIModelRoute{
 const text=`${request.taskType} ${request.title||''} ${request.prompt}`
 if(restrictedPattern.test(text))return route('restricted-blocked','The task appears to involve payment, tax, banking, deletion, or irreversible legal/financial commitment, so Level 3 remains blocked.',3)
 if(codingPattern.test(text))return route('coding-bounded','Coding work is limited to one bounded deliverable, a starter foundation, roadmap, and follow-up suggestions. No external coding agent is run.',2)
 if(reasoningPattern.test(text))return route('reasoning-plan','The task needs multi-step planning or business reasoning before a founder decision.',1)
 if(draftPattern.test(text))return route('standard-draft','The task prepares a founder-reviewable draft and may require approval before future sending or publishing.',1)
 return route('cheap-admin','The task is routine summarising, organising, or meeting/admin preparation.',0)
}
