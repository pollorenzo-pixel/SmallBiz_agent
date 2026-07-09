import type { AIGatewayRequest, AIGatewayResult, AIProviderMode, AIResponseContract, PermissionLevel } from '../../src/types'
import { runAIGatewayTask } from '../../src/services/aiGateway'
import { routeAIModelTask } from '../../src/services/modelRouter'
import { checkAIBudget } from '../../src/services/budgetGuard'
import { buildGatewaySystemPrompt } from '../../src/services/agentPrompts'

interface VercelRequest { method?:string; headers:Record<string,string|string[]|undefined>; body?:unknown }
interface VercelResponse { status:(code:number)=>VercelResponse; json:(body:unknown)=>void; setHeader:(name:string,value:string)=>void }

const MAX_BODY_BYTES=32_000
const MAX_PROMPT_CHARS=8_000
const MAX_OUTPUT_TOKENS=900
const PROVIDER_TIMEOUT_MS=12_000
const DANGEROUS_PATTERN=/\b(send email|create calendar event|make payment|pay supplier|submit tax|tax filing|reconcile bank|bank reconciliation|delete production|delete customer|drop table|deploy|merge pull request|run github|run codex|run openhands|sign contract|legal commitment|financial commitment)\b/i

function env(name:string):string{
 return typeof process==='undefined'?'':(process.env[name]||'').trim()
}

function providerMode():AIProviderMode{
 return env('AI_PROVIDER_MODE')==='openai-compatible'?'openai-compatible':'mock'
}

function bodySize(req:VercelRequest):number{
 const raw=req.headers['content-length']
 const value=Array.isArray(raw)?raw[0]:raw
 return Number(value||0)
}

function isRecord(value:unknown):value is Record<string,unknown>{
 return !!value&&typeof value==='object'&&!Array.isArray(value)
}

function validateRequest(body:unknown):AIGatewayRequest{
 if(!isRecord(body))throw new Error('Request body must be a JSON object.')
 const id=typeof body.id==='string'&&body.id.trim()?body.id:crypto.randomUUID()
 const taskType=typeof body.taskType==='string'&&body.taskType.trim()?body.taskType:'Admin'
 const prompt=typeof body.prompt==='string'?body.prompt:''
 if(!prompt.trim())throw new Error('A prompt is required.')
 if(prompt.length>MAX_PROMPT_CHARS)throw new Error(`Prompt is too long. Limit is ${MAX_PROMPT_CHARS} characters.`)
 const requestedPermissionLevel=typeof body.requestedPermissionLevel==='number'&&[0,1,2,3].includes(body.requestedPermissionLevel)?body.requestedPermissionLevel as PermissionLevel:undefined
 return {
  id,taskType,prompt,
  title:typeof body.title==='string'?body.title:undefined,
  agentId:typeof body.agentId==='string'?body.agentId:undefined,
  workflowId:typeof body.workflowId==='string'?body.workflowId:undefined,
  requestedPermissionLevel,
  requiresApproval:body.requiresApproval===true,
  context:isRecord(body.context)?body.context:{}
 }
}

function safeJsonParse(text:string):Partial<AIResponseContract>|null{
 try{
  const parsed:unknown=JSON.parse(text)
  return isRecord(parsed)?parsed as Partial<AIResponseContract>:null
 }catch{
  const match=text.match(/\{[\s\S]*\}/)
  if(!match)return null
  try{
   const parsed:unknown=JSON.parse(match[0])
   return isRecord(parsed)?parsed as Partial<AIResponseContract>:null
  }catch{return null}
 }
}

function normalizeContract(request:AIGatewayRequest,rawText:string,parsed:Partial<AIResponseContract>|null):AIResponseContract{
 const title=typeof parsed?.title==='string'?parsed.title:request.title||'Prepared AI work'
 const summary=typeof parsed?.summary==='string'?parsed.summary:rawText.slice(0,500)||'Prepared response.'
 const fullOutput=typeof parsed?.fullOutput==='string'?parsed.fullOutput:rawText
 const list=(value:unknown):string[]=>Array.isArray(value)?value.filter(item=>typeof item==='string').slice(0,8):[]
 return {
  title,summary,fullOutput,
  nextActions:list(parsed?.nextActions),
  approvalItems:list(parsed?.approvalItems),
  tasks:list(parsed?.tasks),
  risks:list(parsed?.risks),
  confidence:typeof parsed?.confidence==='number'?Math.max(0,Math.min(1,parsed.confidence)):0.76,
  timeSavedEstimateMinutes:typeof parsed?.timeSavedEstimateMinutes==='number'?Math.max(0,Math.min(180,Math.round(parsed.timeSavedEstimateMinutes))):15,
  noExternalActionTaken:true
 }
}

async function fetchWithTimeout(url:string,init:RequestInit,timeoutMs:number):Promise<Response>{
 const controller=new AbortController()
 const timeout=setTimeout(()=>controller.abort(),timeoutMs)
 try{return await fetch(url,{...init,signal:controller.signal})}
 finally{clearTimeout(timeout)}
}

async function callOpenAICompatibleProvider(request:AIGatewayRequest,permissionLevel:PermissionLevel):Promise<AIResponseContract>{
 const baseUrl=(env('OPENAI_BASE_URL')||'https://api.openai.com/v1').replace(/\/+$/,'')
 const key=env('OPENAI_API_KEY')
 const model=request.taskType.toLowerCase().includes('research')||request.taskType.toLowerCase().includes('planning')
  ? env('OPENAI_REASONING_MODEL')||env('OPENAI_DEFAULT_MODEL')||'gpt-4.1-mini'
  : env('OPENAI_DEFAULT_MODEL')||'gpt-4.1-mini'
 const system=buildGatewaySystemPrompt(request.agentId,permissionLevel)
 const body={model,messages:[{role:'system',content:system},{role:'user',content:request.prompt}],temperature:0.2,max_tokens:MAX_OUTPUT_TOKENS,response_format:{type:'json_object'}}
 let lastError='Provider request failed.'
 for(let attempt=0;attempt<2;attempt+=1){
  try{
   const response=await fetchWithTimeout(`${baseUrl}/chat/completions`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},body:JSON.stringify(body)},PROVIDER_TIMEOUT_MS)
   if(!response.ok){lastError=`Provider returned ${response.status}.`;continue}
   const data:unknown=await response.json()
   const content=isRecord(data)&&Array.isArray(data.choices)&&isRecord(data.choices[0])&&isRecord(data.choices[0].message)&&typeof data.choices[0].message.content==='string'?data.choices[0].message.content:''
   if(!content){lastError='Provider returned an empty response.';continue}
   return normalizeContract(request,content,safeJsonParse(content))
  }catch(error){
   lastError=error instanceof Error?error.message:lastError
  }
 }
 throw new Error(lastError)
}

function gatewayFromContract(request:AIGatewayRequest,base:AIGatewayResult,contract:AIResponseContract):AIGatewayResult{
 return {...base,providerMode:'openai-compatible',providerName:'Backend OpenAI-compatible Provider',output:contract.fullOutput,structuredOutput:contract,backend:{attempted:true,used:true,fallback:false},warnings:['Backend provider prepared text only. No external tool action was executed.']}
}

function fallback(request:AIGatewayRequest,reason:string):AIGatewayResult{
 const result=runAIGatewayTask(request)
 return {...result,warnings:[...(result.warnings||[]),reason],backend:{attempted:true,used:false,fallback:true,reason}}
}

export default async function handler(req:VercelRequest,res:VercelResponse){
 res.setHeader('Content-Type','application/json')
 if(req.method!=='POST'){res.status(405).json({error:'Use POST for the AI gateway.'});return}
 if(bodySize(req)>MAX_BODY_BYTES){res.status(413).json({error:`Request body is too large. Limit is ${MAX_BODY_BYTES} bytes.`});return}
 let request:AIGatewayRequest
 try{request=validateRequest(typeof req.body==='string'?JSON.parse(req.body):req.body)}
 catch(error){res.status(400).json({error:error instanceof Error?error.message:'Invalid gateway request.'});return}
 const route=routeAIModelTask(request)
 const budgetGuard=checkAIBudget(request,route)
 const permissionLevel=Math.max(route.defaultPermissionLevel,request.requestedPermissionLevel??0) as PermissionLevel
 if(permissionLevel>=3||route.id==='restricted-blocked'||budgetGuard.budgetStatus==='blocked'||DANGEROUS_PATTERN.test(`${request.taskType} ${request.title||''} ${request.prompt}`)){
  res.status(200).json(fallback({...request,requestedPermissionLevel:3},'Blocked by backend safety guard. Level 3 and destructive/external execution requests remain blocked in the MVP.'))
  return
 }
 if(providerMode()!=='openai-compatible') {res.status(200).json(fallback(request,'AI_PROVIDER_MODE is mock or unset. Local mock fallback used.'));return}
 if(!env('OPENAI_API_KEY')) {res.status(200).json(fallback(request,'OPENAI_API_KEY is not configured in the backend environment. Local mock fallback used.'));return}
 const base=runAIGatewayTask({...request,providerConfig:{mode:'openai-compatible',providerName:'Backend OpenAI-compatible Provider',isActive:true,notes:'Backend/serverless only. No secrets are exposed to frontend code.'}})
 try{
  const contract=await callOpenAICompatibleProvider(request,permissionLevel)
  res.status(200).json(gatewayFromContract(request,base,contract))
 }catch(error){
  res.status(200).json(fallback(request,`${error instanceof Error?error.message:'Backend provider failed.'} Local mock fallback used.`))
 }
}
