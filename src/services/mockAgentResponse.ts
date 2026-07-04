import { agents } from '../data/agents'
import type { AgentOutput, Approval, BusinessProfile, MockAgentResult, PermissionLevel, RiskLevel, SkillGapReport } from '../types'

interface Route { agentId:string; workflowId?:string; source:AgentOutput['source']; category:string }

const restrictedPattern = /\b(make|send|take|process)?\s*(payment|bank reconciliation|reconcile bank|tax submission|delete production|sign contract|auto-?merge|auto-?deploy|deploy to production|spend real tokens|install.*without review)\b/i
const level2Pattern = /\b(send (an )?email|publish|post (this|it)|create (a )?github issue|trigger (the )?(api|workflow|automation)|submit (the |a )?(application|form)|update (the )?(database|platform-wide skill)|run (codex|openhands))\b/i

export function routePrompt(prompt:string, preferredAgentId?:string):Route {
  const value=prompt.toLowerCase()
  if(preferredAgentId)return {agentId:preferredAgentId,source:'direct-agent',category:preferredAgentId}
  if(/teach yourself|learn how|add a skill|update yourself|new skill/.test(value))return {agentId:'self-improvement',source:'skill-gap',category:'skill-gap'}
  if(/audit (the app|smallbiz)|self.audit|improve smallbiz/.test(value))return {agentId:'self-improvement',workflowId:'self-audit',source:'self-audit',category:'self-audit'}
  if(/automat|process map|lead follow|invoice chasing/.test(value))return {agentId:'automation',workflowId:'automation',source:'automation-blueprint',category:'automation'}
  if(/fund|no money|no capital|grant|loan|investor/.test(value))return {agentId:'business-builder',workflowId:'funding',source:'business-builder',category:'funding'}
  if(/business plan|one.page|financial forecast|start building|business idea|launch plan|roadmap/.test(value))return {agentId:'business-builder',workflowId:'business-plan',source:'business-builder',category:'business-plan'}
  if(/market|competitor|research/.test(value))return {agentId:'research',workflowId:'research',source:'command-center',category:'research'}
  if(/ad|copy|marketing|campaign/.test(value))return {agentId:'marketing',workflowId:'marketing',source:'command-center',category:'marketing'}
  if(/code|coding|github|implementation/.test(value))return {agentId:'engineering',workflowId:'github',source:'command-center',category:'engineering'}
  if(/invoice|finance|admin|account/.test(value))return {agentId:'finance',workflowId:'invoice',source:'command-center',category:'finance'}
  if(/customer|community|reply/.test(value))return {agentId:'customer',source:'command-center',category:'customer'}
  if(/feedback|product/.test(value))return {agentId:'product',workflowId:'vexis',source:'command-center',category:'product'}
  return {agentId:'founder',workflowId:'daily',source:'command-center',category:'founder-ops'}
}

const sections:Record<string,string[]> = {
  'business-plan':['BUSINESS IDEA SUMMARY\nA focused service business that solves one painful, frequent problem for a narrow customer group.','TARGET CUSTOMER\nTime-poor micro-business owners seeking practical help rather than another dashboard.','BUSINESS MODEL\nProductised setup service (£350 assumption) plus optional monthly support (£95 assumption).','GO-TO-MARKET\nFive interviews → two paid pilots → referral loop → evidence-led landing page.','FUNDING STRATEGY\nBootstrap with services and pre-sales; defer custom software and paid automation. No funding is guaranteed.','30-DAY PLAN\nWeek 1 validate · Week 2 package · Week 3 pre-sell · Week 4 deliver and review.','FORECAST PLACEHOLDER\nMonth 1: £0 revenue / £120 cost\nMonth 3: £700 / £180\nMonth 6: £1,750 / £350\nMonth 12: £4,000 / £850','RISKS & ASSUMPTIONS\nDemand and pricing are unvalidated. This is not financial, legal, tax, or accounting advice.'],
  funding:['FUNDING NEED SUMMARY\nIllustrative 30-day validation budget: £500.','LEAN VERSION\nSell and deliver manually before buying tools.','MUST-HAVE COSTS\nDomain, essential software, customer discovery, small contingency.','COSTS TO DELAY\nCustom brand, office, broad ads, bespoke platform, paid automation.','BOOTSTRAPPING & PRE-SALES\nPaid pilots, founding-customer offer, workshops, service revenue, partnerships.','FUNDING ROUTES\nGrant, responsible loan, community finance, or investor placeholders—verify eligibility independently.','NEXT STEPS\nDefine the offer, contact ten prospects, seek two paid commitments. Not financial advice.'],
  automation:['PROCESS SUMMARY\nMap the repeated work before selecting tools.','CURRENT MANUAL STEPS\nReceive → classify → collect context → draft → review → act → log.','AUTOMATION BLUEPRINT\nTrigger: new item. Actions: classify, enrich, draft, risk-check, queue.','APPROVAL POINTS\nHuman approval before every future external send, update, or workflow trigger.','TOOLS PLACEHOLDER\nGmail/CRM/Supabase/webhook/orchestrator—none connected.','TESTING CHECKLIST\nMissing data, sensitive content, duplicate, failure, rollback, audit record.'],
  'self-audit':['AUDIT SUMMARY\nThe local-first safety model is strong; routing transparency and tests are the next leverage points.','ISSUES FOUND\nPrompt routing rationale is implicit; skill drafts lack version history; assumptions are not editable.','SUGGESTED IMPROVEMENTS\nAdd route tests, accessible interaction focus, editable assumptions, and reviewed skill catalogue.','ESTIMATED FUTURE AI COST MODE\nCheap for audit, Standard for reviewed implementation planning.','IMPLEMENTATION PLAN\nDraft issue → user review → scoped implementation → tests → stop before merge/deploy.'],
  research:['RESEARCH QUESTION\nClarify the market, customer, alternatives, and evidence needed.','MOCK FINDINGS\nCustomers value time saved, visible boundaries, and predictable costs.','EVIDENCE GAPS\nNo live web, database, or cited market research occurred.','NEXT STEPS\nInterview five customers and commission cited research in a later approved phase.'],
  marketing:['HOOK\nBuild the business before you build the machinery.','DRAFT\nSmallBiz Agent helps turn an idea into a plan, a launch path, and safe operating workflows—with the founder in control.','CTA\nWhat would you build if the first step were clear?','TONE & RISK\nDirect and grounded. Review before any future publishing.'],
  engineering:['OBJECTIVE\nTranslate the request into a small, testable implementation task.','INSTRUCTIONS\nFollow existing architecture, preserve local-only boundaries, and document changed files.','TESTS\nRouting, persistence, permissions, accessibility, mobile layout.','GUARDRAILS\nNo external calls, commit, push, merge, deploy, or production changes.'],
  finance:['REVIEW SUMMARY\nPrepare a local administrative review and surface uncertainty.','QUESTIONS\nWhich source documents confirm the item? Is professional review needed?','BOUNDARY\nNo payment, reconciliation, tax submission, or final accounting decision.'],
  customer:['CUSTOMER CONTEXT\nAcknowledge the request, clarify the desired outcome, and avoid assumptions.','DRAFT REPLY\nThanks for sharing this. I want to make sure we understand the issue correctly before suggesting the next step.','ESCALATION\nSensitive, legal, financial, or safety topics require human review.'],
  product:['FEEDBACK SUMMARY\nThe request points to a need for a clearer bridge from intent to execution.','PRODUCT INSIGHT\nShow the selected agent, route, permission, and next action.','ROADMAP DRAFT\nAdd transparent routing feedback and editable plan assumptions.'],
  'founder-ops':['OPERATING SUMMARY\nStart with the smallest decision that creates useful evidence.','PRIORITIES\nClarify outcome · choose owner · define proof · time-box the first move.','NEXT ACTIONS\nWrite the one-sentence objective and schedule the first validation step.']
}

function makeSkillGap(prompt:string):SkillGapReport {
  const now=new Date().toISOString()
  return {id:crypto.randomUUID(),requestedCapability:prompt,userPrompt:prompt,detectedGap:'No reviewed deterministic module currently covers this exact operating process.',suggestedSkillName:'Draft Small-Business Process Skill',suggestedWorkflow:'Capture inputs → map decisions → define outputs → add permissions → test fictional cases → human review',riskLevel:'medium',permissionLevel:2,recommendedReview:'Product owner and domain specialist review before any platform-wide availability.',status:'needs_review',createdAt:now}
}

export function generateMockAgentResponse(prompt:string, preferredAgentId?:string, profile?:BusinessProfile):MockAgentResult {
  const trimmed=prompt.trim(); const route=routePrompt(trimmed,preferredAgentId)
  if(restrictedPattern.test(trimmed))return {agentId:route.agentId,prompt:trimmed,recommendedWorkflowId:route.workflowId,blockedReason:'Level 3 request blocked. SmallBiz Agent cannot make payments, reconcile banking, submit tax, delete production data, deploy, sign commitments, spend real tokens, or install unreviewed skills.'}
  const isSkillGap=route.category==='skill-gap'; const skillGap=isSkillGap?makeSkillGap(trimmed):undefined
  const approvalNeeded=isSkillGap||level2Pattern.test(trimmed)
  const permissionLevel:PermissionLevel=approvalNeeded?2:1
  const riskLevel:RiskLevel=approvalNeeded?'medium':route.category==='finance'?'high':'low'
  const agent=agents.find(item=>item.id===route.agentId)!
  const body=isSkillGap?[
    `REQUESTED CAPABILITY\n${trimmed}`,
    `GAP DETECTED\n${skillGap!.detectedGap}`,
    `PROPOSED NEW SKILL\n${skillGap!.suggestedSkillName}`,
    'INPUTS NEEDED\nBusiness context, trigger, decisions, exceptions, output, owner, and unacceptable actions.',
    `DRAFT WORKFLOW\n${skillGap!.suggestedWorkflow}`,
    'REVIEW NEEDED\nDomain and product review. Platform-wide learning would require Level 2 approval.',
    'PLATFORM-WIDE LEARNING NOTE\nMVP can save this draft but cannot install, self-modify, create a PR, or update global behaviour.'
  ]:sections[route.category]||sections[route.agentId]||sections['founder-ops']
  const now=new Date().toISOString()
  const context=profile?`BUSINESS CONTEXT USED\nBusiness: ${profile.businessName}\nStage: ${profile.stage}\nIndustry: ${profile.industry}\nProduct/service: ${profile.productOrService}\nTarget customer: ${profile.targetCustomer}\nCurrent goal: ${profile.currentGoal}\nBudget: ${profile.budgetLevel}\nPreferred tone: ${profile.preferredTone}\n\n`:''
  const output:AgentOutput={id:crypto.randomUUID(),agentId:route.agentId,title:isSkillGap?'Skill Gap Report · Mock draft':`${agent.name} · Local response`,summary:isSkillGap?`A reviewed skill module is needed for: ${trimmed}`:`${agent.name} routed ${profile?`${profile.businessName}'s `:'this '}request into a structured local ${route.category.replace('-',' ')} response.`,fullOutput:`${context}PROMPT\n${trimmed}\n\n${body.join('\n\n')}\n\nPERMISSION & RISK\nLevel ${permissionLevel} · ${riskLevel} risk${approvalNeeded?' · local approval preview required':''}.\n\nFUTURE INTEGRATION\nA reviewed backend adapter may support this later. No real AI, API, file, message, workflow, or external action was used.`,tags:[...new Set([route.category,route.agentId,'local-mock'])],createdAt:now,usefulnessRating:null,approvalNeeded,riskNote:`Level ${permissionLevel} · ${riskLevel} risk. Deterministic local template only.`,futureIntegrationNote:'Future capabilities require backend secrets, server-side permissions, audit logs, and approval gates.',source:route.source,permissionLevel,estimatedCostMode:'cheap',skillStatus:isSkillGap?'needs_review':undefined,contextUsed:profile?{businessName:profile.businessName,stage:profile.stage,industry:profile.industry,currentGoal:profile.currentGoal,budgetLevel:profile.budgetLevel}:undefined}
  const approvalDraft:Approval|undefined=approvalNeeded?{id:crypto.randomUUID(),title:isSkillGap?'Review new skill draft':`Review proposed Level 2 action`,agentId:route.agentId,proposedAction:isSkillGap?'Review this local skill draft before any future platform-wide availability.':'Review the proposed future external action. Approval in this MVP changes local state only.',reason:'No external service was contacted. A future version would require explicit approval before execution.',confidence:82,riskLevel:'medium',status:'pending',createdAt:now,sourceOutputId:output.id}:undefined
  return {agentId:route.agentId,prompt:trimmed,output,approvalDraft,recommendedWorkflowId:route.workflowId,skillGapReport:skillGap}
}
