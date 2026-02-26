export type UserRole = 'admin' | 'teacher' | 'student'

export interface User {
  id: string
  email: string
  username: string
  role: UserRole
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}
