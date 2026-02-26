// import React, { useState, useEffect, useMemo } from 'react'
// import { supabase } from '../../../lib/supabase'

// interface FeeStructure {
//   id: string
//   name: string
//   academic_year: string
//   applicable_for: 'All' | 'SpecificGrade' | 'StudentGroup'
//   applicable_grades: string[] | null
//   applicable_students: string[] | null
//   total_amount: number
//   status: string
// }

// interface Student {
//   id: string
//   full_name: string
//   class_name: string
//   academic_year: string
// }

// interface FeeAssignment {
//   id: string
//   student_id: string
//   fee_structure_id: string
//   assigned_at: string
//   student_name: string
//   fee_structure_name: string
//   total_amount: number
// }

// const FeeAssignment: React.FC = () => {
//   // State management
//   const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([])
//   const [selectedStructure, setSelectedStructure] = useState<FeeStructure | null>(null)
//   const [students, setStudents] = useState<Student[]>([])
//   const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
//   const [selectedStudents, setSelectedStudents] = useState<string[]>([])
//   const [existingAssignments, setExistingAssignments] = useState<FeeAssignment[]>([])
  
//   // Filter states
//   const [filterClass, setFilterClass] = useState<string>('all')
//   const [filterAcademicYear, setFilterAcademicYear] = useState<string>('all')
//   const [filterStructure, setFilterStructure] = useState<string>('all')
//   const [searchQuery, setSearchQuery] = useState<string>('')
  
//   // UI states
//   const [loading, setLoading] = useState(false)
//   const [assignmentView, setAssignmentView] = useState<'create' | 'view'>('create')
  
//   // Dropdown data
//   const [academicYears, setAcademicYears] = useState<string[]>([])
//   const [classes, setClasses] = useState<string[]>([])

//   useEffect(() => {
//     fetchFeeStructures()
//     fetchAcademicYears()
//     fetchClasses()
//     fetchExistingAssignments()
//   }, [])

//   useEffect(() => {
//     if (selectedStructure) {
//       fetchEligibleStudents()
//     }
//   }, [selectedStructure])

//   useEffect(() => {
//     applyFilters()
//   }, [students, filterClass, filterAcademicYear, searchQuery])

//   async function fetchFeeStructures() {
//     try {
//       const { data, error } = await supabase
//         .from('fee_structures')
//         .select('*')
//         .eq('status', 'Active')
//         .order('created_at', { ascending: false })

//       if (error) throw error
//       setFeeStructures(data || [])
//     } catch (error) {
//       console.error('Error fetching fee structures:', error)
//     }
//   }

//   async function fetchAcademicYears() {
//     try {
//       const { data, error } = await supabase
//         .from('class_assignments')
//         .select('academic_year')
//         .order('academic_year', { ascending: false })

//       if (error) throw error

//       const uniqueYears = Array.from(new Set(data?.map(item => item.academic_year) || []))
//       setAcademicYears(uniqueYears)
//     } catch (error) {
//       console.error('Error fetching academic years:', error)
//     }
//   }

//   async function fetchClasses() {
//     try {
//       const { data, error } = await supabase
//         .from('class_assignments')
//         .select('class_name')

//       if (error) throw error

//       const uniqueClasses = Array.from(new Set(data?.map(item => item.class_name) || []))
//       setClasses(uniqueClasses)
//     } catch (error) {
//       console.error('Error fetching classes:', error)
//     }
//   }

//   async function fetchEligibleStudents() {
//     if (!selectedStructure) return

//     setLoading(true)
//     try {
//       let query = supabase
//         .from('class_assignments')
//         .select('student_id, student_name, class_name, academic_year')
//         .eq('academic_year', selectedStructure.academic_year)

//       // Filter based on applicable_for
//       if (selectedStructure.applicable_for === 'SpecificGrade' && selectedStructure.applicable_grades) {
//         query = query.in('class_name', selectedStructure.applicable_grades)
//       } else if (selectedStructure.applicable_for === 'StudentGroup' && selectedStructure.applicable_students) {
//         query = query.in('student_id', selectedStructure.applicable_students)
//       }

//       const { data, error } = await query

//       if (error) throw error

//       const studentData: Student[] = data?.map(item => ({
//         id: item.student_id,
//         full_name: item.student_name || 'Unknown',
//         class_name: item.class_name || 'N/A',
//         academic_year: item.academic_year
//       })) || []

//       setStudents(studentData)
//       setFilteredStudents(studentData)
//     } catch (error) {
//       console.error('Error fetching eligible students:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Replace the fetchExistingAssignments function in your component with this:

// async function fetchExistingAssignments() {
//   try {
//     // Fetch assignments first
//     const { data: assignments, error: assignmentsError } = await supabase
//       .from('student_fee_assignments')
//       .select('*')
//       .order('assigned_at', { ascending: false })

//     if (assignmentsError) throw assignmentsError

//     if (!assignments || assignments.length === 0) {
//       setExistingAssignments([])
//       return
//     }

//     // Get unique IDs for batch fetching
//     const studentIds = [...new Set(assignments.map(a => a.student_id))]
//     const feeStructureIds = [...new Set(assignments.map(a => a.fee_structure_id))]

//     // Batch fetch students
//     const { data: students, error: studentsError } = await supabase
//       .from('students')
//       .select('id, full_name')
//       .in('id', studentIds)

//     if (studentsError) throw studentsError

//     // Batch fetch fee structures
//     const { data: feeStructures, error: structuresError } = await supabase
//       .from('fee_structures')
//       .select('id, name, total_amount')
//       .in('id', feeStructureIds)

//     if (structuresError) throw structuresError

//     // Create lookup maps for O(1) access
//     const studentMap = new Map(students?.map(s => [s.id, s.full_name]) || [])
//     const structureMap = new Map(
//       feeStructures?.map(fs => [fs.id, { name: fs.name, total_amount: fs.total_amount }]) || []
//     )

//     // Combine all data
//     const combinedAssignments: FeeAssignment[] = assignments.map(assignment => {
//       const structure = structureMap.get(assignment.fee_structure_id)
//       return {
//         id: assignment.id,
//         student_id: assignment.student_id,
//         fee_structure_id: assignment.fee_structure_id,
//         assigned_at: assignment.assigned_at,
//         student_name: studentMap.get(assignment.student_id) || 'Unknown Student',
//         fee_structure_name: structure?.name || 'Unknown Structure',
//         total_amount: structure?.total_amount || 0
//       }
//     })

//     setExistingAssignments(combinedAssignments)
//   } catch (error) {
//     console.error('Error fetching assignments:', error)
//     setExistingAssignments([])
//   }
// }


//   function applyFilters() {
//     let filtered = [...students]

//     if (filterClass !== 'all') {
//       filtered = filtered.filter(s => s.class_name === filterClass)
//     }

//     if (filterAcademicYear !== 'all') {
//       filtered = filtered.filter(s => s.academic_year === filterAcademicYear)
//     }

//     if (searchQuery.trim()) {
//       filtered = filtered.filter(s =>
//         s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         s.class_name.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     }

//     setFilteredStudents(filtered)
//   }

//   const toggleStudentSelection = (studentId: string) => {
//     setSelectedStudents(prev =>
//       prev.includes(studentId)
//         ? prev.filter(id => id !== studentId)
//         : [...prev, studentId]
//     )
//   }

//   const toggleSelectAll = () => {
//     if (selectedStudents.length === filteredStudents.length) {
//       setSelectedStudents([])
//     } else {
//       setSelectedStudents(filteredStudents.map(s => s.id))
//     }
//   }

//   async function handleAssignFees() {
//     if (!selectedStructure || selectedStudents.length === 0) {
//       alert('Please select a fee structure and at least one student')
//       return
//     }

//     setLoading(true)
//     try {
//       const assignments = selectedStudents.map(studentId => ({
//         student_id: studentId,
//         fee_structure_id: selectedStructure.id,
//         assigned_at: new Date().toISOString()
//       }))

//       const { error } = await supabase
//         .from('student_fee_assignments')
//         .insert(assignments)

//       if (error) throw error

//       alert(`Successfully assigned fee structure to ${selectedStudents.length} student(s)`)
//       setSelectedStudents([])
//       fetchExistingAssignments()
//       setAssignmentView('view')
//     } catch (error: any) {
//       console.error('Error assigning fees:', error)
//       if (error.code === '23505') {
//         alert('Some students already have this fee structure assigned')
//       } else {
//         alert('Failed to assign fees. Please try again.')
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function handleDeleteAssignment(assignmentId: string) {
//     if (!confirm('Are you sure you want to remove this fee assignment?')) return

//     try {
//       const { error } = await supabase
//         .from('student_fee_assignments')
//         .delete()
//         .eq('id', assignmentId)

//       if (error) throw error

//       alert('Assignment removed successfully')
//       fetchExistingAssignments()
//     } catch (error) {
//       console.error('Error deleting assignment:', error)
//       alert('Failed to remove assignment')
//     }
//   }

//   const eligibleClasses = useMemo(() => {
//     return Array.from(new Set(students.map(s => s.class_name)))
//   }, [students])

//   const eligibleAcademicYears = useMemo(() => {
//     return Array.from(new Set(students.map(s => s.academic_year)))
//   }, [students])

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//             Fee Assignment Management
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400">
//             Assign fee structures to students based on eligibility criteria
//           </p>
//         </div>

//         {/* View Toggle */}
//         <div className="mb-6 flex gap-4">
//           <button
//             onClick={() => setAssignmentView('create')}
//             className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
//               assignmentView === 'create'
//                 ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
//                 : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
//             }`}
//           >
//             Create Assignment
//           </button>
//           <button
//             onClick={() => setAssignmentView('view')}
//             className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
//               assignmentView === 'view'
//                 ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
//                 : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
//             }`}
//           >
//             View Assignments ({existingAssignments.length})
//           </button>
//         </div>

//         {/* Create Assignment View */}
//         {assignmentView === 'create' && (
//           <div className="space-y-6">
//             {/* Fee Structure Selection */}
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//                 <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
//                 Step 1: Select Fee Structure
//               </h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {feeStructures.map(structure => (
//                   <div
//                     key={structure.id}
//                     onClick={() => setSelectedStructure(structure)}
//                     className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
//                       selectedStructure?.id === structure.id
//                         ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
//                         : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
//                     }`}
//                   >
//                     <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
//                       {structure.name}
//                     </h4>
//                     <div className="space-y-1 text-sm">
//                       <p className="text-gray-600 dark:text-gray-400">
//                         Year: {structure.academic_year}
//                       </p>
//                       <p className="text-gray-600 dark:text-gray-400">
//                         Type: {structure.applicable_for === 'All' ? 'All Students' : 
//                               structure.applicable_for === 'SpecificGrade' ? 'Specific Grades' : 
//                               'Student Group'}
//                       </p>
//                       <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
//                         ${structure.total_amount.toFixed(2)}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {feeStructures.length === 0 && (
//                 <p className="text-center text-gray-500 dark:text-gray-400 py-8">
//                   No active fee structures available
//                 </p>
//               )}
//             </div>

//             {/* Student Selection */}
//             {selectedStructure && (
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//                   <span className="w-1 h-6 bg-green-600 rounded-full"></span>
//                   Step 2: Select Students
//                 </h3>

//                 {/* Structure Info */}
//                 <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
//                   <p className="text-sm text-blue-800 dark:text-blue-300">
//                     <span className="font-semibold">Selected Structure:</span> {selectedStructure.name}
//                     {selectedStructure.applicable_for === 'SpecificGrade' && selectedStructure.applicable_grades && (
//                       <span className="ml-2">
//                         (Classes: {selectedStructure.applicable_grades.join(', ')})
//                       </span>
//                     )}
//                   </p>
//                 </div>

//                 {/* Filters */}
//                 <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                       Filter by Class
//                     </label>
//                     <select
//                       value={filterClass}
//                       onChange={(e) => setFilterClass(e.target.value)}
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="all">All Classes</option>
//                       {eligibleClasses.map(cls => (
//                         <option key={cls} value={cls}>{cls}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                       Filter by Academic Year
//                     </label>
//                     <select
//                       value={filterAcademicYear}
//                       onChange={(e) => setFilterAcademicYear(e.target.value)}
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="all">All Years</option>
//                       {eligibleAcademicYears.map(year => (
//                         <option key={year} value={year}>{year}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                       Search Students
//                     </label>
//                     <input
//                       type="text"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       placeholder="Search by name..."
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>

//                 {/* Student List */}
//                 <div className="mb-4 flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
//                       onChange={toggleSelectAll}
//                       className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
//                     />
//                     <span className="text-gray-700 dark:text-gray-300 font-medium">
//                       Select All ({filteredStudents.length} students)
//                     </span>
//                   </div>
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     {selectedStudents.length} selected
//                   </span>
//                 </div>

//                 <div className="max-h-96 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg">
//                   {loading ? (
//                     <div className="flex items-center justify-center py-12">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                     </div>
//                   ) : filteredStudents.length === 0 ? (
//                     <p className="text-center text-gray-500 dark:text-gray-400 py-12">
//                       No eligible students found
//                     </p>
//                   ) : (
//                     filteredStudents.map(student => (
//                       <div
//                         key={student.id}
//                         onClick={() => toggleStudentSelection(student.id)}
//                         className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors ${
//                           selectedStudents.includes(student.id)
//                             ? 'bg-blue-50 dark:bg-blue-900/20'
//                             : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
//                         }`}
//                       >
//                         <input
//                           type="checkbox"
//                           checked={selectedStudents.includes(student.id)}
//                           onChange={() => toggleStudentSelection(student.id)}
//                           className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
//                         />
//                         <div className="flex-1">
//                           <p className="font-medium text-gray-900 dark:text-gray-100">
//                             {student.full_name}
//                           </p>
//                           <p className="text-sm text-gray-600 dark:text-gray-400">
//                             {student.class_name} â€¢ {student.academic_year}
//                           </p>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>

//                 {/* Assign Button */}
//                 <div className="mt-6 flex justify-end">
//                   <button
//                     onClick={handleAssignFees}
//                     disabled={loading || selectedStudents.length === 0}
//                     className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
//                       loading || selectedStudents.length === 0
//                         ? 'bg-gray-400 cursor-not-allowed'
//                         : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg'
//                     }`}
//                   >
//                     {loading ? 'Assigning...' : `Assign to ${selectedStudents.length} Student(s)`}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* View Assignments */}
//         {assignmentView === 'view' && (
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
//             <div className="p-6">
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
//                 Existing Fee Assignments
//               </h3>

//               {/* Filter for viewing assignments */}
//               <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                     Filter by Structure
//                   </label>
//                   <select
//                     value={filterStructure}
//                     onChange={(e) => setFilterStructure(e.target.value)}
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="all">All Structures</option>
//                     {feeStructures.map(structure => (
//                       <option key={structure.id} value={structure.id}>
//                         {structure.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                     Search
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Search by student name..."
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Assignments Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
//                     <th className="px-6 py-4 text-left text-sm font-semibold">Student Name</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold">Fee Structure</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold">Total Amount</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold">Assigned Date</th>
//                     <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                   {existingAssignments.length === 0 ? (
//                     <tr>
//                       <td colSpan={5} className="px-6 py-12 text-center">
//                         <p className="text-gray-500 dark:text-gray-400">
//                           No fee assignments found
//                         </p>
//                       </td>
//                     </tr>
//                   ) : (
//                     existingAssignments
//                       .filter(assignment => 
//                         filterStructure === 'all' || assignment.fee_structure_id === filterStructure
//                       )
//                       .map(assignment => (
//                         <tr
//                           key={assignment.id}
//                           className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
//                         >
//                           <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">
//                             {assignment.student_name}
//                           </td>
//                           <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
//                             {assignment.fee_structure_name}
//                           </td>
//                           <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-semibold">
//                             ${assignment.total_amount.toFixed(2)}
//                           </td>
//                           <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
//                             {new Date(assignment.assigned_at).toLocaleDateString()}
//                           </td>
//                           <td className="px-6 py-4 text-center">
//                             <button
//                               onClick={() => handleDeleteAssignment(assignment.id)}
//                               className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
//                             >
//                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                               </svg>
//                               Remove
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default FeeAssignment
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Layers, CreditCard, Users, Search, Filter,
  CheckCircle, AlertCircle, Info, X, Trash, Eye,
  Calendar, DollarSign, UserCheck, Plus, ChevronDown,
  Target, TrendingUp, Clock, Award
} from 'lucide-react';

interface FeeStructure {
  id: string;
  name: string;
  academic_year: string;
  applicable_for: 'All' | 'SpecificGrade' | 'StudentGroup';
  applicable_grades: string[] | null;
  applicable_students: string[] | null;
  total_amount: number;
  status: string;
}

interface Student {
  id: string;
  full_name: string;
  class_name: string;
  academic_year: string;
}

interface FeeAssignment {
  id: string;
  student_id: string;
  fee_structure_id: string;
  assigned_at: string;
  student_name: string;
  fee_structure_name: string;
  total_amount: number;
}

interface NotificationState {
  show: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

const NAV_TABS = [
  { href: '/fees', label: 'Fee Structure', icon: <Layers className="w-4 h-4" /> },
  { href: '/assignfeestructure', label: 'Assign Structure', icon: <FileText className="w-4 h-4" /> },
  { href: '/feepayments', label: 'Fee Payments', icon: <CreditCard className="w-4 h-4" /> },
];

const FeeAssignment: React.FC = () => {
  const navigate = useNavigate();

  // State management
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [selectedStructure, setSelectedStructure] = useState<FeeStructure | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [existingAssignments, setExistingAssignments] = useState<FeeAssignment[]>([]);

  // Filter states
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterAcademicYear, setFilterAcademicYear] = useState<string>('all');
  const [filterStructure, setFilterStructure] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // UI states
  const [loading, setLoading] = useState(false);
  const [assignmentView, setAssignmentView] = useState<'create' | 'view'>('create');

  // Dropdown data
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'info',
    title: '',
    message: ''
  });

  const activeTab = NAV_TABS.find((tab) => window.location.pathname === tab.href)?.href || '/assignfeestructure';

  const showNotification = (type: NotificationState['type'], title: string, message: string) => {
    setNotification({ show: true, type, title, message });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  useEffect(() => {
    fetchFeeStructures();
    fetchAcademicYears();
    fetchClasses();
    fetchExistingAssignments();
  }, []);

  useEffect(() => {
    if (selectedStructure) {
      fetchEligibleStudents();
    }
  }, [selectedStructure]);

  useEffect(() => {
    applyFilters();
  }, [students, filterClass, filterAcademicYear, searchQuery]);

  async function fetchFeeStructures() {
    try {
      const { data, error } = await supabase
        .from('fee_structures')
        .select('*')
        .eq('status', 'Active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeeStructures(data || []);
    } catch (error) {
      console.error('Error fetching fee structures:', error);
      showNotification('error', 'Loading Failed', 'Failed to load fee structures');
    }
  }

  async function fetchAcademicYears() {
    try {
      const { data, error } = await supabase
        .from('class_assignments')
        .select('academic_year')
        .order('academic_year', { ascending: false });

      if (error) throw error;

      const uniqueYears = Array.from(new Set(data?.map(item => item.academic_year) || []));
      setAcademicYears(uniqueYears);
    } catch (error) {
      console.error('Error fetching academic years:', error);
    }
  }

  async function fetchClasses() {
    try {
      const { data, error } = await supabase
        .from('class_assignments')
        .select('class_name');

      if (error) throw error;

      const uniqueClasses = Array.from(new Set(data?.map(item => item.class_name) || []));
      setClasses(uniqueClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }

  async function fetchEligibleStudents() {
    if (!selectedStructure) return;

    setLoading(true);
    try {
      let query = supabase
        .from('class_assignments')
        .select('student_id, student_name, class_name, academic_year')
        .eq('academic_year', selectedStructure.academic_year);

      if (selectedStructure.applicable_for === 'SpecificGrade' && selectedStructure.applicable_grades) {
        query = query.in('class_name', selectedStructure.applicable_grades);
      } else if (selectedStructure.applicable_for === 'StudentGroup' && selectedStructure.applicable_students) {
        query = query.in('student_id', selectedStructure.applicable_students);
      }

      const { data, error } = await query;

      if (error) throw error;

      const studentData: Student[] = data?.map(item => ({
        id: item.student_id,
        full_name: item.student_name || 'Unknown',
        class_name: item.class_name || 'N/A',
        academic_year: item.academic_year
      })) || [];

      setStudents(studentData);
      setFilteredStudents(studentData);
    } catch (error) {
      console.error('Error fetching eligible students:', error);
      showNotification('error', 'Loading Failed', 'Failed to load eligible students');
    } finally {
      setLoading(false);
    }
  }

  async function fetchExistingAssignments() {
    try {
      const { data: assignments, error: assignmentsError } = await supabase
        .from('student_fee_assignments')
        .select('*')
        .order('assigned_at', { ascending: false });

      if (assignmentsError) throw assignmentsError;

      if (!assignments || assignments.length === 0) {
        setExistingAssignments([]);
        return;
      }

      const studentIds = [...new Set(assignments.map(a => a.student_id))];
      const feeStructureIds = [...new Set(assignments.map(a => a.fee_structure_id))];

      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id, full_name')
        .in('id', studentIds);

      if (studentsError) throw studentsError;

      const { data: feeStructures, error: structuresError } = await supabase
        .from('fee_structures')
        .select('id, name, total_amount')
        .in('id', feeStructureIds);

      if (structuresError) throw structuresError;

      const studentMap = new Map(students?.map(s => [s.id, s.full_name]) || []);
      const structureMap = new Map(
        feeStructures?.map(fs => [fs.id, { name: fs.name, total_amount: fs.total_amount }]) || []
      );

      const combinedAssignments: FeeAssignment[] = assignments.map(assignment => {
        const structure = structureMap.get(assignment.fee_structure_id);
        return {
          id: assignment.id,
          student_id: assignment.student_id,
          fee_structure_id: assignment.fee_structure_id,
          assigned_at: assignment.assigned_at,
          student_name: studentMap.get(assignment.student_id) || 'Unknown Student',
          fee_structure_name: structure?.name || 'Unknown Structure',
          total_amount: structure?.total_amount || 0
        };
      });

      setExistingAssignments(combinedAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setExistingAssignments([]);
    }
  }

  function applyFilters() {
    let filtered = [...students];

    if (filterClass !== 'all') {
      filtered = filtered.filter(s => s.class_name === filterClass);
    }

    if (filterAcademicYear !== 'all') {
      filtered = filtered.filter(s => s.academic_year === filterAcademicYear);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(s =>
        s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.class_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  }

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  async function handleAssignFees() {
    if (!selectedStructure || selectedStudents.length === 0) {
      showNotification('warning', 'Selection Required', 'Please select a fee structure and at least one student');
      return;
    }

    setLoading(true);
    try {
      const assignments = selectedStudents.map(studentId => ({
        student_id: studentId,
        fee_structure_id: selectedStructure.id,
        assigned_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('student_fee_assignments')
        .insert(assignments);

      if (error) throw error;

      showNotification('success', 'Assignment Successful', `Successfully assigned fee structure to ${selectedStudents.length} student(s)`);
      setSelectedStudents([]);
      fetchExistingAssignments();
      setAssignmentView('view');
    } catch (error: any) {
      console.error('Error assigning fees:', error);
      if (error.code === '23505') {
        showNotification('error', 'Duplicate Assignment', 'Some students already have this fee structure assigned');
      } else {
        showNotification('error', 'Assignment Failed', 'Failed to assign fees. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAssignment(assignmentId: string) {
    if (!confirm('Are you sure you want to remove this fee assignment?')) return;

    try {
      const { error } = await supabase
        .from('student_fee_assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      showNotification('success', 'Assignment Removed', 'Assignment removed successfully');
      fetchExistingAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      showNotification('error', 'Delete Failed', 'Failed to remove assignment');
    }
  }

  const eligibleClasses = useMemo(() => {
    return Array.from(new Set(students.map(s => s.class_name)));
  }, [students]);

  const eligibleAcademicYears = useMemo(() => {
    return Array.from(new Set(students.map(s => s.academic_year)));
  }, [students]);

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
          className="mb-8 relative z-10"
        >
          <h1 className="text-3xl font-semibold text-foreground mb-2">Fee Assignment Management</h1>
          <p className="text-muted-foreground">Assign fee structures to students based on eligibility criteria</p>
        </motion.div>

        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex gap-4 relative z-10"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAssignmentView('create')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              assignmentView === 'create'
                ? 'gradient-primary text-white shadow-glow'
                : 'glass-strong text-foreground border border-border hover:bg-white'
            }`}
            style={assignmentView === 'create' ? {
              background: 'linear-gradient(135deg, #1E88E5 0%, #5B9FFF 100%)'
            } : undefined}
          >
            <Plus className="w-5 h-5" />
            Create Assignment
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAssignmentView('view')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              assignmentView === 'view'
                ? 'gradient-primary text-white shadow-glow'
                : 'glass-strong text-foreground border border-border hover:bg-white'
            }`}
            style={assignmentView === 'view' ? {
              background: 'linear-gradient(135deg, #1E88E5 0%, #5B9FFF 100%)'
            } : undefined}
          >
            <Eye className="w-5 h-5" />
            View Assignments ({existingAssignments.length})
          </motion.button>
        </motion.div>

        {/* Create Assignment View */}
        <AnimatePresence mode="wait">
          {assignmentView === 'create' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 relative z-10"
            >
              {/* Fee Structure Selection */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-strong rounded-2xl shadow-soft p-6 border border-border"
              >
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  Step 1: Select Fee Structure
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {feeStructures.map((structure, index) => (
                    <motion.div
                      key={structure.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      onClick={() => setSelectedStructure(structure)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedStructure?.id === structure.id
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border hover:border-primary/50 bg-white'
                      }`}
                    >
                      <h4 className="font-semibold text-foreground mb-2">
                        {structure.name}
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {structure.academic_year}
                        </p>
                        <p className="text-muted-foreground">
                          {structure.applicable_for === 'All' ? 'All Students' :
                            structure.applicable_for === 'SpecificGrade' ? 'Specific Grades' :
                              'Student Group'}
                        </p>
                        <p className="text-lg font-bold text-primary flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ₹{structure.total_amount.toLocaleString()}
                        </p>
                      </div>
                      {selectedStructure?.id === structure.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-2 flex items-center gap-1 text-primary text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Selected
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {feeStructures.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">No active fee structures available</p>
                  </motion.div>
                )}
              </motion.div>

              {/* Student Selection */}
              <AnimatePresence>
                {selectedStructure && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-strong rounded-2xl shadow-soft p-6 border border-border"
                  >
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-accent" />
                      </div>
                      Step 2: Select Students
                    </h3>

                    {/* Structure Info */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/20"
                    >
                      <p className="text-sm text-primary font-medium">
                        <span className="font-semibold">Selected Structure:</span> {selectedStructure.name}
                        {selectedStructure.applicable_for === 'SpecificGrade' && selectedStructure.applicable_grades && (
                          <span className="ml-2">
                            (Classes: {selectedStructure.applicable_grades.join(', ')})
                          </span>
                        )}
                      </p>
                    </motion.div>

                    {/* Filters */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Filter by Class
                        </label>
                        <select
                          value={filterClass}
                          onChange={(e) => setFilterClass(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-input bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        >
                          <option value="all">All Classes</option>
                          {eligibleClasses.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Filter by Academic Year
                        </label>
                        <select
                          value={filterAcademicYear}
                          onChange={(e) => setFilterAcademicYear(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-input bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        >
                          <option value="all">All Years</option>
                          {eligibleAcademicYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Search Students
                        </label>
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Student List Header */}
                    <div className="mb-4 flex items-center justify-between p-4 bg-secondary rounded-xl">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                          onChange={toggleSelectAll}
                          className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-foreground font-semibold">
                          Select All ({filteredStudents.length} students)
                        </span>
                      </label>
                      <span className="text-sm text-muted-foreground font-medium">
                        {selectedStudents.length} selected
                      </span>
                    </div>

                    {/* Student List */}
                    <div className="max-h-96 overflow-y-auto border border-border rounded-xl custom-scrollbar">
                      {loading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                        </div>
                      ) : filteredStudents.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-12"
                        >
                          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-muted-foreground">No eligible students found</p>
                        </motion.div>
                      ) : (
                        filteredStudents.map((student, index) => (
                          <motion.div
                            key={student.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 }}
                            onClick={() => toggleStudentSelection(student.id)}
                            className={`flex items-center gap-3 p-4 cursor-pointer border-b border-border last:border-b-0 transition-all ${
                              selectedStudents.includes(student.id)
                                ? 'bg-primary/5'
                                : 'hover:bg-secondary/50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student.id)}
                              onChange={() => toggleStudentSelection(student.id)}
                              className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">
                                {student.full_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {student.class_name} • {student.academic_year}
                              </p>
                            </div>
                            {selectedStudents.includes(student.id) && (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            )}
                          </motion.div>
                        ))
                      )}
                    </div>

                    {/* Assign Button */}
                    <div className="mt-6 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAssignFees}
                        disabled={loading || selectedStudents.length === 0}
                        className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center gap-2 ${
                          loading || selectedStudents.length === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'gradient-primary shadow-glow hover:shadow-float'
                        }`}
                        style={!(loading || selectedStudents.length === 0) ? {
                          background: 'linear-gradient(135deg, #1E88E5 0%, #5B9FFF 100%)'
                        } : undefined}
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Assigning...
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-5 h-5" />
                            Assign to {selectedStudents.length} Student(s)
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* View Assignments */}
          {assignmentView === 'view' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-strong rounded-2xl shadow-soft overflow-hidden border border-border relative z-10"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-primary" />
                  Existing Fee Assignments
                </h3>

                {/* Filter for viewing assignments */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Filter by Structure
                    </label>
                    <select
                      value={filterStructure}
                      onChange={(e) => setFilterStructure(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-input bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="all">All Structures</option>
                      {feeStructures.map(structure => (
                        <option key={structure.id} value={structure.id}>
                          {structure.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search by student name..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignments Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#1E88E5] to-[#5B9FFF] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Student Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Fee Structure</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Total Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Assigned Date</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {existingAssignments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-muted-foreground text-lg">
                            No fee assignments found
                          </p>
                        </td>
                      </tr>
                    ) : (
                      existingAssignments
                        .filter(assignment =>
                          filterStructure === 'all' || assignment.fee_structure_id === filterStructure
                        )
                        .map((assignment, index) => (
                          <motion.tr
                            key={assignment.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-secondary/50 transition-all"
                          >
                            <td className="px-6 py-4 text-foreground font-semibold">
                              {assignment.student_name}
                            </td>
                            <td className="px-6 py-4 text-foreground">
                              {assignment.fee_structure_name}
                            </td>
                            <td className="px-6 py-4 text-primary font-bold text-lg">
                              ₹{assignment.total_amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              {new Date(assignment.assigned_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteAssignment(assignment.id)}
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                              >
                                <Trash className="w-4 h-4" />
                                Remove
                              </motion.button>
                            </td>
                          </motion.tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FeeAssignment;
