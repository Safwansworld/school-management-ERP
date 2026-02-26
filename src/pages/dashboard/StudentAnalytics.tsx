// // // StudentAnalytics.tsx
// // import React, { useState } from 'react';
// // import {
// //   LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter,
// //   AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
// //   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
// // } from 'recharts';
// // import {
// //   Users, TrendingUp, BookOpen, FileText, Award, AlertCircle,
// //   Calendar, CheckCircle, XCircle, Clock
// // } from 'lucide-react';

// // // Sample Data
// // const sampleStudents = [
// //   { id: 1, name: 'Rahul Sharma', class: '10', section: 'A', gender: 'Male' },
// //   { id: 2, name: 'Priya Patel', class: '10', section: 'A', gender: 'Female' },
// //   { id: 3, name: 'Amit Kumar', class: '10', section: 'B', gender: 'Male' },
// //   { id: 4, name: 'Sneha Singh', class: '9', section: 'A', gender: 'Female' },
// // ];

// // const monthlyAttendance = [
// //   { month: 'Jan', attendance: 92 },
// //   { month: 'Feb', attendance: 88 },
// //   { month: 'Mar', attendance: 95 },
// //   { month: 'Apr', attendance: 90 },
// //   { month: 'May', attendance: 87 },
// //   { month: 'Jun', attendance: 93 }
// // ];

// // const attendanceDistribution = [
// //   { name: 'Present', value: 4234, color: '#10b981' },
// //   { name: 'Absent', value: 523, color: '#ef4444' }
// // ];

// // const classAttendanceComparison = [
// //   { class: '6th', attendance: 92 },
// //   { class: '7th', attendance: 88 },
// //   { class: '8th', attendance: 94 },
// //   { class: '9th', attendance: 85 },
// //   { class: '10th', attendance: 91 }
// // ];

// // const subjectScores = [
// //   { subject: 'Math', score: 85 },
// //   { subject: 'Science', score: 78 },
// //   { subject: 'English', score: 92 },
// //   { subject: 'Hindi', score: 88 },
// //   { subject: 'Social', score: 82 }
// // ];

// // const termComparison = [
// //   { subject: 'Math', term1: 82, term2: 85 },
// //   { subject: 'Science', term1: 75, term2: 78 },
// //   { subject: 'English', term1: 88, term2: 92 },
// //   { subject: 'Hindi', term1: 85, term2: 88 },
// //   { subject: 'Social', term1: 80, term2: 82 }
// // ];

// // const performanceGrowth = [
// //   { exam: 'Q1', score: 78 },
// //   { exam: 'Q2', score: 82 },
// //   { exam: 'Mid', score: 85 },
// //   { exam: 'Q3', score: 87 },
// //   { exam: 'Final', score: 90 }
// // ];

// // const topPerformers = [
// //   { name: 'Priya Patel', score: 95 },
// //   { name: 'Rahul Sharma', score: 92 },
// //   { name: 'Amit Kumar', score: 90 },
// //   { name: 'Neha Gupta', score: 88 },
// //   { name: 'Vikram Singh', score: 87 }
// // ];

// // const marksDistribution = [
// //   { range: '0-40', count: 5 },
// //   { range: '40-60', count: 15 },
// //   { range: '60-80', count: 35 },
// //   { range: '80-100', count: 25 }
// // ];

// // const studentStrengthWeakness = [
// //   { skill: 'Math', value: 85 },
// //   { skill: 'Science', value: 78 },
// //   { skill: 'English', value: 92 },
// //   { skill: 'Sports', value: 88 },
// //   { skill: 'Arts', value: 75 },
// //   { skill: 'Social', value: 82 }
// // ];

// // const behaviourDistribution = [
// //   { name: 'Positive', value: 856, color: '#10b981' },
// //   { name: 'Negative', value: 144, color: '#ef4444' }
// // ];

// // const behaviourOverTime = [
// //   { month: 'Jan', positive: 145, negative: 25 },
// //   { month: 'Feb', positive: 138, negative: 28 },
// //   { month: 'Mar', positive: 152, negative: 18 },
// //   { month: 'Apr', positive: 148, negative: 22 },
// //   { month: 'May', positive: 140, negative: 30 },
// //   { month: 'Jun', positive: 155, negative: 21 }
// // ];

// // const behaviourTypes = [
// //   { type: 'Helpful', count: 245 },
// //   { type: 'Punctual', count: 198 },
// //   { type: 'Respectful', count: 167 },
// //   { type: 'Disruptive', count: 45 },
// //   { type: 'Late', count: 38 }
// // ];

// // const complaintsCategory = [
// //   { name: 'Behaviour', value: 45, color: '#f59e0b' },
// //   { name: 'Academic', value: 28, color: '#3b82f6' },
// //   { name: 'Health', value: 15, color: '#10b981' },
// //   { name: 'Transport', value: 12, color: '#ef4444' }
// // ];

// // const complaintsSeverity = [
// //   { month: 'Jan', high: 8, medium: 12, low: 15 },
// //   { month: 'Feb', high: 6, medium: 10, low: 18 },
// //   { month: 'Mar', high: 4, medium: 8, low: 12 },
// //   { month: 'Apr', high: 7, medium: 11, low: 14 },
// //   { month: 'May', high: 9, medium: 15, low: 20 },
// //   { month: 'Jun', high: 5, medium: 9, low: 16 }
// // ];

// // const complaintsStatus = [
// //   { name: 'Resolved', value: 78, color: '#10b981' },
// //   { name: 'Unresolved', value: 22, color: '#ef4444' }
// // ];

// // const assignmentSubmission = [
// //   { name: 'On Time', value: 765, color: '#10b981' },
// //   { name: 'Late', value: 145, color: '#f59e0b' }
// // ];

// // const subjectAssignmentCompletion = [
// //   { subject: 'Math', completion: 92 },
// //   { subject: 'Science', completion: 88 },
// //   { subject: 'English', completion: 95 },
// //   { subject: 'Hindi', completion: 90 },
// //   { subject: 'Social', completion: 87 }
// // ];

// // const weeklyAssignmentTrend = [
// //   { week: 'W1', completed: 45 },
// //   { week: 'W2', completed: 48 },
// //   { week: 'W3', completed: 42 },
// //   { week: 'W4', completed: 50 },
// //   { week: 'W5', completed: 47 },
// //   { week: 'W6', completed: 52 }
// // ];

// // const assignmentScores = [
// //   { assignment: 'A1', score: 85 },
// //   { assignment: 'A2', score: 88 },
// //   { assignment: 'A3', score: 82 },
// //   { assignment: 'A4', score: 90 },
// //   { assignment: 'A5', score: 87 }
// // ];

// // const projectStatus = [
// //   { name: 'Completed', value: 45, color: '#10b981' },
// //   { name: 'In Progress', value: 32, color: '#f59e0b' }
// // ];

// // const projectTypes = [
// //   { type: 'Science', count: 25 },
// //   { type: 'Math', count: 18 },
// //   { type: 'Robotics', count: 12 },
// //   { type: 'Art', count: 15 },
// //   { type: 'Coding', count: 7 }
// // ];

// // const projectScores = [
// //   { range: '0-50', count: 3 },
// //   { range: '50-70', count: 12 },
// //   { range: '70-85', count: 28 },
// //   { range: '85-100', count: 34 }
// // ];

// // const projectTimeline = [
// //   { month: 'Jan', completed: 6 },
// //   { month: 'Feb', completed: 8 },
// //   { month: 'Mar', completed: 5 },
// //   { month: 'Apr', completed: 10 },
// //   { month: 'May', completed: 7 },
// //   { month: 'Jun', completed: 9 }
// // ];

// // const projectSkills = [
// //   { skill: 'Creativity', value: 88 },
// //   { skill: 'Coding', value: 75 },
// //   { skill: 'Teamwork', value: 92 },
// //   { skill: 'Research', value: 85 },
// //   { skill: 'Presentation', value: 78 }
// // ];

// // const booksBorrowedMonthly = [
// //   { month: 'Jan', books: 12 },
// //   { month: 'Feb', books: 15 },
// //   { month: 'Mar', books: 10 },
// //   { month: 'Apr', books: 18 },
// //   { month: 'May', books: 14 },
// //   { month: 'Jun', books: 16 }
// // ];

// // const readingGenres = [
// //   { name: 'Fiction', value: 145, color: '#3b82f6' },
// //   { name: 'Science', value: 98, color: '#10b981' },
// //   { name: 'History', value: 67, color: '#f59e0b' },
// //   { name: 'Biography', value: 45, color: '#ef4444' }
// // ];

// // const topReaders = [
// //   { name: 'Priya Patel', books: 24 },
// //   { name: 'Rahul Sharma', books: 21 },
// //   { name: 'Amit Kumar', books: 18 },
// //   { name: 'Neha Gupta', books: 16 },
// //   { name: 'Vikram Singh', books: 15 }
// // ];

// // const readingSpeed = [
// //   { month: 'Jan', avgDays: 14 },
// //   { month: 'Feb', avgDays: 12 },
// //   { month: 'Mar', avgDays: 15 },
// //   { month: 'Apr', avgDays: 10 },
// //   { month: 'May', avgDays: 13 },
// //   { month: 'Jun', avgDays: 11 }
// // ];

// // const parentEngagement = [
// //   { name: 'Attended', value: 185, color: '#10b981' },
// //   { name: 'Not Attended', value: 65, color: '#ef4444' }
// // ];

// // const parentFeedback = [
// //   { name: 'Positive', value: 168, color: '#10b981' },
// //   { name: 'Neutral', value: 52, color: '#f59e0b' },
// //   { name: 'Negative', value: 30, color: '#ef4444' }
// // ];

// // const parentMessages = [
// //   { month: 'Jan', messages: 45 },
// //   { month: 'Feb', messages: 38 },
// //   { month: 'Mar', messages: 52 },
// //   { month: 'Apr', messages: 48 },
// //   { month: 'May', messages: 41 },
// //   { month: 'Jun', messages: 55 }
// // ];

// // const attendanceVsMarks = [
// //   { attendance: 95, marks: 92 },
// //   { attendance: 88, marks: 85 },
// //   { attendance: 92, marks: 88 },
// //   { attendance: 78, marks: 72 },
// //   { attendance: 85, marks: 80 },
// //   { attendance: 90, marks: 87 },
// //   { attendance: 82, marks: 78 },
// //   { attendance: 96, marks: 94 }
// // ];

// // const behaviourVsMarks = [
// //   { behaviour: 95, marks: 92 },
// //   { behaviour: 85, marks: 88 },
// //   { behaviour: 78, marks: 75 },
// //   { behaviour: 92, marks: 90 },
// //   { behaviour: 88, marks: 85 },
// //   { behaviour: 82, marks: 80 },
// //   { behaviour: 75, marks: 72 }
// // ];

// // const readingVsPerformance = [
// //   { books: 24, performance: 92 },
// //   { books: 18, performance: 88 },
// //   { books: 12, performance: 82 },
// //   { books: 21, performance: 90 },
// //   { books: 15, performance: 85 },
// //   { books: 9, performance: 78 },
// //   { books: 6, performance: 75 }
// // ];

// // const assignmentVsExam = [
// //   { subject: 'Math', assignment: 88, exam: 85 },
// //   { subject: 'Science', assignment: 82, exam: 78 },
// //   { subject: 'English', assignment: 95, exam: 92 },
// //   { subject: 'Hindi', assignment: 90, exam: 88 },
// //   { subject: 'Social', assignment: 85, exam: 82 }
// // ];

// // // KPI Card Component
// // const KPICard: React.FC<{
// //   title: string;
// //   value: string | number;
// //   icon: React.ReactNode;
// //   color: string;
// //   subtitle?: string;
// // }> = ({ title, value, icon, color, subtitle }) => {
// //   return (
// //     <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <p className="text-sm text-gray-600 font-medium">{title}</p>
// //           <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
// //           {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
// //         </div>
// //         <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('600', '100')}`}>
// //           {icon}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // Chart Container Component
// // const ChartContainer: React.FC<{
// //   title: string;
// //   children: React.ReactNode;
// //   className?: string;
// // }> = ({ title, children, className = '' }) => {
// //   return (
// //     <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
// //       <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
// //       {children}
// //     </div>
// //   );
// // };

// // // Main Component
// // const StudentAnalytics: React.FC = () => {
// //   const [filters, setFilters] = useState({
// //     class: 'all',
// //     section: 'all',
// //     student: 'all',
// //     gender: 'all',
// //     dateRange: 'all',
// //     subject: 'all'
// //   });

// //   const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6">
// //       {/* Header */}
// //       <div className="mb-6">
// //         <h1 className="text-3xl font-bold text-gray-900">Student Analytics Dashboard</h1>
// //         <p className="text-gray-600 mt-1">Comprehensive insights into student performance and engagement</p>
// //       </div>

// //       {/* Filters */}
// //       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
// //         <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
// //         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
// //             <select
// //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               value={filters.class}
// //               onChange={(e) => setFilters({ ...filters, class: e.target.value })}
// //             >
// //               <option value="all">All Classes</option>
// //               <option value="6">6th</option>
// //               <option value="7">7th</option>
// //               <option value="8">8th</option>
// //               <option value="9">9th</option>
// //               <option value="10">10th</option>
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
// //             <select
// //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               value={filters.section}
// //               onChange={(e) => setFilters({ ...filters, section: e.target.value })}
// //             >
// //               <option value="all">All Sections</option>
// //               <option value="A">Section A</option>
// //               <option value="B">Section B</option>
// //               <option value="C">Section C</option>
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
// //             <select
// //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               value={filters.student}
// //               onChange={(e) => setFilters({ ...filters, student: e.target.value })}
// //             >
// //               <option value="all">All Students</option>
// //               {sampleStudents.map(student => (
// //                 <option key={student.id} value={student.id}>{student.name}</option>
// //               ))}
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
// //             <select
// //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               value={filters.gender}
// //               onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
// //             >
// //               <option value="all">All</option>
// //               <option value="male">Male</option>
// //               <option value="female">Female</option>
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
// //             <select
// //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               value={filters.dateRange}
// //               onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
// //             >
// //               <option value="all">All Time</option>
// //               <option value="week">This Week</option>
// //               <option value="month">This Month</option>
// //               <option value="quarter">This Quarter</option>
// //               <option value="year">This Year</option>
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
// //             <select
// //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               value={filters.subject}
// //               onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
// //             >
// //               <option value="all">All Subjects</option>
// //               <option value="math">Mathematics</option>
// //               <option value="science">Science</option>
// //               <option value="english">English</option>
// //               <option value="hindi">Hindi</option>
// //               <option value="social">Social Studies</option>
// //             </select>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Quick Overview KPIs */}
// //       <div className="mb-6">
// //         <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Overview</h2>
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// //           <KPICard
// //             title="Total Students"
// //             value="1,248"
// //             icon={<Users className="w-6 h-6 text-blue-600" />}
// //             color="text-blue-600"
// //           />
// //           <KPICard
// //             title="Avg Attendance"
// //             value="91.2%"
// //             icon={<Calendar className="w-6 h-6 text-green-600" />}
// //             color="text-green-600"
// //             subtitle="+2.3% from last month"
// //           />
// //           <KPICard
// //             title="Avg Academic Score"
// //             value="85.7"
// //             icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
// //             color="text-purple-600"
// //             subtitle="+3.5 from last term"
// //           />
// //           <KPICard
// //             title="Behaviour Score"
// //             value="8.5/10"
// //             icon={<Award className="w-6 h-6 text-orange-600" />}
// //             color="text-orange-600"
// //           />
// //         </div>
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
// //           <KPICard
// //             title="Books Read"
// //             value="355"
// //             icon={<BookOpen className="w-6 h-6 text-indigo-600" />}
// //             color="text-indigo-600"
// //             subtitle="This semester"
// //           />
// //           <KPICard
// //             title="Assignment Completion"
// //             value="84.1%"
// //             icon={<CheckCircle className="w-6 h-6 text-teal-600" />}
// //             color="text-teal-600"
// //           />
// //           <KPICard
// //             title="Projects Completed"
// //             value="45"
// //             icon={<FileText className="w-6 h-6 text-pink-600" />}
// //             color="text-pink-600"
// //           />
// //           <KPICard
// //             title="Complaints Logged"
// //             value="28"
// //             icon={<AlertCircle className="w-6 h-6 text-red-600" />}
// //             color="text-red-600"
// //             subtitle="12 resolved"
// //           />
// //         </div>
// //       </div>

// //       {/* Attendance Analytics */}
// //       <div className="mb-6">
// //         <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Analytics</h2>
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
// //           <ChartContainer title="Monthly Attendance Trend">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <LineChart data={monthlyAttendance}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="month" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
// //               </LineChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Present vs Absent Distribution">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <PieChart>
// //                 <Pie
// //                   data={attendanceDistribution}
// //                   cx="50%"
// //                   cy="50%"
// //                   labelLine={false}
// //                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
// //                   outerRadius={80}
// //                   fill="#8884d8"
// //                   dataKey="value"
// //                 >
// //                   {attendanceDistribution.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.color} />
// //                   ))}
// //                 </Pie>
// //                 <Tooltip />
// //               </PieChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Class-wise Attendance Comparison">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <BarChart data={classAttendanceComparison}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="class" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Bar dataKey="attendance" fill="#10b981" radius={[8, 8, 0, 0]} />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Low Attendance Students">
// //             <div className="overflow-x-auto">
// //               <table className="min-w-full divide-y divide-gray-200">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="bg-white divide-y divide-gray-200">
// //                   <tr>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Vikram Singh</td>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">9th A</td>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 font-medium">72%</td>
// //                   </tr>
// //                   <tr>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Anita Desai</td>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">10th B</td>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 font-medium">75%</td>
// //                   </tr>
// //                   <tr>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Ravi Kumar</td>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">8th C</td>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-orange-600 font-medium">78%</td>
// //                   </tr>
// //                 </tbody>
// //               </table>
// //             </div>
// //           </ChartContainer>
// //         </div>
// //       </div>

// //       {/* Academic Performance Analytics */}
// //       <div className="mb-6">
// //         <h2 className="text-xl font-semibold text-gray-800 mb-4">Academic Performance</h2>
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
// //           <ChartContainer title="Subject-wise Average Scores">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <BarChart data={subjectScores}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="subject" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Bar dataKey="score" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Term 1 vs Term 2 Comparison">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <BarChart data={termComparison}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="subject" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Legend />
// //                 <Bar dataKey="term1" fill="#f59e0b" radius={[8, 8, 0, 0]} />
// //                 <Bar dataKey="term2" fill="#10b981" radius={[8, 8, 0, 0]} />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Performance Growth Over Time">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <LineChart data={performanceGrowth}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="exam" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Line type="monotone" dataKey="score" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899' }} />
// //               </LineChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Top 5 High Performers">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <BarChart data={topPerformers} layout="vertical">
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis type="number" stroke="#6b7280" />
// //                 <YAxis type="category" dataKey="name" stroke="#6b7280" width={100} />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Bar dataKey="score" fill="#10b981" radius={[0, 8, 8, 0]} />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Marks Distribution">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <BarChart data={marksDistribution}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="range" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Student Strengths & Weaknesses">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <RadarChart data={studentStrengthWeakness}>
// //                 <PolarGrid stroke="#e5e7eb" />
// //                 <PolarAngleAxis dataKey="skill" stroke="#6b7280" />
// //                 <PolarRadiusAxis stroke="#6b7280" />
// //                 <Radar name="Performance" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
// //                 <Tooltip />
// //               </RadarChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>
// //         </div>
// //       </div>

// //       {/* Behaviour & Complaints Analytics */}
// //       <div className="mb-6">
// //         <h2 className="text-xl font-semibold text-gray-800 mb-4">Behaviour & Complaints</h2>
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
// //           <ChartContainer title="Positive vs Negative Behaviour">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <PieChart>
// //                 <Pie
// //                   data={behaviourDistribution}
// //                   cx="50%"
// //                   cy="50%"
// //                   labelLine={false}
// //                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
// //                   outerRadius={80}
// //                   fill="#8884d8"
// //                   dataKey="value"
// //                 >
// //                   {behaviourDistribution.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.color} />
// //                   ))}
// //                 </Pie>
// //                 <Tooltip />
// //               </PieChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Behaviour Trend Over Time">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <LineChart data={behaviourOverTime}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="month" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Legend />
// //                 <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} />
// //                 <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} />
// //               </LineChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Frequent Behaviour Types">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <BarChart data={behaviourTypes}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="type" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Complaints by Category">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <PieChart>
// //                 <Pie
// //                   data={complaintsCategory}
// //                   cx="50%"
// //                   cy="50%"
// //                   labelLine={false}
// //                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
// //                   outerRadius={80}
// //                   fill="#8884d8"
// //                   dataKey="value"
// //                 >
// //                   {complaintsCategory.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.color} />
// //                   ))}
// //                 </Pie>
// //                 <Tooltip />
// //               </PieChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Complaint Severity Trend">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <LineChart data={complaintsSeverity}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="month" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Legend />
// //                 <Line type="monotone" dataKey="high" stroke="#ef4444" strokeWidth={2} />
// //                 <Line type="monotone" dataKey="medium" stroke="#f59e0b" strokeWidth={2} />
// //                 <Line type="monotone" dataKey="low" stroke="#10b981" strokeWidth={2} />
// //               </LineChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Resolved vs Unresolved Complaints">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <PieChart>
// //                 <Pie
// //                   data={complaintsStatus}
// //                   cx="50%"
// //                   cy="50%"
// //                   labelLine={false}
// //                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
// //                   outerRadius={80}
// //                   fill="#8884d8"
// //                   dataKey="value"
// //                 >
// //                   {complaintsStatus.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.color} />
// //                   ))}
// //                 </Pie>
// //                 <Tooltip />
// //               </PieChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>
// //         </div>
// //       </div>

// //       {/* Assignments & Homework Analytics */}
// //       <div className="mb-6">
// //         <h2 className="text-xl font-semibold text-gray-800 mb-4">Assignments & Homework</h2>
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
// //           <ChartContainer title="On-Time vs Late Submission">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <PieChart>
// //                 <Pie
// //                   data={assignmentSubmission}
// //                   cx="50%"
// //                   cy="50%"
// //                   labelLine={false}
// //                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
// //                   outerRadius={80}
// //                   fill="#8884d8"
// //                   dataKey="value"
// //                 >
// //                   {assignmentSubmission.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.color} />
// //                   ))}
// //                 </Pie>
// //                 <Tooltip />
// //               </PieChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Subject-wise Assignment Completion">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <BarChart data={subjectAssignmentCompletion}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="subject" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Bar dataKey="completion" fill="#10b981" radius={[8, 8, 0, 0]} />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Weekly Assignment Completion Trend">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <LineChart data={weeklyAssignmentTrend}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="week" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Line type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
// //               </LineChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Assignment Scores">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <BarChart data={assignmentScores}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="assignment" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Bar dataKey="score" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>
// //         </div>
// //       </div>

// //       {/* Project Analytics */}
// //       <div className="mb-6">
// //         <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Analytics</h2>
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
// //           <ChartContainer title="Completed vs In-Progress Projects">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <PieChart>
// //                 <Pie
// //                   data={projectStatus}
// //                   cx="50%"
// //                   cy="50%"
// //                   labelLine={false}
// //                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
// //                   outerRadius={80}
// //                   fill="#8884d8"
// //                   dataKey="value"
// //                 >
// //                   {projectStatus.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.color} />
// //                   ))}
// //                 </Pie>
// //                 <Tooltip />
// //               </PieChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Project Types Distribution">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <BarChart data={projectTypes}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="type" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Bar dataKey="count" fill="#ec4899" radius={[8, 8, 0, 0]} />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Project Score Distribution">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <BarChart data={projectScores}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="range" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Project Completion Timeline">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <LineChart data={projectTimeline}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="month" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
// //               </LineChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Skills Involved in Projects" className="lg:col-span-2">
// //             <ResponsiveContainer width="100%" height={300}>
// //               <RadarChart data={projectSkills}>
// //                 <PolarGrid stroke="#e5e7eb" />
// //                 <PolarAngleAxis dataKey="skill" stroke="#6b7280" />
// //                 <PolarRadiusAxis stroke="#6b7280" />
// //                 <Radar name="Skills" dataKey="value" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
// //                 <Tooltip />
// //               </RadarChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>
// //         </div>
// //       </div>

// //       {/* Library / Reading Analytics */}
// //       <div className="mb-6">
// //         <h2 className="text-xl font-semibold text-gray-800 mb-4">Library & Reading Analytics</h2>
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
// //           <ChartContainer title="Books Borrowed Per Month">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <AreaChart data={booksBorrowedMonthly}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="month" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Area type="monotone" dataKey="books" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
// //               </AreaChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Most Read Genres">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <PieChart>
// //                 <Pie
// //                   data={readingGenres}
// //                   cx="50%"
// //                   cy="50%"
// //                   labelLine={false}
// //                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
// //                   outerRadius={80}
// //                   fill="#8884d8"
// //                   dataKey="value"
// //                 >
// //                   {readingGenres.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.color} />
// //                   ))}
// //                 </Pie>
// //                 <Tooltip />
// //               </PieChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Top Readers in Class">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <BarChart data={topReaders} layout="vertical">
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis type="number" stroke="#6b7280" />
// //                 <YAxis type="category" dataKey="name" stroke="#6b7280" width={100} />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Bar dataKey="books" fill="#10b981" radius={[0, 8, 8, 0]} />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Reading Speed Trend (Avg Days per Book)">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <LineChart data={readingSpeed}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="month" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Line type="monotone" dataKey="avgDays" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
// //               </LineChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Currently Borrowed Books" className="lg:col-span-2">
// //             <div className="overflow-x-auto">
// //               <table className="min-w-full divide-y divide-gray-200">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrowed Date</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="bg-white divide-y divide-gray-200">
// //                   <tr>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">The Great Gatsby</td>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Priya Patel</td>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Nov 10, 2025</td>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Nov 24, 2025</td>
// //                     <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span></td>
// //                   </tr>
// //                   <tr>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Physics Vol 2</td>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Rahul Sharma</td>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Nov 5, 2025</td>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Nov 19, 2025</td>
// //                     <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Overdue</span></td>
// //                   </tr>
// //                   <tr>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Harry Potter</td>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Amit Kumar</td>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Nov 12, 2025</td>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Nov 26, 2025</td>
// //                     <td className="px-4 py-3 whitespace-nowrap"><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span></td>
// //                   </tr>
// //                 </tbody>
// //               </table>
// //             </div>
// //           </ChartContainer>
// //         </div>
// //       </div>

// //       {/* Parent Engagement */}
// //       <div className="mb-6">
// //         <h2 className="text-xl font-semibold text-gray-800 mb-4">Parent Engagement</h2>
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
// //           <ChartContainer title="PTM Attendance">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <PieChart>
// //                 <Pie
// //                   data={parentEngagement}
// //                   cx="50%"
// //                   cy="50%"
// //                   labelLine={false}
// //                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
// //                   outerRadius={80}
// //                   fill="#8884d8"
// //                   dataKey="value"
// //                 >
// //                   {parentEngagement.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.color} />
// //                   ))}
// //                 </Pie>
// //                 <Tooltip />
// //               </PieChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Parent Feedback Sentiment">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <PieChart>
// //                 <Pie
// //                   data={parentFeedback}
// //                   cx="50%"
// //                   cy="50%"
// //                   labelLine={false}
// //                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
// //                   outerRadius={80}
// //                   fill="#8884d8"
// //                   dataKey="value"
// //                 >
// //                   {parentFeedback.map((entry, index) => (
// //                     <Cell key={`cell-${index}`} fill={entry.color} />
// //                   ))}
// //                 </Pie>
// //                 <Tooltip />
// //               </PieChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Parent Messages Timeline" className="lg:col-span-2">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <LineChart data={parentMessages}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="month" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Line type="monotone" dataKey="messages" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
// //               </LineChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>
// //         </div>
// //       </div>

// //       {/* Cross-Domain Insights */}
// //       <div className="mb-6">
// //         <h2 className="text-xl font-semibold text-gray-800 mb-4">Cross-Domain Insights & Correlations</h2>
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
// //           <ChartContainer title="Attendance vs Academic Performance">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <ScatterChart>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="attendance" name="Attendance %" stroke="#6b7280" />
// //                 <YAxis dataKey="marks" name="Marks" stroke="#6b7280" />
// //                 <Tooltip cursor={{ strokeDasharray: '3 3' }} />
// //                 <Scatter name="Students" data={attendanceVsMarks} fill="#3b82f6" />
// //               </ScatterChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Behaviour vs Academic Performance">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <ScatterChart>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="behaviour" name="Behaviour Score" stroke="#6b7280" />
// //                 <YAxis dataKey="marks" name="Marks" stroke="#6b7280" />
// //                 <Tooltip cursor={{ strokeDasharray: '3 3' }} />
// //                 <Scatter name="Students" data={behaviourVsMarks} fill="#10b981" />
// //               </ScatterChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Reading Habit vs Performance">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <ScatterChart>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="books" name="Books Read" stroke="#6b7280" />
// //                 <YAxis dataKey="performance" name="Performance Score" stroke="#6b7280" />
// //                 <Tooltip cursor={{ strokeDasharray: '3 3' }} />
// //                 <Scatter name="Students" data={readingVsPerformance} fill="#ec4899" />
// //               </ScatterChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>

// //           <ChartContainer title="Assignment Completion vs Exam Performance">
// //             <ResponsiveContainer width="100%" height={250}>
// //               <BarChart data={assignmentVsExam}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                 <XAxis dataKey="subject" stroke="#6b7280" />
// //                 <YAxis stroke="#6b7280" />
// //                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
// //                 <Legend />
// //                 <Bar dataKey="assignment" fill="#f59e0b" name="Assignment Avg" radius={[8, 8, 0, 0]} />
// //                 <Bar dataKey="exam" fill="#3b82f6" name="Exam Score" radius={[8, 8, 0, 0]} />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </ChartContainer>
// //         </div>
// //       </div>

// //       {/* Individual Student Profile Card */}
// //       <div className="mb-6">
// //         <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Profile Overview</h2>
// //         <div className="bg-white rounded-lg shadow-md p-6">
// //           <div className="flex items-start space-x-6">
// //             <div className="flex-shrink-0">
// //               <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
// //                 <Users className="w-12 h-12 text-blue-600" />
// //               </div>
// //             </div>
// //             <div className="flex-1">
// //               <div className="flex items-center justify-between mb-4">
// //                 <div>
// //                   <h3 className="text-2xl font-bold text-gray-900">Priya Patel</h3>
// //                   <p className="text-gray-600">Class 10-A | Roll No: 24</p>
// //                 </div>
// //               </div>
// //               <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
// //                 <div className="text-center p-3 bg-blue-50 rounded-lg">
// //                   <p className="text-xs text-gray-600 mb-1">Attendance</p>
// //                   <p className="text-xl font-bold text-blue-600">95%</p>
// //                 </div>
// //                 <div className="text-center p-3 bg-purple-50 rounded-lg">
// //                   <p className="text-xs text-gray-600 mb-1">Avg Marks</p>
// //                   <p className="text-xl font-bold text-purple-600">92</p>
// //                 </div>
// //                 <div className="text-center p-3 bg-green-50 rounded-lg">
// //                   <p className="text-xs text-gray-600 mb-1">Behaviour</p>
// //                   <p className="text-xl font-bold text-green-600">9.2/10</p>
// //                 </div>
// //                 <div className="text-center p-3 bg-orange-50 rounded-lg">
// //                   <p className="text-xs text-gray-600 mb-1">Books Read</p>
// //                   <p className="text-xl font-bold text-orange-600">24</p>
// //                 </div>
// //                 <div className="text-center p-3 bg-teal-50 rounded-lg">
// //                   <p className="text-xs text-gray-600 mb-1">Assignments</p>
// //                   <p className="text-xl font-bold text-teal-600">98%</p>
// //                 </div>
// //                 <div className="text-center p-3 bg-pink-50 rounded-lg">
// //                   <p className="text-xs text-gray-600 mb-1">Projects</p>
// //                   <p className="text-xl font-bold text-pink-600">8</p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default StudentAnalytics;
// // StudentAnalytics.tsx
// import React, { useState } from 'react';
// import {
//   LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter,
//   AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
// } from 'recharts';
// import {
//   Users, TrendingUp, BookOpen, FileText, Award, AlertCircle,
//   Calendar, CheckCircle, XCircle, Clock, ChevronRight, X
// } from 'lucide-react';

// // Sample Data (same as before)
// const sampleStudents = [
//   { id: 1, name: 'Rahul Sharma', class: '10', section: 'A', gender: 'Male' },
//   { id: 2, name: 'Priya Patel', class: '10', section: 'A', gender: 'Female' },
//   { id: 3, name: 'Amit Kumar', class: '10', section: 'B', gender: 'Male' },
//   { id: 4, name: 'Sneha Singh', class: '9', section: 'A', gender: 'Female' },
// ];

// const monthlyAttendance = [
//   { month: 'Jan', attendance: 92 },
//   { month: 'Feb', attendance: 88 },
//   { month: 'Mar', attendance: 95 },
//   { month: 'Apr', attendance: 90 },
//   { month: 'May', attendance: 87 },
//   { month: 'Jun', attendance: 93 }
// ];

// const attendanceDistribution = [
//   { name: 'Present', value: 4234, color: '#10b981' },
//   { name: 'Absent', value: 523, color: '#ef4444' }
// ];

// const classAttendanceComparison = [
//   { class: '6th', attendance: 92 },
//   { class: '7th', attendance: 88 },
//   { class: '8th', attendance: 94 },
//   { class: '9th', attendance: 85 },
//   { class: '10th', attendance: 91 }
// ];

// const subjectScores = [
//   { subject: 'Math', score: 85 },
//   { subject: 'Science', score: 78 },
//   { subject: 'English', score: 92 },
//   { subject: 'Hindi', score: 88 },
//   { subject: 'Social', score: 82 }
// ];

// const termComparison = [
//   { subject: 'Math', term1: 82, term2: 85 },
//   { subject: 'Science', term1: 75, term2: 78 },
//   { subject: 'English', term1: 88, term2: 92 },
//   { subject: 'Hindi', term1: 85, term2: 88 },
//   { subject: 'Social', term1: 80, term2: 82 }
// ];

// const performanceGrowth = [
//   { exam: 'Q1', score: 78 },
//   { exam: 'Q2', score: 82 },
//   { exam: 'Mid', score: 85 },
//   { exam: 'Q3', score: 87 },
//   { exam: 'Final', score: 90 }
// ];

// const topPerformers = [
//   { name: 'Priya Patel', score: 95 },
//   { name: 'Rahul Sharma', score: 92 },
//   { name: 'Amit Kumar', score: 90 },
//   { name: 'Neha Gupta', score: 88 },
//   { name: 'Vikram Singh', score: 87 }
// ];

// const marksDistribution = [
//   { range: '0-40', count: 5 },
//   { range: '40-60', count: 15 },
//   { range: '60-80', count: 35 },
//   { range: '80-100', count: 25 }
// ];

// const studentStrengthWeakness = [
//   { skill: 'Math', value: 85 },
//   { skill: 'Science', value: 78 },
//   { skill: 'English', value: 92 },
//   { skill: 'Sports', value: 88 },
//   { skill: 'Arts', value: 75 },
//   { skill: 'Social', value: 82 }
// ];

// const behaviourDistribution = [
//   { name: 'Positive', value: 856, color: '#10b981' },
//   { name: 'Negative', value: 144, color: '#ef4444' }
// ];

// const behaviourOverTime = [
//   { month: 'Jan', positive: 145, negative: 25 },
//   { month: 'Feb', positive: 138, negative: 28 },
//   { month: 'Mar', positive: 152, negative: 18 },
//   { month: 'Apr', positive: 148, negative: 22 },
//   { month: 'May', positive: 140, negative: 30 },
//   { month: 'Jun', positive: 155, negative: 21 }
// ];

// const behaviourTypes = [
//   { type: 'Helpful', count: 245 },
//   { type: 'Punctual', count: 198 },
//   { type: 'Respectful', count: 167 },
//   { type: 'Disruptive', count: 45 },
//   { type: 'Late', count: 38 }
// ];

// const complaintsCategory = [
//   { name: 'Behaviour', value: 45, color: '#f59e0b' },
//   { name: 'Academic', value: 28, color: '#3b82f6' },
//   { name: 'Health', value: 15, color: '#10b981' },
//   { name: 'Transport', value: 12, color: '#ef4444' }
// ];

// const complaintsSeverity = [
//   { month: 'Jan', high: 8, medium: 12, low: 15 },
//   { month: 'Feb', high: 6, medium: 10, low: 18 },
//   { month: 'Mar', high: 4, medium: 8, low: 12 },
//   { month: 'Apr', high: 7, medium: 11, low: 14 },
//   { month: 'May', high: 9, medium: 15, low: 20 },
//   { month: 'Jun', high: 5, medium: 9, low: 16 }
// ];

// const complaintsStatus = [
//   { name: 'Resolved', value: 78, color: '#10b981' },
//   { name: 'Unresolved', value: 22, color: '#ef4444' }
// ];

// const assignmentSubmission = [
//   { name: 'On Time', value: 765, color: '#10b981' },
//   { name: 'Late', value: 145, color: '#f59e0b' }
// ];

// const subjectAssignmentCompletion = [
//   { subject: 'Math', completion: 92 },
//   { subject: 'Science', completion: 88 },
//   { subject: 'English', completion: 95 },
//   { subject: 'Hindi', completion: 90 },
//   { subject: 'Social', completion: 87 }
// ];

// const weeklyAssignmentTrend = [
//   { week: 'W1', completed: 45 },
//   { week: 'W2', completed: 48 },
//   { week: 'W3', completed: 42 },
//   { week: 'W4', completed: 50 },
//   { week: 'W5', completed: 47 },
//   { week: 'W6', completed: 52 }
// ];

// const assignmentScores = [
//   { assignment: 'A1', score: 85 },
//   { assignment: 'A2', score: 88 },
//   { assignment: 'A3', score: 82 },
//   { assignment: 'A4', score: 90 },
//   { assignment: 'A5', score: 87 }
// ];

// const projectStatus = [
//   { name: 'Completed', value: 45, color: '#10b981' },
//   { name: 'In Progress', value: 32, color: '#f59e0b' }
// ];

// const projectTypes = [
//   { type: 'Science', count: 25 },
//   { type: 'Math', count: 18 },
//   { type: 'Robotics', count: 12 },
//   { type: 'Art', count: 15 },
//   { type: 'Coding', count: 7 }
// ];

// const projectScores = [
//   { range: '0-50', count: 3 },
//   { range: '50-70', count: 12 },
//   { range: '70-85', count: 28 },
//   { range: '85-100', count: 34 }
// ];

// const projectTimeline = [
//   { month: 'Jan', completed: 6 },
//   { month: 'Feb', completed: 8 },
//   { month: 'Mar', completed: 5 },
//   { month: 'Apr', completed: 10 },
//   { month: 'May', completed: 7 },
//   { month: 'Jun', completed: 9 }
// ];

// const projectSkills = [
//   { skill: 'Creativity', value: 88 },
//   { skill: 'Coding', value: 75 },
//   { skill: 'Teamwork', value: 92 },
//   { skill: 'Research', value: 85 },
//   { skill: 'Presentation', value: 78 }
// ];

// const booksBorrowedMonthly = [
//   { month: 'Jan', books: 12 },
//   { month: 'Feb', books: 15 },
//   { month: 'Mar', books: 10 },
//   { month: 'Apr', books: 18 },
//   { month: 'May', books: 14 },
//   { month: 'Jun', books: 16 }
// ];

// const readingGenres = [
//   { name: 'Fiction', value: 145, color: '#3b82f6' },
//   { name: 'Science', value: 98, color: '#10b981' },
//   { name: 'History', value: 67, color: '#f59e0b' },
//   { name: 'Biography', value: 45, color: '#ef4444' }
// ];

// const topReaders = [
//   { name: 'Priya Patel', books: 24 },
//   { name: 'Rahul Sharma', books: 21 },
//   { name: 'Amit Kumar', books: 18 },
//   { name: 'Neha Gupta', books: 16 },
//   { name: 'Vikram Singh', books: 15 }
// ];

// const readingSpeed = [
//   { month: 'Jan', avgDays: 14 },
//   { month: 'Feb', avgDays: 12 },
//   { month: 'Mar', avgDays: 15 },
//   { month: 'Apr', avgDays: 10 },
//   { month: 'May', avgDays: 13 },
//   { month: 'Jun', avgDays: 11 }
// ];

// const parentEngagement = [
//   { name: 'Attended', value: 185, color: '#10b981' },
//   { name: 'Not Attended', value: 65, color: '#ef4444' }
// ];

// const parentFeedback = [
//   { name: 'Positive', value: 168, color: '#10b981' },
//   { name: 'Neutral', value: 52, color: '#f59e0b' },
//   { name: 'Negative', value: 30, color: '#ef4444' }
// ];

// const parentMessages = [
//   { month: 'Jan', messages: 45 },
//   { month: 'Feb', messages: 38 },
//   { month: 'Mar', messages: 52 },
//   { month: 'Apr', messages: 48 },
//   { month: 'May', messages: 41 },
//   { month: 'Jun', messages: 55 }
// ];

// const attendanceVsMarks = [
//   { attendance: 95, marks: 92 },
//   { attendance: 88, marks: 85 },
//   { attendance: 92, marks: 88 },
//   { attendance: 78, marks: 72 },
//   { attendance: 85, marks: 80 },
//   { attendance: 90, marks: 87 },
//   { attendance: 82, marks: 78 },
//   { attendance: 96, marks: 94 }
// ];

// const behaviourVsMarks = [
//   { behaviour: 95, marks: 92 },
//   { behaviour: 85, marks: 88 },
//   { behaviour: 78, marks: 75 },
//   { behaviour: 92, marks: 90 },
//   { behaviour: 88, marks: 85 },
//   { behaviour: 82, marks: 80 },
//   { behaviour: 75, marks: 72 }
// ];

// const readingVsPerformance = [
//   { books: 24, performance: 92 },
//   { books: 18, performance: 88 },
//   { books: 12, performance: 82 },
//   { books: 21, performance: 90 },
//   { books: 15, performance: 85 },
//   { books: 9, performance: 78 },
//   { books: 6, performance: 75 }
// ];

// const assignmentVsExam = [
//   { subject: 'Math', assignment: 88, exam: 85 },
//   { subject: 'Science', assignment: 82, exam: 78 },
//   { subject: 'English', assignment: 95, exam: 92 },
//   { subject: 'Hindi', assignment: 90, exam: 88 },
//   { subject: 'Social', assignment: 85, exam: 82 }
// ];

// const lowAttendanceStudents = [
//   { name: 'Vikram Singh', class: '9th A', attendance: 72 },
//   { name: 'Anita Desai', class: '10th B', attendance: 75 },
//   { name: 'Ravi Kumar', class: '8th C', attendance: 78 }
// ];

// const currentlyBorrowedBooks = [
//   { title: 'The Great Gatsby', student: 'Priya Patel', borrowedDate: 'Nov 10, 2025', dueDate: 'Nov 24, 2025', status: 'Active' },
//   { title: 'Physics Vol 2', student: 'Rahul Sharma', borrowedDate: 'Nov 5, 2025', dueDate: 'Nov 19, 2025', status: 'Overdue' },
//   { title: 'Harry Potter', student: 'Amit Kumar', borrowedDate: 'Nov 12, 2025', dueDate: 'Nov 26, 2025', status: 'Active' }
// ];

// const missingAssignments = [
//   { student: 'Vikram Singh', subject: 'Math', assignment: 'Trigonometry', dueDate: 'Nov 15, 2025' },
//   { student: 'Anita Desai', subject: 'Science', assignment: 'Biology Lab', dueDate: 'Nov 12, 2025' },
//   { student: 'Ravi Kumar', subject: 'English', assignment: 'Essay Writing', dueDate: 'Nov 18, 2025' }
// ];

// const projectList = [
//   { student: 'Priya Patel', project: 'Solar System Model', type: 'Science', status: 'Completed', score: 95 },
//   { student: 'Rahul Sharma', project: 'AI Chatbot', type: 'Coding', status: 'In Progress', score: 0 },
//   { student: 'Amit Kumar', project: 'Water Purification', type: 'Science', status: 'Completed', score: 88 }
// ];

// const teacherEvaluations = [
//   { project: 'Solar System Model', teacher: 'Mrs. Sharma', comment: 'Excellent work and presentation', rating: 5 },
//   { project: 'Water Purification', teacher: 'Mr. Gupta', comment: 'Good effort, needs improvement in documentation', rating: 4 }
// ];

// const complaintLog = [
//   { date: 'Nov 15', student: 'Vikram Singh', category: 'Behaviour', severity: 'Medium', status: 'Resolved' },
//   { date: 'Nov 12', student: 'Anita Desai', category: 'Academic', severity: 'Low', status: 'Resolved' },
//   { date: 'Nov 10', student: 'Ravi Kumar', category: 'Transport', severity: 'High', status: 'Unresolved' }
// ];

// const parentConcerns = [
//   { parent: 'Mr. Sharma', concern: 'Child performance in Math', date: 'Nov 14, 2025', status: 'Addressed' },
//   { parent: 'Mrs. Patel', concern: 'Homework load management', date: 'Nov 16, 2025', status: 'Pending' }
// ];

// // Modal Component for Detailed View
// const DetailModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   children: React.ReactNode;
// }> = ({ isOpen, onClose, title, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//           <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="w-6 h-6 text-gray-600" />
//           </button>
//         </div>
//         <div className="p-6">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Compact KPI Card with Hover Effect
// const CompactKPICard: React.FC<{
//   title: string;
//   value: string | number;
//   icon: React.ReactNode;
//   color: string;
//   subtitle?: string;
//   onClick?: () => void;
// }> = ({ title, value, icon, color, subtitle, onClick }) => {
//   return (
//     <div
//       onClick={onClick}
//       className={`bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105 ${
//         onClick ? 'hover:bg-gray-50' : ''
//       }`}
//     >
//       <div className="flex items-center justify-between">
//         <div className="flex-1">
//           <p className="text-xs text-gray-600 font-medium mb-1">{title}</p>
//           <p className={`text-2xl font-bold ${color}`}>{value}</p>
//           {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
//         </div>
//         <div className={`p-2 rounded-full ${color.replace('text-', 'bg-').replace('600', '100')}`}>
//           {icon}
//         </div>
//       </div>
//       {onClick && (
//         <div className="mt-2 flex items-center text-xs text-blue-600">
//           <span>View Details</span>
//           <ChevronRight className="w-3 h-3 ml-1" />
//         </div>
//       )}
//     </div>
//   );
// };

// // Compact Chart Card with Hover
// const CompactChartCard: React.FC<{
//   title: string;
//   children: React.ReactNode;
//   onClick?: () => void;
// }> = ({ title, children, onClick }) => {
//   return (
//     <div
//       onClick={onClick}
//       className={`bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-all ${
//         onClick ? 'cursor-pointer hover:bg-gray-50' : ''
//       }`}
//     >
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
//         {onClick && (
//           <ChevronRight className="w-4 h-4 text-gray-400" />
//         )}
//       </div>
//       {children}
//     </div>
//   );
// };

// // Main Component
// const StudentAnalytics: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [modalContent, setModalContent] = useState<{ isOpen: boolean; title: string; content: React.ReactNode }>({
//     isOpen: false,
//     title: '',
//     content: null
//   });

//   const [filters, setFilters] = useState({
//     class: 'all',
//     section: 'all',
//     student: 'all',
//     gender: 'all',
//     dateRange: 'all',
//     subject: 'all'
//   });

//   const openModal = (title: string, content: React.ReactNode) => {
//     setModalContent({ isOpen: true, title, content });
//   };

//   const closeModal = () => {
//     setModalContent({ isOpen: false, title: '', content: null });
//   };

//   const tabs = [
//     { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
//     { id: 'attendance', label: 'Attendance', icon: <Calendar className="w-4 h-4" /> },
//     { id: 'academic', label: 'Academic', icon: <Award className="w-4 h-4" /> },
//     { id: 'behaviour', label: 'Behaviour', icon: <Users className="w-4 h-4" /> },
//     { id: 'assignments', label: 'Assignments', icon: <FileText className="w-4 h-4" /> },
//     { id: 'projects', label: 'Projects', icon: <CheckCircle className="w-4 h-4" /> },
//     { id: 'library', label: 'Library', icon: <BookOpen className="w-4 h-4" /> },
//     { id: 'insights', label: 'Insights', icon: <AlertCircle className="w-4 h-4" /> },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Fixed Header */}
//       <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
//         <div className="px-6 py-4">
//           <h1 className="text-2xl font-bold text-gray-900">Student Analytics Dashboard</h1>
//           <p className="text-sm text-gray-600 mt-1">Comprehensive insights at a glance</p>
//         </div>

//         {/* Compact Filters */}
//         <div className="px-6 pb-3">
//           <div className="flex flex-wrap gap-2">
//             <select
//               className="text-xs px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={filters.class}
//               onChange={(e) => setFilters({ ...filters, class: e.target.value })}
//             >
//               <option value="all">All Classes</option>
//               <option value="6">6th</option>
//               <option value="7">7th</option>
//               <option value="8">8th</option>
//               <option value="9">9th</option>
//               <option value="10">10th</option>
//             </select>
//             <select
//               className="text-xs px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={filters.section}
//               onChange={(e) => setFilters({ ...filters, section: e.target.value })}
//             >
//               <option value="all">All Sections</option>
//               <option value="A">Section A</option>
//               <option value="B">Section B</option>
//               <option value="C">Section C</option>
//             </select>
//             <select
//               className="text-xs px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={filters.student}
//               onChange={(e) => setFilters({ ...filters, student: e.target.value })}
//             >
//               <option value="all">All Students</option>
//               {sampleStudents.map(student => (
//                 <option key={student.id} value={student.id}>{student.name}</option>
//               ))}
//             </select>
//             <select
//               className="text-xs px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={filters.gender}
//               onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
//             >
//               <option value="all">All Genders</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//             </select>
//             <select
//               className="text-xs px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={filters.dateRange}
//               onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
//             >
//               <option value="all">All Time</option>
//               <option value="week">This Week</option>
//               <option value="month">This Month</option>
//               <option value="quarter">This Quarter</option>
//               <option value="year">This Year</option>
//             </select>
//             <select
//               className="text-xs px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={filters.subject}
//               onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
//             >
//               <option value="all">All Subjects</option>
//               <option value="math">Mathematics</option>
//               <option value="science">Science</option>
//               <option value="english">English</option>
//               <option value="hindi">Hindi</option>
//               <option value="social">Social Studies</option>
//             </select>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="px-6 overflow-x-auto">
//           <div className="flex space-x-1 border-b border-gray-200">
//             {tabs.map(tab => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
//                   activeTab === tab.id
//                     ? 'border-blue-600 text-blue-600'
//                     : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
//                 }`}
//               >
//                 {tab.icon}
//                 <span>{tab.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Content Area - Single View */}
//       <div className="p-6 max-h-[calc(100vh-280px)] overflow-y-auto">
//         {/* Overview Tab */}
//         {activeTab === 'overview' && (
//           <div className="space-y-4">
//             {/* Quick KPIs - 4 columns */}
//             <div className="grid grid-cols-4 gap-3">
//               <CompactKPICard
//                 title="Total Students"
//                 value="1,248"
//                 icon={<Users className="w-5 h-5 text-blue-600" />}
//                 color="text-blue-600"
//               />
//               <CompactKPICard
//                 title="Avg Attendance"
//                 value="91.2%"
//                 icon={<Calendar className="w-5 h-5 text-green-600" />}
//                 color="text-green-600"
//                 subtitle="+2.3% from last month"
//                 onClick={() => setActiveTab('attendance')}
//               />
//               <CompactKPICard
//                 title="Avg Academic Score"
//                 value="85.7"
//                 icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
//                 color="text-purple-600"
//                 subtitle="+3.5 from last term"
//                 onClick={() => setActiveTab('academic')}
//               />
//               <CompactKPICard
//                 title="Behaviour Score"
//                 value="8.5/10"
//                 icon={<Award className="w-5 h-5 text-orange-600" />}
//                 color="text-orange-600"
//                 onClick={() => setActiveTab('behaviour')}
//               />
//             </div>

//             {/* Secondary KPIs - 4 columns */}
//             <div className="grid grid-cols-4 gap-3">
//               <CompactKPICard
//                 title="Books Read"
//                 value="355"
//                 icon={<BookOpen className="w-5 h-5 text-indigo-600" />}
//                 color="text-indigo-600"
//                 subtitle="This semester"
//                 onClick={() => setActiveTab('library')}
//               />
//               <CompactKPICard
//                 title="Assignment Completion"
//                 value="84.1%"
//                 icon={<CheckCircle className="w-5 h-5 text-teal-600" />}
//                 color="text-teal-600"
//                 onClick={() => setActiveTab('assignments')}
//               />
//               <CompactKPICard
//                 title="Projects Completed"
//                 value="45"
//                 icon={<FileText className="w-5 h-5 text-pink-600" />}
//                 color="text-pink-600"
//                 onClick={() => setActiveTab('projects')}
//               />
//               <CompactKPICard
//                 title="Complaints"
//                 value="28"
//                 icon={<AlertCircle className="w-5 h-5 text-red-600" />}
//                 color="text-red-600"
//                 subtitle="12 resolved"
//                 onClick={() => setActiveTab('behaviour')}
//               />
//             </div>

//             {/* Quick Charts - 3 columns */}
//             <div className="grid grid-cols-3 gap-3">
//               <CompactChartCard
//                 title="Attendance Trend"
//                 onClick={() => openModal('Monthly Attendance Trend', (
//                   <ResponsiveContainer width="100%" height={400}>
//                     <LineChart data={monthlyAttendance}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                       <XAxis dataKey="month" stroke="#6b7280" />
//                       <YAxis stroke="#6b7280" />
//                       <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                       <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 ))}
//               >
//                 <ResponsiveContainer width="100%" height={150}>
//                   <LineChart data={monthlyAttendance}>
//                     <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} dot={false} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </CompactChartCard>

//               <CompactChartCard
//                 title="Academic Performance"
//                 onClick={() => openModal('Subject-wise Performance', (
//                   <ResponsiveContainer width="100%" height={400}>
//                     <BarChart data={subjectScores}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                       <XAxis dataKey="subject" stroke="#6b7280" />
//                       <YAxis stroke="#6b7280" />
//                       <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                       <Bar dataKey="score" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 ))}
//               >
//                 <ResponsiveContainer width="100%" height={150}>
//                   <BarChart data={subjectScores}>
//                     <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CompactChartCard>

//               <CompactChartCard
//                 title="Behaviour Distribution"
//                 onClick={() => openModal('Behaviour Overview', (
//                   <div className="space-y-6">
//                     <ResponsiveContainer width="100%" height={400}>
//                       <PieChart>
//                         <Pie
//                           data={behaviourDistribution}
//                           cx="50%"
//                           cy="50%"
//                           labelLine={false}
//                           label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                           outerRadius={120}
//                           fill="#8884d8"
//                           dataKey="value"
//                         >
//                           {behaviourDistribution.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                         <Tooltip />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                 ))}
//               >
//                 <ResponsiveContainer width="100%" height={150}>
//                   <PieChart>
//                     <Pie
//                       data={behaviourDistribution}
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={60}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {behaviourDistribution.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                   </PieChart>
//                 </ResponsiveContainer>
//               </CompactChartCard>
//             </div>

//             {/* Student Profile */}
//             <CompactChartCard title="Featured Student Profile">
//               <div className="flex items-center space-x-4">
//                 <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
//                   <Users className="w-8 h-8 text-blue-600" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-lg font-bold text-gray-900">Priya Patel</h3>
//                   <p className="text-sm text-gray-600">Class 10-A | Roll No: 24</p>
//                 </div>
//                 <div className="grid grid-cols-3 gap-3">
//                   <div className="text-center p-2 bg-blue-50 rounded">
//                     <p className="text-xs text-gray-600">Attendance</p>
//                     <p className="text-lg font-bold text-blue-600">95%</p>
//                   </div>
//                   <div className="text-center p-2 bg-purple-50 rounded">
//                     <p className="text-xs text-gray-600">Avg Marks</p>
//                     <p className="text-lg font-bold text-purple-600">92</p>
//                   </div>
//                   <div className="text-center p-2 bg-green-50 rounded">
//                     <p className="text-xs text-gray-600">Behaviour</p>
//                     <p className="text-lg font-bold text-green-600">9.2/10</p>
//                   </div>
//                 </div>
//               </div>
//             </CompactChartCard>
//           </div>
//         )}

//         {/* Attendance Tab */}
//         {activeTab === 'attendance' && (
//           <div className="grid grid-cols-3 gap-3">
//             <CompactChartCard
//               title="Monthly Trend"
//               onClick={() => openModal('Monthly Attendance Trend', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <LineChart data={monthlyAttendance}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="month" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <LineChart data={monthlyAttendance}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Present vs Absent"
//               onClick={() => openModal('Attendance Distribution', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <PieChart>
//                     <Pie
//                       data={attendanceDistribution}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       outerRadius={120}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {attendanceDistribution.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <PieChart>
//                   <Pie
//                     data={attendanceDistribution}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
//                     outerRadius={70}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {attendanceDistribution.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Class Comparison"
//               onClick={() => openModal('Class-wise Attendance Comparison', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <BarChart data={classAttendanceComparison}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="class" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Bar dataKey="attendance" fill="#10b981" radius={[8, 8, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <BarChart data={classAttendanceComparison}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="class" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Bar dataKey="attendance" fill="#10b981" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Low Attendance Alert"
//               onClick={() => openModal('Low Attendance Students', (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {lowAttendanceStudents.map((student, idx) => (
//                         <tr key={idx}>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{student.attendance}%</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ))}
//             >
//               <div className="space-y-2">
//                 {lowAttendanceStudents.slice(0, 3).map((student, idx) => (
//                   <div key={idx} className="flex justify-between items-center text-xs p-2 bg-red-50 rounded">
//                     <span className="font-medium text-gray-900">{student.name}</span>
//                     <span className="text-red-600 font-bold">{student.attendance}%</span>
//                   </div>
//                 ))}
//               </div>
//             </CompactChartCard>
//           </div>
//         )}

//         {/* Academic Tab */}
//         {activeTab === 'academic' && (
//           <div className="grid grid-cols-3 gap-3">
//             <CompactChartCard
//               title="Subject-wise Scores"
//               onClick={() => openModal('Subject-wise Average Scores', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <BarChart data={subjectScores}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="subject" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Bar dataKey="score" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <BarChart data={subjectScores}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="subject" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Term Comparison"
//               onClick={() => openModal('Term 1 vs Term 2 Comparison', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <BarChart data={termComparison}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="subject" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Legend />
//                     <Bar dataKey="term1" fill="#f59e0b" radius={[8, 8, 0, 0]} />
//                     <Bar dataKey="term2" fill="#10b981" radius={[8, 8, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <BarChart data={termComparison}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="subject" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Bar dataKey="term1" fill="#f59e0b" radius={[4, 4, 0, 0]} />
//                   <Bar dataKey="term2" fill="#10b981" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Performance Growth"
//               onClick={() => openModal('Performance Growth Over Time', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <LineChart data={performanceGrowth}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="exam" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Line type="monotone" dataKey="score" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 6 }} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <LineChart data={performanceGrowth}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="exam" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="score" stroke="#ec4899" strokeWidth={2} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Top Performers"
//               onClick={() => openModal('Top 5 High Performers', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <BarChart data={topPerformers} layout="vertical">
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis type="number" stroke="#6b7280" />
//                     <YAxis type="category" dataKey="name" stroke="#6b7280" width={150} />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Bar dataKey="score" fill="#10b981" radius={[0, 8, 8, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <div className="space-y-2">
//                 {topPerformers.slice(0, 5).map((student, idx) => (
//                   <div key={idx} className="flex justify-between items-center text-xs p-2 bg-green-50 rounded">
//                     <span className="font-medium text-gray-900">{student.name}</span>
//                     <span className="text-green-600 font-bold">{student.score}</span>
//                   </div>
//                 ))}
//               </div>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Marks Distribution"
//               onClick={() => openModal('Marks Distribution', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <BarChart data={marksDistribution}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="range" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <BarChart data={marksDistribution}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="range" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Strengths & Weaknesses"
//               onClick={() => openModal('Student Strengths & Weaknesses', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <RadarChart data={studentStrengthWeakness}>
//                     <PolarGrid stroke="#e5e7eb" />
//                     <PolarAngleAxis dataKey="skill" stroke="#6b7280" />
//                     <PolarRadiusAxis stroke="#6b7280" />
//                     <Radar name="Performance" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
//                     <Tooltip />
//                   </RadarChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <RadarChart data={studentStrengthWeakness}>
//                   <PolarGrid stroke="#e5e7eb" />
//                   <PolarAngleAxis dataKey="skill" stroke="#6b7280" style={{ fontSize: '8px' }} />
//                   <Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
//                 </RadarChart>
//               </ResponsiveContainer>
//             </CompactChartCard>
//           </div>
//         )}

//         {/* Behaviour Tab */}
//         {activeTab === 'behaviour' && (
//           <div className="grid grid-cols-3 gap-3">
//             <CompactChartCard
//               title="Positive vs Negative"
//               onClick={() => openModal('Behaviour Distribution', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <PieChart>
//                     <Pie
//                       data={behaviourDistribution}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       outerRadius={120}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {behaviourDistribution.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <PieChart>
//                   <Pie
//                     data={behaviourDistribution}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     outerRadius={70}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {behaviourDistribution.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Behaviour Trend"
//               onClick={() => openModal('Behaviour Over Time', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <LineChart data={behaviourOverTime}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="month" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Legend />
//                     <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={3} />
//                     <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={3} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <LineChart data={behaviourOverTime}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} />
//                   <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Behaviour Types"
//               onClick={() => openModal('Frequent Behaviour Types', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <BarChart data={behaviourTypes}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="type" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <BarChart data={behaviourTypes}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="type" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Complaints by Category"
//               onClick={() => openModal('Complaints Category Breakdown', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <PieChart>
//                     <Pie
//                       data={complaintsCategory}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       outerRadius={120}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {complaintsCategory.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <PieChart>
//                   <Pie
//                     data={complaintsCategory}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     outerRadius={70}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {complaintsCategory.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Complaint Severity"
//               onClick={() => openModal('Complaint Severity Trend', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <LineChart data={complaintsSeverity}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="month" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Legend />
//                     <Line type="monotone" dataKey="high" stroke="#ef4444" strokeWidth={3} />
//                     <Line type="monotone" dataKey="medium" stroke="#f59e0b" strokeWidth={3} />
//                     <Line type="monotone" dataKey="low" stroke="#10b981" strokeWidth={3} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <LineChart data={complaintsSeverity}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="high" stroke="#ef4444" strokeWidth={2} />
//                   <Line type="monotone" dataKey="medium" stroke="#f59e0b" strokeWidth={2} />
//                   <Line type="monotone" dataKey="low" stroke="#10b981" strokeWidth={2} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Resolution Status"
//               onClick={() => openModal('Resolved vs Unresolved Complaints', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <PieChart>
//                     <Pie
//                       data={complaintsStatus}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       outerRadius={120}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {complaintsStatus.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <PieChart>
//                   <Pie
//                     data={complaintsStatus}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     outerRadius={70}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {complaintsStatus.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </CompactChartCard>
//           </div>
//         )}

//         {/* Assignments Tab */}
//         {activeTab === 'assignments' && (
//           <div className="grid grid-cols-3 gap-3">
//             <CompactChartCard
//               title="On-Time vs Late"
//               onClick={() => openModal('Assignment Submission Status', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <PieChart>
//                     <Pie
//                       data={assignmentSubmission}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       outerRadius={120}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {assignmentSubmission.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <PieChart>
//                   <Pie
//                     data={assignmentSubmission}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     outerRadius={70}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {assignmentSubmission.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Subject-wise Completion"
//               onClick={() => openModal('Subject-wise Assignment Completion', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <BarChart data={subjectAssignmentCompletion}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="subject" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Bar dataKey="completion" fill="#10b981" radius={[8, 8, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <BarChart data={subjectAssignmentCompletion}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="subject" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Bar dataKey="completion" fill="#10b981" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Weekly Trend"
//               onClick={() => openModal('Weekly Assignment Completion Trend', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <LineChart data={weeklyAssignmentTrend}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="week" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Line type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <LineChart data={weeklyAssignmentTrend}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="week" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={2} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Assignment Scores"
//               onClick={() => openModal('Assignment Scores Overview', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <BarChart data={assignmentScores}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="assignment" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Bar dataKey="score" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <BarChart data={assignmentScores}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="assignment" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Missing Assignments"
//               onClick={() => openModal('Missing Assignments List', (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {missingAssignments.map((item, idx) => (
//                         <tr key={idx}>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.student}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.subject}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.assignment}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{item.dueDate}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ))}
//             >
//               <div className="space-y-2">
//                 {missingAssignments.map((item, idx) => (
//                   <div key={idx} className="text-xs p-2 bg-red-50 rounded">
//                     <p className="font-medium text-gray-900">{item.student}</p>
//                     <p className="text-gray-600">{item.subject} - {item.assignment}</p>
//                   </div>
//                 ))}
//               </div>
//             </CompactChartCard>
//           </div>
//         )}

//         {/* Projects Tab */}
//         {activeTab === 'projects' && (
//           <div className="grid grid-cols-3 gap-3">
//             <CompactChartCard
//               title="Project Status"
//               onClick={() => openModal('Project Completion Status', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <PieChart>
//                     <Pie
//                       data={projectStatus}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       outerRadius={120}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {projectStatus.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <PieChart>
//                   <Pie
//                     data={projectStatus}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     outerRadius={70}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {projectStatus.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Project Types"
//               onClick={() => openModal('Project Types Distribution', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <BarChart data={projectTypes}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="type" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Bar dataKey="count" fill="#ec4899" radius={[8, 8, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <BarChart data={projectTypes}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="type" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Bar dataKey="count" fill="#ec4899" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Score Distribution"
//               onClick={() => openModal('Project Score Distribution', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <BarChart data={projectScores}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="range" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <BarChart data={projectScores}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="range" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Timeline"
//               onClick={() => openModal('Project Completion Timeline', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <LineChart data={projectTimeline}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="month" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <LineChart data={projectTimeline}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Skills Analysis"
//               onClick={() => openModal('Skills Involved in Projects', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <RadarChart data={projectSkills}>
//                     <PolarGrid stroke="#e5e7eb" />
//                     <PolarAngleAxis dataKey="skill" stroke="#6b7280" />
//                     <PolarRadiusAxis stroke="#6b7280" />
//                     <Radar name="Skills" dataKey="value" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
//                     <Tooltip />
//                   </RadarChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <RadarChart data={projectSkills}>
//                   <PolarGrid stroke="#e5e7eb" />
//                   <PolarAngleAxis dataKey="skill" stroke="#6b7280" style={{ fontSize: '8px' }} />
//                   <Radar dataKey="value" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
//                 </RadarChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Project List"
//               onClick={() => openModal('Student Projects', (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {projectList.map((item, idx) => (
//                         <tr key={idx}>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.student}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.project}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`px-2 py-1 text-xs rounded-full ${
//                               item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                             }`}>{item.status}</span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.score || '-'}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ))}
//             >
//               <div className="space-y-2">
//                 {projectList.map((item, idx) => (
//                   <div key={idx} className="text-xs p-2 bg-purple-50 rounded">
//                     <p className="font-medium text-gray-900">{item.project}</p>
//                     <p className="text-gray-600">{item.student} - {item.type}</p>
//                   </div>
//                 ))}
//               </div>
//             </CompactChartCard>
//           </div>
//         )}

//         {/* Library Tab */}
//         {activeTab === 'library' && (
//           <div className="grid grid-cols-3 gap-3">
//             <CompactChartCard
//               title="Monthly Borrowing"
//               onClick={() => openModal('Books Borrowed Per Month', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <AreaChart data={booksBorrowedMonthly}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="month" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Area type="monotone" dataKey="books" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <AreaChart data={booksBorrowedMonthly}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Area type="monotone" dataKey="books" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Reading Genres"
//               onClick={() => openModal('Most Read Genres', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <PieChart>
//                     <Pie
//                       data={readingGenres}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       outerRadius={120}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {readingGenres.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <PieChart>
//                   <Pie
//                     data={readingGenres}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     outerRadius={70}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {readingGenres.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Top Readers"
//               onClick={() => openModal('Top Readers in Class', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <BarChart data={topReaders} layout="vertical">
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis type="number" stroke="#6b7280" />
//                     <YAxis type="category" dataKey="name" stroke="#6b7280" width={150} />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Bar dataKey="books" fill="#10b981" radius={[0, 8, 8, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <div className="space-y-2">
//                 {topReaders.slice(0, 5).map((reader, idx) => (
//                   <div key={idx} className="flex justify-between items-center text-xs p-2 bg-green-50 rounded">
//                     <span className="font-medium text-gray-900">{reader.name}</span>
//                     <span className="text-green-600 font-bold">{reader.books} books</span>
//                   </div>
//                 ))}
//               </div>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Reading Speed"
//               onClick={() => openModal('Reading Speed Trend', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <LineChart data={readingSpeed}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="month" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Line type="monotone" dataKey="avgDays" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 6 }} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <LineChart data={readingSpeed}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="avgDays" stroke="#f59e0b" strokeWidth={2} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Currently Borrowed"
//               onClick={() => openModal('Currently Borrowed Books', (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book Title</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrowed</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {currentlyBorrowedBooks.map((book, idx) => (
//                         <tr key={idx}>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.title}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.student}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.borrowedDate}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.dueDate}</td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`px-2 py-1 text-xs rounded-full ${
//                               book.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                             }`}>{book.status}</span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ))}
//             >
//               <div className="space-y-2">
//                 {currentlyBorrowedBooks.map((book, idx) => (
//                   <div key={idx} className={`text-xs p-2 rounded ${book.status === 'Active' ? 'bg-green-50' : 'bg-red-50'}`}>
//                     <p className="font-medium text-gray-900">{book.title}</p>
//                     <p className="text-gray-600">{book.student}</p>
//                   </div>
//                 ))}
//               </div>
//             </CompactChartCard>
//           </div>
//         )}

//         {/* Insights Tab */}
//         {activeTab === 'insights' && (
//           <div className="grid grid-cols-2 gap-3">
//             <CompactChartCard
//               title="Attendance vs Performance"
//               onClick={() => openModal('Attendance vs Academic Performance', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <ScatterChart>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="attendance" name="Attendance %" stroke="#6b7280" />
//                     <YAxis dataKey="marks" name="Marks" stroke="#6b7280" />
//                     <Tooltip cursor={{ strokeDasharray: '3 3' }} />
//                     <Scatter name="Students" data={attendanceVsMarks} fill="#3b82f6" />
//                   </ScatterChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <ScatterChart>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="attendance" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis dataKey="marks" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Scatter data={attendanceVsMarks} fill="#3b82f6" />
//                 </ScatterChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Behaviour vs Performance"
//               onClick={() => openModal('Behaviour vs Academic Performance', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <ScatterChart>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="behaviour" name="Behaviour Score" stroke="#6b7280" />
//                     <YAxis dataKey="marks" name="Marks" stroke="#6b7280" />
//                     <Tooltip cursor={{ strokeDasharray: '3 3' }} />
//                     <Scatter name="Students" data={behaviourVsMarks} fill="#10b981" />
//                   </ScatterChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <ScatterChart>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="behaviour" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis dataKey="marks" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Scatter data={behaviourVsMarks} fill="#10b981" />
//                 </ScatterChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Reading vs Performance"
//               onClick={() => openModal('Reading Habit vs Performance', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <ScatterChart>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="books" name="Books Read" stroke="#6b7280" />
//                     <YAxis dataKey="performance" name="Performance Score" stroke="#6b7280" />
//                     <Tooltip cursor={{ strokeDasharray: '3 3' }} />
//                     <Scatter name="Students" data={readingVsPerformance} fill="#ec4899" />
//                   </ScatterChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <ScatterChart>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="books" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis dataKey="performance" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Scatter data={readingVsPerformance} fill="#ec4899" />
//                 </ScatterChart>
//               </ResponsiveContainer>
//             </CompactChartCard>

//             <CompactChartCard
//               title="Assignment vs Exam Score"
//               onClick={() => openModal('Assignment Completion vs Exam Performance', (
//                 <ResponsiveContainer width="100%" height={400}>
//                   <BarChart data={assignmentVsExam}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis dataKey="subject" stroke="#6b7280" />
//                     <YAxis stroke="#6b7280" />
//                     <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
//                     <Legend />
//                     <Bar dataKey="assignment" fill="#f59e0b" name="Assignment Avg" radius={[8, 8, 0, 0]} />
//                     <Bar dataKey="exam" fill="#3b82f6" name="Exam Score" radius={[8, 8, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ))}
//             >
//               <ResponsiveContainer width="100%" height={180}>
//                 <BarChart data={assignmentVsExam}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="subject" stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
//                   <Tooltip />
//                   <Bar dataKey="assignment" fill="#f59e0b" radius={[4, 4, 0, 0]} />
//                   <Bar dataKey="exam" fill="#3b82f6" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CompactChartCard>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       <DetailModal
//         isOpen={modalContent.isOpen}
//         onClose={closeModal}
//         title={modalContent.title}
//       >
//         {modalContent.content}
//       </DetailModal>
//     </div>
//   );
// };

// export default StudentAnalytics;
import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, Area, AreaChart, ComposedChart
} from 'recharts';
import { Calendar, Book, Users, TrendingUp, Award, FileText, AlertCircle, DollarSign, MessageSquare, User } from 'lucide-react';

// Sample Data
const generateSampleData = () => {
  return {
    students: [
      { id: 1, name: "Rahul Sharma", class: "10", section: "A", gender: "Male", photo: "👨‍🎓" },
      { id: 2, name: "Priya Patel", class: "10", section: "A", gender: "Female", photo: "👩‍🎓" },
      { id: 3, name: "Amit Kumar", class: "10", section: "B", gender: "Male", photo: "👨‍🎓" },
      { id: 4, name: "Sneha Singh", class: "9", section: "A", gender: "Female", photo: "👩‍🎓" },
      { id: 5, name: "Vikram Mehta", class: "9", section: "B", gender: "Male", photo: "👨‍🎓" },
    ],
    monthlyAttendance: [
      { month: 'Jan', attendance: 92 },
      { month: 'Feb', attendance: 88 },
      { month: 'Mar', attendance: 95 },
      { month: 'Apr', attendance: 90 },
      { month: 'May', attendance: 87 },
      { month: 'Jun', attendance: 93 },
    ],
    subjectScores: [
      { subject: 'Math', score: 85 },
      { subject: 'Science', score: 78 },
      { subject: 'English', score: 92 },
      { subject: 'Hindi', score: 88 },
      { subject: 'Social', score: 82 },
    ],
    behaviourData: [
      { month: 'Jan', score: 85 },
      { month: 'Feb', score: 88 },
      { month: 'Mar', score: 82 },
      { month: 'Apr', score: 90 },
      { month: 'May', score: 87 },
    ],
    assignmentCompletion: [
      { subject: 'Math', completed: 18, total: 20 },
      { subject: 'Science', completed: 15, total: 18 },
      { subject: 'English', completed: 20, total: 20 },
      { subject: 'Hindi', completed: 16, total: 18 },
    ],
    projectData: [
      { type: 'Science', completed: 5, inProgress: 2 },
      { type: 'Math', completed: 3, inProgress: 1 },
      { type: 'Robotics', completed: 2, inProgress: 3 },
      { type: 'Art', completed: 4, inProgress: 1 },
    ],
    booksRead: [
      { month: 'Jan', books: 4 },
      { month: 'Feb', books: 6 },
      { month: 'Mar', books: 5 },
      { month: 'Apr', books: 8 },
      { month: 'May', books: 7 },
    ],
  };
};

const StudentAnalyticsDashboard = () => {
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const data = generateSampleData();

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const KPICard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          {trend && <p className={`text-xs mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
          </p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const attendanceData = [
    { name: 'Present', value: 92 },
    { name: 'Absent', value: 8 },
  ];

  const behaviourTypes = [
    { type: 'Positive', count: 45 },
    { type: 'Negative', count: 8 },
  ];

  const complaintsByCategory = [
    { category: 'Discipline', value: 12 },
    { category: 'Academic', value: 8 },
    { category: 'Bullying', value: 5 },
    { category: 'Other', value: 3 },
  ];

  const submissionData = [
    { name: 'On-Time', value: 75 },
    { name: 'Late', value: 25 },
  ];

  const projectStatus = [
    { name: 'Completed', value: 14 },
    { name: 'In Progress', value: 7 },
  ];

  const genreData = [
    { genre: 'Fiction', value: 35 },
    { genre: 'Science', value: 25 },
    { genre: 'History', value: 20 },
    { genre: 'Biography', value: 20 },
  ];

  const termComparison = [
    { subject: 'Math', term1: 82, term2: 85 },
    { subject: 'Science', term1: 75, term2: 78 },
    { subject: 'English', term1: 88, term2: 92 },
    { subject: 'Hindi', term1: 85, term2: 88 },
  ];

  const performanceGrowth = [
    { month: 'Jan', score: 78 },
    { month: 'Feb', score: 80 },
    { month: 'Mar', score: 82 },
    { month: 'Apr', score: 85 },
    { month: 'May', score: 87 },
    { month: 'Jun', score: 88 },
  ];

  const topPerformers = [
    { name: 'Priya Patel', score: 95 },
    { name: 'Rahul Sharma', score: 92 },
    { name: 'Sneha Singh', score: 90 },
    { name: 'Amit Kumar', score: 88 },
    { name: 'Vikram Mehta', score: 86 },
  ];

  const lowPerformers = [
    { name: 'Student E', score: 65 },
    { name: 'Student F', score: 62 },
    { name: 'Student G', score: 60 },
    { name: 'Student H', score: 58 },
    { name: 'Student I', score: 55 },
  ];

  const strengthWeakness = [
    { subject: 'Math', value: 85 },
    { subject: 'Science', value: 78 },
    { subject: 'English', value: 92 },
    { subject: 'Hindi', value: 88 },
    { subject: 'Social', value: 82 },
    { subject: 'Computer', value: 90 },
  ];

  const attendanceVsMarks = [
    { attendance: 95, marks: 92 },
    { attendance: 88, marks: 85 },
    { attendance: 92, marks: 88 },
    { attendance: 75, marks: 72 },
    { attendance: 98, marks: 95 },
    { attendance: 85, marks: 80 },
    { attendance: 70, marks: 68 },
  ];

  const behaviourVsMarks = [
    { behaviour: 90, marks: 92 },
    { behaviour: 85, marks: 88 },
    { behaviour: 75, marks: 78 },
    { behaviour: 95, marks: 95 },
    { behaviour: 80, marks: 82 },
    { behaviour: 70, marks: 75 },
  ];

  const weeklyAttendanceHeatmap = [
    { day: 'Mon', week1: 95, week2: 92, week3: 88, week4: 90 },
    { day: 'Tue', week1: 93, week2: 90, week3: 85, week4: 88 },
    { day: 'Wed', week1: 90, week2: 88, week3: 92, week4: 95 },
    { day: 'Thu', week1: 92, week2: 85, week3: 90, week4: 92 },
    { day: 'Fri', week1: 88, week2: 90, week3: 93, week4: 88 },
  ];

  const classAttendance = [
    { class: '6A', attendance: 92 },
    { class: '7A', attendance: 88 },
    { class: '8A', attendance: 95 },
    { class: '9A', attendance: 90 },
    { class: '10A', attendance: 93 },
  ];

  const lowAttendanceStudents = [
    { name: 'Student X', attendance: 65, absent: 35 },
    { name: 'Student Y', attendance: 70, absent: 30 },
    { name: 'Student Z', attendance: 72, absent: 28 },
  ];

  const assignmentScores = [
    { assignment: 'A1', score: 85 },
    { assignment: 'A2', score: 88 },
    { assignment: 'A3', score: 82 },
    { assignment: 'A4', score: 90 },
    { assignment: 'A5', score: 87 },
  ];

  const missingAssignments = [
    { student: 'Amit Kumar', subject: 'Math', assignment: 'Chapter 5 Exercise', dueDate: '2025-11-10' },
    { student: 'Vikram Mehta', subject: 'Science', assignment: 'Lab Report', dueDate: '2025-11-12' },
  ];

  const projectSkills = [
    { skill: 'Creativity', score: 85 },
    { skill: 'Teamwork', score: 90 },
    { skill: 'Research', score: 78 },
    { skill: 'Presentation', score: 88 },
    { skill: 'Technical', score: 82 },
  ];

  const complaintResolution = [
    { name: 'Resolved', value: 75 },
    { name: 'Pending', value: 25 },
  ];

  const parentSentiment = [
    { name: 'Positive', value: 70 },
    { name: 'Neutral', value: 20 },
    { name: 'Negative', value: 10 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive analysis of student performance and engagement</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Classes</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
              <select 
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
              <select 
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Students</option>
                {data.students.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select 
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Subjects</option>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <input 
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-x-auto">
          <div className="flex border-b">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'attendance', label: 'Attendance' },
              { id: 'academic', label: 'Academic' },
              { id: 'behaviour', label: 'Behaviour' },
              { id: 'assignments', label: 'Assignments' },
              { id: 'projects', label: 'Projects' },
              { id: 'library', label: 'Library' },
              { id: 'fees', label: 'Fees' },
              { id: 'parent', label: 'Parent' },
              { id: 'profile', label: 'Profile' },
              { id: 'insights', label: 'Insights' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard title="Total Students" value="156" icon={Users} color="bg-blue-500" trend={5} />
              <KPICard title="Avg Attendance" value="92%" icon={Calendar} color="bg-green-500" trend={2} />
              <KPICard title="Avg Academic Score" value="85.5" icon={Award} color="bg-yellow-500" trend={3} />
              <KPICard title="Behaviour Score" value="87" icon={TrendingUp} color="bg-purple-500" trend={-1} />
              <KPICard title="Books Read" value="240" icon={Book} color="bg-pink-500" trend={8} />
              <KPICard title="Assignment Completion" value="88%" icon={FileText} color="bg-indigo-500" trend={4} />
              <KPICard title="Projects Completed" value="42" icon={Award} color="bg-teal-500" trend={12} />
              <KPICard title="Complaints Logged" value="28" icon={AlertCircle} color="bg-red-500" trend={-5} />
            </div>

            {/* Quick Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Monthly Attendance Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.monthlyAttendance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Subject-wise Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.subjectScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Monthly Attendance Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.monthlyAttendance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Present vs Absent</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Class Attendance Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={classAttendance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="class" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendance" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Low Attendance Students</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Student Name</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Attendance %</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Days Absent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowAttendanceStudents.map((student, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="px-4 py-2">{student.name}</td>
                          <td className="px-4 py-2">
                            <span className="text-red-600 font-medium">{student.attendance}%</span>
                          </td>
                          <td className="px-4 py-2">{student.absent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Academic Tab */}
        {activeTab === 'academic' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Subject-wise Scores</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.subjectScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Term 1 vs Term 2</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={termComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="term1" fill="#3b82f6" name="Term 1" />
                    <Bar dataKey="term2" fill="#10b981" name="Term 2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Performance Growth Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Student Strength & Weakness</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={strengthWeakness}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Top 5 High Performers</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topPerformers} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Lowest 5 Performers</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={lowPerformers} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Behaviour Tab */}
        {activeTab === 'behaviour' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard title="Behaviour Score" value="87/100" icon={TrendingUp} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Positive vs Negative Behaviour</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={behaviourTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, count }) => `${type}: ${count}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {behaviourTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Behaviour Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.behaviourData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Complaints by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={complaintsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, value }) => `${category}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {complaintsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Resolved vs Unresolved Complaints</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={complaintResolution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {complaintResolution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f59e0b'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard title="Completion Rate" value="88%" icon={FileText} color="bg-indigo-500" trend={4} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">On-Time vs Late Submission</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={submissionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {submissionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f59e0b'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Subject-wise Assignment Completion</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.assignmentCompletion}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#10b981" name="Completed" />
                    <Bar dataKey="total" fill="#e5e7eb" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Assignment Scores</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={assignmentScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="assignment" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Missing Assignments</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Student</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Subject</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Assignment</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {missingAssignments.map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="px-4 py-2">{item.student}</td>
                          <td className="px-4 py-2">{item.subject}</td>
                          <td className="px-4 py-2">{item.assignment}</td>
                          <td className="px-4 py-2 text-red-600">{item.dueDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Completed vs In-Progress Projects</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f59e0b'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Project Types Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.projectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
                    <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" name="In Progress" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Skills Assessment</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={projectSkills}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Projects</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Solar System Model', type: 'Science', status: 'Completed', score: 92 },
                    { name: 'Math Puzzle Game', type: 'Math', status: 'In Progress', score: null },
                    { name: 'Robotics Car', type: 'Robotics', status: 'In Progress', score: null },
                    { name: 'Historical Timeline', type: 'History', status: 'Completed', score: 88 },
                  ].map((project, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{project.name}</p>
                        <p className="text-sm text-gray-600">{project.type}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs ${
                          project.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status}
                        </span>
                        {project.score && <p className="text-sm font-medium mt-1">{project.score}/100</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Library Tab */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard title="Books Read" value="240" icon={Book} color="bg-pink-500" trend={8} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Books Borrowed Per Month</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.booksRead}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="books" stroke="#ec4899" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Most Read Genres</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genreData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ genre, value }) => `${genre}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Top Readers</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Priya Patel', books: 28, class: '10A' },
                    { name: 'Rahul Sharma', books: 24, class: '10A' },
                    { name: 'Sneha Singh', books: 22, class: '9A' },
                    { name: 'Amit Kumar', books: 20, class: '10B' },
                    { name: 'Vikram Mehta', books: 18, class: '9B' },
                  ].map((reader, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{reader.name}</p>
                        <p className="text-sm text-gray-600">{reader.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-pink-600">{reader.books}</p>
                        <p className="text-xs text-gray-600">books</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Currently Borrowed Books</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Book Title</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { title: 'Harry Potter', dueDate: '2025-11-25' },
                        { title: 'The Science Book', dueDate: '2025-11-28' },
                        { title: 'Indian History', dueDate: '2025-11-20' },
                      ].map((book, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="px-4 py-2">{book.title}</td>
                          <td className="px-4 py-2">{book.dueDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fees Tab */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard title="Total Fee Paid" value="₹45,000" icon={DollarSign} color="bg-green-500" />
              <KPICard title="Pending Fees" value="₹5,000" icon={AlertCircle} color="bg-red-500" />
              <KPICard title="Next Due Date" value="Dec 1, 2025" icon={Calendar} color="bg-yellow-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Fee Payment History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Amount</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Mode</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { date: '2025-10-01', amount: '₹15,000', mode: 'Online', status: 'Paid' },
                        { date: '2025-08-01', amount: '₹15,000', mode: 'Cash', status: 'Paid' },
                        { date: '2025-06-01', amount: '₹15,000', mode: 'Cheque', status: 'Paid' },
                      ].map((payment, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="px-4 py-2">{payment.date}</td>
                          <td className="px-4 py-2 font-medium">{payment.amount}</td>
                          <td className="px-4 py-2">{payment.mode}</td>
                          <td className="px-4 py-2">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Fee Breakdown</h3>
                <div className="space-y-4">
                  {[
                    { category: 'Tuition Fee', amount: 30000, paid: 30000 },
                    { category: 'Library Fee', amount: 2000, paid: 2000 },
                    { category: 'Lab Fee', amount: 5000, paid: 5000 },
                    { category: 'Transport Fee', amount: 8000, paid: 8000 },
                    { category: 'Exam Fee', amount: 5000, paid: 0 },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.category}</span>
                        <span>₹{item.paid} / ₹{item.amount}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.paid === item.amount ? 'bg-green-500' : 'bg-yellow-500'}`}
                          style={{ width: `${(item.paid / item.amount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Parent Engagement Tab */}
        {activeTab === 'parent' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard title="PTM Attendance" value="85%" icon={Users} color="bg-indigo-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Parent Feedback Sentiment</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={parentSentiment}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {parentSentiment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={
                          entry.name === 'Positive' ? '#10b981' : 
                          entry.name === 'Neutral' ? '#f59e0b' : '#ef4444'
                        } />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Parent Messages</h3>
                <div className="space-y-3">
                  {[
                    { parent: 'Mrs. Sharma', message: 'Thank you for the progress update', date: '2025-11-15', type: 'Positive' },
                    { parent: 'Mr. Patel', message: 'Concerned about homework load', date: '2025-11-14', type: 'Concern' },
                    { parent: 'Mrs. Singh', message: 'Request for PTM meeting', date: '2025-11-13', type: 'Neutral' },
                  ].map((msg, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-gray-900">{msg.parent}</p>
                        <span className={`px-2 py-1 rounded text-xs ${
                          msg.type === 'Positive' ? 'bg-green-100 text-green-800' :
                          msg.type === 'Concern' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {msg.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{msg.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{msg.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start space-x-6">
                <div className="text-6xl">👨‍🎓</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Rahul Sharma</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Class</p>
                      <p className="font-medium">10 - A</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Roll Number</p>
                      <p className="font-medium">2025</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Gender</p>
                      <p className="font-medium">Male</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date of Birth</p>
                      <p className="font-medium">15-Mar-2009</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Attendance</h3>
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-blue-600">92%</p>
                <p className="text-sm text-gray-600 mt-1">165/180 days present</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Avg Marks</h3>
                  <Award className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-green-600">85.5</p>
                <p className="text-sm text-gray-600 mt-1">Rank: 8/156</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Behaviour</h3>
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-purple-600">87/100</p>
                <p className="text-sm text-gray-600 mt-1">Excellent conduct</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Books Read</h3>
                  <Book className="w-5 h-5 text-pink-500" />
                </div>
                <p className="text-3xl font-bold text-pink-600">28</p>
                <p className="text-sm text-gray-600 mt-1">This semester</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Assignments</h3>
                  <FileText className="w-5 h-5 text-indigo-500" />
                </div>
                <p className="text-3xl font-bold text-indigo-600">92%</p>
                <p className="text-sm text-gray-600 mt-1">69/75 completed</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Projects</h3>
                  <Award className="w-5 h-5 text-teal-500" />
                </div>
                <p className="text-3xl font-bold text-teal-600">12</p>
                <p className="text-sm text-gray-600 mt-1">8 completed, 4 ongoing</p>
              </div>
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Cross-Domain Analytics</h2>
              <p>Discover correlations and insights across different performance metrics</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Attendance vs Marks Correlation</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="attendance" name="Attendance %" />
                    <YAxis dataKey="marks" name="Marks" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Students" data={attendanceVsMarks} fill="#3b82f6" />
                  </ScatterChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-600 mt-2">
                  Strong positive correlation: Higher attendance typically leads to better academic performance
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Behaviour vs Marks Correlation</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="behaviour" name="Behaviour Score" />
                    <YAxis dataKey="marks" name="Marks" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Students" data={behaviourVsMarks} fill="#8b5cf6" />
                  </ScatterChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-600 mt-2">
                  Good behaviour correlates with better academic outcomes
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Reading Habit vs Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={[
                    { month: 'Jan', books: 4, marks: 78 },
                    { month: 'Feb', books: 6, marks: 80 },
                    { month: 'Mar', books: 5, marks: 82 },
                    { month: 'Apr', books: 8, marks: 85 },
                    { month: 'May', books: 7, marks: 87 },
                    { month: 'Jun', books: 9, marks: 88 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="books" fill="#ec4899" name="Books Read" />
                    <Line yAxisId="right" type="monotone" dataKey="marks" stroke="#10b981" strokeWidth={2} name="Marks" />
                  </ComposedChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-600 mt-2">
                  Students who read more books show consistent improvement in academic scores
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Assignment Completion vs Exam Marks</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={[
                    { subject: 'Math', completion: 90, marks: 85 },
                    { subject: 'Science', completion: 83, marks: 78 },
                    { subject: 'English', completion: 100, marks: 92 },
                    { subject: 'Hindi', completion: 89, marks: 88 },
                    { subject: 'Social', completion: 85, marks: 82 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completion" fill="#f59e0b" name="Completion %" />
                    <Line type="monotone" dataKey="marks" stroke="#3b82f6" strokeWidth={2} name="Exam Marks" />
                  </ComposedChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-600 mt-2">
                  Higher assignment completion rates directly impact exam performance
                </p>
              </div>
            </div>

            {/* Key Insights Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Positive Trends
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                    <p className="text-sm text-gray-700">
                      <strong>92% attendance rate</strong> - Above target of 90%
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                    <p className="text-sm text-gray-700">
                      <strong>Reading engagement up 8%</strong> - Students reading more consistently
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                    <p className="text-sm text-gray-700">
                      <strong>Project completion at 67%</strong> - On track for year-end goals
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                    <p className="text-sm text-gray-700">
                      <strong>Behaviour incidents down 5%</strong> - Improved classroom environment
                    </p>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                  Areas of Concern
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></span>
                    <p className="text-sm text-gray-700">
                      <strong>3 students with attendance below 70%</strong> - Requires immediate intervention
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></span>
                    <p className="text-sm text-gray-700">
                      <strong>Science scores 7% below average</strong> - Additional support needed
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></span>
                    <p className="text-sm text-gray-700">
                      <strong>12% late assignment submissions</strong> - Time management coaching required
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></span>
                    <p className="text-sm text-gray-700">
                      <strong>28 complaints logged this term</strong> - Monitor behaviour patterns
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                <Award className="w-5 h-5 mr-2 text-blue-500" />
                AI-Powered Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">Focus on Science Subject</h4>
                  <p className="text-sm text-gray-600">
                    Schedule additional tutoring sessions and practical labs to improve understanding
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">Reward Top Readers</h4>
                  <p className="text-sm text-gray-600">
                    Implement a reading rewards program to maintain high engagement levels
                  </p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">Attendance Intervention</h4>
                  <p className="text-sm text-gray-600">
                    Contact parents of low-attendance students and create personalized improvement plans
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">Parent Engagement</h4>
                  <p className="text-sm text-gray-600">
                    Increase PTM frequency and share monthly progress reports to boost parent involvement
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAnalyticsDashboard;