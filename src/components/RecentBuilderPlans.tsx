import type { AgentOutput } from '../types'
import { Badge } from './Badge'

export function RecentBuilderPlans({reports,openReports}:{reports:AgentOutput[];openReports:()=>void}){
 const plans=reports.filter(report=>report.source==='business-builder'||report.tags?.includes('guided-builder')).slice(0,4)
 if(!plans.length)return null
 const open=(id:string)=>{try{sessionStorage.setItem('operator.openPlan',id)}catch{/* Browser storage may be unavailable. */}openReports()}
 return <section className="recent-builder-plans"><div><span className="eyebrow">PLANS CREATED</span><h3>Recent plans for this project</h3><p>Open a plan whenever you want to review, copy, or continue the work.</p></div><div>{plans.map(report=><article key={report.id}><div><Badge>{report.builderPlan?.builderType||report.tags?.find(tag=>['website','offer','launch','ads','app','automation'].includes(tag))||'builder plan'}</Badge><h4>{report.title}</h4><p>{report.plainEnglishSummary||report.summary}</p><small>{new Date(report.createdAt).toLocaleString()}</small></div><button onClick={()=>open(report.id)}>Open plan</button></article>)}</div></section>
}
