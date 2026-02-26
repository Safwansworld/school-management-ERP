export interface Achievement {
  id: string;
  student_id: string;
  student_name: string;
  achievement_type: 'academic' | 'sports' | 'cultural' | 'behavior' | 'attendance' | 'leadership' | 'innovation' | 'arts';
  title: string;
  description: string | null;
  category: string | null;
  date_achieved: string;
  awarded_by: string | null;
  academic_year: string;
  points: number;
  certificate_url: string | null;
  attachment_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Student {
  student_id: string;
  student_name: string;
  class_name: string;
}

// Use union type matching Achievement
export interface AchievementFormData {
  student_id: string;
  student_name: string;
  achievement_type: 'academic' | 'sports' | 'cultural' | 'behavior' | 'attendance' | 'leadership' | 'innovation' | 'arts';
  title: string;
  description: string;
  category: string;
  date_achieved: string;
  awarded_by: string;
  academic_year: string;
  points: number;
}

export interface AchievementStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  byType: Record<string, number>;
}

export interface PaginationData {
  data: Achievement[];
  count: number;
  hasMore: boolean;
}

// Helper type for form state with optional fields
export type AchievementFormDataInput = Omit<AchievementFormData, 'achievement_type'> & {
  achievement_type: string;
};
