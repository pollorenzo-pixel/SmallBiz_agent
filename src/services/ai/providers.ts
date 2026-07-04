import type { AIProvider } from '../../types'

export const providers:AIProvider[]=[
 {id:'mock-local',name:'Mock Local Provider',type:'deterministic-template',status:'active',description:'Runs deterministic templates and mock tools entirely in this browser.',capabilities:['structured outputs','mock tools','profile context'],authType:'none',supportsStreaming:false,supportsTools:true,riskLevel:'low',isMock:true,enabled:true},
 {id:'openai-compatible',name:'Future OpenAI-compatible Provider',type:'remote-api',status:'disabled',description:'Backend-only future provider. No frontend key or network client exists.',capabilities:['text generation','tool calling','streaming'],authType:'backend environment secret',supportsStreaming:true,supportsTools:true,riskLevel:'medium',isMock:false,enabled:false},
 {id:'openclaw-chat',name:'Future OpenClaw Chat Interface',type:'external-agent',status:'placeholder',description:'Future reviewed agent interface with scoped tools and approvals.',capabilities:['agent orchestration','tool handoff'],authType:'backend service credential',supportsStreaming:true,supportsTools:true,riskLevel:'high',isMock:false,enabled:false},
 {id:'local-model',name:'Future Local Model Provider',type:'local-runtime',status:'placeholder',description:'Potential user-controlled local inference adapter.',capabilities:['private inference','offline generation'],authType:'local runtime',supportsStreaming:true,supportsTools:false,riskLevel:'medium',isMock:false,enabled:false}
]
const KEY='smallbiz.selectedProvider'
export function getSelectedProviderId():string{try{const id=localStorage.getItem(KEY);return providers.some(p=>p.id===id&&p.enabled)?id!:'mock-local'}catch{return 'mock-local'}}
export function saveSelectedProviderId(id:string):string{const selected=providers.find(p=>p.id===id&&p.enabled)?.id||'mock-local';try{localStorage.setItem(KEY,selected)}catch{/* unavailable storage */}return selected}
export function getSelectedProvider():AIProvider{return providers.find(p=>p.id===getSelectedProviderId())||providers[0]}
