import { useEffect, useState } from 'react'
import type { AgentOutput, Approval, BuilderRun, BuilderRunBundle, BusinessProfile, ConnectionDraftBundle, EndOfDayReviewInput, FounderMatch, FounderProfile, MockAgentResult, ProjectActionItem, ProjectHelpActionType, ProjectHelpBundle, ProjectMilestone, ProjectWorkspaceProject, Workflow, WorkflowResult } from './types'
import { workflowSeed } from './data/workflows'
import { isRecordArray, loadLocal, saveLocal } from './services/storage'
import { executeWorkflow } from './services/execution/executionEngine'
import { generateMockAgentResponse } from './services/mockAgentResponse'
import { clearBusinessProfile, getBusinessProfile, saveBusinessProfile, updateBusinessProfile } from './services/businessProfileService'
import { clearFounderProfile, createFounderProfile, getOrCreateFounderProfile, saveFounderProfile, syncFounderFromBusiness, updateFounderProfile } from './services/founderProfileService'
import { Shell, type PageId } from './components/Shell'
import { HomePage } from './pages/HomePage'
import { AgentsPage } from './pages/AgentsPage'
import { WorkflowsPage } from './pages/WorkflowsPage'
import { ApprovalsPage } from './pages/ApprovalsPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { WorkspacePage } from './pages/WorkspacePage'
import { loadProjects, saveProjects } from './services/projectWorkspaceService'
import { generateProjectHelp } from './services/projectAiHelpService'
import { actionsFromOutput, loadProjectActions, loadProjectMilestones, saveProjectActions, saveProjectMilestones } from './services/projectActionBoardService'
import { createEndOfDayReport, deriveDailyFocus, enrichDailyBriefing } from './services/dailyFocusService'
import { generateBuilderRun, loadBuilderRuns, saveBuilderRuns } from './services/operator.builderWorkflows'
import { CommunityPage } from './pages/CommunityPage'
import { createConnectionDraft } from './services/communityService'

export function App() {
 const [businessProfile,setBusinessProfile]=useState<BusinessProfile|null>(()=>getBusinessProfile())
 const [founderProfile,setFounderProfile]=useState<FounderProfile|null>(()=>getOrCreateFounderProfile(getBusinessProfile()))
 const [page,setPage]=useState<PageId>('home')
 const [workflows,setWorkflows]=useState<Workflow[]>(()=>{
  const stored=loadLocal('operator.workflows',workflowSeed,isRecordArray<Workflow>)
  return workflowSeed.map(seed=>stored.find(item=>item.id===seed.id)?{...seed,...stored.find(item=>item.id===seed.id)}:seed)
 })
 const [reports,setReports]=useState<AgentOutput[]>(()=>loadLocal('operator.reports',[],isRecordArray<AgentOutput>))
 const [approvals,setApprovals]=useState<Approval[]>(()=>loadLocal('operator.approvals',[],isRecordArray<Approval>))
 const [projects,setProjects]=useState<ProjectWorkspaceProject[]>(()=>loadProjects())
 const [projectActions,setProjectActions]=useState<ProjectActionItem[]>(()=>loadProjectActions())
 const [projectMilestones,setProjectMilestones]=useState<ProjectMilestone[]>(()=>loadProjectMilestones())
 const [builderRuns,setBuilderRuns]=useState<BuilderRun[]>(()=>loadBuilderRuns())
 const [running,setRunning]=useState<string|null>(null)
 const [toast,setToast]=useState('')
 const [result,setResult]=useState<WorkflowResult|null>(null)
 const [runError,setRunError]=useState('')
 const [promptResult,setPromptResult]=useState<MockAgentResult|null>(null)
 useEffect(()=>{saveLocal('operator.workflows',workflows)},[workflows]); useEffect(()=>{saveLocal('operator.reports',reports)},[reports]); useEffect(()=>{saveLocal('operator.approvals',approvals)},[approvals]); useEffect(()=>{saveProjects(projects)},[projects]); useEffect(()=>{saveProjectActions(projectActions)},[projectActions]); useEffect(()=>{saveProjectMilestones(projectMilestones)},[projectMilestones]); useEffect(()=>{saveBuilderRuns(builderRuns)},[builderRuns])
 async function run(id:string,userCommand?:string){
  const wf=workflows.find(w=>w.id===id); if(!wf||running)return
  setRunning(id); setResult(null); setRunError(''); setWorkflows(v=>v.map(w=>w.id===id?{...w,status:'running'}:w))
  try{
   const bundle=await executeWorkflow(wf,businessProfile||undefined,founderProfile||undefined,userCommand)
   if(bundle.result.status==='blocked'){setWorkflows(v=>v.map(w=>w.id===id?{...w,status:'ready'}:w));setRunError(bundle.result.summary);setToast('Level 3 execution blocked locally');setTimeout(()=>setToast(''),4200);return}
   let report=bundle.report!;const approval=bundle.approval;if(wf.id==='daily')report=enrichDailyBriefing(report,deriveDailyFocus(projects,projectActions,projectMilestones,approvals,reports))
   setReports(v=>[report,...v]); if(approval)setApprovals(v=>[approval,...v])
   const createdAt=new Date().toISOString()
   setWorkflows(v=>v.map(w=>w.id===id?{...w,status:'complete',lastRunAt:createdAt}:w))
   setResult({workflowId:wf.id,workflowName:wf.name,agentId:wf.assignedAgent,reportId:report.id,reportSummary:report.summary,approvalId:approval?.id,riskLevel:wf.riskLevel,createdAt,providerName:report.execution?.providerName,simulatedTools:report.execution?.simulatedTools,permissionDecision:report.execution?.permissionDecision,executionResultId:report.execution?.executionResultId,plainEnglishSummary:report.plainEnglishSummary,keyFindings:report.keyFindings,recommendedNextSteps:report.recommendedNextSteps,copyableText:report.copyableText,approvalSummary:report.approvalSummary})
   setPage('workflows')
   setToast(`Mock report generated${approval?' · local approval item created':''}`)
  }catch{setWorkflows(v=>v.map(w=>w.id===id?{...w,status:'ready'}:w));setRunError('The local simulation could not generate a report. Nothing external was contacted or changed.')}
  finally{setRunning(null);setTimeout(()=>setToast(''),4500)}
 }
 function updateApproval(id:string,updates:Partial<Approval>){setApprovals(v=>v.map(a=>a.id===id?{...a,...updates,updatedAt:new Date().toISOString()}:a));setToast('Approval updated locally');setTimeout(()=>setToast(''),3000)}
 function rate(id:string,r:AgentOutput['usefulnessRating']){setReports(v=>v.map(x=>x.id===id?{...x,usefulnessRating:r}:x))}
 function saveProject(project:ProjectWorkspaceProject){setProjects(v=>v.some(item=>item.id===project.id)?v.map(item=>item.id===project.id?project:item):[project,...v]);setToast('Project saved locally');setTimeout(()=>setToast(''),3000)}
 function runProjectHelp(project:ProjectWorkspaceProject,actionType:ProjectHelpActionType):ProjectHelpBundle{const bundle=generateProjectHelp(project,actionType);const now=new Date().toISOString();setReports(v=>[bundle.output,...v]);if(bundle.approval)setApprovals(v=>[bundle.approval!,...v]);setProjects(v=>v.map(item=>item.id===project.id?{...item,linkedOutputIds:[bundle.output.id,...item.linkedOutputIds.filter(id=>id!==bundle.output.id)],linkedApprovalIds:bundle.approval?[bundle.approval.id,...item.linkedApprovalIds.filter(id=>id!==bundle.approval!.id)]:item.linkedApprovalIds,lastAiHelpAt:now,updatedAt:now,status:bundle.approval?'Waiting for approval':item.status}:item));setToast(`Saved AI Team report to ${project.name}${bundle.approval?' · review item created':''}`);setTimeout(()=>setToast(''),4000);return bundle}
 function addOutputActions(projectId:string,output:AgentOutput){const created=actionsFromOutput(projectId,output,projectActions);if(created.length)setProjectActions(items=>[...created,...items]);setToast(created.length?`${created.length} next actions added to the board`:'Those actions are already on the board');setTimeout(()=>setToast(''),3000);return created.length}
 function markFocusActionDone(id:string){const now=new Date().toISOString();setProjectActions(items=>items.map(item=>item.id===id?{...item,status:'done',completedAt:now,updatedAt:now}:item));setToast('Action marked done');setTimeout(()=>setToast(''),2500)}
 function saveDailyReview(input:EndOfDayReviewInput){const report=createEndOfDayReport(input,projects);setReports(items=>[report,...items]);if(input.projectId)setProjects(items=>items.map(project=>project.id===input.projectId?{...project,linkedOutputIds:[report.id,...project.linkedOutputIds],updatedAt:new Date().toISOString()}:project));setToast('End-of-day review saved locally');setTimeout(()=>setToast(''),3000);return report}
 function runBuilder(project:ProjectWorkspaceProject,workflowId:string,inputs:Record<string,string>):BuilderRunBundle{const bundle=generateBuilderRun(project,workflowId,inputs);const now=new Date().toISOString();setBuilderRuns(items=>[bundle.run,...items]);setReports(items=>[bundle.output,...items]);setProjectActions(items=>[...bundle.actions,...items]);setProjectMilestones(items=>[...bundle.milestones,...items]);if(bundle.approvals.length)setApprovals(items=>[...bundle.approvals,...items]);setProjects(items=>items.map(item=>item.id===project.id?{...item,linkedOutputIds:[bundle.output.id,...item.linkedOutputIds],linkedApprovalIds:[...bundle.approvals.map(approval=>approval.id),...item.linkedApprovalIds],lastAiHelpAt:now,updatedAt:now}:item));setToast(`Builder plan saved · ${bundle.actions.length} actions and ${bundle.milestones.length} milestones added`);setTimeout(()=>setToast(''),4200);return bundle}
 function draftFounderConnection(match:FounderMatch):ConnectionDraftBundle{const bundle=createConnectionDraft(match,businessProfile||undefined,founderProfile||undefined);setReports(items=>[bundle.output,...items]);setApprovals(items=>[bundle.approval,...items]);setToast('Connection draft saved · simulated approval preview created');setTimeout(()=>setToast(''),3500);return bundle}
 function submitPrompt(prompt:string,agentId?:string){
  const response=generateMockAgentResponse(prompt,agentId,businessProfile||undefined,founderProfile||undefined);setPromptResult(response)
  if(response.output)setReports(v=>[response.output!,...v]);if(response.approvalDraft)setApprovals(v=>[response.approvalDraft!,...v])
  setToast(response.blockedReason?'Level 3 request blocked safely':`Local response saved${response.approvalDraft?' · approval preview created':''}`);setTimeout(()=>setToast(''),4200)
  return response
 }
 if(!businessProfile||!founderProfile||!founderProfile.onboardingCompleted)return <OnboardingPage onComplete={founder=>{const now=new Date().toISOString();const savedFounder=saveFounderProfile(founder);const business=saveBusinessProfile({id:crypto.randomUUID(),founderName:founder.name,businessName:founder.companyName,stage:founder.businessStage,industry:founder.businessType,productOrService:founder.projects.join(', '),targetCustomer:'Customers of '+founder.companyName,currentGoal:founder.goals[0]||'Get organised',biggestChallenge:'Turn current priorities into clear next steps',budgetLevel:'lean',preferredTone:founder.preferredTone,riskComfort:founder.riskPreference,desiredIntegrations:[],createdAt:now,updatedAt:now});setFounderProfile(savedFounder);setBusinessProfile(business)}}/>
 function saveProfile(profile:BusinessProfile){const saved=updateBusinessProfile(profile)||saveBusinessProfile(profile);setBusinessProfile(saved);setFounderProfile(current=>current?syncFounderFromBusiness(current,saved):createFounderProfile(saved));setToast('Business profile saved locally');setTimeout(()=>setToast(''),3000)}
 function saveFounder(profile:FounderProfile){const saved=updateFounderProfile(profile);setFounderProfile(saved);setBusinessProfile(current=>current?saveBusinessProfile({...current,founderName:saved.name,businessName:saved.companyName,industry:saved.businessType,productOrService:saved.projects.join(', '),currentGoal:saved.goals[0]||current.currentGoal,preferredTone:saved.preferredTone,updatedAt:new Date().toISOString()}):current);setToast('Your setup was saved locally');setTimeout(()=>setToast(''),3000)}
 function resetProfile(){clearBusinessProfile();clearFounderProfile();setBusinessProfile(null);setFounderProfile(null);setPage('home');setPromptResult(null);setResult(null)}
 if(page==='community')return <Shell page={page} setPage={setPage} pending={approvals.filter(a=>a.status==='pending'||a.status==='edited').length}><CommunityPage profile={businessProfile} founderProfile={founderProfile} draftConnection={draftFounderConnection} openReports={()=>setPage('reports')} openApprovals={()=>setPage('approvals')}/>{toast&&<div className="toast"><span>✓</span>{toast}<button onClick={()=>setPage('reports')}>View reports</button></div>}</Shell>
 let content = page==='home'?<HomePage profile={businessProfile} founderProfile={founderProfile} workflows={workflows} reports={reports} approvals={approvals} projects={projects} projectActions={projectActions} projectMilestones={projectMilestones} saveDailyReview={saveDailyReview} markFocusActionDone={markFocusActionDone} run={run} go={setPage} submitPrompt={submitPrompt} promptResult={promptResult}/>:page==='workspace'?<WorkspacePage projects={projects} reports={reports} approvals={approvals} projectActions={projectActions} projectMilestones={projectMilestones} saveProject={saveProject} runProjectHelp={runProjectHelp} runBuilder={runBuilder} addOutputActions={addOutputActions} onActionsChange={setProjectActions} onMilestonesChange={setProjectMilestones} go={setPage}/>:page==='agents'?<AgentsPage founderProfile={founderProfile} submitPrompt={submitPrompt} promptResult={promptResult}/>:page==='workflows'?<WorkflowsPage founderProfile={founderProfile} workflows={workflows} running={running} run={run} result={result} error={runError} viewReport={()=>setPage('reports')} viewApproval={()=>setPage('approvals')}/>:page==='approvals'?<ApprovalsPage approvals={approvals} update={updateApproval}/>:page==='reports'?<ReportsPage reports={reports} projectActions={projectActions} rate={rate} highlightedReportId={result?.reportId||promptResult?.output?.id} onRunRecommended={()=>setPage('workflows')}/>:<SettingsPage profile={businessProfile} founderProfile={founderProfile} onSaveProfile={saveProfile} onSaveFounderProfile={saveFounder} onResetProfile={resetProfile}/>
 return <Shell page={page} setPage={setPage} pending={approvals.filter(a=>a.status==='pending'||a.status==='edited').length}>{content}{toast&&<div className="toast"><span>✓</span>{toast}<button onClick={()=>setPage('reports')}>View reports</button></div>}</Shell>
}
