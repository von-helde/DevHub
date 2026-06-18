/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Project } from '../types/project'

interface ProjectContextType {
  projects: Project[]
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  getProjectsByUser: (userId: number) => Project[]
}

const ProjectContext = createContext<ProjectContextType | null>(null)

export function ProjectProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [projects, setProjects] = useState<Project[]>(() => {
    return JSON.parse(localStorage.getItem('projects') || '[]')
  })

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects))
  }, [projects])

  const addProject = (project: Project) => {
    setProjects(prev => [project, ...prev])
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)))
  }

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const getProjectsByUser = useCallback((userId: number) => {
    return projects
      .filter(p => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [projects])

  const value = useMemo(
    () => ({ projects, addProject, updateProject, deleteProject, getProjectsByUser }),
    [projects, getProjectsByUser]
  )

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProjects must be used within ProjectProvider')
  return ctx
};