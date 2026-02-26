// // FeePaymentManagement.tsx
// import React, { useState, useEffect, useMemo, useRef } from 'react'
// import { supabase } from '../../../lib/supabase'
// import { 
//   Search, 
//   DollarSign, 
//   CreditCard, 
//   Calendar, 
//   FileText, 
//   Printer, 
//   Download,
//   CheckCircle,
//   AlertCircle,
//   TrendingUp,
//   Receipt,
//   Filter,
//   X,
//   Eye
// } from 'lucide-react'

// interface Student {
//   id: string
//   student_name: string
//   class_name: string
//   academic_year: string
// }

// interface FeeComponent {
//   id: string
//   type: string
//   amount: number
//   frequency: string
//   due_date: string
// }

// interface FeeStructure {
//   id: string
//   name: string
//   total_amount: number
//   fee_components: FeeComponent[]
// }

// interface FeeAssignment {
//   id: string
//   student_id: string
//   fee_structure_id: string
//   fee_structure: FeeStructure
// }

// interface Payment {
//   id: string
//   student_id: string
//   fee_structure_id: string
//   fee_type: string
//   amount_paid: number
//   payment_mode: string
//   payment_date: string
//   receipt_no: string
//   remarks: string | null
//   created_at: string
// }

// interface FeeSummary {
//   fee_type: string
//   total_amount: number
//   paid: number
//   balance: number
// }

// const paymentModes = ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Cheque', 'Online']

// const FeePaymentManagement: React.FC = () => {
//   // State Management
//   const [students, setStudents] = useState<Student[]>([])
//   const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
//   const [feeAssignments, setFeeAssignments] = useState<FeeAssignment[]>([])
//   const [payments, setPayments] = useState<Payment[]>([])
//   const [feeSummary, setFeeSummary] = useState<FeeSummary[]>([])
  
//   // Form States
//   const [feeType, setFeeType] = useState<string>('')
//   const [paymentAmount, setPaymentAmount] = useState<string>('')
//   const [paymentMode, setPaymentMode] = useState<string>('Cash')
//   const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0])
//   const [receiptNo, setReceiptNo] = useState<string>('')
//   const [remarks, setRemarks] = useState<string>('')
  
//   // Filter States
//   const [filterClass, setFilterClass] = useState<string>('all')
//   const [filterAcademicYear, setFilterAcademicYear] = useState<string>('all')
//   const [searchQuery, setSearchQuery] = useState<string>('')
  
//   // Transaction History Filters
//   const [historyFilterMonth, setHistoryFilterMonth] = useState<string>('all')
//   const [historyFilterFeeType, setHistoryFilterFeeType] = useState<string>('all')
//   const [historyFilterPaymentMode, setHistoryFilterPaymentMode] = useState<string>('all')
  
//   // UI States
//   const [loading, setLoading] = useState(false)
//   const [showReceipt, setShowReceipt] = useState(false)
//   const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  
//   // Dropdown data
//   const [classes, setClasses] = useState<string[]>([])
//   const [academicYears, setAcademicYears] = useState<string[]>([])
//   const [availableFeeTypes, setAvailableFeeTypes] = useState<string[]>([])

//   useEffect(() => {
//     fetchStudents()
//     fetchClasses()
//     fetchAcademicYears()
//   }, [])

//   useEffect(() => {
//     if (selectedStudent) {
//       fetchStudentFeeData()
//     }
//   }, [selectedStudent])

//   useEffect(() => {
//     generateReceiptNumber()
//   }, [])

//   async function fetchStudents() {
//     try {
//       const { data, error } = await supabase
//         .from('class_assignments')
//         .select('student_id, student_name, class_name, academic_year')
//         .order('student_name')

//       if (error) throw error

//       const uniqueStudents = Array.from(
//         new Map(data?.map(s => [s.student_id, {
//           id: s.student_id,
//           student_name: s.student_name || 'Unknown',
//           class_name: s.class_name || 'N/A',
//           academic_year: s.academic_year
//         }])).values()
//       )

//       setStudents(uniqueStudents)
//     } catch (error) {
//       console.error('Error fetching students:', error)
//     }
//   }

//   async function fetchClasses() {
//     try {
//       const { data, error } = await supabase
//         .from('class_assignments')
//         .select('class_name')

//       if (error) throw error

//       const uniqueClasses = Array.from(new Set(data?.map(c => c.class_name) || []))
//       setClasses(uniqueClasses)
//     } catch (error) {
//       console.error('Error fetching classes:', error)
//     }
//   }

//   async function fetchAcademicYears() {
//     try {
//       const { data, error } = await supabase
//         .from('class_assignments')
//         .select('academic_year')
//         .order('academic_year', { ascending: false })

//       if (error) throw error

//       const uniqueYears = Array.from(new Set(data?.map(y => y.academic_year) || []))
//       setAcademicYears(uniqueYears)
//     } catch (error) {
//       console.error('Error fetching academic years:', error)
//     }
//   }

//   async function fetchStudentFeeData() {
//   if (!selectedStudent) return

//   setLoading(true)
//   try {
//     // Fetch fee assignments
//     const { data: assignments, error: assignError } = await supabase
//       .from('student_fee_assignments')
//       .select('id, student_id, fee_structure_id')
//       .eq('student_id', selectedStudent.id)

//     if (assignError) throw assignError

//     if (assignments && assignments.length > 0) {
//       // Fetch fee structure details
//       const structureIds = assignments.map(a => a.fee_structure_id)
      
//       const { data: structures, error: structError } = await supabase
//         .from('fee_structures')
//         .select('id, name, total_amount')
//         .in('id', structureIds)

//       if (structError) throw structError

//       // Fetch fee components
//       const { data: components, error: compError } = await supabase
//         .from('fee_components_table')
//         .select('*')
//         .in('fee_structure_id', structureIds)

//       if (compError) throw compError

//       // Combine data
//       const structureMap = new Map(structures?.map(s => [s.id, s]) || [])
//       const componentsMap = new Map<string, FeeComponent[]>()
      
//       components?.forEach(comp => {
//         if (!componentsMap.has(comp.fee_structure_id)) {
//           componentsMap.set(comp.fee_structure_id, [])
//         }
//         componentsMap.get(comp.fee_structure_id)?.push({
//           id: comp.id,
//           type: comp.type,
//           amount: Number(comp.amount),
//           frequency: comp.frequency,
//           due_date: comp.due_date
//         })
//       })

//       const enrichedAssignments: FeeAssignment[] = assignments.map(a => ({
//         id: a.id,
//         student_id: a.student_id,
//         fee_structure_id: a.fee_structure_id,
//         fee_structure: {
//           id: a.fee_structure_id,
//           name: structureMap.get(a.fee_structure_id)?.name || 'Unknown',
//           total_amount: Number(structureMap.get(a.fee_structure_id)?.total_amount || 0),
//           fee_components: componentsMap.get(a.fee_structure_id) || []
//         }
//       }))

//       setFeeAssignments(enrichedAssignments)

//       // Get unique fee types
//       const feeTypes = new Set<string>()
//       enrichedAssignments.forEach(a => {
//         a.fee_structure.fee_components.forEach(c => feeTypes.add(c.type))
//       })
//       setAvailableFeeTypes(Array.from(feeTypes))
//       if (feeTypes.size > 0 && !feeType) {
//         setFeeType(Array.from(feeTypes)[0])
//       }

//       // Fetch payment history
//       const { data: paymentData, error: payError } = await supabase
//         .from('fee_payments')
//         .select('*')
//         .eq('student_id', selectedStudent.id)
//         .order('payment_date', { ascending: false })

//       if (payError) throw payError

//       setPayments(paymentData || [])

//       // Calculate fee summary - FIXED: Pass components correctly
//       calculateFeeSummary(enrichedAssignments, components || [], paymentData || [])

//     } else {
//       // No assignments found
//       setFeeAssignments([])
//       setAvailableFeeTypes([])
//       setPayments([])
//       setFeeSummary([])
//     }

//   } catch (error) {
//     console.error('Error fetching student fee data:', error)
//   } finally {
//     setLoading(false)
//   }
// }


//   function calculateFeeSummary(
//   assignments: FeeAssignment[],
//   components: any[],
//   payments: Payment[]
// ) {
//   const summaryMap = new Map<string, { total: number; paid: number }>()

//   // Calculate total amounts from components
//   components.forEach(comp => {
//     const current = summaryMap.get(comp.type) || { total: 0, paid: 0 }
//     current.total += Number(comp.amount)
//     summaryMap.set(comp.type, current)
//   })

//   // Calculate paid amounts
//   payments.forEach(payment => {
//     const current = summaryMap.get(payment.fee_type) || { total: 0, paid: 0 }
//     current.paid += Number(payment.amount_paid)
//     summaryMap.set(payment.fee_type, current)
//   })

//   const summary: FeeSummary[] = Array.from(summaryMap.entries()).map(([type, data]) => ({
//     fee_type: type,
//     total_amount: data.total,
//     paid: data.paid,
//     balance: data.total - data.paid
//   }))

//   setFeeSummary(summary)
// }


//   async function generateReceiptNumber() {
//     try {
//       const { data, error } = await supabase.rpc('generate_receipt_number')
      
//       if (error) {
//         // Fallback if function doesn't exist
//         const { data: payments, error: fetchError } = await supabase
//           .from('fee_payments')
//           .select('receipt_no')
//           .order('created_at', { ascending: false })
//           .limit(1)

//         if (fetchError) throw fetchError

//         let nextNum = 1
//         if (payments && payments.length > 0) {
//           const lastReceipt = payments[0].receipt_no
//           const match = lastReceipt.match(/\d+/)
//           if (match) {
//             nextNum = parseInt(match[0]) + 1
//           }
//         }
//         setReceiptNo(`REC${String(nextNum).padStart(6, '0')}`)
//       } else {
//         setReceiptNo(data)
//       }
//     } catch (error) {
//       console.error('Error generating receipt number:', error)
//       setReceiptNo(`REC${Date.now().toString().slice(-6)}`)
//     }
//   }

//   async function handleRecordPayment() {
//     if (!selectedStudent || !feeType || !paymentAmount || parseFloat(paymentAmount) <= 0) {
//       alert('Please fill all required fields with valid values')
//       return
//     }

//     // Find the fee structure that contains this fee type
//     const feeStructure = feeAssignments.find(a =>
//       a.fee_structure.fee_components.some(c => c.type === feeType)
//     )

//     if (!feeStructure) {
//       alert('Fee structure not found for selected fee type')
//       return
//     }

//     setLoading(true)
//     try {
//       const { error } = await supabase
//         .from('fee_payments')
//         .insert({
//           student_id: selectedStudent.id,
//           fee_structure_id: feeStructure.fee_structure_id,
//           fee_type: feeType,
//           amount_paid: parseFloat(paymentAmount),
//           payment_mode: paymentMode,
//           payment_date: paymentDate,
//           receipt_no: receiptNo,
//           remarks: remarks || null
//         })

//       if (error) throw error

//       alert('Payment recorded successfully!')
      
//       // Refresh data
//       await fetchStudentFeeData()
//       await generateReceiptNumber()
      
//       // Reset form
//       setPaymentAmount('')
//       setRemarks('')
//       setPaymentDate(new Date().toISOString().split('T')[0])

//     } catch (error: any) {
//       console.error('Error recording payment:', error)
//       if (error.code === '23505') {
//         alert('Receipt number already exists. Generating new one...')
//         generateReceiptNumber()
//       } else {
//         alert('Failed to record payment. Please try again.')
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   function resetForm() {
//     setPaymentAmount('')
//     setRemarks('')
//     setPaymentDate(new Date().toISOString().split('T')[0])
//     if (availableFeeTypes.length > 0) {
//       setFeeType(availableFeeTypes[0])
//     }
//     generateReceiptNumber()
//   }

//   // Calculate summary cards
//   const totalAssigned = useMemo(() => {
//     return feeSummary.reduce((sum, item) => sum + item.total_amount, 0)
//   }, [feeSummary])

//   const totalPaid = useMemo(() => {
//     return feeSummary.reduce((sum, item) => sum + item.paid, 0)
//   }, [feeSummary])

//   const outstandingBalance = useMemo(() => {
//     return totalAssigned - totalPaid
//   }, [totalAssigned, totalPaid])

//   const overdueAmount = useMemo(() => {
//     const today = new Date()
//     let overdue = 0

//     feeAssignments.forEach(assignment => {
//       assignment.fee_structure.fee_components.forEach(component => {
//         const dueDate = new Date(component.due_date)
//         if (dueDate < today) {
//           const paid = payments
//             .filter(p => p.fee_type === component.type)
//             .reduce((sum, p) => sum + Number(p.amount_paid), 0)
//           const balance = component.amount - paid
//           if (balance > 0) {
//             overdue += balance
//           }
//         }
//       })
//     })

//     return overdue
//   }, [feeAssignments, payments])

//   // Filter students
//   const filteredStudents = useMemo(() => {
//     return students.filter(student => {
//       const matchesClass = filterClass === 'all' || student.class_name === filterClass
//       const matchesYear = filterAcademicYear === 'all' || student.academic_year === filterAcademicYear
//       const matchesSearch = searchQuery.trim() === '' || 
//         student.student_name.toLowerCase().includes(searchQuery.toLowerCase())
      
//       return matchesClass && matchesYear && matchesSearch
//     })
//   }, [students, filterClass, filterAcademicYear, searchQuery])

//   // Filter payment history
//   const filteredPayments = useMemo(() => {
//     return payments.filter(payment => {
//       const matchesMonth = historyFilterMonth === 'all' || 
//         new Date(payment.payment_date).getMonth() === parseInt(historyFilterMonth)
//       const matchesFeeType = historyFilterFeeType === 'all' || 
//         payment.fee_type === historyFilterFeeType
//       const matchesMode = historyFilterPaymentMode === 'all' || 
//         payment.payment_mode === historyFilterPaymentMode
      
//       return matchesMonth && matchesFeeType && matchesMode
//     })
//   }, [payments, historyFilterMonth, historyFilterFeeType, historyFilterPaymentMode])

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
//             <DollarSign className="w-8 h-8 text-blue-600" />
//             Fee Payment Management
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400">
//             Record, track, and manage student fee payments
//           </p>
//         </div>

//         {/* Summary Cards */}
//         {selectedStudent && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
//               <div className="flex items-center justify-between mb-2">
//                 <FileText className="w-8 h-8 opacity-80" />
//                 <TrendingUp className="w-5 h-5 opacity-60" />
//               </div>
//               <p className="text-blue-100 text-sm font-medium mb-1">Total Fee Assigned</p>
//               <p className="text-3xl font-bold">₹{totalAssigned.toLocaleString()}</p>
//             </div>

//             <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
//               <div className="flex items-center justify-between mb-2">
//                 <CheckCircle className="w-8 h-8 opacity-80" />
//                 <DollarSign className="w-5 h-5 opacity-60" />
//               </div>
//               <p className="text-green-100 text-sm font-medium mb-1">Total Paid</p>
//               <p className="text-3xl font-bold">₹{totalPaid.toLocaleString()}</p>
//             </div>

//             <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
//               <div className="flex items-center justify-between mb-2">
//                 <AlertCircle className="w-8 h-8 opacity-80" />
//                 <TrendingUp className="w-5 h-5 opacity-60" />
//               </div>
//               <p className="text-orange-100 text-sm font-medium mb-1">Outstanding Balance</p>
//               <p className="text-3xl font-bold">₹{outstandingBalance.toLocaleString()}</p>
//             </div>

//             <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
//               <div className="flex items-center justify-between mb-2">
//                 <AlertCircle className="w-8 h-8 opacity-80" />
//                 <Calendar className="w-5 h-5 opacity-60" />
//               </div>
//               <p className="text-red-100 text-sm font-medium mb-1">Overdue</p>
//               <p className="text-3xl font-bold">₹{overdueAmount.toLocaleString()}</p>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Student Selection & Payment Entry */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Student Search & Filter */}
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//                 <Search className="w-5 h-5 text-blue-600" />
//                 Search & Select Student
//               </h3>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                     Search Student
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       placeholder="Search by name..."
//                       className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                     Filter by Class
//                   </label>
//                   <select
//                     value={filterClass}
//                     onChange={(e) => setFilterClass(e.target.value)}
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="all">All Classes</option>
//                     {classes.map(cls => (
//                       <option key={cls} value={cls}>{cls}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                     Filter by Year
//                   </label>
//                   <select
//                     value={filterAcademicYear}
//                     onChange={(e) => setFilterAcademicYear(e.target.value)}
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="all">All Years</option>
//                     {academicYears.map(year => (
//                       <option key={year} value={year}>{year}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Student List */}
//               <div className="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg">
//                 {filteredStudents.length === 0 ? (
//                   <p className="text-center text-gray-500 dark:text-gray-400 py-8">
//                     No students found
//                   </p>
//                 ) : (
//                   filteredStudents.map(student => (
//                     <div
//                       key={student.id}
//                       onClick={() => setSelectedStudent(student)}
//                       className={`p-4 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors ${
//                         selectedStudent?.id === student.id
//                           ? 'bg-blue-50 dark:bg-blue-900/20'
//                           : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
//                       }`}
//                     >
//                       <p className="font-semibold text-gray-900 dark:text-gray-100">
//                         {student.student_name}
//                       </p>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">
//                         {student.class_name} • {student.academic_year}
//                       </p>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* Fee Summary Table */}
//             {selectedStudent && feeSummary.length > 0 && (
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
//                 <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-700">
//                   <h3 className="text-xl font-bold text-white flex items-center gap-2">
//                     <FileText className="w-5 h-5" />
//                     Fee Summary for {selectedStudent.student_name}
//                   </h3>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-100 dark:bg-gray-700">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
//                           Fee Type
//                         </th>
//                         <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
//                           Total Amount
//                         </th>
//                         <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
//                           Paid
//                         </th>
//                         <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
//                           Balance
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                       {feeSummary.map((item, index) => (
//                         <tr
//                           key={index}
//                           className={item.balance > 0 ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}
//                         >
//                           <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">
//                             {item.fee_type}
//                           </td>
//                           <td className="px-6 py-4 text-right text-gray-700 dark:text-gray-300">
//                             ₹{item.total_amount.toLocaleString()}
//                           </td>
//                           <td className="px-6 py-4 text-right text-green-600 dark:text-green-400 font-semibold">
//                             ₹{item.paid.toLocaleString()}
//                           </td>
//                           <td className="px-6 py-4 text-right">
//                             <span
//                               className={`font-bold ${
//                                 item.balance > 0
//                                   ? 'text-red-600 dark:text-red-400'
//                                   : 'text-green-600 dark:text-green-400'
//                               }`}
//                             >
//                               ₹{item.balance.toLocaleString()}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {/* Payment Entry Form */}
//             {selectedStudent && (
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//                   <CreditCard className="w-5 h-5 text-green-600" />
//                   Record Payment
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                       Student Name
//                     </label>
//                     <input
//                       type="text"
//                       value={selectedStudent.student_name}
//                       disabled
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                       Class
//                     </label>
//                     <input
//                       type="text"
//                       value={selectedStudent.class_name}
//                       disabled
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                       Academic Year
//                     </label>
//                     <input
//                       type="text"
//                       value={selectedStudent.academic_year}
//                       disabled
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                       Fee Type *
//                     </label>
//                     <select
//                       value={feeType}
//                       onChange={(e) => setFeeType(e.target.value)}
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       {availableFeeTypes.map(type => (
//                         <option key={type} value={type}>{type}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                       Payment Amount *
//                     </label>
//                     <div className="relative">
//                       <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">
//                         ₹
//                       </span>
//                       <input
//                         type="number"
//                         value={paymentAmount}
//                         onChange={(e) => setPaymentAmount(e.target.value)}
//                         min="0"
//                         step="0.01"
//                         placeholder="0.00"
//                         className="w-full px-4 py-2 pl-8 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                       Payment Mode *
//                     </label>
//                     <select
//                       value={paymentMode}
//                       onChange={(e) => setPaymentMode(e.target.value)}
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       {paymentModes.map(mode => (
//                         <option key={mode} value={mode}>{mode}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                       Payment Date *
//                     </label>
//                     <input
//                       type="date"
//                       value={paymentDate}
//                       onChange={(e) => setPaymentDate(e.target.value)}
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                       Receipt No.
//                     </label>
//                     <input
//                       type="text"
//                       value={receiptNo}
//                       disabled
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-mono"
//                     />
//                   </div>
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                     Remarks (Optional)
//                   </label>
//                   <textarea
//                     value={remarks}
//                     onChange={(e) => setRemarks(e.target.value)}
//                     rows={3}
//                     placeholder="Add any additional notes..."
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div className="flex gap-3">
//                   <button
//                     onClick={handleRecordPayment}
//                     disabled={loading}
//                     className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
//                       loading
//                         ? 'bg-gray-400 cursor-not-allowed'
//                         : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg'
//                     }`}
//                   >
//                     <CheckCircle className="w-5 h-5" />
//                     {loading ? 'Recording...' : 'Record Payment'}
//                   </button>

//                   <button
//                     onClick={resetForm}
//                     className="px-6 py-3 rounded-lg font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
//                   >
//                     <X className="w-5 h-5" />
//                     Reset
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Column - Transaction History */}
//           <div className="lg:col-span-1">
//             {selectedStudent && payments.length > 0 && (
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-6">
//                 <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-700">
//                   <h3 className="text-xl font-bold text-white flex items-center gap-2">
//                     <Receipt className="w-5 h-5" />
//                     Transaction History
//                   </h3>
//                 </div>

//                 {/* History Filters */}
//                 <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
//                   <select
//                     value={historyFilterMonth}
//                     onChange={(e) => setHistoryFilterMonth(e.target.value)}
//                     className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="all">All Months</option>
//                     {Array.from({ length: 12 }, (_, i) => (
//                       <option key={i} value={i}>
//                         {new Date(2000, i).toLocaleString('default', { month: 'long' })}
//                       </option>
//                     ))}
//                   </select>

//                   <select
//                     value={historyFilterFeeType}
//                     onChange={(e) => setHistoryFilterFeeType(e.target.value)}
//                     className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="all">All Fee Types</option>
//                     {availableFeeTypes.map(type => (
//                       <option key={type} value={type}>{type}</option>
//                     ))}
//                   </select>

//                   <select
//                     value={historyFilterPaymentMode}
//                     onChange={(e) => setHistoryFilterPaymentMode(e.target.value)}
//                     className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="all">All Payment Modes</option>
//                     {paymentModes.map(mode => (
//                       <option key={mode} value={mode}>{mode}</option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Payment List */}
//                 <div className="max-h-[600px] overflow-y-auto">
//                   {filteredPayments.length === 0 ? (
//                     <p className="text-center text-gray-500 dark:text-gray-400 py-8">
//                       No transactions found
//                     </p>
//                   ) : (
//                     filteredPayments.map(payment => {
//                       const currentBalance = feeSummary.find(
//                         s => s.fee_type === payment.fee_type
//                       )?.balance || 0

//                       return (
//                         <div
//                           key={payment.id}
//                           className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
//                         >
//                           <div className="flex justify-between items-start mb-2">
//                             <div>
//                               <p className="font-semibold text-gray-900 dark:text-gray-100">
//                                 {payment.fee_type}
//                               </p>
//                               <p className="text-xs text-gray-500 dark:text-gray-400">
//                                 {new Date(payment.payment_date).toLocaleDateString('en-IN', {
//                                   day: 'numeric',
//                                   month: 'short',
//                                   year: 'numeric'
//                                 })}
//                               </p>
//                             </div>
//                             <span className="text-lg font-bold text-green-600 dark:text-green-400">
//                               ₹{Number(payment.amount_paid).toLocaleString()}
//                             </span>
//                           </div>

//                           <div className="flex items-center justify-between text-sm">
//                             <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs font-medium">
//                               {payment.payment_mode}
//                             </span>
//                             <span className="text-gray-600 dark:text-gray-400 text-xs font-mono">
//                               {payment.receipt_no}
//                             </span>
//                           </div>

//                           {payment.remarks && (
//                             <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 italic">
//                               {payment.remarks}
//                             </p>
//                           )}

//                           <div className="mt-2 flex items-center justify-between">
//                             <span className="text-xs text-gray-500 dark:text-gray-400">
//                               Balance: <span className="font-semibold">₹{currentBalance.toLocaleString()}</span>
//                             </span>
//                             <button
//                               onClick={() => {
//                                 setSelectedPayment(payment)
//                                 setShowReceipt(true)
//                               }}
//                               className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-xs flex items-center gap-1"
//                             >
//                               <Eye className="w-3 h-3" />
//                               View Receipt
//                             </button>
//                           </div>
//                         </div>
//                       )
//                     })
//                   )}
//                 </div>

//                 {/* Summary Footer */}
//                 <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
//                   <div className="flex justify-between items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
//                     <span>Total Transactions:</span>
//                     <span>{filteredPayments.length}</span>
//                   </div>
//                   <div className="flex justify-between items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2">
//                     <span>Total Amount:</span>
//                     <span className="text-green-600 dark:text-green-400">
//                       ₹{filteredPayments.reduce((sum, p) => sum + Number(p.amount_paid), 0).toLocaleString()}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Export Buttons */}
//                 <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
//                   <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
//                     <Download className="w-4 h-4" />
//                     Export Excel
//                   </button>
//                   <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
//                     <Download className="w-4 h-4" />
//                     Export PDF
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Receipt Modal */}
//       {showReceipt && selectedPayment && selectedStudent && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 rounded-t-xl flex justify-between items-center">
//               <h3 className="text-2xl font-bold">Payment Receipt</h3>
//               <button
//                 onClick={() => setShowReceipt(false)}
//                 className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             <div className="p-8" id="receipt-content">
//               {/* Receipt Header */}
//               <div className="text-center mb-8 pb-6 border-b-2 border-gray-300 dark:border-gray-600">
//                 <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//                   School Name
//                 </h1>
//                 <p className="text-gray-600 dark:text-gray-400">School Address Line 1</p>
//                 <p className="text-gray-600 dark:text-gray-400">School Address Line 2</p>
//                 <p className="text-gray-600 dark:text-gray-400">Phone: +91 1234567890</p>
//               </div>

//               {/* Receipt Details */}
//               <div className="mb-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">Receipt No.</p>
//                     <p className="text-lg font-bold text-gray-900 dark:text-white font-mono">
//                       {selectedPayment.receipt_no}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
//                     <p className="text-lg font-semibold text-gray-900 dark:text-white">
//                       {new Date(selectedPayment.payment_date).toLocaleDateString('en-IN')}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//                   <div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Student Name</p>
//                     <p className="font-semibold text-gray-900 dark:text-white">
//                       {selectedStudent.student_name}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Class</p>
//                     <p className="font-semibold text-gray-900 dark:text-white">
//                       {selectedStudent.class_name}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Academic Year</p>
//                     <p className="font-semibold text-gray-900 dark:text-white">
//                       {selectedStudent.academic_year}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Mode</p>
//                     <p className="font-semibold text-gray-900 dark:text-white">
//                       {selectedPayment.payment_mode}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Payment Details Table */}
//                 <table className="w-full mb-6">
//                   <thead className="bg-gray-100 dark:bg-gray-700">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
//                         Description
//                       </th>
//                       <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
//                         Amount
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr className="border-b border-gray-200 dark:border-gray-700">
//                       <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
//                         {selectedPayment.fee_type}
//                       </td>
//                       <td className="px-4 py-4 text-right text-gray-900 dark:text-gray-100 font-semibold">
//                         ₹{Number(selectedPayment.amount_paid).toLocaleString()}
//                       </td>
//                     </tr>
//                     <tr className="bg-gray-50 dark:bg-gray-700/50">
//                       <td className="px-4 py-4 text-right font-bold text-gray-900 dark:text-white">
//                         Total Paid:
//                       </td>
//                       <td className="px-4 py-4 text-right text-xl font-bold text-green-600 dark:text-green-400">
//                         ₹{Number(selectedPayment.amount_paid).toLocaleString()}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>

//                 {selectedPayment.remarks && (
//                   <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Remarks</p>
//                     <p className="text-gray-900 dark:text-gray-100">{selectedPayment.remarks}</p>
//                   </div>
//                 )}

//                 {/* Footer */}
//                 <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
//                   <p className="text-center text-sm text-gray-600 dark:text-gray-400">
//                     This is a computer-generated receipt and does not require a signature.
//                   </p>
//                   <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-2">
//                     Generated on: {new Date().toLocaleString('en-IN')}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Print Button */}
//             <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
//               <button
//                 onClick={() => window.print()}
//                 className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all"
//               >
//                 <Printer className="w-5 h-5" />
//                 Print Receipt
//               </button>
//               <button
//                 onClick={() => setShowReceipt(false)}
//                 className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Print Styles */}
//       <style>{`
//         @media print {
//           body * {
//             visibility: hidden;
//           }
//           #receipt-content, #receipt-content * {
//             visibility: visible;
//           }
//           #receipt-content {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }

// export default FeePaymentManagement
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Layers, CreditCard, Search, DollarSign, Calendar,
  Printer, Download, CheckCircle, AlertCircle, TrendingUp,
  Receipt, Filter, X, Eye, Plus, Users, Target, Clock,
  Info, Hash, Award
} from 'lucide-react';

interface Student {
  id: string;
  student_name: string;
  class_name: string;
  academic_year: string;
}

interface FeeComponent {
  id: string;
  type: string;
  amount: number;
  frequency: string;
  due_date: string;
}

interface FeeStructure {
  id: string;
  name: string;
  total_amount: number;
  fee_components: FeeComponent[];
}

interface FeeAssignment {
  id: string;
  student_id: string;
  fee_structure_id: string;
  fee_structure: FeeStructure;
}

interface Payment {
  id: string;
  student_id: string;
  fee_structure_id: string;
  fee_type: string;
  amount_paid: number;
  payment_mode: string;
  payment_date: string;
  receipt_no: string;
  remarks: string | null;
  created_at: string;
}

interface FeeSummary {
  fee_type: string;
  total_amount: number;
  paid: number;
  balance: number;
}

interface NotificationState {
  show: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

const paymentModes = ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Cheque', 'Online'];

const NAV_TABS = [
  { href: '/fees', label: 'Fee Structure', icon: <Layers className="w-4 h-4" /> },
  { href: '/assignfeestructure', label: 'Assign Structure', icon: <FileText className="w-4 h-4" /> },
  { href: '/feepayments', label: 'Fee Payments', icon: <CreditCard className="w-4 h-4" /> },
];

const FeePaymentManagement: React.FC = () => {
  const navigate = useNavigate();

  // State Management
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [feeAssignments, setFeeAssignments] = useState<FeeAssignment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [feeSummary, setFeeSummary] = useState<FeeSummary[]>([]);

  // Form States
  const [feeType, setFeeType] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<string>('Cash');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [receiptNo, setReceiptNo] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  // Filter States
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterAcademicYear, setFilterAcademicYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Transaction History Filters
  const [historyFilterMonth, setHistoryFilterMonth] = useState<string>('all');
  const [historyFilterFeeType, setHistoryFilterFeeType] = useState<string>('all');
  const [historyFilterPaymentMode, setHistoryFilterPaymentMode] = useState<string>('all');

  // UI States
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Dropdown data
  const [classes, setClasses] = useState<string[]>([]);
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [availableFeeTypes, setAvailableFeeTypes] = useState<string[]>([]);

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'info',
    title: '',
    message: ''
  });

  const activeTab = NAV_TABS.find((tab) => window.location.pathname === tab.href)?.href || '/feepayments';

  const showNotification = (type: NotificationState['type'], title: string, message: string) => {
    setNotification({ show: true, type, title, message });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
    fetchAcademicYears();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentFeeData();
    }
  }, [selectedStudent]);

  useEffect(() => {
    generateReceiptNumber();
  }, []);

  // All fetch functions remain the same...
  async function fetchStudents() {
    try {
      const { data, error } = await supabase
        .from('class_assignments')
        .select('student_id, student_name, class_name, academic_year')
        .order('student_name');

      if (error) throw error;

      const uniqueStudents = Array.from(
        new Map(data?.map(s => [s.student_id, {
          id: s.student_id,
          student_name: s.student_name || 'Unknown',
          class_name: s.class_name || 'N/A',
          academic_year: s.academic_year
        }])).values()
      );

      setStudents(uniqueStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }

  async function fetchClasses() {
    try {
      const { data, error } = await supabase
        .from('class_assignments')
        .select('class_name');

      if (error) throw error;

      const uniqueClasses = Array.from(new Set(data?.map(c => c.class_name) || []));
      setClasses(uniqueClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }

  async function fetchAcademicYears() {
    try {
      const { data, error } = await supabase
        .from('class_assignments')
        .select('academic_year')
        .order('academic_year', { ascending: false });

      if (error) throw error;

      const uniqueYears = Array.from(new Set(data?.map(y => y.academic_year) || []));
      setAcademicYears(uniqueYears);
    } catch (error) {
      console.error('Error fetching academic years:', error);
    }
  }

  async function fetchStudentFeeData() {
    if (!selectedStudent) return;

    setLoading(true);
    try {
      const { data: assignments, error: assignError } = await supabase
        .from('student_fee_assignments')
        .select('id, student_id, fee_structure_id')
        .eq('student_id', selectedStudent.id);

      if (assignError) throw assignError;

      if (assignments && assignments.length > 0) {
        const structureIds = assignments.map(a => a.fee_structure_id);

        const { data: structures, error: structError } = await supabase
          .from('fee_structures')
          .select('id, name, total_amount')
          .in('id', structureIds);

        if (structError) throw structError;

        const { data: components, error: compError } = await supabase
          .from('fee_components_table')
          .select('*')
          .in('fee_structure_id', structureIds);

        if (compError) throw compError;

        const structureMap = new Map(structures?.map(s => [s.id, s]) || []);
        const componentsMap = new Map<string, FeeComponent[]>();

        components?.forEach(comp => {
          if (!componentsMap.has(comp.fee_structure_id)) {
            componentsMap.set(comp.fee_structure_id, []);
          }
          componentsMap.get(comp.fee_structure_id)?.push({
            id: comp.id,
            type: comp.type,
            amount: Number(comp.amount),
            frequency: comp.frequency,
            due_date: comp.due_date
          });
        });

        const enrichedAssignments: FeeAssignment[] = assignments.map(a => ({
          id: a.id,
          student_id: a.student_id,
          fee_structure_id: a.fee_structure_id,
          fee_structure: {
            id: a.fee_structure_id,
            name: structureMap.get(a.fee_structure_id)?.name || 'Unknown',
            total_amount: Number(structureMap.get(a.fee_structure_id)?.total_amount || 0),
            fee_components: componentsMap.get(a.fee_structure_id) || []
          }
        }));

        setFeeAssignments(enrichedAssignments);

        const feeTypes = new Set<string>();
        enrichedAssignments.forEach(a => {
          a.fee_structure.fee_components.forEach(c => feeTypes.add(c.type));
        });
        setAvailableFeeTypes(Array.from(feeTypes));
        if (feeTypes.size > 0 && !feeType) {
          setFeeType(Array.from(feeTypes)[0]);
        }

        const { data: paymentData, error: payError } = await supabase
          .from('fee_payments')
          .select('*')
          .eq('student_id', selectedStudent.id)
          .order('payment_date', { ascending: false });

        if (payError) throw payError;

        setPayments(paymentData || []);
        calculateFeeSummary(enrichedAssignments, components || [], paymentData || []);
      } else {
        setFeeAssignments([]);
        setAvailableFeeTypes([]);
        setPayments([]);
        setFeeSummary([]);
      }
    } catch (error) {
      console.error('Error fetching student fee data:', error);
      showNotification('error', 'Loading Failed', 'Failed to load student fee data');
    } finally {
      setLoading(false);
    }
  }

  function calculateFeeSummary(
    assignments: FeeAssignment[],
    components: any[],
    payments: Payment[]
  ) {
    const summaryMap = new Map<string, { total: number; paid: number }>();

    components.forEach(comp => {
      const current = summaryMap.get(comp.type) || { total: 0, paid: 0 };
      current.total += Number(comp.amount);
      summaryMap.set(comp.type, current);
    });

    payments.forEach(payment => {
      const current = summaryMap.get(payment.fee_type) || { total: 0, paid: 0 };
      current.paid += Number(payment.amount_paid);
      summaryMap.set(payment.fee_type, current);
    });

    const summary: FeeSummary[] = Array.from(summaryMap.entries()).map(([type, data]) => ({
      fee_type: type,
      total_amount: data.total,
      paid: data.paid,
      balance: data.total - data.paid
    }));

    setFeeSummary(summary);
  }

  async function generateReceiptNumber() {
    try {
      const { data, error } = await supabase.rpc('generate_receipt_number');

      if (error) {
        const { data: payments, error: fetchError } = await supabase
          .from('fee_payments')
          .select('receipt_no')
          .order('created_at', { ascending: false })
          .limit(1);

        if (fetchError) throw fetchError;

        let nextNum = 1;
        if (payments && payments.length > 0) {
          const lastReceipt = payments[0].receipt_no;
          const match = lastReceipt.match(/\d+/);
          if (match) {
            nextNum = parseInt(match[0]) + 1;
          }
        }
        setReceiptNo(`REC${String(nextNum).padStart(6, '0')}`);
      } else {
        setReceiptNo(data);
      }
    } catch (error) {
      console.error('Error generating receipt number:', error);
      setReceiptNo(`REC${Date.now().toString().slice(-6)}`);
    }
  }

  async function handleRecordPayment() {
    if (!selectedStudent || !feeType || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      showNotification('warning', 'Validation Error', 'Please fill all required fields with valid values');
      return;
    }

    const feeStructure = feeAssignments.find(a =>
      a.fee_structure.fee_components.some(c => c.type === feeType)
    );

    if (!feeStructure) {
      showNotification('error', 'Not Found', 'Fee structure not found for selected fee type');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('fee_payments')
        .insert({
          student_id: selectedStudent.id,
          fee_structure_id: feeStructure.fee_structure_id,
          fee_type: feeType,
          amount_paid: parseFloat(paymentAmount),
          payment_mode: paymentMode,
          payment_date: paymentDate,
          receipt_no: receiptNo,
          remarks: remarks || null
        });

      if (error) throw error;

      showNotification('success', 'Payment Recorded', 'Payment recorded successfully!');

      await fetchStudentFeeData();
      await generateReceiptNumber();

      setPaymentAmount('');
      setRemarks('');
      setPaymentDate(new Date().toISOString().split('T')[0]);
    } catch (error: any) {
      console.error('Error recording payment:', error);
      if (error.code === '23505') {
        showNotification('error', 'Duplicate Receipt', 'Receipt number already exists');
        generateReceiptNumber();
      } else {
        showNotification('error', 'Payment Failed', 'Failed to record payment');
      }
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setPaymentAmount('');
    setRemarks('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    if (availableFeeTypes.length > 0) {
      setFeeType(availableFeeTypes[0]);
    }
    generateReceiptNumber();
  }

  // Calculate summary cards
  const totalAssigned = useMemo(() => {
    return feeSummary.reduce((sum, item) => sum + item.total_amount, 0);
  }, [feeSummary]);

  const totalPaid = useMemo(() => {
    return feeSummary.reduce((sum, item) => sum + item.paid, 0);
  }, [feeSummary]);

  const outstandingBalance = useMemo(() => {
    return totalAssigned - totalPaid;
  }, [totalAssigned, totalPaid]);

  const overdueAmount = useMemo(() => {
    const today = new Date();
    let overdue = 0;

    feeAssignments.forEach(assignment => {
      assignment.fee_structure.fee_components.forEach(component => {
        const dueDate = new Date(component.due_date);
        if (dueDate < today) {
          const paid = payments
            .filter(p => p.fee_type === component.type)
            .reduce((sum, p) => sum + Number(p.amount_paid), 0);
          const balance = component.amount - paid;
          if (balance > 0) {
            overdue += balance;
          }
        }
      });
    });

    return overdue;
  }, [feeAssignments, payments]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesClass = filterClass === 'all' || student.class_name === filterClass;
      const matchesYear = filterAcademicYear === 'all' || student.academic_year === filterAcademicYear;
      const matchesSearch = searchQuery.trim() === '' ||
        student.student_name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesClass && matchesYear && matchesSearch;
    });
  }, [students, filterClass, filterAcademicYear, searchQuery]);

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesMonth = historyFilterMonth === 'all' ||
        new Date(payment.payment_date).getMonth() === parseInt(historyFilterMonth);
      const matchesFeeType = historyFilterFeeType === 'all' ||
        payment.fee_type === historyFilterFeeType;
      const matchesMode = historyFilterPaymentMode === 'all' ||
        payment.payment_mode === historyFilterPaymentMode;

      return matchesMonth && matchesFeeType && matchesMode;
    });
  }, [payments, historyFilterMonth, historyFilterFeeType, historyFilterPaymentMode]);

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
          <h1 className="text-3xl font-semibold text-foreground mb-2 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-primary" />
            Fee Payment Management
          </h1>
          <p className="text-muted-foreground">
            Record, track, and manage student fee payments
          </p>
        </motion.div>

        {/* Summary Cards */}
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10"
          >
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="gradient-primary rounded-2xl shadow-soft p-6 text-white"
              style={{
                background: 'linear-gradient(135deg, #1E88E5 0%, #5B9FFF 100%)'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-8 h-8 opacity-80" />
                <TrendingUp className="w-5 h-5 opacity-60" />
              </div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Fee Assigned</p>
              <p className="text-3xl font-bold">₹{totalAssigned.toLocaleString()}</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-soft p-6 text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 opacity-80" />
                <DollarSign className="w-5 h-5 opacity-60" />
              </div>
              <p className="text-green-100 text-sm font-medium mb-1">Total Paid</p>
              <p className="text-3xl font-bold">₹{totalPaid.toLocaleString()}</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-soft p-6 text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-8 h-8 opacity-80" />
                <TrendingUp className="w-5 h-5 opacity-60" />
              </div>
              <p className="text-orange-100 text-sm font-medium mb-1">Outstanding Balance</p>
              <p className="text-3xl font-bold">₹{outstandingBalance.toLocaleString()}</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-soft p-6 text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-8 h-8 opacity-80" />
                <Calendar className="w-5 h-5 opacity-60" />
              </div>
              <p className="text-red-100 text-sm font-medium mb-1">Overdue</p>
              <p className="text-3xl font-bold">₹{overdueAmount.toLocaleString()}</p>
            </motion.div>
          </motion.div>
        )}

                {/* Student Search & Filter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass-strong rounded-2xl shadow-soft p-6 border border-border"
          >
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Select Student
            </h3>

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
                  {classes.map(cls => (
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
                  {academicYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Search Student
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

            {/* Student List */}
            <div className="max-h-96 overflow-y-auto border border-border rounded-xl custom-scrollbar">
              {filteredStudents.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No students found</p>
                </motion.div>
              ) : (
                filteredStudents.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => setSelectedStudent(student)}
                    className={`flex items-center justify-between p-4 cursor-pointer border-b border-border last:border-b-0 transition-all ${
                      selectedStudent?.id === student.id
                        ? 'bg-primary/5 border-l-4 border-l-primary'
                        : 'hover:bg-secondary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{student.student_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.class_name} • {student.academic_year}
                        </p>
                      </div>
                    </div>
                    {selectedStudent?.id === student.id && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Selected Student Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-strong rounded-2xl shadow-soft p-6 border border-border"
          >
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-accent" />
              Selected Student
            </h3>

            {selectedStudent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
                      {selectedStudent.student_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-lg">{selectedStudent.student_name}</p>
                      <p className="text-sm text-muted-foreground">{selectedStudent.class_name}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Academic Year:</span>
                      <span className="font-semibold text-foreground">{selectedStudent.academic_year}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Student ID:</span>
                      <span className="font-mono text-xs text-foreground">{selectedStudent.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>

                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">Select a student to view fee details</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Fee Summary & Payment Section */}
        <AnimatePresence>
          {selectedStudent && feeAssignments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10"
            >
              {/* Fee Summary Table */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2 glass-strong rounded-2xl shadow-soft overflow-hidden border border-border"
              >
                <div className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Receipt className="w-6 h-6 text-primary" />
                    Fee Summary
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Fee Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Paid</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Balance</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {feeSummary.map((summary, index) => (
                        <motion.tr
                          key={summary.fee_type}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                          className="hover:bg-secondary/50 transition-all"
                        >
                          <td className="px-6 py-4 text-foreground font-semibold">{summary.fee_type}</td>
                          <td className="px-6 py-4 text-foreground">₹{summary.total_amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-green-600 font-semibold">₹{summary.paid.toLocaleString()}</td>
                          <td className="px-6 py-4 text-orange-600 font-semibold">₹{summary.balance.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center">
                            {summary.balance === 0 ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3" />
                                PAID
                              </span>
                            ) : summary.balance < summary.total_amount ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                                <Clock className="w-3 h-3" />
                                PARTIAL
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                                <AlertCircle className="w-3 h-3" />
                                PENDING
                              </span>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Payment Entry Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-strong rounded-2xl shadow-soft p-6 border border-border"
              >
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-accent" />
                  Record Payment
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Fee Type <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={feeType}
                      onChange={(e) => setFeeType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-input bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      {availableFeeTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Amount <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Payment Mode <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-input bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      {paymentModes.map(mode => (
                        <option key={mode} value={mode}>{mode}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Payment Date <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Receipt Number
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        value={receiptNo}
                        readOnly
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-secondary cursor-not-allowed transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Remarks (Optional)
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows={3}
                      placeholder="Add any notes or comments..."
                      className="w-full px-4 py-3 rounded-xl border border-input bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRecordPayment}
                      disabled={loading}
                      className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                        loading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'gradient-primary shadow-glow hover:shadow-float'
                      }`}
                      style={!loading ? {
                        background: 'linear-gradient(135deg, #1E88E5 0%, #5B9FFF 100%)'
                      } : undefined}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Record Payment
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetForm}
                      className="px-6 py-3 border border-border rounded-xl text-foreground hover:bg-white font-semibold transition-colors"
                    >
                      Reset
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transaction History */}
        <AnimatePresence>
          {selectedStudent && payments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3 }}
              className="mt-6 glass-strong rounded-2xl shadow-soft overflow-hidden border border-border relative z-10"
            >
              <div className="p-6 bg-gradient-to-r from-accent/5 to-primary/5 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Award className="w-6 h-6 text-accent" />
                    Transaction History
                  </h3>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white border border-border rounded-lg text-foreground hover:bg-secondary transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Transaction Filters */}
              <div className="p-6 bg-secondary/30 border-b border-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Month</label>
                    <select
                      value={historyFilterMonth}
                      onChange={(e) => setHistoryFilterMonth(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                    >
                      <option value="all">All Months</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>{new Date(2025, i).toLocaleString('default', { month: 'long' })}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Fee Type</label>
                    <select
                      value={historyFilterFeeType}
                      onChange={(e) => setHistoryFilterFeeType(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                    >
                      <option value="all">All Types</option>
                      {availableFeeTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Payment Mode</label>
                    <select
                      value={historyFilterPaymentMode}
                      onChange={(e) => setHistoryFilterPaymentMode(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                    >
                      <option value="all">All Modes</option>
                      {paymentModes.map(mode => (
                        <option key={mode} value={mode}>{mode}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Transaction List */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#1E88E5] to-[#5B9FFF] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Receipt No</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Fee Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Mode</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredPayments.map((payment, index) => (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-secondary/50 transition-all"
                      >
                        <td className="px-6 py-4 text-foreground font-mono text-sm font-semibold">
                          {payment.receipt_no}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(payment.payment_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 text-foreground font-medium">{payment.fee_type}</td>
                        <td className="px-6 py-4 text-primary font-bold text-lg">
                          ₹{payment.amount_paid.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {payment.payment_mode}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowReceipt(true);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            View Receipt
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Receipt Modal */}
        <AnimatePresence>
          {showReceipt && selectedPayment && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-border px-6 py-4 rounded-t-2xl z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Receipt className="w-6 h-6 text-primary" />
                      Payment Receipt
                    </h3>
                    <button
                      onClick={() => {
                        setShowReceipt(false);
                        setSelectedPayment(null);
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-8" id="receipt-content">
                  {/* School Header */}
                  <div className="text-center mb-8 pb-6 border-b-2 border-primary">
                    <h2 className="text-3xl font-bold text-primary mb-2">Your School Name</h2>
                    <p className="text-muted-foreground">Fee Payment Receipt</p>
                  </div>

                  {/* Receipt Details */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Receipt Number</p>
                      <p className="text-lg font-bold text-foreground font-mono">{selectedPayment.receipt_no}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Date</p>
                      <p className="text-lg font-semibold text-foreground">
                        {new Date(selectedPayment.payment_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Student Name</p>
                      <p className="text-lg font-semibold text-foreground">{selectedStudent?.student_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Class</p>
                      <p className="text-lg font-semibold text-foreground">{selectedStudent?.class_name}</p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 mb-8 border border-primary/20">
                    <h4 className="font-bold text-foreground mb-4">Payment Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fee Type:</span>
                        <span className="font-semibold text-foreground">{selectedPayment.fee_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Mode:</span>
                        <span className="font-semibold text-foreground">{selectedPayment.payment_mode}</span>
                      </div>
                      {selectedPayment.remarks && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Remarks:</span>
                          <span className="font-semibold text-foreground">{selectedPayment.remarks}</span>
                        </div>
                      )}
                      <div className="pt-3 border-t border-border flex justify-between items-center">
                        <span className="text-lg font-bold text-foreground">Amount Paid:</span>
                        <span className="text-2xl font-bold text-primary">
                          ₹{selectedPayment.amount_paid.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center text-sm text-muted-foreground border-t border-border pt-6">
                    <p>This is a computer-generated receipt and does not require a signature.</p>
                    <p className="mt-2">For queries, contact: accounts@school.com | +91 1234567890</p>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-secondary px-6 py-4 border-t border-border rounded-b-2xl flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.print()}
                    className="px-6 py-3 gradient-primary text-white rounded-xl font-semibold shadow-glow hover:shadow-float transition-all flex items-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #1E88E5 0%, #5B9FFF 100%)'
                    }}
                  >
                    <Printer className="w-5 h-5" />
                    Print Receipt
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FeePaymentManagement;
