import type { AIGatewayRequest, AIModelRoute, BudgetGuardResult } from '../types'

export function checkAIBudget(request:AIGatewayRequest,modelRoute:AIModelRoute):BudgetGuardResult{
 const words=request.prompt.trim().split(/\s+/).filter(Boolean).length
 const estimatedTokenUsage=Math.max(160,Math.round(words*1.8)+modelRoute.id.length*20)
 if(modelRoute.estimatedCostBand==='blocked')return {estimatedTokenUsage:0,estimatedCostBand:'blocked',budgetStatus:'blocked',reason:'Blocked routes do not spend tokens or call providers.',recommendedCheaperRoute:'cheap-admin'}
 if(modelRoute.id==='coding-bounded')return {estimatedTokenUsage,estimatedCostBand:'high',budgetStatus:'warn',reason:'Coding and agent-style execution can consume budget quickly. Keep one bounded deliverable and require review before repeated or expensive runs.',recommendedCheaperRoute:'reasoning-plan'}
 if(modelRoute.id==='reasoning-plan')return {estimatedTokenUsage,estimatedCostBand:'high',budgetStatus:'warn',reason:'Planning may need a stronger future model, so the Cost Guard would warn before paid usage.',recommendedCheaperRoute:'standard-draft'}
 return {estimatedTokenUsage,estimatedCostBand:modelRoute.estimatedCostBand,budgetStatus:'pass',reason:'Mock/local run is within the placeholder task budget.'}
}
