import { supabase } from '../lib/supabase';
import { Achievement, Student, AchievementFormData, PaginationData, AchievementStats } from '../types/achievements';

const ITEMS_PER_PAGE = 10;
const BUCKET_NAME = 'achievements-certificates';

// ==================== FETCH FUNCTIONS ====================

/**
 * Fetch all unique academic years from class_assignments
 * Used for first dropdown
 */
export async function fetchAcademicYears(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('class_assignments')
      .select('academic_year')
      .not('academic_year', 'is', null)
      .order('academic_year', { ascending: false });

    if (error) throw error;

    // Remove duplicates and return
    const uniqueYears = [...new Set(data?.map(d => d.academic_year) || [])];
    return uniqueYears;
  } catch (error) {
    console.error('Error fetching academic years:', error);
    return [];
  }
}

/**
 * Fetch classes for selected academic year from class_assignments
 * Used for second dropdown
 */
export async function fetchClassesByAcademicYear(academicYear: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('class_assignments')
      .select('class_name')
      .eq('academic_year', academicYear)
      .not('class_name', 'is', null)
      .order('class_name', { ascending: true });

    if (error) throw error;

    // Remove duplicates
    const uniqueClasses = [...new Set(data?.map(d => d.class_name) || [])];
    return uniqueClasses;
  } catch (error) {
    console.error('Error fetching classes:', error);
    return [];
  }
}

/**
 * Fetch students for selected academic year and class
 * Used for third dropdown
 */
export async function fetchStudentsByAcademicYearAndClass(
  academicYear: string,
  className: string
): Promise<Student[]> {
  try {
    const { data, error } = await supabase
      .from('class_assignments')
      .select('student_id, student_name, class_name')
      .eq('academic_year', academicYear)
      .eq('class_name', className)
      .not('student_name', 'is', null)
      .order('student_name', { ascending: true });

    if (error) throw error;

    // Remove duplicates by student_id
    const uniqueStudents = data?.reduce((acc: Student[], current) => {
      const exists = acc.find(s => s.student_id === current.student_id);
      return exists ? acc : [...acc, current];
    }, []) || [];

    return uniqueStudents;
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}

/**
 * Fetch all achievements with pagination and filters
 */
export async function fetchAchievements(
  page: number = 1,
  filters: {
    academicYear?: string;
    achievementType?: string;
    studentName?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  } = {}
): Promise<PaginationData> {
  try {
    let query = supabase
      .from('achievements')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.academicYear) {
      query = query.eq('academic_year', filters.academicYear);
    }
    if (filters.achievementType) {
      query = query.eq('achievement_type', filters.achievementType);
    }
    if (filters.studentName) {
      query = query.ilike('student_name', `%${filters.studentName}%`);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.startDate) {
      query = query.gte('date_achieved', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('date_achieved', filters.endDate);
    }

    // Pagination
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE - 1;

    const { data, error, count } = await query
      .order('date_achieved', { ascending: false })
      .range(start, end);

    if (error) throw error;

    const totalCount = count || 0;
    const hasMore = start + ITEMS_PER_PAGE < totalCount;

    return {
      data: data || [],
      count: totalCount,
      hasMore,
    };
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return { data: [], count: 0, hasMore: false };
  }
}

/**
 * Fetch achievements for a specific student
 */
export async function fetchStudentAchievements(studentId: string): Promise<Achievement[]> {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('student_id', studentId)
      .eq('status', 'approved')
      .order('date_achieved', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching student achievements:', error);
    return [];
  }
}

/**
 * Calculate achievement statistics
 */
export async function fetchAchievementStats(): Promise<AchievementStats> {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*');

    if (error) throw error;

    const achievements = data || [];
    const stats: AchievementStats = {
      total: achievements.length,
      approved: achievements.filter(a => a.status === 'approved').length,
      pending: achievements.filter(a => a.status === 'pending').length,
      rejected: achievements.filter(a => a.status === 'rejected').length,
      byType: {},
    };

    // Count by type
    achievements.forEach(a => {
      stats.byType[a.achievement_type] = (stats.byType[a.achievement_type] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error fetching achievement stats:', error);
    return { total: 0, approved: 0, pending: 0, rejected: 0, byType: {} };
  }
}

// ==================== CREATE FUNCTIONS ====================

/**
 * Upload file to Supabase storage
 */
export async function uploadFile(file: File, studentId: string, fileType: 'certificate' | 'attachment'): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${studentId}/${fileType}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    return data?.publicUrl || '';
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Add new achievement
 */
export async function addAchievement(
  formData: AchievementFormData,
  certificateFile?: File,
  attachmentFile?: File
): Promise<Achievement | null> {
  try {
    let certificateUrl: string | null = null;
    let attachmentUrl: string | null = null;

    // Upload certificate
    if (certificateFile) {
      certificateUrl = await uploadFile(certificateFile, formData.student_id, 'certificate');
    }

    // Upload attachment
    if (attachmentFile) {
      attachmentUrl = await uploadFile(attachmentFile, formData.student_id, 'attachment');
    }

    // Insert achievement
    const { data, error } = await supabase
      .from('achievements')
      .insert({
        student_id: formData.student_id,
        student_name: formData.student_name,
        achievement_type: formData.achievement_type,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date_achieved: formData.date_achieved,
        awarded_by: formData.awarded_by,
        academic_year: formData.academic_year,
        points: formData.points,
        certificate_url: certificateUrl,
        attachment_url: attachmentUrl,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding achievement:', error);
    throw error;
  }
}

// ==================== UPDATE FUNCTIONS ====================

/**
 * Update achievement
 */
/**
 * Update achievement with proper type casting
 */
export async function updateAchievement(
  id: string,
  updates: AchievementFormData | Partial<Achievement>,
  certificateFile?: File,
  attachmentFile?: File
): Promise<Achievement | null> {
  try {
    // Type-cast achievement_type to ensure proper typing
    let updateData: Partial<Achievement> = {
      ...updates,
      achievement_type: (updates.achievement_type as Achievement['achievement_type']) || undefined,
    };

    // Upload new certificate if provided
    if (certificateFile) {
      const certificateUrl = await uploadFile(
        certificateFile,
        updates.student_id || '',
        'certificate'
      );
      updateData.certificate_url = certificateUrl;
    }

    // Upload new attachment if provided
    if (attachmentFile) {
      const attachmentUrl = await uploadFile(
        attachmentFile,
        updates.student_id || '',
        'attachment'
      );
      updateData.attachment_url = attachmentUrl;
    }

    const { data, error } = await supabase
      .from('achievements')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating achievement:', error);
    throw error;
  }
}

/**
 * Approve achievement
 */
export async function approveAchievement(id: string): Promise<Achievement | null> {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .update({ status: 'approved' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error approving achievement:', error);
    throw error;
  }
}

/**
 * Reject achievement
 */
export async function rejectAchievement(id: string): Promise<Achievement | null> {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .update({ status: 'rejected' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error rejecting achievement:', error);
    throw error;
  }
}

// ==================== DELETE FUNCTIONS ====================

/**
 * Delete file from storage
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    const fileName = fileUrl.split('/').pop();
    if (fileName) {
      await supabase.storage.from(BUCKET_NAME).remove([fileName]);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

/**
 * Delete achievement
 */
export async function deleteAchievement(id: string): Promise<void> {
  try {
    // Fetch achievement to get file URLs
    const { data: achievement } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', id)
      .single();

    // Delete files
    if (achievement?.certificate_url) {
      await deleteFile(achievement.certificate_url);
    }
    if (achievement?.attachment_url) {
      await deleteFile(achievement.attachment_url);
    }

    // Delete record
    const { error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting achievement:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time achievement updates
 */
export function subscribeToAchievements(callback: (payload: any) => void) {
  const channel = supabase
    .channel('achievements_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'achievements',
      },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
