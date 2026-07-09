import type { AIGatewayRequest, AIGatewayResult } from '../types'
import { runAIGatewayTask } from './aiGateway'

const GATEWAY_ENDPOINT='/api/ai/gateway'
const REQUEST_TIMEOUT_MS=8000

function withFallbackMetadata(result:AIGatewayResult,reason:string):AIGatewayResult{
 return {...result,warnings:[...(result.warnings||[]),reason],backend:{attempted:true,used:false,fallback:true,reason}}
}

function isGatewayResult(value:unknown):value is AIGatewayResult{
 if(!value||typeof value!=='object')return false
 const item=value as Partial<AIGatewayResult>
 return typeof item.id==='string'&&typeof item.requestId==='string'&&typeof item.output==='string'&&!!item.modelRoute&&!!item.budgetGuard&&!!item.permission&&!!item.approval
}

export async function runAIGatewayTaskViaBackend(request:AIGatewayRequest):Promise<AIGatewayResult>{
 const localFallback=runAIGatewayTask(request)
 if(typeof fetch==='undefined')return withFallbackMetadata(localFallback,'Backend AI gateway is unavailable in this runtime; local mock fallback used.')
 const controller=new AbortController()
 const timeout=window.setTimeout(()=>controller.abort(),REQUEST_TIMEOUT_MS)
 try{
  const response=await fetch(GATEWAY_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(request),signal:controller.signal})
  if(!response.ok)throw new Error(`Backend AI gateway returned ${response.status}`)
  const data:unknown=await response.json()
  if(!isGatewayResult(data))throw new Error('Backend AI gateway returned an incompatible response shape.')
  return {...data,backend:{attempted:true,used:data.providerMode==='openai-compatible',fallback:data.providerMode==='mock',reason:data.backend?.reason}}
 }catch(error){
  const message=error instanceof Error?error.message:'Backend AI gateway request failed.'
  return withFallbackMetadata(localFallback,`${message} Local mock fallback used.`)
 }finally{
  window.clearTimeout(timeout)
 }
}
