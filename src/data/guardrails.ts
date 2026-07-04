import type { AICostGuardrail } from '../types'

export const aiCostGuardrails: AICostGuardrail[] = [
  {id:'no-background',name:'No background self-improvement loops',description:'Self-audit runs only when requested.',enabled:true,limitType:'autonomy',actionWhenLimitReached:'block'},
  {id:'premium-approval',name:'Approval before high-cost AI mode',description:'Premium mode would require explicit approval.',enabled:true,limitType:'cost',actionWhenLimitReached:'require-approval'},
  {id:'cheap-first',name:'Prefer cheap audit mode first',description:'Start with the smallest useful future model.',enabled:true,limitType:'cost',actionWhenLimitReached:'recommend-cheap'},
  {id:'summarise-first',name:'Summarise before long code changes',description:'Require a reviewed summary before future implementation.',enabled:true,limitType:'scope',actionWhenLimitReached:'require-summary'},
  {id:'monthly-budget',name:'Monthly AI spend placeholder',description:'Local display only; not connected to billing.',enabled:true,limitType:'monthly-budget',mockLimit:'£25',actionWhenLimitReached:'block'},
  {id:'no-real-tokens',name:'Never spend real tokens in MVP',description:'All responses are deterministic local templates.',enabled:true,limitType:'token-usage',mockLimit:'0 real tokens',actionWhenLimitReached:'block'},
  {id:'skill-review',name:'Review platform-wide skill updates',description:'Draft skills cannot become global without review.',enabled:true,limitType:'skills',actionWhenLimitReached:'require-approval'},
  {id:'no-learning-loop',name:'No autonomous learning loops',description:'Learning is represented only as a local draft.',enabled:true,limitType:'autonomy',actionWhenLimitReached:'block'}
]
