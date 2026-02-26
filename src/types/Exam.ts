// types/exam.ts - Updated to match your actual database structure
export interface Subject {
  id: string;
  subject_name: string;  // Changed from 'name' to 'subject_name'
  subject_code: string;  // Changed from 'code' to 'subject_code'
  description?: string;
  class_level: string;
  credits: number;
  is_mandatory: boolean;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  cover_image_url?: string;
}

export interface Class {
  id: string;
  class_name: string;
  section: string;
  academic_year: string;
  capacity: number;
  current_strength: number;
  class_teacher_id?: string;
  status: 'active' | 'inactive';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ExamSchedule {
  id: string;
  subject_id: string;
  class_id: string;
  exam_name: string;
  exam_type: 'written' | 'oral' | 'practical' | 'project';
  exam_date: string;
  start_time: string;
  end_time: string;
  duration_minutes?: number;
  room_number?: string;
  max_marks: number;
  passing_marks: number;
  instructions?: string;
  syllabus_coverage?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  created_by?: string;
  created_at: string;
  updated_at: string;
  subjects?: Subject;
  classes?: Class;
}

export interface ExamFormData {
  subject_id: string;
  class_id: string;
  exam_name: string;
  exam_type: 'written' | 'oral' | 'practical' | 'project';
  exam_date: string;
  start_time: string;
  end_time: string;
  room_number: string;
  max_marks: number;
  passing_marks: number;
  instructions: string;
  syllabus_coverage: string;
}

export interface ExamFormErrors {
  subject_id?: string;
  class_id?: string;
  exam_name?: string;
  exam_type?: string;
  exam_date?: string;
  start_time?: string;
  end_time?: string;
  room_number?: string;
  max_marks?: string;
  passing_marks?: string;
  instructions?: string;
  syllabus_coverage?: string;
}
