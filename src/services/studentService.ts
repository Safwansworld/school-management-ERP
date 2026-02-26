import { supabase } from '../lib/supabase'
import { Student, StudentFilters } from '../types/Student'

export class StudentService {
  // Create student
  static async createStudent(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .insert(student)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Get all students with filters
  static async getStudents(filters: StudentFilters, page = 1, limit = 10): Promise<{ students: Student[], total: number }> {
    let query = supabase
      .from('students')
      .select('*', { count: 'exact' })

    // Apply filters
    if (filters.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,admission_number.ilike.%${filters.search}%,roll_number.ilike.%${filters.search}%`)
    }
    
    if (filters.class_filter) {
      query = query.eq('class_name', filters.class_filter)
    }
    
    if (filters.section_filter) {
      query = query.eq('section', filters.section_filter)
    }
    
    if (filters.gender_filter) {
      query = query.eq('gender', filters.gender_filter)
    }
    
    if (filters.admission_year_filter) {
      query = query.eq('admission_year', filters.admission_year_filter)
    }
    
    if (filters.status_filter) {
      query = query.eq('status', filters.status_filter)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      students: data || [],
      total: count || 0
    }
  }

  // Update student
  static async updateStudent(id: string, student: Partial<Student>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .update(student)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Delete student
  static async deleteStudent(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Upload profile picture
  static async uploadProfilePicture(file: File, studentId: string): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${studentId}-${Date.now()}.${fileExt}`
    const filePath = `profiles/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('student-profiles')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('student-profiles')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  // Export to CSV
  static async exportToCSV(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}
