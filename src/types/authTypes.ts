export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'staff'
export type ProfileStatus = 'pending' | 'active' | 'suspended' | 'inactive'

export interface UserProfile {
  id: string
  user_id: string
  role: UserRole
  username: string
  email: string
  phone_number: string
  profile_status: ProfileStatus
  email_verified: boolean
  phone_verified: boolean
  linked_profile_id: string | null
  linked_table_name: 'students' | 'teachers' | 'staff' | null
  created_at: string
  updated_at: string
}

export interface Teacher {
  id: string
  full_name: string
  employee_id: string
  subject_specialization: string
  phone_number: string
  email: string
  address: string
  date_of_birth: string
  date_of_joining: string
  qualification: string
  experience_years: number
  salary: number
  profile_picture: string | null
  status: 'active' | 'inactive' | 'on_leave'
  gender: 'male' | 'female' | 'other'
  emergency_contact: string
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  full_name: string
  class_name: string
  roll_number: string
  admission_number: string
  profile_picture: string | null
  gender: 'male' | 'female' | 'other'
  date_of_birth: string
  address: string
  parent_name: string
  parent_contact: string
  email: string | null
  status: 'active' | 'inactive'
  admission_year: number
  section: string
  created_at: string
  updated_at: string
  class_id: string | null
}

export interface Staff {
  id: string
  full_name: string
  employee_id: string
  position: string
  department: string
  phone_number: string
  email: string
  address: string
  date_of_birth: string
  date_of_joining: string
  qualification: string
  experience_years: number
  salary: number
  profile_picture: string | null
  status: 'active' | 'inactive' | 'on_leave'
  gender: 'male' | 'female' | 'other'
  emergency_contact: string
  created_at: string
  updated_at: string
}

export interface StaffPermission {
  id: string
  staff_id: string
  permission_name: string
  created_at: string
}

export interface Parent {
  id?: string
  full_name: string
  parent_contact: string
  email?: string
  linked_student_ids: string[]
}

export interface CurrentUser extends UserProfile {
  teacher_data?: Teacher
  student_data?: Student
  staff_data?: Staff
  staff_permissions?: string[]
}

export interface AuthContextType {
  user: CurrentUser | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  
  // Auth methods
  loginWithEmail: (email: string, password: string) => Promise<void>
  loginWithUsername: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  
  // Verification methods
  verifyEmail: (token: string) => Promise<void>
  verifyPhone: (phone: string, otp: string) => Promise<void>
  resendEmailVerification: () => Promise<void>
  resendPhoneOTP: () => Promise<void>
  
  // Password management
  resetPassword: (email: string) => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
  
  // Role checks
  isAdmin: boolean
  isTeacher: boolean
  isStudent: boolean
  isParent: boolean
  isStaff: boolean
  
  // Permission checks
  hasPermission: (permission: string) => boolean
  checkPageAccess: (pageName: string) => boolean
}