// import { supabase } from '../lib/supabase';

// export interface Assignment {
//   id: string;
//   title: string;
//   description: string;
//   subject: string;
//   class_id: string;
//   class_name: string;
//   academic_year: string;
//   teacher_id: string;
//   teacher_name: string;
//   due_date: string;
//   total_marks: number;
//   attachment_url?: string;
//   status: 'active' | 'closed' | 'draft';
//   created_at: string;
//   updated_at: string;
// }

// export interface AssignmentSubmission {
//   id: string;
//   assignment_id: string;
//   student_id: string;
//   student_profile_id: string;
//   student_name: string;
//   submission_text?: string;
//   attachment_url?: string;
//   submitted_at: string;
//   marks_obtained?: number;
//   feedback?: string;
//   reviewed_at?: string;
//   reviewed_by?: string;
//   status: 'submitted' | 'reviewed' | 'late';
// }

// export interface AssignmentWithStats extends Assignment {
//   total_students: number;
//   submitted_count: number;
//   submission_percentage: number;
// }

// class AssignmentService {
//   // Create new assignment - FIXED
//   async createAssignment(data: {
//     title: string;
//     description: string;
//     subject: string;
//     class_id: string;
//     academic_year: string;
//     due_date: string;
//     total_marks: number;
//     attachment_url?: string;
//   }) {
//     try {
//       // Get current user profile
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error('Not authenticated');

//       const { data: profile, error: profileError } = await supabase
//         .from('user_profiles')
//         .select('first_name, last_name')
//         .eq('id', user.id)
//         .single();

//       if (profileError) throw profileError;

//       // Get class name from class_assignments table
//       const { data: classData, error: classError } = await supabase
//         .from('class_assignments')
//         .select('class_name')
//         .eq('class_id', data.class_id)
//         .eq('academic_year', data.academic_year)
//         .limit(1)
//         .single();

//       if (classError) {
//         console.error('Error fetching class name:', classError);
//         throw new Error('Could not find class information for this academic year');
//       }

//       const { data: assignment, error } = await supabase
//         .from('assignments')
//         .insert({
//           ...data,
//           teacher_id: user.id,
//           teacher_name: `${profile.first_name} ${profile.last_name}`,
//           class_name: classData.class_name,
//         })
//         .select()
//         .single();

//       if (error) throw error;
//       return assignment;
//     } catch (error: any) {
//       console.error('Error creating assignment:', error);
//       throw error;
//     }
//   }

//   // Get unique academic years from class_assignments
//   async getAcademicYears(): Promise<string[]> {
//     try {
//       const { data, error } = await supabase
//         .from('class_assignments')
//         .select('academic_year')
//         .order('academic_year', { ascending: false });

//       if (error) throw error;

//       // Get unique academic years
//       const uniqueYears = [...new Set(data.map(item => item.academic_year))];
//       return uniqueYears;
//     } catch (error: any) {
//       console.error('Error fetching academic years:', error);
//       throw error;
//     }
//   }

//   // Get unique class names from class_assignments for a specific academic year
//   async getClassNamesForYear(academicYear?: string): Promise<Array<{ class_id: string; class_name: string }>> {
//     try {
//       let query = supabase
//         .from('class_assignments')
//         .select('class_id, class_name');

//       // Filter by academic year if provided
//       if (academicYear) {
//         query = query.eq('academic_year', academicYear);
//       }

//       const { data, error } = await query.order('class_name');

//       if (error) throw error;

//       // Get unique class names with their IDs
//       const uniqueClasses = data.reduce((acc: Array<{ class_id: string; class_name: string }>, curr) => {
//         if (!acc.find(item => item.class_name === curr.class_name)) {
//           acc.push({ class_id: curr.class_id, class_name: curr.class_name });
//         }
//         return acc;
//       }, []);

//       return uniqueClasses;
//     } catch (error: any) {
//       console.error('Error fetching class names:', error);
//       throw error;
//     }
//   }

//   // Get assignments for teacher
//   async getTeacherAssignments(teacherId: string): Promise<AssignmentWithStats[]> {
//     try {
//       const { data: assignments, error } = await supabase
//         .from('assignments')
//         .select('*')
//         .eq('teacher_id', teacherId)
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       // Get stats for each assignment
//       const assignmentsWithStats = await Promise.all(
//         assignments.map(async (assignment) => {
//           // Get total students in class for this academic year
//           const { count: totalStudents } = await supabase
//             .from('class_assignments')
//             .select('*', { count: 'exact', head: true })
//             .eq('class_id', assignment.class_id)
//             .eq('academic_year', assignment.academic_year);

//           // Get submission count
//           const { count: submittedCount } = await supabase
//             .from('assignment_submissions')
//             .select('*', { count: 'exact', head: true })
//             .eq('assignment_id', assignment.id);

//           const total = totalStudents || 0;
//           const submitted = submittedCount || 0;

//           return {
//             ...assignment,
//             total_students: total,
//             submitted_count: submitted,
//             submission_percentage: total > 0 ? (submitted / total) * 100 : 0,
//           };
//         })
//       );

//       return assignmentsWithStats;
//     } catch (error: any) {
//       console.error('Error fetching teacher assignments:', error);
//       throw error;
//     }
//   }

//   // Get assignments for student
//   async getStudentAssignments(studentProfileId: string): Promise<any[]> {
//     try {
//       // Get student's class assignments
//       const { data: studentData, error: studentError } = await supabase
//         .from('student_profiles')
//         .select('student_id, class_name')
//         .eq('id', studentProfileId)
//         .single();

//       if (studentError) throw studentError;

//       // Get class assignment to find class_id and academic_year
//       const { data: classAssignment, error: classError } = await supabase
//         .from('class_assignments')
//         .select('class_id, academic_year')
//         .eq('student_id', studentData.student_id)
//         .order('assigned_at', { ascending: false })
//         .limit(1)
//         .single();

//       if (classError) throw classError;

//       // Get all assignments for this class and academic year
//       const { data: assignments, error } = await supabase
//         .from('assignments')
//         .select('*')
//         .eq('class_id', classAssignment.class_id)
//         .eq('academic_year', classAssignment.academic_year)
//         .eq('status', 'active')
//         .order('due_date', { ascending: true });

//       if (error) throw error;

//       // Check submission status for each assignment
//       const assignmentsWithSubmission = await Promise.all(
//         assignments.map(async (assignment) => {
//           const { data: submission } = await supabase
//             .from('assignment_submissions')
//             .select('*')
//             .eq('assignment_id', assignment.id)
//             .eq('student_profile_id', studentProfileId)
//             .maybeSingle();

//           return {
//             ...assignment,
//             submission,
//             has_submitted: !!submission,
//           };
//         })
//       );

//       return assignmentsWithSubmission;
//     } catch (error: any) {
//       console.error('Error fetching student assignments:', error);
//       throw error;
//     }
//   }

//   // Submit assignment
//   async submitAssignment(data: {
//     assignment_id: string;
//     submission_text?: string;
//     attachment_url?: string;
//   }) {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error('Not authenticated');

//       // Get student profile and student_id
//       const { data: studentProfile, error: profileError } = await supabase
//         .from('student_profiles')
//         .select('student_id, full_name')
//         .eq('id', user.id)
//         .single();

//       if (profileError) throw profileError;

//       // Check if already submitted
//       const { data: existing } = await supabase
//         .from('assignment_submissions')
//         .select('id')
//         .eq('assignment_id', data.assignment_id)
//         .eq('student_profile_id', user.id)
//         .maybeSingle();

//       if (existing) {
//         // Update existing submission
//         const { data: updated, error } = await supabase
//           .from('assignment_submissions')
//           .update({
//             submission_text: data.submission_text,
//             attachment_url: data.attachment_url,
//             submitted_at: new Date().toISOString(),
//           })
//           .eq('id', existing.id)
//           .select()
//           .single();

//         if (error) throw error;
//         return updated;
//       }

//       // Create new submission
//       const { data: submission, error } = await supabase
//         .from('assignment_submissions')
//         .insert({
//           assignment_id: data.assignment_id,
//           student_id: studentProfile.student_id,
//           student_profile_id: user.id,
//           student_name: studentProfile.full_name,
//           submission_text: data.submission_text,
//           attachment_url: data.attachment_url,
//         })
//         .select()
//         .single();

//       if (error) throw error;
//       return submission;
//     } catch (error: any) {
//       console.error('Error submitting assignment:', error);
//       throw error;
//     }
//   }

//   // Get submissions for an assignment
//   async getAssignmentSubmissions(assignmentId: string) {
//     try {
//       const { data, error } = await supabase
//         .from('assignment_submissions')
//         .select('*')
//         .eq('assignment_id', assignmentId)
//         .order('submitted_at', { ascending: false });

//       if (error) throw error;
//       return data;
//     } catch (error: any) {
//       console.error('Error fetching submissions:', error);
//       throw error;
//     }
//   }

//   // Review submission (teacher)
//   async reviewSubmission(submissionId: string, marks: number, feedback: string) {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error('Not authenticated');

//       const { data, error } = await supabase
//         .from('assignment_submissions')
//         .update({
//           marks_obtained: marks,
//           feedback,
//           reviewed_at: new Date().toISOString(),
//           reviewed_by: user.id,
//           status: 'reviewed',
//         })
//         .eq('id', submissionId)
//         .select()
//         .single();

//       if (error) throw error;
//       return data;
//     } catch (error: any) {
//       console.error('Error reviewing submission:', error);
//       throw error;
//     }
//   }
// }

// export const assignmentService = new AssignmentService();
import { supabase } from '../lib/supabase';

// Add these interfaces at the top
export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  class_id: string;
  class_name: string;
  academic_year: string;
  teacher_id: string;
  teacher_name: string;
  due_date: string;
  total_marks: number;
  attachment_url?: string;
  status: 'active' | 'closed' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  student_profile_id: string;
  student_name: string;
  submission_text?: string;
  attachment_url?: string;
  submitted_at: string;
  marks_obtained?: number;
  feedback?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  status: 'submitted' | 'reviewed' | 'late';
}

export interface AssignmentWithStats extends Assignment {
  total_students: number;
  submitted_count: number;
  submission_percentage: number;
}

class AssignmentService {
  // Upload file to Supabase Storage
  async uploadFile(file: File, type: 'assignment' | 'submission'): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from('assignments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('assignments')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Delete file from Supabase Storage
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(pathParts.indexOf('assignments') + 1).join('/');

      const { error } = await supabase.storage
        .from('assignments')
        .remove([filePath]);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error deleting file:', error);
      // Don't throw error, just log it
    }
  }

  // Create new assignment
  async createAssignment(data: {
    title: string;
    description: string;
    subject: string;
    class_id: string;
    academic_year: string;
    due_date: string;
    total_marks: number;
    attachment_url?: string;
  }) {
    try {
      // Get current user profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Get class name from class_assignments table
      const { data: classData, error: classError } = await supabase
        .from('class_assignments')
        .select('class_name')
        .eq('class_id', data.class_id)
        .eq('academic_year', data.academic_year)
        .limit(1)
        .single();

      if (classError) {
        console.error('Error fetching class name:', classError);
        throw new Error('Could not find class information for this academic year');
      }

      const { data: assignment, error } = await supabase
        .from('assignments')
        .insert({
          ...data,
          teacher_id: user.id,
          teacher_name: `${profile.first_name} ${profile.last_name}`,
          class_name: classData.class_name,
        })
        .select()
        .single();

      if (error) throw error;
      return assignment;
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  }

  // Get unique academic years from class_assignments
  async getAcademicYears(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('class_assignments')
        .select('academic_year')
        .order('academic_year', { ascending: false });

      if (error) throw error;

      const uniqueYears = [...new Set(data.map(item => item.academic_year))];
      return uniqueYears;
    } catch (error: any) {
      console.error('Error fetching academic years:', error);
      throw error;
    }
  }

  // Get unique class names from class_assignments for a specific academic year
  async getClassNamesForYear(academicYear?: string): Promise<Array<{ class_id: string; class_name: string }>> {
    try {
      let query = supabase
        .from('class_assignments')
        .select('class_id, class_name');

      if (academicYear) {
        query = query.eq('academic_year', academicYear);
      }

      const { data, error } = await query.order('class_name');

      if (error) throw error;

      const uniqueClasses = data.reduce((acc: Array<{ class_id: string; class_name: string }>, curr) => {
        if (!acc.find(item => item.class_name === curr.class_name)) {
          acc.push({ class_id: curr.class_id, class_name: curr.class_name });
        }
        return acc;
      }, []);

      return uniqueClasses;
    } catch (error: any) {
      console.error('Error fetching class names:', error);
      throw error;
    }
  }

  // Get assignments for teacher
  async getTeacherAssignments(teacherId: string): Promise<AssignmentWithStats[]> {
    try {
      const { data: assignments, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const assignmentsWithStats = await Promise.all(
        assignments.map(async (assignment) => {
          const { count: totalStudents } = await supabase
            .from('class_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('class_id', assignment.class_id)
            .eq('academic_year', assignment.academic_year);

          const { count: submittedCount } = await supabase
            .from('assignment_submissions')
            .select('*', { count: 'exact', head: true })
            .eq('assignment_id', assignment.id);

          const total = totalStudents || 0;
          const submitted = submittedCount || 0;

          return {
            ...assignment,
            total_students: total,
            submitted_count: submitted,
            submission_percentage: total > 0 ? (submitted / total) * 100 : 0,
          };
        })
      );

      return assignmentsWithStats;
    } catch (error: any) {
      console.error('Error fetching teacher assignments:', error);
      throw error;
    }
  }

  // Get assignments for student
  async getStudentAssignments(studentProfileId: string): Promise<any[]> {
    try {
      const { data: studentData, error: studentError } = await supabase
        .from('student_profiles')
        .select('student_id, class_name')
        .eq('id', studentProfileId)
        .single();

      if (studentError) throw studentError;

      const { data: classAssignment, error: classError } = await supabase
        .from('class_assignments')
        .select('class_id, academic_year')
        .eq('student_id', studentData.student_id)
        .order('assigned_at', { ascending: false })
        .limit(1)
        .single();

      if (classError) throw classError;

      const { data: assignments, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('class_id', classAssignment.class_id)
        .eq('academic_year', classAssignment.academic_year)
        .eq('status', 'active')
        .order('due_date', { ascending: true });

      if (error) throw error;

      const assignmentsWithSubmission = await Promise.all(
        assignments.map(async (assignment) => {
          const { data: submission } = await supabase
            .from('assignment_submissions')
            .select('*')
            .eq('assignment_id', assignment.id)
            .eq('student_profile_id', studentProfileId)
            .maybeSingle();

          return {
            ...assignment,
            submission,
            has_submitted: !!submission,
          };
        })
      );

      return assignmentsWithSubmission;
    } catch (error: any) {
      console.error('Error fetching student assignments:', error);
      throw error;
    }
  }

  // Submit assignment
  async submitAssignment(data: {
    assignment_id: string;
    submission_text?: string;
    attachment_url?: string;
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: studentProfile, error: profileError } = await supabase
        .from('student_profiles')
        .select('student_id, full_name')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const { data: existing } = await supabase
        .from('assignment_submissions')
        .select('id, attachment_url')
        .eq('assignment_id', data.assignment_id)
        .eq('student_profile_id', user.id)
        .maybeSingle();

      if (existing) {
        // Delete old attachment if new one is provided
        if (existing.attachment_url && data.attachment_url && existing.attachment_url !== data.attachment_url) {
          await this.deleteFile(existing.attachment_url);
        }

        const { data: updated, error } = await supabase
          .from('assignment_submissions')
          .update({
            submission_text: data.submission_text,
            attachment_url: data.attachment_url,
            submitted_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return updated;
      }

      const { data: submission, error } = await supabase
        .from('assignment_submissions')
        .insert({
          assignment_id: data.assignment_id,
          student_id: studentProfile.student_id,
          student_profile_id: user.id,
          student_name: studentProfile.full_name,
          submission_text: data.submission_text,
          attachment_url: data.attachment_url,
        })
        .select()
        .single();

      if (error) throw error;
      return submission;
    } catch (error: any) {
      console.error('Error submitting assignment:', error);
      throw error;
    }
  }

  // Get submissions for an assignment
  async getAssignmentSubmissions(assignmentId: string) {
    try {
      const { data, error } = await supabase
        .from('assignment_submissions')
        .select('*')
        .eq('assignment_id', assignmentId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      throw error;
    }
  }

  // Review submission (teacher)
  async reviewSubmission(submissionId: string, marks: number, feedback: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('assignment_submissions')
        .update({
          marks_obtained: marks,
          feedback,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          status: 'reviewed',
        })
        .eq('id', submissionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error reviewing submission:', error);
      throw error;
    }
  }
  // Get all assignments (Admin view)
async getAllAssignments(): Promise<AssignmentWithStats[]> {
  try {
    const { data: assignments, error } = await supabase
      .from('assignments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get stats for each assignment
    const assignmentsWithStats = await Promise.all(
      assignments.map(async (assignment) => {
        // Get total students in class for this academic year
        const { count: totalStudents } = await supabase
          .from('class_assignments')
          .select('*', { count: 'exact', head: true })
          .eq('class_id', assignment.class_id)
          .eq('academic_year', assignment.academic_year);

        // Get submission count
        const { count: submittedCount } = await supabase
          .from('assignment_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('assignment_id', assignment.id);

        const total = totalStudents || 0;
        const submitted = submittedCount || 0;

        return {
          ...assignment,
          total_students: total,
          submitted_count: submitted,
          submission_percentage: total > 0 ? (submitted / total) * 100 : 0,
        };
      })
    );

    return assignmentsWithStats;
  } catch (error: any) {
    console.error('Error fetching all assignments:', error);
    throw error;
  }
}

}

export const assignmentService = new AssignmentService();
