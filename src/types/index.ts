export type RiskLevel = 'low' | 'medium' | 'high' | 'restricted'
export type PermissionLevel = 0 | 1 | 2 | 3
export type StepStatus = 'not-started' | 'running' | 'completed' | 'needs-approval' | 'blocked'

export interface BusinessProfile {
  id: string; founderName: string; businessName: string; stage: string; industry: string
  productOrService: string; targetCustomer: string; currentGoal: string; biggestChallenge: string
  budgetLevel: string; preferredTone: string; riskComfort: string; desiredIntegrations: string[]
  createdAt: string; updatedAt: string
}
export type BusinessContextUsed = Pick<BusinessProfile,'businessName'|'stage'|'industry'|'currentGoal'|'budgetLevel'>
export interface FounderProfile {
  id:string; name:string; companyName:string; mainProjects:string[]; businessStage:string
  currentPriorities:string[]; preferredTone:string; riskPreference:string
  defaultPermissionLevel:PermissionLevel; createdAt:string; updatedAt:string
  businessType:string; goals:string[]; projects:string[]; helpLevel:string; onboardingCompleted:boolean
}

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
  confidence: number; riskLevel: RiskLevel; status: 'pending' | 'approved' | 'rejected' | 'edited' | 'blocked'; createdAt: string; sourceOutputId?: string
  permissionLevel?: PermissionLevel; payloadPreview?: string; editedAction?: string; rejectionReason?: string; decidedAt?: string
  updatedAt?:string; approvedAt?:string; rejectedAt?:string
  projectId?:string
}
export interface AgentOutput {
  id: string; agentId: string; title: string; summary: string; fullOutput: string
  tags: string[]; createdAt: string; usefulnessRating: 'useful' | 'not-useful' | null
  approvalNeeded: boolean; riskNote: string; futureIntegrationNote: string
  source?: 'workflow'|'command-center'|'direct-agent'|'business-builder'|'automation-blueprint'|'self-audit'|'skill-gap'|'project-workspace'
  permissionLevel?: PermissionLevel; estimatedCostMode?: 'cheap'|'standard'|'premium'; skillStatus?: SkillStatus
  contextUsed?: BusinessContextUsed
  workflowId?:string; plainEnglishSummary?:string; keyFindings?:string[]; recommendedNextSteps?:string[]
  copyableText?:string; approvalSummary?:string
  projectId?:string; sourceProjectTitle?:string; projectActionType?:string
  execution?: { executionResultId:string; providerId:string; providerName:string; simulatedTools:string[]; permissionDecision:string; approvalStatus:string }
}
export interface AIProvider { id:string; name:string; type:string; status:'active'|'disabled'|'placeholder'; description:string; capabilities:string[]; authType:string; supportsStreaming:boolean; supportsTools:boolean; riskLevel:RiskLevel; isMock:boolean; enabled:boolean }
export interface ToolDefinition { id:string; name:string; description:string; category:string; permissionLevel:PermissionLevel; riskLevel:RiskLevel; requiresApproval:boolean; inputSchemaDescription:string; outputSchemaDescription:string; enabled:boolean; isMock:boolean; futureIntegration:string }
export interface ExecutionRequest { id:string; source:string; agentId:string; workflowId?:string; providerId:string; toolIds:string[]; userPrompt:string; context:Record<string,unknown>; permissionLevel:PermissionLevel; riskLevel:RiskLevel; requiresApproval:boolean; createdAt:string }
export interface ExecutionResult { id:string; requestId:string; providerId:string; agentId:string; workflowId?:string; status:'completed'|'approval_required'|'blocked'|'failed'; summary:string; structuredOutput:Record<string,unknown>; toolResults:Array<Record<string,unknown>>; approvalId?:string; reportId?:string; warnings:string[]; createdAt:string }
export interface ToolExecutionLog { id:string; toolId:string; requestId:string; status:'completed'|'approval_required'|'blocked'|'disabled'|'failed'; mockInput:Record<string,unknown>; mockOutput:Record<string,unknown>; riskLevel:RiskLevel; permissionLevel:PermissionLevel; createdAt:string }
export type SkillStatus = 'available'|'draft'|'needs_review'|'blocked'|'future_integration'
export interface SkillModule { id:string; name:string; description:string; category:string; status:SkillStatus; triggerPhrases:string[]; requiredInputs:string[]; outputFormat:string; riskLevel:RiskLevel; permissionLevel:PermissionLevel; version:string; createdAt:string; lastUpdatedAt:string }
export interface SkillGapReport { id:string; requestedCapability:string; userPrompt:string; detectedGap:string; suggestedSkillName:string; suggestedWorkflow:string; riskLevel:RiskLevel; permissionLevel:PermissionLevel; recommendedReview:string; status:SkillStatus; createdAt:string }
export interface AICostGuardrail { id:string; name:string; description:string; enabled:boolean; limitType:string; mockLimit?:string; actionWhenLimitReached:'block'|'require-approval'|'recommend-cheap'|'require-summary' }
export interface MockAgentResult { agentId:string; prompt:string; output?:AgentOutput; approvalDraft?:Approval; blockedReason?:string; recommendedWorkflowId?:string; skillGapReport?:SkillGapReport }
export interface WorkflowResult {
  workflowId: string; workflowName: string; agentId: string; reportId: string
  reportSummary: string; approvalId?: string; riskLevel: RiskLevel; createdAt: string
  providerName?:string; simulatedTools?:string[]; permissionDecision?:string; executionResultId?:string
  plainEnglishSummary?:string; keyFindings?:string[]; recommendedNextSteps?:string[]; copyableText?:string; approvalSummary?:string
}
export interface CommandRouteSuggestion {
  id:string; originalCommand:string; recommendedAgentId:string; recommendedWorkflowId:string
  confidence:'low'|'medium'|'high'; reason:string; interpretedNeed:string; safetyNote:string
  suggestedNextStep:string; alternativeWorkflowIds:string[]
}
export interface CommandHistoryItem {
  id:string; command:string; recommendedAgentId:string; recommendedWorkflowId:string; createdAt:string
}

export type ProjectType = 'Business idea'|'Website'|'App'|'Launch plan'|'Marketing campaign'|'Finance/admin'|'Research'|'Other'
export type ProjectStage = 'Idea'|'Planning'|'Building'|'Reviewing'|'Launching'|'Active'|'Paused'
export type ProjectStatus = 'Draft'|'In progress'|'Needs review'|'Waiting for approval'|'Complete'|'Paused'
export type ProjectPriority = 'Low'|'Medium'|'High'
export interface ProjectNote { id:string; text:string; createdAt:string }
export interface ProjectNextAction { id:string; text:string; done:boolean; createdAt:string; completedAt?:string }
export interface ProjectWorkspaceProject {
  id:string; name:string; type:ProjectType; description:string; status:ProjectStatus; stage:ProjectStage; priority:ProjectPriority
  ownerGoal:string; createdAt:string; updatedAt:string; linkedOutputIds:string[]; linkedApprovalIds:string[]; notes:ProjectNote[]; nextActions:ProjectNextAction[]; lastAiHelpAt?:string
}
export type ProjectHelpActionType='next-steps'|'product-tasks'|'marketing-draft'|'coding-prompt'|'research'|'finance-review'
export interface ProjectHelpBundle { output:AgentOutput; approval?:Approval }
export type ProjectMilestoneStatus='planned'|'active'|'completed'
export interface ProjectMilestone { id:string; projectId:string; title:string; description:string; status:ProjectMilestoneStatus; createdAt:string; updatedAt:string; completedAt?:string }
export type ProjectActionStatus='todo'|'doing'|'blocked'|'done'
export interface ProjectActionItem { id:string; projectId:string; milestoneId?:string; sourceOutputId?:string; sourceApprovalId?:string; title:string; description:string; status:ProjectActionStatus; priority:'low'|'medium'|'high'; createdAt:string; updatedAt:string; completedAt?:string }
export interface DailyFocusSummary { projectId?:string; projectName?:string; topPriorities:ProjectActionItem[]; stuckItems:ProjectActionItem[]; nextMilestone?:ProjectMilestone; pendingApprovals:Approval[]; latestReport?:AgentOutput; suggestedAction:string; suggestedAgentId:string; focusMessage:string }
export interface EndOfDayReviewInput { projectId?:string; doneToday:string; stillBlocked:string; moveToTomorrow:string; noteForAi:string }

export interface Integration {
  id: string; name: string; status: 'placeholder'; description: string; authType: string
  permissions: PermissionLevel[]; riskLevel: RiskLevel
}
