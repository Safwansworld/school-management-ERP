import React, { useState, useEffect } from 'react'
import { useRef } from 'react';
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  XIcon,
  LoaderIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  RefreshCwIcon,
  BookOpenIcon,
  UsersIcon,
  UserCheckIcon,
  ClockIcon,
  GraduationCapIcon,
  FileDownIcon,
  FileUpIcon,
  AlertTriangleIcon,
  CalendarIcon,
  Building2Icon,
  Settings2Icon,
  ArrowRightIcon,
  UploadIcon,
  ImageIcon
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRolePermissions } from '../../hooks/useRolePermissions';

// Enhanced Types with Image Support
interface Subject {
  id?: string
  subject_name: string
  subject_code: string
  description?: string
  class_level: string
  credits: number
  is_mandatory: boolean
  status: 'active' | 'inactive'
  cover_image_url?: string  // New field for subject cover image
  created_at?: string
  updated_at?: string
}

interface Teacher {
  id: string
  full_name: string
  subject_specialization: string
  employee_id: string
  status: string
}

interface Class {
  id: string
  class_name: string
  section: string
  academic_year: string
}

interface SubjectTeacherAllocation {
  id?: string
  subject_id: string
  teacher_id: string
  class_id?: string
  academic_year: string
  hours_per_week: number
  created_at?: string
  teacher?: Teacher
  subject?: Subject
  class?: Class
}

interface TeacherWorkload {
  teacher_id: string
  teacher_name: string
  total_hours: number
  allocations: SubjectTeacherAllocation[]
}

interface ConflictData {
  teacher_conflicts: TeacherWorkload[]
  schedule_conflicts: any[]
  overload_warnings: any[]
}

interface SubjectFilters {
  search: string
  class_filter: string
  status_filter: string
  mandatory_filter: string
}

interface NotificationState {
  show: boolean
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
}

interface ConflictConfirmation {
  show: boolean
  conflicts: ConflictData
  allocation: Partial<SubjectTeacherAllocation>
}

export const Subjects = () => {

  const navigate = useNavigate()
  // State Management
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [allocations, setAllocations] = useState<SubjectTeacherAllocation[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(12)
  const {canAdd} = useRolePermissions();

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAllocationModal, setShowAllocationModal] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

  // Image upload states
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Conflict checking states
  const [conflictConfirmation, setConflictConfirmation] = useState<ConflictConfirmation>({
    show: false,
    conflicts: { teacher_conflicts: [], schedule_conflicts: [], overload_warnings: [] },
    allocation: {}
  })

  // Filter states
  const [showFilters, setShowFilters] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [filters, setFilters] = useState<SubjectFilters>({
    search: '',
    class_filter: '',
    status_filter: '',
    mandatory_filter: ''
  })

  // Form states
  const [formData, setFormData] = useState<Partial<Subject>>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Form scroll states
  const formRef = useRef<HTMLFormElement>(null);

  // Allocation form states
  const [allocationFormData, setAllocationFormData] = useState<Partial<SubjectTeacherAllocation>>({})
  const [allocationErrors, setAllocationErrors] = useState<Record<string, string>>({})

  // Notification state
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'info',
    title: '',
    message: ''
  })

  // Available academic years
  const currentYear = new Date().getFullYear()
  const academicYears = Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - 2 + i
    return `${year}-${year + 1}`
  })

  // Configuration for maximum teaching hours per week
  const MAX_WEEKLY_HOURS = 40
  const RECOMMENDED_WEEKLY_HOURS = 30

  // Show notification helper
  const showNotification = (type: NotificationState['type'], title: string, message: string) => {
    setNotification({ show: true, type, title, message })
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }))
    }, 5000)
  }

  // Image upload function
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Invalid File', 'Please select an image file.')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'File Too Large', 'Please select an image smaller than 5MB.')
      return
    }

    try {
      setUploadingImage(true)
      
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `subject-covers/${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('subject-covers')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('subject-covers')
        .getPublicUrl(filePath)

      const imageUrl = urlData.publicUrl

      // Update form data
      setFormData(prev => ({ ...prev, cover_image_url: imageUrl }))
      setPreviewImage(imageUrl)
      
      showNotification('success', 'Image Uploaded', 'Cover image uploaded successfully.')
    } catch (error: any) {
      console.error('Error uploading image:', error)
      showNotification('error', 'Upload Failed', 'Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  // Remove image function
  const removeImage = async () => {
    if (formData.cover_image_url) {
      try {
        // Extract file path from URL
        const url = formData.cover_image_url
        const pathMatch = url.match(/subject-covers\/(.+)$/)
        
        if (pathMatch) {
          const filePath = `subject-covers/${pathMatch[1]}`
          await supabase.storage.from('subject-covers').remove([filePath])
        }
      } catch (error) {
        console.error('Error removing old image:', error)
      }
    }
    
    setFormData(prev => ({ ...prev, cover_image_url: undefined }))
    setPreviewImage(null)
  }

  // Enhanced Conflict Detection Functions
  const checkTeacherConflicts = async (teacherId: string, academicYear: string, hoursPerWeek: number, excludeAllocationId?: string): Promise<ConflictData> => {
    console.log('Checking conflicts for teacher:', teacherId)

    try {
      // Get existing allocations for this teacher in the same academic year
      let query = supabase
        .from('subject_teacher_allocations')
        .select(`
          *,
          subjects!subject_teacher_allocations_subject_id_fkey(subject_name, subject_code),
          classes!subject_teacher_allocations_class_id_fkey(class_name, section)
        `)
        .eq('teacher_id', teacherId)
        .eq('academic_year', academicYear)

      if (excludeAllocationId) {
        query = query.neq('id', excludeAllocationId)
      }

      const { data: existingAllocations, error } = await query

      if (error) throw error

      // Calculate current workload
      const currentHours = existingAllocations?.reduce((total, allocation) => total + allocation.hours_per_week, 0) || 0
      const totalHours = currentHours + hoursPerWeek

      // Find conflicts
      const teacher_conflicts: TeacherWorkload[] = []
      const schedule_conflicts: any[] = []
      const overload_warnings: any[] = []

      // Check for overload
      if (totalHours > MAX_WEEKLY_HOURS) {
        overload_warnings.push({
          type: 'overload',
          teacher_id: teacherId,
          current_hours: currentHours,
          additional_hours: hoursPerWeek,
          total_hours: totalHours,
          max_hours: MAX_WEEKLY_HOURS,
          excess_hours: totalHours - MAX_WEEKLY_HOURS
        })
      } else if (totalHours > RECOMMENDED_WEEKLY_HOURS) {
        overload_warnings.push({
          type: 'high_workload',
          teacher_id: teacherId,
          current_hours: currentHours,
          additional_hours: hoursPerWeek,
          total_hours: totalHours,
          recommended_hours: RECOMMENDED_WEEKLY_HOURS
        })
      }

      // Create teacher workload summary
      const teacherData = teachers.find(t => t.id === teacherId)
      if (existingAllocations && existingAllocations.length > 0) {
        teacher_conflicts.push({
          teacher_id: teacherId,
          teacher_name: teacherData?.full_name || 'Unknown Teacher',
          total_hours: currentHours,
          allocations: existingAllocations.map(allocation => ({
            ...allocation,
            teacher: teacherData,
            subject: allocation.subjects,
            class: allocation.classes
          }))
        })
      }

      return {
        teacher_conflicts,
        schedule_conflicts,
        overload_warnings
      }

    } catch (error) {
      console.error('Error checking conflicts:', error)
      return { teacher_conflicts: [], schedule_conflicts: [], overload_warnings: [] }
    }
  }

  // Check if teacher specialization matches subject
  const checkSubjectSpecializationMatch = (teacherId: string, subjectName: string): boolean => {
    const teacher = teachers.find(t => t.id === teacherId)
    if (!teacher || !teacher.subject_specialization) return true // Allow if no specialization data

    const specialization = teacher.subject_specialization.toLowerCase()
    const subject = subjectName.toLowerCase()

    // Basic matching logic - can be enhanced
    return specialization.includes(subject) ||
      subject.includes(specialization) ||
      specialization.includes('general') ||
      specialization.includes('all subjects')
  }

  // Supabase Service Functions
  const createSubject = async (subject: Omit<Subject, 'id' | 'created_at' | 'updated_at'>): Promise<Subject> => {
    console.log('Creating subject:', subject)

    // Check for duplicate subject codes
    const { data: existingSubject } = await supabase
      .from('subjects')
      .select('id')
      .eq('subject_code', subject.subject_code)
      .single()

    if (existingSubject) {
      throw new Error(`Subject code ${subject.subject_code} already exists`)
    }

    const { data, error } = await supabase
      .from('subjects')
      .insert(subject)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log('Subject created successfully:', data)
    return data
  }

  const getSubjects = async (filters: SubjectFilters, page = 1, limit = 12) => {
    console.log('Fetching subjects from database...')

    let query = supabase
      .from('subjects')
      .select('*', { count: 'exact' })

    // Apply filters
    if (filters.search) {
      query = query.or(`subject_name.ilike.%${filters.search}%,subject_code.ilike.%${filters.search}%`)
    }

    if (filters.class_filter) {
      query = query.eq('class_level', filters.class_filter)
    }

    if (filters.status_filter) {
      query = query.eq('status', filters.status_filter)
    }

    if (filters.mandatory_filter) {
      query = query.eq('is_mandatory', filters.mandatory_filter === 'true')
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching subjects:', error)
      throw error
    }

    console.log('Fetched subjects:', data?.length, 'Total count:', count)

    return {
      subjects: data || [],
      total: count || 0
    }
  }

  const updateSubject = async (id: string, subject: Partial<Subject>): Promise<Subject> => {
    console.log('Updating subject:', id, subject)

    // Check for duplicate subject codes (excluding current subject)
    if (subject.subject_code) {
      const { data: existingSubject } = await supabase
        .from('subjects')
        .select('id')
        .eq('subject_code', subject.subject_code)
        .neq('id', id)
        .single()

      if (existingSubject) {
        throw new Error(`Subject code ${subject.subject_code} already exists`)
      }
    }

    const { data, error } = await supabase
      .from('subjects')
      .update(subject)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update error:', error)
      throw error
    }

    console.log('Subject updated successfully:', data)
    return data
  }

  const deleteSubject = async (id: string): Promise<void> => {
    console.log('Deleting subject:', id)

    // Check for existing allocations
    const { data: existingAllocations } = await supabase
      .from('subject_teacher_allocations')
      .select('id')
      .eq('subject_id', id)

    if (existingAllocations && existingAllocations.length > 0) {
      throw new Error(`Cannot delete subject: ${existingAllocations.length} teacher allocation(s) exist. Please remove allocations first.`)
    }

    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete error:', error)
      throw error
    }

    console.log('Subject deleted successfully')
  }

  // Load teachers
  const loadTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('id, full_name, subject_specialization, employee_id, status')
        .eq('status', 'active')
        .order('full_name')

      if (error) throw error
      setTeachers(data || [])
    } catch (error) {
      console.error('Error loading teachers:', error)
    }
  }

  // Load classes
  const loadClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, class_name, section, academic_year')
        .eq('status', 'active')
        .order('class_name', { ascending: true })

      if (error) throw error
      setClasses(data || [])
    } catch (error) {
      console.error('Error loading classes:', error)
    }
  }

  // Enhanced load subject allocations with conflict detection
  const loadAllocations = async () => {
    try {
      // Get allocations first
      const { data: allocationsData, error: allocationsError } = await supabase
        .from('subject_teacher_allocations')
        .select('*')
        .order('created_at', { ascending: false })

      if (allocationsError) throw allocationsError

      // Get teachers data
      const { data: teachersData, error: teachersError } = await supabase
        .from('teachers')
        .select('id, full_name, subject_specialization, employee_id')

      if (teachersError) throw teachersError

      // Get subjects data
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('id, subject_name, subject_code')

      if (subjectsError) throw subjectsError

      // Get classes data
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id, class_name, section, academic_year')

      if (classesError) throw classesError

      // Manually join the data
      const enrichedAllocations = allocationsData?.map(allocation => ({
        ...allocation,
        teacher: teachersData?.find(teacher => teacher.id === allocation.teacher_id),
        subject: subjectsData?.find(subject => subject.id === allocation.subject_id),
        class: classesData?.find(cls => cls.id === allocation.class_id)
      })) || []

      console.log('Enriched allocations:', enrichedAllocations)
      setAllocations(enrichedAllocations)
    } catch (error) {
      console.error('Error loading allocations:', error)
    }
  }

  // Load subjects with enhanced error handling
  const loadSubjects = async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      console.log('Loading subjects with filters:', filters)
      const result = await getSubjects(filters, currentPage, pageSize)
      setSubjects(result.subjects)
      setTotal(result.total)
      console.log('Subjects loaded successfully:', result.subjects.length, 'subjects')

    } catch (error) {
      console.error('Error loading subjects:', error)
      showNotification('error', 'Loading Failed', 'Failed to load subjects. Please try again.')
      setSubjects([])
      setTotal(0)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadSubjects()
    loadTeachers()
    loadClasses()
    loadAllocations()
  }, [filters, currentPage])

  // Handle image preview when editing a subject
  useEffect(() => {
    if (showEditModal && selectedSubject) {
      setFormData(selectedSubject)
      setPreviewImage(selectedSubject.cover_image_url || null)
    }
  }, [showEditModal, selectedSubject])

  // Clear preview when closing modals
  useEffect(() => {
    if (!showAddModal && !showEditModal) {
      setPreviewImage(null)
    }
  }, [showAddModal, showEditModal])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadSubjects(false)
      loadAllocations()
    }, 30000)

    return () => clearInterval(interval)
  }, [filters, currentPage])

  // Form Validation
  const validateForm = (data: Partial<Subject>): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (!data.subject_name || data.subject_name.length < 2) {
      errors.subject_name = 'Subject name must be at least 2 characters'
    }
    if (!data.subject_code || data.subject_code.length < 2) {
      errors.subject_code = 'Subject code is required'
    }
    if (!data.class_level) {
      errors.class_level = 'Class level is required'
    }
    if (!data.credits || data.credits <= 0) {
      errors.credits = 'Valid credits required'
    }

    return errors
  }

  // Enhanced validate allocation form with conflict checking
  const validateAllocationForm = async (data: Partial<SubjectTeacherAllocation>): Promise<{
    errors: Record<string, string>
    conflicts: ConflictData
  }> => {
    const errors: Record<string, string> = {}
    let conflicts: ConflictData = { teacher_conflicts: [], schedule_conflicts: [], overload_warnings: [] }

    if (!data.teacher_id) {
      errors.teacher_id = 'Teacher is required'
    }
    if (!data.academic_year) {
      errors.academic_year = 'Academic year is required'
    }
    if (!data.hours_per_week || data.hours_per_week <= 0) {
      errors.hours_per_week = 'Valid hours per week required'
    }
    if (data.hours_per_week && data.hours_per_week > 20) {
      errors.hours_per_week = 'Hours per week cannot exceed 20'
    }

    // Check conflicts if basic validation passes
    if (data.teacher_id && data.academic_year && data.hours_per_week) {
      conflicts = await checkTeacherConflicts(data.teacher_id, data.academic_year, data.hours_per_week)

      // Check specialization match
      if (selectedSubject && !checkSubjectSpecializationMatch(data.teacher_id, selectedSubject.subject_name)) {
        const teacher = teachers.find(t => t.id === data.teacher_id)
        showNotification('warning', 'Specialization Mismatch',
          `${teacher?.full_name} specializes in ${teacher?.subject_specialization}, not ${selectedSubject.subject_name}. Please confirm this allocation.`)
      }
    }

    return { errors, conflicts }
  }

  // Enhanced form submission with proper error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validateForm(formData)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      showNotification('error', 'Validation Error', 'Please fix the errors in the form.')
      return
    }

    try {
      setSubmitting(true)

      const subjectData: Omit<Subject, 'id' | 'created_at' | 'updated_at'> = {
        subject_name: formData.subject_name!,
        subject_code: formData.subject_code!.toUpperCase(),
        description: formData.description,
        class_level: formData.class_level!,
        credits: formData.credits!,
        is_mandatory: formData.is_mandatory || false,
        status: formData.status || 'active',
        cover_image_url: formData.cover_image_url
      }

      let savedSubject: Subject

      if (showEditModal && selectedSubject) {
        savedSubject = await updateSubject(selectedSubject.id!, subjectData)
        setShowEditModal(false)
        showNotification('success', 'Subject Updated', `${savedSubject.subject_name} has been updated successfully.`)
      } else {
        savedSubject = await createSubject(subjectData)
        setShowAddModal(false)
        showNotification('success', 'Subject Added', `${savedSubject.subject_name} has been added successfully.`)
      }

      console.log('Subject saved successfully:', savedSubject)

      // Reset form
      resetForm()

      // Auto-refresh after 1 second delay
      setTimeout(async () => {
        await loadSubjects(false)
        showNotification('info', 'Data Refreshed', 'Subject list has been updated.')
      }, 1000)

    } catch (error: any) {
      console.error('Error saving subject:', error)

      let errorMessage = 'An unexpected error occurred'

      if (error && typeof error === 'object') {
        if (error.message && typeof error.message === 'string') {
          errorMessage = error.message
        } else if (error.toString && typeof error.toString === 'function') {
          errorMessage = error.toString()
        } else if (error.code) {
          errorMessage = `Error code: ${error.code}`
        }
      } else if (typeof error === 'string') {
        errorMessage = error
      }

      showNotification('error', 'Save Failed', `Failed to save subject: ${errorMessage}`)

      setTimeout(() => {
        loadSubjects(false)
      }, 2000)
    } finally {
      setSubmitting(false)
    }
  }

  // Enhanced teacher allocation with conflict checking
  const handleAllocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { errors, conflicts } = await validateAllocationForm(allocationFormData)
    setAllocationErrors(errors)

    if (Object.keys(errors).length > 0) {
      showNotification('error', 'Validation Error', 'Please fix the errors in the allocation form.')
      return
    }

    // Check for conflicts
    if (conflicts.overload_warnings.length > 0 || conflicts.teacher_conflicts.length > 0) {
      setConflictConfirmation({
        show: true,
        conflicts,
        allocation: allocationFormData
      })
      return
    }

    // No conflicts, proceed with allocation
    await executeAllocation(allocationFormData)
  }

  // Execute the allocation (with or without conflicts)
  const executeAllocation = async (data: Partial<SubjectTeacherAllocation>) => {
    try {
      setSubmitting(true)

      const allocationData = {
        subject_id: selectedSubject!.id!,
        teacher_id: data.teacher_id!,
        academic_year: data.academic_year!,
        hours_per_week: data.hours_per_week!,
        class_id: data.class_id || null
      }

      const { data: result, error } = await supabase
        .from('subject_teacher_allocations')
        .insert(allocationData)
        .select()
        .single()

      if (error) throw error

      setShowAllocationModal(false)
      setConflictConfirmation({ show: false, conflicts: { teacher_conflicts: [], schedule_conflicts: [], overload_warnings: [] }, allocation: {} })

      const teacher = teachers.find(t => t.id === data.teacher_id)
      showNotification('success', 'Teacher Allocated',
        `${teacher?.full_name} has been allocated to ${selectedSubject?.subject_name} successfully.`)

      // Reset allocation form
      setAllocationFormData({})
      setAllocationErrors({})

      // Reload allocations
      setTimeout(() => {
        loadAllocations()
      }, 1000)

    } catch (error: any) {
      console.error('Error creating allocation:', error)
      showNotification('error', 'Allocation Failed', 'Failed to allocate teacher to subject.')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle conflict confirmation
  const handleConflictConfirm = (proceed: boolean) => {
    if (proceed) {
      executeAllocation(conflictConfirmation.allocation)
    } else {
      setConflictConfirmation({
        show: false,
        conflicts: { teacher_conflicts: [], schedule_conflicts: [], overload_warnings: [] },
        allocation: {}
      })
    }
  }

  // Delete confirmation with proper error handling
  const handleDeleteConfirm = async () => {
    if (selectedSubject) {
      try {
        setSubmitting(true)
        await deleteSubject(selectedSubject.id!)
        setShowDeleteModal(false)
        setSelectedSubject(null)
        showNotification('success', 'Subject Deleted', `${selectedSubject.subject_name} has been deleted successfully.`)

        setTimeout(() => {
          loadSubjects(false)
        }, 1000)

      } catch (error: any) {
        console.error('Error deleting subject:', error)

        let errorMessage = 'Unknown error occurred'

        if (error && typeof error === 'object') {
          if (error.message && typeof error.message === 'string') {
            errorMessage = error.message
          } else if (error.toString && typeof error.toString === 'function') {
            errorMessage = error.toString()
          } else if (error.code) {
            errorMessage = `Error code: ${error.code}`
          }
        } else if (typeof error === 'string') {
          errorMessage = error
        }

        showNotification('error', 'Delete Failed', `Failed to delete subject: ${errorMessage}`)
      } finally {
        setSubmitting(false)
      }
    }
  }

  // Reset form helper
  const resetForm = () => {
    setFormData({})
    setFormErrors({})
    setSelectedSubject(null)
    setPreviewImage(null)
  }

  // Handle actions
  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject)
    setFormData(subject)
    setShowEditModal(true)
  }

  const handleView = (subject: Subject) => {
    setSelectedSubject(subject)
    setShowViewModal(true)
  }

  const handleDelete = (subject: Subject) => {
    setSelectedSubject(subject)
    setShowDeleteModal(true)
  }

  const handleAllocateTeacher = (subject: Subject) => {
    setSelectedSubject(subject)
    setAllocationFormData({ academic_year: `${currentYear}-${currentYear + 1}` })
    setShowAllocationModal(true)
  }

  const handleFilterChange = (newFilters: Partial<SubjectFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setCurrentPage(1)
  }

  // Export to CSV
  const exportToCSV = async () => {
    try {
      showNotification('info', 'Exporting...', 'Preparing CSV file for download.')

      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const csvContent = [
        'Subject Name,Subject Code,Class Level,Credits,Is Mandatory,Status,Description',
        ...data.map(subject => [
          subject.subject_name,
          subject.subject_code,
          subject.class_level,
          subject.credits,
          subject.is_mandatory ? 'Yes' : 'No',
          subject.status,
          subject.description?.replace(/,/g, ';') || ''
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `subjects-${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)

      showNotification('success', 'Export Complete', 'Subject data exported successfully.')
    } catch (error) {
      console.error('Error exporting CSV:', error)
      showNotification('error', 'Export Failed', 'Failed to export subject data.')
    }
  }

  // Get subject allocations for a specific subject
  const getSubjectAllocations = (subjectId: string) => {
    return allocations.filter(allocation => allocation.subject_id === subjectId)
  }

  // Get teacher workload summary
  const getTeacherWorkload = (teacherId: string, academicYear: string) => {
    const teacherAllocations = allocations.filter(
      allocation => allocation.teacher_id === teacherId && allocation.academic_year === academicYear
    )
    const totalHours = teacherAllocations.reduce((sum, allocation) => sum + allocation.hours_per_week, 0)

    return {
      allocations: teacherAllocations,
      total_hours: totalHours,
      is_overloaded: totalHours > MAX_WEEKLY_HOURS,
      is_high_workload: totalHours > RECOMMENDED_WEEKLY_HOURS
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  //scroll function
  const scrollToTop = () => {
    if (formRef.current) {
      formRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };




return (
    <div className="min-h-screen bg-[#F6F9FC] p-3">
        <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Notification */}
            {notification.show && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-4 right-4 z-50 max-w-md w-full"
                >
                    <div className={`rounded-xl shadow-lg border-l-4 p-4 ${
                        notification.type === 'success' ? 'bg-green-50 border-green-400' :
                        notification.type === 'error' ? 'bg-red-50 border-red-400' :
                        notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                        'bg-blue-50 border-blue-400'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                                <p className="text-sm text-gray-600">{notification.message}</p>
                            </div>
                            <button
                                onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-gray-900 mb-2" style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}>
                        Subjects
                    </h1>
                    <p className="text-gray-600" style={{ fontSize: '15px', fontWeight: 400 }}>
                        Manage academic subjects and curriculum
                    </p>
                </div>
                {canAdd && <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        resetForm();
                        setShowAddModal(true);
                    }}
                    className="px-6 py-3 gradient-primary text-white rounded-xl flex items-center gap-2 font-medium shadow-glow hover:shadow-float transition-all duration-300"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Subject
                </motion.button>}
            </motion.div>

            {/* Subjects Table - Exact Design Match */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1E88E5] rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Loading subjects...</p>
                        </div>
                    ) : subjects.length === 0 ? (
                        <div className="p-12 text-center">
                            <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-900 font-semibold mb-2" style={{ fontSize: '18px' }}>No subjects found</p>
                            <p className="text-gray-500">Add your first subject to get started</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200/50 bg-gray-50/50">
                                    <th className="text-left px-6 py-4 text-gray-700" style={{ fontSize: '14px', fontWeight: 600 }}>
                                        Subject
                                    </th>
                                    <th className="text-left px-6 py-4 text-gray-700" style={{ fontSize: '14px', fontWeight: 600 }}>
                                        Code
                                    </th>
                                    <th className="text-left px-6 py-4 text-gray-700" style={{ fontSize: '14px', fontWeight: 600 }}>
                                        Teacher
                                    </th>
                                    <th className="text-left px-6 py-4 text-gray-700" style={{ fontSize: '14px', fontWeight: 600 }}>
                                        Students
                                    </th>
                                    <th className="text-left px-6 py-4 text-gray-700" style={{ fontSize: '14px', fontWeight: 600 }}>
                                        Hours/Week
                                    </th>
                                    <th className="text-left px-6 py-4 text-gray-700" style={{ fontSize: '14px', fontWeight: 600 }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map((subject, index) => {
                                    const subjectAllocations = getSubjectAllocations(subject.id!);
                                    
                                    // Subject color mapping
                                    const subjectColors: { [key: string]: string } = {
                                        'Mathematics': '#1E88E5',
                                        'Physics': '#7B1FA2',
                                        'English': '#F57C00',
                                        'Chemistry': '#00897B',
                                        'Biology': '#43A047',
                                        'History': '#E53935',
                                        'Computer Science': '#5B9FFF',
                                        'Geography': '#8E24AA',
                                    };
                                    const subjectColor = subjectColors[subject.subject_name] || '#1E88E5';

                                    return (
                                        <motion.tr
                                            key={subject.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.05 * index }}
                                            className="border-b border-gray-100/50 transition-all duration-300 hover:bg-gradient-to-r hover:from-[#1E88E5]/5 hover:to-transparent group"
                                        >
                                            {/* Subject Name with Icon */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <motion.div
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                                        style={{ backgroundColor: `${subjectColor}20` }}
                                                    >
                                                        {subject.cover_image_url ? (
                                                            <img
                                                                src={subject.cover_image_url}
                                                                alt={subject.subject_name}
                                                                className="w-full h-full object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <BookOpenIcon className="w-5 h-5" style={{ color: subjectColor }} />
                                                        )}
                                                    </motion.div>
                                                    <span className="font-semibold text-gray-800" style={{ fontSize: '15px' }}>
                                                        {subject.subject_name}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Subject Code Badge */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border-0"
                                                    style={{
                                                        backgroundColor: `${subjectColor}15`,
                                                        color: subjectColor
                                                    }}
                                                >
                                                    {subject.subject_code}
                                                </span>
                                            </td>

                                            {/* Teacher Name */}
                                            <td className="px-6 py-4">
                                                <span className="text-gray-700" style={{ fontSize: '14px', fontWeight: 500 }}>
                                                    {subjectAllocations.length > 0 ? (
                                                        subjectAllocations[0].teacher?.full_name || 'Not assigned'
                                                    ) : (
                                                        <span className="text-gray-400">Not assigned</span>
                                                    )}
                                                </span>
                                            </td>

                                            {/* Students Count */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <UsersIcon className="w-4 h-4" style={{ color: subjectColor }} />
                                                    <span style={{ fontSize: '14px', fontWeight: 500 }}>
                                                        {/* You can add real student count here */}
                                                        -
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Hours per Week */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <ClockIcon className="w-4 h-4" style={{ color: subjectColor }} />
                                                    <span style={{ fontSize: '14px', fontWeight: 500 }}>
                                                        {subjectAllocations.length > 0 && subjectAllocations[0].hours_per_week
                                                            ? `${subjectAllocations[0].hours_per_week}h`
                                                            : '-'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleView(subject)}
                                                    className="px-4 py-2 bg-white hover:bg-[#1E88E5]/10 border border-[#1E88E5]/20 text-[#1E88E5] rounded-lg text-sm font-medium transition-all duration-200"
                                                >
                                                    View Details
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </motion.div>

            {/* Enhanced Add/Edit Subject Modal */}
         {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
              {/* Enhanced Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                      {showEditModal ? <EditIcon className="h-6 w-6 text-white" /> : <PlusIcon className="h-6 w-6 text-white" />}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {showEditModal ? 'Edit Subject' : 'Add New Subject'}
                      </h2>
                      <p className="text-purple-100 text-sm">
                        {showEditModal ? 'Update subject information' : 'Create a new subject'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      resetForm()
                    }}
                    className="text-white hover:bg-white/20 rounded-xl p-2 transition-colors duration-200"
                  >
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Enhanced Form */}
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="max-h-[70vh] overflow-y-auto scroll-smooth p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              >
                {/* Subject Name */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <BookOpenIcon className="h-4 w-4 mr-2" />
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    value={formData.subject_name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject_name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                    placeholder="Enter subject name"
                  />
                  {formErrors.subject_name && (
                    <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.subject_name}</p>
                  )}
                </div>

                {/* Subject Code */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Building2Icon className="h-4 w-4 mr-2" />
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    value={formData.subject_code || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject_code: e.target.value.toUpperCase() }))}
                    className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                    placeholder="e.g., MATH101"
                  />
                  {formErrors.subject_code && (
                    <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.subject_code}</p>
                  )}
                </div>

                {/* Class Level */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <GraduationCapIcon className="h-4 w-4 mr-2" />
                    Class Level *
                  </label>
                  <select
                    value={formData.class_level || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, class_level: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  >
                    <option value="">Select Class Level</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>Class {i + 1}</option>
                    ))}
                  </select>
                  {formErrors.class_level && (
                    <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.class_level}</p>
                  )}
                </div>

                {/* Credits */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Credits *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.credits || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                    placeholder="Subject credits"
                  />
                  {formErrors.credits && (
                    <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.credits}</p>
                  )}
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Subject Cover Image
                  </label>
                  
                  {/* Image Preview */}
                  {(previewImage || formData.cover_image_url) && (
                    <div className="mb-3 relative">
                      <img
                        src={previewImage || formData.cover_image_url}
                        alt="Subject cover preview"
                        className="w-full h-32 object-cover rounded-xl border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploadingImage ? (
                          <LoaderIcon className="h-8 w-8 text-gray-400 animate-spin mb-2" />
                        ) : (
                          <UploadIcon className="h-8 w-8 text-gray-400 mb-2" />
                        )}
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> cover image
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Mandatory Checkbox */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="is_mandatory"
                    checked={formData.is_mandatory || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_mandatory: e.target.checked }))}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                  />
                  <label htmlFor="is_mandatory" className="text-sm font-medium text-gray-700">
                    This is a mandatory subject
                  </label>
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <InfoIcon className="h-4 w-4 mr-2" />
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                    placeholder="Optional subject description"
                  />
                </div>

                {/* Status (for edit mode) */}
                {showEditModal && (
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <UserCheckIcon className="h-4 w-4 mr-2" />
                      Status
                    </label>
                    <select
                      value={formData.status || 'active'}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                      className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                )}

                {/* Enhanced Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      resetForm()
                    }}
                    className="px-6 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    {submitting && <LoaderIcon className="h-4 w-4 animate-spin" />}
                    <span>{submitting ? 'Saving...' : (showEditModal ? 'Update Subject' : 'Create Subject')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Rest of the modals remain the same... */}
        {/* I'll include the Teacher Allocation Modal and other modals in the next part */}

        {/* Enhanced Teacher Allocation Modal */}
        {showAllocationModal && selectedSubject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
              {/* Enhanced Header */}
              <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                      <UserCheckIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Allocate Teacher
                      </h2>
                      <p className="text-green-100 text-sm">
                        Assign teacher with conflict detection
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowAllocationModal(false)
                      setAllocationFormData({})
                      setAllocationErrors({})
                    }}
                    className="text-white hover:bg-white/20 rounded-xl p-2 transition-colors duration-200"
                  >
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Subject Info */}
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">{selectedSubject.subject_name}</h3>
                <p className="text-sm text-gray-600">Class {selectedSubject.class_level} • {selectedSubject.subject_code}</p>
              </div>

              {/* Enhanced Form */}
              <form
                ref={formRef}
                onSubmit={handleAllocationSubmit}
                className="max-h-[70vh] overflow-y-auto scroll-smooth p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              >
                {/* Teacher Selection with Specialization Info */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    Select Teacher *
                  </label>
                  <select
                    value={allocationFormData.teacher_id || ''}
                    onChange={(e) => setAllocationFormData(prev => ({ ...prev, teacher_id: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  >
                    <option value="">Choose a teacher</option>
                    {teachers.map(teacher => {
                      const workload = getTeacherWorkload(teacher.id, allocationFormData.academic_year || `${currentYear}-${currentYear + 1}`)
                      const specializationMatch = checkSubjectSpecializationMatch(teacher.id, selectedSubject.subject_name)

                      return (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.full_name} - {teacher.subject_specialization}
                          ({workload.total_hours}h/week)
                          {!specializationMatch && ' ⚠️'}
                          {workload.is_overloaded && ' 🔴'}
                          {workload.is_high_workload && !workload.is_overloaded && ' 🟡'}
                        </option>
                      )
                    })}
                  </select>
                  {allocationErrors.teacher_id && (
                    <p className="text-red-500 text-sm mt-1 font-medium">{allocationErrors.teacher_id}</p>
                  )}
                  {allocationFormData.teacher_id && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg text-xs">
                      <div className="flex items-center justify-between">
                        <span>Current workload:</span>
                        <span className="font-medium">
                          {getTeacherWorkload(allocationFormData.teacher_id, allocationFormData.academic_year || `${currentYear}-${currentYear + 1}`).total_hours}h/week
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Academic Year */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Academic Year *
                  </label>
                  <select
                    value={allocationFormData.academic_year || ''}
                    onChange={(e) => setAllocationFormData(prev => ({ ...prev, academic_year: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  >
                    <option value="">Select Academic Year</option>
                    {academicYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {allocationErrors.academic_year && (
                    <p className="text-red-500 text-sm mt-1 font-medium">{allocationErrors.academic_year}</p>
                  )}
                </div>

                {/* Class Selection (Optional) */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Building2Icon className="h-4 w-4 mr-2" />
                    Specific Class (Optional)
                  </label>
                  <select
                    value={allocationFormData.class_id || ''}
                    onChange={(e) => setAllocationFormData(prev => ({ ...prev, class_id: e.target.value || undefined }))}
                    className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  >
                    <option value="">All classes for this level</option>
                    {classes.filter(cls => cls.class_name === selectedSubject.class_level).map(cls => (
                      <option key={cls.id} value={cls.id}>
                        Class {cls.class_name}-{cls.section} ({cls.academic_year})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hours Per Week with Validation */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Hours Per Week *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={allocationFormData.hours_per_week || ''}
                    onChange={(e) => setAllocationFormData(prev => ({ ...prev, hours_per_week: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                    placeholder="Weekly teaching hours"
                  />
                  {allocationErrors.hours_per_week && (
                    <p className="text-red-500 text-sm mt-1 font-medium">{allocationErrors.hours_per_week}</p>
                  )}
                  <div className="mt-1 text-xs text-gray-500">
                    Recommended: 2-6 hours per subject
                  </div>
                </div>

                {/* Enhanced Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAllocationModal(false)
                      setAllocationFormData({})
                      setAllocationErrors({})
                    }}
                    className="px-6 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    {submitting && <LoaderIcon className="h-4 w-4 animate-spin" />}
                    <span>{submitting ? 'Allocating...' : 'Allocate Teacher'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Enhanced View Subject Modal */}
        {showViewModal && selectedSubject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
              {/* Enhanced Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                      {selectedSubject.cover_image_url ? (
                        <img
                          src={selectedSubject.cover_image_url}
                          alt={`${selectedSubject.subject_name} cover`}
                          className="h-8 w-8 object-cover rounded-lg"
                        />
                      ) : (
                        <BookOpenIcon className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedSubject.subject_name}</h2>
                      <p className="text-indigo-100">Code: {selectedSubject.subject_code}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowViewModal(false)
                      setSelectedSubject(null)
                    }}
                    className="text-white hover:bg-white/20 rounded-xl p-2 transition-colors duration-200"
                  >
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Enhanced Content */}
              <div className="p-6">
                {/* Subject Info */}
                <div className="mb-6">
                  {selectedSubject.description && (
                    <p className="text-gray-700 mb-4 p-4 bg-gray-50 rounded-xl">{selectedSubject.description}</p>
                  )}

                  {/* Subject Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-blue-700 mb-1">Class Level</label>
                      <p className="text-blue-900 font-semibold">Class {selectedSubject.class_level}</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-green-700 mb-1">Credits</label>
                      <p className="text-green-900 font-semibold">{selectedSubject.credits}</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-purple-700 mb-1">Type</label>
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${selectedSubject.is_mandatory
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}>
                        {selectedSubject.is_mandatory ? 'Mandatory' : 'Optional'}
                      </span>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${selectedSubject.status === 'active'
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                        {selectedSubject.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Teacher Allocations */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <UsersIcon className="h-5 w-5 mr-2 text-purple-600" />
                      Teacher Allocations
                    </h4>
                    <button
                      onClick={() => {
                        setShowViewModal(false)
                        handleAllocateTeacher(selectedSubject)
                      }}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Teacher
                    </button>
                  </div>

                  {getSubjectAllocations(selectedSubject.id!).length === 0 ? (
                    <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                      <GraduationCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 font-medium">No teachers allocated</p>
                      <button
                        onClick={() => {
                          setShowViewModal(false)
                          handleAllocateTeacher(selectedSubject)
                        }}
                        className="mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        Allocate a teacher
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {getSubjectAllocations(selectedSubject.id!).map((allocation) => {
                        const workload = getTeacherWorkload(allocation.teacher_id, allocation.academic_year)
                        return (
                          <div key={allocation.id} className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                    <UserCheckIcon className="h-5 w-5 text-purple-600" />
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-gray-900 flex items-center">
                                      {allocation.teacher?.full_name}
                                      {workload.is_overloaded && (
                                        <div className="relative group ml-2">
                                          <AlertTriangleIcon className="h-4 w-4 text-red-500" />
                                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                            Overloaded - Exceeds {MAX_WEEKLY_HOURS}h/week
                                          </div>
                                        </div>
                                      )}
                                      {workload.is_high_workload && !workload.is_overloaded && (
                                        <div className="relative group ml-2">
                                          <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />
                                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                            High workload - Above {RECOMMENDED_WEEKLY_HOURS}h/week
                                          </div>
                                        </div>
                                      )}
                                    </h5>
                                    <p className="text-sm text-gray-600">
                                      Specialization: {allocation.teacher?.subject_specialization}
                                    </p>
                                    {allocation.class && (
                                      <p className="text-xs text-blue-600 mt-1">
                                        Class {allocation.class.class_name}-{allocation.class.section}
                                      </p>
                                    )}
                                  </div>

                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center text-sm font-semibold text-gray-900">
                                  <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
                                  {allocation.hours_per_week}h/week
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {allocation.academic_year}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  Total: {workload.total_hours}h/week
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Footer */}
              <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    setSelectedSubject(null)
                  }}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Delete Confirmation Modal */}
        {showDeleteModal && selectedSubject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
              <div className="p-8 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-6">
                  <TrashIcon className="h-8 w-8 text-red-600" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Delete Subject
                </h3>

                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-gray-900">{selectedSubject.subject_name}</span>?
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-800 text-sm font-medium flex items-center">
                      <AlertCircleIcon className="h-4 w-4 mr-2" />
                      This action cannot be undone and will remove all teacher allocations.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setSelectedSubject(null)
                    }}
                    disabled={submitting}
                    className="px-6 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={submitting}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    {submitting && <LoaderIcon className="h-4 w-4 animate-spin" />}
                    <TrashIcon className="h-4 w-4" />
                    <span>{submitting ? 'Deleting...' : 'Delete Subject'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}