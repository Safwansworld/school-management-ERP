import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For admin operations (use only on backend/server)
export const getSupabaseAdmin = () => {
  const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('Service role key not available')
  }
  return createClient(supabaseUrl, serviceRoleKey)
}


export interface Project {
  id: string;
  project_id: string;
  title: string;
  description: string;
  subject: string;
  sdg_goal: string;
  due_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
}

export interface ProjectAssignment {
  id: string;
  project_id: string;
  student_id?: string;
  class_id?: string;
  assigned_at: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'needs_revision' | 'completed' | 'late';
  submission_date?: string;
}

export interface ProjectSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  submission_text?: string;
  file_urls?: string[];
  submitted_at: string;
  grade?: number;
  feedback?: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

export interface GradingCriteria {
  id: string;
  project_id: string;
  criteria_name: string;
  weight: number;
  max_points: number;
  description?: string;
}

export interface ProjectResource {
  id: string;
  project_id: string;
  resource_type: 'file' | 'link';
  resource_name: string;
  resource_url: string;
  uploaded_at: string;
}

export interface ActivityLog {
  id: string;
  project_id?: string;
  assignment_id?: string;
  user_id: string;
  activity_type: 'created' | 'assigned' | 'submitted' | 'reviewed' | 'status_changed';
  activity_description: string;
  created_at: string;
}