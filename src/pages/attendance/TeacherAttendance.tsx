// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   UsersIcon, CheckCircleIcon, XCircleIcon, Clock3Icon, AlertTriangleIcon, RefreshCwIcon, SearchIcon, PlusIcon, 
//   BarChart3Icon, PieChartIcon, EyeIcon, ChevronDownIcon, ChevronRightIcon, TrendingUpIcon, TrendingDownIcon,
//   BookOpenIcon, MoreHorizontalIcon
// } from 'lucide-react';
// import {
//   ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Tooltip, Legend, CartesianGrid, XAxis, YAxis
// } from 'recharts';
// import { useNavigate } from 'react-router-dom';

// interface StatCard {
//   id: string;
//   name: string;
//   value: number | string;
//   icon: any;
//   bgColor: string;
//   color: string;
//   description?: string;
//   trend?: number;
//   trendDirection?: 'up' | 'down';
// }

// interface AttendanceRecord {
//   id: number;
//   teacherId: string;
//   teacherName: string;
//   department: string;
//   date: string;
//   status: 'present' | 'absent' | 'late' | 'excused';
//   timeIn?: string;
//   timeOut?: string;
//   reason?: string;
//   markedBy: string;
// }

// interface DepartmentSummary {
//   id: string;
//   departmentName: string;
//   totalTeachers: number;
//   present: number;
//   absent: number;
//   late: number;
//   excused: number;
//   attendanceRate: number;
// }

// interface AttendanceTrend {
//   date: string;
//   present: number;
//   absent: number;
//   late: number;
//   excused: number;
//   attendanceRate: number;
// }

// const TeacherAttendance: React.FC = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [selectedDepartment, setSelectedDepartment] = useState('all');
//   const [selectedStatus, setSelectedStatus] = useState<'all' | 'present' | 'absent' | 'late' | 'excused'>('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [refreshing, setRefreshing] = useState(false);
//   const [expandedDepartment, setExpandedDepartment] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const attendanceStats: StatCard[] = [
//     {
//       id: 'total-present',
//       name: 'Present Today',
//       value: 75,
//       icon: CheckCircleIcon,
//       bgColor: 'bg-green-500',
//       color: 'text-white',
//       description: '75% of total teachers',
//       trend: 1.5,
//       trendDirection: 'up',
//     },
//     {
//       id: 'total-absent',
//       name: 'Absent Today',
//       value: 10,
//       icon: XCircleIcon,
//       bgColor: 'bg-red-500',
//       color: 'text-white',
//       description: '10% of total teachers',
//       trend: -0.5,
//       trendDirection: 'down',
//     },
//     {
//       id: 'late-arrivals',
//       name: 'Late Arrivals',
//       value: 5,
//       icon: Clock3Icon,
//       bgColor: 'bg-yellow-500',
//       color: 'text-white',
//       description: '5% of total teachers',
//       trend: 0.3,
//       trendDirection: 'up',
//     },
//     {
//       id: 'excused-absences',
//       name: 'Excused Absences',
//       value: 3,
//       icon: AlertTriangleIcon,
//       bgColor: 'bg-[#1E88E5]',
//       color: 'text-white',
//       description: '3% of total teachers',
//       trend: -0.1,
//       trendDirection: 'down',
//     },
//   ];

//   const departmentSummaries: DepartmentSummary[] = [
//     { id: 'dept-1', departmentName: 'Math Department', totalTeachers: 25, present: 20, absent: 3, late: 1, excused: 1, attendanceRate: 88 },
//     { id: 'dept-2', departmentName: 'Science Department', totalTeachers: 30, present: 28, absent: 1, late: 0, excused: 1, attendanceRate: 96 },
//     { id: 'dept-3', departmentName: 'English Department', totalTeachers: 20, present: 15, absent: 3, late: 2, excused: 0, attendanceRate: 75 },
//     { id: 'dept-4', departmentName: 'History Department', totalTeachers: 15, present: 10, absent: 2, late: 2, excused: 1, attendanceRate: 73 },
//   ];

//   const attendanceTrendsData: AttendanceTrend[] = [
//     { date: 'Oct 14', present: 80, absent: 10, late: 7, excused: 3, attendanceRate: 85 },
//     { date: 'Oct 15', present: 78, absent: 12, late: 6, excused: 4, attendanceRate: 84 },
//     { date: 'Oct 16', present: 82, absent: 8, late: 5, excused: 5, attendanceRate: 88 },
//     { date: 'Oct 17', present: 79, absent: 14, late: 6, excused: 1, attendanceRate: 83 },
//     { date: 'Oct 18', present: 85, absent: 9, late: 4, excused: 2, attendanceRate: 89 },
//     { date: 'Oct 19', present: 83, absent: 11, late: 2, excused: 4, attendanceRate: 86 },
//     { date: 'Oct 20', present: 75, absent: 10, late: 5, excused: 3, attendanceRate: 82 },
//   ];

//   const attendanceDistributionData = [
//     { name: 'Present', value: 75, fill: '#10B981', percentage: 75 },
//     { name: 'Absent', value: 10, fill: '#EF4444', percentage: 10 },
//     { name: 'Late', value: 5, fill: '#F59E0B', percentage: 5 },
//     { name: 'Excused', value: 3, fill: '#1E88E5', percentage: 3 },
//   ];

//   const recentAttendanceRecords: AttendanceRecord[] = [
//     { id: 1, teacherId: 'T001', teacherName: 'Mrs. Sarah Khan', department: 'Math Department', date: selectedDate, status: 'present', timeIn: '08:00 AM', markedBy: 'Admin' },
//     { id: 2, teacherId: 'T002', teacherName: 'Mr. John Lee', department: 'Science Department', date: selectedDate, status: 'late', timeIn: '08:30 AM', reason: 'Traffic', markedBy: 'Admin' },
//     { id: 3, teacherId: 'T003', teacherName: 'Ms. Anita Sharma', department: 'English Department', date: selectedDate, status: 'absent', reason: 'Sick', markedBy: 'Admin' },
//     { id: 4, teacherId: 'T004', teacherName: 'Mr. David Park', department: 'History Department', date: selectedDate, status: 'excused', reason: 'Family Emergency', markedBy: 'Admin' },
//   ];

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentDate(new Date()), 60000);
//     return () => clearInterval(timer);
//   }, []);

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     setRefreshing(false);
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'present': return 'bg-green-50 text-green-700 border-green-200';
//       case 'absent': return 'bg-red-50 text-red-700 border-red-200';
//       case 'late': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
//       case 'excused': return 'bg-[#1E88E5]/10 text-[#1E88E5] border-[#1E88E5]/20';
//       default: return 'bg-gray-50 text-gray-700 border-gray-200';
//     }
//   };

//   const getAttendanceRateColor = (rate: number) => {
//     if (rate >= 90) return 'text-green-600';
//     if (rate >= 80) return 'text-yellow-600';
//     return 'text-red-600';
//   };

//   const filteredRecords = recentAttendanceRecords.filter(record => {
//     const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
//     const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment;
//     const matchesSearch = record.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesStatus && matchesDepartment && matchesSearch;
//   });

//   const CustomTooltip = ({ active, payload }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
//           <p className="text-sm font-semibold text-gray-900">{`Date: ${payload[0].payload.date}`}</p>
//           {payload.map((entry: any, index: number) => (
//             <p key={index} className="text-sm" style={{ color: entry.color }}>
//               {`${entry.dataKey}: ${entry.value}`}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   const CustomPieTooltip = ({ active, payload }: any) => {
//     if (active && payload && payload.length) {
//       const data = payload[0].payload;
//       return (
//         <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
//           <p className="text-sm font-semibold text-gray-900">{data.name}</p>
//           <p className="text-sm text-gray-600">{`Teachers: ${data.value}`}</p>
//           <p className="text-sm text-gray-600">{`Percentage: ${data.percentage}%`}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="min-h-screen bg-[#F6F9FC] p-3">
//       <div className="max-w-[1600px] mx-auto space-y-6">
        
//         {/* Page Header */}
       
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-semibold text-gray-900">Teacher Attendance</h1>
//               <p className="text-sm text-gray-600 mt-1">Monitor and manage daily teacher attendance across all departments</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <input 
//                 type="date" 
//                 value={selectedDate} 
//                 onChange={e => setSelectedDate(e.target.value)} 
//                 className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none transition-all"
//               />
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleRefresh}
//                 disabled={refreshing}
//                 className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm font-medium transition-all duration-200"
//               >
//                 <RefreshCwIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
//                 Refresh
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={()=> navigate ( '/mark/attendance/teacher')}
//                 className="px-6 py-2.5 gradient-primary text-white rounded-xl shadow-glow hover:shadow-float flex items-center gap-2 text-sm font-medium transition-all duration-300"
//               >
//                 <PlusIcon className='w-4 h-4' />
//                 Mark Attendance
//               </motion.button>
//             </div>
//           </div>
        

//         {/* Attendance Stats Grid */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
//         >
//           {attendanceStats.map((stat, index) => (
//             <motion.div 
//               key={stat.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.05 * index }}
//               className="relative bg-white rounded-[20px] shadow-soft border border-gray-100 p-6 hover:shadow-float hover:-translate-y-1 transition-all duration-300"
//             >
//               <div className="absolute top-6 right-6 opacity-5 text-gray-300">
//                 <stat.icon className="w-12 h-12" />
//               </div>

//               <div className="flex items-start justify-between relative z-10">
//                 <div className="flex-1 pr-4">
//                   <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
//                     {stat.name}
//                   </p>
//                   <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
//                   {stat.description && (
//                     <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
//                   )}
//                   {stat.trend !== undefined && (
//                     <div className="flex items-center mt-3 gap-1">
//                       {stat.trendDirection === 'up' ? (
//                         <TrendingUpIcon className="w-3 h-3 text-green-500" />
//                       ) : (
//                         <TrendingDownIcon className="w-3 h-3 text-red-500" />
//                       )}
//                       <span className={`text-xs font-medium ${
//                         stat.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
//                       }`}>
//                         {stat.trend} vs yesterday
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div
//                 className={`absolute -top-3 -right-3 ${stat.bgColor} p-4 rounded-[16px] shadow-lg flex items-center justify-center transition-transform duration-300 hover:scale-110 z-20`}
//               >
//                 <stat.icon className="w-7 h-7 text-white" />
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* Department-wise Attendance */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6"
//         >
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-lg font-semibold text-gray-900">Department-wise Attendance</h2>
//             <select 
//               value={selectedDepartment} 
//               onChange={e => setSelectedDepartment(e.target.value)} 
//               className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none transition-all"
//             >
//               <option value="all">All Departments</option>
//               {departmentSummaries.map(dept => (
//                 <option key={dept.id} value={dept.departmentName}>{dept.departmentName}</option>
//               ))}
//             </select>
//           </div>

//           <div className="space-y-3">
//             {departmentSummaries.map(dept => (
//               <div key={dept.id} className="border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
//                 <div 
//                   className="p-4 cursor-pointer flex justify-between items-center"
//                   onClick={() => setExpandedDepartment(expandedDepartment === dept.id ? null : dept.id)}
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="w-10 h-10 bg-[#1E88E5]/10 rounded-lg flex items-center justify-center">
//                       <BookOpenIcon className="w-5 h-5 text-[#1E88E5]" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900">{dept.departmentName}</h3>
//                       <p className="text-sm text-gray-600">{dept.totalTeachers} Teachers</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-6">
//                     <div className="flex items-center gap-4 text-sm">
//                       <div className="text-center">
//                         <div className="font-semibold text-green-600">{dept.present}</div>
//                         <div className="text-gray-500 text-xs">Present</div>
//                       </div>
//                       <div className="text-center">
//                         <div className="font-semibold text-red-600">{dept.absent}</div>
//                         <div className="text-gray-500 text-xs">Absent</div>
//                       </div>
//                       <div className="text-center">
//                         <div className="font-semibold text-yellow-600">{dept.late}</div>
//                         <div className="text-gray-500 text-xs">Late</div>
//                       </div>
//                     </div>
//                     <div className={`text-lg font-bold ${getAttendanceRateColor(dept.attendanceRate)}`}>
//                       {dept.attendanceRate}%
//                     </div>
//                     {expandedDepartment === dept.id ? 
//                       <ChevronDownIcon className="w-5 h-5 text-gray-400" /> : 
//                       <ChevronRightIcon className="w-5 h-5 text-gray-400" />
//                     }
//                   </div>
//                 </div>

//                 {/* Expanded Details */}
//                 {expandedDepartment === dept.id && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-t border-gray-200 bg-gray-50"
//                   >
//                     <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
//                       <p className="text-2xl font-bold text-green-600">{dept.present}</p>
//                       <p className="text-sm text-green-700 font-medium mt-1">Present</p>
//                     </div>
//                     <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
//                       <p className="text-2xl font-bold text-red-600">{dept.absent}</p>
//                       <p className="text-sm text-red-700 font-medium mt-1">Absent</p>
//                     </div>
//                     <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
//                       <p className="text-2xl font-bold text-yellow-600">{dept.late}</p>
//                       <p className="text-sm text-yellow-700 font-medium mt-1">Late</p>
//                     </div>
//                     <div className="text-center p-4 bg-[#1E88E5]/10 rounded-lg border border-[#1E88E5]/20">
//                       <p className="text-2xl font-bold text-[#1E88E5]">{dept.excused}</p>
//                       <p className="text-sm text-[#1E88E5] font-medium mt-1">Excused</p>
//                     </div>
//                   </motion.div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Charts Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="grid grid-cols-1 lg:grid-cols-2 gap-6"
//         >
//           {/* Attendance Trends Chart */}
//           <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-lg font-semibold text-gray-900">7-Day Attendance Trends</h2>
//               <button className="w-10 h-10 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center">
//                 <MoreHorizontalIcon className="w-4 h-4 text-gray-500" />
//               </button>
//             </div>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={attendanceTrendsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                   <defs>
//                     <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
//                       <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
//                     </linearGradient>
//                     <linearGradient id="absentGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
//                       <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} />
//                   <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend />
//                   <Area type="monotone" dataKey="present" stroke="#10B981" fill="url(#presentGradient)" strokeWidth={2} name="Present" />
//                   <Area type="monotone" dataKey="absent" stroke="#EF4444" fill="url(#absentGradient)" strokeWidth={2} name="Absent" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Attendance Distribution Pie Chart */}
//           <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-lg font-semibold text-gray-900">Today's Distribution</h2>
//               <button className="w-10 h-10 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center">
//                 <PieChartIcon className="w-4 h-4 text-gray-500" />
//               </button>
//             </div>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={attendanceDistributionData}
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={90}
//                     fill="#8884d8"
//                     dataKey="value"
//                     label={({ name, percentage }) => `${name}: ${percentage}%`}
//                     stroke="white"
//                     strokeWidth={2}
//                   >
//                     {attendanceDistributionData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.fill} />
//                     ))}
//                   </Pie>
//                   <Tooltip content={<CustomPieTooltip />} />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </motion.div>

//         {/* Recent Attendance Records */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="grid grid-cols-1 lg:grid-cols-3 gap-6"
//         >
//           <div className="lg:col-span-2 bg-white rounded-[20px] shadow-soft border border-gray-100 p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-lg font-semibold text-gray-900">Recent Attendance Records</h2>
//               <div className="flex items-center gap-3">
//                 <div className="relative">
//                   <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//                   <input
//                     type="text"
//                     placeholder="Search teachers..."
//                     value={searchTerm}
//                     onChange={e => setSearchTerm(e.target.value)}
//                     className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none transition-all"
//                   />
//                 </div>
//                 <select
//                   value={selectedStatus}
//                   onChange={e => setSelectedStatus(e.target.value as any)}
//                   className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none transition-all"
//                 >
//                   <option value="all">All Statuses</option>
//                   <option value="present">Present</option>
//                   <option value="absent">Absent</option>
//                   <option value="late">Late</option>
//                   <option value="excused">Excused</option>
//                 </select>
//               </div>
//             </div>

//             <div className="max-h-96 overflow-y-auto space-y-3">
//               {filteredRecords.length > 0 ? (
//                 filteredRecords.map((record, index) => (
//                   <motion.div 
//                     key={record.id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.05 * index }}
//                     className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all"
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-4">
//                         <span className={`px-3 py-1 rounded-lg border font-semibold text-sm ${getStatusColor(record.status)}`}>
//                           {record.status.toUpperCase()}
//                         </span>
//                         <div>
//                           <p className="font-semibold text-gray-900">{record.teacherName}</p>
//                           <p className="text-xs text-gray-500">{record.department}</p>
//                         </div>
//                       </div>
//                       <div className="text-right text-sm text-gray-600">
//                         <p className="font-medium">{record.date}</p>
//                         <p className="text-xs">{record.timeIn || '-'}</p>
//                         {record.reason && <p className="text-xs italic text-gray-500">{record.reason}</p>}
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))
//               ) : (
//                 <div className="text-center py-12">
//                   <p className="text-gray-500 font-medium">No attendance records found</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6 h-max">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => window.location.href = '/markattendance/teacher'}
//               className="w-full mb-3 px-4 py-3.5 gradient-primary text-white rounded-xl shadow-glow hover:shadow-float flex items-center justify-center gap-2 font-medium transition-all duration-300"
//             >
//               <PlusIcon className="w-4 h-4" />
//               Mark Attendance
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="w-full px-4 py-3.5 border border-gray-200 bg-white text-gray-700 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 font-medium transition-all duration-200"
//             >
//               <EyeIcon className="w-4 h-4" />
//               View Reports
//             </motion.button>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default TeacherAttendance;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UsersIcon, CheckCircleIcon, XCircleIcon, Clock3Icon, AlertTriangleIcon, RefreshCwIcon, SearchIcon, PlusIcon, 
  BarChart3Icon, PieChartIcon, EyeIcon, ChevronDownIcon, ChevronRightIcon, TrendingUpIcon, TrendingDownIcon,
  BookOpenIcon, MoreHorizontalIcon, ArrowUp, ArrowDown
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Tooltip, Legend, CartesianGrid, XAxis, YAxis
} from 'recharts';
import { useNavigate } from 'react-router-dom';


interface StatCard {
  id: string;
  name: string;
  value: number | string;
  icon: any;
  bgColor: string;
  color: string;
  description?: string;
  change?: number;
}


interface AttendanceRecord {
  id: number;
  teacherId: string;
  teacherName: string;
  department: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  timeIn?: string;
  timeOut?: string;
  reason?: string;
  markedBy: string;
}


interface DepartmentSummary {
  id: string;
  departmentName: string;
  totalTeachers: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
}


interface AttendanceTrend {
  date: string;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
}


// Updated Metric Card matching Admin Dashboard style
const TeacherMetricCard = ({ stat, delay }: { stat: StatCard; delay: number }) => {
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


const TeacherAttendance: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'present' | 'absent' | 'late' | 'excused'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [expandedDepartment, setExpandedDepartment] = useState<string | null>(null);
  const navigate = useNavigate();


  const attendanceStats: StatCard[] = [
    {
      id: 'total-present',
      name: 'Present Today',
      value: 75,
      icon: CheckCircleIcon,
      bgColor: 'bg-blue-500',
      color: 'text-white',
      description: '75% of total teachers',
      change: 12,
    },
    {
      id: 'total-absent',
      name: 'Absent Today',
      value: 10,
      icon: XCircleIcon,
      bgColor: 'bg-blue-500',
      color: 'text-white',
      description: '10% of total teachers',
      change: -2,
    },
    {
      id: 'late-arrivals',
      name: 'Late Arrivals',
      value: 5,
      icon: Clock3Icon,
      bgColor: 'bg-blue-500',
      color: 'text-white',
      description: '5% of total teachers',
      change: 5,
    },
    {
      id: 'excused-absences',
      name: 'Excused Absences',
      value: 3,
      icon: AlertTriangleIcon,
      bgColor: 'bg-blue-500',
      color: 'text-white',
      description: '3% of total teachers',
      change: 8,
    },
  ];


  const departmentSummaries: DepartmentSummary[] = [
    { id: 'dept-1', departmentName: 'Math Department', totalTeachers: 25, present: 20, absent: 3, late: 1, excused: 1, attendanceRate: 88 },
    { id: 'dept-2', departmentName: 'Science Department', totalTeachers: 30, present: 28, absent: 1, late: 0, excused: 1, attendanceRate: 96 },
    { id: 'dept-3', departmentName: 'English Department', totalTeachers: 20, present: 15, absent: 3, late: 2, excused: 0, attendanceRate: 75 },
    { id: 'dept-4', departmentName: 'History Department', totalTeachers: 15, present: 10, absent: 2, late: 2, excused: 1, attendanceRate: 73 },
  ];


  const attendanceTrendsData: AttendanceTrend[] = [
    { date: 'Oct 14', present: 80, absent: 10, late: 7, excused: 3, attendanceRate: 85 },
    { date: 'Oct 15', present: 78, absent: 12, late: 6, excused: 4, attendanceRate: 84 },
    { date: 'Oct 16', present: 82, absent: 8, late: 5, excused: 5, attendanceRate: 88 },
    { date: 'Oct 17', present: 79, absent: 14, late: 6, excused: 1, attendanceRate: 83 },
    { date: 'Oct 18', present: 85, absent: 9, late: 4, excused: 2, attendanceRate: 89 },
    { date: 'Oct 19', present: 83, absent: 11, late: 2, excused: 4, attendanceRate: 86 },
    { date: 'Oct 20', present: 75, absent: 10, late: 5, excused: 3, attendanceRate: 82 },
  ];


  const attendanceDistributionData = [
    { name: 'Present', value: 75, fill: '#3B82F6', percentage: 75 },
    { name: 'Absent', value: 10, fill: '#60A5FA', percentage: 10 },
    { name: 'Late', value: 5, fill: '#93C5FD', percentage: 5 },
    { name: 'Excused', value: 3, fill: '#DBEAFE', percentage: 3 },
  ];


  const recentAttendanceRecords: AttendanceRecord[] = [
    { id: 1, teacherId: 'T001', teacherName: 'Mrs. Sarah Khan', department: 'Math Department', date: selectedDate, status: 'present', timeIn: '08:00 AM', markedBy: 'Admin' },
    { id: 2, teacherId: 'T002', teacherName: 'Mr. John Lee', department: 'Science Department', date: selectedDate, status: 'late', timeIn: '08:30 AM', reason: 'Traffic', markedBy: 'Admin' },
    { id: 3, teacherId: 'T003', teacherName: 'Ms. Anita Sharma', department: 'English Department', date: selectedDate, status: 'absent', reason: 'Sick', markedBy: 'Admin' },
    { id: 4, teacherId: 'T004', teacherName: 'Mr. David Park', department: 'History Department', date: selectedDate, status: 'excused', reason: 'Family Emergency', markedBy: 'Admin' },
  ];


  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);


  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'absent': return 'bg-red-50 text-red-700 border-red-200';
      case 'late': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'excused': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };


  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return 'text-emerald-600';
    if (rate >= 80) return 'text-amber-600';
    return 'text-red-600';
  };


  const filteredRecords = recentAttendanceRecords.filter(record => {
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment;
    const matchesSearch = record.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDepartment && matchesSearch;
  });


  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-xl shadow-float">
          <p className="text-sm font-semibold text-gray-900">{`Date: ${payload[0].payload.date}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };


  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-xl shadow-float">
          <p className="text-sm font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">{`Teachers: ${data.value}`}</p>
          <p className="text-sm text-gray-600">{`Percentage: ${data.percentage}%`}</p>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="min-h-screen bg-[#F6F9FC] p-3">
      <div className="max-w-[1600px] mx-auto space-y-7">
        
        {/* Page Header - Match Admin Dashboard */}
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
              Teacher Attendance
            </h1>
            <p 
              className="text-gray-600 mt-2" 
              style={{ fontSize: '15px', fontWeight: 400 }}
            >
              Monitor and manage daily teacher attendance across all departments
            </p>
          </div>
          <div className="flex gap-3">
            <input 
              type="date" 
              value={selectedDate} 
              onChange={e => setSelectedDate(e.target.value)} 
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
            />
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
              onClick={()=> navigate ( '/mark/attendance/teacher')}
              className="px-5 py-2.5 gradient-primary text-white rounded-xl flex items-center gap-2 font-medium shadow-soft transition-all duration-200"
            >
              <PlusIcon className='w-5 h-5' />
              Mark Attendance
            </motion.button>
          </div>
        </motion.div>


        {/* Attendance Stats Grid - Updated to match Admin Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {attendanceStats.map((stat, index) => (
            <TeacherMetricCard key={stat.id} stat={stat} delay={0.1 + index * 0.1} />
          ))}
        </div>


        {/* Department-wise Attendance - Updated colors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-7"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 
              className="text-gray-900"
              style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em' }}
            >
              Department-wise Attendance
            </h3>
            <select 
              value={selectedDepartment} 
              onChange={e => setSelectedDepartment(e.target.value)} 
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
            >
              <option value="all">All Departments</option>
              {departmentSummaries.map(dept => (
                <option key={dept.id} value={dept.departmentName}>{dept.departmentName}</option>
              ))}
            </select>
          </div>


          <div className="space-y-3">
            {departmentSummaries.map((dept, index) => (
              <motion.div 
                key={dept.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                className="border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <div 
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedDepartment(expandedDepartment === dept.id ? null : dept.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-[14px] flex items-center justify-center">
                        <BookOpenIcon className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900" style={{ fontSize: '15px' }}>
                          {dept.departmentName}
                        </h4>
                        <p className="text-gray-600" style={{ fontSize: '14px', fontWeight: 400 }}>
                          {dept.totalTeachers} total teachers
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4" style={{ fontSize: '14px' }}>
                        <div className="text-center">
                          <div className="font-semibold text-emerald-600" style={{ fontSize: '16px' }}>
                            {dept.present}
                          </div>
                          <div className="text-gray-500" style={{ fontSize: '12px' }}>Present</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-red-600" style={{ fontSize: '16px' }}>
                            {dept.absent}
                          </div>
                          <div className="text-gray-500" style={{ fontSize: '12px' }}>Absent</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-amber-600" style={{ fontSize: '16px' }}>
                            {dept.late}
                          </div>
                          <div className="text-gray-500" style={{ fontSize: '12px' }}>Late</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`font-bold ${getAttendanceRateColor(dept.attendanceRate)}`} style={{ fontSize: '18px' }}>
                          {dept.attendanceRate}%
                        </div>
                        <div className="text-gray-500" style={{ fontSize: '13px' }}>Rate</div>
                      </div>
                      
                      {expandedDepartment === dept.id ? (
                        <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>


                {/* Expanded Details */}
                {expandedDepartment === dept.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-t border-gray-200 bg-gray-50"
                  >
                    <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-2xl font-bold text-emerald-600">{dept.present}</p>
                      <p className="text-sm text-emerald-700 font-medium mt-1">Present</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-2xl font-bold text-red-600">{dept.absent}</p>
                      <p className="text-sm text-red-700 font-medium mt-1">Absent</p>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-2xl font-bold text-amber-600">{dept.late}</p>
                      <p className="text-sm text-amber-700 font-medium mt-1">Late</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-2xl font-bold text-blue-600">{dept.excused}</p>
                      <p className="text-sm text-blue-700 font-medium mt-1">Excused</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>


        {/* Charts Section - Updated colors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Attendance Trends Chart */}
          <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-7">
            <div className="flex justify-between items-center mb-6">
              <h3 
                className="text-gray-900"
                style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em' }}
              >
                7-Day Attendance Trends
              </h3>
              <button className="w-10 h-10 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center">
                <MoreHorizontalIcon className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrendsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="absentGradient" x1="0" y1="0" x2="0" y2="1">
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
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="present" 
                    stroke="#3B82F6" 
                    fill="url(#presentGradient)" 
                    strokeWidth={2.5}
                    fillOpacity={1}
                    name="Present" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="absent" 
                    stroke="#60A5FA" 
                    fill="url(#absentGradient)" 
                    strokeWidth={2.5}
                    fillOpacity={1}
                    name="Absent" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>


          {/* Attendance Distribution Pie Chart */}
          <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-7">
            <div className="flex justify-between items-center mb-6">
              <h3 
                className="text-gray-900"
                style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em' }}
              >
                Today's Distribution
              </h3>
              <button className="w-10 h-10 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center">
                <PieChartIcon className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceDistributionData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="white"
                    strokeWidth={2}
                  >
                    {attendanceDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>


        {/* Recent Attendance Records - Updated colors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 bg-white rounded-[20px] shadow-soft border border-gray-100 p-7">
            <div className="flex justify-between items-center mb-6">
              <h3 
                className="text-gray-900"
                style={{ fontSize: '18px', fontWeight: 600 }}
              >
                Recent Attendance Records
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search teachers..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                    style={{ fontSize: '14px' }}
                  />
                </div>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="excused">Excused</option>
                </select>
              </div>
            </div>


            <div className="max-h-96 overflow-y-auto space-y-3 custom-scrollbar">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <motion.div 
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1.5 rounded-lg border font-semibold text-xs ${getStatusColor(record.status)}`}>
                          {record.status.toUpperCase()}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-900" style={{ fontSize: '15px' }}>
                            {record.teacherName}
                          </p>
                          <p className="text-gray-600" style={{ fontSize: '13px', fontWeight: 400 }}>
                            {record.department}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-gray-600" style={{ fontSize: '14px' }}>
                        <p className="font-medium">{record.date}</p>
                        <p className="text-gray-500" style={{ fontSize: '13px' }}>
                          {record.timeIn || '-'}
                        </p>
                        {record.reason && (
                          <p className="text-gray-500 italic" style={{ fontSize: '12px' }}>
                            {record.reason}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 font-medium">No attendance records found</p>
                </div>
              )}
            </div>
          </div>


          {/* Quick Actions - Updated colors */}
          <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-7 h-max">
            <h3 
              className="text-gray-900 mb-5"
              style={{ fontSize: '18px', fontWeight: 600 }}
            >
              Quick Actions
            </h3>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/mark/attendance/teacher')}
              className="w-full mb-3 px-4 py-3.5 gradient-primary text-white rounded-xl shadow-soft hover:shadow-float flex items-center justify-center gap-2 font-medium transition-all duration-300"
            >
              <PlusIcon className="w-5 h-5" />
              Mark Attendance
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-3.5 border border-gray-200 bg-white text-gray-700 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 font-medium transition-all duration-200"
            >
              <EyeIcon className="w-5 h-5" />
              View Reports
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


export default TeacherAttendance;
