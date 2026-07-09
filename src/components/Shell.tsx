import type { ReactNode } from 'react'
import { appMode } from '../config/appMode'

export type PageId = 'home'|'workspace'|'community'|'agents'|'workflows'|'approvals'|'reports'|'settings'
const productionNav: {id:PageId; label:string; icon:string}[] = [
  {id:'home',label:'Command Center',icon:'⌂'},
  {id:'workflows',label:'Workflows',icon:'↗'},
  {id:'reports',label:'Reports',icon:'▤'},
  {id:'approvals',label:'Approvals',icon:'✓'},
  {id:'workspace',label:'Projects',icon:'▦'},
  {id:'settings',label:'Settings',icon:'⚙'}
]
const prototypeNav: {id:PageId; label:string; icon:string}[] = [
  {id:'home',label:'Command Center',icon:'⌂'},{id:'workspace',label:'Projects',icon:'▦'},{id:'community',label:'Community',icon:'♡'},{id:'agents',label:'Agents',icon:'◎'},{id:'workflows',label:'Workflows',icon:'↗'},
  {id:'approvals',label:'Approvals',icon:'✓'},{id:'reports',label:'Reports',icon:'▤'},{id:'settings',label:'Settings',icon:'⚙'}
]
export function Shell({ page, setPage, pending, children }:{page:PageId; setPage:(p:PageId)=>void; pending:number; children:ReactNode}) {
  return <div className="app-shell">
    <aside className="sidebar">
      <button className="brand" onClick={()=>setPage('home')}><span className="brand-mark">S</span><span><b>SmallBiz Agent</b><small>Build · launch · automate</small></span></button>
      <nav>{(appMode.allowsDemoData?prototypeNav:productionNav).map(item=><button key={item.id} className={page===item.id?'active':''} onClick={()=>setPage(item.id)}><span>{item.icon}</span><em>{item.label}</em>{item.id==='approvals'&&pending>0&&<i>{pending}</i>}</button>)}</nav>
      <div className="local-mode"><span className="pulse"/><div><b>{appMode.label}</b><small>Local preview only</small></div></div>
    </aside>
    <main><header className="app-topbar"><label><span>⌕</span><input aria-label="Search" placeholder="Search your projects and saved work…" /></label><button className="topbar-bell" aria-label="Notifications">♢{pending>0&&<i>{pending}</i>}</button><button className="topbar-profile" onClick={()=>setPage('settings')}><span>P</span><b>My profile</b></button></header>{children}</main>
    <nav className="mobile-nav">
      <button aria-label="Home" className={page==='home'?'active':''} onClick={()=>setPage('home')}><span>⌂</span><small>Home</small></button>
      <button aria-label="Projects" className={page==='workspace'?'active':''} onClick={()=>setPage('workspace')}><span>▦</span><small>Projects</small></button>
      <button aria-label="Create" className="mobile-create" onClick={()=>setPage('workflows')}><span>＋</span><small>Create</small></button>
      <button aria-label="Reports" className={page==='reports'?'active':''} onClick={()=>setPage('reports')}><span>▤</span><small>Reports</small></button>
      <button aria-label="More" className={['approvals','settings'].includes(page)?'active':''} onClick={()=>setPage('settings')}><span>☰</span><small>More</small>{pending>0&&<i>{pending}</i>}</button>
    </nav>
  </div>
}
