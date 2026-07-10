export function localDateKey(value:Date|string|undefined|null=new Date()):string{
 const date=value instanceof Date?value:new Date(value||Date.now())
 if(Number.isNaN(date.getTime()))return localDateKey(new Date())
 const year=date.getFullYear();const month=String(date.getMonth()+1).padStart(2,'0');const day=String(date.getDate()).padStart(2,'0')
 return `${year}-${month}-${day}`
}
export function isSameLocalDate(value:string|undefined,localDate=localDateKey()):boolean{return !!value&&localDateKey(value)===localDate}
export function safeTime(value?:string):number{const time=value?new Date(value).getTime():0;return Number.isFinite(time)?time:0}
