import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
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
    RefreshCwIcon,
    UsersIcon,
    BookOpenIcon,
    PhoneIcon,
    CheckCircleIcon,
    AlertCircleIcon,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useRolePermissions } from '../../hooks/useRolePermissions';

// Types
interface Student {
    id?: string
    full_name: string
    class_name: string
    roll_number: string
    admission_number: string
    profile_picture?: string
    gender: 'male' | 'female' | 'other'
    date_of_birth: string
    address: string
    parent_name: string
    parent_contact: string
    parent_email: string    // REQUIRED NOW
    email: string           // REQUIRED NOW
    status: 'active' | 'inactive'
    admission_year: number
    section?: string
    created_at?: string
    updated_at?: string
}

interface StudentFilters {
    search: string
    class_filter: string
    section_filter: string
    gender_filter: string
    admission_year_filter: string
    status_filter: string
}

interface NotificationState {
    show: boolean
    type: 'success' | 'error' | 'info' | 'warning'
    title: string
    message: string
}

export const Students = () => {
    // State Management
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)

    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const { canAdd, canEdit, canDelete, isTeacher } = useRolePermissions();

    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState<StudentFilters>({
        search: '',
        class_filter: '',
        section_filter: '',
        gender_filter: '',
        admission_year_filter: '',
        status_filter: ''
    })

    const [formData, setFormData] = useState<Partial<Student>>({})
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)
    const [profilePicture, setProfilePicture] = useState<File | null>(null)
    const [profilePictureUrl, setProfilePictureUrl] = useState<string>('')
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const [emailWarning, setEmailWarning] = useState<string>('')  // NEW: Email warning state

    const [notification, setNotification] = useState<NotificationState>({
        show: false,
        type: 'info',
        title: '',
        message: ''
    })

    // Notification helper
    const showNotification = (type: NotificationState['type'], title: string, message: string) => {
        setNotification({ show: true, type, title, message })
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }))
        }, 5000)
    }

    // NEW: Real-time email validation
    useEffect(() => {
        if (formData.email && formData.parent_email) {
            if (formData.email.toLowerCase() === formData.parent_email.toLowerCase()) {
                setEmailWarning('⚠️ Student and parent emails must be different')
            } else {
                setEmailWarning('')
            }
        } else {
            setEmailWarning('')
        }
    }, [formData.email, formData.parent_email])

    // Service Functions
    const createStudent = async (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> => {
        const { data, error } = await supabase
            .from('students')
            .insert(student)
            .select()
            .single()

        if (error) throw error
        return data
    }

    const getStudents = async (filters: StudentFilters, page = 1, limit = 10) => {
        let query = supabase
            .from('students')
            .select('*', { count: 'exact' })

        if (filters.search) {
            query = query.or(`full_name.ilike.%${filters.search}%,admission_number.ilike.%${filters.search}%,roll_number.ilike.%${filters.search}%`)
        }
        if (filters.class_filter) query = query.eq('class_name', filters.class_filter)
        if (filters.section_filter) query = query.eq('section', filters.section_filter)
        if (filters.gender_filter) query = query.eq('gender', filters.gender_filter)
        if (filters.admission_year_filter) query = query.eq('admission_year', filters.admission_year_filter)
        if (filters.status_filter) query = query.eq('status', filters.status_filter)

        const from = (page - 1) * limit
        const to = from + limit - 1

        const { data, error, count } = await query
            .range(from, to)
            .order('created_at', { ascending: false })

        if (error) throw error
        return { students: data || [], total: count || 0 }
    }

    const updateStudent = async (id: string, student: Partial<Student>): Promise<Student> => {
        const { data, error } = await supabase
            .from('students')
            .update(student)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    }

    const deleteStudent = async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', id)

        if (error) throw error
    }

    const uploadProfilePicture = async (file: File, studentId: string): Promise<string> => {
        if (!file || file.size > 10 * 1024 * 1024) throw new Error('File too large')

        const fileExt = file.name.split('.').pop()?.toLowerCase()
        const fileName = `${studentId}-${Date.now()}.${fileExt}`
        const filePath = `profiles/${fileName}`

        const { data, error: uploadError } = await supabase.storage
            .from('student-profiles')
            .upload(filePath, file, { cacheControl: '3600', upsert: true })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
            .from('student-profiles')
            .getPublicUrl(filePath)

        return urlData.publicUrl
    }

    // Handlers
    const loadStudents = async (showLoadingSpinner = true) => {
        try {
            if (showLoadingSpinner) setLoading(true)
            else setRefreshing(true)

            const result = await getStudents(filters, currentPage, pageSize)
            setStudents(result.students)
            setTotal(result.total)
        } catch (error) {
            console.error('Error loading students:', error)
            showNotification('error', 'Loading Failed', 'Failed to load students.')
            setStudents([])
            setTotal(0)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        loadStudents()
    }, [filters, currentPage])

    useEffect(() => {
        const interval = setInterval(() => {
            loadStudents(false)
        }, 30000)
        return () => clearInterval(interval)
    }, [filters, currentPage])

    // UPDATED: Validation with required emails
    const validateForm = (data: Partial<Student>): Record<string, string> => {
        const errors: Record<string, string> = {}
        if (!data.full_name || data.full_name.length < 2) errors.full_name = 'Full name required'
        if (!data.class_name) errors.class_name = 'Class required'
        if (!data.roll_number) errors.roll_number = 'Roll number required'
        if (!data.admission_number) errors.admission_number = 'Admission number required'
        if (!data.gender) errors.gender = 'Gender required'
        if (!data.date_of_birth) errors.date_of_birth = 'DOB required'
        if (!data.address || data.address.length < 5) errors.address = 'Address required'
        if (!data.parent_name) errors.parent_name = 'Parent name required'
        if (!data.parent_contact || data.parent_contact.length < 10) errors.parent_contact = 'Contact required'
        
        // NEW: Email validations
        if (!data.email) {
            errors.email = 'Student email is required'
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = 'Valid student email required'
        }
        
        if (!data.parent_email) {
            errors.parent_email = 'Parent email is required'
        } else if (!/\S+@\S+\.\S+/.test(data.parent_email)) {
            errors.parent_email = 'Valid parent email required'
        }
        
        // NEW: Check if emails are different
        if (data.email && data.parent_email && data.email.toLowerCase() === data.parent_email.toLowerCase()) {
            errors.parent_email = 'Student and parent emails must be different'
        }
        
        return errors
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const errors = validateForm(formData)
        setFormErrors(errors)

        if (Object.keys(errors).length > 0) {
            showNotification('error', 'Validation Error', 'Please fix form errors.')
            return
        }

        try {
            setSubmitting(true)

            const studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'> = {
                full_name: formData.full_name!,
                class_name: formData.class_name!,
                roll_number: formData.roll_number!,
                admission_number: formData.admission_number!,
                gender: formData.gender!,
                date_of_birth: formData.date_of_birth!,
                address: formData.address!,
                parent_name: formData.parent_name!,
                parent_contact: formData.parent_contact!,
                parent_email: formData.parent_email!,  // REQUIRED NOW
                email: formData.email!,                 // REQUIRED NOW
                status: formData.status || 'active',
                admission_year: formData.admission_year || new Date().getFullYear(),
                section: formData.section,
            }

            let savedStudent: Student

            if (showEditModal && selectedStudent) {
                savedStudent = await updateStudent(selectedStudent.id!, studentData)
                setShowEditModal(false)
                showNotification('success', 'Updated', 'Student updated successfully.')
            } else {
                savedStudent = await createStudent(studentData)
                setShowAddModal(false)
                showNotification('success', 'Added', 'Student added successfully.')
            }

            if (profilePicture && savedStudent.id) {
                try {
                    const imageUrl = await uploadProfilePicture(profilePicture, savedStudent.id)
                    await updateStudent(savedStudent.id, { profile_picture: imageUrl })
                } catch (err) {
                    console.warn('Image upload failed:', err)
                }
            }

            resetForm()
            setTimeout(() => loadStudents(false), 1000)

        } catch (error: any) {
            showNotification('error', 'Save Failed', error.message || 'Failed to save.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteConfirm = async () => {
        if (selectedStudent) {
            try {
                setSubmitting(true)
                await deleteStudent(selectedStudent.id!)
                setShowDeleteModal(false)
                showNotification('success', 'Deleted', 'Student deleted.')
                setTimeout(() => loadStudents(false), 1000)
            } catch (error: any) {
                showNotification('error', 'Delete Failed', error.message)
            } finally {
                setSubmitting(false)
            }
        }
    }

    const resetForm = () => {
        setFormData({})
        setFormErrors({})
        setProfilePicture(null)
        setProfilePictureUrl('')
        setSelectedStudent(null)
        setEmailWarning('')  // NEW: Reset warning
    }

    const handleEdit = (student: Student) => {
        setSelectedStudent(student)
        setFormData(student)
        setProfilePictureUrl(student.profile_picture || '')
        setShowEditModal(true)
    }

    const handleView = (student: Student) => {
        setSelectedStudent(student)
        setShowViewModal(true)
    }

    const handleDelete = (student: Student) => {
        setSelectedStudent(student)
        setShowDeleteModal(true)
    }

    const handleFilterChange = (newFilters: Partial<StudentFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }))
        setCurrentPage(1)
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                showNotification('error', 'File Too Large', 'Max 10MB.')
                return
            }
            setProfilePicture(file)
            const url = URL.createObjectURL(file)
            setProfilePictureUrl(url)
        }
    }


    useEffect(() => {
        return () => {
            if (profilePictureUrl && profilePictureUrl.startsWith('blob:')) {
                URL.revokeObjectURL(profilePictureUrl)
            }
        }
    }, [profilePictureUrl])

    const totalPages = Math.ceil(total / pageSize)
    const activeStudents = students.filter(s => s.status === 'active').length

    return (
        <div className="min-h-screen bg-[#F6F9FC] p-8">
            <div className="max-w-[1600px] mx-auto space-y-6">
                {/* Notification */}
                {notification.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-4 right-4 p-4 rounded-xl shadow-lg border-l-4 z-50 ${
                            notification.type === 'success' ? 'bg-green-50 border-green-400' :
                            notification.type === 'error' ? 'bg-red-50 border-red-400' :
                            notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                            'bg-blue-50 border-blue-400'
                        }`}
                    >
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        <p className="text-sm text-gray-600">{notification.message}</p>
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
                            Students
                        </h1>
                        <p className="text-gray-600" style={{ fontSize: '15px', fontWeight: 400 }}>
                            Manage and view all student information
                        </p>
                    </div>
                    {canAdd && <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { resetForm(); setShowAddModal(true) }}
                        className="px-6 py-3 gradient-primary text-white rounded-xl flex items-center gap-2 font-medium shadow-glow"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Student
                    </motion.button>
                    }
                </motion.div>

                {/* Search & Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100"
                >
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange({ search: e.target.value })}
                                className="w-full pl-12 pr-4 h-11 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
                                style={{ fontSize: '15px' }}
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setShowFilters(true)}
                            className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl flex items-center gap-2 font-medium border border-gray-200 shadow-sm"
                        >
                            <FilterIcon className="w-5 h-5" />
                            Filter
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => loadStudents(false)}
                            disabled={refreshing}
                            className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl flex items-center gap-2 font-medium border border-gray-200 shadow-sm"
                        >
                            <RefreshCwIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                        </motion.button>
                    </div>
                </motion.div>

                {/* Table */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-12 text-center">
                                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1E88E5] rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600 font-medium">Loading students...</p>
                            </div>
                        ) : students.length === 0 ? (
                            <div className="p-12 text-center">
                                <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-900 font-semibold mb-2">No students found</p>
                                <p className="text-gray-500">Try adjusting your search</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-gray-700" style={{ fontSize: '14px', fontWeight: 600 }}>Student</th>
                                        <th className="px-6 py-4 text-left text-gray-700" style={{ fontSize: '14px', fontWeight: 600 }}>Class & Roll</th>
                                        <th className="px-6 py-4 text-left text-gray-700" style={{ fontSize: '14px', fontWeight: 600 }}>Parent Details</th>
                                        <th className="px-6 py-4 text-left text-gray-700" style={{ fontSize: '14px', fontWeight: 600 }}>Status</th>
                                        <th className="px-6 py-4 text-left text-gray-700" style={{ fontSize: '14px', fontWeight: 600 }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {students.map((student) => (
                                        <motion.tr
                                            key={student.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {student.profile_picture ? (
                                                        <img
                                                            src={student.profile_picture}
                                                            alt={student.full_name}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                                                            {student.full_name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-gray-900 font-medium" style={{ fontSize: '14px' }}>{student.full_name}</p>
                                                        <p className="text-gray-500 text-sm">{student.admission_number}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-gray-900 font-medium" style={{ fontSize: '14px' }}>Class {student.class_name} {student.section && `-${student.section}`}</p>
                                                <p className="text-gray-500 text-sm">Roll: {student.roll_number}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-gray-900 font-medium" style={{ fontSize: '14px' }}>{student.parent_name}</p>
                                                <p className="text-gray-500 text-sm flex items-center gap-1"><PhoneIcon className="w-3 h-3" />{student.parent_contact}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-lg font-medium border ${student.status === 'active' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`} style={{ fontSize: '13px' }}>
                                                    {student.status === 'active' ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="relative inline-block">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        onClick={() => setOpenDropdown(openDropdown === student.id ? null : student.id!)}
                                                        className="p-2 rounded-lg hover:bg-gray-100"
                                                    >
                                                        <MoreVerticalIcon className="w-5 h-5 text-gray-600" />
                                                    </motion.button>

                                                    {openDropdown === student.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10 overflow-hidden"
                                                        >
                                                            <button
                                                                onClick={() => { handleView(student); setOpenDropdown(null) }}
                                                                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50 text-sm"
                                                            >
                                                                <EyeIcon className="w-4 h-4 mr-3 text-blue-600" />
                                                                View
                                                            </button>
                                                            {canEdit &&<button
                                                                onClick={() => { handleEdit(student); setOpenDropdown(null) }}
                                                                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-yellow-50 text-sm"
                                                            >
                                                                <EditIcon className="w-4 h-4 mr-3 text-yellow-600" />
                                                                Edit
                                                            </button>}
                                                            {canDelete && <button
                                                                onClick={() => { handleDelete(student); setOpenDropdown(null) }}
                                                                className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 text-sm"
                                                            >
                                                                <TrashIcon className="w-4 h-4 mr-3" />
                                                                Delete
                                                            </button>}
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Pagination */}
                    {!loading && students.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200/50 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-semibold text-gray-900">{students.length}</span> of{' '}
                                <span className="font-semibold text-gray-900">{total}</span> students
                            </p>

                            {totalPages > 1 && (
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        Previous
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                                        whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                                        onClick={() => setCurrentPage(1)}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                            currentPage === 1
                                                ? 'bg-[#1E88E5] text-white border border-[#1E88E5] shadow-md'
                                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        1
                                    </motion.button>

                                    {totalPages >= 2 && (
                                        <motion.button
                                            whileHover={{ scale: currentPage === 2 ? 1 : 1.05 }}
                                            whileTap={{ scale: currentPage === 2 ? 1 : 0.95 }}
                                            onClick={() => setCurrentPage(2)}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                currentPage === 2
                                                    ? 'bg-[#1E88E5] text-white border border-[#1E88E5] shadow-md'
                                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            2
                                        </motion.button>
                                    )}

                                    {totalPages >= 3 && (
                                        <motion.button
                                            whileHover={{ scale: currentPage === 3 ? 1 : 1.05 }}
                                            whileTap={{ scale: currentPage === 3 ? 1 : 0.95 }}
                                            onClick={() => setCurrentPage(3)}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                currentPage === 3
                                                    ? 'bg-[#1E88E5] text-white border border-[#1E88E5] shadow-md'
                                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            3
                                        </motion.button>
                                    )}

                                    {totalPages > 3 && (
                                        <>
                                            {currentPage < totalPages - 2 && totalPages > 4 && (
                                                <span className="px-2 py-2 text-gray-400 flex items-center">...</span>
                                            )}
                                            {currentPage < totalPages - 1 && (
                                                <motion.button
                                                    whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                                                    whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                                                    onClick={() => setCurrentPage(totalPages)}
                                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                        currentPage === totalPages
                                                            ? 'bg-[#1E88E5] text-white border border-[#1E88E5] shadow-md'
                                                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {totalPages}
                                                </motion.button>
                                            )}
                                        </>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        Next
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Add/Edit Modal */}
                {(showAddModal || showEditModal) && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="bg-gradient-to-r from-[#1E88E5] to-[#5B9FFF] px-6 py-6 flex items-center justify-between">
                                <h2 className="text-white font-bold" style={{ fontSize: '24px' }}>
                                    {showEditModal ? 'Edit Student' : 'Add New Student'}
                                </h2>
                                <motion.button
                                    whileHover={{ rotate: 90 }}
                                    onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm() }}
                                    className="text-white hover:bg-white/20 rounded-lg p-2"
                                >
                                    <XIcon className="w-6 h-6" />
                                </motion.button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                {/* Profile Picture */}
                                <div className="flex justify-center">
                                    {profilePictureUrl ? (
                                        <div className="relative">
                                            <img src={profilePictureUrl} alt="preview" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                type="button"
                                                onClick={() => { setProfilePicture(null); setProfilePictureUrl('') }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <XIcon className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    ) : (
                                        <label className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#1E88E5] hover:bg-blue-50">
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                            <PlusIcon className="w-8 h-8 text-gray-400" />
                                        </label>
                                    )}
                                </div>

                                {/* Form Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium" style={{ fontSize: '14px' }}>Full Name *</label>
                                        <input
                                            type="text"
                                            value={formData.full_name || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
                                            placeholder="Enter full name"
                                        />
                                        {formErrors.full_name && <p className="text-red-500 text-sm mt-1">{formErrors.full_name}</p>}
                                    </div>

                                    {/* Class */}
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium" style={{ fontSize: '14px' }}>Class *</label>
                                        <select
                                            value={formData.class_name || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, class_name: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
                                        >
                                            <option value="">Select Class</option>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => <option key={n} value={n}>Class {n}</option>)}
                                        </select>
                                        {formErrors.class_name && <p className="text-red-500 text-sm mt-1">{formErrors.class_name}</p>}
                                    </div>

                                    {/* Roll Number */}
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium" style={{ fontSize: '14px' }}>Roll Number *</label>
                                        <input
                                            type="text"
                                            value={formData.roll_number || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, roll_number: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
                                            placeholder="Enter roll number"
                                        />
                                        {formErrors.roll_number && <p className="text-red-500 text-sm mt-1">{formErrors.roll_number}</p>}
                                    </div>

                                    {/* Admission Number */}
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium" style={{ fontSize: '14px' }}>Admission Number *</label>
                                        <input
                                            type="text"
                                            value={formData.admission_number || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, admission_number: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
                                            placeholder="Enter admission number"
                                        />
                                        {formErrors.admission_number && <p className="text-red-500 text-sm mt-1">{formErrors.admission_number}</p>}
                                    </div>

                                    {/* Gender */}
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium" style={{ fontSize: '14px' }}>Gender *</label>
                                        <select
                                            value={formData.gender || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {formErrors.gender && <p className="text-red-500 text-sm mt-1">{formErrors.gender}</p>}
                                    </div>

                                    {/* Date of Birth */}
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium" style={{ fontSize: '14px' }}>Date of Birth *</label>
                                        <input
                                            type="date"
                                            value={formData.date_of_birth || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
                                        />
                                        {formErrors.date_of_birth && <p className="text-red-500 text-sm mt-1">{formErrors.date_of_birth}</p>}
                                    </div>

                                    {/* Section */}
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium" style={{ fontSize: '14px' }}>Section</label>
                                        <select
                                            value={formData.section || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
                                        >
                                            <option value="">Select Section</option>
                                            <option value="A">Section A</option>
                                            <option value="B">Section B</option>
                                            <option value="C">Section C</option>
                                            <option value="D">Section D</option>
                                        </select>
                                    </div>

                                    {/* Parent Name */}
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium" style={{ fontSize: '14px' }}>Parent Name *</label>
                                        <input
                                            type="text"
                                            value={formData.parent_name || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, parent_name: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
                                            placeholder="Enter parent name"
                                        />
                                        {formErrors.parent_name && <p className="text-red-500 text-sm mt-1">{formErrors.parent_name}</p>}
                                    </div>

                                    {/* Parent Contact */}
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium" style={{ fontSize: '14px' }}>Parent Contact *</label>
                                        <input
                                            type="tel"
                                            value={formData.parent_contact || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, parent_contact: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
                                            placeholder="Enter contact"
                                        />
                                        {formErrors.parent_contact && <p className="text-red-500 text-sm mt-1">{formErrors.parent_contact}</p>}
                                    </div>

                                    {/* Student Email - REQUIRED */}
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium" style={{ fontSize: '14px' }}>
                                            Student Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
                                            placeholder="student@example.com"
                                        />
                                        {formErrors.email && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <AlertCircleIcon className="w-4 h-4" />
                                            {formErrors.email}
                                        </p>}
                                    </div>

                                    {/* Parent Email - REQUIRED */}
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium" style={{ fontSize: '14px' }}>
                                            Parent Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.parent_email || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, parent_email: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
                                            placeholder="parent@example.com"
                                        />
                                        {formErrors.parent_email && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <AlertCircleIcon className="w-4 h-4" />
                                            {formErrors.parent_email}
                                        </p>}
                                    </div>

                                    {/* Email Warning Banner */}
                                    {emailWarning && (
                                        <div className="md:col-span-2">
                                            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 flex items-start gap-3">
                                                <AlertCircleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                <p className="text-yellow-800 text-sm font-medium">
                                                    {emailWarning}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Address */}
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-700 mb-2 font-medium" style={{ fontSize: '14px' }}>Address *</label>
                                        <textarea
                                            rows={3}
                                            value={formData.address || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none resize-none"
                                            placeholder="Enter address"
                                        />
                                        {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        type="button"
                                        onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm() }}
                                        className="px-6 py-2.5 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        type="submit"
                                        disabled={submitting || !!emailWarning}
                                        className="px-8 py-2.5 gradient-primary text-white rounded-xl hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                                    >
                                        {submitting && <LoaderIcon className="w-4 h-4 animate-spin" />}
                                        {showEditModal ? 'Update' : 'Add Student'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Delete Modal */}
                {showDeleteModal && selectedStudent && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
                        >
                            <AlertCircleIcon className="w-16 h-16 text-red-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Student?</h3>
                            <p className="text-gray-600 mb-6">
                                Delete <span className="font-semibold">{selectedStudent.full_name}</span>? This cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => { setShowDeleteModal(false); setSelectedStudent(null) }}
                                    className="flex-1 px-4 py-2.5 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={handleDeleteConfirm}
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                                >
                                    {submitting && <LoaderIcon className="w-4 h-4 animate-spin" />}
                                    Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* View Modal */}
                {showViewModal && selectedStudent && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="bg-gradient-to-r from-[#1E88E5] to-[#5B9FFF] px-6 py-6 flex items-center justify-between">
                                <h2 className="text-white font-bold text-2xl">Student Details</h2>
                                <motion.button
                                    whileHover={{ rotate: 90 }}
                                    onClick={() => { setShowViewModal(false); setSelectedStudent(null) }}
                                    className="text-white hover:bg-white/20 rounded-lg p-2"
                                >
                                    <XIcon className="w-6 h-6" />
                                </motion.button>
                            </div>

                            <div className="p-8">
                                {selectedStudent.profile_picture && (
                                    <div className="text-center mb-6">
                                        <img
                                            src={selectedStudent.profile_picture}
                                            alt={selectedStudent.full_name}
                                            className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium mb-1">Full Name</p>
                                        <p className="text-gray-900 font-semibold">{selectedStudent.full_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium mb-1">Class</p>
                                        <p className="text-gray-900 font-semibold">Class {selectedStudent.class_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium mb-1">Roll No</p>
                                        <p className="text-gray-900 font-semibold">{selectedStudent.roll_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium mb-1">Admission No</p>
                                        <p className="text-gray-900 font-semibold">{selectedStudent.admission_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium mb-1">Parent Name</p>
                                        <p className="text-gray-900 font-semibold">{selectedStudent.parent_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium mb-1">Contact</p>
                                        <p className="text-gray-900 font-semibold">{selectedStudent.parent_contact}</p>
                                    </div>
                                    {/* NEW: Display both emails */}
                                    {selectedStudent.email && (
                                        <div>
                                            <p className="text-gray-500 text-sm font-medium mb-1">Student Email</p>
                                            <p className="text-gray-900 font-semibold">{selectedStudent.email}</p>
                                        </div>
                                    )}
                                    {selectedStudent.parent_email && (
                                        <div>
                                            <p className="text-gray-500 text-sm font-medium mb-1">Parent Email</p>
                                            <p className="text-gray-900 font-semibold">{selectedStudent.parent_email}</p>
                                        </div>
                                    )}
                                    <div className="col-span-2">
                                        <p className="text-gray-500 text-sm font-medium mb-1">Address</p>
                                        <p className="text-gray-900 font-semibold">{selectedStudent.address}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => { handleEdit(selectedStudent); setShowViewModal(false) }}
                                    className="px-6 py-2.5 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 font-medium"
                                >
                                    <EditIcon className="w-4 h-4 inline mr-2" />
                                    Edit
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => { setShowViewModal(false); setSelectedStudent(null) }}
                                    className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-medium"
                                >
                                    Close
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Filters Modal */}
                {showFilters && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                                <motion.button
                                    whileHover={{ rotate: 90 }}
                                    onClick={() => setShowFilters(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XIcon className="w-5 h-5" />
                                </motion.button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                    <select
                                        value={filters.class_filter}
                                        onChange={(e) => handleFilterChange({ class_filter: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none text-sm"
                                    >
                                        <option value="">All Classes</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => <option key={n} value={n}>Class {n}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                                    <select
                                        value={filters.section_filter}
                                        onChange={(e) => handleFilterChange({ section_filter: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none text-sm"
                                    >
                                        <option value="">All Sections</option>
                                        <option value="A">Section A</option>
                                        <option value="B">Section B</option>
                                        <option value="C">Section C</option>
                                        <option value="D">Section D</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select
                                        value={filters.gender_filter}
                                        onChange={(e) => handleFilterChange({ gender_filter: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none text-sm"
                                    >
                                        <option value="">All Genders</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setShowFilters(false)}
                                    className="px-4 py-2 bg-[#1E88E5] text-white rounded-lg hover:bg-[#1976D2] font-medium text-sm"
                                >
                                    Apply
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Students
