import type { FounderProfile, Workflow } from '../types'

const terms:Record<string,string[]>={
 'business-plan':['idea','plan','launch','business'],funding:['fund','budget','capital','money'],vexis:['vexis','product','validation','feedback','roadmap'],marketing:['marketing','launch','growth','copy','brand'],github:['github','code','technical','build','delivery'],research:['research','market','validate','customer'],automation:['automate','manual','process','operations'],invoice:['finance','invoice','admin'],daily:['priority','today','focus'],weekly:['weekly','planning'], 'self-audit':['audit','improve','quality']
}
export function recommendWorkflows(workflows:Workflow[],profile:FounderProfile,limit=4):Workflow[]{
 const context=[...profile.projects,...profile.goals,...profile.mainProjects,...profile.currentPriorities,profile.businessType,profile.businessStage,profile.preferredTone,profile.riskPreference].join(' ').toLowerCase()
 const scored=workflows.map((workflow,index)=>{let score=terms[workflow.id]?.reduce((sum,term)=>sum+(context.includes(term)?3:0),0)||0
  if(context.includes('vexis')&&context.includes('product validation'))score+=workflow.id==='vexis'?5:['marketing','research','github'].includes(workflow.id)?4:0
  if(['idea','validating'].includes(profile.businessStage)&&['business-plan','research','vexis'].includes(workflow.id))score+=2
  if(profile.defaultPermissionLevel<2&&workflow.requiresApproval)score-=2
  if(profile.riskPreference==='cautious'&&workflow.riskLevel==='high')score-=3
  return {workflow,score,index}})
 return scored.sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,limit).map(item=>item.workflow)
}

const agentGoalMap:Record<string,string[]>={
 'Get organised':['founder','automation'],'Find customers':['marketing','research','customer'],'Improve product/service':['product','research','customer'],
 'Create content/marketing':['marketing','customer'],'Handle admin/finance':['finance','founder'],'Research ideas/tools':['research','business-builder'],
 'Build software/features':['engineering','product']
}
export function recommendedAgentIds(profile:FounderProfile):string[]{
 const ranked=['founder',...profile.goals.flatMap(goal=>agentGoalMap[goal]||[])];return [...new Set(ranked)]
}
