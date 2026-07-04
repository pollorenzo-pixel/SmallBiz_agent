import type { ExecutionResult, ToolExecutionLog } from '../../types'

const RESULTS='smallbiz.executionResults';const LOGS='smallbiz.toolExecutionLogs'
function readArray<T>(key:string):T[]{try{const raw=localStorage.getItem(key);if(!raw)return[];const value:unknown=JSON.parse(raw);if(Array.isArray(value))return value as T[];localStorage.removeItem(key)}catch{try{localStorage.removeItem(key)}catch{/* unavailable */}}return[]}
function write<T>(key:string,value:T[]){try{localStorage.setItem(key,JSON.stringify(value))}catch{/* unavailable */}}
export function getExecutionResults(){return readArray<ExecutionResult>(RESULTS)}
export function saveExecutionResult(result:ExecutionResult){write(RESULTS,[result,...getExecutionResults()].slice(0,200));return result}
export function getToolExecutionLogs(){return readArray<ToolExecutionLog>(LOGS)}
export function saveToolExecutionLogs(logs:ToolExecutionLog[]){write(LOGS,[...logs,...getToolExecutionLogs()].slice(0,500));return logs}
export function clearExecutionHistory(){write(RESULTS,[]);write(LOGS,[])}
