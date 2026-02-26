// // FeeStructureMaster.tsx
// import React, { useState, useEffect, useMemo, useRef } from 'react'
// import { v4 as uuidv4 } from 'uuid'
// import { supabase } from '../../../lib/supabase'

// type AcademicYear = string
// type FeeFrequency = 'One-Time' | 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Annually'

// interface FeeComponent {
//   id: string
//   type: string
//   amount: number
//   frequency: FeeFrequency
//   dueDate: string // yyyy-mm-dd
// }

// // Updated to match database schema
// type ApplicableForOption = 'All' | 'SpecificGrade' | 'StudentGroup'

// interface FeeStructure {
//   id: string
//   name: string
//   academicYear: AcademicYear
//   applicableFor: ApplicableForOption
//   applicableGrades: string[] // Changed from applicableClasses
//   applicableStudents: string[]
//   totalAmount: number
//   status: 'Active' | 'Inactive'
//   feeComponents: FeeComponent[]
// }

// interface ClassOption {
//   class_name: string
//   academic_year: string
// }

// interface Student {
//   id: string
//   student_name: string
//   class_name: string
// }

// const feeFrequencies: FeeFrequency[] = ['One-Time', 'Monthly', 'Quarterly', 'Half-Yearly', 'Annually']

// const FeeStructureMaster: React.FC = () => {
//   const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([])
//   const [name, setName] = useState('')
//   const [academicYear, setAcademicYear] = useState<AcademicYear>('')
//   const [applicableFor, setApplicableFor] = useState<ApplicableForOption>('All')
//   const [applicableGrades, setApplicableGrades] = useState<string[]>([]) // Changed from applicableClasses
//   const [applicableStudents, setApplicableStudents] = useState<string[]>([])
//   const [status, setStatus] = useState<'Active' | 'Inactive'>('Active')
//   const [feeComponents, setFeeComponents] = useState<FeeComponent[]>([])
//   const [errors, setErrors] = useState<{ [key: string]: string }>({})
//   const [loading, setLoading] = useState(false)

//   // Edit mode
//   const [isEditMode, setIsEditMode] = useState(false)
//   const [editingId, setEditingId] = useState<string | null>(null)

//   // View modal
//   const [viewModalOpen, setViewModalOpen] = useState(false)
//   const [viewingStructure, setViewingStructure] = useState<FeeStructure | null>(null)

//   // Delete confirmation
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false)
//   const [deletingId, setDeletingId] = useState<string | null>(null)

//   // Dropdown menu state
//   const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
//   const dropdownRef = useRef<HTMLDivElement>(null)

//   // Dropdown data
//   const [academicYears, setAcademicYears] = useState<string[]>([])
//   const [availableClasses, setAvailableClasses] = useState<ClassOption[]>([])
//   const [availableStudents, setAvailableStudents] = useState<Student[]>([])

//   // Search and pagination for students
//   const [studentSearchQuery, setStudentSearchQuery] = useState('')
//   const [showAllStudents, setShowAllStudents] = useState(false)
//   const INITIAL_STUDENT_LIMIT = 5

//   useEffect(() => {
//     fetchFeeStructures()
//     fetchAcademicYears()
//   }, [])

//   useEffect(() => {
//     if (academicYear && applicableFor === 'SpecificGrade') {
//       fetchClassesByAcademicYear(academicYear)
//     }
//   }, [academicYear, applicableFor])

//   useEffect(() => {
//     if (academicYear && applicableFor === 'StudentGroup') {
//       fetchStudentsByAcademicYear(academicYear)
//     }
//   }, [academicYear, applicableFor])

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setOpenDropdownId(null)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   // Filter students based on search query
//   const filteredStudents = useMemo(() => {
//     if (!studentSearchQuery.trim()) {
//       return availableStudents
//     }
//     return availableStudents.filter((student) =>
//       student.student_name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
//       student.class_name.toLowerCase().includes(studentSearchQuery.toLowerCase())
//     )
//   }, [availableStudents, studentSearchQuery])

//   // Get visible students (limited to 5 or show all)
//   const visibleStudents = useMemo(() => {
//     if (showAllStudents) {
//       return filteredStudents
//     }
//     return filteredStudents.slice(0, INITIAL_STUDENT_LIMIT)
//   }, [filteredStudents, showAllStudents])

//   async function fetchAcademicYears() {
//     try {
//       const { data, error } = await supabase
//         .from('class_assignments')
//         .select('academic_year')
//         .order('academic_year', { ascending: false })

//       if (error) throw error

//       if (data) {
//         const uniqueYears = Array.from(new Set(data.map((item) => item.academic_year)))
//         setAcademicYears(uniqueYears)
//         if (uniqueYears.length > 0 && !academicYear) {
//           setAcademicYear(uniqueYears[0])
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching academic years:', error)
//     }
//   }

//   async function fetchClassesByAcademicYear(year: string) {
//     try {
//       const { data, error } = await supabase
//         .from('class_assignments')
//         .select('class_name, academic_year')
//         .eq('academic_year', year)

//       if (error) throw error

//       if (data) {
//         const uniqueClasses = Array.from(
//           new Set(data.map((item) => item.class_name))
//         ).map((className) => ({
//           class_name: className,
//           academic_year: year,
//         }))
//         setAvailableClasses(uniqueClasses)
//       }
//     } catch (error) {
//       console.error('Error fetching classes:', error)
//     }
//   }

//   async function fetchStudentsByAcademicYear(year: string) {
//     try {
//       const { data, error } = await supabase
//         .from('class_assignments')
//         .select('student_id, student_name, class_name')
//         .eq('academic_year', year)

//       if (error) throw error

//       if (data) {
//         const students: Student[] = data.map((item) => ({
//           id: item.student_id,
//           student_name: item.student_name || 'Unknown Student',
//           class_name: item.class_name || 'N/A',
//         }))
//         setAvailableStudents(students)
//       }
//     } catch (error) {
//       console.error('Error fetching students:', error)
//     }
//   }

//   async function fetchFeeStructures() {
//     setLoading(true)
//     try {
//       let { data, error } = await supabase
//         .from('fee_structures')
//         .select(`
//           *,
//           fee_components:fee_components_table(*)
//         `)
//         .order('created_at', { ascending: false })

//       if (error) throw error

//       if (data) {
//         const structures: FeeStructure[] = data.map((fs: any) => ({
//           id: fs.id,
//           name: fs.name,
//           academicYear: fs.academic_year,
//           applicableFor: fs.applicable_for,
//           applicableGrades: fs.applicable_grades || [],
//           applicableStudents: fs.applicable_students || [],
//           totalAmount: Number(fs.total_amount),
//           status: fs.status,
//           feeComponents: fs.fee_components?.map((fc: any) => ({
//             id: fc.id,
//             type: fc.type,
//             amount: Number(fc.amount),
//             frequency: fc.frequency,
//             dueDate: fc.due_date,
//           })) || [],
//         }))
//         setFeeStructures(structures)
//       }
//     } catch (error) {
//       console.error('Error fetching fee structures:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const addFeeComponent = () => {
//     setFeeComponents((prev) => [
//       ...prev,
//       { id: uuidv4(), type: '', amount: 0, frequency: 'One-Time', dueDate: '' },
//     ])
//   }

//   const removeFeeComponent = (id: string) => {
//     setFeeComponents((prev) => prev.filter((comp) => comp.id !== id))
//   }

//   const updateFeeComponent = (id: string, field: keyof Omit<FeeComponent, 'id'>, value: any) => {
//     setFeeComponents((prev) =>
//       prev.map((comp) => (comp.id === id ? { ...comp, [field]: value } : comp)),
//     )
//   }

//   const toggleGrade = (gradeName: string) => {
//     if (applicableGrades.includes(gradeName)) {
//       setApplicableGrades(applicableGrades.filter((g) => g !== gradeName))
//     } else {
//       setApplicableGrades([...applicableGrades, gradeName])
//     }
//   }

//   const toggleStudent = (studentId: string) => {
//     if (applicableStudents.includes(studentId)) {
//       setApplicableStudents(applicableStudents.filter((s) => s !== studentId))
//     } else {
//       setApplicableStudents([...applicableStudents, studentId])
//     }
//   }

//   const totalAmount = useMemo(() => {
//     return feeComponents.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
//   }, [feeComponents])

//   const validateForm = (): boolean => {
//     const newErrors: { [key: string]: string } = {}
//     if (!name.trim()) newErrors.name = 'Structure Name is required'
//     if (!academicYear) newErrors.academicYear = 'Academic Year is required'
//     if (applicableFor === 'SpecificGrade' && applicableGrades.length === 0)
//       newErrors.applicableGrades = 'Select at least one grade/class'
//     if (applicableFor === 'StudentGroup' && applicableStudents.length === 0)
//       newErrors.applicableStudents = 'Select at least one student'
//     if (feeComponents.length === 0) newErrors.feeComponents = 'Add at least one fee component'

//     feeComponents.forEach((comp) => {
//       if (!comp.type.trim()) newErrors[`feeType-${comp.id}`] = 'Fee Type is required'
//       if (comp.amount <= 0) newErrors[`amount-${comp.id}`] = 'Amount must be greater than zero'
//       if (!comp.frequency) newErrors[`frequency-${comp.id}`] = 'Frequency is required'
//       if (!comp.dueDate) newErrors[`dueDate-${comp.id}`] = 'Due Date is required'
//     })

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const resetForm = () => {
//     setName('')
//     setApplicableFor('All')
//     setApplicableGrades([])
//     setApplicableStudents([])
//     setStatus('Active')
//     setFeeComponents([])
//     setErrors({})
//     setStudentSearchQuery('')
//     setShowAllStudents(false)
//     setIsEditMode(false)
//     setEditingId(null)
//   }

//   const handleSave = async () => {
//     if (!validateForm()) return
//     setLoading(true)
//     try {
//       if (isEditMode && editingId) {
//         // Update existing fee structure
//         const updateData: any = {
//           name,
//           academic_year: academicYear,
//           applicable_for: applicableFor,
//           total_amount: totalAmount,
//           status,
//         }

//         // Set fields based on applicableFor
//         if (applicableFor === 'SpecificGrade') {
//           updateData.applicable_grades = applicableGrades
//           updateData.applicable_students = null
//         } else if (applicableFor === 'StudentGroup') {
//           updateData.applicable_students = applicableStudents
//           updateData.applicable_grades = null
//         } else {
//           // For 'All'
//           updateData.applicable_grades = null
//           updateData.applicable_students = null
//         }

//         console.log('Updating with data:', updateData)

//         const { error: fsError } = await supabase
//           .from('fee_structures')
//           .update(updateData)
//           .eq('id', editingId)

//         if (fsError) {
//           console.error('Update error details:', fsError)
//           throw fsError
//         }

//         // Delete old fee components
//         const { error: deleteError } = await supabase
//           .from('fee_components_table')
//           .delete()
//           .eq('fee_structure_id', editingId)

//         if (deleteError) throw deleteError

//         // Insert new fee components
//         const feeComponentsToInsert = feeComponents.map((fc) => ({
//           fee_structure_id: editingId,
//           type: fc.type,
//           amount: fc.amount,
//           frequency: fc.frequency,
//           due_date: fc.dueDate,
//         }))

//         const { error: fcError } = await supabase
//           .from('fee_components_table')
//           .insert(feeComponentsToInsert)

//         if (fcError) throw fcError
//       } else {
//         // Insert new fee structure
//         const insertData: any = {
//           name,
//           academic_year: academicYear,
//           applicable_for: applicableFor,
//           total_amount: totalAmount,
//           status,
//         }

//         // Set fields based on applicableFor
//         if (applicableFor === 'SpecificGrade') {
//           insertData.applicable_grades = applicableGrades
//         } else if (applicableFor === 'StudentGroup') {
//           insertData.applicable_students = applicableStudents
//         }
//         // For 'All', don't include these fields

//         console.log('Inserting data:', insertData)

//         const { data: fsData, error: fsError } = await supabase
//           .from('fee_structures')
//           .insert(insertData)
//           .select()
//           .single()

//         if (fsError) {
//           console.error('Insert error details:', fsError)
//           throw fsError
//         }

//         const fsId = fsData.id

//         // Insert fee components
//         const feeComponentsToInsert = feeComponents.map((fc) => ({
//           fee_structure_id: fsId,
//           type: fc.type,
//           amount: fc.amount,
//           frequency: fc.frequency,
//           due_date: fc.dueDate,
//         }))

//         const { error: fcError } = await supabase
//           .from('fee_components_table')
//           .insert(feeComponentsToInsert)

//         if (fcError) throw fcError
//       }

//       await fetchFeeStructures()
//       resetForm()
//       alert('Fee structure saved successfully!')
//     } catch (error) {
//       console.error('Error saving fee structure:', error)
//       alert('Failed to save fee structure. Please check the console for details.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleEdit = (structure: FeeStructure) => {
//     setIsEditMode(true)
//     setEditingId(structure.id)
//     setName(structure.name)
//     setAcademicYear(structure.academicYear)
//     setApplicableFor(structure.applicableFor)
//     setApplicableGrades(structure.applicableGrades)
//     setApplicableStudents(structure.applicableStudents)
//     setStatus(structure.status)
//     setFeeComponents(structure.feeComponents)
//     setOpenDropdownId(null)

//     // Scroll to form
//     window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
//   }

//   const handleView = (structure: FeeStructure) => {
//     setViewingStructure(structure)
//     setViewModalOpen(true)
//     setOpenDropdownId(null)
//   }

//   const handleDeleteClick = (id: string) => {
//     setDeletingId(id)
//     setDeleteModalOpen(true)
//     setOpenDropdownId(null)
//   }

//   const handleDeleteConfirm = async () => {
//     if (!deletingId) return
//     setLoading(true)
//     try {
//       // Delete fee components first (cascade should handle this, but being explicit)
//       const { error: fcError } = await supabase
//         .from('fee_components_table')
//         .delete()
//         .eq('fee_structure_id', deletingId)

//       if (fcError) throw fcError

//       // Delete fee structure
//       const { error: fsError } = await supabase
//         .from('fee_structures')
//         .delete()
//         .eq('id', deletingId)

//       if (fsError) throw fsError

//       await fetchFeeStructures()
//       setDeleteModalOpen(false)
//       setDeletingId(null)
//       alert('Fee structure deleted successfully!')
//     } catch (error) {
//       console.error('Error deleting fee structure:', error)
//       alert('Failed to delete fee structure.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const toggleDropdown = (id: string) => {
//     setOpenDropdownId(openDropdownId === id ? null : id)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//             Fee Structure Master
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400">
//             Manage and create fee structures for your institution
//           </p>
//         </div>

//         {/* Loading Indicator */}
//         {loading && (
//           <div className="mb-6 flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3">
//             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
//             <p className="text-blue-600 dark:text-blue-400 font-medium">Loading...</p>
//           </div>
//         )}

//         {/* Existing Fee Structures Table */}
//         <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Structure Name</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Academic Year</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Applicable For</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Grades / Students</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Total Amount</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
//                   <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                 {feeStructures.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <svg
//                           className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={1.5}
//                             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                           />
//                         </svg>
//                         <p className="text-gray-500 dark:text-gray-400 text-lg">
//                           No fee structures defined yet
//                         </p>
//                         <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
//                           Create your first fee structure below
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   feeStructures.map((fs) => (
//                     <tr
//                       key={fs.id}
//                       className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
//                     >
//                       <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">
//                         {fs.name}
//                       </td>
//                       <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
//                         {fs.academicYear}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
//                           {fs.applicableFor === 'SpecificGrade'
//                             ? 'Specific Grades'
//                             : fs.applicableFor === 'StudentGroup'
//                             ? 'Student Group'
//                             : 'All Students'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
//                         {fs.applicableFor === 'SpecificGrade'
//                           ? fs.applicableGrades.join(', ')
//                           : fs.applicableFor === 'StudentGroup'
//                           ? `${fs.applicableStudents.length} student(s)`
//                           : 'All Students'}
//                       </td>
//                       <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-semibold">
//                         ${fs.totalAmount.toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                             fs.status === 'Active'
//                               ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
//                               : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
//                           }`}
//                         >
//                           {fs.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-center">
//                         <div className="relative inline-block" ref={openDropdownId === fs.id ? dropdownRef : null}>
//                           <button
//                             onClick={() => toggleDropdown(fs.id)}
//                             className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
//                             aria-label="Actions"
//                           >
//                             <svg
//                               className="w-5 h-5 text-gray-600 dark:text-gray-400"
//                               fill="currentColor"
//                               viewBox="0 0 20 20"
//                             >
//                               <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
//                             </svg>
//                           </button>

//                           {/* Dropdown Menu */}
//                           {openDropdownId === fs.id && (
//                             <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-fadeIn">
//                               <div className="py-1">
//                                 <button
//                                   onClick={() => handleView(fs)}
//                                   className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150"
//                                 >
//                                   <svg
//                                     className="w-4 h-4 text-blue-600"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                                     />
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                                     />
//                                   </svg>
//                                   View Details
//                                 </button>
//                                 <button
//                                   onClick={() => handleEdit(fs)}
//                                   className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-150"
//                                 >
//                                   <svg
//                                     className="w-4 h-4 text-green-600"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                                     />
//                                   </svg>
//                                   Edit
//                                 </button>
//                                 <button
//                                   onClick={() => handleDeleteClick(fs.id)}
//                                   className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
//                                 >
//                                   <svg
//                                     className="w-4 h-4"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                                     />
//                                   </svg>
//                                   Delete
//                                 </button>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Create/Edit Fee Structure Form */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-3">
//               <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-700 rounded-full"></div>
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                 {isEditMode ? 'Edit Fee Structure' : 'Create New Fee Structure'}
//               </h3>
//             </div>
//             {isEditMode && (
//               <button
//                 onClick={resetForm}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
//               >
//                 Cancel Edit
//               </button>
//             )}
//           </div>

//           {/* Basic Information */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//             <div>
//               <label
//                 htmlFor="structureName"
//                 className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
//               >
//                 Structure Name
//               </label>
//               <input
//                 id="structureName"
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className={`w-full px-4 py-3 rounded-lg border ${
//                   errors.name
//                     ? 'border-red-500 focus:ring-red-500'
//                     : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
//                 } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all duration-200`}
//                 placeholder="e.g., Grade 6 - 2024-25"
//               />
//               {errors.name && (
//                 <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
//                   <span>⚠</span> {errors.name}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label
//                 htmlFor="academicYear"
//                 className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
//               >
//                 Academic Year
//               </label>
//               <select
//                 id="academicYear"
//                 value={academicYear}
//                 onChange={(e) => setAcademicYear(e.target.value)}
//                 className={`w-full px-4 py-3 rounded-lg border ${
//                   errors.academicYear
//                     ? 'border-red-500 focus:ring-red-500'
//                     : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
//                 } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all duration-200`}
//               >
//                 <option value="">Select Academic Year</option>
//                 {academicYears.map((year) => (
//                   <option key={year} value={year}>
//                     {year}
//                   </option>
//                 ))}
//               </select>
//               {errors.academicYear && (
//                 <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
//                   <span>⚠</span> {errors.academicYear}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label
//                 htmlFor="applicableFor"
//                 className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
//               >
//                 Applicable For
//               </label>
//               <select
//                 id="applicableFor"
//                 value={applicableFor}
//                 onChange={(e) => {
//                   setApplicableFor(e.target.value as ApplicableForOption)
//                   setApplicableGrades([])
//                   setApplicableStudents([])
//                   setStudentSearchQuery('')
//                   setShowAllStudents(false)
//                 }}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
//               >
//                 <option value="All">All Students</option>
//                 <option value="SpecificGrade">Specific Grades</option>
//                 <option value="StudentGroup">Student Group</option>
//               </select>
//             </div>
//           </div>

//           {/* Grade Selection */}
//           {applicableFor === 'SpecificGrade' && (
//             <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
//               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
//                 Select Grades/Classes
//               </label>
//               <div className="flex flex-wrap gap-3">
//                 {availableClasses.length === 0 ? (
//                   <p className="text-gray-500 dark:text-gray-400 text-sm italic">
//                     No grades/classes available for selected academic year
//                   </p>
//                 ) : (
//                   availableClasses.map((classOption) => {
//                     const gradeName = classOption.class_name
//                     const selected = applicableGrades.includes(gradeName)

//                     return (
//                       <button
//                         key={classOption.class_name}
//                         type="button"
//                         onClick={() => toggleGrade(gradeName)}
//                         className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
//                           selected
//                             ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50'
//                             : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400'
//                         }`}
//                       >
//                         {gradeName}
//                       </button>
//                     )
//                   })
//                 )}
//               </div>
//               {errors.applicableGrades && (
//                 <p className="text-red-500 text-xs mt-3 flex items-center gap-1">
//                   <span>⚠</span> {errors.applicableGrades}
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Student Selection */}
//           {applicableFor === 'StudentGroup' && (
//             <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
//               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
//                 Select Students
//               </label>

//               {/* Search Bar */}
//               <div className="mb-4 relative">
//                 <input
//                   type="text"
//                   value={studentSearchQuery}
//                   onChange={(e) => {
//                     setStudentSearchQuery(e.target.value)
//                     setShowAllStudents(false)
//                   }}
//                   placeholder="Search students by name or class..."
//                   className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
//                 />
//                 <svg
//                   className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//               </div>

//               {/* Student List */}
//               <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 max-h-80 overflow-y-auto">
//                 {availableStudents.length === 0 ? (
//                   <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8 italic">
//                     No students available for selected academic year
//                   </p>
//                 ) : filteredStudents.length === 0 ? (
//                   <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8 italic">
//                     No students match your search
//                   </p>
//                 ) : (
//                   <>
//                     {visibleStudents.map((student) => {
//                       const selected = applicableStudents.includes(student.id)
//                       return (
//                         <div
//                           key={student.id}
//                           className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-150 border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${
//                             selected
//                               ? 'bg-blue-50 dark:bg-blue-900/20'
//                               : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
//                           }`}
//                           onClick={() => toggleStudent(student.id)}
//                         >
//                           <input
//                             type="checkbox"
//                             checked={selected}
//                             onChange={() => toggleStudent(student.id)}
//                             className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
//                           />
//                           <div className="flex-1">
//                             <span className="text-gray-900 dark:text-gray-100 font-medium">
//                               {student.student_name}
//                             </span>
//                             <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">
//                               ({student.class_name})
//                             </span>
//                           </div>
//                         </div>
//                       )
//                     })}

//                     {/* Show More/Show Less Button */}
//                     {filteredStudents.length > INITIAL_STUDENT_LIMIT && (
//                       <button
//                         type="button"
//                         onClick={() => setShowAllStudents(!showAllStudents)}
//                         className="w-full py-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm font-semibold transition-colors duration-150"
//                       >
//                         {showAllStudents
//                           ? 'Show Less'
//                           : `Show ${filteredStudents.length - INITIAL_STUDENT_LIMIT} More Students`}
//                       </button>
//                     )}
//                   </>
//                 )}
//               </div>

//               {/* Selected Count */}
//               {applicableStudents.length > 0 && (
//                 <div className="mt-3 flex items-center gap-2 text-sm">
//                   <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs">
//                     {applicableStudents.length}
//                   </span>
//                   <span className="text-gray-600 dark:text-gray-400">
//                     student{applicableStudents.length !== 1 ? 's' : ''} selected
//                   </span>
//                 </div>
//               )}

//               {errors.applicableStudents && (
//                 <p className="text-red-500 text-xs mt-3 flex items-center gap-1">
//                   <span>⚠</span> {errors.applicableStudents}
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Fee Components Section */}
//           <div className="mb-6">
//             <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
//               Fee Components
//             </label>
//             {errors.feeComponents && (
//               <p className="text-red-500 text-xs mb-3 flex items-center gap-1">
//                 <span>⚠</span> {errors.feeComponents}
//               </p>
//             )}

//             <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                       Fee Type
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                       Amount ($)
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                       Frequency
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                       Due Date
//                     </th>
//                     <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                   {feeComponents.length === 0 && (
//                     <tr>
//                       <td colSpan={5} className="px-4 py-12 text-center">
//                         <div className="flex flex-col items-center">
//                           <svg
//                             className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={1.5}
//                               d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                             />
//                           </svg>
//                           <p className="text-gray-500 dark:text-gray-400">No fee components added</p>
//                           <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
//                             Click the button below to add components
//                           </p>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                   {feeComponents.map((comp) => (
//                     <tr
//                       key={comp.id}
//                       className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
//                     >
//                       <td className="px-4 py-3">
//                         <input
//                           type="text"
//                           value={comp.type}
//                           onChange={(e) => updateFeeComponent(comp.id, 'type', e.target.value)}
//                           className={`w-full px-3 py-2 rounded-md border ${
//                             errors[`feeType-${comp.id}`]
//                               ? 'border-red-500 focus:ring-red-500'
//                               : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
//                           } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all duration-200`}
//                           placeholder="e.g., Tuition"
//                         />
//                         {errors[`feeType-${comp.id}`] && (
//                           <p className="text-red-500 text-xs mt-1">{errors[`feeType-${comp.id}`]}</p>
//                         )}
//                       </td>
//                       <td className="px-4 py-3">
//                         <input
//                           type="number"
//                           min={0}
//                           step={0.01}
//                           value={comp.amount}
//                           onChange={(e) => updateFeeComponent(comp.id, 'amount', Number(e.target.value))}
//                           className={`w-full px-3 py-2 rounded-md border ${
//                             errors[`amount-${comp.id}`]
//                               ? 'border-red-500 focus:ring-red-500'
//                               : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
//                           } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all duration-200`}
//                           placeholder="0.00"
//                         />
//                         {errors[`amount-${comp.id}`] && (
//                           <p className="text-red-500 text-xs mt-1">{errors[`amount-${comp.id}`]}</p>
//                         )}
//                       </td>
//                       <td className="px-4 py-3">
//                         <select
//                           value={comp.frequency}
//                           onChange={(e) =>
//                             updateFeeComponent(comp.id, 'frequency', e.target.value as FeeFrequency)
//                           }
//                           className={`w-full px-3 py-2 rounded-md border ${
//                             errors[`frequency-${comp.id}`]
//                               ? 'border-red-500 focus:ring-red-500'
//                               : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
//                           } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all duration-200`}
//                         >
//                           {feeFrequencies.map((freq) => (
//                             <option key={freq} value={freq}>
//                               {freq}
//                             </option>
//                           ))}
//                         </select>
//                         {errors[`frequency-${comp.id}`] && (
//                           <p className="text-red-500 text-xs mt-1">{errors[`frequency-${comp.id}`]}</p>
//                         )}
//                       </td>
//                       <td className="px-4 py-3">
//                         <input
//                           type="date"
//                           value={comp.dueDate}
//                           onChange={(e) => updateFeeComponent(comp.id, 'dueDate', e.target.value)}
//                           className={`w-full px-3 py-2 rounded-md border ${
//                             errors[`dueDate-${comp.id}`]
//                               ? 'border-red-500 focus:ring-red-500'
//                               : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
//                           } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all duration-200`}
//                         />
//                         {errors[`dueDate-${comp.id}`] && (
//                           <p className="text-red-500 text-xs mt-1">{errors[`dueDate-${comp.id}`]}</p>
//                         )}
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         <button
//                           type="button"
//                           onClick={() => removeFeeComponent(comp.id)}
//                           className="inline-flex items-center justify-center w-8 h-8 rounded-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
//                           title="Remove Fee Component"
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M6 18L18 6M6 6l12 12"
//                             />
//                           </svg>
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot>
//                   <tr className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
//                     <td
//                       colSpan={4}
//                       className="px-4 py-3 text-right text-sm font-bold text-gray-900 dark:text-gray-100 uppercase"
//                     >
//                       Total Amount:
//                     </td>
//                     <td className="px-4 py-3 text-center text-lg font-bold text-blue-600 dark:text-blue-400">
//                       ${totalAmount.toFixed(2)}
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//             <button
//               type="button"
//               onClick={addFeeComponent}
//               className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg shadow-lg shadow-green-500/30 hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                 />
//               </svg>
//               Add Fee Component
//             </button>
//           </div>

//           {/* Status Selection */}
//           <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
//             <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
//               Status
//             </label>
//             <div className="flex gap-6">
//               <label className="inline-flex items-center gap-3 cursor-pointer group">
//                 <input
//                   type="radio"
//                   name="status"
//                   value="Active"
//                   checked={status === 'Active'}
//                   onChange={() => setStatus('Active')}
//                   className="w-5 h-5 text-green-600 focus:ring-2 focus:ring-green-500 cursor-pointer"
//                 />
//                 <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-150">
//                   Active
//                 </span>
//               </label>
//               <label className="inline-flex items-center gap-3 cursor-pointer group">
//                 <input
//                   type="radio"
//                   name="status"
//                   value="Inactive"
//                   checked={status === 'Inactive'}
//                   onChange={() => setStatus('Inactive')}
//                   className="w-5 h-5 text-gray-600 focus:ring-2 focus:ring-gray-500 cursor-pointer"
//                 />
//                 <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-150">
//                   Inactive
//                 </span>
//               </label>
//             </div>
//           </div>

//           {/* Save Button */}
//           <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
//             <button
//               type="button"
//               onClick={handleSave}
//               disabled={loading}
//               className={`inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white shadow-lg transition-all duration-200 transform ${
//                 loading
//                   ? 'bg-blue-400 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 shadow-blue-500/50'
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                   {isEditMode ? 'Updating...' : 'Saving...'}
//                 </>
//               ) : (
//                 <>
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                   {isEditMode ? 'Update Fee Structure' : 'Save Fee Structure'}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* View Modal */}
//       {viewModalOpen && viewingStructure && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl flex justify-between items-center">
//               <h3 className="text-2xl font-bold">Fee Structure Details</h3>
//               <button
//                 onClick={() => setViewModalOpen(false)}
//                 className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-150"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>

//             <div className="p-6 space-y-6">
//               {/* Basic Info */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Structure Name</p>
//                   <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//                     {viewingStructure.name}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Academic Year</p>
//                   <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//                     {viewingStructure.academicYear}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Applicable For</p>
//                   <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
//                     {viewingStructure.applicableFor === 'SpecificGrade'
//                       ? 'Specific Grades'
//                       : viewingStructure.applicableFor === 'StudentGroup'
//                       ? 'Student Group'
//                       : 'All Students'}
//                   </span>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
//                   <span
//                     className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                       viewingStructure.status === 'Active'
//                         ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
//                         : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
//                     }`}
//                   >
//                     {viewingStructure.status}
//                   </span>
//                 </div>
//               </div>

//               {/* Applicable Grades/Students */}
//               {viewingStructure.applicableFor === 'SpecificGrade' && (
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Applicable Grades/Classes</p>
//                   <div className="flex flex-wrap gap-2">
//                     {viewingStructure.applicableGrades.map((gradeName) => (
//                       <span
//                         key={gradeName}
//                         className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
//                       >
//                         {gradeName}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {viewingStructure.applicableFor === 'StudentGroup' && (
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Selected Students</p>
//                   <p className="text-gray-900 dark:text-gray-100 font-medium">
//                     {viewingStructure.applicableStudents.length} student(s) selected
//                   </p>
//                 </div>
//               )}

//               {/* Fee Components */}
//               <div>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Fee Components</p>
//                 <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-600">
//                   <table className="w-full">
//                     <thead className="bg-gray-100 dark:bg-gray-700">
//                       <tr>
//                         <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
//                           Type
//                         </th>
//                         <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
//                           Amount
//                         </th>
//                         <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
//                           Frequency
//                         </th>
//                         <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
//                           Due Date
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                       {viewingStructure.feeComponents.map((comp) => (
//                         <tr key={comp.id}>
//                           <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{comp.type}</td>
//                           <td className="px-4 py-2 text-gray-900 dark:text-gray-100 font-semibold">
//                             ${comp.amount.toFixed(2)}
//                           </td>
//                           <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{comp.frequency}</td>
//                           <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{comp.dueDate}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                     <tfoot className="bg-gray-100 dark:bg-gray-700">
//                       <tr>
//                         <td colSpan={3} className="px-4 py-2 text-right font-bold text-gray-900 dark:text-gray-100">
//                           Total:
//                         </td>
//                         <td className="px-4 py-2 font-bold text-blue-600 dark:text-blue-400">
//                           ${viewingStructure.totalAmount.toFixed(2)}
//                         </td>
//                       </tr>
//                     </tfoot>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
//             <div className="p-6">
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
//                   <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Delete</h3>
//                   <p className="text-gray-600 dark:text-gray-400 mt-1">
//                     Are you sure you want to delete this fee structure? This action cannot be undone.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-3 mt-6">
//                 <button
//                   onClick={() => setDeleteModalOpen(false)}
//                   className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDeleteConfirm}
//                   disabled={loading}
//                   className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-150 disabled:opacity-50"
//                 >
//                   {loading ? 'Deleting...' : 'Delete'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* CSS Animation */}
//       <style>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.2s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   )
// }

// export default FeeStructureMaster
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Layers, CreditCard, Plus, Search, Filter, 
  MoreVertical, Edit, Trash, X, Loader, CheckCircle,
  AlertCircle, Info, ChevronDown, DollarSign, 
  Calendar, Users, Tag, Target, TrendingUp,
  Clock, Settings, Eye, Copy, Archive
} from 'lucide-react';

// Types
type AcademicYear = string;
type FeeFrequency = 'One-Time' | 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Annually';

interface FeeComponent {
  id: string;
  type: string;
  amount: number;
  frequency: FeeFrequency;
  dueDate: string;
}

type ApplicableForOption = 'All' | 'SpecificGrade' | 'StudentGroup';

interface FeeStructure {
  id: string;
  name: string;
  academicYear: AcademicYear;
  applicableFor: ApplicableForOption;
  applicableGrades: string[];
  applicableStudents: string[];
  totalAmount: number;
  status: 'Active' | 'Inactive';
  feeComponents: FeeComponent[];
}

interface ClassOption {
  class_name: string;
  academic_year: string;
}

interface Student {
  id: string;
  student_name: string;
  class_name: string;
}

interface NotificationState {
  show: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

const feeFrequencies: FeeFrequency[] = [
  'One-Time', 'Monthly', 'Quarterly', 'Half-Yearly', 'Annually'
];

const NAV_TABS = [
  { href: '/fees', label: 'Fee Structure', icon: <Layers className="w-4 h-4" /> },
  { href: '/assignfeestructure', label: 'Assign Structure', icon: <FileText className="w-4 h-4" /> },
  { href: '/feepayments', label: 'Fee Payments', icon: <CreditCard className="w-4 h-4" /> },
];

const FeeStructureMaster: React.FC = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // State Management
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [name, setName] = useState('');
  const [academicYear, setAcademicYear] = useState<AcademicYear>('');
  const [applicableFor, setApplicableFor] = useState<ApplicableForOption>('All');
  const [applicableGrades, setApplicableGrades] = useState<string[]>([]);
  const [applicableStudents, setApplicableStudents] = useState<string[]>([]);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [feeComponents, setFeeComponents] = useState<FeeComponent[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingStructure, setViewingStructure] = useState<FeeStructure | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [availableClasses, setAvailableClasses] = useState<ClassOption[]>([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const INITIAL_STUDENT_LIMIT = 5;

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'info',
    title: '',
    message: ''
  });

  const activeTab = NAV_TABS.find((tab) => window.location.pathname === tab.href)?.href || '/fees';

  // Show notification helper
  const showNotification = (type: NotificationState['type'], title: string, message: string) => {
    setNotification({ show: true, type, title, message });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // Fetch Functions
  useEffect(() => { 
    fetchFeeStructures(); 
    fetchAcademicYears(); 
  }, []);

  useEffect(() => { 
    if (academicYear && applicableFor === 'SpecificGrade') 
      fetchClassesByAcademicYear(academicYear);
  }, [academicYear, applicableFor]);

  useEffect(() => { 
    if (academicYear && applicableFor === 'StudentGroup') 
      fetchStudentsByAcademicYear(academicYear);
  }, [academicYear, applicableFor]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) 
        setOpenDropdownId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function fetchAcademicYears() {
    try {
      const { data, error } = await supabase
        .from('class_assignments')
        .select('academic_year')
        .order('academic_year', { ascending: false });
      
      if (error) throw error;
      if (data) {
        const uniqueYears = Array.from(new Set(data.map((item) => item.academic_year)));
        setAcademicYears(uniqueYears);
        if (uniqueYears.length > 0 && !academicYear) setAcademicYear(uniqueYears[0]);
      }
    } catch (error) { 
      console.error('Error fetching academic years:', error); 
    }
  }

  async function fetchClassesByAcademicYear(year: string) {
    try {
      const { data, error } = await supabase
        .from('class_assignments')
        .select('class_name, academic_year')
        .eq('academic_year', year);
      
      if (error) throw error;
      if (data) {
        const uniqueClasses = Array.from(
          new Set(data.map((item) => item.class_name))
        ).map((className) => ({
          class_name: className,
          academic_year: year,
        }));
        setAvailableClasses(uniqueClasses);
      }
    } catch (error) { 
      console.error('Error fetching classes:', error); 
    }
  }

  async function fetchStudentsByAcademicYear(year: string) {
    try {
      const { data, error } = await supabase
        .from('class_assignments')
        .select('student_id, student_name, class_name')
        .eq('academic_year', year);
      
      if (error) throw error;
      if (data) {
        const students: Student[] = data.map((item) => ({
          id: item.student_id,
          student_name: item.student_name || 'Unknown Student',
          class_name: item.class_name || 'N/A',
        }));
        setAvailableStudents(students);
      }
    } catch (error) { 
      console.error('Error fetching students:', error); 
    }
  }

  async function fetchFeeStructures() {
    setLoading(true);
    try {
      let { data, error } = await supabase
        .from('fee_structures')
        .select(`*, fee_components:fee_components_table(*)`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) {
        const structures: FeeStructure[] = data.map((fs: any) => ({
          id: fs.id,
          name: fs.name,
          academicYear: fs.academic_year,
          applicableFor: fs.applicable_for,
          applicableGrades: fs.applicable_grades || [],
          applicableStudents: fs.applicable_students || [],
          totalAmount: Number(fs.total_amount),
          status: fs.status,
          feeComponents: fs.fee_components?.map((fc: any) => ({
            id: fc.id,
            type: fc.type,
            amount: Number(fc.amount),
            frequency: fc.frequency,
            dueDate: fc.due_date,
          })) || [],
        }));
        setFeeStructures(structures);
      }
    } catch (error) { 
      console.error('Error fetching fee structures:', error);
      showNotification('error', 'Loading Failed', 'Failed to load fee structures');
    } finally { 
      setLoading(false); 
    }
  }

  // CRUD Operations
  const addFeeComponent = () => {
    setFeeComponents((prev) => [...prev, {
      id: uuidv4(),
      type: '',
      amount: 0,
      frequency: 'One-Time',
      dueDate: ''
    }]);
  };

  const removeFeeComponent = (id: string) => {
    setFeeComponents((prev) => prev.filter((comp) => comp.id !== id));
  };

  const updateFeeComponent = (id: string, field: keyof Omit<FeeComponent, 'id'>, value: any) => {
    setFeeComponents((prev) =>
      prev.map((comp) => (comp.id === id ? { ...comp, [field]: value } : comp))
    );
  };

  const toggleGrade = (gradeName: string) => {
    if (applicableGrades.includes(gradeName)) {
      setApplicableGrades(applicableGrades.filter((g) => g !== gradeName));
    } else {
      setApplicableGrades([...applicableGrades, gradeName]);
    }
  };

  const toggleStudent = (studentId: string) => {
    if (applicableStudents.includes(studentId)) {
      setApplicableStudents(applicableStudents.filter((s) => s !== studentId));
    } else {
      setApplicableStudents([...applicableStudents, studentId]);
    }
  };

  const totalAmount = useMemo(() =>
    feeComponents.reduce((acc, curr) => acc + Number(curr.amount || 0), 0),
    [feeComponents]
  );

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Structure Name is required';
    if (!academicYear) newErrors.academicYear = 'Academic Year is required';
    if (applicableFor === 'SpecificGrade' && applicableGrades.length === 0)
      newErrors.applicableGrades = 'Select at least one grade/class';
    if (applicableFor === 'StudentGroup' && applicableStudents.length === 0)
      newErrors.applicableStudents = 'Select at least one student';
    if (feeComponents.length === 0) 
      newErrors.feeComponents = 'Add at least one fee component';
    
    feeComponents.forEach((comp) => {
      if (!comp.type.trim()) newErrors[`feeType-${comp.id}`] = 'Fee Type is required';
      if (comp.amount <= 0) newErrors[`amount-${comp.id}`] = 'Amount must be greater than zero';
      if (!comp.frequency) newErrors[`frequency-${comp.id}`] = 'Frequency is required';
      if (!comp.dueDate) newErrors[`dueDate-${comp.id}`] = 'Due Date is required';
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const structureData = {
        name,
        academic_year: academicYear,
        applicable_for: applicableFor,
        applicable_grades: applicableFor === 'SpecificGrade' ? applicableGrades : [],
        applicable_students: applicableFor === 'StudentGroup' ? applicableStudents : [],
        total_amount: totalAmount,
        status,
      };

      if (isEditMode && editingId) {
        const { error: updateError } = await supabase
          .from('fee_structures')
          .update(structureData)
          .eq('id', editingId);

        if (updateError) throw updateError;

        await supabase
          .from('fee_components_table')
          .delete()
          .eq('fee_structure_id', editingId);

        const componentsToInsert = feeComponents.map((comp) => ({
          fee_structure_id: editingId,
          type: comp.type,
          amount: comp.amount,
          frequency: comp.frequency,
          due_date: comp.dueDate,
        }));

        const { error: componentsError } = await supabase
          .from('fee_components_table')
          .insert(componentsToInsert);

        if (componentsError) throw componentsError;

        showNotification('success', 'Updated', 'Fee structure updated successfully');
      } else {
        const { data: insertedStructure, error: structureError } = await supabase
          .from('fee_structures')
          .insert(structureData)
          .select()
          .single();

        if (structureError) throw structureError;

        const componentsToInsert = feeComponents.map((comp) => ({
          fee_structure_id: insertedStructure.id,
          type: comp.type,
          amount: comp.amount,
          frequency: comp.frequency,
          due_date: comp.dueDate,
        }));

        const { error: componentsError } = await supabase
          .from('fee_components_table')
          .insert(componentsToInsert);

        if (componentsError) throw componentsError;

        showNotification('success', 'Created', 'Fee structure created successfully');
      }

      resetForm();
      setShowAddModal(false);
      fetchFeeStructures();
    } catch (error) {
      console.error('Error saving fee structure:', error);
      showNotification('error', 'Save Failed', 'Failed to save fee structure');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await supabase.from('fee_components_table').delete().eq('fee_structure_id', deletingId);
      const { error } = await supabase.from('fee_structures').delete().eq('id', deletingId);
      
      if (error) throw error;

      showNotification('success', 'Deleted', 'Fee structure deleted successfully');
      setDeleteModalOpen(false);
      setDeletingId(null);
      fetchFeeStructures();
    } catch (error) {
      console.error('Error deleting fee structure:', error);
      showNotification('error', 'Delete Failed', 'Failed to delete fee structure');
    }
  };

  const resetForm = () => {
    setName('');
    setApplicableFor('All');
    setApplicableGrades([]);
    setApplicableStudents([]);
    setStatus('Active');
    setFeeComponents([]);
    setErrors({});
    setStudentSearchQuery('');
    setShowAllStudents(false);
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleEdit = (structure: FeeStructure) => {
    setName(structure.name);
    setAcademicYear(structure.academicYear);
    setApplicableFor(structure.applicableFor);
    setApplicableGrades(structure.applicableGrades);
    setApplicableStudents(structure.applicableStudents);
    setStatus(structure.status);
    setFeeComponents(structure.feeComponents);
    setIsEditMode(true);
    setEditingId(structure.id);
    setShowAddModal(true);
  };

  const filteredStructures = feeStructures.filter(structure => {
    const matchesSearch = structure.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = !filterYear || structure.academicYear === filterYear;
    const matchesStatus = filterStatus === 'all' || structure.status === filterStatus;
    return matchesSearch && matchesYear && matchesStatus;
  });

  const filteredStudents = useMemo(() => {
    if (!studentSearchQuery.trim()) return availableStudents;
    return availableStudents.filter((student) =>
      student.student_name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      student.class_name.toLowerCase().includes(studentSearchQuery.toLowerCase())
    );
  }, [availableStudents, studentSearchQuery]);

  const visibleStudents = useMemo(() => (
    showAllStudents ? filteredStudents : filteredStudents.slice(0, INITIAL_STUDENT_LIMIT)
  ), [filteredStudents, showAllStudents]);

  return (
    <div className="min-h-screen bg-[#F6F9FC] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Background Pattern */}
        <div className="fixed inset-0 pointer-events-none opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, rgba(30, 136, 229, 0.1) 2px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>

        {/* Notification */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed top-4 right-4 z-50 max-w-md w-full"
            >
              <div className={`rounded-xl shadow-2xl border-l-4 p-4 backdrop-blur-lg ${
                notification.type === 'success' ? 'bg-green-50/90 border-green-400' :
                notification.type === 'error' ? 'bg-red-50/90 border-red-400' :
                notification.type === 'warning' ? 'bg-yellow-50/90 border-yellow-400' :
                'bg-blue-50/90 border-blue-400'
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {notification.type === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
                    {notification.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600" />}
                    {notification.type === 'info' && <Info className="h-5 w-5 text-blue-600" />}
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-semibold ${
                      notification.type === 'success' ? 'text-green-900' :
                      notification.type === 'error' ? 'text-red-900' :
                      notification.type === 'warning' ? 'text-yellow-900' :
                      'text-blue-900'
                    }`}>
                      {notification.title}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      notification.type === 'success' ? 'text-green-800' :
                      notification.type === 'error' ? 'text-red-800' :
                      notification.type === 'warning' ? 'text-yellow-800' :
                      'text-blue-800'
                    }`}>
                      {notification.message}
                    </p>
                  </div>
                  <button
                    onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                    className="ml-auto"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Tabs */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-start relative z-10"
        >
          <div className="glass-strong shadow-soft rounded-2xl flex w-fit overflow-hidden border border-[#edf2fa]">
            {NAV_TABS.map((tab, index) => (
              <motion.button
                key={tab.href}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(tab.href)}
                className={`
                  px-8 py-3 flex items-center gap-2 font-semibold transition-all
                  ${activeTab === tab.href
                    ? 'bg-[#1E88E5] text-white shadow-glow'
                    : 'bg-transparent text-primary hover:bg-primary/10'}
                `}
                style={{ borderRight: index < NAV_TABS.length - 1 ? '1px solid #e3eaf3' : undefined }}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-8 relative z-10"
        >
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">Fee Structure Master</h1>
            <p className="text-muted-foreground">Manage and create fee structures for your institution</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="gradient-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-glow hover:shadow-float transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #1E88E5 0%, #5B9FFF 100%)'
              }}
            >
              <Plus className="w-5 h-5" />
              Create Fee Structure
            </button>
          </motion.div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 mb-8 relative z-10"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search fee structures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-strong border border-white/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent shadow-soft"
            />
          </div>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-4 py-3 glass-strong border border-white/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent shadow-soft"
          >
            <option value="">All Academic Years</option>
            {academicYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 glass-strong border border-white/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent shadow-soft"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </motion.div>

        {/* Fee Structures Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="glass-strong rounded-2xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredStructures.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-2xl p-12 text-center relative z-10"
          >
            <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 text-xl font-semibold mb-2">No fee structures found</p>
            <p className="text-gray-500">Create your first fee structure to get started</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {filteredStructures.map((structure, index) => (
              <motion.div
                key={structure.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
                className="glass-strong rounded-2xl p-6 shadow-soft hover:shadow-float transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                {/* Gradient Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                  background: 'linear-gradient(90deg, #1E88E5 0%, #5B9FFF 100%)'
                }}></div>

                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E88E5]/20 to-[#5B9FFF]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="w-6 h-6 text-[#1E88E5]" />
                    </div>
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === structure.id ? null : structure.id);
                        }}
                        className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      {openDropdownId === structure.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingStructure(structure);
                              setViewModalOpen(true);
                              setOpenDropdownId(null);
                            }}
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl"
                          >
                            <Eye className="h-4 w-4 mr-3 text-blue-600" />
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(structure);
                              setOpenDropdownId(null);
                            }}
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Edit className="h-4 w-4 mr-3 text-yellow-600" />
                            Edit Structure
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingId(structure.id);
                              setDeleteModalOpen(true);
                              setOpenDropdownId(null);
                            }}
                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
                          >
                            <Trash className="h-4 w-4 mr-3" />
                            Delete Structure
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {structure.name}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {structure.academicYear}
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Amount</span>
                    <span className="text-xl font-bold text-[#1E88E5]">
                      ₹{structure.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Components</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {structure.feeComponents.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Applicable For</span>
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                      structure.applicableFor === 'All' ? 'bg-green-100 text-green-700' :
                      structure.applicableFor === 'SpecificGrade' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {structure.applicableFor === 'SpecificGrade' ? 'Specific Grades' :
                       structure.applicableFor === 'StudentGroup' ? 'Student Group' : 'All Students'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200/50">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                    structure.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {structure.status === 'Active' ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        ACTIVE
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3 mr-1" />
                        INACTIVE
                      </>
                    )}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-strong rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-border px-6 py-4 rounded-t-2xl z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 gradient-primary rounded-lg flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">
                          {isEditMode ? 'Edit Fee Structure' : 'Create Fee Structure'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isEditMode ? 'Update fee structure details' : 'Add a new fee structure'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6 space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/20">
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      Basic Information
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Structure Name <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white ${
                            errors.name ? 'border-destructive' : 'border-input'
                          }`}
                          placeholder="e.g., Class 10 - Annual Fee 2024-25"
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Academic Year <span className="text-destructive">*</span>
                        </label>
                        <select
                          value={academicYear}
                          onChange={(e) => setAcademicYear(e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white ${
                            errors.academicYear ? 'border-destructive' : 'border-input'
                          }`}
                        >
                          <option value="">Select Academic Year</option>
                          {academicYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        {errors.academicYear && (
                          <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.academicYear}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Applicable For <span className="text-destructive">*</span>
                        </label>
                        <select
                          value={applicableFor}
                          onChange={(e) => setApplicableFor(e.target.value as ApplicableForOption)}
                          className="w-full px-4 py-3 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                        >
                          <option value="All">All Students</option>
                          <option value="SpecificGrade">Specific Grades/Classes</option>
                          <option value="StudentGroup">Specific Students</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Status <span className="text-destructive">*</span>
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                          className="w-full px-4 py-3 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    {/* Applicable Grades */}
                    {applicableFor === 'SpecificGrade' && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Select Grades/Classes <span className="text-destructive">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {availableClasses.map((cls) => (
                            <label
                              key={cls.class_name}
                              className="flex items-center p-3 border border-input rounded-xl cursor-pointer hover:bg-secondary transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={applicableGrades.includes(cls.class_name)}
                                onChange={() => toggleGrade(cls.class_name)}
                                className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                              />
                              <span className="ml-3 text-sm font-medium text-foreground">
                                {cls.class_name}
                              </span>
                            </label>
                          ))}
                        </div>
                        {errors.applicableGrades && (
                          <p className="mt-2 text-xs text-destructive flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.applicableGrades}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Applicable Students */}
                    {applicableFor === 'StudentGroup' && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Select Students <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Search students..."
                          value={studentSearchQuery}
                          onChange={(e) => setStudentSearchQuery(e.target.value)}
                          className="w-full px-4 py-3 mb-3 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                        />
                        <div className="max-h-64 overflow-y-auto space-y-2">
                          {visibleStudents.map((student) => (
                            <label
                              key={student.id}
                              className="flex items-center p-3 border border-input rounded-xl cursor-pointer hover:bg-secondary transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={applicableStudents.includes(student.id)}
                                onChange={() => toggleStudent(student.id)}
                                className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                              />
                              <span className="ml-3 text-sm font-medium text-foreground">
                                {student.student_name} ({student.class_name})
                              </span>
                            </label>
                          ))}
                        </div>
                        {filteredStudents.length > INITIAL_STUDENT_LIMIT && !showAllStudents && (
                          <button
                            onClick={() => setShowAllStudents(true)}
                            className="mt-2 text-sm text-primary hover:underline"
                          >
                            Show {filteredStudents.length - INITIAL_STUDENT_LIMIT} more students
                          </button>
                        )}
                        {errors.applicableStudents && (
                          <p className="mt-2 text-xs text-destructive flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.applicableStudents}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Fee Components */}
                  <div className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-2xl p-6 border border-accent/20">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <Tag className="w-5 h-5 text-accent" />
                        Fee Components
                      </h4>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addFeeComponent}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all"
                      >
                        <Plus size={16} />
                        Add Component
                      </motion.button>
                    </div>

                    {errors.feeComponents && (
                      <p className="mb-4 text-sm text-destructive flex items-center gap-2 bg-destructive/10 p-3 rounded-xl">
                        <AlertCircle size={16} />
                        {errors.feeComponents}
                      </p>
                    )}

                    <div className="space-y-4">
                      {feeComponents.map((component, index) => (
                        <motion.div
                          key={component.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="bg-white rounded-xl p-4 border border-border"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                <span className="text-sm font-bold text-primary">#{index + 1}</span>
                              </div>
                              <h5 className="font-semibold text-foreground">Component {index + 1}</h5>
                            </div>
                            {feeComponents.length > 1 && (
                              <button
                                onClick={() => removeFeeComponent(component.id)}
                                className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                              >
                                <Trash size={16} />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Fee Type <span className="text-destructive">*</span>
                              </label>
                              <input
                                type="text"
                                value={component.type}
                                onChange={(e) => updateFeeComponent(component.id, 'type', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                                  errors[`feeType-${component.id}`] ? 'border-destructive' : 'border-input'
                                }`}
                                placeholder="e.g., Tuition Fee, Lab Fee"
                              />
                              {errors[`feeType-${component.id}`] && (
                                <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                                  <AlertCircle size={12} />
                                  {errors[`feeType-${component.id}`]}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Amount <span className="text-destructive">*</span>
                              </label>
                              <input
                                type="number"
                                value={component.amount || ''}
                                onChange={(e) => updateFeeComponent(component.id, 'amount', parseFloat(e.target.value) || 0)}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                                  errors[`amount-${component.id}`] ? 'border-destructive' : 'border-input'
                                }`}
                                placeholder="0"
                              />
                              {errors[`amount-${component.id}`] && (
                                <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                                  <AlertCircle size={12} />
                                  {errors[`amount-${component.id}`]}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Frequency <span className="text-destructive">*</span>
                              </label>
                              <select
                                value={component.frequency}
                                onChange={(e) => updateFeeComponent(component.id, 'frequency', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                                  errors[`frequency-${component.id}`] ? 'border-destructive' : 'border-input'
                                }`}
                              >
                                {feeFrequencies.map(freq => (
                                  <option key={freq} value={freq}>{freq}</option>
                                ))}
                              </select>
                              {errors[`frequency-${component.id}`] && (
                                <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                                  <AlertCircle size={12} />
                                  {errors[`frequency-${component.id}`]}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Due Date <span className="text-destructive">*</span>
                              </label>
                              <input
                                type="date"
                                value={component.dueDate}
                                onChange={(e) => updateFeeComponent(component.id, 'dueDate', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                                  errors[`dueDate-${component.id}`] ? 'border-destructive' : 'border-input'
                                }`}
                              />
                              {errors[`dueDate-${component.id}`] && (
                                <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                                  <AlertCircle size={12} />
                                  {errors[`dueDate-${component.id}`]}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-green-700 font-medium">Total Fee Amount</p>
                          <p className="text-xs text-green-600 mt-1">
                            Sum of all fee components
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-green-700">
                          ₹{totalAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          {feeComponents.length} component{feeComponents.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-secondary px-6 py-4 border-t border-border rounded-b-2xl flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {feeComponents.length > 0 && (
                      <span className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-primary" />
                        {feeComponents.length} component{feeComponents.length !== 1 ? 's' : ''} ready
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="px-6 py-3 border border-border rounded-xl text-foreground hover:bg-white font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmit}
                      className="px-6 py-3 gradient-primary text-white rounded-xl font-medium shadow-glow hover:shadow-float transition-all flex items-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg, #1E88E5 0%, #5B9FFF 100%)'
                      }}
                    >
                      <CheckCircle size={18} />
                      {isEditMode ? 'Update Structure' : 'Create Structure'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* View Modal */}
        <AnimatePresence>
          {viewModalOpen && viewingStructure && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-strong rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-border px-6 py-4 rounded-t-2xl z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 gradient-primary rounded-lg flex items-center justify-center">
                        <Eye className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Fee Structure Details</h3>
                        <p className="text-sm text-muted-foreground">{viewingStructure.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setViewModalOpen(false);
                        setViewingStructure(null);
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6 space-y-6">
                  {/* Basic Info */}
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/20">
                    <h4 className="font-semibold text-foreground mb-4">Basic Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Academic Year</p>
                        <p className="font-semibold text-foreground">{viewingStructure.academicYear}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          viewingStructure.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {viewingStructure.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Applicable For</p>
                        <p className="font-semibold text-foreground">
                          {viewingStructure.applicableFor === 'SpecificGrade' ? 'Specific Grades' :
                           viewingStructure.applicableFor === 'StudentGroup' ? 'Student Group' : 'All Students'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="font-bold text-primary text-xl">
                          ₹{viewingStructure.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Fee Components */}
                  <div className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-2xl p-6 border border-accent/20">
                    <h4 className="font-semibold text-foreground mb-4">Fee Components</h4>
                    <div className="space-y-3">
                      {viewingStructure.feeComponents.map((component, index) => (
                        <div key={component.id} className="bg-white rounded-xl p-4 border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                <span className="text-sm font-bold text-primary">#{index + 1}</span>
                              </div>
                              <span className="font-semibold text-foreground">{component.type}</span>
                            </div>
                            <span className="text-lg font-bold text-primary">
                              ₹{component.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            <div>
                              <p className="text-xs text-muted-foreground">Frequency</p>
                              <p className="text-sm font-medium text-foreground">{component.frequency}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Due Date</p>
                              <p className="text-sm font-medium text-foreground">
                                {new Date(component.dueDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-secondary px-6 py-4 border-t border-border rounded-b-2xl flex justify-end">
                  <button
                    onClick={() => {
                      setViewModalOpen(false);
                      setViewingStructure(null);
                    }}
                    className="px-6 py-3 border border-border rounded-xl text-foreground hover:bg-white font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Modal */}
        <AnimatePresence>
          {deleteModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-strong rounded-2xl shadow-2xl max-w-md w-full p-8"
              >
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Delete Fee Structure</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Are you sure you want to delete this fee structure? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setDeleteModalOpen(false);
                        setDeletingId(null);
                      }}
                      className="flex-1 px-4 py-3 border border-border rounded-xl text-foreground hover:bg-white font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDelete}
                      className="flex-1 px-4 py-3 bg-destructive text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FeeStructureMaster;
