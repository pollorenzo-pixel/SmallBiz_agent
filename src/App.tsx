import { useEffect, useState } from 'react'
import type { AgentOutput, Approval, BusinessProfile, MockAgentResult, Workflow, WorkflowResult } from './types'
import { workflowSeed } from './data/workflows'
import { isRecordArray, loadLocal, saveLocal } from './services/storage'
import { runWorkflow } from './services/workflowRunner'
import { createApproval, shouldCreateApproval } from './services/approvalService'
import { generateMockAgentResponse } from './services/mockAgentResponse'
import { clearBusinessProfile, getBusinessProfile, saveBusinessProfile, updateBusinessProfile } from './services/businessProfileService'
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
  if(wf.riskLevel==='restricted'){setRunError('This Level 3 workflow is blocked in the MVP. No approval or action was created.');return}
  setRunning(id); setResult(null); setRunError(''); setWorkflows(v=>v.map(w=>w.id===id?{...w,status:'running'}:w))
  try{
   const needsApproval=shouldCreateApproval(wf)
   const approval=needsApproval?createApproval(wf):null
   const report=await runWorkflow(wf,Boolean(approval),businessProfile||undefined)
   setReports(v=>[report,...v]); if(approval)setApprovals(v=>[{...approval,sourceOutputId:report.id},...v])
   const createdAt=new Date().toISOString()
   setWorkflows(v=>v.map(w=>w.id===id?{...w,status:'complete',lastRunAt:createdAt}:w))
   setResult({workflowId:wf.id,workflowName:wf.name,agentId:wf.assignedAgent,reportId:report.id,reportSummary:report.summary,approvalId:approval?.id,riskLevel:wf.riskLevel,createdAt})
   setPage('workflows')
   setToast(`Mock report generated${approval?' · local approval item created':''}`)
  }catch{setWorkflows(v=>v.map(w=>w.id===id?{...w,status:'ready'}:w));setRunError('The local simulation could not generate a report. Nothing external was contacted or changed.')}
  finally{setRunning(null);setTimeout(()=>setToast(''),4500)}
 }
 function updateApproval(id:string,status:Approval['status']){setApprovals(v=>v.map(a=>a.id===id?{...a,status}:a));setToast(`Approval marked ${status} locally`);setTimeout(()=>setToast(''),3000)}
 function rate(id:string,r:AgentOutput['usefulnessRating']){setReports(v=>v.map(x=>x.id===id?{...x,usefulnessRating:r}:x))}
 function submitPrompt(prompt:string,agentId?:string){
  const response=generateMockAgentResponse(prompt,agentId,businessProfile||undefined);setPromptResult(response)
  if(response.output)setReports(v=>[response.output!,...v]);if(response.approvalDraft)setApprovals(v=>[response.approvalDraft!,...v])
  setToast(response.blockedReason?'Level 3 request blocked safely':`Local response saved${response.approvalDraft?' · approval preview created':''}`);setTimeout(()=>setToast(''),4200)
  return response
 }
 if(!businessProfile)return <OnboardingPage onComplete={profile=>{saveBusinessProfile(profile);setBusinessProfile(profile)}}/>
 function saveProfile(profile:BusinessProfile){const saved=updateBusinessProfile(profile)||saveBusinessProfile(profile);setBusinessProfile(saved);setToast('Business profile saved locally');setTimeout(()=>setToast(''),3000)}
 function resetProfile(){clearBusinessProfile();setBusinessProfile(null);setPage('home');setPromptResult(null);setResult(null)}
 let content = page==='home'?<HomePage profile={businessProfile} workflows={workflows} reports={reports} approvals={approvals} run={run} go={setPage} submitPrompt={submitPrompt} promptResult={promptResult}/>:page==='agents'?<AgentsPage submitPrompt={submitPrompt} promptResult={promptResult}/>:page==='workflows'?<WorkflowsPage workflows={workflows} running={running} run={run} result={result} error={runError} viewReport={()=>setPage('reports')} viewApproval={()=>setPage('approvals')}/>:page==='approvals'?<ApprovalsPage approvals={approvals} update={updateApproval}/>:page==='reports'?<ReportsPage reports={reports} rate={rate} highlightedReportId={result?.reportId||promptResult?.output?.id}/>:<SettingsPage profile={businessProfile} onSaveProfile={saveProfile} onResetProfile={resetProfile}/>
 return <Shell page={page} setPage={setPage} pending={approvals.filter(a=>a.status==='pending').length}>{content}{toast&&<div className="toast"><span>✓</span>{toast}<button onClick={()=>setPage('reports')}>View reports</button></div>}</Shell>
}
