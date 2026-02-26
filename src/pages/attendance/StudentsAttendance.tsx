// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { useAuth } from '../../context/AuthContext'
// import {
//     UsersIcon,
//     PlusIcon,
//     CalendarIcon,
//     CheckCircleIcon,
//     XCircleIcon,
//     Clock3Icon,
//     TrendingUpIcon,
//     TrendingDownIcon,
//     FilterIcon,
//     DownloadIcon,
//     RefreshCwIcon,
//     SearchIcon,
//     EyeIcon,
//     MoreHorizontalIcon,
//     UserCheckIcon,
//     AlertTriangleIcon,
//     BookOpenIcon,
//     PieChartIcon,
//     BarChart3Icon,
//     ChevronDownIcon,
//     ChevronRightIcon,
//     ArrowRightIcon,
//     MapPinIcon
// } from 'lucide-react'
// import {
//     LineChart,
//     Line,
//     AreaChart,
//     Area,
//     BarChart,
//     Bar,
//     PieChart,
//     Pie,
//     Cell,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     ResponsiveContainer,
//     Legend
// } from 'recharts'

// interface StatCard {
//     id: string
//     name: string
//     value: string
//     icon: any
//     color: string
//     bgColor: string
//     description?: string
//     trend?: string
//     trendDirection?: 'up' | 'down'
// }

// interface AttendanceRecord {
//     id: number
//     studentId: string
//     studentName: string
//     rollNumber: string
//     class: string
//     section: string
//     date: string
//     status: 'present' | 'absent' | 'late' | 'excused'
//     timeIn?: string
//     timeOut?: string
//     reason?: string
//     markedBy: string
// }

// interface ClassSummary {
//     id: string
//     className: string
//     section: string
//     totalStudents: number
//     present: number
//     absent: number
//     late: number
//     excused: number
//     attendanceRate: number
// }

// interface AttendanceTrend {
//     date: string
//     present: number
//     absent: number
//     late: number
//     excused: number
//     total: number
//     attendanceRate: number
// }

// export const StudentsAttendance = () => {
//     const [currentDate, setCurrentDate] = useState(new Date())
//     const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
//     const [selectedClass, setSelectedClass] = useState('all')
//     const [selectedStatus, setSelectedStatus] = useState('all')
//     const [searchTerm, setSearchTerm] = useState('')
//     const [refreshing, setRefreshing] = useState(false)
//     const [expandedClass, setExpandedClass] = useState<string | null>(null)
//     const navigate=useNavigate();

//     useEffect(() => {
//         const timer = setInterval(() => setCurrentDate(new Date()), 60000)
//         return () => clearInterval(timer)
//     }, [])

//     const attendanceStats: StatCard[] = [
//         {
//             id: 'total-present',
//             name: 'Present Today',
//             value: '1,089',
//             icon: CheckCircleIcon,
//             bgColor: 'bg-green-500',
//             description: '87.3% of total students',
//             trend: '+2.4%',
//             trendDirection: 'up',
//             color: 'bg-green'
//         },
//         {
//             id: 'total-absent',
//             name: 'Absent Today',
//             value: '128',
//             icon: XCircleIcon,
//             bgColor: 'bg-red-500',
//             description: '10.3% of total students',
//             trend: '-1.2%',
//             trendDirection: 'down',
//             color: 'bg-red'
//         },
//         {
//             id: 'late-arrivals',
//             name: 'Late Arrivals',
//             value: '23',
//             icon: Clock3Icon,
//             bgColor: 'bg-yellow-500',
//             description: '1.8% of total students',
//             trend: '+0.3%',
//             trendDirection: 'up',
//             color: 'bg-yellow'
//         },
//         {
//             id: 'excused-absences',
//             name: 'Excused Absences',
//             value: '7',
//             icon: AlertTriangleIcon,
//             bgColor: 'bg-[#1E88E5]',
//             description: '0.6% of total students',
//             trend: '-0.1%',
//             trendDirection: 'down',
//             color: 'bg-blue'
//         },
//     ]

//     const attendanceTrendsData: AttendanceTrend[] = [
//         { date: 'Oct 14', present: 1095, absent: 142, late: 28, excused: 5, total: 1270, attendanceRate: 86.2 },
//         { date: 'Oct 15', present: 1102, absent: 138, late: 25, excused: 5, total: 1270, attendanceRate: 86.8 },
//         { date: 'Oct 16', present: 1087, absent: 145, late: 32, excused: 6, total: 1270, attendanceRate: 85.6 },
//         { date: 'Oct 17', present: 1108, absent: 135, late: 22, excused: 5, total: 1270, attendanceRate: 87.2 },
//         { date: 'Oct 18', present: 1115, absent: 130, late: 20, excused: 5, total: 1270, attendanceRate: 87.8 },
//         { date: 'Oct 19', present: 1098, absent: 139, late: 27, excused: 6, total: 1270, attendanceRate: 86.4 },
//         { date: 'Oct 20', present: 1089, absent: 128, late: 23, excused: 7, total: 1247, attendanceRate: 87.3 }
//     ]

//     const attendanceDistributionData = [
//         { name: 'Present', value: 1089, fill: '#10B981', percentage: 87.3 },
//         { name: 'Absent', value: 128, fill: '#EF4444', percentage: 10.3 },
//         { name: 'Late', value: 23, fill: '#F59E0B', percentage: 1.8 },
//         { name: 'Excused', value: 7, fill: '#1E88E5', percentage: 0.6 }
//     ]

//     const classSummaries: ClassSummary[] = [
//         { id: 'grade-1-a', className: 'Grade 1', section: 'A', totalStudents: 32, present: 28, absent: 3, late: 1, excused: 0, attendanceRate: 87.5 },
//         { id: 'grade-2-b', className: 'Grade 2', section: 'B', totalStudents: 35, present: 32, absent: 2, late: 1, excused: 0, attendanceRate: 91.4 },
//         { id: 'grade-5-a', className: 'Grade 5', section: 'A', totalStudents: 38, present: 34, absent: 3, late: 0, excused: 1, attendanceRate: 89.5 },
//         { id: 'grade-8-c', className: 'Grade 8', section: 'C', totalStudents: 42, present: 38, absent: 2, late: 2, excused: 0, attendanceRate: 90.5 },
//         { id: 'grade-10-a', className: 'Grade 10', section: 'A', totalStudents: 45, present: 41, absent: 3, late: 1, excused: 0, attendanceRate: 91.1 },
//     ]

//     const recentAttendanceRecords: AttendanceRecord[] = [
//         { id: 1, studentId: 'STU001', studentName: 'Arjun Sharma', rollNumber: '2024001', class: 'Grade 10', section: 'A', date: '2025-10-20', status: 'present', timeIn: '08:15 AM', markedBy: 'Mrs. Priya Sharma' },
//         { id: 2, studentId: 'STU002', studentName: 'Priya Patel', rollNumber: '2024002', class: 'Grade 9', section: 'B', date: '2025-10-20', status: 'late', timeIn: '08:45 AM', reason: 'Traffic jam', markedBy: 'Mr. Rajesh Kumar' },
//         { id: 3, studentId: 'STU003', studentName: 'Ravi Singh', rollNumber: '2024003', class: 'Grade 8', section: 'C', date: '2025-10-20', status: 'absent', reason: 'Sick', markedBy: 'Mrs. Anita Gupta' },
//         { id: 4, studentId: 'STU004', studentName: 'Sneha Joshi', rollNumber: '2024004', class: 'Grade 7', section: 'A', date: '2025-10-20', status: 'present', timeIn: '08:05 AM', markedBy: 'Mr. Suresh Yadav' },
//         { id: 5, studentId: 'STU005', studentName: 'Amit Verma', rollNumber: '2024005', class: 'Grade 6', section: 'B', date: '2025-10-20', status: 'excused', reason: 'Family emergency', markedBy: 'Mrs. Kavita Singh' },
//     ]

//     const handleRefresh = async () => {
//         setRefreshing(true)
//         await new Promise(resolve => setTimeout(resolve, 1500))
//         setRefreshing(false)
//     }

//     const getStatusColor = (status: string) => {
//         switch (status) {
//             case 'present': return 'bg-green-50 text-green-700 border-green-200'
//             case 'absent': return 'bg-red-50 text-red-700 border-red-200'
//             case 'late': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
//             case 'excused': return 'bg-[#1E88E5]/10 text-[#1E88E5] border-[#1E88E5]/20'
//             default: return 'bg-gray-50 text-gray-700 border-gray-200'
//         }
//     }

//     const getStatusIcon = (status: string) => {
//         switch (status) {
//             case 'present': return <CheckCircleIcon className="w-4 h-4 text-green-500" />
//             case 'absent': return <XCircleIcon className="w-4 h-4 text-red-500" />
//             case 'late': return <Clock3Icon className="w-4 h-4 text-yellow-500" />
//             case 'excused': return <AlertTriangleIcon className="w-4 h-4 text-[#1E88E5]" />
//             default: return <Clock3Icon className="w-4 h-4 text-gray-500" />
//         }
//     }

//     const getAttendanceRateColor = (rate: number) => {
//         if (rate >= 95) return 'text-green-600'
//         if (rate >= 85) return 'text-yellow-600'
//         return 'text-red-600'
//     }

//     const CustomTooltip = ({ active, payload, label }: any) => {
//         if (active && payload && payload.length) {
//             return (
//                 <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
//                     <p className="text-sm font-semibold text-gray-900">{`Date: ${label}`}</p>
//                     {payload.map((entry: any, index: number) => (
//                         <p key={index} className="text-sm" style={{ color: entry.color }}>
//                             {`${entry.dataKey}: ${entry.value}`}
//                         </p>
//                     ))}
//                 </div>
//             )
//         }
//         return null
//     }

//     const CustomPieTooltip = ({ active, payload }: any) => {
//         if (active && payload && payload.length) {
//             const data = payload[0].payload
//             return (
//                 <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
//                     <p className="text-sm font-semibold text-gray-900">{data.name}</p>
//                     <p className="text-sm text-gray-600">{`Students: ${data.value}`}</p>
//                     <p className="text-sm text-gray-600">{`Percentage: ${data.percentage}%`}</p>
//                 </div>
//             )
//         }
//         return null
//     }

//     return (
//         <div className="min-h-screen bg-[#F6F9FC] p-3">
//             <div className="max-w-[1600px] mx-auto space-y-8">
//                 {/* Page Header */}
                
//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
//                         <div>
//                             <h1 className="text-2xl font-semibold text-gray-900">Student Attendance</h1>
//                             <p className="text-sm text-gray-600 mt-1">
//                                 Monitor and manage daily student attendance across all classes
//                             </p>
//                         </div>
//                         <div className="flex items-center gap-3">
                            
//                             <motion.button
//                                 whileHover={{ scale: 1.02 }}
//                                 whileTap={{ scale: 0.98 }}
//                                 onClick={handleRefresh}
//                                 disabled={refreshing}
//                                 className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm font-medium transition-all duration-200"
//                             >
//                                 <RefreshCwIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
//                                 Refresh
//                             </motion.button>
//                             <motion.button
//                                 whileHover={{ scale: 1.02 }}
//                                 whileTap={{ scale: 0.98 }}
//                                 onClick={() => navigate('/mark/attendance/student')}
//                                 className="px-6 py-2.5 gradient-primary text-white rounded-xl shadow-glow hover:shadow-float flex items-center gap-2 text-sm font-medium transition-all duration-300"
//                             >
//                                 <PlusIcon className='w-4 h-4' />
//                                 Mark Attendance
//                             </motion.button>
//                         </div>
//                     </div>
                

//                 {/* Stats Grid */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.1 }}
//                     className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
//                 >
//                     {attendanceStats.map((stat) => (
//                         <div
//                             key={stat.id}
//                             className="relative bg-white rounded-[20px] shadow-soft border border-gray-100 p-6 hover:shadow-float hover:-translate-y-1 transition-all duration-300"
//                         >
//                             <div className="absolute top-6 right-6 opacity-5 text-gray-300">
//                                 <stat.icon className="w-12 h-12" />
//                             </div>

//                             <div className="flex items-start justify-between relative z-10">
//                                 <div className="flex-1 pr-4">
//                                     <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
//                                         {stat.name}
//                                     </p>

//                                     <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>

//                                     {stat.description && (
//                                         <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
//                                     )}

//                                     {stat.trend && (
//                                         <div className="flex items-center mt-3">
//                                             {stat.trendDirection === 'up' ? (
//                                                 <TrendingUpIcon className="w-3 h-3 text-green-500 mr-1" />
//                                             ) : (
//                                                 <TrendingDownIcon className="w-3 h-3 text-red-500 mr-1" />
//                                             )}
//                                             <span className={`text-xs font-medium ${
//                                                 stat.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
//                                             }`}>
//                                                 {stat.trend} vs yesterday
//                                             </span>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             <div
//                                 className={`absolute -top-3 -right-3 ${stat.bgColor} p-4 rounded-[16px] shadow-lg flex items-center justify-center transition-transform duration-300 hover:scale-110 z-20`}
//                             >
//                                 <stat.icon className="w-7 h-7 text-white" />
//                             </div>
//                         </div>
//                     ))}
//                 </motion.div>

//                 {/* Charts Section */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.2 }}
//                     className="grid grid-cols-1 lg:grid-cols-2 gap-6"
//                 >
//                     {/* Attendance Trends Chart */}
//                     <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden">
//                         <div className="p-6 border-b border-gray-100">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <h2 className="text-lg font-semibold text-gray-900">7-Day Attendance Trends</h2>
//                                     <p className="text-sm text-gray-600 mt-1">Daily attendance patterns over the last week</p>
//                                 </div>
//                                 <button className="w-10 h-10 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center">
//                                     <MoreHorizontalIcon className="w-4 h-4 text-gray-500" />
//                                 </button>
//                             </div>
//                         </div>
//                         <div className="p-6">
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <AreaChart data={attendanceTrendsData}>
//                                     <defs>
//                                         <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
//                                             <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
//                                             <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
//                                         </linearGradient>
//                                         <linearGradient id="absentGradient" x1="0" y1="0" x2="0" y2="1">
//                                             <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
//                                             <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05}/>
//                                         </linearGradient>
//                                     </defs>
//                                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                                     <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} />
//                                     <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} />
//                                     <Tooltip content={<CustomTooltip />} />
//                                     <Legend />
//                                     <Area type="monotone" dataKey="present" stroke="#10B981" fill="url(#presentGradient)" strokeWidth={2} name="Present" />
//                                     <Area type="monotone" dataKey="absent" stroke="#EF4444" fill="url(#absentGradient)" strokeWidth={2} name="Absent" />
//                                 </AreaChart>
//                             </ResponsiveContainer>
//                         </div>
//                     </div>

//                     {/* Distribution Pie Chart */}
//                     <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden">
//                         <div className="p-6 border-b border-gray-100">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <h2 className="text-lg font-semibold text-gray-900">Today's Distribution</h2>
//                                     <p className="text-sm text-gray-600 mt-1">Breakdown of attendance status for {selectedDate}</p>
//                                 </div>
//                                 <button className="w-10 h-10 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center">
//                                     <PieChartIcon className="w-4 h-4 text-gray-500" />
//                                 </button>
//                             </div>
//                         </div>
//                         <div className="p-6">
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <PieChart>
//                                     <Pie
//                                         data={attendanceDistributionData}
//                                         cx="50%"
//                                         cy="50%"
//                                         labelLine={false}
//                                         label={({ name, percentage }) => `${name}: ${percentage}%`}
//                                         outerRadius={80}
//                                         fill="#8884d8"
//                                         dataKey="value"
//                                         stroke="white"
//                                         strokeWidth={2}
//                                     >
//                                         {attendanceDistributionData.map((entry, index) => (
//                                             <Cell key={`cell-${index}`} fill={entry.fill} />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip content={<CustomPieTooltip />} />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </div>
//                     </div>
//                 </motion.div>

//                 {/* Class-wise Attendance */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.3 }}
//                     className="bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden"
//                 >
//                     <div className="p-6 border-b border-gray-100">
//                         <div className="flex items-center justify-between">
//                             <h2 className="text-lg font-semibold text-gray-900">Class-wise Attendance</h2>
//                             <div className="flex items-center gap-3">
//                                 <select
//                                     value={selectedClass}
//                                     onChange={(e) => setSelectedClass(e.target.value)}
//                                     className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
//                                 >
//                                     <option value="all">All Classes</option>
//                                     <option value="grade-1">Grade 1</option>
//                                     <option value="grade-2">Grade 2</option>
//                                 </select>
//                                 <button className="w-10 h-10 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center">
//                                     <DownloadIcon className="w-4 h-4 text-gray-500" />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="p-6">
//                         <div className="space-y-3">
//                             {classSummaries.map((classData) => (
//                                 <div key={classData.id} className="border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
//                                     <div 
//                                         className="p-4 cursor-pointer"
//                                         onClick={() => setExpandedClass(expandedClass === classData.id ? null : classData.id)}
//                                     >
//                                         <div className="flex items-center justify-between">
//                                             <div className="flex items-center gap-4">
//                                                 <div className="w-10 h-10 bg-[#1E88E5]/10 rounded-lg flex items-center justify-center">
//                                                     <BookOpenIcon className="w-5 h-5 text-[#1E88E5]" />
//                                                 </div>
//                                                 <div>
//                                                     <h3 className="font-semibold text-gray-900">{classData.className} - Section {classData.section}</h3>
//                                                     <p className="text-sm text-gray-600">{classData.totalStudents} total students</p>
//                                                 </div>
//                                             </div>
                                            
//                                             <div className="flex items-center gap-6">
//                                                 <div className="flex items-center gap-4 text-sm">
//                                                     <div className="text-center">
//                                                         <div className="font-semibold text-green-600">{classData.present}</div>
//                                                         <div className="text-gray-500 text-xs">Present</div>
//                                                     </div>
//                                                     <div className="text-center">
//                                                         <div className="font-semibold text-red-600">{classData.absent}</div>
//                                                         <div className="text-gray-500 text-xs">Absent</div>
//                                                     </div>
//                                                 </div>
                                                
//                                                 <div className="text-right">
//                                                     <div className={`text-lg font-bold ${getAttendanceRateColor(classData.attendanceRate)}`}>
//                                                         {classData.attendanceRate}%
//                                                     </div>
//                                                     <div className="text-sm text-gray-500">Rate</div>
//                                                 </div>
                                                
//                                                 {expandedClass === classData.id ? (
//                                                     <ChevronDownIcon className="w-5 h-5 text-gray-400" />
//                                                 ) : (
//                                                     <ChevronRightIcon className="w-5 h-5 text-gray-400" />
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </motion.div>

//                 {/* Recent Records */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.4 }}
//                     className="bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden"
//                 >
//                     <div className="p-6 border-b border-gray-100">
//                         <div className="flex items-center justify-between">
//                             <h2 className="text-lg font-semibold text-gray-900">Recent Attendance Records</h2>
//                             <div className="flex items-center gap-2">
//                                 <div className="relative">
//                                     <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//                                     <input
//                                         type="text"
//                                         placeholder="Search..."
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                         className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="max-h-96 overflow-y-auto">
//                         <div className="divide-y divide-gray-100">
//                             {recentAttendanceRecords.map((record) => (
//                                 <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
//                                     <div className="flex items-start gap-4">
//                                         <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                                             <UserCheckIcon className="w-5 h-5 text-gray-600" />
//                                         </div>
//                                         <div className="flex-1 min-w-0">
//                                             <div className="flex items-center justify-between">
//                                                 <h3 className="text-sm font-semibold text-gray-900">{record.studentName}</h3>
//                                                 <span className={`text-xs px-3 py-1 rounded-lg border font-semibold ${getStatusColor(record.status)}`}>
//                                                     {record.status.toUpperCase()}
//                                                 </span>
//                                             </div>
//                                             <div className="mt-1 space-y-1">
//                                                 <p className="text-sm text-gray-600">Roll: {record.rollNumber} • {record.class}-{record.section}</p>
//                                                 {record.timeIn && <p className="text-xs text-gray-500">Time In: {record.timeIn}</p>}
//                                                 {record.reason && <p className="text-xs text-gray-500">Reason: {record.reason}</p>}
//                                             </div>
//                                             <div className="flex items-center justify-between mt-3">
//                                                 <span className="text-xs text-gray-500">Marked by {record.markedBy}</span>
//                                                 <button className="text-xs text-[#1E88E5] hover:text-[#1976D2] font-medium flex items-center">
//                                                     View details
//                                                     <EyeIcon className="w-3 h-3 ml-1" />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>
//         </div>
//     )
// }

// export default StudentsAttendance
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
    UsersIcon,
    PlusIcon,
    CalendarIcon,
    CheckCircleIcon,
    XCircleIcon,
    Clock3Icon,
    TrendingUpIcon,
    TrendingDownIcon,
    FilterIcon,
    DownloadIcon,
    RefreshCwIcon,
    SearchIcon,
    EyeIcon,
    MoreHorizontalIcon,
    UserCheckIcon,
    AlertTriangleIcon,
    BookOpenIcon,
    PieChartIcon,
    BarChart3Icon,
    ChevronDownIcon,
    ChevronRightIcon,
    ArrowRightIcon,
    MapPinIcon,
    ArrowUp,
    ArrowDown
} from 'lucide-react'
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts'


interface StatCard {
    id: string
    name: string
    value: string
    icon: any
    color: string
    bgColor: string
    description?: string
    change?: number
}


interface AttendanceRecord {
    id: number
    studentId: string
    studentName: string
    rollNumber: string
    class: string
    section: string
    date: string
    status: 'present' | 'absent' | 'late' | 'excused'
    timeIn?: string
    timeOut?: string
    reason?: string
    markedBy: string
}


interface ClassSummary {
    id: string
    className: string
    section: string
    totalStudents: number
    present: number
    absent: number
    late: number
    excused: number
    attendanceRate: number
}


interface AttendanceTrend {
    date: string
    present: number
    absent: number
    late: number
    excused: number
    total: number
    attendanceRate: number
}

// Metric Card Component matching Admin Dashboard style
const AttendanceMetricCard = ({ stat, delay }: { stat: StatCard; delay: number }) => {
    const Icon = stat.icon;
    const isPositive = stat.change && stat.change > 0;
    const isNegative = stat.change && stat.change < 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="bg-white rounded-[20px] p-7 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
        >
            {/* Icon and Change Badge */}
            <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 rounded-[16px] bg-blue-50 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-blue-500" />
                </div>

                {stat.change !== undefined && (
                    <div
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold ${
                            isPositive
                                ? 'bg-emerald-50 text-emerald-600'
                                : isNegative
                                ? 'bg-red-50 text-red-600'
                                : 'bg-gray-50 text-gray-600'
                        }`}
                        style={{ fontSize: '13px' }}
                    >
                        {isPositive ? (
                            <ArrowUp className="w-3.5 h-3.5" />
                        ) : isNegative ? (
                            <ArrowDown className="w-3.5 h-3.5" />
                        ) : null}
                        <span>{Math.abs(stat.change)}%</span>
                    </div>
                )}
            </div>

            {/* Value */}
            <div
                className="text-gray-900 mb-2 leading-none"
                style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
            >
                {stat.value}
            </div>

            {/* Title */}
            <div className="text-gray-600" style={{ fontSize: '15px', fontWeight: 500 }}>
                {stat.name}
            </div>
        </motion.div>
    );
};


export const StudentsAttendance = () => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [selectedClass, setSelectedClass] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const [expandedClass, setExpandedClass] = useState<string | null>(null)
    const navigate = useNavigate();


    useEffect(() => {
        const timer = setInterval(() => setCurrentDate(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])


    const attendanceStats: StatCard[] = [
        {
            id: 'total-present',
            name: 'Present Today',
            value: '1,089',
            icon: CheckCircleIcon,
            bgColor: 'bg-emerald-500',
            description: '87.3% of total students',
            change: 12,
            color: 'bg-green'
        },
        {
            id: 'total-absent',
            name: 'Absent Today',
            value: '128',
            icon: XCircleIcon,
            bgColor: 'bg-red-500',
            description: '10.3% of total students',
            change: -2,
            color: 'bg-red'
        },
        {
            id: 'late-arrivals',
            name: 'Late Arrivals',
            value: '23',
            icon: Clock3Icon,
            bgColor: 'bg-amber-500',
            description: '1.8% of total students',
            change: 5,
            color: 'bg-yellow'
        },
        {
            id: 'excused-absences',
            name: 'Excused Absences',
            value: '7',
            icon: AlertTriangleIcon,
            bgColor: 'bg-blue-500',
            description: '0.6% of total students',
            change: 8,
            color: 'bg-blue'
        },
    ]


    const attendanceTrendsData: AttendanceTrend[] = [
        { date: 'Oct 14', present: 1095, absent: 142, late: 28, excused: 5, total: 1270, attendanceRate: 86.2 },
        { date: 'Oct 15', present: 1102, absent: 138, late: 25, excused: 5, total: 1270, attendanceRate: 86.8 },
        { date: 'Oct 16', present: 1087, absent: 145, late: 32, excused: 6, total: 1270, attendanceRate: 85.6 },
        { date: 'Oct 17', present: 1108, absent: 135, late: 22, excused: 5, total: 1270, attendanceRate: 87.2 },
        { date: 'Oct 18', present: 1115, absent: 130, late: 20, excused: 5, total: 1270, attendanceRate: 87.8 },
        { date: 'Oct 19', present: 1098, absent: 139, late: 27, excused: 6, total: 1270, attendanceRate: 86.4 },
    ]


    const attendanceDistributionData = [
        { name: 'Excellent', value: 35, fill: '#3B82F6', percentage: 35 },
        { name: 'Good', value: 40, fill: '#60A5FA', percentage: 40 },
        { name: 'Average', value: 20, fill: '#93C5FD', percentage: 20 },
        { name: 'Needs Improvement', value: 5, fill: '#DBEAFE', percentage: 5 }
    ]


    const classSummaries: ClassSummary[] = [
        { id: 'grade-1-a', className: 'Grade 1', section: 'A', totalStudents: 32, present: 28, absent: 3, late: 1, excused: 0, attendanceRate: 87.5 },
        { id: 'grade-2-b', className: 'Grade 2', section: 'B', totalStudents: 35, present: 32, absent: 2, late: 1, excused: 0, attendanceRate: 91.4 },
        { id: 'grade-5-a', className: 'Grade 5', section: 'A', totalStudents: 38, present: 34, absent: 3, late: 0, excused: 1, attendanceRate: 89.5 },
        { id: 'grade-8-c', className: 'Grade 8', section: 'C', totalStudents: 42, present: 38, absent: 2, late: 2, excused: 0, attendanceRate: 90.5 },
        { id: 'grade-10-a', className: 'Grade 10', section: 'A', totalStudents: 45, present: 41, absent: 3, late: 1, excused: 0, attendanceRate: 91.1 },
    ]

    const recentAttendanceRecords: AttendanceRecord[] = [
        { id: 1, studentId: 'STU001', studentName: 'Arjun Sharma', rollNumber: '2024001', class: 'Grade 10', section: 'A', date: '2025-10-20', status: 'present', timeIn: '08:15 AM', markedBy: 'Mrs. Priya Sharma' },
        { id: 2, studentId: 'STU002', studentName: 'Priya Patel', rollNumber: '2024002', class: 'Grade 9', section: 'B', date: '2025-10-20', status: 'late', timeIn: '08:45 AM', reason: 'Traffic jam', markedBy: 'Mr. Rajesh Kumar' },
        { id: 3, studentId: 'STU003', studentName: 'Ravi Singh', rollNumber: '2024003', class: 'Grade 8', section: 'C', date: '2025-10-20', status: 'absent', reason: 'Sick', markedBy: 'Mrs. Anita Gupta' },
        { id: 4, studentId: 'STU004', studentName: 'Sneha Joshi', rollNumber: '2024004', class: 'Grade 7', section: 'A', date: '2025-10-20', status: 'present', timeIn: '08:05 AM', markedBy: 'Mr. Suresh Yadav' },
        { id: 5, studentId: 'STU005', studentName: 'Amit Verma', rollNumber: '2024005', class: 'Grade 6', section: 'B', date: '2025-10-20', status: 'excused', reason: 'Family emergency', markedBy: 'Mrs. Kavita Singh' },
    ]


    const handleRefresh = async () => {
        setRefreshing(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setRefreshing(false)
    }


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
            case 'absent': return 'bg-red-50 text-red-700 border-red-200'
            case 'late': return 'bg-amber-50 text-amber-700 border-amber-200'
            case 'excused': return 'bg-blue-50 text-blue-700 border-blue-200'
            default: return 'bg-gray-50 text-gray-700 border-gray-200'
        }
    }


    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'present': return <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
            case 'absent': return <XCircleIcon className="w-4 h-4 text-red-500" />
            case 'late': return <Clock3Icon className="w-4 h-4 text-amber-500" />
            case 'excused': return <AlertTriangleIcon className="w-4 h-4 text-blue-500" />
            default: return <Clock3Icon className="w-4 h-4 text-gray-500" />
        }
    }


    const getAttendanceRateColor = (rate: number) => {
        if (rate >= 95) return 'text-emerald-600'
        if (rate >= 85) return 'text-amber-600'
        return 'text-red-600'
    }


    return (
        <div className="min-h-screen bg-[#F6F9FC] p-3">
            <div className="max-w-[1600px] mx-auto space-y-7">
                {/* Hero Header - Match Admin Dashboard style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 
                            className="text-gray-900"
                            style={{ 
                                fontSize: '32px', 
                                fontWeight: 600,
                                letterSpacing: '-0.02em',
                                lineHeight: 1.2
                            }}
                        >
                            Student Attendance
                        </h1>
                        <p 
                            className="text-gray-600 mt-2" 
                            style={{ fontSize: '15px', fontWeight: 400 }}
                        >
                            Monitor and manage daily student attendance across all classes
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl flex items-center gap-2 font-medium border border-gray-200 shadow-sm transition-all duration-200"
                        >
                            <RefreshCwIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/mark/attendance/student')}
                            className="px-5 py-2.5 gradient-primary text-white rounded-xl flex items-center gap-2 font-medium shadow-soft transition-all duration-200"
                        >
                            <PlusIcon className='w-5 h-5' />
                            Mark Attendance
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl flex items-center gap-2 font-medium border border-gray-200 shadow-sm transition-all duration-200"
                        >
                            <CalendarIcon className="w-5 h-5" />
                            Schedule Class
                        </motion.button>
                    </div>
                </motion.div>


                {/* Stats Grid - Match Admin Dashboard style */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {attendanceStats.map((stat, index) => (
                        <AttendanceMetricCard key={stat.id} stat={stat} delay={0.1 + index * 0.1} />
                    ))}
                </div>


                {/* Charts Section - Match Admin Dashboard style */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Attendance Trends Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="lg:col-span-2 bg-white rounded-[20px] p-7 shadow-soft border border-gray-100"
                    >
                        <h3 
                            className="mb-6 text-gray-900"
                            style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em' }}
                        >
                            6-Day Attendance Trends
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={attendanceTrendsData}>
                                <defs>
                                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#9CA3AF"
                                    tick={{ fill: '#6B7280', fontSize: 13 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke="#9CA3AF"
                                    tick={{ fill: '#6B7280', fontSize: 13 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        fontSize: '14px',
                                    }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }} />
                                <Area
                                    type="monotone"
                                    dataKey="present"
                                    stroke="#3B82F6"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#colorPresent)"
                                    name="Present"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="absent"
                                    stroke="#60A5FA"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#colorAbsent)"
                                    name="Absent"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Distribution Pie Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="bg-white rounded-[20px] p-7 shadow-soft border border-gray-100"
                    >
                        <h3 
                            className="mb-6 text-gray-900"
                            style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em' }}
                        >
                            Performance
                        </h3>
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie
                                    data={attendanceDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {attendanceDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        fontSize: '14px',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-5 space-y-3">
                            {attendanceDistributionData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.fill }}
                                        ></div>
                                        <span className="text-gray-700" style={{ fontSize: '14px', fontWeight: 500 }}>
                                            {item.name}
                                        </span>
                                    </div>
                                    <span className="text-gray-900" style={{ fontSize: '14px', fontWeight: 600 }}>
                                        {item.percentage}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>


                {/* Class-wise Attendance - Updated styling */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="bg-white rounded-[20px] p-7 shadow-soft border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 
                            className="text-gray-900"
                            style={{ fontSize: '18px', fontWeight: 600 }}
                        >
                            Class-wise Attendance
                        </h3>
                        <div className="flex items-center gap-3">
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                            >
                                <option value="all">All Classes</option>
                                <option value="grade-1">Grade 1</option>
                                <option value="grade-2">Grade 2</option>
                            </select>
                            <button className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors">
                                <DownloadIcon className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {classSummaries.map((classData, index) => (
                            <motion.div 
                                key={classData.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                                className="border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
                            >
                                <div 
                                    className="p-5 cursor-pointer"
                                    onClick={() => setExpandedClass(expandedClass === classData.id ? null : classData.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-50 rounded-[14px] flex items-center justify-center">
                                                <BookOpenIcon className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900" style={{ fontSize: '15px' }}>
                                                    {classData.className} - Section {classData.section}
                                                </h4>
                                                <p className="text-gray-600" style={{ fontSize: '14px', fontWeight: 400 }}>
                                                    {classData.totalStudents} total students
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-4" style={{ fontSize: '14px' }}>
                                                <div className="text-center">
                                                    <div className="font-semibold text-emerald-600" style={{ fontSize: '16px' }}>
                                                        {classData.present}
                                                    </div>
                                                    <div className="text-gray-500" style={{ fontSize: '12px' }}>Present</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-semibold text-red-600" style={{ fontSize: '16px' }}>
                                                        {classData.absent}
                                                    </div>
                                                    <div className="text-gray-500" style={{ fontSize: '12px' }}>Absent</div>
                                                </div>
                                            </div>
                                            
                                            <div className="text-right">
                                                <div className={`font-bold ${getAttendanceRateColor(classData.attendanceRate)}`} style={{ fontSize: '18px' }}>
                                                    {classData.attendanceRate}%
                                                </div>
                                                <div className="text-gray-500" style={{ fontSize: '13px' }}>Rate</div>
                                            </div>
                                            
                                            {expandedClass === classData.id ? (
                                                <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>


                {/* Recent Records - Updated styling */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="bg-white rounded-[20px] p-7 shadow-soft border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 
                            className="text-gray-900"
                            style={{ fontSize: '18px', fontWeight: 600 }}
                        >
                            Recent Attendance Records
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                                    style={{ fontSize: '14px' }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                        {recentAttendanceRecords.map((record, index) => (
                            <motion.div
                                key={record.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                                className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex-shrink-0 mt-1">
                                    {getStatusIcon(record.status)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-gray-900 font-semibold" style={{ fontSize: '15px' }}>
                                            {record.studentName}
                                        </h4>
                                        <span className={`text-xs px-3 py-1.5 rounded-lg border font-semibold ${getStatusColor(record.status)}`}>
                                            {record.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="mt-1 space-y-1">
                                        <p className="text-gray-600" style={{ fontSize: '14px', fontWeight: 400 }}>
                                            Roll: {record.rollNumber} • {record.class}-{record.section}
                                        </p>
                                        {record.timeIn && (
                                            <p className="text-gray-500" style={{ fontSize: '13px', fontWeight: 400 }}>
                                                Time In: {record.timeIn}
                                            </p>
                                        )}
                                        {record.reason && (
                                            <p className="text-gray-500" style={{ fontSize: '13px', fontWeight: 400 }}>
                                                Reason: {record.reason}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-gray-500" style={{ fontSize: '13px', fontWeight: 400 }}>
                                            Marked by {record.markedBy}
                                        </span>
                                        <button className="text-blue-500 hover:text-blue-600 font-medium flex items-center transition-colors" style={{ fontSize: '13px' }}>
                                            View details
                                            <EyeIcon className="w-3.5 h-3.5 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}


export default StudentsAttendance
