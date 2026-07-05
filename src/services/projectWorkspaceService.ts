import type { ProjectWorkspaceProject } from '../types'
import { isRecordArray, loadLocal, saveLocal } from './storage'

const KEY = 'operator.projects'

export const projectTypes = ['Business idea','Website','App','Launch plan','Marketing campaign','Finance/admin','Research','Other'] as const
export const projectStages = ['Idea','Planning','Building','Reviewing','Launching','Active','Paused'] as const
export const projectStatuses = ['Draft','In progress','Needs review','Waiting for approval','Complete','Paused'] as const
export const projectPriorities = ['Low','Medium','High'] as const

function cleanProject(project: ProjectWorkspaceProject): ProjectWorkspaceProject {
  return {
    ...project,
    linkedOutputIds: Array.isArray(project.linkedOutputIds) ? project.linkedOutputIds : [],
    linkedApprovalIds: Array.isArray(project.linkedApprovalIds) ? project.linkedApprovalIds : [],
    notes: Array.isArray(project.notes) ? project.notes : [],
    nextActions: Array.isArray(project.nextActions) ? project.nextActions : []
  }
}

export function loadProjects(): ProjectWorkspaceProject[] {
  return loadLocal<ProjectWorkspaceProject[]>(KEY, [], isRecordArray<ProjectWorkspaceProject>).map(cleanProject)
}

export function saveProjects(projects: ProjectWorkspaceProject[]): boolean {
  return saveLocal(KEY, projects.map(cleanProject))
}
