import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

interface User {
  id: number
  name: string
  email: string
  password: string
  createdAt: string
}

interface AuthSession {
  token: string
  userId: number
  email: string
  expiresAt: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(() => {
    if (globalThis.window === undefined) return null
    const raw = localStorage.getItem('currentUser')
    if (!raw) return null
    const session: AuthSession = JSON.parse(raw)
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem('currentUser')
      return null
    }
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')
    return users.find(u => u.id === session.userId) || null
  })

  const register = useCallback(async (name: string, email: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.some(u => u.email === email)) {
      throw new Error('Email já cadastrado')
    }
    const newUser: User = {
      id: Date.now(),
      name,
      email,
      password,
      createdAt: new Date().toISOString().split('T')[0],
    }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Email ou senha incorretos')

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    const session: AuthSession = {
      token: `token-${found.id}-${Date.now()}`,
      userId: found.id,
      email: found.email,
      expiresAt,
    }
    localStorage.setItem('currentUser', JSON.stringify(session))
    setUser(found)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('currentUser')
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) return
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')
    const idx = users.findIndex(u => u.id === user.id)
    if (idx === -1) return
    const updated = { ...users[idx], ...updates }
    users[idx] = updated
    localStorage.setItem('users', JSON.stringify(users))
    setUser(updated)
  }, [user])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, login, register, logout, updateProfile],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}