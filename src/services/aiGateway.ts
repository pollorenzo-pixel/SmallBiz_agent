import type { AIGatewayRequest, AIGatewayResult, AIProviderConfig, PermissionLevel } from '../types'
import { routeAIModelTask } from './modelRouter'
import { checkAIBudget } from './budgetGuard'

export const defaultAIProviderConfig:AIProviderConfig={
 mode:'mock',
 providerName:'Mock Local Provider',
 apiBaseUrlPlaceholder:'https://api.openai-compatible.example/v1',
 apiKeyPlaceholder:'sk-... never store real keys in the frontend',
 isActive:false,
 notes:'Architecture only. Real OpenAI-compatible keys must be supplied later through backend environment variables and never exposed in client bundles or localStorage.'
}

function permissionFor(routeLevel:PermissionLevel,requested?:PermissionLevel):PermissionLevel{
 return Math.max(routeLevel,requested??0) as PermissionLevel
}

export function runAIGatewayTask(request:AIGatewayRequest):AIGatewayResult{
 const provider=request.providerConfig||defaultAIProviderConfig
 const modelRoute=routeAIModelTask(request)
 const budgetGuard=checkAIBudget(request,modelRoute)
 const permissionLevel=permissionFor(modelRoute.defaultPermissionLevel,request.requestedPermissionLevel)
 const requiresApproval=permissionLevel===2||request.requiresApproval===true||budgetGuard.budgetStatus==='warn'
 const blocked=permissionLevel>=3||modelRoute.id==='restricted-blocked'||budgetGuard.budgetStatus==='blocked'
 const title=request.title||'Local operator task'
 const output=blocked
  ? `Blocked in MVP: ${modelRoute.reason}\n\nNo external action has been taken.`
  : `Prepared only: ${title}\n\nMock response prepared for ${request.agentId||'the selected agent'}.\n\nNo external action has been taken.`
 return {id:crypto.randomUUID(),requestId:request.id,providerMode:provider.mode,providerName:provider.providerName,output,structuredOutput:{title,summary:output,steps:['Classify task','Route model','Check budget','Prepare local output','Hold for approval if needed']},modelRoute,budgetGuard,permission:{level:blocked?3:permissionLevel,label:`Level ${blocked?3:permissionLevel}`,reason:blocked?'Level 3 is blocked in the MVP.':'Founder remains in control before any future external action.'},approval:{requiresApproval:blocked?false:requiresApproval,status:blocked?'blocked':requiresApproval?'required':'not-required',reason:blocked?'Blocked in MVP':requiresApproval?'Approval required before future execution.':'Prepared only; no approval needed.'},createdAt:new Date().toISOString()}
}
