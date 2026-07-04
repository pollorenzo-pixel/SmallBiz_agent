export type RiskLevel = 'low' | 'medium' | 'high' | 'restricted'
export type PermissionLevel = 0 | 1 | 2 | 3
export type StepStatus = 'not-started' | 'running' | 'completed' | 'needs-approval' | 'blocked'

export interface Agent {
  id: string; name: string; role: string; description: string
  capabilities: string[]; boundaries: string[]; examplePrompts: string[]; defaultOutputFormat: string
}
export interface Workflow {
  id: string; name: string; description: string; assignedAgent: string; steps: string[]
  status: 'ready' | 'running' | 'complete'; lastRunAt?: string; riskLevel: RiskLevel; requiresApproval: boolean
}
export interface Approval {
  id: string; title: string; agentId: string; proposedAction: string; reason: string
  confidence: number; riskLevel: RiskLevel; status: 'pending' | 'approved' | 'rejected' | 'edited'; createdAt: string; sourceOutputId?: string
}
export interface AgentOutput {
  id: string; agentId: string; title: string; summary: string; fullOutput: string
  tags: string[]; createdAt: string; usefulnessRating: 'useful' | 'not-useful' | null
  approvalNeeded: boolean; riskNote: string; futureIntegrationNote: string
  source?: 'workflow'|'command-center'|'direct-agent'|'business-builder'|'automation-blueprint'|'self-audit'|'skill-gap'
  permissionLevel?: PermissionLevel; estimatedCostMode?: 'cheap'|'standard'|'premium'; skillStatus?: SkillStatus
}
export type SkillStatus = 'available'|'draft'|'needs_review'|'blocked'|'future_integration'
export interface SkillModule { id:string; name:string; description:string; category:string; status:SkillStatus; triggerPhrases:string[]; requiredInputs:string[]; outputFormat:string; riskLevel:RiskLevel; permissionLevel:PermissionLevel; version:string; createdAt:string; lastUpdatedAt:string }
export interface SkillGapReport { id:string; requestedCapability:string; userPrompt:string; detectedGap:string; suggestedSkillName:string; suggestedWorkflow:string; riskLevel:RiskLevel; permissionLevel:PermissionLevel; recommendedReview:string; status:SkillStatus; createdAt:string }
export interface AICostGuardrail { id:string; name:string; description:string; enabled:boolean; limitType:string; mockLimit?:string; actionWhenLimitReached:'block'|'require-approval'|'recommend-cheap'|'require-summary' }
export interface MockAgentResult { agentId:string; prompt:string; output?:AgentOutput; approvalDraft?:Approval; blockedReason?:string; recommendedWorkflowId?:string; skillGapReport?:SkillGapReport }
export interface WorkflowResult {
  workflowId: string; workflowName: string; agentId: string; reportId: string
  reportSummary: string; approvalId?: string; riskLevel: RiskLevel; createdAt: string
}
export interface Integration {
  id: string; name: string; status: 'placeholder'; description: string; authType: string
  permissions: PermissionLevel[]; riskLevel: RiskLevel
}
