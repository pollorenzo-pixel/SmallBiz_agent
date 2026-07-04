import type { ExecutionRequest, PermissionLevel } from '../../types'

export interface PermissionDecision{allowedLevel:PermissionLevel;status:'allowed'|'approval_required'|'blocked';explanation:string}
export function evaluatePermission(request:ExecutionRequest):PermissionDecision{
 if(request.permissionLevel>=3||request.riskLevel==='restricted')return {allowedLevel:0,status:'blocked',explanation:'Level 3 is restricted in the MVP. Payments, reconciliation, tax, destructive, irreversible, and commitment actions cannot run.'}
 if(request.permissionLevel===2||request.requiresApproval)return {allowedLevel:1,status:'approval_required',explanation:'Level 2 external execution is disabled. Safe Level 0/1 mock tools may run; a local approval preview is created for the sensitive part.'}
 return {allowedLevel:request.permissionLevel,status:'allowed',explanation:`Level ${request.permissionLevel} local mock execution allowed.`}
}
