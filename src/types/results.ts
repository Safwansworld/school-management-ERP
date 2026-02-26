// types/results.ts
export interface ExamResult {
  id: string;
  exam_id: string;
  student_id: string;
  marks_obtained: number;
  grade: string;
  percentage: number;
  status: 'pass' | 'fail' | 'absent' | 'pending';
  remarks?: string;
  evaluated_by?: string;
  evaluated_at?: string;
  created_at: string;
  updated_at: string;
  exam_schedules?: {
    exam_name: string;
    exam_date: string;
    max_marks: number;
    subjects: {
      subject_name: string;
      subject_code: string;
    };
  };
  students?: {
    full_name:string,
    roll_number: string;
    profile_picture?: string
  };
}

export interface StudentReport {
  id: string;
  student_id: string;
  class_id: string;
  academic_year: string;
  term: 'mid_term' | 'final' | 'annual';
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  grade: string;
  rank_in_class?: number;
  attendance_percentage?: number;
  remarks?: string;
  status: 'draft' | 'published' | 'archived';
  generated_by?: string;
  generated_at: string;
  created_at: string;
  updated_at: string;
  students?: {
    full_name: string;
    roll_number: string;
  };
  classes?: {
    class_name: string;
    section: string;
    academic_year: string;
  };
}

export interface GradeScale {
  id: string;
  grade: string;
  min_percentage: number;
  max_percentage: number;
  description: string;
  grade_points: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface ResultFormData {
  exam_id: string;
  student_id: string;
  marks_obtained: number;
  remarks?: string;
}

export interface Student {
  id: string;
  full_name:string;
  roll_number: string;
  class_id: string;
  status: string;
  profile_picture?:string;
}
