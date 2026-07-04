import { useEffect, useState } from 'react'
import type { AgentOutput, Approval, BusinessProfile, FounderProfile, MockAgentResult, Workflow, WorkflowResult } from './types'
import { workflowSeed } from './data/workflows'
import { isRecordArray, loadLocal, saveLocal } from './services/storage'
import { executeWorkflow } from './services/execution/executionEngine'
import { generateMockAgentResponse } from './services/mockAgentResponse'
import { clearBusinessProfile, getBusinessProfile, saveBusinessProfile, updateBusinessProfile } from './services/businessProfileService'
import { clearFounderProfile, createFounderProfile, getOrCreateFounderProfile, syncFounderFromBusiness, updateFounderProfile } from './services/founderProfileService'
import { Shell, type PageId } from './components/Shell'
import { HomePage } from './pages/HomePage'
import { AgentsPage } from './pages/AgentsPage'
import { WorkflowsPage } from './pages/WorkflowsPage'
import { ApprovalsPage } from './pages/ApprovalsPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { OnboardingPage } from './pages/OnboardingPage'

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
 const [running,setRunning]=useState<string|null>(null)
 const [toast,setToast]=useState('')
 const [result,setResult]=useState<WorkflowResult|null>(null)
 const [runError,setRunError]=useState('')
 const [promptResult,setPromptResult]=useState<MockAgentResult|null>(null)
 useEffect(()=>{saveLocal('operator.workflows',workflows)},[workflows]); useEffect(()=>{saveLocal('operator.reports',reports)},[reports]); useEffect(()=>{saveLocal('operator.approvals',approvals)},[approvals])
 async function run(id:string){
  const wf=workflows.find(w=>w.id===id); if(!wf||running)return
  setRunning(id); setResult(null); setRunError(''); setWorkflows(v=>v.map(w=>w.id===id?{...w,status:'running'}:w))
  try{
   const bundle=await executeWorkflow(wf,businessProfile||undefined,founderProfile||undefined)
   if(bundle.result.status==='blocked'){setWorkflows(v=>v.map(w=>w.id===id?{...w,status:'ready'}:w));setRunError(bundle.result.summary);setToast('Level 3 execution blocked locally');setTimeout(()=>setToast(''),4200);return}
   const report=bundle.report!;const approval=bundle.approval
   setReports(v=>[report,...v]); if(approval)setApprovals(v=>[approval,...v])
   const createdAt=new Date().toISOString()
   setWorkflows(v=>v.map(w=>w.id===id?{...w,status:'complete',lastRunAt:createdAt}:w))
   setResult({workflowId:wf.id,workflowName:wf.name,agentId:wf.assignedAgent,reportId:report.id,reportSummary:report.summary,approvalId:approval?.id,riskLevel:wf.riskLevel,createdAt,providerName:report.execution?.providerName,simulatedTools:report.execution?.simulatedTools,permissionDecision:report.execution?.permissionDecision,executionResultId:report.execution?.executionResultId})
   setPage('workflows')
   setToast(`Mock report generated${approval?' · local approval item created':''}`)
  }catch{setWorkflows(v=>v.map(w=>w.id===id?{...w,status:'ready'}:w));setRunError('The local simulation could not generate a report. Nothing external was contacted or changed.')}
  finally{setRunning(null);setTimeout(()=>setToast(''),4500)}
 }
 function updateApproval(id:string,updates:Partial<Approval>){setApprovals(v=>v.map(a=>a.id===id?{...a,...updates}:a));setToast('Approval updated locally');setTimeout(()=>setToast(''),3000)}
 function rate(id:string,r:AgentOutput['usefulnessRating']){setReports(v=>v.map(x=>x.id===id?{...x,usefulnessRating:r}:x))}
 function submitPrompt(prompt:string,agentId?:string){
  const response=generateMockAgentResponse(prompt,agentId,businessProfile||undefined,founderProfile||undefined);setPromptResult(response)
  if(response.output)setReports(v=>[response.output!,...v]);if(response.approvalDraft)setApprovals(v=>[response.approvalDraft!,...v])
  setToast(response.blockedReason?'Level 3 request blocked safely':`Local response saved${response.approvalDraft?' · approval preview created':''}`);setTimeout(()=>setToast(''),4200)
  return response
 }
 if(!businessProfile||!founderProfile)return <OnboardingPage onComplete={profile=>{const saved=saveBusinessProfile(profile);setBusinessProfile(saved);setFounderProfile(createFounderProfile(saved))}}/>
 function saveProfile(profile:BusinessProfile){const saved=updateBusinessProfile(profile)||saveBusinessProfile(profile);setBusinessProfile(saved);setFounderProfile(current=>current?syncFounderFromBusiness(current,saved):createFounderProfile(saved));setToast('Business profile saved locally');setTimeout(()=>setToast(''),3000)}
 function saveFounder(profile:FounderProfile){const saved=updateFounderProfile(profile);setFounderProfile(saved);setBusinessProfile(current=>current?saveBusinessProfile({...current,founderName:saved.name,businessName:saved.companyName,stage:saved.businessStage,preferredTone:saved.preferredTone,riskComfort:saved.riskPreference,updatedAt:new Date().toISOString()}):current);setToast('Operator profile saved locally');setTimeout(()=>setToast(''),3000)}
 function resetProfile(){clearBusinessProfile();clearFounderProfile();setBusinessProfile(null);setFounderProfile(null);setPage('home');setPromptResult(null);setResult(null)}
 let content = page==='home'?<HomePage profile={businessProfile} founderProfile={founderProfile} workflows={workflows} reports={reports} approvals={approvals} run={run} go={setPage} submitPrompt={submitPrompt} promptResult={promptResult}/>:page==='agents'?<AgentsPage submitPrompt={submitPrompt} promptResult={promptResult}/>:page==='workflows'?<WorkflowsPage workflows={workflows} running={running} run={run} result={result} error={runError} viewReport={()=>setPage('reports')} viewApproval={()=>setPage('approvals')}/>:page==='approvals'?<ApprovalsPage approvals={approvals} update={updateApproval}/>:page==='reports'?<ReportsPage reports={reports} rate={rate} highlightedReportId={result?.reportId||promptResult?.output?.id} onRunRecommended={()=>setPage('workflows')}/>:<SettingsPage profile={businessProfile} founderProfile={founderProfile} onSaveProfile={saveProfile} onSaveFounderProfile={saveFounder} onResetProfile={resetProfile}/>
 return <Shell page={page} setPage={setPage} pending={approvals.filter(a=>a.status==='pending').length}>{content}{toast&&<div className="toast"><span>✓</span>{toast}<button onClick={()=>setPage('reports')}>View reports</button></div>}</Shell>
}
