import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { ExamSchedule } from '../types/Exam';

export const useRoleBasedExams = () => {
  const { userProfile, user } = useAuth();
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userProfile || !user) return;
    fetchRoleBasedExams();
  }, [userProfile, user]);

  const fetchRoleBasedExams = async () => {
    try {
      setLoading(true);
      setError(null);

      const role = userProfile?.role;

      // Admin, Teacher, and Staff get all exams
      if (role === 'admin' || role === 'teacher' || role === 'staff') {
        const { data, error } = await supabase
          .from('exam_schedules')
          .select(`
            *,
            subjects!subject_id (
              subject_name,
              subject_code,
              description,
              class_level,
              credits
            ),
            classes!class_id (
              class_name,
              section,
              academic_year,
              capacity,
              current_strength
            )
          `)
          .order('exam_date', { ascending: true });

        if (error) throw error;
        setExams(data || []);
        return;
      }

      // Student: Fetch only their class exams
      if (role === 'student') {
        // Get student profile with class_id
        const { data: studentProfile, error: studentError } = await supabase
          .from('student_profiles')
          .select('class_id, id')
          .eq('id', user.id)
          .single();

        if (studentError) throw studentError;

        if (!studentProfile?.class_id) {
          setExams([]);
          return;
        }

        // Fetch exams for student's class
        const { data, error } = await supabase
          .from('exam_schedules')
          .select(`
            *,
            subjects!subject_id (
              subject_name,
              subject_code,
              description,
              class_level,
              credits
            ),
            classes!class_id (
              class_name,
              section,
              academic_year,
              capacity,
              current_strength
            )
          `)
          .eq('class_id', studentProfile.class_id)
          .order('exam_date', { ascending: true });

        if (error) throw error;
        setExams(data || []);
        return;
      }

      // Parent: Fetch exams for all linked children
      if (role === 'parent') {
        // Get all children linked to this parent
        const { data: linkedStudents, error: linkError } = await supabase
          .from('parent_student_links')
          .select('student_id')
          .eq('parent_id', user.id);

        if (linkError) throw linkError;

        if (!linkedStudents || linkedStudents.length === 0) {
          setExams([]);
          return;
        }

        const studentIds = linkedStudents.map(link => link.student_id);

        // Get class_ids for all linked students
        const { data: studentProfiles, error: profileError } = await supabase
          .from('student_profiles')
          .select('class_id')
          .in('student_id', studentIds);

        if (profileError) throw profileError;

        const classIds = studentProfiles
          ?.map(profile => profile.class_id)
          .filter((id): id is string => id !== null);

        if (!classIds || classIds.length === 0) {
          setExams([]);
          return;
        }

        // Fetch exams for all children's classes
        const { data, error } = await supabase
          .from('exam_schedules')
          .select(`
            *,
            subjects!subject_id (
              subject_name,
              subject_code,
              description,
              class_level,
              credits
            ),
            classes!class_id (
              class_name,
              section,
              academic_year,
              capacity,
              current_strength
            )
          `)
          .in('class_id', classIds)
          .order('exam_date', { ascending: true });

        if (error) throw error;
        setExams(data || []);
        return;
      }

    } catch (err: any) {
      console.error('Error fetching role-based exams:', err);
      setError(err.message || 'Failed to fetch exams');
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  return { exams, loading, error, refetch: fetchRoleBasedExams };
};
