
// import React, { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { 
//   ArrowLeftIcon,
//   SearchIcon,
//   UsersIcon,
//   CheckIcon,
//   XIcon,
//   LoaderIcon,
//   CheckCircleIcon,
//   AlertCircleIcon,
//   InfoIcon,
//   RefreshCwIcon,
//   UserIcon,
//   FilterIcon,
//   Users2Icon,
//   GraduationCapIcon,
//   HashIcon,
//   IdCardIcon,
//   UserCheckIcon,
//   ShieldXIcon,
//   BookOpenIcon,
//   CalendarIcon,
//   Settings2Icon,
//   FileDownIcon,
//   UserPlusIcon,
//   UserMinusIcon,
//   Building2Icon,
//   AlertTriangleIcon,
//   ArrowRightIcon
// } from 'lucide-react'
// import { supabase } from '../../lib/supabase'

// // Enhanced Types
// interface Student {
//   id: string
//   full_name: string
//   admission_number: string
//   roll_number: string
//   class_name: string
//   section?: string
//   profile_picture?: string
//   status: 'active' | 'inactive'
//   assignmentStatus: 'assigned_here' | 'assigned_elsewhere' | 'not_assigned'
//   currentAssignment?: {
//     classId: string
//     className: string
//     section: string
//   }
// }

// interface Class {
//   id: string
//   class_name: string
//   section: string
//   academic_year: string
//   capacity: number
//   current_strength: number
// }

// interface NotificationState {
//   show: boolean
//   type: 'success' | 'error' | 'info' | 'warning'
//   title: string
//   message: string
// }

// interface ReassignmentConfirmation {
//   show: boolean
//   student: Student | null
//   fromClass: string
//   toClass: string
// }

// export const ClassStudents = () => {
//   const { classId } = useParams()
//   const navigate = useNavigate()

//   // State Management
//   const [classInfo, setClassInfo] = useState<Class | null>(null)
//   const [students, setStudents] = useState<Student[]>([])
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [refreshing, setRefreshing] = useState(false)

//   // Filter states
//   const [searchTerm, setSearchTerm] = useState('')
//   const [classFilter, setClassFilter] = useState('')
//   const [sectionFilter, setSectionFilter] = useState('')
//   const [statusFilter, setStatusFilter] = useState('')
//   const [assignmentFilter, setAssignmentFilter] = useState('')
//   const [showFilters, setShowFilters] = useState(false)

//   const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())

//   // Reassignment confirmation
//   const [reassignmentConfirm, setReassignmentConfirm] = useState<ReassignmentConfirmation>({
//     show: false,
//     student: null,
//     fromClass: '',
//     toClass: ''
//   })

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

//   // Load class information
//   const loadClassInfo = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('classes')
//         .select('*')
//         .eq('id', classId)
//         .single()

//       if (error) throw error
//       setClassInfo(data)
//     } catch (error) {
//       console.error('Error loading class info:', error)
//       showNotification('error', 'Loading Failed', 'Failed to load class information.')
//     }
//   }

//   // Enhanced load students with proper assignment status
//   const loadStudents = async (showLoadingSpinner = true) => {
//     try {
//       if (showLoadingSpinner) {
//         setLoading(true)
//       } else {
//         setRefreshing(true)
//       }

//       // Get all active students
//       const { data: allStudents, error: studentsError } = await supabase
//         .from('students')
//         .select('*')
//         .eq('status', 'active')
//         .order('full_name')

//       if (studentsError) throw studentsError

//       // Get ALL class assignments (not just for this class)
//       const { data: allAssignments, error: assignmentsError } = await supabase
//         .from('class_assignments')
//         .select(`
//           student_id,
//           class_id,
//           classes!class_assignments_class_id_fkey(
//             id,
//             class_name,
//             section
//           )
//         `)

//       if (assignmentsError && assignmentsError.code !== 'PGRST116') {
//         throw assignmentsError
//       }

//       // Create assignment map
//       const assignmentMap = new Map()
//       allAssignments?.forEach(assignment => {
//         assignmentMap.set(assignment.student_id, {
//           classId: assignment.class_id,
//           className: assignment.classes.name,
//           section: assignment.classes.section
//         })
//       })

//       // Mark students with proper assignment status
//       const studentsWithAssignment = allStudents.map(student => {
//         const assignment = assignmentMap.get(student.id)

//         let assignmentStatus: 'assigned_here' | 'assigned_elsewhere' | 'not_assigned'
//         let currentAssignment = undefined

//         if (assignment) {
//           if (assignment.classId === classId) {
//             assignmentStatus = 'assigned_here'
//           } else {
//             assignmentStatus = 'assigned_elsewhere'
//           }
//           currentAssignment = assignment
//         } else {
//           assignmentStatus = 'not_assigned'
//         }

//         return {
//           ...student,
//           assignmentStatus,
//           currentAssignment
//         }
//       })

//       setStudents(studentsWithAssignment)

//       // Pre-select only students assigned to this class
//       const assignedToThisClass = new Set(
//         studentsWithAssignment
//           .filter(s => s.assignmentStatus === 'assigned_here')
//           .map(s => s.id)
//       )
//       setSelectedStudents(assignedToThisClass)

//     } catch (error) {
//       console.error('Error loading students:', error)
//       showNotification('error', 'Loading Failed', 'Failed to load students. Please try again.')
//     } finally {
//       setLoading(false)
//       setRefreshing(false)
//     }
//   }

//   // Load data on component mount
//   useEffect(() => {
//     if (classId) {
//       loadClassInfo()
//       loadStudents()
//     }
//   }, [classId])

//   // Enhanced handle student selection with reassignment logic
//   const handleStudentToggle = (student: Student) => {
//     // If student is assigned elsewhere, show confirmation dialog
//     if (student.assignmentStatus === 'assigned_elsewhere' && !selectedStudents.has(student.id)) {
//       setReassignmentConfirm({
//         show: true,
//         student: student,
//         fromClass: `${student.currentAssignment?.className}-${student.currentAssignment?.section}`,
//         toClass: `${classInfo?.class_name}-${classInfo?.section}`
//       })
//       return
//     }

//     // Normal toggle logic
//     const newSelection = new Set(selectedStudents)
//     if (newSelection.has(student.id)) {
//       newSelection.delete(student.id)
//     } else {
//       newSelection.add(student.id)
//     }
//     setSelectedStudents(newSelection)
//   }

//   // Handle reassignment confirmation
//   const handleReassignmentConfirm = (confirmed: boolean) => {
//     if (confirmed && reassignmentConfirm.student) {
//       const newSelection = new Set(selectedStudents)
//       newSelection.add(reassignmentConfirm.student.id)
//       setSelectedStudents(newSelection)
//     }

//     setReassignmentConfirm({
//       show: false,
//       student: null,
//       fromClass: '',
//       toClass: ''
//     })
//   }

//   // Enhanced save assignments with reassignment handling
//   const handleSaveAssignments = async () => {
//     if (!classInfo) return

//     try {
//       setSaving(true)

//       // Get current assignments for this class
//       const { data: currentAssignments } = await supabase
//         .from('class_assignments')
//         .select('student_id')
//         .eq('class_id', classId)

//       const currentStudentIds = new Set(currentAssignments?.map(a => a.student_id) || [])

//       // Find students to add and remove
//       const toAdd = Array.from(selectedStudents).filter(id => !currentStudentIds.has(id))
//       const toRemove = Array.from(currentStudentIds).filter(id => !selectedStudents.has(id))

//       // Handle reassignments (remove from other classes first)
//       const studentsToReassign = toAdd.filter(studentId => {
//         const student = students.find(s => s.id === studentId)
//         return student?.assignmentStatus === 'assigned_elsewhere'
//       })

//       // Remove students from their previous classes
//       if (studentsToReassign.length > 0) {
//         for (const studentId of studentsToReassign) {
//           const { error: removeError } = await supabase
//             .from('class_assignments')
//             .delete()
//             .eq('student_id', studentId)

//           if (removeError) throw removeError
//         }
//       }

//       // Add new assignments
//       if (toAdd.length > 0) {
//         const newAssignments = toAdd.map(studentId => ({
//           class_id: classId,
//           student_id: studentId,
//           academic_year: classInfo.academic_year
//         }))

//         const { error: addError } = await supabase
//           .from('class_assignments')
//           .insert(newAssignments)

//         if (addError) throw addError
//       }

//       // Remove old assignments from this class
//       if (toRemove.length > 0) {
//         const { error: removeError } = await supabase
//           .from('class_assignments')
//           .delete()
//           .eq('class_id', classId)
//           .in('student_id', toRemove)

//         if (removeError) throw removeError
//       }

//       // Update class current strength
//       const { error: updateError } = await supabase
//         .from('classes')
//         .update({ current_strength: selectedStudents.size })
//         .eq('id', classId)

//       if (updateError) throw updateError

//       let message = `Successfully updated student assignments for Class ${classInfo.class_name}-${classInfo.section}`

//       if (studentsToReassign.length > 0) {
//         message += `. ${studentsToReassign.length} student(s) were moved from other classes.`
//       }

//       showNotification('success', 'Assignments Saved', message)

//       // Reload to reflect changes
//       setTimeout(() => loadStudents(false), 1000)

//     } catch (error) {
//       console.error('Error saving assignments:', error)
//       showNotification('error', 'Save Failed', 'Failed to save student assignments. Please try again.')
//     } finally {
//       setSaving(false)
//     }
//   }

//   // Enhanced filter students with proper assignment status
//   const filteredStudents = students.filter(student => {
//     const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          student.admission_number.toLowerCase().includes(searchTerm.toLowerCase())

//     const matchesClass = !classFilter || student.class_name === classFilter
//     const matchesSection = !sectionFilter || student.section === sectionFilter
//     const matchesStatus = !statusFilter || student.status === statusFilter

//     const matchesAssignment = !assignmentFilter || 
//                              (assignmentFilter === 'assigned_here' && student.assignmentStatus === 'assigned_here') ||
//                              (assignmentFilter === 'assigned_elsewhere' && student.assignmentStatus === 'assigned_elsewhere') ||
//                              (assignmentFilter === 'not_assigned' && student.assignmentStatus === 'not_assigned')

//     return matchesSearch && matchesClass && matchesSection && matchesStatus && matchesAssignment
//   })

//   // Get unique values for filter dropdowns
//   const uniqueClasses = Array.from(new Set(students.map(s => s.class_name))).sort()
//   const uniqueSections = Array.from(new Set(students.map(s => s.section).filter(Boolean))).sort()

//   // Clear all filters
//   const clearFilters = () => {
//     setSearchTerm('')
//     setClassFilter('')
//     setSectionFilter('')
//     setStatusFilter('')
//     setAssignmentFilter('')
//   }

//   // Calculate statistics
//   const assignedHereCount = filteredStudents.filter(s => s.assignmentStatus === 'assigned_here').length
//   const assignedElsewhereCount = filteredStudents.filter(s => s.assignmentStatus === 'assigned_elsewhere').length
//   const notAssignedCount = filteredStudents.filter(s => s.assignmentStatus === 'not_assigned').length
//   const selectedCount = selectedStudents.size

//   return (
//     <div
//       className="min-h-screen bg-gray-120"
//       style={{ height: 'calc(100vh - 6rem)' }}
//     >
//       <div className=" max-w-7xl mx-auto">
//         {/* Enhanced Notification */}
//         {notification.show && (
//           <div className={`fixed top-4 right-4 z-50 max-w-md w-full transition-all duration-500 transform ${
//             notification.show ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-full scale-95 opacity-0'
//           }`}>
//             <div className={`rounded-xl shadow-2xl border-l-4 p-4 backdrop-blur-lg ${
//               notification.type === 'success' ? 'bg-green-50/90 border-green-400 shadow-green-100' :
//               notification.type === 'error' ? 'bg-red-50/90 border-red-400 shadow-red-100' :
//               notification.type === 'warning' ? 'bg-yellow-50/90 border-yellow-400 shadow-yellow-100' :
//               'bg-blue-50/90 border-blue-400 shadow-blue-100'
//             }`}>
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <div className={`rounded-full p-1 ${
//                     notification.type === 'success' ? 'bg-green-100' :
//                     notification.type === 'error' ? 'bg-red-100' :
//                     notification.type === 'warning' ? 'bg-yellow-100' :
//                     'bg-blue-100'
//                   }`}>
//                     {notification.type === 'success' && <CheckCircleIcon className="h-5 w-5 text-green-600" />}
//                     {notification.type === 'error' && <AlertCircleIcon className="h-5 w-5 text-red-600" />}
//                     {notification.type === 'warning' && <AlertCircleIcon className="h-5 w-5 text-yellow-600" />}
//                     {notification.type === 'info' && <InfoIcon className="h-5 w-5 text-blue-600" />}
//                   </div>
//                 </div>
//                 <div className="ml-3">
//                   <h3 className={`text-sm font-semibold ${
//                     notification.type === 'success' ? 'text-green-900' :
//                     notification.type === 'error' ? 'text-red-900' :
//                     notification.type === 'warning' ? 'text-yellow-900' :
//                     'text-blue-900'
//                   }`}>
//                     {notification.title}
//                   </h3>
//                   <p className={`text-sm mt-1 ${
//                     notification.type === 'success' ? 'text-green-800' :
//                     notification.type === 'error' ? 'text-red-800' :
//                     notification.type === 'warning' ? 'text-yellow-800' :
//                     'text-blue-800'
//                   }`}>
//                     {notification.message}
//                   </p>
//                 </div>
//                 <div className="ml-auto pl-3">
//                   <button
//                     onClick={() => setNotification(prev => ({ ...prev, show: false }))}
//                     className={`rounded-full p-1 transition-colors duration-200 ${
//                       notification.type === 'success' ? 'text-green-500 hover:bg-green-100' :
//                       notification.type === 'error' ? 'text-red-500 hover:bg-red-100' :
//                       notification.type === 'warning' ? 'text-yellow-500 hover:bg-yellow-100' :
//                       'text-blue-500 hover:bg-blue-100'
//                     }`}
//                   >
//                     <XIcon className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Reassignment Confirmation Modal */}
//         {reassignmentConfirm.show && (
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
//               <div className="p-8 text-center">
//                 <div className="flex items-center justify-center w-16 h-16 mx-auto bg-yellow-100 rounded-full mb-6">
//                   <AlertTriangleIcon className="h-8 w-8 text-yellow-600" />
//                 </div>

//                 <h3 className="text-xl font-bold text-gray-900 mb-2">
//                   Student Reassignment
//                 </h3>

//                 <div className="mb-6">
//                   <p className="text-gray-600 mb-4">
//                     <strong>{reassignmentConfirm.student?.full_name}</strong> is currently assigned to{' '}
//                     <strong>Class {reassignmentConfirm.fromClass}</strong>.
//                   </p>

//                   <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
//                     <div className="flex items-center justify-center space-x-2 text-sm">
//                       <span className="text-gray-700">From:</span>
//                       <span className="bg-red-100 text-red-800 px-2 py-1 rounded-lg font-medium">
//                         {reassignmentConfirm.fromClass}
//                       </span>
//                       <ArrowRightIcon className="h-4 w-4 text-gray-400" />
//                       <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg font-medium">
//                         {reassignmentConfirm.toClass}
//                       </span>
//                     </div>
//                   </div>

//                   <p className="text-sm text-gray-600">
//                     Do you want to move this student to <strong>Class {reassignmentConfirm.toClass}</strong>?
//                   </p>
//                 </div>

//                 <div className="flex justify-center space-x-4">
//                   <button
//                     onClick={() => handleReassignmentConfirm(false)}
//                     className="px-6 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => handleReassignmentConfirm(true)}
//                     className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 font-semibold transform hover:scale-105"
//                   >
//                     Move Student
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Enhanced Header */}
//         {/* <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl mb-6 overflow-hidden"> */}
//           {/* <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-8"> */}
//             {/* <div className="flex justify-between items-start">
//               <div className="flex items-center space-x-4">
//                 <button
//                   onClick={() => navigate('/classes')}
//                   className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-white hover:bg-white/30 transition-all duration-200"
//                 >
//                   <ArrowLeftIcon className="h-6 w-6" />
//                 </button>

//                 <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
//                   <Users2Icon className="h-8 w-8 text-white" />
//                 </div>

//                 <div>
//                   {classInfo ? (
//                     <>
//                       <h1 className="text-3xl font-bold text-white mb-2">
//                         Class {classInfo.class_name}-{classInfo.section}
//                       </h1>
//                       <p className="text-indigo-100">
//                         Student Assignment Manager • Academic Year {classInfo.academic_year}
//                       </p>
//                       {refreshing && (
//                         <div className="flex items-center text-indigo-200 mt-2">
//                           <RefreshCwIcon className="h-4 w-4 animate-spin mr-2" />
//                           <span className="text-sm">Syncing data...</span>
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <div className="animate-pulse">
//                       <div className="h-8 bg-white/20 rounded-xl w-64 mb-2"></div>
//                       <div className="h-4 bg-white/15 rounded-lg w-80"></div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={() => loadStudents(false)}
//                   disabled={refreshing}
//                   className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 disabled:opacity-50"
//                 >
//                   <RefreshCwIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
//                   <span>Refresh</span>
//                 </button>

//                 <button
//                   onClick={handleSaveAssignments}
//                   disabled={saving || !classInfo}
//                   className="bg-white text-indigo-600 px-6 py-2 rounded-xl flex items-center space-x-2 font-semibold hover:bg-gray-50 hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
//                 >
//                   {saving && <LoaderIcon className="h-4 w-4 animate-spin" />}
//                   <span>{saving ? 'Saving...' : 'Save Assignments'}</span>
//                 </button>
//               </div>
//             </div> */}

//             {/* Enhanced Statistics Cards */}
//             {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
//               <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-indigo-100 text-sm font-medium">Selected</p>
//                     <p className="text-white text-2xl font-bold">{selectedCount}</p>
//                   </div>
//                   <UserPlusIcon className="h-8 w-8 text-indigo-200" />
//                 </div>
//               </div>
//               <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-green-100 text-sm font-medium">In This Class</p>
//                     <p className="text-white text-2xl font-bold">{assignedHereCount}</p>
//                   </div>
//                   <UserCheckIcon className="h-8 w-8 text-green-200" />
//                 </div>
//               </div>
//               <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-yellow-100 text-sm font-medium">Other Classes</p>
//                     <p className="text-white text-2xl font-bold">{assignedElsewhereCount}</p>
//                   </div>
//                   <AlertTriangleIcon className="h-8 w-8 text-yellow-200" />
//                 </div>
//               </div>
//               <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-purple-100 text-sm font-medium">Unassigned</p>
//                     <p className="text-white text-2xl font-bold">{notAssignedCount}</p>
//                   </div>
//                   <UserMinusIcon className="h-8 w-8 text-purple-200" />
//                 </div>
//               </div>
//             </div> */}
//           {/* </div> */}
//         {/* </div> */}

//         {/* Enhanced Search and Filters */}
//         <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl px-6 py-5 mb-6">
//           <div className="space-y-4">
//             {/* Search Bar */}
//             <div className="flex items-center space-x-4">
//               <button
//                   onClick={() => navigate('/classes')}
//                   className="bg-gray-100 backdrop-blur-sm rounded-xl p-3 text-white hover:bg-white/30 transition-all duration-200"
//                 >
//                   <ArrowLeftIcon className="text-black h-6 w-6" />
//                 </button>
//               <div className="flex-1 relative">
//                 <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                 <input
//                   type="text"
//                   placeholder="Search students by name or admission number..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-12 pr-4 py-2.5 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
//                 />

//               </div>
//               <button
//                   onClick={() => loadStudents(false)}
//                   disabled={refreshing}
//                   className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium"
//                 >
//                   <RefreshCwIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
//                   <span>Refresh</span>
//                 </button>


//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium"
//               >
//                 <FilterIcon className="h-4 w-4" />
//                 <span>Filters</span>
//               </button>
//               <button
//                   onClick={handleSaveAssignments}
//                   disabled={saving || !classInfo}
//                   className="flex items-center space-x-2 px-4 py-2.5 bg-blue-500  text-white rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium"
//                 >
//                   {saving && <LoaderIcon className="h-4 w-4 animate-spin" />}
//                   <span>{saving ? 'Saving...' : 'Save Assignments'}</span>
//                 </button>
//             </div>

//             {/* Enhanced Filter Row */}
//             {showFilters && (
//               <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-xl">
//                 {/* Current Class Filter */}
//                 <div>
//                   <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                     <BookOpenIcon className="h-4 w-4 mr-1" />
//                     Current Class
//                   </label>
//                   <select
//                     value={classFilter}
//                     onChange={(e) => setClassFilter(e.target.value)}
//                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
//                   >
//                     <option value="">All Classes</option>
//                     {uniqueClasses.map(cls => (
//                       <option key={cls} value={cls}>Class {cls}</option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Section Filter */}
//                 <div>
//                   <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                     <Building2Icon className="h-4 w-4 mr-1" />
//                     Section
//                   </label>
//                   <select
//                     value={sectionFilter}
//                     onChange={(e) => setSectionFilter(e.target.value)}
//                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
//                   >
//                     <option value="">All Sections</option>
//                     {uniqueSections.map(section => (
//                       <option key={section} value={section}>Section {section}</option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Status Filter */}
//                 <div>
//                   <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                     <UserCheckIcon className="h-4 w-4 mr-1" />
//                     Status
//                   </label>
//                   <select
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
//                   >
//                     <option value="">All Status</option>
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </div>

//                 {/* Enhanced Assignment Filter */}
//                 <div>
//                   <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                     <Users2Icon className="h-4 w-4 mr-1" />
//                     Assignment
//                   </label>
//                   <select
//                     value={assignmentFilter}
//                     onChange={(e) => setAssignmentFilter(e.target.value)}
//                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
//                   >
//                     <option value="">All Students</option>
//                     <option value="assigned_here">In This Class</option>
//                     <option value="assigned_elsewhere">In Other Classes</option>
//                     <option value="not_assigned">Unassigned</option>
//                   </select>
//                 </div>

//                 {/* Clear Filters */}
//                 <div className="flex items-end md:col-span-2">
//                   <button
//                     onClick={clearFilters}
//                     className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 font-medium"
//                   >
//                     Clear All Filters
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Enhanced Students Table */}
//         <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
//           {loading ? (
//             <div className="p-12 text-center">
//               <div className="flex flex-col items-center space-y-4">
//                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
//                 <div className="space-y-2">
//                   <p className="text-gray-700 font-medium">Loading students...</p>
//                   <p className="text-gray-500 text-sm">Please wait while we fetch the data</p>
//                 </div>
//               </div>
//             </div>
//           ) : filteredStudents.length === 0 ? (
//             <div className="p-12 text-center">
//               <div className="flex flex-col items-center space-y-4">
//                 <div className="bg-gray-100 rounded-2xl p-6">
//                   <UsersIcon className="h-16 w-16 text-gray-400 mx-auto" />
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-gray-700 text-xl font-semibold">No students found</p>
//                   <p className="text-gray-500">Try adjusting your search or filter criteria</p>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
//                       <div className="flex items-center space-x-3">
//                         <input
//                           type="checkbox"
//                           checked={selectedStudents.size === filteredStudents.filter(s => s.assignmentStatus !== 'assigned_elsewhere').length && filteredStudents.filter(s => s.assignmentStatus !== 'assigned_elsewhere').length > 0}
//                           onChange={(e) => {
//                             if (e.target.checked) {
//                               // Only select students not assigned elsewhere
//                               const selectableStudents = filteredStudents.filter(s => s.assignmentStatus !== 'assigned_elsewhere')
//                               setSelectedStudents(new Set(selectableStudents.map(s => s.id)))
//                             } else {
//                               setSelectedStudents(new Set())
//                             }
//                           }}
//                           className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
//                         />
//                         <span>Select</span>
//                       </div>
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
//                       <div className="flex items-center space-x-2">
//                         <UserIcon className="h-4 w-4" />
//                         <span>Student</span>
//                       </div>
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
//                       <div className="flex items-center space-x-2">
//                         <GraduationCapIcon className="h-4 w-4" />
//                         <span>Current Class</span>
//                       </div>
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
//                       <div className="flex items-center space-x-2">
//                         <UserCheckIcon className="h-4 w-4" />
//                         <span>Status</span>
//                       </div>
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
//                       <div className="flex items-center space-x-2">
//                         <CheckIcon className="h-4 w-4" />
//                         <span>Assignment Status</span>
//                       </div>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200">
//                   {filteredStudents.map((student, index) => (
//                     <tr 
//                       key={student.id} 
//                       className={`hover:bg-blue-50/50 transition-all duration-300 cursor-pointer ${
//                         selectedStudents.has(student.id) ? 'bg-blue-50/70' : 
//                         student.assignmentStatus === 'assigned_elsewhere' ? 'bg-yellow-50/30' :
//                         index % 2 === 0 ? 'bg-white/30' : 'bg-gray-50/30'
//                       }`}
//                       onClick={() => handleStudentToggle(student)}
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <input
//                           type="checkbox"
//                           checked={selectedStudents.has(student.id)}
//                           onChange={() => handleStudentToggle(student)}
//                           className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
//                         />
//                       </td>

//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="h-12 w-12 flex-shrink-0">
//                             {student.profile_picture ? (
//                               <img
//                                 className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-lg"
//                                 src={student.profile_picture}
//                                 alt={student.full_name}
//                               />
//                             ) : (
//                               <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-white shadow-lg flex items-center justify-center">
//                                 <UserIcon className="h-6 w-6 text-gray-500" />
//                               </div>
//                             )}
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-semibold text-gray-900">
//                               {student.full_name}
//                             </div>
//                             <div className="text-sm text-gray-600 flex items-center">
//                               <IdCardIcon className="h-3 w-3 mr-1" />
//                               {student.admission_number}
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-semibold text-gray-900">
//                           Class {student.class_name} {student.section && `- ${student.section}`}
//                         </div>
//                         <div className="text-sm text-gray-600 flex items-center">
//                           <HashIcon className="h-3 w-3 mr-1" />
//                           Roll No: {student.roll_number}
//                         </div>
//                       </td>

//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${
//                           student.status === 'active'
//                             ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
//                             : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
//                         }`}>
//                           {student.status === 'active' ? (
//                             <>
//                               <UserCheckIcon className="h-3 w-3 mr-1" />
//                               ACTIVE
//                             </>
//                           ) : (
//                             <>
//                               <ShieldXIcon className="h-3 w-3 mr-1" />
//                               INACTIVE
//                             </>
//                           )}
//                         </span>
//                       </td>

//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           {student.assignmentStatus === 'assigned_here' ? (
//                             <div className="flex items-center text-green-600">
//                               <div className="bg-green-100 rounded-full p-1 mr-2">
//                                 <CheckIcon className="h-3 w-3" />
//                               </div>
//                               <span className="text-sm font-medium">Assigned Here</span>
//                             </div>
//                           ) : student.assignmentStatus === 'assigned_elsewhere' ? (
//                             <div className="flex items-center text-yellow-600">
//                               <div className="bg-yellow-100 rounded-full p-1 mr-2">
//                                 <AlertTriangleIcon className="h-3 w-3" />
//                               </div>
//                               <div className="flex flex-col">
//                                 <span className="text-sm font-medium">In Other Class</span>
//                                 <span className="text-xs text-gray-600">
//                                   Class {student.currentAssignment?.className}-{student.currentAssignment?.section}
//                                 </span>
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="flex items-center text-gray-500">
//                               <div className="bg-gray-100 rounded-full p-1 mr-2">
//                                 <XIcon className="h-3 w-3" />
//                               </div>
//                               <span className="text-sm font-medium">Not Assigned</span>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Enhanced Summary */}
//         {!loading && (
//           <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-6">
//                 <div className="flex items-center space-x-3">
//                   <div className="bg-blue-100 rounded-xl p-2">
//                     <Users2Icon className="h-6 w-6 text-blue-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-blue-900">
//                       {selectedCount} students selected for assignment
//                     </p>
//                     <p className="text-xs text-blue-700">
//                       {selectedCount > (classInfo?.capacity || 0) ? 
//                         `⚠️ Exceeds capacity by ${selectedCount - (classInfo?.capacity || 0)}` :
//                         `${(classInfo?.capacity || 0) - selectedCount} spots remaining`
//                       }
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
//                 <div className="text-blue-700 bg-blue-100 px-3 py-2 rounded-lg text-center font-medium">
//                   <div className="text-lg font-bold">{filteredStudents.length}</div>
//                   <div className="text-xs">Showing</div>
//                 </div>
//                 <div className="text-green-700 bg-green-100 px-3 py-2 rounded-lg text-center font-medium">
//                   <div className="text-lg font-bold">{assignedHereCount}</div>
//                   <div className="text-xs">Here</div>
//                 </div>
//                 <div className="text-yellow-700 bg-yellow-100 px-3 py-2 rounded-lg text-center font-medium">
//                   <div className="text-lg font-bold">{assignedElsewhereCount}</div>
//                   <div className="text-xs">Elsewhere</div>
//                 </div>
//                 <div className="text-purple-700 bg-purple-100 px-3 py-2 rounded-lg text-center font-medium">
//                   <div className="text-lg font-bold">{classInfo?.capacity || 0}</div>
//                   <div className="text-xs">Capacity</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeftIcon,
  SearchIcon,
  UsersIcon,
  CheckIcon,
  XIcon,
  LoaderIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  RefreshCwIcon,
  UserIcon,
  FilterIcon,
  Users2Icon,
  GraduationCapIcon,
  HashIcon,
  IdCardIcon,
  UserCheckIcon,
  ShieldXIcon,
  BookOpenIcon,
  Building2Icon,
  AlertTriangleIcon,
  ArrowRightIcon
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

// Enhanced Types
interface Student {
  id: string
  full_name: string
  admission_number: string
  roll_number: string
  class_name: string
  section?: string
  profile_picture?: string
  status: 'active' | 'inactive'
  assignmentStatus: 'assigned_here' | 'assigned_elsewhere' | 'not_assigned'
  currentAssignment?: {
    classId: string
    className: string
    section: string
  }
}

interface Class {
  id: string
  class_name: string
  section: string
  academic_year: string
  capacity: number
  current_strength: number
}

// Fix the ClassInfo interface for Supabase foreign key
interface ClassInfo {
  id: string
  class_name: string
  section: string
}

interface Assignment {
  student_id: string
  class_id: string
  classes: any  // Supabase returns an array or object depending on join semantics
}

interface NotificationState {
  show: boolean
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
}

interface ReassignmentConfirmation {
  show: boolean
  student: Student | null
  fromClass: string
  toClass: string
}

export const ClassStudents = () => {
  const { classId } = useParams()
  const navigate = useNavigate()

  // State Management
  const [classInfo, setClassInfo] = useState<Class | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [sectionFilter, setSectionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [assignmentFilter, setAssignmentFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())

  // Reassignment confirmation
  const [reassignmentConfirm, setReassignmentConfirm] = useState<ReassignmentConfirmation>({
    show: false,
    student: null,
    fromClass: '',
    toClass: ''
  })

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

  // Load class information
  const loadClassInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single()

      if (error) throw error
      setClassInfo(data)
    } catch (error) {
      console.error('Error loading class info:', error)
      showNotification('error', 'Loading Failed', 'Failed to load class information.')
    }
  }

  // Enhanced load students with proper assignment status
  const loadStudents = async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      // Get all active students
      const { data: allStudents, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('status', 'active')
        .order('full_name')

      if (studentsError) throw studentsError

      // Get ALL class assignments (not just for this class)
      const { data: allAssignments, error: assignmentsError } = await supabase
        .from('class_assignments')
        .select(`
          student_id,
          class_id,
          classes!class_assignments_class_id_fkey(
            id,
            class_name,
            section
          )
        `)

      if (assignmentsError && assignmentsError.code !== 'PGRST116') {
        throw assignmentsError
      }

      // Create assignment map - FIX: Access object properties correctly
      const assignmentMap = new Map()
      allAssignments?.forEach((assignment: any) => {
        assignmentMap.set(assignment.student_id, {
          classId: assignment.class_id,
          className: assignment.classes?.class_name || (Array.isArray(assignment.classes) && assignment.classes[0]?.class_name),
          section: assignment.classes?.section || (Array.isArray(assignment.classes) && assignment.classes[0]?.section)
        })
      })

      // Mark students with proper assignment status
      const studentsWithAssignment = allStudents.map(student => {
        const assignment = assignmentMap.get(student.id)

        let assignmentStatus: 'assigned_here' | 'assigned_elsewhere' | 'not_assigned'
        let currentAssignment = undefined

        if (assignment) {
          if (assignment.classId === classId) {
            assignmentStatus = 'assigned_here'
          } else {
            assignmentStatus = 'assigned_elsewhere'
          }
          currentAssignment = assignment
        } else {
          assignmentStatus = 'not_assigned'
        }

        return {
          ...student,
          assignmentStatus,
          currentAssignment
        }
      })

      setStudents(studentsWithAssignment)

      // Pre-select only students assigned to this class
      const assignedToThisClass = new Set(
        studentsWithAssignment
          .filter(s => s.assignmentStatus === 'assigned_here')
          .map(s => s.id)
      )
      setSelectedStudents(assignedToThisClass)

    } catch (error) {
      console.error('Error loading students:', error)
      showNotification('error', 'Loading Failed', 'Failed to load students. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    if (classId) {
      loadClassInfo()
      loadStudents()
    }
  }, [classId])

  // [Keep all your handler functions exactly as is]
  const handleStudentToggle = (student: Student) => {
    if (student.assignmentStatus === 'assigned_elsewhere' && !selectedStudents.has(student.id)) {
      setReassignmentConfirm({
        show: true,
        student: student,
        fromClass: `${student.currentAssignment?.className}-${student.currentAssignment?.section}`,
        toClass: `${classInfo?.class_name}-${classInfo?.section}`
      })
      return
    }

    const newSelection = new Set(selectedStudents)
    if (newSelection.has(student.id)) {
      newSelection.delete(student.id)
    } else {
      newSelection.add(student.id)
    }
    setSelectedStudents(newSelection)
  }

  const handleReassignmentConfirm = (confirmed: boolean) => {
    if (confirmed && reassignmentConfirm.student) {
      const newSelection = new Set(selectedStudents)
      newSelection.add(reassignmentConfirm.student.id)
      setSelectedStudents(newSelection)
    }

    setReassignmentConfirm({
      show: false,
      student: null,
      fromClass: '',
      toClass: ''
    })
  }

  const handleSaveAssignments = async () => {
    if (!classInfo) return

    try {
      setSaving(true)

      const { data: currentAssignments } = await supabase
        .from('class_assignments')
        .select('student_id')
        .eq('class_id', classId)

      const currentStudentIds = new Set(currentAssignments?.map(a => a.student_id) || [])

      const toAdd = Array.from(selectedStudents).filter(id => !currentStudentIds.has(id))
      const toRemove = Array.from(currentStudentIds).filter(id => !selectedStudents.has(id))

      const studentsToReassign = toAdd.filter(studentId => {
        const student = students.find(s => s.id === studentId)
        return student?.assignmentStatus === 'assigned_elsewhere'
      })

      if (studentsToReassign.length > 0) {
        for (const studentId of studentsToReassign) {
          const { error: removeError } = await supabase
            .from('class_assignments')
            .delete()
            .eq('student_id', studentId)

          if (removeError) throw removeError
        }
      }

      if (toAdd.length > 0) {
        const newAssignments = toAdd.map(studentId => ({
          class_id: classId,
          student_id: studentId,
          academic_year: classInfo.academic_year
        }))

        const { error: addError } = await supabase
          .from('class_assignments')
          .insert(newAssignments)

        if (addError) throw addError
      }

      if (toRemove.length > 0) {
        const { error: removeError } = await supabase
          .from('class_assignments')
          .delete()
          .eq('class_id', classId)
          .in('student_id', toRemove)

        if (removeError) throw removeError
      }

      const { error: updateError } = await supabase
        .from('classes')
        .update({ current_strength: selectedStudents.size })
        .eq('id', classId)

      if (updateError) throw updateError

      let message = `Successfully updated student assignments for Class ${classInfo.class_name}-${classInfo.section}`

      if (studentsToReassign.length > 0) {
        message += `. ${studentsToReassign.length} student(s) were moved from other classes.`
      }

      showNotification('success', 'Assignments Saved', message)

      setTimeout(() => loadStudents(false), 1000)

    } catch (error) {
      console.error('Error saving assignments:', error)
      showNotification('error', 'Save Failed', 'Failed to save student assignments. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // [Keep filter logic exactly as is]
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admission_number.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesClass = !classFilter || student.class_name === classFilter
    const matchesSection = !sectionFilter || student.section === sectionFilter
    const matchesStatus = !statusFilter || student.status === statusFilter

    const matchesAssignment = !assignmentFilter ||
      (assignmentFilter === 'assigned_here' && student.assignmentStatus === 'assigned_here') ||
      (assignmentFilter === 'assigned_elsewhere' && student.assignmentStatus === 'assigned_elsewhere') ||
      (assignmentFilter === 'not_assigned' && student.assignmentStatus === 'not_assigned')

    return matchesSearch && matchesClass && matchesSection && matchesStatus && matchesAssignment
  })

  const uniqueClasses = Array.from(new Set(students.map(s => s.class_name))).sort()
  const uniqueSections = Array.from(new Set(students.map(s => s.section).filter(Boolean))).sort()

  const clearFilters = () => {
    setSearchTerm('')
    setClassFilter('')
    setSectionFilter('')
    setStatusFilter('')
    setAssignmentFilter('')
  }

  const assignedHereCount = filteredStudents.filter(s => s.assignmentStatus === 'assigned_here').length
  const assignedElsewhereCount = filteredStudents.filter(s => s.assignmentStatus === 'assigned_elsewhere').length
  const notAssignedCount = filteredStudents.filter(s => s.assignmentStatus === 'not_assigned').length
  const selectedCount = selectedStudents.size

  return (
    <div className="min-h-screen bg-[#F6F9FC] p-8">
      <div className="max-w-[1600px] mx-auto space-y-7">
        {/* Enhanced Notification */}
        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 max-w-md w-full transition-all duration-500 transform ${notification.show ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-full scale-95 opacity-0'
            }`}>
            <div className={`rounded-[20px] shadow-float border p-5 backdrop-blur-lg ${notification.type === 'success' ? 'bg-emerald-50 border-emerald-200' :
                notification.type === 'error' ? 'bg-red-50 border-red-200' :
                  notification.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                    'bg-blue-50 border-blue-200'
              }`}>
              <div className="flex items-start gap-3">
                <div className={`rounded-full p-2 ${notification.type === 'success' ? 'bg-emerald-100' :
                    notification.type === 'error' ? 'bg-red-100' :
                      notification.type === 'warning' ? 'bg-amber-100' :
                        'bg-blue-100'
                  }`}>
                  {notification.type === 'success' && <CheckCircleIcon className="h-5 w-5 text-emerald-600" />}
                  {notification.type === 'error' && <AlertCircleIcon className="h-5 w-5 text-red-600" />}
                  {notification.type === 'warning' && <AlertCircleIcon className="h-5 w-5 text-amber-600" />}
                  {notification.type === 'info' && <InfoIcon className="h-5 w-5 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <h3
                    className={`mb-1 ${notification.type === 'success' ? 'text-emerald-900' :
                        notification.type === 'error' ? 'text-red-900' :
                          notification.type === 'warning' ? 'text-amber-900' :
                            'text-blue-900'
                      }`}
                    style={{ fontSize: '14px', fontWeight: 600 }}
                  >
                    {notification.title}
                  </h3>
                  <p
                    className={`${notification.type === 'success' ? 'text-emerald-800' :
                        notification.type === 'error' ? 'text-red-800' :
                          notification.type === 'warning' ? 'text-amber-800' :
                            'text-blue-800'
                      }`}
                    style={{ fontSize: '13px', fontWeight: 400 }}
                  >
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                  className={`rounded-full p-1 transition-colors ${notification.type === 'success' ? 'text-emerald-500 hover:bg-emerald-100' :
                      notification.type === 'error' ? 'text-red-500 hover:bg-red-100' :
                        notification.type === 'warning' ? 'text-amber-500 hover:bg-amber-100' :
                          'text-blue-500 hover:bg-blue-100'
                    }`}
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reassignment Confirmation Modal */}
        {reassignmentConfirm.show && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[24px] shadow-float max-w-md w-full">
              <div className="p-8 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-amber-50 rounded-full mb-6">
                  <AlertTriangleIcon className="h-8 w-8 text-amber-600" />
                </div>

                <h3
                  className="text-gray-900 mb-2"
                  style={{ fontSize: '20px', fontWeight: 600 }}
                >
                  Student Reassignment
                </h3>

                <div className="mb-6">
                  <p
                    className="text-gray-600 mb-4"
                    style={{ fontSize: '14px' }}
                  >
                    <strong>{reassignmentConfirm.student?.full_name}</strong> is currently assigned to{' '}
                    <strong>Class {reassignmentConfirm.fromClass}</strong>.
                  </p>

                  <div className="bg-amber-50 border border-amber-200 rounded-[16px] p-4 mb-4">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-gray-700">From:</span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-lg font-medium">
                        {reassignmentConfirm.fromClass}
                      </span>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg font-medium">
                        {reassignmentConfirm.toClass}
                      </span>
                    </div>
                  </div>

                  <p
                    className="text-gray-600"
                    style={{ fontSize: '13px' }}
                  >
                    Do you want to move this student to <strong>Class {reassignmentConfirm.toClass}</strong>?
                  </p>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleReassignmentConfirm(false)}
                    className="px-6 py-2.5 text-gray-700 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all font-medium"
                    style={{ fontSize: '14px' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReassignmentConfirm(true)}
                    className="px-6 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all font-semibold shadow-sm"
                    style={{ fontSize: '14px' }}
                  >
                    Move Student
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/classes')}
                className="bg-gray-100 rounded-xl p-3 text-gray-700 hover:bg-gray-200 transition-all"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search students by name or admission number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium placeholder-gray-400"
                  style={{ fontSize: '14px' }}
                />
              </div>
              <button
                onClick={() => loadStudents(false)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                style={{ fontSize: '14px' }}
              >
                <RefreshCwIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                style={{ fontSize: '14px' }}
              >
                <FilterIcon className="h-4 w-4" />
                <span>Filters</span>
              </button>
              <button
                onClick={handleSaveAssignments}
                disabled={saving || !classInfo}
                className="flex items-center gap-2 px-6 py-2.5 gradient-primary text-white rounded-xl shadow-soft hover:shadow-float transition-all font-medium disabled:opacity-50"
                style={{ fontSize: '14px' }}
              >
                {saving && <LoaderIcon className="h-4 w-4 animate-spin" />}
                <span>{saving ? 'Saving...' : 'Save Assignments'}</span>
              </button>
            </div>

            {/* Enhanced Filter Row */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-5 bg-gray-50 rounded-[16px]">
                <div>
                  <label
                    className="flex items-center text-gray-700 mb-2"
                    style={{ fontSize: '13px', fontWeight: 600 }}
                  >
                    <BookOpenIcon className="h-4 w-4 mr-1" />
                    Current Class
                  </label>
                  <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium"
                    style={{ fontSize: '14px' }}
                  >
                    <option value="">All Classes</option>
                    {uniqueClasses.map(cls => (
                      <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="flex items-center text-gray-700 mb-2"
                    style={{ fontSize: '13px', fontWeight: 600 }}
                  >
                    <Building2Icon className="h-4 w-4 mr-1" />
                    Section
                  </label>
                  <select
                    value={sectionFilter}
                    onChange={(e) => setSectionFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium"
                    style={{ fontSize: '14px' }}
                  >
                    <option value="">All Sections</option>
                    {uniqueSections.map(section => (
                      <option key={section} value={section}>Section {section}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="flex items-center text-gray-700 mb-2"
                    style={{ fontSize: '13px', fontWeight: 600 }}
                  >
                    <UserCheckIcon className="h-4 w-4 mr-1" />
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium"
                    style={{ fontSize: '14px' }}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label
                    className="flex items-center text-gray-700 mb-2"
                    style={{ fontSize: '13px', fontWeight: 600 }}
                  >
                    <Users2Icon className="h-4 w-4 mr-1" />
                    Assignment
                  </label>
                  <select
                    value={assignmentFilter}
                    onChange={(e) => setAssignmentFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium"
                    style={{ fontSize: '14px' }}
                  >
                    <option value="">All Students</option>
                    <option value="assigned_here">In This Class</option>
                    <option value="assigned_elsewhere">In Other Classes</option>
                    <option value="not_assigned">Unassigned</option>
                  </select>
                </div>

                <div className="flex items-end md:col-span-2">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-white hover:shadow-sm transition-all font-medium"
                    style={{ fontSize: '14px' }}
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
                <div className="space-y-2">
                  <p className="text-gray-700" style={{ fontSize: '15px', fontWeight: 600 }}>
                    Loading students...
                  </p>
                  <p className="text-gray-500" style={{ fontSize: '13px' }}>
                    Please wait while we fetch the data
                  </p>
                </div>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="bg-gray-100 rounded-[20px] p-6">
                  <UsersIcon className="h-16 w-16 text-gray-400 mx-auto" />
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700" style={{ fontSize: '18px', fontWeight: 600 }}>
                    No students found
                  </p>
                  <p className="text-gray-500" style={{ fontSize: '14px' }}>
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedStudents.size === filteredStudents.filter(s => s.assignmentStatus !== 'assigned_elsewhere').length && filteredStudents.filter(s => s.assignmentStatus !== 'assigned_elsewhere').length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const selectableStudents = filteredStudents.filter(s => s.assignmentStatus !== 'assigned_elsewhere')
                              setSelectedStudents(new Set(selectableStudents.map(s => s.id)))
                            } else {
                              setSelectedStudents(new Set())
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                        <span
                          className="text-gray-700 uppercase tracking-wider"
                          style={{ fontSize: '12px', fontWeight: 600 }}
                        >
                          Select
                        </span>
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-gray-700 uppercase tracking-wider"
                      style={{ fontSize: '12px', fontWeight: 600 }}
                    >
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        <span>Student</span>
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-gray-700 uppercase tracking-wider"
                      style={{ fontSize: '12px', fontWeight: 600 }}
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCapIcon className="h-4 w-4" />
                        <span>Current Class</span>
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-gray-700 uppercase tracking-wider"
                      style={{ fontSize: '12px', fontWeight: 600 }}
                    >
                      <div className="flex items-center gap-2">
                        <UserCheckIcon className="h-4 w-4" />
                        <span>Status</span>
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-gray-700 uppercase tracking-wider"
                      style={{ fontSize: '12px', fontWeight: 600 }}
                    >
                      <div className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4" />
                        <span>Assignment Status</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student, index) => (
                    <tr
                      key={student.id}
                      className={`hover:bg-blue-50 transition-all cursor-pointer ${selectedStudents.has(student.id) ? 'bg-blue-50' :
                          student.assignmentStatus === 'assigned_elsewhere' ? 'bg-amber-50/30' :
                            'bg-white hover:bg-gray-50'
                        }`}
                      onClick={() => handleStudentToggle(student)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedStudents.has(student.id)}
                          onChange={() => handleStudentToggle(student)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            {student.profile_picture ? (
                              <img
                                className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                                src={student.profile_picture}
                                alt={student.full_name}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center">
                                <UserIcon className="h-6 w-6 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div
                              className="text-gray-900"
                              style={{ fontSize: '14px', fontWeight: 600 }}
                            >
                              {student.full_name}
                            </div>
                            <div
                              className="text-gray-600 flex items-center"
                              style={{ fontSize: '12px' }}
                            >
                              <IdCardIcon className="h-3 w-3 mr-1" />
                              {student.admission_number}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="text-gray-900"
                          style={{ fontSize: '14px', fontWeight: 600 }}
                        >
                          Class {student.class_name} {student.section && `- ${student.section}`}
                        </div>
                        <div
                          className="text-gray-600 flex items-center"
                          style={{ fontSize: '12px' }}
                        >
                          <HashIcon className="h-3 w-3 mr-1" />
                          Roll No: {student.roll_number}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full font-medium ${student.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                          }`} style={{ fontSize: '12px' }}>
                          {student.status === 'active' ? (
                            <>
                              <UserCheckIcon className="h-3 w-3 mr-1" />
                              ACTIVE
                            </>
                          ) : (
                            <>
                              <ShieldXIcon className="h-3 w-3 mr-1" />
                              INACTIVE
                            </>
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {student.assignmentStatus === 'assigned_here' ? (
                            <div className="flex items-center text-emerald-600">
                              <div className="bg-emerald-100 rounded-full p-1 mr-2">
                                <CheckIcon className="h-3 w-3" />
                              </div>
                              <span style={{ fontSize: '13px', fontWeight: 500 }}>
                                Assigned Here
                              </span>
                            </div>
                          ) : student.assignmentStatus === 'assigned_elsewhere' ? (
                            <div className="flex items-center text-amber-600">
                              <div className="bg-amber-100 rounded-full p-1 mr-2">
                                <AlertTriangleIcon className="h-3 w-3" />
                              </div>
                              <div className="flex flex-col">
                                <span style={{ fontSize: '13px', fontWeight: 500 }}>
                                  In Other Class
                                </span>
                                <span className="text-gray-600" style={{ fontSize: '11px' }}>
                                  Class {student.currentAssignment?.className}-{student.currentAssignment?.section}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center text-gray-500">
                              <div className="bg-gray-100 rounded-full p-1 mr-2">
                                <XIcon className="h-3 w-3" />
                              </div>
                              <span style={{ fontSize: '13px', fontWeight: 500 }}>
                                Not Assigned
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Enhanced Summary */}
        {!loading && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-[20px] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-[14px] p-2">
                    <Users2Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p
                      className="text-blue-900"
                      style={{ fontSize: '14px', fontWeight: 600 }}
                    >
                      {selectedCount} students selected for assignment
                    </p>
                    <p
                      className="text-blue-700"
                      style={{ fontSize: '12px' }}
                    >
                      {selectedCount > (classInfo?.capacity || 0) ?
                        `⚠️ Exceeds capacity by ${selectedCount - (classInfo?.capacity || 0)}` :
                        `${(classInfo?.capacity || 0) - selectedCount} spots remaining`
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-blue-700 bg-blue-100 px-3 py-2 rounded-lg text-center font-medium">
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>{filteredStudents.length}</div>
                  <div style={{ fontSize: '11px' }}>Showing</div>
                </div>
                <div className="text-emerald-700 bg-emerald-100 px-3 py-2 rounded-lg text-center font-medium">
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>{assignedHereCount}</div>
                  <div style={{ fontSize: '11px' }}>Here</div>
                </div>
                <div className="text-amber-700 bg-amber-100 px-3 py-2 rounded-lg text-center font-medium">
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>{assignedElsewhereCount}</div>
                  <div style={{ fontSize: '11px' }}>Elsewhere</div>
                </div>
                <div className="text-purple-700 bg-purple-100 px-3 py-2 rounded-lg text-center font-medium">
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>{classInfo?.capacity || 0}</div>
                  <div style={{ fontSize: '11px' }}>Capacity</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
