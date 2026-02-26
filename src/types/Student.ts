export interface Student {
  id?: string
  full_name: string
  class_id?: string
  class_name?: string
  roll_number: string
  admission_number: string
  profile_picture?: string
  gender: 'male' | 'female' | 'other'
  date_of_birth: string
  address: string
  parent_name: string
  parent_contact: string
  parent_email?: string; 
  email?: string
  status: 'active' | 'inactive'
  admission_year: number
  section?: string
  created_at?: string
  updated_at?: string
}

export interface StudentFilters {
  search: string
  class_filter: string
  section_filter: string
  gender_filter: string
  admission_year_filter: string
  status_filter: string
}

export interface Class {
  id: string
  name: string
  section: string
}
