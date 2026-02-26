// import React, { useState, useEffect, useCallback } from 'react'
// import { 
//   PlusIcon, 
//   SearchIcon, 
//   FilterIcon, 
//   MoreVerticalIcon,
//   EditIcon,
//   TrashIcon,
//   EyeIcon,
//   DownloadIcon,
//   UploadIcon,
//   UserIcon,
//   XIcon,
//   CameraIcon,
//   LoaderIcon,
//   ChevronDownIcon,
//   FileDownIcon,
//   FileUpIcon,
//   CheckCircleIcon,
//   AlertCircleIcon,
//   InfoIcon,
//   RefreshCwIcon,
//   GraduationCapIcon,
//   PhoneIcon,
//   MailIcon,
//   MapPinIcon,
//   CalendarIcon
// } from 'lucide-react'
// import { supabase } from '../../lib/supabase'

// // Types
// interface Teacher {
//   id?: string
//   full_name: string
//   employee_id: string
//   subject_specialization: string
//   phone_number: string
//   email: string
//   address: string
//   date_of_birth: string
//   date_of_joining: string
//   qualification: string
//   experience_years: number
//   salary: number
//   profile_picture?: string
//   status: 'active' | 'inactive' | 'on_leave'
//   gender: 'male' | 'female' | 'other'
//   emergency_contact: string
//   created_at?: string
//   updated_at?: string
// }

// interface TeacherFilters {
//   search: string
//   subject_filter: string
//   qualification_filter: string
//   experience_filter: string
//   status_filter: string
//   gender_filter: string
// }

// interface NotificationState {
//   show: boolean
//   type: 'success' | 'error' | 'info' | 'warning'
//   title: string
//   message: string
// }

// export const Teachers = () => {
//   // State Management
//   const [teachers, setTeachers] = useState<Teacher[]>([])
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)
//   const [total, setTotal] = useState(0)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [pageSize] = useState(10)
  
//   // Modal states
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [showViewModal, setShowViewModal] = useState(false)
//   const [showDeleteModal, setShowDeleteModal] = useState(false)
//   const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  
//   // Filter states
//   const [showFilters, setShowFilters] = useState(false)
//   const [showExportMenu, setShowExportMenu] = useState(false)
//   const [filters, setFilters] = useState<TeacherFilters>({
//     search: '',
//     subject_filter: '',
//     qualification_filter: '',
//     experience_filter: '',
//     status_filter: '',
//     gender_filter: ''
//   })

//   // Form states
//   const [formData, setFormData] = useState<Partial<Teacher>>({})
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({})
//   const [submitting, setSubmitting] = useState(false)
//   const [profilePicture, setProfilePicture] = useState<File | null>(null)
//   const [profilePictureUrl, setProfilePictureUrl] = useState<string>('')
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null)

//   // Notification state
//   const [notification, setNotification] = useState<NotificationState>({
//     show: false,
//     type: 'info',
//     title: '',
//     message: ''
//   })

//   // Show notification helper
//   const showNotification = (type: NotificationState['type'], title: string, message: string) => {
//     setNotification({ show: true, type, title, message })
//     setTimeout(() => {
//       setNotification(prev => ({ ...prev, show: false }))
//     }, 5000)
//   }

//   // Supabase Service Functions
//   const createTeacher = async (teacher: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>): Promise<Teacher> => {
//     console.log('Creating teacher:', teacher)
    
//     const { data, error } = await supabase
//       .from('teachers')
//       .insert(teacher)
//       .select()
//       .single()

//     if (error) {
//       console.error('Database error:', error)
//       throw error
//     }
    
//     console.log('Teacher created successfully:', data)
//     return data
//   }

//   const getTeachers = async (filters: TeacherFilters, page = 1, limit = 10) => {
//     console.log('Fetching teachers from database...')
    
//     let query = supabase
//       .from('teachers')
//       .select('*', { count: 'exact' })

//     // Apply filters
//     if (filters.search) {
//       query = query.or(`full_name.ilike.%${filters.search}%,employee_id.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
//     }
    
//     if (filters.subject_filter) {
//       query = query.ilike('subject_specialization', `%${filters.subject_filter}%`)
//     }
    
//     if (filters.qualification_filter) {
//       query = query.ilike('qualification', `%${filters.qualification_filter}%`)
//     }
    
//     if (filters.experience_filter) {
//       const expValue = parseInt(filters.experience_filter)
//       if (!isNaN(expValue)) {
//         query = query.gte('experience_years', expValue)
//       }
//     }
    
//     if (filters.status_filter) {
//       query = query.eq('status', filters.status_filter)
//     }
    
//     if (filters.gender_filter) {
//       query = query.eq('gender', filters.gender_filter)
//     }

//     // Pagination
//     const from = (page - 1) * limit
//     const to = from + limit - 1

//     const { data, error, count } = await query
//       .range(from, to)
//       .order('created_at', { ascending: false })

//     if (error) {
//       console.error('Error fetching teachers:', error)
//       throw error
//     }

//     console.log('Fetched teachers:', data?.length, 'Total count:', count)
    
//     return {
//       teachers: data || [],
//       total: count || 0
//     }
//   }

//   const updateTeacher = async (id: string, teacher: Partial<Teacher>): Promise<Teacher> => {
//     console.log('Updating teacher:', id, teacher)
    
//     const { data, error } = await supabase
//       .from('teachers')
//       .update(teacher)
//       .eq('id', id)
//       .select()
//       .single()

//     if (error) {
//       console.error('Update error:', error)
//       throw error
//     }
    
//     console.log('Teacher updated successfully:', data)
//     return data
//   }

//   const deleteTeacher = async (id: string): Promise<void> => {
//     console.log('Deleting teacher:', id)
    
//     const { error } = await supabase
//       .from('teachers')
//       .delete()
//       .eq('id', id)

//     if (error) {
//       console.error('Delete error:', error)
//       throw error
//     }
    
//     console.log('Teacher deleted successfully')
//   }

//   // Upload Profile Picture Function
//   const uploadProfilePicture = async (file: File, teacherId: string): Promise<string> => {
//     console.log('Starting upload for teacher:', teacherId)
//     console.log('File details:', {
//       name: file.name,
//       size: file.size,
//       type: file.type
//     })

//     // Validate file
//     if (!file) {
//       throw new Error('No file provided')
//     }

//     if (file.size > 10 * 1024 * 1024) { // 10MB limit
//       throw new Error('File size too large. Maximum 10MB allowed.')
//     }

//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
//     if (!allowedTypes.includes(file.type)) {
//       throw new Error(`File type ${file.type} not allowed. Only JPEG, PNG, GIF, and WebP are supported.`)
//     }

//     try {
//       const fileExt = file.name.split('.').pop()?.toLowerCase()
//       const fileName = `${teacherId}-${Date.now()}.${fileExt}`
//       const filePath = `teacher-profiles/${fileName}`

//       console.log('Uploading to bucket: teacher-profiles')
//       console.log('Upload path:', filePath)

//       // Upload to public bucket (create teacher-profiles bucket first)
//       const { data, error: uploadError } = await supabase.storage
//         .from('teacher-profiles')
//         .upload(filePath, file, {
//           cacheControl: '3600',
//           upsert: true
//         })

//       if (uploadError) {
//         console.error('Storage upload error:', uploadError)
//         throw new Error(`Upload failed: ${uploadError.message}`)
//       }

//       console.log('Upload successful:', data)

//       // Get public URL
//       const { data: urlData } = supabase.storage
//         .from('teacher-profiles')
//         .getPublicUrl(filePath)

//       console.log('Public URL generated:', urlData.publicUrl)
//       return urlData.publicUrl

//     } catch (error: any) {
//       console.error('Upload function error:', error)
//       throw error
//     }
//   }

//   // Load teachers with enhanced error handling
//   const loadTeachers = async (showLoadingSpinner = true) => {
//     try {
//       if (showLoadingSpinner) {
//         setLoading(true)
//       } else {
//         setRefreshing(true)
//       }
      
//       console.log('Loading teachers with filters:', filters)
//       const result = await getTeachers(filters, currentPage, pageSize)
//       setTeachers(result.teachers)
//       setTotal(result.total)
//       console.log('Teachers loaded successfully:', result.teachers.length, 'teachers')
      
//     } catch (error) {
//       console.error('Error loading teachers:', error)
//       showNotification('error', 'Loading Failed', 'Failed to load teachers. Please try again.')
//       setTeachers([])
//       setTotal(0)
//     } finally {
//       setLoading(false)
//       setRefreshing(false)
//     }
//   }

//   useEffect(() => {
//     loadTeachers()
//   }, [filters, currentPage])

//   // Auto-refresh every 30 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       loadTeachers(false)
//     }, 30000)

//     return () => clearInterval(interval)
//   }, [filters, currentPage])

//   // Form Validation
//   const validateForm = (data: Partial<Teacher>): Record<string, string> => {
//     const errors: Record<string, string> = {}

//     if (!data.full_name || data.full_name.length < 2) {
//       errors.full_name = 'Full name must be at least 2 characters'
//     }
//     if (!data.employee_id) {
//       errors.employee_id = 'Employee ID is required'
//     }
//     if (!data.subject_specialization) {
//       errors.subject_specialization = 'Subject specialization is required'
//     }
//     if (!data.phone_number || data.phone_number.length < 10) {
//       errors.phone_number = 'Valid phone number is required'
//     }
//     if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
//       errors.email = 'Valid email is required'
//     }
//     if (!data.address || data.address.length < 5) {
//       errors.address = 'Address must be at least 5 characters'
//     }
//     if (!data.date_of_birth) {
//       errors.date_of_birth = 'Date of birth is required'
//     }
//     if (!data.date_of_joining) {
//       errors.date_of_joining = 'Date of joining is required'
//     }
//     if (!data.qualification) {
//       errors.qualification = 'Qualification is required'
//     }
//     if (!data.experience_years || data.experience_years < 0) {
//       errors.experience_years = 'Valid experience years required'
//     }
//     if (!data.salary || data.salary <= 0) {
//       errors.salary = 'Valid salary is required'
//     }
//     if (!data.gender) {
//       errors.gender = 'Gender is required'
//     }
//     if (!data.emergency_contact || data.emergency_contact.length < 10) {
//       errors.emergency_contact = 'Valid emergency contact is required'
//     }

//     return errors
//   }

//   // Enhanced form submission with proper error handling
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     const errors = validateForm(formData)
//     setFormErrors(errors)
    
//     if (Object.keys(errors).length > 0) {
//       showNotification('error', 'Validation Error', 'Please fix the errors in the form.')
//       return
//     }

//     try {
//       setSubmitting(true)

//       const teacherData: Omit<Teacher, 'id' | 'created_at' | 'updated_at'> = {
//         full_name: formData.full_name!,
//         employee_id: formData.employee_id!,
//         subject_specialization: formData.subject_specialization!,
//         phone_number: formData.phone_number!,
//         email: formData.email!,
//         address: formData.address!,
//         date_of_birth: formData.date_of_birth!,
//         date_of_joining: formData.date_of_joining!,
//         qualification: formData.qualification!,
//         experience_years: formData.experience_years!,
//         salary: formData.salary!,
//         gender: formData.gender!,
//         emergency_contact: formData.emergency_contact!,
//         status: formData.status || 'active',
//       }

//       let savedTeacher: Teacher

//       if (showEditModal && selectedTeacher) {
//         savedTeacher = await updateTeacher(selectedTeacher.id!, teacherData)
//         setShowEditModal(false)
//         showNotification('success', 'Teacher Updated', `${savedTeacher.full_name} has been updated successfully.`)
//       } else {
//         savedTeacher = await createTeacher(teacherData)
//         setShowAddModal(false)
//         showNotification('success', 'Teacher Added', `${savedTeacher.full_name} has been added successfully.`)
//       }

//       console.log('Teacher saved successfully:', savedTeacher)

//       // Handle profile picture upload separately
//       if (profilePicture && savedTeacher.id) {
//         try {
//           const imageUrl = await uploadProfilePicture(profilePicture, savedTeacher.id)
//           await updateTeacher(savedTeacher.id, { profile_picture: imageUrl })
//           console.log('Profile picture uploaded successfully')
//           showNotification('info', 'Image Uploaded', 'Profile picture uploaded successfully.')
//         } catch (imageError: any) {
//           console.warn('Profile picture upload failed (but teacher was saved):', imageError)
//           const imageErrorMessage = imageError?.message || 'Unknown image upload error'
//           showNotification('warning', 'Image Upload Failed', `Teacher saved but profile picture upload failed: ${imageErrorMessage}`)
//         }
//       }

//       // Reset form
//       resetForm()
      
//       // Auto-refresh after 1 second delay
//       setTimeout(async () => {
//         await loadTeachers(false)
//         showNotification('info', 'Data Refreshed', 'Teacher list has been updated.')
//       }, 1000)
      
//     } catch (error: any) {
//       console.error('Error saving teacher:', error)
      
//       let errorMessage = 'An unexpected error occurred'
      
//       if (error && typeof error === 'object') {
//         if (error.message && typeof error.message === 'string') {
//           errorMessage = error.message
//         } else if (error.toString && typeof error.toString === 'function') {
//           errorMessage = error.toString()
//         } else if (error.code) {
//           errorMessage = `Error code: ${error.code}`
//         }
//       } else if (typeof error === 'string') {
//         errorMessage = error
//       }
      
//       showNotification('error', 'Save Failed', `Failed to save teacher: ${errorMessage}`)
      
//       setTimeout(() => {
//         loadTeachers(false)
//       }, 2000)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   // Delete confirmation with proper error handling
//   const handleDeleteConfirm = async () => {
//     if (selectedTeacher) {
//       try {
//         setSubmitting(true)
//         await deleteTeacher(selectedTeacher.id!)
//         setShowDeleteModal(false)
//         setSelectedTeacher(null)
//         showNotification('success', 'Teacher Deleted', `${selectedTeacher.full_name} has been deleted successfully.`)
        
//         setTimeout(() => {
//           loadTeachers(false)
//         }, 1000)
        
//       } catch (error: any) {
//         console.error('Error deleting teacher:', error)
        
//         let errorMessage = 'Unknown error occurred'
        
//         if (error && typeof error === 'object') {
//           if (error.message && typeof error.message === 'string') {
//             errorMessage = error.message
//           } else if (error.toString && typeof error.toString === 'function') {
//             errorMessage = error.toString()
//           } else if (error.code) {
//             errorMessage = `Error code: ${error.code}`
//           }
//         } else if (typeof error === 'string') {
//           errorMessage = error
//         }
        
//         showNotification('error', 'Delete Failed', `Failed to delete teacher: ${errorMessage}`)
//       } finally {
//         setSubmitting(false)
//       }
//     }
//   }

//   // Reset form helper
//   const resetForm = () => {
//     setFormData({})
//     setFormErrors({})
//     setProfilePicture(null)
//     setProfilePictureUrl('')
//     setSelectedTeacher(null)
//   }

//   // Handle actions
//   const handleEdit = (teacher: Teacher) => {
//     setSelectedTeacher(teacher)
//     setFormData(teacher)
//     setProfilePictureUrl(teacher.profile_picture || '')
//     setShowEditModal(true)
//   }

//   const handleView = (teacher: Teacher) => {
//     setSelectedTeacher(teacher)
//     setShowViewModal(true)
//   }

//   const handleDelete = (teacher: Teacher) => {
//     setSelectedTeacher(teacher)
//     setShowDeleteModal(true)
//   }

//   const handleFilterChange = (newFilters: Partial<TeacherFilters>) => {
//     setFilters(prev => ({ ...prev, ...newFilters }))
//     setCurrentPage(1)
//   }

//   // Image Upload Handler with proper validation
//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (file) {
//       if (file.size > 10 * 1024 * 1024) {
//         showNotification('error', 'File Too Large', 'Profile picture must be less than 10MB.')
//         return
//       }
      
//       if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
//         showNotification('error', 'Invalid File Type', 'Please select a valid image file (JPG, PNG, GIF, or WebP).')
//         return
//       }
      
//       setProfilePicture(file)
//       const url = URL.createObjectURL(file)
//       setProfilePictureUrl(url)
      
//       showNotification('info', 'Image Selected', 'Profile picture selected successfully.')
//     }
//   }

//   // Cleanup blob URLs
//   useEffect(() => {
//     return () => {
//       if (profilePictureUrl && profilePictureUrl.startsWith('blob:')) {
//         URL.revokeObjectURL(profilePictureUrl)
//       }
//     }
//   }, [profilePictureUrl])

//   // Export to CSV
//   const exportToCSV = async () => {
//     try {
//       showNotification('info', 'Exporting...', 'Preparing CSV file for download.')
      
//       const { data, error } = await supabase
//         .from('teachers')
//         .select('*')
//         .order('created_at', { ascending: false })

//       if (error) throw error

//       const csvContent = [
//         'Full Name,Employee ID,Subject,Phone,Email,Qualification,Experience,Salary,Status,Gender,Address,Emergency Contact',
//         ...data.map(teacher => [
//           teacher.full_name,
//           teacher.employee_id,
//           teacher.subject_specialization,
//           teacher.phone_number,
//           teacher.email,
//           teacher.qualification,
//           teacher.experience_years,
//           teacher.salary,
//           teacher.status,
//           teacher.gender,
//           teacher.address?.replace(/,/g, ';') || '',
//           teacher.emergency_contact
//         ].join(','))
//       ].join('\n')

//       const blob = new Blob([csvContent], { type: 'text/csv' })
//       const url = URL.createObjectURL(blob)
//       const link = document.createElement('a')
//       link.href = url
//       link.download = `teachers-${new Date().toISOString().split('T')[0]}.csv`
//       link.click()
//       URL.revokeObjectURL(url)
      
//       showNotification('success', 'Export Complete', 'Teacher data exported successfully.')
//     } catch (error) {
//       console.error('Error exporting CSV:', error)
//       showNotification('error', 'Export Failed', 'Failed to export teacher data.')
//     }
//   }

//   const totalPages = Math.ceil(total / pageSize)

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* Notification */}
//       {notification.show && (
//         <div className={`fixed top-4 right-4 z-50 max-w-md w-full transition-all duration-300 ${
//           notification.show ? 'translate-x-0' : 'translate-x-full'
//         }`}>
//           <div className={`rounded-lg shadow-lg border-l-4 p-4 ${
//             notification.type === 'success' ? 'bg-green-50 border-green-400' :
//             notification.type === 'error' ? 'bg-red-50 border-red-400' :
//             notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
//             'bg-blue-50 border-blue-400'
//           }`}>
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 {notification.type === 'success' && <CheckCircleIcon className="h-5 w-5 text-green-400" />}
//                 {notification.type === 'error' && <AlertCircleIcon className="h-5 w-5 text-red-400" />}
//                 {notification.type === 'warning' && <AlertCircleIcon className="h-5 w-5 text-yellow-400" />}
//                 {notification.type === 'info' && <InfoIcon className="h-5 w-5 text-blue-400" />}
//               </div>
//               <div className="ml-3">
//                 <h3 className={`text-sm font-medium ${
//                   notification.type === 'success' ? 'text-green-800' :
//                   notification.type === 'error' ? 'text-red-800' :
//                   notification.type === 'warning' ? 'text-yellow-800' :
//                   'text-blue-800'
//                 }`}>
//                   {notification.title}
//                 </h3>
//                 <p className={`text-sm mt-1 ${
//                   notification.type === 'success' ? 'text-green-700' :
//                   notification.type === 'error' ? 'text-red-700' :
//                   notification.type === 'warning' ? 'text-yellow-700' :
//                   'text-blue-700'
//                 }`}>
//                   {notification.message}
//                 </p>
//               </div>
//               <div className="ml-auto pl-3">
//                 <button
//                   onClick={() => setNotification(prev => ({ ...prev, show: false }))}
//                   className={`text-sm ${
//                     notification.type === 'success' ? 'text-green-500 hover:text-green-700' :
//                     notification.type === 'error' ? 'text-red-500 hover:text-red-700' :
//                     notification.type === 'warning' ? 'text-yellow-500 hover:text-yellow-700' :
//                     'text-blue-500 hover:text-blue-700'
//                   }`}
//                 >
//                   <XIcon className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center space-x-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
//             <p className="text-gray-600 mt-1">Manage teacher records and information</p>
//           </div>
          
//           {refreshing && (
//             <div className="flex items-center text-blue-600">
//               <RefreshCwIcon className="h-4 w-4 animate-spin mr-2" />
//               <span className="text-sm">Refreshing...</span>
//             </div>
//           )}
//         </div>
        
//         <div className="flex items-center space-x-3">
//           {/* Manual Refresh Button */}
//           <button
//             onClick={() => loadTeachers(false)}
//             disabled={refreshing}
//             className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
//           >
//             <RefreshCwIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
//             <span>Refresh</span>
//           </button>
          
//           {/* Export/Import Menu */}
//           <div className="relative">
//             <button
//               onClick={() => setShowExportMenu(!showExportMenu)}
//               className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//             >
//               <MoreVerticalIcon className="h-4 w-4" />
//               <span>Actions</span>
//             </button>
            
//             {showExportMenu && (
//               <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
//                 <div className="py-1">
//                   <button
//                     onClick={() => {
//                       exportToCSV()
//                       setShowExportMenu(false)
//                     }}
//                     className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
//                   >
//                     <FileDownIcon className="h-4 w-4 mr-3" />
//                     Export CSV
//                   </button>
//                   <button
//                     onClick={() => setShowExportMenu(false)}
//                     className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
//                   >
//                     <FileUpIcon className="h-4 w-4 mr-3" />
//                     Import CSV
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           <button
//             onClick={() => {
//               resetForm()
//               setShowAddModal(true)
//             }}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
//           >
//             <PlusIcon className="h-4 w-4" />
//             <span>Add Teacher</span>
//           </button>
//         </div>
//       </div>

//       {/* Search and Filters */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
//         <div className="p-4">
//           <div className="flex items-center space-x-4">
//             {/* Search */}
//             <div className="flex-1 relative">
//               <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <input
//                 type="text"
//                 placeholder="Search teachers by name, employee ID, or email..."
//                 value={filters.search}
//                 onChange={(e) => handleFilterChange({ search: e.target.value })}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
            
//             {/* Filter Toggle */}
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className={`px-4 py-2 rounded-lg border flex items-center space-x-2 transition-colors duration-200 ${
//                 showFilters 
//                   ? 'bg-blue-50 border-blue-200 text-blue-700' 
//                   : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <FilterIcon className="h-4 w-4" />
//               <span>Filters</span>
//             </button>
//           </div>

//           {/* Filter Panel */}
//           {showFilters && (
//             <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
//                   <input
//                     type="text"
//                     placeholder="Subject specialization"
//                     value={filters.subject_filter}
//                     onChange={(e) => handleFilterChange({ subject_filter: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
//                   <select
//                     value={filters.qualification_filter}
//                     onChange={(e) => handleFilterChange({ qualification_filter: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="">All Qualifications</option>
//                     <option value="B.Ed">B.Ed</option>
//                     <option value="M.Ed">M.Ed</option>
//                     <option value="Ph.D">Ph.D</option>
//                     <option value="B.A">B.A</option>
//                     <option value="M.A">M.A</option>
//                     <option value="B.Sc">B.Sc</option>
//                     <option value="M.Sc">M.Sc</option>
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
//                   <select
//                     value={filters.experience_filter}
//                     onChange={(e) => handleFilterChange({ experience_filter: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="">All Experience</option>
//                     <option value="0">0+ years</option>
//                     <option value="1">1+ years</option>
//                     <option value="5">5+ years</option>
//                     <option value="10">10+ years</option>
//                     <option value="15">15+ years</option>
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//                   <select
//                     value={filters.gender_filter}
//                     onChange={(e) => handleFilterChange({ gender_filter: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="">All Genders</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                   <select
//                     value={filters.status_filter}
//                     onChange={(e) => handleFilterChange({ status_filter: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="">All Status</option>
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                     <option value="on_leave">On Leave</option>
//                   </select>
//                 </div>
//               </div>
              
//               <div className="mt-4">
//                 <button
//                   onClick={() => {
//                     setFilters({
//                       search: '',
//                       subject_filter: '',
//                       qualification_filter: '',
//                       experience_filter: '',
//                       status_filter: '',
//                       gender_filter: ''
//                     })
//                     setCurrentPage(1)
//                   }}
//                   className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
//                 >
//                   Reset Filters
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Teachers Table */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         {loading ? (
//           <div className="p-8 text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="text-gray-500 mt-2">Loading teachers...</p>
//           </div>
//         ) : teachers.length === 0 ? (
//           <div className="p-8 text-center">
//             <GraduationCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-500 text-lg">No teachers found</p>
//             <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Teacher
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Subject & Experience
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Contact Details
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {teachers.map((teacher) => (
//                   <tr key={teacher.id} className="hover:bg-gray-50 transition-colors duration-200">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-10 w-10 flex-shrink-0">
//                           {teacher.profile_picture ? (
//                             <img
//                               className="h-10 w-10 rounded-full object-cover"
//                               src={teacher.profile_picture}
//                               alt={teacher.full_name}
//                             />
//                           ) : (
//                             <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                               <GraduationCapIcon className="h-6 w-6 text-gray-400" />
//                             </div>
//                           )}
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             {teacher.full_name}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             ID: {teacher.employee_id}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
                    
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">
//                         {teacher.subject_specialization}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {teacher.experience_years} years experience
//                       </div>
//                     </td>
                    
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900 flex items-center">
//                         <PhoneIcon className="h-4 w-4 mr-1" />
//                         {teacher.phone_number}
//                       </div>
//                       <div className="text-sm text-gray-500 flex items-center">
//                         <MailIcon className="h-4 w-4 mr-1" />
//                         {teacher.email}
//                       </div>
//                     </td>
                    
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         teacher.status === 'active' ? 'bg-green-100 text-green-800' :
//                         teacher.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-red-100 text-red-800'
//                       }`}>
//                         {teacher.status === 'on_leave' ? 'On Leave' : teacher.status}
//                       </span>
//                     </td>
                    
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <div className="relative">
//                         <button
//                           onClick={() => setOpenDropdown(openDropdown === teacher.id ? null : teacher.id!)}
//                           className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
//                         >
//                           <MoreVerticalIcon className="h-5 w-5" />
//                         </button>
                        
//                         {openDropdown === teacher.id && (
//                           <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
//                             <div className="py-1">
//                               <button
//                                 onClick={() => {
//                                   handleView(teacher)
//                                   setOpenDropdown(null)
//                                 }}
//                                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
//                               >
//                                 <EyeIcon className="h-4 w-4 mr-3" />
//                                 View Teacher
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   handleEdit(teacher)
//                                   setOpenDropdown(null)
//                                 }}
//                                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
//                               >
//                                 <EditIcon className="h-4 w-4 mr-3" />
//                                 Edit Teacher
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   handleDelete(teacher)
//                                   setOpenDropdown(null)
//                                 }}
//                                 className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
//                               >
//                                 <TrashIcon className="h-4 w-4 mr-3" />
//                                 Delete Teacher
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="px-6 py-4 border-t border-gray-200">
//             <div className="flex items-center justify-between">
//               <p className="text-sm text-gray-700">
//                 Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} results
//               </p>
              
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//                 >
//                   Previous
//                 </button>
                
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   const page = i + 1
//                   return (
//                     <button
//                       key={page}
//                       onClick={() => setCurrentPage(page)}
//                       className={`px-3 py-1 rounded text-sm ${
//                         currentPage === page
//                           ? 'bg-blue-600 text-white'
//                           : 'border border-gray-300 hover:bg-gray-50'
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   )
//                 })}
                
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Add/Edit Teacher Modal */}
//       {(showAddModal || showEditModal) && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             {/* Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-900">
//                 {showEditModal ? 'Edit Teacher' : 'Add New Teacher'}
//               </h2>
//               <button
//                 onClick={() => {
//                   setShowAddModal(false)
//                   setShowEditModal(false)
//                   resetForm()
//                 }}
//                 className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
//               >
//                 <XIcon className="h-6 w-6" />
//               </button>
//             </div>

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="p-6 space-y-6">
//               {/* Profile Picture Upload */}
//               <div className="flex justify-center">
//                 <div className="flex flex-col items-center">
//                   {profilePictureUrl ? (
//                     <div className="relative">
//                       <img
//                         src={profilePictureUrl}
//                         alt="Profile preview"
//                         className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setProfilePicture(null)
//                           setProfilePictureUrl('')
//                         }}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
//                       >
//                         <XIcon className="h-3 w-3" />
//                       </button>
//                     </div>
//                   ) : (
//                     <label className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageUpload}
//                         className="hidden"
//                       />
//                       <CameraIcon className="h-8 w-8 text-gray-400" />
//                     </label>
//                   )}
                  
//                   <p className="text-xs text-gray-500 mt-2 text-center">
//                     📸 Click to upload profile picture<br />
//                     Max size: 10MB (JPG, PNG, GIF, WebP)
//                   </p>
//                 </div>
//               </div>

//               {/* Form Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* Personal Information */}
//                 <div className="md:col-span-3">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
//                 </div>

//                 {/* Full Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Full Name *
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.full_name || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter full name"
//                   />
//                   {formErrors.full_name && (
//                     <p className="text-red-500 text-sm mt-1">{formErrors.full_name}</p>
//                   )}
//                 </div>

//                 {/* Employee ID */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Employee ID *
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.employee_id || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, employee_id: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter employee ID"
//                   />
//                   {formErrors.employee_id && (
//                     <p className="text-red-500 text-sm mt-1">{formErrors.employee_id}</p>
//                   )}
//                 </div>

//                 {/* Gender */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Gender *
//                   </label>
//                   <select
//                     value={formData.gender || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' | 'other' }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                   {formErrors.gender && (
//                     <p className="text-red-500 text-sm mt-1">{formErrors.gender}</p>
//                   )}
//                 </div>

//                 {/* Date of Birth */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Date of Birth *
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.date_of_birth || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                   {formErrors.date_of_birth && (
//                     <p className="text-red-500 text-sm mt-1">{formErrors.date_of_birth}</p>
//                   )}
//                 </div>

//                 {/* Phone Number */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Phone Number *
//                   </label>
//                   <input
//                     type="tel"
//                     value={formData.phone_number || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter phone number"
//                   />
//                   {formErrors.phone_number && (
//                     <p className="text-red-500 text-sm mt-1">{formErrors.phone_number}</p>
//                   )}
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Email *
//                   </label>
//                   <input
//                     type="email"
//                     value={formData.email || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter email address"
//                   />
//                   {formErrors.email && (
//                     <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
//                   )}
//                 </div>

//                 {/* Professional Information */}
//                 <div className="md:col-span-3 mt-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
//                 </div>

//                 {/* Subject Specialization */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Subject Specialization *
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.subject_specialization || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, subject_specialization: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="e.g., Mathematics, English, Science"
//                   />
//                   {formErrors.subject_specialization && (
//                     <p className="text-red-500 text-sm mt-1">{formErrors.subject_specialization}</p>
//                   )}
//                 </div>

//                 {/* Qualification */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Qualification *
//                   </label>
//                   <select
//                     value={formData.qualification || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="">Select Qualification</option>
//                     <option value="B.Ed">B.Ed</option>
//                     <option value="M.Ed">M.Ed</option>
//                     <option value="Ph.D">Ph.D</option>
//                     <option value="B.A">B.A</option>
//                     <option value="M.A">M.A</option>
//                     <option value="B.Sc">B.Sc</option>
//                     <option value="M.Sc">M.Sc</option>
//                     <option value="B.Com">B.Com</option>
//                     <option value="M.Com">M.Com</option>
//                   </select>
//                   {formErrors.qualification && (
//                     <p className="text-red-500 text-sm mt-1">{formErrors.qualification}</p>
//                   )}
//                 </div>

//                 {/* Experience Years */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Experience (Years) *
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     max="50"
//                     value={formData.experience_years || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Years of experience"
//                   />
//                   {formErrors.experience_years && (
//                     <p className="text-red-500 text-sm mt-1">{formErrors.experience_years}</p>
//                   )}
//                 </div>

//                 {/* Date of Joining */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Date of Joining *
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.date_of_joining || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, date_of_joining: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                   {formErrors.date_of_joining && (
//                     <p className="text-red-500 text-sm mt-1">{formErrors.date_of_joining}</p>
//                   )}
//                 </div>

//                 {/* Salary */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Salary *
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     value={formData.salary || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, salary: parseInt(e.target.value) || 0 }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Monthly salary"
//                   />
//                   {formErrors.salary && (
//                     <p className="text-red-500 text-sm mt-1">{formErrors.salary}</p>
//                   )}
//                 </div>

//                 {/* Status (for edit mode) */}
//                 {showEditModal && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Status
//                     </label>
//                     <select
//                       value={formData.status || 'active'}
//                       onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' | 'on_leave' }))}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="active">Active</option>
//                       <option value="inactive">Inactive</option>
//                       <option value="on_leave">On Leave</option>
//                     </select>
//                   </div>
//                 )}

//                 {/* Contact Information */}
//                 <div className="md:col-span-3 mt-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
//                 </div>

//                 {/* Emergency Contact */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Emergency Contact *
//                   </label>
//                   <input
//                     type="tel"
//                     value={formData.emergency_contact || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Emergency contact number"
//                   />
//                   {formErrors.emergency_contact && (
//                     <p className="text-red-500 text-sm mt-1">{formErrors.emergency_contact}</p>
//                   )}
//                 </div>

//                 {/* Address */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Address *
//                   </label>
//                   <textarea
//                     rows={3}
//                     value={formData.address || ''}
//                     onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter complete address"
//                   />
//                   {formErrors.address && (
//                     <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
//                   )}
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowAddModal(false)
//                     setShowEditModal(false)
//                     resetForm()
//                   }}
//                   className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors duration-200"
//                 >
//                   {submitting && <LoaderIcon className="h-4 w-4 animate-spin" />}
//                   <span>{submitting ? 'Saving...' : (showEditModal ? 'Update Teacher' : 'Create Teacher')}</span>
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* View Teacher Modal */}
//       {showViewModal && selectedTeacher && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             {/* Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-900">Teacher Details</h2>
//               <button
//                 onClick={() => {
//                   setShowViewModal(false)
//                   setSelectedTeacher(null)
//                 }}
//                 className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
//               >
//                 <XIcon className="h-6 w-6" />
//               </button>
//             </div>

//             {/* Content */}
//             <div className="p-6">
//               {/* Profile Picture */}
//               <div className="flex justify-center mb-6">
//                 {selectedTeacher.profile_picture ? (
//                   <img
//                     src={selectedTeacher.profile_picture}
//                     alt={selectedTeacher.full_name}
//                     className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
//                     <GraduationCapIcon className="h-12 w-12 text-gray-400" />
//                   </div>
//                 )}
//               </div>

//               {/* Details Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* Personal Information */}
//                 <div className="md:col-span-3">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
//                   <p className="text-gray-900">{selectedTeacher.full_name}</p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">Employee ID</label>
//                   <p className="text-gray-900">{selectedTeacher.employee_id}</p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
//                   <p className="text-gray-900 capitalize">{selectedTeacher.gender}</p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
//                   <p className="text-gray-900">{new Date(selectedTeacher.date_of_birth).toLocaleDateString()}</p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
//                   <p className="text-gray-900 flex items-center">
//                     <PhoneIcon className="h-4 w-4 mr-1" />
//                     {selectedTeacher.phone_number}
//                   </p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
//                   <p className="text-gray-900 flex items-center">
//                     <MailIcon className="h-4 w-4 mr-1" />
//                     {selectedTeacher.email}
//                   </p>
//                 </div>

//                 {/* Professional Information */}
//                 <div className="md:col-span-3 mt-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">Subject Specialization</label>
//                   <p className="text-gray-900">{selectedTeacher.subject_specialization}</p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">Qualification</label>
//                   <p className="text-gray-900">{selectedTeacher.qualification}</p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">Experience</label>
//                   <p className="text-gray-900">{selectedTeacher.experience_years} years</p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">Date of Joining</label>
//                   <p className="text-gray-900 flex items-center">
//                     <CalendarIcon className="h-4 w-4 mr-1" />
//                     {new Date(selectedTeacher.date_of_joining).toLocaleDateString()}
//                   </p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">Salary</label>
//                   <p className="text-gray-900">₹{selectedTeacher.salary.toLocaleString()}</p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
//                   <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                     selectedTeacher.status === 'active' ? 'bg-green-100 text-green-800' :
//                     selectedTeacher.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {selectedTeacher.status === 'on_leave' ? 'On Leave' : selectedTeacher.status}
//                   </span>
//                 </div>

//                 {/* Contact Information */}
//                 <div className="md:col-span-3 mt-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">Emergency Contact</label>
//                   <p className="text-gray-900 flex items-center">
//                     <PhoneIcon className="h-4 w-4 mr-1" />
//                     {selectedTeacher.emergency_contact}
//                   </p>
//                 </div>
                
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
//                   <p className="text-gray-900 flex items-start">
//                     <MapPinIcon className="h-4 w-4 mr-1 mt-0.5" />
//                     {selectedTeacher.address}
//                   </p>
//                 </div>
//               </div>
//             </div>
            
//             {/* Footer */}
//             <div className="flex justify-end p-6 border-t border-gray-200">
//               <button
//                 onClick={() => {
//                   setShowViewModal(false)
//                   setSelectedTeacher(null)
//                 }}
//                 className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && selectedTeacher && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
//             <div className="p-6">
//               <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
//                 <TrashIcon className="h-6 w-6 text-red-600" />
//               </div>
              
//               <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
//                 Delete Teacher
//               </h3>
              
//               <p className="text-gray-600 text-center mb-6">
//                 Are you sure you want to delete <strong>{selectedTeacher.full_name}</strong>? 
//                 This action cannot be undone and will permanently remove all teacher data.
//               </p>
              
//               <div className="flex justify-center space-x-3">
//                 <button
//                   onClick={() => {
//                     setShowDeleteModal(false)
//                     setSelectedTeacher(null)
//                   }}
//                   disabled={submitting}
//                   className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDeleteConfirm}
//                   disabled={submitting}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors duration-200"
//                 >
//                   {submitting && <LoaderIcon className="h-4 w-4 animate-spin" />}
//                   <span>{submitting ? 'Deleting...' : 'Delete Teacher'}</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
import React, { useState, useEffect, useCallback } from 'react'
import {
    PlusIcon,
    SearchIcon,
    FilterIcon,
    MoreVerticalIcon,
    EditIcon,
    TrashIcon,
    EyeIcon,
    DownloadIcon,
    UploadIcon,
    UserIcon,
    XIcon,
    CameraIcon,
    LoaderIcon,
    ChevronDownIcon,
    FileDownIcon,
    FileUpIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    InfoIcon,
    RefreshCwIcon,
    UsersIcon,
    GraduationCapIcon,
    CalendarIcon,
    PhoneIcon,
    MailIcon,
    MapPinIcon,
    BookOpenIcon,
    StarIcon,
    TrendingUpIcon,
    ActivityIcon,
    ShieldCheckIcon,
    ShieldXIcon,
    HashIcon,
    IdCardIcon,
    HomeIcon,
    ContactIcon,
    AwardIcon,
    UserCheckIcon,
    UserXIcon,
    Building2Icon,
    ClockIcon,
    Users2Icon,
    Settings2Icon,
    BarChart3Icon,
    BriefcaseIcon,
    DollarSignIcon,
    AlertTriangleIcon
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'


// Types
interface Teacher {
    id?: string
    full_name: string
    employee_id: string
    subject_specialization: string
    phone_number: string
    email: string
    address: string
    date_of_birth: string
    date_of_joining: string
    qualification: string
    experience_years: number
    salary: number
    profile_picture?: string
    status: 'active' | 'inactive' | 'on_leave'
    gender: 'male' | 'female' | 'other'
    emergency_contact: string
    created_at?: string
    updated_at?: string
}

interface TeacherFilters {
    search: string
    subject_filter: string
    qualification_filter: string
    experience_filter: string
    status_filter: string
    gender_filter: string
}

interface NotificationState {
    show: boolean
    type: 'success' | 'error' | 'info' | 'warning'
    title: string
    message: string
}

export const Teachers = () => {
    // State Management
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

    // Filter states
    const [showFilters, setShowFilters] = useState(false)
    const [showExportMenu, setShowExportMenu] = useState(false)
    const [filters, setFilters] = useState<TeacherFilters>({
        search: '',
        subject_filter: '',
        qualification_filter: '',
        experience_filter: '',
        status_filter: '',
        gender_filter: ''
    })

    // Form states
    const [formData, setFormData] = useState<Partial<Teacher>>({})
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)
    const [profilePicture, setProfilePicture] = useState<File | null>(null)
    const [profilePictureUrl, setProfilePictureUrl] = useState<string>('')
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)

    // Notification state
    const [notification, setNotification] = useState<NotificationState>({
        show: false,
        type: 'info',
        title: '',
        message: ''
    })

    // Show notification helper
    const showNotification = (type: NotificationState['type'], title: string, message: string) => {
        setNotification({ show: true, type, title, message })
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }))
        }, 5000)
    }

    // Supabase Service Functions
    const createTeacher = async (teacher: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>): Promise<Teacher> => {
        console.log('Creating teacher:', teacher)

        const { data, error } = await supabase
            .from('teachers')
            .insert(teacher)
            .select()
            .single()

        if (error) {
            console.error('Database error:', error)
            throw error
        }

        console.log('Teacher created successfully:', data)
        return data
    }

    const getTeachers = async (filters: TeacherFilters, page = 1, limit = 10) => {
        console.log('Fetching teachers from database...')

        let query = supabase
            .from('teachers')
            .select('*', { count: 'exact' })

        // Apply filters
        if (filters.search) {
            query = query.or(`full_name.ilike.%${filters.search}%,employee_id.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
        }

        if (filters.subject_filter) {
            query = query.ilike('subject_specialization', `%${filters.subject_filter}%`)
        }

        if (filters.qualification_filter) {
            query = query.ilike('qualification', `%${filters.qualification_filter}%`)
        }

        if (filters.experience_filter) {
            const expValue = parseInt(filters.experience_filter)
            if (!isNaN(expValue)) {
                query = query.gte('experience_years', expValue)
            }
        }

        if (filters.status_filter) {
            query = query.eq('status', filters.status_filter)
        }

        if (filters.gender_filter) {
            query = query.eq('gender', filters.gender_filter)
        }

        // Pagination
        const from = (page - 1) * limit
        const to = from + limit - 1

        const { data, error, count } = await query
            .range(from, to)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching teachers:', error)
            throw error
        }

        console.log('Fetched teachers:', data?.length, 'Total count:', count)

        return {
            teachers: data || [],
            total: count || 0
        }
    }

    const updateTeacher = async (id: string, teacher: Partial<Teacher>): Promise<Teacher> => {
        console.log('Updating teacher:', id, teacher)

        const { data, error } = await supabase
            .from('teachers')
            .update(teacher)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Update error:', error)
            throw error
        }

        console.log('Teacher updated successfully:', data)
        return data
    }

    const deleteTeacher = async (id: string): Promise<void> => {
        console.log('Deleting teacher:', id)

        const { error } = await supabase
            .from('teachers')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Delete error:', error)
            throw error
        }

        console.log('Teacher deleted successfully')
    }

    // Upload Profile Picture Function
    const uploadProfilePicture = async (file: File, teacherId: string): Promise<string> => {
        console.log('Starting upload for teacher:', teacherId)
        console.log('File details:', {
            name: file.name,
            size: file.size,
            type: file.type
        })

        // Validate file
        if (!file) {
            throw new Error('No file provided')
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            throw new Error('File size too large. Maximum 10MB allowed.')
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            throw new Error(`File type ${file.type} not allowed. Only JPEG, PNG, GIF, and WebP are supported.`)
        }

        try {
            const fileExt = file.name.split('.').pop()?.toLowerCase()
            const fileName = `${teacherId}-${Date.now()}.${fileExt}`
            const filePath = `teacher-profiles/${fileName}`

            console.log('Uploading to bucket: teacher-profiles')
            console.log('Upload path:', filePath)

            // Upload to public bucket
            const { data, error: uploadError } = await supabase.storage
                .from('teacher-profiles')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true  // Allow overwriting
                })

            if (uploadError) {
                console.error('Storage upload error:', uploadError)
                throw new Error(`Upload failed: ${uploadError.message}`)
            }

            console.log('Upload successful:', data)

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('teacher-profiles')
                .getPublicUrl(filePath)

            console.log('Public URL generated:', urlData.publicUrl)
            return urlData.publicUrl

        } catch (error: any) {
            console.error('Upload function error:', error)
            throw error
        }
    }

    // Load teachers with enhanced error handling
    const loadTeachers = async (showLoadingSpinner = true) => {
        try {
            if (showLoadingSpinner) {
                setLoading(true)
            } else {
                setRefreshing(true)
            }

            console.log('Loading teachers with filters:', filters)
            const result = await getTeachers(filters, currentPage, pageSize)
            setTeachers(result.teachers)
            setTotal(result.total)
            console.log('Teachers loaded successfully:', result.teachers.length, 'teachers')

        } catch (error) {
            console.error('Error loading teachers:', error)
            showNotification('error', 'Loading Failed', 'Failed to load teachers. Please try again.')
            setTeachers([])
            setTotal(0)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        loadTeachers()
    }, [filters, currentPage])

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            loadTeachers(false) // Refresh without loading spinner
        }, 30000)

        return () => clearInterval(interval)
    }, [filters, currentPage])

    // Form Validation
    const validateForm = (data: Partial<Teacher>): Record<string, string> => {
        const errors: Record<string, string> = {}

        if (!data.full_name || data.full_name.length < 2) {
            errors.full_name = 'Full name must be at least 2 characters'
        }
        if (!data.employee_id) {
            errors.employee_id = 'Employee ID is required'
        }
        if (!data.subject_specialization) {
            errors.subject_specialization = 'Subject specialization is required'
        }
        if (!data.phone_number || data.phone_number.length < 10) {
            errors.phone_number = 'Valid phone number is required'
        }
        if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = 'Valid email is required'
        }
        if (!data.address || data.address.length < 5) {
            errors.address = 'Address must be at least 5 characters'
        }
        if (!data.date_of_birth) {
            errors.date_of_birth = 'Date of birth is required'
        }
        if (!data.date_of_joining) {
            errors.date_of_joining = 'Date of joining is required'
        }
        if (!data.qualification) {
            errors.qualification = 'Qualification is required'
        }
        if (!data.experience_years || data.experience_years < 0) {
            errors.experience_years = 'Valid experience years required'
        }
        if (!data.salary || data.salary <= 0) {
            errors.salary = 'Valid salary is required'
        }
        if (!data.gender) {
            errors.gender = 'Gender is required'
        }
        if (!data.emergency_contact || data.emergency_contact.length < 10) {
            errors.emergency_contact = 'Valid emergency contact is required'
        }

        return errors
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

            const teacherData: Omit<Teacher, 'id' | 'created_at' | 'updated_at'> = {
                full_name: formData.full_name!,
                employee_id: formData.employee_id!,
                subject_specialization: formData.subject_specialization!,
                phone_number: formData.phone_number!,
                email: formData.email!,
                address: formData.address!,
                date_of_birth: formData.date_of_birth!,
                date_of_joining: formData.date_of_joining!,
                qualification: formData.qualification!,
                experience_years: formData.experience_years!,
                salary: formData.salary!,
                gender: formData.gender!,
                emergency_contact: formData.emergency_contact!,
                status: formData.status || 'active',
            }

            let savedTeacher: Teacher

            if (showEditModal && selectedTeacher) {
                // Update existing teacher
                savedTeacher = await updateTeacher(selectedTeacher.id!, teacherData)
                setShowEditModal(false)
                showNotification('success', 'Teacher Updated', `${savedTeacher.full_name} has been updated successfully.`)
            } else {
                // Create new teacher
                savedTeacher = await createTeacher(teacherData)
                setShowAddModal(false)
                showNotification('success', 'Teacher Added', `${savedTeacher.full_name} has been added successfully.`)
            }

            console.log('Teacher saved successfully:', savedTeacher)

            // Handle profile picture upload separately
            if (profilePicture && savedTeacher.id) {
                try {
                    const imageUrl = await uploadProfilePicture(profilePicture, savedTeacher.id)
                    await updateTeacher(savedTeacher.id, { profile_picture: imageUrl })
                    console.log('Profile picture uploaded successfully')
                    showNotification('info', 'Image Uploaded', 'Profile picture uploaded successfully.')
                } catch (imageError: any) {
                    console.warn('Profile picture upload failed (but teacher was saved):', imageError)
                    const imageErrorMessage = imageError?.message || 'Unknown image upload error'
                    showNotification('warning', 'Image Upload Failed', `Teacher saved but profile picture upload failed: ${imageErrorMessage}`)
                }
            }

            // Reset form
            resetForm()

            // Auto-refresh after 1 second delay
            setTimeout(async () => {
                await loadTeachers(false)
                showNotification('info', 'Data Refreshed', 'Teacher list has been updated.')
            }, 1000)

        } catch (error: any) {
            console.error('Error saving teacher:', error)

            // Safe error message extraction
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

            showNotification('error', 'Save Failed', `Failed to save teacher: ${errorMessage}`)

            // Still try to refresh in case the teacher was actually saved
            setTimeout(() => {
                loadTeachers(false)
            }, 2000)
        } finally {
            setSubmitting(false)
        }
    }

    // Delete confirmation with proper error handling
    const handleDeleteConfirm = async () => {
        if (selectedTeacher) {
            try {
                setSubmitting(true)
                await deleteTeacher(selectedTeacher.id!)
                setShowDeleteModal(false)
                setSelectedTeacher(null)
                showNotification('success', 'Teacher Deleted', `${selectedTeacher.full_name} has been deleted successfully.`)

                // Auto-refresh after delete
                setTimeout(() => {
                    loadTeachers(false)
                }, 1000)

            } catch (error: any) {
                console.error('Error deleting teacher:', error)

                // Safe error message extraction
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

                showNotification('error', 'Delete Failed', `Failed to delete teacher: ${errorMessage}`)
            } finally {
                setSubmitting(false)
            }
        }
    }

    // Reset form helper
    const resetForm = () => {
        setFormData({})
        setFormErrors({})
        setProfilePicture(null)
        setProfilePictureUrl('')
        setSelectedTeacher(null)
    }

    // Handle actions
    const handleEdit = (teacher: Teacher) => {
        setSelectedTeacher(teacher)
        setFormData(teacher)
        setProfilePictureUrl(teacher.profile_picture || '')
        setShowEditModal(true)
    }

    const handleView = (teacher: Teacher) => {
        setSelectedTeacher(teacher)
        setShowViewModal(true)
    }

    const handleDelete = (teacher: Teacher) => {
        setSelectedTeacher(teacher)
        setShowDeleteModal(true)
    }

    const handleFilterChange = (newFilters: Partial<TeacherFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }))
        setCurrentPage(1)
    }

    // Image Upload Handler with proper validation
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            // Check file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                showNotification('error', 'File Too Large', 'Profile picture must be less than 10MB.')
                return
            }

            // Check file type
            if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
                showNotification('error', 'Invalid File Type', 'Please select a valid image file (JPG, PNG, GIF, or WebP).')
                return
            }

            setProfilePicture(file)
            const url = URL.createObjectURL(file)
            setProfilePictureUrl(url)

            showNotification('info', 'Image Selected', 'Profile picture selected successfully.')
        }
    }

    // Cleanup blob URLs
    useEffect(() => {
        return () => {
            if (profilePictureUrl && profilePictureUrl.startsWith('blob:')) {
                URL.revokeObjectURL(profilePictureUrl)
            }
        }
    }, [profilePictureUrl])

    // Export to CSV
    const exportToCSV = async () => {
        try {
            showNotification('info', 'Exporting...', 'Preparing CSV file for download.')

            const { data, error } = await supabase
                .from('teachers')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            const csvContent = [
                'Full Name,Employee ID,Subject,Phone,Email,Qualification,Experience,Salary,Status,Gender,Address,Emergency Contact',
                ...data.map(teacher => [
                    teacher.full_name,
                    teacher.employee_id,
                    teacher.subject_specialization,
                    teacher.phone_number,
                    teacher.email,
                    teacher.qualification,
                    teacher.experience_years,
                    teacher.salary,
                    teacher.status,
                    teacher.gender,
                    teacher.address?.replace(/,/g, ';') || '',
                    teacher.emergency_contact
                ].join(','))
            ].join('\n')

            const blob = new Blob([csvContent], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `teachers-${new Date().toISOString().split('T')[0]}.csv`
            link.click()
            URL.revokeObjectURL(url)

            showNotification('success', 'Export Complete', 'Teacher data exported successfully.')
        } catch (error) {
            console.error('Error exporting CSV:', error)
            showNotification('error', 'Export Failed', 'Failed to export teacher data.')
        }
    }

    const totalPages = Math.ceil(total / pageSize)

    // Statistics calculations
    const activeTeachers = teachers.filter(t => t.status === 'active').length
    const onLeaveTeachers = teachers.filter(t => t.status === 'on_leave').length
    const maleTeachers = teachers.filter(t => t.gender === 'male').length
    const femaleTeachers = teachers.filter(t => t.gender === 'female').length

    // return (
    //     <div
    //         className="min-h-screen bg-gray-120 mb-6"
    //         style={{ height: 'calc(100vh - 6rem)' }}
    //     >
    //         <div className=" max-w-7xl mx-auto">
    //             {/* Enhanced Notification with animations */}
    //             {notification.show && (
    //                 <div className={`fixed top-4 right-4 z-50 max-w-md w-full transition-all duration-500 transform ${
    //                     notification.show ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-full scale-95 opacity-0'
    //                 }`}>
    //                     <div className={`rounded-xl shadow-2xl border-l-4 p-4 backdrop-blur-lg ${
    //                         notification.type === 'success' ? 'bg-green-50/90 border-green-400 shadow-green-100' :
    //                         notification.type === 'error' ? 'bg-red-50/90 border-red-400 shadow-red-100' :
    //                         notification.type === 'warning' ? 'bg-yellow-50/90 border-yellow-400 shadow-yellow-100' :
    //                         'bg-blue-50/90 border-blue-400 shadow-blue-100'
    //                     }`}>
    //                         <div className="flex">
    //                             <div className="flex-shrink-0">
    //                                 <div className={`rounded-full p-1 ${
    //                                     notification.type === 'success' ? 'bg-green-100' :
    //                                     notification.type === 'error' ? 'bg-red-100' :
    //                                     notification.type === 'warning' ? 'bg-yellow-100' :
    //                                     'bg-blue-100'
    //                                 }`}>
    //                                     {notification.type === 'success' && <CheckCircleIcon className="h-5 w-5 text-green-600" />}
    //                                     {notification.type === 'error' && <AlertCircleIcon className="h-5 w-5 text-red-600" />}
    //                                     {notification.type === 'warning' && <AlertCircleIcon className="h-5 w-5 text-yellow-600" />}
    //                                     {notification.type === 'info' && <InfoIcon className="h-5 w-5 text-blue-600" />}
    //                                 </div>
    //                             </div>
    //                             <div className="ml-3">
    //                                 <h3 className={`text-sm font-semibold ${
    //                                     notification.type === 'success' ? 'text-green-900' :
    //                                     notification.type === 'error' ? 'text-red-900' :
    //                                     notification.type === 'warning' ? 'text-yellow-900' :
    //                                     'text-blue-900'
    //                                 }`}>
    //                                     {notification.title}
    //                                 </h3>
    //                                 <p className={`text-sm mt-1 ${
    //                                     notification.type === 'success' ? 'text-green-800' :
    //                                     notification.type === 'error' ? 'text-red-800' :
    //                                     notification.type === 'warning' ? 'text-yellow-800' :
    //                                     'text-blue-800'
    //                                 }`}>
    //                                     {notification.message}
    //                                 </p>
    //                             </div>
    //                             <div className="ml-auto pl-3">
    //                                 <button
    //                                     onClick={() => setNotification(prev => ({ ...prev, show: false }))}
    //                                     className={`rounded-full p-1 transition-colors duration-200 ${
    //                                         notification.type === 'success' ? 'text-green-500 hover:bg-green-100' :
    //                                         notification.type === 'error' ? 'text-red-500 hover:bg-red-100' :
    //                                         notification.type === 'warning' ? 'text-yellow-500 hover:bg-yellow-100' :
    //                                         'text-blue-500 hover:bg-blue-100'
    //                                     }`}
    //                                 >
    //                                     <XIcon className="h-4 w-4" />
    //                                 </button>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             )}

    //             {/* Enhanced Header with gradient background and stats */}
    //             <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl mb-6 overflow-hidden">
    //                 <div className="bg-gradient-to-br from-green-500 to-green-600 px-4 py-6">
    //                     <div className="flex justify-between items-start">
    //                         <div className="flex items-center space-x-4">
    //                             <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
    //                                 <UsersIcon className="h-6 w-6 text-white" />
    //                             </div>
    //                             <div>
    //                                 <h1 className="text-2xl font-bold text-white mb-2">Teachers List</h1>
                                    
    //                                 {refreshing && (
    //                                     <div className="flex items-center text-blue-200 mt-2">
    //                                         <RefreshCwIcon className="h-4 w-4 animate-spin mr-2" />
    //                                         <span className="text-sm">Syncing data...</span>
    //                                     </div>
    //                                 )}
    //                             </div>
    //                         </div>

    //                         <div className="flex items-center space-x-3">
    //                             {/* Manual Refresh Button */}
    //                             <button
    //                                 onClick={() => loadTeachers(false)}
    //                                 disabled={refreshing}
    //                                 className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 disabled:opacity-50"
    //                             >
    //                                 <RefreshCwIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
    //                                 <span>Refresh</span>
    //                             </button>

    //                             {/* Export/Import Menu */}
    //                             <div className="relative">
    //                                 <button
    //                                     onClick={() => setShowExportMenu(!showExportMenu)}
    //                                     className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200"
    //                                 >
    //                                     <Settings2Icon className="h-4 w-4" />
    //                                     <span>Actions</span>
    //                                 </button>

    //                                 {showExportMenu && (
    //                                     <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 z-10 overflow-hidden">
    //                                         <div className="py-2">
    //                                             <button
    //                                                 onClick={() => {
    //                                                     exportToCSV()
    //                                                     setShowExportMenu(false)
    //                                                 }}
    //                                                 className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
    //                                             >
    //                                                 <FileDownIcon className="h-4 w-4 mr-3 text-blue-600" />
    //                                                 <span>Export CSV</span>
    //                                                 <span className="ml-auto text-xs text-gray-500">Download</span>
    //                                             </button>
    //                                             <button
    //                                                 onClick={() => setShowExportMenu(false)}
    //                                                 className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors duration-200"
    //                                             >
    //                                                 <FileUpIcon className="h-4 w-4 mr-3 text-green-600" />
    //                                                 <span>Import CSV</span>
    //                                                 <span className="ml-auto text-xs text-gray-500">Upload</span>
    //                                             </button>
    //                                         </div>
    //                                     </div>
    //                                 )}
    //                             </div>

    //                             <button
    //                                 onClick={() => {
    //                                     resetForm()
    //                                     setShowAddModal(true)
    //                                 }}
    //                                 className="bg-white text-green-600 px-6 py-2 rounded-xl flex items-center space-x-2 font-semibold hover:bg-gray-50 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
    //                             >
    //                                 <PlusIcon className="h-4 w-4" />
    //                                 <span>Add Teacher</span>
    //                             </button>
    //                         </div>
    //                     </div>

    //                     {/* Enhanced Statistics Cards */}
    //                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
    //                         <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
    //                             <div className="flex items-center justify-between">
    //                                 <div>
    //                                     <p className="text-blue-100 text-sm font-medium">Total Teachers</p>
    //                                     <p className="text-white text-2xl font-bold">{total}</p>
    //                                 </div>
    //                                 <UsersIcon className="h-8 w-8 text-blue-200" />
    //                             </div>
    //                         </div>
    //                         <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
    //                             <div className="flex items-center justify-between">
    //                                 <div>
    //                                     <p className="text-green-100 text-sm font-medium">Active</p>
    //                                     <p className="text-white text-2xl font-bold">{activeTeachers}</p>
    //                                 </div>
    //                                 <UserCheckIcon className="h-8 w-8 text-green-200" />
    //                             </div>
    //                         </div>
    //                         <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
    //                             <div className="flex items-center justify-between">
    //                                 <div>
    //                                     <p className="text-yellow-100 text-sm font-medium">On Leave</p>
    //                                     <p className="text-white text-2xl font-bold">{onLeaveTeachers}</p>
    //                                 </div>
    //                                 <AlertTriangleIcon className="h-8 w-8 text-yellow-200" />
    //                             </div>
    //                         </div>
    //                         <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
    //                             <div className="flex items-center justify-between">
    //                                 <div>
    //                                     <p className="text-purple-100 text-sm font-medium">Experience</p>
    //                                     <p className="text-white text-2xl font-bold">
    //                                         {teachers.length > 0 ? Math.round(teachers.reduce((sum, t) => sum + t.experience_years, 0) / teachers.length) : 0}y
    //                                     </p>
    //                                 </div>
    //                                 <AwardIcon className="h-8 w-8 text-purple-200" />
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>

    //             {/* Enhanced Search and Filters */}
    //             <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
    //                 {/* Left side — Filter + Status */}
    //                 <div className="flex items-center space-x-4">
    //                     <button
    //                         onClick={() => setShowFilters(true)}
    //                         className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium"
    //                     >
    //                         <FilterIcon className="h-4 w-4" />
    //                         <span>Advanced Filters</span>
    //                     </button>

    //                     <select
    //                         value={filters.status_filter}
    //                         onChange={(e) => handleFilterChange({ status_filter: e.target.value })}
    //                         className="px-4 py-2.5 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700 font-medium min-w-[140px]"
    //                     >
    //                         <option value="">All Status</option>
    //                         <option value="active">Active</option>
    //                         <option value="inactive">Inactive</option>
    //                         <option value="on_leave">On Leave</option>
    //                     </select>
    //                 </div>

    //                 {/* Right side — Search */}
    //                 <div className="flex items-center space-x-4">
    //                     <div className="relative">
    //                         <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
    //                         <input
    //                             type="text"
    //                             placeholder="Search teachers, employee ID, or email..."
    //                             value={filters.search}
    //                             onChange={(e) => handleFilterChange({ search: e.target.value })}
    //                             className="w-80 pl-12 pr-4 py-2.5 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
    //                         />
    //                     </div>
    //                 </div>
    //             </div>

    //             {/* Enhanced Filter Modal */}
    //             {showFilters && (
    //                 <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    //                     <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 w-full max-w-5xl mx-4 p-8 relative transform transition-all duration-300 scale-100">
    //                         {/* Header */}
    //                         <div className="flex items-center justify-between mb-6">
    //                             <div className="flex items-center space-x-3">
    //                                 <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-2">
    //                                     <FilterIcon className="h-6 w-6 text-white" />
    //                                 </div>
    //                                 <div>
    //                                     <h2 className="text-2xl font-bold text-gray-800">Advanced Filters</h2>
    //                                     <p className="text-gray-600">Refine your teacher search criteria</p>
    //                                 </div>
    //                             </div>
    //                             <button
    //                                 onClick={() => setShowFilters(false)}
    //                                 className="text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-gray-100 hover:bg-gray-200 rounded-xl p-2"
    //                             >
    //                                 <XIcon className="h-6 w-6" />
    //                             </button>
    //                         </div>

    //                         {/* Filter Form */}
    //                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //                             <div>
    //                                 <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
    //                                     <BookOpenIcon className="h-4 w-4 mr-2" />
    //                                     Subject
    //                                 </label>
    //                                 <input
    //                                     type="text"
    //                                     placeholder="Subject specialization"
    //                                     value={filters.subject_filter}
    //                                     onChange={(e) => handleFilterChange({ subject_filter: e.target.value })}
    //                                     className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
    //                                 />
    //                             </div>

    //                             <div>
    //                                 <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
    //                                     <GraduationCapIcon className="h-4 w-4 mr-2" />
    //                                     Qualification
    //                                 </label>
    //                                 <select
    //                                     value={filters.qualification_filter}
    //                                     onChange={(e) => handleFilterChange({ qualification_filter: e.target.value })}
    //                                     className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
    //                                 >
    //                                     <option value="">All Qualifications</option>
    //                                     <option value="B.Ed">B.Ed</option>
    //                                     <option value="M.Ed">M.Ed</option>
    //                                     <option value="Ph.D">Ph.D</option>
    //                                     <option value="B.A">B.A</option>
    //                                     <option value="M.A">M.A</option>
    //                                     <option value="B.Sc">B.Sc</option>
    //                                     <option value="M.Sc">M.Sc</option>
    //                                 </select>
    //                             </div>

    //                             <div>
    //                                 <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
    //                                     <AwardIcon className="h-4 w-4 mr-2" />
    //                                     Experience
    //                                 </label>
    //                                 <select
    //                                     value={filters.experience_filter}
    //                                     onChange={(e) => handleFilterChange({ experience_filter: e.target.value })}
    //                                     className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
    //                                 >
    //                                     <option value="">All Experience</option>
    //                                     <option value="0">0+ years</option>
    //                                     <option value="1">1+ years</option>
    //                                     <option value="5">5+ years</option>
    //                                     <option value="10">10+ years</option>
    //                                     <option value="15">15+ years</option>
    //                                 </select>
    //                             </div>

    //                             <div>
    //                                 <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
    //                                     <UsersIcon className="h-4 w-4 mr-2" />
    //                                     Gender
    //                                 </label>
    //                                 <select
    //                                     value={filters.gender_filter}
    //                                     onChange={(e) => handleFilterChange({ gender_filter: e.target.value })}
    //                                     className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
    //                                 >
    //                                     <option value="">All Genders</option>
    //                                     <option value="male">Male</option>
    //                                     <option value="female">Female</option>
    //                                     <option value="other">Other</option>
    //                                 </select>
    //                             </div>

    //                             <div>
    //                                 <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
    //                                     <BarChart3Icon className="h-4 w-4 mr-2" />
    //                                     Status
    //                                 </label>
    //                                 <select
    //                                     value={filters.status_filter}
    //                                     onChange={(e) => handleFilterChange({ status_filter: e.target.value })}
    //                                     className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
    //                                 >
    //                                     <option value="">All Status</option>
    //                                     <option value="active">Active</option>
    //                                     <option value="inactive">Inactive</option>
    //                                     <option value="on_leave">On Leave</option>
    //                                 </select>
    //                             </div>
    //                         </div>

    //                         {/* Footer Buttons */}
    //                         <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
    //                             <button
    //                                 onClick={() => {
    //                                     setFilters({
    //                                         search: '',
    //                                         subject_filter: '',
    //                                         qualification_filter: '',
    //                                         experience_filter: '',
    //                                         status_filter: '',
    //                                         gender_filter: ''
    //                                     })
    //                                     setCurrentPage(1)
    //                                 }}
    //                                 className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200"
    //                             >
    //                                 <RefreshCwIcon className="h-4 w-4" />
    //                                 <span>Reset All Filters</span>
    //                             </button>

    //                             <button
    //                                 onClick={() => setShowFilters(false)}
    //                                 className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
    //                             >
    //                                 Apply Filters
    //                             </button>
    //                         </div>
    //                     </div>
    //                 </div>
    //             )}

    //             {/* Enhanced Teachers Table */}
    //             <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
    //                 {loading ? (
    //                     <div className="p-12 text-center">
    //                         <div className="flex flex-col items-center space-y-4">
    //                             <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
    //                             <div className="space-y-2">
    //                                 <p className="text-gray-700 font-medium">Loading teachers...</p>
    //                                 <p className="text-gray-500 text-sm">Please wait while we fetch the data</p>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 ) : teachers.length === 0 ? (
    //                     <div className="p-12 text-center">
    //                         <div className="flex flex-col items-center space-y-4">
    //                             <div className="bg-gray-100 rounded-2xl p-6">
    //                                 <UsersIcon className="h-16 w-16 text-gray-400 mx-auto" />
    //                             </div>
    //                             <div className="space-y-2">
    //                                 <p className="text-gray-700 text-xl font-semibold">No teachers found</p>
    //                                 <p className="text-gray-500">Try adjusting your search or filter criteria</p>
    //                             </div>
    //                             <button
    //                                 onClick={() => {
    //                                     resetForm()
    //                                     setShowAddModal(true)
    //                                 }}
    //                                 className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200"
    //                             >
    //                                 Add Your First Teacher
    //                             </button>
    //                         </div>
    //                     </div>
    //                 ) : (
    //                     <div className="overflow-x-auto">
    //                         <table className="w-full">
    //                             <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
    //                                 <tr>
    //                                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
    //                                         <div className="flex items-center space-x-2">
    //                                             <UsersIcon className="h-4 w-4" />
    //                                             <span>Teacher</span>
    //                                         </div>
    //                                     </th>
    //                                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
    //                                         <div className="flex items-center space-x-2">
    //                                             <BookOpenIcon className="h-4 w-4" />
    //                                             <span>Subject & Experience</span>
    //                                         </div>
    //                                     </th>
    //                                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
    //                                         <div className="flex items-center space-x-2">
    //                                             <ContactIcon className="h-4 w-4" />
    //                                             <span>Contact Details</span>
    //                                         </div>
    //                                     </th>
    //                                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
    //                                         <div className="flex items-center space-x-2">
    //                                             <BarChart3Icon className="h-4 w-4" />
    //                                             <span>Status</span>
    //                                         </div>
    //                                     </th>
    //                                     <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
    //                                         <div className="flex items-center justify-end space-x-2">
    //                                             <Settings2Icon className="h-4 w-4" />
    //                                             <span>Actions</span>
    //                                         </div>
    //                                     </th>
    //                                 </tr>
    //                             </thead>
    //                             <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200">
    //                                 {teachers.map((teacher, index) => (
    //                                     <tr key={teacher.id} className={`hover:bg-blue-50/50 transition-all duration-300 ${index % 2 === 0 ? 'bg-white/30' : 'bg-gray-50/30'}`}>
    //                                         <td className="px-6 py-5 whitespace-nowrap">
    //                                             <div className="flex items-center">
    //                                                 <div className="h-12 w-12 flex-shrink-0">
    //                                                     {teacher.profile_picture ? (
    //                                                         <img
    //                                                             className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-lg"
    //                                                             src={teacher.profile_picture}
    //                                                             alt={teacher.full_name}
    //                                                         />
    //                                                     ) : (
    //                                                         <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-white shadow-lg flex items-center justify-center">
    //                                                             <UserIcon className="h-6 w-6 text-gray-500" />
    //                                                         </div>
    //                                                     )}
    //                                                 </div>
    //                                                 <div className="ml-4">
    //                                                     <div className="text-sm font-semibold text-gray-900">
    //                                                         {teacher.full_name}
    //                                                     </div>
    //                                                     <div className="text-sm text-gray-600 font-medium flex items-center">
    //                                                         <IdCardIcon className="h-3 w-3 mr-1" />
    //                                                         {teacher.employee_id}
    //                                                     </div>
    //                                                 </div>
    //                                             </div>
    //                                         </td>

    //                                         <td className="px-6 py-5 whitespace-nowrap">
    //                                             <div className="text-sm font-semibold text-gray-900">
    //                                                 {teacher.subject_specialization}
    //                                             </div>
    //                                             <div className="text-sm text-gray-600 font-medium flex items-center">
    //                                                 <AwardIcon className="h-3 w-3 mr-1" />
    //                                                 {teacher.experience_years} years experience
    //                                             </div>
    //                                         </td>

    //                                         <td className="px-6 py-5 whitespace-nowrap">
    //                                             <div className="text-sm font-semibold text-gray-900 flex items-center">
    //                                                 <PhoneIcon className="h-3 w-3 mr-1" />
    //                                                 {teacher.phone_number}
    //                                             </div>
    //                                             <div className="text-sm text-gray-600 font-medium flex items-center">
    //                                                 <MailIcon className="h-3 w-3 mr-1" />
    //                                                 {teacher.email}
    //                                             </div>
    //                                         </td>

    //                                         <td className="px-6 py-5 whitespace-nowrap">
    //                                             <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${
    //                                                 teacher.status === 'active'
    //                                                     ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
    //                                                     : teacher.status === 'on_leave'
    //                                                     ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300'
    //                                                     : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
    //                                             }`}>
    //                                                 {teacher.status === 'active' ? (
    //                                                     <>
    //                                                         <ShieldCheckIcon className="h-3 w-3 mr-1" />
    //                                                         ACTIVE
    //                                                     </>
    //                                                 ) : teacher.status === 'on_leave' ? (
    //                                                     <>
    //                                                         <AlertTriangleIcon className="h-3 w-3 mr-1" />
    //                                                         ON LEAVE
    //                                                     </>
    //                                                 ) : (
    //                                                     <>
    //                                                         <ShieldXIcon className="h-3 w-3 mr-1" />
    //                                                         INACTIVE
    //                                                     </>
    //                                                 )}
    //                                             </span>
    //                                         </td>

    //                                         <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
    //                                             <div className="relative">
    //                                                 <button
    //                                                     onClick={() => setOpenDropdown(openDropdown === teacher.id ? null : teacher.id!)}
    //                                                     className="text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
    //                                                 >
    //                                                     <MoreVerticalIcon className="h-5 w-5" />
    //                                                 </button>

    //                                                 {openDropdown === teacher.id && (
    //                                                     <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 z-10 overflow-hidden">
    //                                                         <div className="py-2">
    //                                                             <button
    //                                                                 onClick={() => {
    //                                                                     handleView(teacher)
    //                                                                     setOpenDropdown(null)
    //                                                                 }}
    //                                                                 className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
    //                                                             >
    //                                                                 <EyeIcon className="h-4 w-4 mr-3 text-blue-600" />
    //                                                                 <span>View Teacher</span>
    //                                                             </button>
    //                                                             <button
    //                                                                 onClick={() => {
    //                                                                     handleEdit(teacher)
    //                                                                     setOpenDropdown(null)
    //                                                                 }}
    //                                                                 className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 transition-colors duration-200"
    //                                                             >
    //                                                                 <EditIcon className="h-4 w-4 mr-3 text-yellow-600" />
    //                                                                 <span>Edit Teacher</span>
    //                                                             </button>
    //                                                             <button
    //                                                                 onClick={() => {
    //                                                                     handleDelete(teacher)
    //                                                                     setOpenDropdown(null)
    //                                                                 }}
    //                                                                 className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
    //                                                             >
    //                                                                 <TrashIcon className="h-4 w-4 mr-3" />
    //                                                                 <span>Delete Teacher</span>
    //                                                             </button>
    //                                                         </div>
    //                                                     </div>
    //                                                 )}
    //                                             </div>
    //                                         </td>
    //                                     </tr>
    //                                 ))}
    //                             </tbody>
    //                         </table>
    //                     </div>
    //                 )}

    //                 {/* Enhanced Pagination */}
    //                 {totalPages > 1 && (
    //                     <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
    //                         <div className="flex items-center justify-between">
    //                             <p className="text-sm text-gray-700 font-medium">
    //                                 Showing <span className="font-bold text-blue-600">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
    //                                 <span className="font-bold text-blue-600">{Math.min(currentPage * pageSize, total)}</span> of{' '}
    //                                 <span className="font-bold text-blue-600">{total}</span> teachers
    //                             </p>

    //                             <div className="flex items-center space-x-2">
    //                                 <button
    //                                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    //                                     disabled={currentPage === 1}
    //                                     className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-md transition-all duration-200"
    //                                 >
    //                                     Previous
    //                                 </button>

    //                                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    //                                     const page = i + 1
    //                                     return (
    //                                         <button
    //                                             key={page}
    //                                             onClick={() => setCurrentPage(page)}
    //                                             className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
    //                                                 currentPage === page
    //                                                     ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
    //                                                     : 'border border-gray-300 hover:bg-white hover:shadow-md'
    //                                             }`}
    //                                         >
    //                                             {page}
    //                                         </button>
    //                                     )
    //                                 })}

    //                                 <button
    //                                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    //                                     disabled={currentPage === totalPages}
    //                                     className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-md transition-all duration-200"
    //                                 >
    //                                     Next
    //                                 </button>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 )}
    //             </div>
    return (
    <div className="min-h-screen bg-[#F6F9FC] p-8">
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
                        Teachers
                    </h1>
                    <p className="text-gray-600" style={{ fontSize: '15px', fontWeight: 400 }}>
                        Manage teaching staff and their schedules
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { resetForm(); setShowAddModal(true) }}
                    className="px-6 py-3 gradient-primary text-white rounded-xl flex items-center gap-2 font-medium shadow-glow hover:shadow-float"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Teacher
                </motion.button>
            </motion.div>

            {/* Search & Filters */}
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
                            placeholder="Search teachers..."
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
                        onClick={() => loadTeachers(false)}
                        disabled={refreshing}
                        className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl flex items-center gap-2 font-medium border border-gray-200 shadow-sm"
                    >
                        <RefreshCwIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                    </motion.button>
                </div>
            </motion.div>

            {/* Teachers Grid */}
            {loading ? (
                <div className="p-12 text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1E88E5] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading teachers...</p>
                </div>
            ) : teachers.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl">
                    <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-900 font-semibold mb-2">No teachers found</p>
                    <p className="text-gray-500">Try adjusting your search</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teachers.map((teacher, index) => {
                        const subjectColors: { [key: string]: string } = {
                            'Mathematics': '#1E88E5',
                            'Physics': '#7B1FA2',
                            'English': '#F57C00',
                            'Chemistry': '#00897B',
                            'Biology': '#43A047',
                            'History': '#E53935',
                        };
                        const subjectColor = subjectColors[teacher.subject_specialization] || '#1E88E5';

                        return (
                            <motion.div
                                key={teacher.id}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.05, duration: 0.6 }}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="bg-white rounded-[20px] p-6 shadow-soft hover:shadow-float transition-all duration-300 group cursor-pointer border border-gray-100"
                            >
                                {/* Avatar & Badge */}
                                <div className="flex items-start gap-4 mb-4">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        {teacher.profile_picture ? (
                                            <img
                                                src={teacher.profile_picture}
                                                alt={teacher.full_name}
                                                className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-soft"
                                            />
                                        ) : (
                                            <div
                                                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold ring-4 ring-white shadow-soft"
                                                style={{ background: subjectColor }}
                                            >
                                                {teacher.full_name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                        )}
                                    </motion.div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-gray-800 mb-1 truncate font-semibold" style={{ fontSize: '16px' }}>
                                            {teacher.full_name}
                                        </h4>
                                        <span
                                            className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border-0"
                                            style={{
                                                backgroundColor: `${subjectColor}20`,
                                                color: subjectColor
                                            }}
                                        >
                                            {teacher.subject_specialization}
                                        </span>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MailIcon className="w-4 h-4 text-[#1E88E5]" />
                                        <span className="truncate">{teacher.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <PhoneIcon className="w-4 h-4 text-[#1E88E5]" />
                                        <span>{teacher.phone_number}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <AwardIcon className="w-4 h-4 text-[#1E88E5]" />
                                        <span>{teacher.experience_years} years experience</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-4 border-t border-gray-200/50 flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleView(teacher)}
                                        className="flex-1 px-4 py-2 bg-white hover:bg-[#1E88E5]/10 border border-[#1E88E5]/20 text-[#1E88E5] rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                        View
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleEdit(teacher)}
                                        className="flex-1 px-4 py-2 bg-white hover:bg-[#5B9FFF]/10 border border-[#5B9FFF]/20 text-[#5B9FFF] rounded-lg text-sm font-medium"
                                    >
                                        Edit
                                    </motion.button>
                                </div>

                                {/* Experience Badge */}
                                <div className="mt-3 pt-3 border-t border-gray-200/50">
                                    <p className="text-xs text-gray-500">
                                        Qualification: <span className="font-semibold text-gray-700">{teacher.qualification}</span>
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {!loading && teachers.length > 0 && totalPages > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center items-center gap-2 mt-8"
                >
                    <button
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {[...Array(Math.min(3, totalPages))].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${
                                currentPage === i + 1
                                    ? 'bg-[#1E88E5] text-white'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </motion.div>
            )}


                {/* Enhanced Add/Edit Teacher Modal */}
                {(showAddModal || showEditModal) && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto border border-white/20">
                            {/* Enhanced Header */}
                            <div className="bg-gradient-to-br from-green-500 to-green-600 px-6 py-6 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                                            {showEditModal ? <EditIcon className="h-6 w-6 text-white" /> : <PlusIcon className="h-6 w-6 text-white" />}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">
                                                {showEditModal ? 'Edit Teacher' : 'Add New Teacher'}
                                            </h2>
                                            <p className="text-blue-100">
                                                {showEditModal ? 'Update teacher information' : 'Enter teacher details below'}
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
                            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                                {/* Enhanced Profile Picture Upload */}
                                <div className="flex justify-center">
                                    <div className="flex flex-col items-center">
                                        {profilePictureUrl ? (
                                            <div className="relative group">
                                                <img
                                                    src={profilePictureUrl}
                                                    alt="Profile preview"
                                                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-2xl group-hover:shadow-3xl transition-all duration-300"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setProfilePicture(null)
                                                        setProfilePictureUrl('')
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                                                >
                                                    <XIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="w-28 h-28 rounded-full border-3 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 group bg-gradient-to-br from-gray-50 to-gray-100">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                                <div className="text-center">
                                                    <CameraIcon className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-1 transition-colors duration-300" />
                                                    <span className="text-xs text-gray-500 group-hover:text-blue-600 font-medium">Upload Photo</span>
                                                </div>
                                            </label>
                                        )}

                                        <div className="mt-3 text-center">
                                            <p className="text-sm text-gray-600 font-medium flex items-center justify-center">
                                                <CameraIcon className="h-4 w-4 mr-1" />
                                                Profile Picture
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Max size: 10MB (JPG, PNG, GIF, WebP)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Form Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Personal Information Section */}
                                    <div className="md:col-span-3">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                            <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                                            Personal Information
                                        </h3>
                                    </div>

                                    {/* Full Name */}
                                    <div>
                                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                            <UserIcon className="h-4 w-4 mr-2" />
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.full_name || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                                            placeholder="Enter full name"
                                        />
                                        {formErrors.full_name && (
                                            <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.full_name}</p>
                                        )}
                                    </div>

                                    {/* Employee ID */}
                                    <div>
                                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                            <IdCardIcon className="h-4 w-4 mr-2" />
                                            Employee ID *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.employee_id || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, employee_id: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                                            placeholder="Enter employee ID"
                                        />
                                        {formErrors.employee_id && (
                                            <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.employee_id}</p>
                                        )}
                                    </div>

                                    {/* Gender */}
                                    <div>
                                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                            <UsersIcon className="h-4 w-4 mr-2" />
                                            Gender *
                                        </label>
                                        <select
                                            value={formData.gender || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' | 'other' }))}
                                            className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {formErrors.gender && (
                                            <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.gender}</p>
                                        )}
                                    </div>

                                    {/* Date of Birth */}
                                    <div>
                                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                            <CalendarIcon className="h-4 w-4 mr-2" />
                                            Date of Birth *
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.date_of_birth || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                                        />
                                        {formErrors.date_of_birth && (
                                            <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.date_of_birth}</p>
                                        )}
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                            <PhoneIcon className="h-4 w-4 mr-2" />
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone_number || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                                            placeholder="Enter phone number"
                                        />
                                        {formErrors.phone_number && (
                                            <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.phone_number}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                            <MailIcon className="h-4 w-4 mr-2" />
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                                            placeholder="Enter email address"
                                        />
                                        {formErrors.email && (
                                            <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.email}</p>
                                        )}
                                    </div>

                                    {/* Professional Information Section */}
                                    <div className="md:col-span-3 mt-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                            <BriefcaseIcon className="h-5 w-5 mr-2 text-blue-600" />
                                            Professional Information
                                        </h3>
                                    </div>

                                    {/* Subject Specialization */}
                                    <div>
                                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                            <BookOpenIcon className="h-4 w-4 mr-2" />
                                            Subject Specialization *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subject_specialization || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, subject_specialization: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                                            placeholder="e.g., Mathematics, English, Science"
                                        />
                                        {formErrors.subject_specialization && (
                                            <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.subject_specialization}</p>
                                        )}
                                    </div>

                                    {/* Qualification */}
                                    <div>
                                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                            <GraduationCapIcon className="h-4 w-4 mr-2" />
                                            Qualification *
                                        </label>
                                        <select
                                            value={formData.qualification || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                                        >
                                            <option value="">Select Qualification</option>
                                            <option value="B.Ed">B.Ed</option>
                                            <option value="M.Ed">M.Ed</option>
                                            <option value="Ph.D">Ph.D</option>
                                            <option value="B.A">B.A</option>
                                            <option value="M.A">M.A</option>
                                            <option value="B.Sc">B.Sc</option>
                                            <option value="M.Sc">M.Sc</option>
                                            <option value="B.Com">B.Com</option>
                                            <option value="M.Com">M.Com</option>
                                        </select>
                                        {formErrors.qualification && (
                                            <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.qualification}</p>
                                        )}
                                    </div>

                                    {/* Experience Years */}
                                    <div>
                                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                            <AwardIcon className="h-4 w-4 mr-2" />
                                            Experience (Years) *
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="50"
                                            value={formData.experience_years || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                                            className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                                            placeholder="Years of experience"
                                        />
                                        {formErrors.experience_years && (
                                            <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.experience_years}</p>
                                        )}
                                    </div>

                                    {/* Date of Joining */}
                                    <div>
                                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                            <CalendarIcon className="h-4 w-4 mr-2" />
                                            Date of Joining *
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.date_of_joining || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, date_of_joining: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                                        />
                                        {formErrors.date_of_joining && (
                                            <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.date_of_joining}</p>
                                        )}
                                    </div>

                                    {/* Salary */}
                                    <div>
                                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                            <DollarSignIcon className="h-4 w-4 mr-2" />
                                            Salary *
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.salary || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, salary: parseInt(e.target.value) || 0 }))}
                                            className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                                            placeholder="Monthly salary"
                                        />
                                        {formErrors.salary && (
                                            <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.salary}</p>
                                        )}
                                    </div>

                                    {/* Status (for edit mode) */}
                                    {showEditModal && (
                                        <div>
                                            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                                <BarChart3Icon className="h-4 w-4 mr-2" />
                                                Status
                                            </label>
                                            <select
                                                value={formData.status || 'active'}
                                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' | 'on_leave' }))}
                                                className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="on_leave">On Leave</option>
                                            </select>
                                        </div>
                                    )}

                                    {/* Contact Information Section */}
                                    <div className="md:col-span-3 mt-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                            <ContactIcon className="h-5 w-5 mr-2 text-blue-600" />
                                            Contact Information
                                        </h3>
                                    </div>

                                    {/* Emergency Contact */}
                                    <div>
                                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                            <PhoneIcon className="h-4 w-4 mr-2" />
                                            Emergency Contact *
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.emergency_contact || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                                            placeholder="Emergency contact number"
                                        />
                                        {formErrors.emergency_contact && (
                                            <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.emergency_contact}</p>
                                        )}
                                    </div>

                                    {/* Address */}
                                    <div className="md:col-span-2">
                                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                            <HomeIcon className="h-4 w-4 mr-2" />
                                            Address *
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={formData.address || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                                            placeholder="Enter complete address"
                                        />
                                        {formErrors.address && (
                                            <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.address}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Enhanced Actions */}
                                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
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
                                        className="px-8 py-3 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:gradient-to-br from-green-800 to-green-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 font-semibold transition-all duration-200 transform hover:scale-105"
                                    >
                                        {submitting && <LoaderIcon className="h-5 w-5 animate-spin" />}
                                        <span>{submitting ? 'Saving...' : (showEditModal ? 'Update Teacher' : 'Create Teacher')}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Enhanced View Teacher Modal */}
                {showViewModal && selectedTeacher && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto border border-white/20">
                            {/* Enhanced Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                                            <EyeIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">Teacher Profile</h2>
                                            <p className="text-indigo-100">Complete teacher information</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowViewModal(false)
                                            setSelectedTeacher(null)
                                        }}
                                        className="text-white hover:bg-white/20 rounded-xl p-2 transition-colors duration-200"
                                    >
                                        <XIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Enhanced Content */}
                            <div className="p-8">
                                {/* Enhanced Profile Picture */}
                                <div className="flex justify-center mb-8">
                                    {selectedTeacher.profile_picture ? (
                                        <div className="relative">
                                            <img
                                                src={selectedTeacher.profile_picture}
                                                alt={selectedTeacher.full_name}
                                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                                            />
                                            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                                                <AwardIcon className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-4 border-white shadow-2xl flex items-center justify-center">
                                            <UserIcon className="h-16 w-16 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Enhanced Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Personal Information */}
                                    <div className="md:col-span-2">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                            <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                                            Personal Information
                                        </h3>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="flex items-center text-sm font-semibold text-gray-500 mb-2">
                                            <UserIcon className="h-4 w-4 mr-2" />
                                            Full Name
                                        </label>
                                        <p className="text-gray-900 font-semibold text-lg">{selectedTeacher.full_name}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="flex items-center text-sm font-semibold text-gray-500 mb-2">
                                            <IdCardIcon className="h-4 w-4 mr-2" />
                                            Employee ID
                                        </label>
                                        <p className="text-gray-900 font-semibold text-lg">{selectedTeacher.employee_id}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="flex items-center text-sm font-semibold text-gray-500 mb-2">
                                            <UsersIcon className="h-4 w-4 mr-2" />
                                            Gender
                                        </label>
                                        <p className="text-gray-900 font-semibold text-lg capitalize">{selectedTeacher.gender}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="flex items-center text-sm font-semibold text-gray-500 mb-2">
                                            <CalendarIcon className="h-4 w-4 mr-2" />
                                            Date of Birth
                                        </label>
                                        <p className="text-gray-900 font-semibold text-lg">
                                            {new Date(selectedTeacher.date_of_birth).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="flex items-center text-sm font-semibold text-gray-500 mb-2">
                                            <PhoneIcon className="h-4 w-4 mr-2" />
                                            Phone Number
                                        </label>
                                        <p className="text-gray-900 font-semibold text-lg">{selectedTeacher.phone_number}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="flex items-center text-sm font-semibold text-gray-500 mb-2">
                                            <MailIcon className="h-4 w-4 mr-2" />
                                            Email
                                        </label>
                                        <p className="text-gray-900 font-semibold text-lg">{selectedTeacher.email}</p>
                                    </div>

                                    {/* Professional Information */}
                                    <div className="md:col-span-2 mt-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                            <BriefcaseIcon className="h-5 w-5 mr-2 text-blue-600" />
                                            Professional Information
                                        </h3>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="flex items-center text-sm font-semibold text-gray-500 mb-2">
                                            <BookOpenIcon className="h-4 w-4 mr-2" />
                                            Subject Specialization
                                        </label>
                                        <p className="text-gray-900 font-semibold text-lg">{selectedTeacher.subject_specialization}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="flex items-center text-sm font-semibold text-gray-500 mb-2">
                                            <GraduationCapIcon className="h-4 w-4 mr-2" />
                                            Qualification
                                        </label>
                                        <p className="text-gray-900 font-semibold text-lg">{selectedTeacher.qualification}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="flex items-center text-sm font-semibold text-gray-500 mb-2">
                                            <AwardIcon className="h-4 w-4 mr-2" />
                                            Experience
                                        </label>
                                        <p className="text-gray-900 font-semibold text-lg">{selectedTeacher.experience_years} years</p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="flex items-center text-sm font-semibold text-gray-500 mb-2">
                                            <CalendarIcon className="h-4 w-4 mr-2" />
                                            Date of Joining
                                        </label>
                                        <p className="text-gray-900 font-semibold text-lg">
                                            {new Date(selectedTeacher.date_of_joining).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="flex items-center text-sm font-semibold text-gray-500 mb-2">
                                            <DollarSignIcon className="h-4 w-4 mr-2" />
                                            Salary
                                        </label>
                                        <p className="text-gray-900 font-semibold text-lg">₹{selectedTeacher.salary.toLocaleString()}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="flex items-center text-sm font-semibold text-gray-500 mb-2">
                                            <ActivityIcon className="h-4 w-4 mr-2" />
                                            Status
                                        </label>
                                        <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-full ${
                                            selectedTeacher.status === 'active'
                                                ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
                                                : selectedTeacher.status === 'on_leave'
                                                ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300'
                                                : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
                                        }`}>
                                            {selectedTeacher.status === 'active' ? (
                                                <>
                                                    <ShieldCheckIcon className="h-4 w-4 mr-2" />
                                                    ACTIVE
                                                </>
                                            ) : selectedTeacher.status === 'on_leave' ? (
                                                <>
                                                    <AlertTriangleIcon className="h-4 w-4 mr-2" />
                                                    ON LEAVE
                                                </>
                                            ) : (
                                                <>
                                                    <ShieldXIcon className="h-4 w-4 mr-2" />
                                                    INACTIVE
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="md:col-span-2 mt-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                            <ContactIcon className="h-5 w-5 mr-2 text-blue-600" />
                                            Contact Information
                                        </h3>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="flex items-center text-sm font-semibold text-gray-500 mb-2">
                                            <PhoneIcon className="h-4 w-4 mr-2" />
                                            Emergency Contact
                                        </label>
                                        <p className="text-gray-900 font-semibold text-lg">{selectedTeacher.emergency_contact}</p>
                                    </div>

                                    <div className="md:col-span-1 space-y-1">
                                        <label className="flex items-center text-sm font-semibold text-gray-500 mb-2">
                                            <MapPinIcon className="h-4 w-4 mr-2" />
                                            Address
                                        </label>
                                        <p className="text-gray-900 font-semibold text-lg leading-relaxed bg-gray-50 p-4 rounded-xl">
                                            {selectedTeacher.address}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Footer */}
                            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-2xl">
                                <div className="text-sm text-gray-500">
                                    <p className="flex items-center">
                                        <ClockIcon className="h-4 w-4 mr-1" />
                                        Teacher ID: #{selectedTeacher.id?.slice(-8).toUpperCase()}
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowViewModal(false)
                                            handleEdit(selectedTeacher)
                                        }}
                                        className="px-6 py-2 bg-yellow-100 text-yellow-800 rounded-xl hover:bg-yellow-200 transition-colors duration-200 font-medium flex items-center space-x-2"
                                    >
                                        <EditIcon className="h-4 w-4" />
                                        <span>Edit Teacher</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowViewModal(false)
                                            setSelectedTeacher(null)
                                        }}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Delete Confirmation Modal */}
                {showDeleteModal && selectedTeacher && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
                            <div className="p-8 text-center">
                                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-6">
                                    <TrashIcon className="h-8 w-8 text-red-600" />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Delete Teacher
                                </h3>

                                <div className="mb-6">
                                    <p className="text-gray-600 mb-4">
                                        Are you sure you want to delete{' '}
                                        <span className="font-semibold text-gray-900">{selectedTeacher.full_name}</span>?
                                    </p>
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                        <p className="text-red-800 text-sm font-medium flex items-center">
                                            <AlertCircleIcon className="h-4 w-4 mr-2" />
                                            This action cannot be undone and will permanently remove all teacher data including records and assignments.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false)
                                            setSelectedTeacher(null)
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
                                        {submitting && <LoaderIcon className="h-5 w-5 animate-spin" />}
                                        <TrashIcon className="h-4 w-4" />
                                        <span>{submitting ? 'Deleting...' : 'Delete Teacher'}</span>
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
