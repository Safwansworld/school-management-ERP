// // import React, { useState, useEffect } from 'react';
// // import { supabase } from '../../lib/supabase';
// // import { useAuth } from '../../context/AuthContext';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { 
// //   Calendar, 
// //   Clock, 
// //   BookOpen, 
// //   MapPin, 
// //   FileText, 
// //   AlertCircle,
// //   CheckCircle,
// //   XCircle,
// //   Search,
// //   Filter,
// //   ChevronRight,
// //   Calendar as CalendarIcon
// // } from 'lucide-react';

// // interface ExamSchedule {
// //   id: string;
// //   exam_name: string;
// //   exam_type: string;
// //   exam_date: string;
// //   start_time: string;
// //   end_time: string;
// //   duration_minutes: number;
// //   room_number: string;
// //   max_marks: number;
// //   passing_marks: number;
// //   instructions: string;
// //   syllabus_coverage: string;
// //   status: string;
// //   subjects?: {
// //     subject_name: string;
// //     subject_code: string;
// //   };
// //   classes?: {
// //     id: string;
// //     class_name: string;
// //     section: string;
// //   };
// // }

// // const StudentExamView: React.FC = () => {
// //   const { user } = useAuth();
// //   const [exams, setExams] = useState<ExamSchedule[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [statusFilter, setStatusFilter] = useState<string>('all');
// //   const [selectedExam, setSelectedExam] = useState<ExamSchedule | null>(null);
// //   const [studentClass, setStudentClass] = useState<string>('');

// //   useEffect(() => {
// //     fetchStudentExams();
// //   }, [user]);

// //   const fetchStudentExams = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       // Step 1: Get student_id from student_profiles
// //       const { data: studentProfile, error: studentError } = await supabase
// //         .from('student_profiles')
// //         .select('student_id, full_name, class_name, section')
// //         .eq('id', user?.id)
// //         .single();

// //       if (studentError) {
// //         throw new Error('Could not load your student profile. Please contact administration.');
// //       }

// //       if (!studentProfile?.student_id) {
// //         setError('Your student profile is incomplete. Please contact administration.');
// //         setLoading(false);
// //         return;
// //       }

// //       // Step 2: Get class_id from class_assignments
// //       const { data: classAssignment, error: assignmentError } = await supabase
// //         .from('class_assignments')
// //         .select('class_id, class_name, academic_year')
// //         .eq('student_id', studentProfile.student_id)
// //         .order('assigned_at', { ascending: false })
// //         .limit(1)
// //         .maybeSingle();

// //       if (assignmentError) {
// //         throw assignmentError;
// //       }

// //       if (!classAssignment?.class_id) {
// //         setError('You are not assigned to any class yet. Please contact administration.');
// //         setLoading(false);
// //         return;
// //       }

// //       setStudentClass(classAssignment.class_name || `${studentProfile.class_name} - ${studentProfile.section}`);

// //       // Step 3: Fetch exams for this class
// //       const { data: examData, error: examError } = await supabase
// //         .from('exam_schedules')
// //         .select(`
// //           *,
// //           subjects:subject_id (
// //             subject_name,
// //             subject_code
// //           ),
// //           classes:class_id (
// //             id,
// //             class_name,
// //             section
// //           )
// //         `)
// //         .eq('class_id', classAssignment.class_id)
// //         .order('exam_date', { ascending: true });

// //       if (examError) {
// //         throw examError;
// //       }

// //       setExams(examData || []);
// //     } catch (err: any) {
// //       console.error('Error fetching student exams:', err);
// //       setError(err.message || 'Failed to load your exam schedule');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Filter exams
// //   const filteredExams = exams.filter(exam => {
// //     const matchesSearch = searchTerm === '' || 
// //       exam.exam_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       exam.subjects?.subject_name.toLowerCase().includes(searchTerm.toLowerCase());
    
// //     const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;

// //     return matchesSearch && matchesStatus;
// //   });

// //   // Group exams by status
// //   const upcomingExams = filteredExams.filter(e => 
// //     e.status === 'scheduled' && new Date(e.exam_date) >= new Date()
// //   );
// //   const completedExams = filteredExams.filter(e => e.status === 'completed');
// //   const inProgressExams = filteredExams.filter(e => e.status === 'in_progress');

// //   const getStatusColor = (status: string) => {
// //     switch (status) {
// //       case 'scheduled': return 'bg-blue-50 text-blue-700 border-blue-200';
// //       case 'in_progress': return 'bg-amber-50 text-amber-700 border-amber-200';
// //       case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
// //       case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
// //       case 'postponed': return 'bg-orange-50 text-orange-700 border-orange-200';
// //       default: return 'bg-gray-50 text-gray-700 border-gray-200';
// //     }
// //   };

// //   const getStatusIcon = (status: string) => {
// //     switch (status) {
// //       case 'scheduled': return <Calendar className="w-4 h-4" />;
// //       case 'in_progress': return <Clock className="w-4 h-4" />;
// //       case 'completed': return <CheckCircle className="w-4 h-4" />;
// //       case 'cancelled': return <XCircle className="w-4 h-4" />;
// //       case 'postponed': return <AlertCircle className="w-4 h-4" />;
// //       default: return <Calendar className="w-4 h-4" />;
// //     }
// //   };

// //   const formatDate = (dateString: string) => {
// //     const date = new Date(dateString);
// //     return date.toLocaleDateString('en-US', { 
// //       weekday: 'short', 
// //       year: 'numeric', 
// //       month: 'short', 
// //       day: 'numeric' 
// //     });
// //   };

// //   const formatTime = (timeString: string) => {
// //     return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
// //       hour: '2-digit',
// //       minute: '2-digit',
// //       hour12: true
// //     });
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center">
// //         <motion.div 
// //           initial={{ opacity: 0, scale: 0.9 }}
// //           animate={{ opacity: 1, scale: 1 }}
// //           className="flex flex-col items-center gap-4"
// //         >
// //           <div className="relative">
// //             <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
// //             <CalendarIcon className="absolute inset-0 m-auto w-6 h-6 text-blue-500" />
// //           </div>
// //           <p 
// //             className="text-gray-600"
// //             style={{ fontSize: '15px', fontWeight: 500 }}
// //           >
// //             Loading your exam schedule...
// //           </p>
// //         </motion.div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center p-8">
// //         <motion.div 
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           className="bg-white rounded-[20px] p-8 shadow-soft border border-red-200 max-w-md"
// //         >
// //           <div className="text-center">
// //             <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
// //             <h3 
// //               className="text-gray-900 mb-2"
// //               style={{ fontSize: '18px', fontWeight: 600 }}
// //             >
// //               Error Loading Exams
// //             </h3>
// //             <p 
// //               className="text-gray-600 mb-4"
// //               style={{ fontSize: '14px' }}
// //             >
// //               {error}
// //             </p>
// //             <button
// //               onClick={() => fetchStudentExams()}
// //               className="px-6 py-2.5 gradient-primary text-white font-medium rounded-xl shadow-soft hover:shadow-float transition-all"
// //               style={{ fontSize: '14px' }}
// //             >
// //               Try Again
// //             </button>
// //           </div>
// //         </motion.div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-[#F6F9FC] p-8">
// //       <div className="max-w-[1600px] mx-auto space-y-7">
        
// //         {/* Header */}
// //         <motion.div
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.5 }}
// //         >
// //           <h1 
// //             className="text-gray-900"
// //             style={{ 
// //               fontSize: '32px', 
// //               fontWeight: 600,
// //               letterSpacing: '-0.02em',
// //               lineHeight: 1.2
// //             }}
// //           >
// //             My Exam Schedule
// //           </h1>
// //           <p 
// //             className="text-gray-600 mt-2" 
// //             style={{ fontSize: '15px', fontWeight: 400 }}
// //           >
// //             View your upcoming and past examinations
// //             {studentClass && (
// //               <span className="ml-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium border border-blue-200" style={{ fontSize: '13px' }}>
// //                 📚 {studentClass}
// //               </span>
// //             )}
// //           </p>
// //         </motion.div>

// //         {/* Stats Cards */}
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //           <motion.div 
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ delay: 0.1, duration: 0.5 }}
// //             whileHover={{ y: -4 }}
// //             className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
// //           >
// //             <div className="flex items-center gap-4 mb-4">
// //               <div className="w-14 h-14 bg-blue-50 rounded-[16px] flex items-center justify-center">
// //                 <Calendar className="w-7 h-7 text-blue-500" />
// //               </div>
// //             </div>
// //             <p 
// //               className="text-blue-600 mb-1"
// //               style={{ fontSize: '14px', fontWeight: 500 }}
// //             >
// //               Upcoming Exams
// //             </p>
// //             <p 
// //               className="text-gray-900"
// //               style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
// //             >
// //               {upcomingExams.length}
// //             </p>
// //           </motion.div>
          
// //           <motion.div 
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ delay: 0.15, duration: 0.5 }}
// //             whileHover={{ y: -4 }}
// //             className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
// //           >
// //             <div className="flex items-center gap-4 mb-4">
// //               <div className="w-14 h-14 bg-amber-50 rounded-[16px] flex items-center justify-center">
// //                 <Clock className="w-7 h-7 text-amber-600" />
// //               </div>
// //             </div>
// //             <p 
// //               className="text-amber-600 mb-1"
// //               style={{ fontSize: '14px', fontWeight: 500 }}
// //             >
// //               In Progress
// //             </p>
// //             <p 
// //               className="text-gray-900"
// //               style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
// //             >
// //               {inProgressExams.length}
// //             </p>
// //           </motion.div>

// //           <motion.div 
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ delay: 0.2, duration: 0.5 }}
// //             whileHover={{ y: -4 }}
// //             className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
// //           >
// //             <div className="flex items-center gap-4 mb-4">
// //               <div className="w-14 h-14 bg-emerald-50 rounded-[16px] flex items-center justify-center">
// //                 <CheckCircle className="w-7 h-7 text-emerald-600" />
// //               </div>
// //             </div>
// //             <p 
// //               className="text-emerald-600 mb-1"
// //               style={{ fontSize: '14px', fontWeight: 500 }}
// //             >
// //               Completed
// //             </p>
// //             <p 
// //               className="text-gray-900"
// //               style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
// //             >
// //               {completedExams.length}
// //             </p>
// //           </motion.div>
// //         </div>

// //         {/* Filters */}
// //         <motion.div 
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ delay: 0.25, duration: 0.5 }}
// //           className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100"
// //         >
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
// //             {/* Search */}
// //             <div className="relative group">
// //               <Search 
// //                 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" 
// //                 size={18} 
// //               />
// //               <input
// //                 type="text"
// //                 placeholder="Search exams by name or subject..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 placeholder-gray-400"
// //                 style={{ fontSize: '14px', fontWeight: 500 }}
// //               />
// //             </div>

// //             {/* Status Filter */}
// //             <div className="relative">
// //               <select
// //                 value={statusFilter}
// //                 onChange={(e) => setStatusFilter(e.target.value)}
// //                 className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 appearance-none cursor-pointer"
// //                 style={{ fontSize: '14px', fontWeight: 500 }}
// //               >
// //                 <option value="all">All Status</option>
// //                 <option value="scheduled">⏰ Scheduled</option>
// //                 <option value="in_progress">▶️ In Progress</option>
// //                 <option value="completed">✅ Completed</option>
// //                 <option value="cancelled">❌ Cancelled</option>
// //                 <option value="postponed">⏸️ Postponed</option>
// //               </select>
// //               <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
// //             </div>
// //           </div>
// //         </motion.div>

// //         {/* Exams List */}
// //         <AnimatePresence mode="wait">
// //           {filteredExams.length === 0 ? (
// //             <motion.div 
// //               initial={{ opacity: 0, scale: 0.95 }}
// //               animate={{ opacity: 1, scale: 1 }}
// //               exit={{ opacity: 0, scale: 0.95 }}
// //               className="bg-white rounded-[20px] p-12 shadow-soft border border-gray-100 text-center"
// //             >
// //               <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
// //               <h3 
// //                 className="text-gray-900 mb-2"
// //                 style={{ fontSize: '18px', fontWeight: 600 }}
// //               >
// //                 No Exams Found
// //               </h3>
// //               <p 
// //                 className="text-gray-600"
// //                 style={{ fontSize: '14px' }}
// //               >
// //                 {searchTerm || statusFilter !== 'all' 
// //                   ? 'Try adjusting your filters' 
// //                   : 'No exams scheduled for your class yet'}
// //               </p>
// //             </motion.div>
// //           ) : (
// //             <div className="space-y-4">
// //               {filteredExams.map((exam, index) => (
// //                 <motion.div
// //                   key={exam.id}
// //                   initial={{ opacity: 0, y: 20 }}
// //                   animate={{ opacity: 1, y: 0 }}
// //                   transition={{ delay: index * 0.05, duration: 0.3 }}
// //                   whileHover={{ scale: 1.01, y: -2 }}
// //                   className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300 cursor-pointer"
// //                   onClick={() => setSelectedExam(exam)}
// //                 >
// //                   <div className="flex items-start justify-between">
// //                     <div className="flex-1">
// //                       <div className="flex items-start gap-4">
// //                         <div className="w-12 h-12 bg-blue-50 rounded-[14px] flex items-center justify-center flex-shrink-0">
// //                           <BookOpen className="w-6 h-6 text-blue-500" />
// //                         </div>
                        
// //                         <div className="flex-1">
// //                           <div className="flex items-center gap-3 mb-2">
// //                             <h3 
// //                               className="text-gray-900"
// //                               style={{ fontSize: '18px', fontWeight: 600 }}
// //                             >
// //                               {exam.exam_name}
// //                             </h3>
// //                             <span className={`px-3 py-1 rounded-lg font-medium border flex items-center gap-1 ${getStatusColor(exam.status)}`} style={{ fontSize: '12px' }}>
// //                               {getStatusIcon(exam.status)}
// //                               {exam.status.replace('_', ' ').toUpperCase()}
// //                             </span>
// //                           </div>

// //                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
// //                             <div className="flex items-center gap-2 text-gray-600">
// //                               <BookOpen className="w-4 h-4 text-gray-400" />
// //                               <span style={{ fontSize: '14px', fontWeight: 500 }}>
// //                                 {exam.subjects?.subject_name || 'Subject'} {exam.subjects?.subject_code && `(${exam.subjects.subject_code})`}
// //                               </span>
// //                             </div>

// //                             <div className="flex items-center gap-2 text-gray-600">
// //                               <Calendar className="w-4 h-4 text-gray-400" />
// //                               <span style={{ fontSize: '14px', fontWeight: 500 }}>
// //                                 {formatDate(exam.exam_date)}
// //                               </span>
// //                             </div>

// //                             <div className="flex items-center gap-2 text-gray-600">
// //                               <Clock className="w-4 h-4 text-gray-400" />
// //                               <span style={{ fontSize: '14px', fontWeight: 500 }}>
// //                                 {formatTime(exam.start_time)} - {formatTime(exam.end_time)}
// //                               </span>
// //                             </div>

// //                             {exam.room_number && (
// //                               <div className="flex items-center gap-2 text-gray-600">
// //                                 <MapPin className="w-4 h-4 text-gray-400" />
// //                                 <span style={{ fontSize: '14px', fontWeight: 500 }}>
// //                                   Room {exam.room_number}
// //                                 </span>
// //                               </div>
// //                             )}
// //                           </div>

// //                           <div className="flex items-center gap-6 mt-3 pt-3 border-t border-gray-100">
// //                             <div className="flex items-center gap-2">
// //                               <span className="text-gray-500" style={{ fontSize: '13px' }}>Max Marks:</span>
// //                               <span className="text-gray-900" style={{ fontSize: '14px', fontWeight: 700 }}>{exam.max_marks}</span>
// //                             </div>
// //                             <div className="flex items-center gap-2">
// //                               <span className="text-gray-500" style={{ fontSize: '13px' }}>Passing:</span>
// //                               <span className="text-gray-900" style={{ fontSize: '14px', fontWeight: 700 }}>{exam.passing_marks}</span>
// //                             </div>
// //                             <div className="flex items-center gap-2">
// //                               <span className="text-gray-500" style={{ fontSize: '13px' }}>Duration:</span>
// //                               <span className="text-gray-900" style={{ fontSize: '14px', fontWeight: 700 }}>{exam.duration_minutes} mins</span>
// //                             </div>
// //                             <div className="flex items-center gap-2">
// //                               <span className="text-gray-500" style={{ fontSize: '13px' }}>Type:</span>
// //                               <span className="text-gray-900 capitalize" style={{ fontSize: '14px', fontWeight: 700 }}>{exam.exam_type}</span>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>

// //                     <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
// //                   </div>
// //                 </motion.div>
// //               ))}
// //             </div>
// //           )}
// //         </AnimatePresence>

// //         {/* Exam Detail Modal */}
// //         <AnimatePresence>
// //           {selectedExam && (
// //             <motion.div 
// //               initial={{ opacity: 0 }}
// //               animate={{ opacity: 1 }}
// //               exit={{ opacity: 0 }}
// //               className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
// //               onClick={() => setSelectedExam(null)}
// //             >
// //               <motion.div 
// //                 initial={{ opacity: 0, scale: 0.95, y: 20 }}
// //                 animate={{ opacity: 1, scale: 1, y: 0 }}
// //                 exit={{ opacity: 0, scale: 0.95, y: 20 }}
// //                 transition={{ type: "spring", duration: 0.5 }}
// //                 className="bg-white rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-float"
// //                 onClick={(e) => e.stopPropagation()}
// //               >
// //                 <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-[24px] z-10">
// //                   <div className="flex items-center justify-between">
// //                     <h2 
// //                       className="text-gray-900"
// //                       style={{ fontSize: '20px', fontWeight: 600 }}
// //                     >
// //                       Exam Details
// //                     </h2>
// //                     <button
// //                       onClick={() => setSelectedExam(null)}
// //                       className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
// //                     >
// //                       <XCircle className="w-5 h-5" />
// //                     </button>
// //                   </div>
// //                 </div>

// //                 <div className="p-6 space-y-6">
// //                   <div>
// //                     <h3 
// //                       className="text-gray-900 mb-2"
// //                       style={{ fontSize: '24px', fontWeight: 600 }}
// //                     >
// //                       {selectedExam.exam_name}
// //                     </h3>
// //                     <div className="flex items-center gap-2">
// //                       <span className={`px-3 py-1 rounded-lg font-medium border flex items-center gap-1 ${getStatusColor(selectedExam.status)}`} style={{ fontSize: '12px' }}>
// //                         {getStatusIcon(selectedExam.status)}
// //                         {selectedExam.status.replace('_', ' ').toUpperCase()}
// //                       </span>
// //                       <span className="px-3 py-1 rounded-lg font-medium bg-purple-50 text-purple-700 border border-purple-200 capitalize" style={{ fontSize: '12px' }}>
// //                         {selectedExam.exam_type}
// //                       </span>
// //                     </div>
// //                   </div>

// //                   <div className="grid grid-cols-2 gap-4">
// //                     <div className="bg-gray-50 rounded-[16px] p-4 border border-gray-100">
// //                       <div className="flex items-center gap-2 text-gray-600 mb-1">
// //                         <BookOpen className="w-4 h-4" />
// //                         <span style={{ fontSize: '13px', fontWeight: 500 }}>Subject</span>
// //                       </div>
// //                       <p 
// //                         className="text-gray-900"
// //                         style={{ fontSize: '15px', fontWeight: 600 }}
// //                       >
// //                         {selectedExam.subjects?.subject_name || 'N/A'}
// //                       </p>
// //                       {selectedExam.subjects?.subject_code && (
// //                         <p className="text-gray-500" style={{ fontSize: '12px' }}>
// //                           {selectedExam.subjects.subject_code}
// //                         </p>
// //                       )}
// //                     </div>

// //                     <div className="bg-gray-50 rounded-[16px] p-4 border border-gray-100">
// //                       <div className="flex items-center gap-2 text-gray-600 mb-1">
// //                         <Calendar className="w-4 h-4" />
// //                         <span style={{ fontSize: '13px', fontWeight: 500 }}>Date</span>
// //                       </div>
// //                       <p 
// //                         className="text-gray-900"
// //                         style={{ fontSize: '15px', fontWeight: 600 }}
// //                       >
// //                         {formatDate(selectedExam.exam_date)}
// //                       </p>
// //                     </div>

// //                     <div className="bg-gray-50 rounded-[16px] p-4 border border-gray-100">
// //                       <div className="flex items-center gap-2 text-gray-600 mb-1">
// //                         <Clock className="w-4 h-4" />
// //                         <span style={{ fontSize: '13px', fontWeight: 500 }}>Time</span>
// //                       </div>
// //                       <p 
// //                         className="text-gray-900"
// //                         style={{ fontSize: '15px', fontWeight: 600 }}
// //                       >
// //                         {formatTime(selectedExam.start_time)} - {formatTime(selectedExam.end_time)}
// //                       </p>
// //                       <p className="text-gray-500" style={{ fontSize: '12px' }}>
// //                         Duration: {selectedExam.duration_minutes} minutes
// //                       </p>
// //                     </div>

// //                     <div className="bg-gray-50 rounded-[16px] p-4 border border-gray-100">
// //                       <div className="flex items-center gap-2 text-gray-600 mb-1">
// //                         <MapPin className="w-4 h-4" />
// //                         <span style={{ fontSize: '13px', fontWeight: 500 }}>Room</span>
// //                       </div>
// //                       <p 
// //                         className="text-gray-900"
// //                         style={{ fontSize: '15px', fontWeight: 600 }}
// //                       >
// //                         {selectedExam.room_number || 'TBA'}
// //                       </p>
// //                     </div>
// //                   </div>

// //                   <div className="grid grid-cols-3 gap-4">
// //                     <div className="bg-blue-50 rounded-[16px] p-4 border border-blue-200">
// //                       <p className="text-blue-600 mb-1" style={{ fontSize: '13px', fontWeight: 500 }}>Max Marks</p>
// //                       <p className="text-blue-700" style={{ fontSize: '24px', fontWeight: 700 }}>{selectedExam.max_marks}</p>
// //                     </div>
// //                     <div className="bg-emerald-50 rounded-[16px] p-4 border border-emerald-200">
// //                       <p className="text-emerald-600 mb-1" style={{ fontSize: '13px', fontWeight: 500 }}>Passing Marks</p>
// //                       <p className="text-emerald-700" style={{ fontSize: '24px', fontWeight: 700 }}>{selectedExam.passing_marks}</p>
// //                     </div>
// //                     <div className="bg-purple-50 rounded-[16px] p-4 border border-purple-200">
// //                       <p className="text-purple-600 mb-1" style={{ fontSize: '13px', fontWeight: 500 }}>Duration</p>
// //                       <p className="text-purple-700" style={{ fontSize: '24px', fontWeight: 700 }}>{selectedExam.duration_minutes}m</p>
// //                     </div>
// //                   </div>

// //                   {selectedExam.syllabus_coverage && (
// //                     <div className="bg-amber-50 rounded-[16px] p-4 border border-amber-200">
// //                       <div className="flex items-center gap-2 text-amber-700 mb-2">
// //                         <FileText className="w-4 h-4" />
// //                         <span style={{ fontSize: '14px', fontWeight: 600 }}>Syllabus Coverage</span>
// //                       </div>
// //                       <p className="text-gray-700 leading-relaxed whitespace-pre-wrap" style={{ fontSize: '14px' }}>
// //                         {selectedExam.syllabus_coverage}
// //                       </p>
// //                     </div>
// //                   )}

// //                   {selectedExam.instructions && (
// //                     <div className="bg-blue-50 rounded-[16px] p-4 border border-blue-200">
// //                       <div className="flex items-center gap-2 text-blue-700 mb-2">
// //                         <AlertCircle className="w-4 h-4" />
// //                         <span style={{ fontSize: '14px', fontWeight: 600 }}>Instructions</span>
// //                       </div>
// //                       <p className="text-gray-700 leading-relaxed whitespace-pre-wrap" style={{ fontSize: '14px' }}>
// //                         {selectedExam.instructions}
// //                       </p>
// //                     </div>
// //                   )}
// //                 </div>
// //               </motion.div>
// //             </motion.div>
// //           )}
// //         </AnimatePresence>
// //       </div>
// //     </div>
// //   );
// // };

// // export default StudentExamView;
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Calendar, 
//   Clock, 
//   BookOpen, 
//   MapPin, 
//   FileText, 
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   Search,
//   Filter,
//   ChevronRight,
//   Award,
//   Target,
//   TrendingUp
// } from 'lucide-react';

// // Mock supabase and auth for demo
// const mockUser = { id: 'student-1' };
// const mockAuth = { user: mockUser };

// interface ExamSchedule {
//   id: string;
//   exam_name: string;
//   exam_type: string;
//   exam_date: string;
//   start_time: string;
//   end_time: string;
//   duration_minutes: number;
//   room_number: string;
//   max_marks: number;
//   passing_marks: number;
//   instructions: string;
//   syllabus_coverage: string;
//   status: string;
//   subjects?: {
//     subject_name: string;
//     subject_code: string;
//   };
//   classes?: {
//     id: string;
//     class_name: string;
//     section: string;
//   };
// }

// const StudentExamView: React.FC = () => {
//   const { user } = mockAuth;
//   const [exams, setExams] = useState<ExamSchedule[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [selectedExam, setSelectedExam] = useState<ExamSchedule | null>(null);
//   const [studentClass, setStudentClass] = useState<string>('');

//   useEffect(() => {
//     fetchStudentExams();
//   }, [user]);

//   const fetchStudentExams = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Mock data
//       const mockExams: ExamSchedule[] = [
//         {
//           id: '1',
//           exam_name: 'Mid-term Mathematics Examination',
//           exam_type: 'theory',
//           exam_date: '2025-11-20',
//           start_time: '09:00:00',
//           end_time: '12:00:00',
//           duration_minutes: 180,
//           room_number: '101',
//           max_marks: 100,
//           passing_marks: 40,
//           instructions: 'Bring calculator and geometry box. No electronic devices allowed.',
//           syllabus_coverage: 'Chapters 1-5: Algebra, Trigonometry, Calculus basics',
//           status: 'scheduled',
//           subjects: { subject_name: 'Mathematics', subject_code: 'MATH101' }
//         },
//         {
//           id: '2',
//           exam_name: 'Physics Practical Assessment',
//           exam_type: 'practical',
//           exam_date: '2025-11-15',
//           start_time: '10:30:00',
//           end_time: '12:30:00',
//           duration_minutes: 120,
//           room_number: 'Lab 2',
//           max_marks: 50,
//           passing_marks: 20,
//           instructions: 'Wear lab coat and safety goggles. Bring lab manual.',
//           syllabus_coverage: 'Experiments: Optics, Mechanics, Electricity',
//           status: 'scheduled',
//           subjects: { subject_name: 'Physics', subject_code: 'PHY101' }
//         },
//         {
//           id: '3',
//           exam_name: 'English Literature Essay',
//           exam_type: 'theory',
//           exam_date: '2025-11-10',
//           start_time: '14:00:00',
//           end_time: '16:00:00',
//           duration_minutes: 120,
//           room_number: '205',
//           max_marks: 80,
//           passing_marks: 32,
//           instructions: 'Write in blue or black ink only.',
//           syllabus_coverage: 'Poetry analysis, Shakespeare, Modern literature',
//           status: 'completed',
//           subjects: { subject_name: 'English Literature', subject_code: 'ENG101' }
//         }
//       ];

//       setExams(mockExams);
//       setStudentClass('Class 10-A');
//     } catch (err: any) {
//       console.error('Error fetching student exams:', err);
//       setError(err.message || 'Failed to load your exam schedule');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredExams = exams.filter(exam => {
//     const matchesSearch = searchTerm === '' || 
//       exam.exam_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       exam.subjects?.subject_name.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const upcomingExams = filteredExams.filter(e => 
//     e.status === 'scheduled' && new Date(e.exam_date) >= new Date()
//   );
//   const completedExams = filteredExams.filter(e => e.status === 'completed');
//   const inProgressExams = filteredExams.filter(e => e.status === 'in_progress');

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'scheduled': return 'bg-blue-50 text-blue-600 border-blue-200';
//       case 'in_progress': return 'bg-orange-50 text-orange-600 border-orange-200';
//       case 'completed': return 'bg-green-50 text-green-600 border-green-200';
//       case 'cancelled': return 'bg-red-50 text-red-600 border-red-200';
//       case 'postponed': return 'bg-amber-50 text-amber-600 border-amber-200';
//       default: return 'bg-gray-50 text-gray-600 border-gray-200';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'scheduled': return <Calendar className="w-3 h-3" />;
//       case 'in_progress': return <Clock className="w-3 h-3" />;
//       case 'completed': return <CheckCircle className="w-3 h-3" />;
//       case 'cancelled': return <XCircle className="w-3 h-3" />;
//       case 'postponed': return <AlertCircle className="w-3 h-3" />;
//       default: return <Calendar className="w-3 h-3" />;
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric', 
//       year: 'numeric' 
//     });
//   };

//   const formatTime = (timeString: string) => {
//     return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   if (loading) {
//     return (
//       <div className="p-8 flex items-center justify-center min-h-screen">
//         <motion.div 
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="flex flex-col items-center gap-4"
//         >
//           <div className="relative">
//             <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-[#1E88E5]"></div>
//             <Calendar className="absolute inset-0 m-auto w-6 h-6 text-[#1E88E5]" />
//           </div>
//           <p className="text-gray-600">Loading your exam schedule...</p>
//         </motion.div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 flex items-center justify-center min-h-screen">
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="glass-strong rounded-2xl p-8 shadow-soft max-w-md text-center"
//         >
//           <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h3 className="text-gray-800 mb-2">Error Loading Exams</h3>
//           <p className="text-sm text-gray-600 mb-4">{error}</p>
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={() => fetchStudentExams()}
//             className="px-6 py-2.5 gradient-primary text-white rounded-xl shadow-glow hover:shadow-float transition-all"
//           >
//             Try Again
//           </motion.button>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 space-y-6">
      
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex items-center justify-between"
//       >
//         <div>
//           <h1 className="mb-2">My Exam Schedule</h1>
//           <p className="text-gray-600">
//             View your upcoming and past examinations
//             {studentClass && (
//               <span className="ml-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium border border-blue-200">
//                 📚 {studentClass}
//               </span>
//             )}
//           </p>
//         </div>
//         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//           <button className="px-6 py-2.5 bg-white hover:bg-gray-50 rounded-xl shadow-soft border border-gray-200 text-gray-700 font-medium flex items-center gap-2 transition-all">
//             <Calendar className="w-5 h-5" />
//             Full Calendar
//           </button>
//         </motion.div>
//       </motion.div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           whileHover={{ y: -4 }}
//           className="glass-strong rounded-2xl p-6 shadow-soft hover:shadow-float transition-all duration-300"
//         >
//           <div className="flex items-center gap-4 mb-4">
//             <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
//               <Calendar className="w-7 h-7 text-blue-600" />
//             </div>
//           </div>
//           <p className="text-sm text-gray-600 mb-1">Upcoming Exams</p>
//           <h3 className="text-blue-600">{upcomingExams.length}</h3>
//         </motion.div>
        
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.15 }}
//           whileHover={{ y: -4 }}
//           className="glass-strong rounded-2xl p-6 shadow-soft hover:shadow-float transition-all duration-300"
//         >
//           <div className="flex items-center gap-4 mb-4">
//             <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center">
//               <Clock className="w-7 h-7 text-orange-600" />
//             </div>
//           </div>
//           <p className="text-sm text-gray-600 mb-1">In Progress</p>
//           <h3 className="text-orange-600">{inProgressExams.length}</h3>
//         </motion.div>

//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           whileHover={{ y: -4 }}
//           className="glass-strong rounded-2xl p-6 shadow-soft hover:shadow-float transition-all duration-300"
//         >
//           <div className="flex items-center gap-4 mb-4">
//             <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
//               <CheckCircle className="w-7 h-7 text-green-600" />
//             </div>
//           </div>
//           <p className="text-sm text-gray-600 mb-1">Completed</p>
//           <h3 className="text-green-600">{completedExams.length}</h3>
//         </motion.div>
//       </div>

//       {/* Filters */}
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.25 }}
//         className="glass-strong rounded-2xl p-4 shadow-soft"
//       >
//         <div className="flex gap-4">
          
//           {/* Search */}
//           <div className="flex-1 relative group">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-[#1E88E5] transition-colors" />
//             <input
//               type="text"
//               placeholder="Search exams by name or subject..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-12 pr-4 h-11 bg-white border border-gray-200 rounded-xl focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none transition-all"
//             />
//           </div>

//           {/* Status Filter */}
//           <div className="relative">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="pl-4 pr-10 h-11 bg-white border border-gray-200 rounded-xl focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none transition-all appearance-none cursor-pointer min-w-[180px]"
//             >
//               <option value="all">All Status</option>
//               <option value="scheduled">Scheduled</option>
//               <option value="in_progress">In Progress</option>
//               <option value="completed">Completed</option>
//               <option value="cancelled">Cancelled</option>
//               <option value="postponed">Postponed</option>
//             </select>
//             <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//           </div>
//         </div>
//       </motion.div>

//       {/* Exams List */}
//       <AnimatePresence mode="wait">
//         {filteredExams.length === 0 ? (
//           <motion.div 
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.95 }}
//             className="glass-strong rounded-2xl p-12 shadow-soft text-center"
//           >
//             <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-gray-800 mb-2">No Exams Found</h3>
//             <p className="text-sm text-gray-600">
//               {searchTerm || statusFilter !== 'all' 
//                 ? 'Try adjusting your filters' 
//                 : 'No exams scheduled for your class yet'}
//             </p>
//           </motion.div>
//         ) : (
//           <div className="space-y-4">
//             {filteredExams.map((exam, index) => (
//               <motion.div
//                 key={exam.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 whileHover={{ y: -4 }}
//                 className="glass-strong rounded-2xl p-6 shadow-soft hover:shadow-float transition-all duration-300 cursor-pointer group"
//                 onClick={() => setSelectedExam(exam)}
//               >
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-start gap-4">
//                       <motion.div 
//                         whileHover={{ scale: 1.1, rotate: 5 }}
//                         className="w-12 h-12 bg-gradient-to-br from-[#1E88E5] to-[#5B9FFF] rounded-xl flex items-center justify-center flex-shrink-0"
//                       >
//                         <BookOpen className="w-6 h-6 text-white" />
//                       </motion.div>
                      
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-3">
//                           <h4 className="text-gray-800">{exam.exam_name}</h4>
//                           <span className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 ${getStatusColor(exam.status)}`}>
//                             {getStatusIcon(exam.status)}
//                             {exam.status.replace('_', ' ').toUpperCase()}
//                           </span>
//                           <span className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-600 border border-purple-200 capitalize">
//                             {exam.exam_type}
//                           </span>
//                         </div>

//                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
//                           <div className="flex items-center gap-2 text-sm text-gray-600">
//                             <BookOpen className="w-4 h-4 text-[#1E88E5]" />
//                             <span>{exam.subjects?.subject_name || 'Subject'}</span>
//                           </div>

//                           <div className="flex items-center gap-2 text-sm text-gray-600">
//                             <Calendar className="w-4 h-4 text-[#1E88E5]" />
//                             <span>{formatDate(exam.exam_date)}</span>
//                           </div>

//                           <div className="flex items-center gap-2 text-sm text-gray-600">
//                             <Clock className="w-4 h-4 text-[#1E88E5]" />
//                             <span>{formatTime(exam.start_time)} - {formatTime(exam.end_time)}</span>
//                           </div>

//                           {exam.room_number && (
//                             <div className="flex items-center gap-2 text-sm text-gray-600">
//                               <MapPin className="w-4 h-4 text-[#1E88E5]" />
//                               <span>Room {exam.room_number}</span>
//                             </div>
//                           )}
//                         </div>

//                         <div className="flex items-center gap-6 pt-3 border-t border-gray-200/50">
//                           <div className="flex items-center gap-2">
//                             <Award className="w-4 h-4 text-gray-400" />
//                             <span className="text-xs text-gray-500">Max:</span>
//                             <span className="text-sm font-semibold text-gray-800">{exam.max_marks}</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <Target className="w-4 h-4 text-gray-400" />
//                             <span className="text-xs text-gray-500">Passing:</span>
//                             <span className="text-sm font-semibold text-gray-800">{exam.passing_marks}</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <Clock className="w-4 h-4 text-gray-400" />
//                             <span className="text-xs text-gray-500">Duration:</span>
//                             <span className="text-sm font-semibold text-gray-800">{exam.duration_minutes} mins</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1E88E5] transition-colors flex-shrink-0" />
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </AnimatePresence>

//       {/* Exam Detail Modal */}
//       <AnimatePresence>
//         {selectedExam && (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
//             onClick={() => setSelectedExam(null)}
//           >
//             <motion.div 
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               className="glass-strong rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-float"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="sticky top-0 glass-strong border-b border-gray-200/50 px-6 py-4 rounded-t-2xl z-10">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-gray-800">Exam Details</h3>
//                   <button
//                     onClick={() => setSelectedExam(null)}
//                     className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
//                   >
//                     <XCircle className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 space-y-6">
//                 <div>
//                   <h2 className="text-gray-800 mb-2">{selectedExam.exam_name}</h2>
//                   <div className="flex items-center gap-2">
//                     <span className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 ${getStatusColor(selectedExam.status)}`}>
//                       {getStatusIcon(selectedExam.status)}
//                       {selectedExam.status.replace('_', ' ').toUpperCase()}
//                     </span>
//                     <span className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-600 border border-purple-200 capitalize">
//                       {selectedExam.exam_type}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="p-4 bg-white/60 rounded-xl border border-gray-200/50">
//                     <div className="flex items-center gap-2 text-gray-600 mb-2">
//                       <BookOpen className="w-4 h-4" />
//                       <span className="text-xs font-medium">Subject</span>
//                     </div>
//                     <p className="font-semibold text-gray-800">{selectedExam.subjects?.subject_name || 'N/A'}</p>
//                     {selectedExam.subjects?.subject_code && (
//                       <p className="text-xs text-gray-500 mt-1">{selectedExam.subjects.subject_code}</p>
//                     )}
//                   </div>

//                   <div className="p-4 bg-white/60 rounded-xl border border-gray-200/50">
//                     <div className="flex items-center gap-2 text-gray-600 mb-2">
//                       <Calendar className="w-4 h-4" />
//                       <span className="text-xs font-medium">Date</span>
//                     </div>
//                     <p className="font-semibold text-gray-800">{formatDate(selectedExam.exam_date)}</p>
//                   </div>

//                   <div className="p-4 bg-white/60 rounded-xl border border-gray-200/50">
//                     <div className="flex items-center gap-2 text-gray-600 mb-2">
//                       <Clock className="w-4 h-4" />
//                       <span className="text-xs font-medium">Time</span>
//                     </div>
//                     <p className="font-semibold text-gray-800">{formatTime(selectedExam.start_time)} - {formatTime(selectedExam.end_time)}</p>
//                     <p className="text-xs text-gray-500 mt-1">Duration: {selectedExam.duration_minutes} minutes</p>
//                   </div>

//                   <div className="p-4 bg-white/60 rounded-xl border border-gray-200/50">
//                     <div className="flex items-center gap-2 text-gray-600 mb-2">
//                       <MapPin className="w-4 h-4" />
//                       <span className="text-xs font-medium">Room</span>
//                     </div>
//                     <p className="font-semibold text-gray-800">{selectedExam.room_number || 'TBA'}</p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
//                     <p className="text-xs text-blue-600 font-medium mb-1">Max Marks</p>
//                     <h3 className="text-blue-600">{selectedExam.max_marks}</h3>
//                   </div>
//                   <div className="p-4 bg-green-50 rounded-xl border border-green-200">
//                     <p className="text-xs text-green-600 font-medium mb-1">Passing Marks</p>
//                     <h3 className="text-green-600">{selectedExam.passing_marks}</h3>
//                   </div>
//                   <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
//                     <p className="text-xs text-purple-600 font-medium mb-1">Duration</p>
//                     <h3 className="text-purple-600">{selectedExam.duration_minutes}m</h3>
//                   </div>
//                 </div>

//                 {selectedExam.syllabus_coverage && (
//                   <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
//                     <div className="flex items-center gap-2 text-amber-700 mb-2">
//                       <FileText className="w-4 h-4" />
//                       <span className="text-sm font-semibold">Syllabus Coverage</span>
//                     </div>
//                     <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedExam.syllabus_coverage}</p>
//                   </div>
//                 )}

//                 {selectedExam.instructions && (
//                   <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
//                     <div className="flex items-center gap-2 text-blue-700 mb-2">
//                       <AlertCircle className="w-4 h-4" />
//                       <span className="text-sm font-semibold">Instructions</span>
//                     </div>
//                     <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedExam.instructions}</p>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default StudentExamView;

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  MapPin, 
  FileText, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ChevronRight,
  Calendar as CalendarIcon,
  Award,
  Target
} from 'lucide-react';


interface ExamSchedule {
  id: string;
  exam_name: string;
  exam_type: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  room_number: string;
  max_marks: number;
  passing_marks: number;
  instructions: string;
  syllabus_coverage: string;
  status: string;
  subjects?: {
    subject_name: string;
    subject_code: string;
  };
  classes?: {
    id: string;
    class_name: string;
    section: string;
  };
}


const StudentExamView: React.FC = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedExam, setSelectedExam] = useState<ExamSchedule | null>(null);
  const [studentClass, setStudentClass] = useState<string>('');


  useEffect(() => {
    fetchStudentExams();
  }, [user]);


  const fetchStudentExams = async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Get student_id from student_profiles
      const { data: studentProfile, error: studentError } = await supabase
        .from('student_profiles')
        .select('student_id, full_name, class_name, section')
        .eq('id', user?.id)
        .single();

      if (studentError) {
        throw new Error('Could not load your student profile. Please contact administration.');
      }

      if (!studentProfile?.student_id) {
        setError('Your student profile is incomplete. Please contact administration.');
        setLoading(false);
        return;
      }

      // Step 2: Get class_id from class_assignments
      const { data: classAssignment, error: assignmentError } = await supabase
        .from('class_assignments')
        .select('class_id, class_name, academic_year')
        .eq('student_id', studentProfile.student_id)
        .order('assigned_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (assignmentError) {
        throw assignmentError;
      }

      if (!classAssignment?.class_id) {
        setError('You are not assigned to any class yet. Please contact administration.');
        setLoading(false);
        return;
      }

      setStudentClass(classAssignment.class_name || `${studentProfile.class_name} - ${studentProfile.section}`);

      // Step 3: Fetch exams for this class
      const { data: examData, error: examError } = await supabase
        .from('exam_schedules')
        .select(`
          *,
          subjects:subject_id (
            subject_name,
            subject_code
          ),
          classes:class_id (
            id,
            class_name,
            section
          )
        `)
        .eq('class_id', classAssignment.class_id)
        .order('exam_date', { ascending: true });

      if (examError) {
        throw examError;
      }

      setExams(examData || []);
    } catch (err: any) {
      console.error('Error fetching student exams:', err);
      setError(err.message || 'Failed to load your exam schedule');
    } finally {
      setLoading(false);
    }
  };


  // Filter exams
  const filteredExams = exams.filter(exam => {
    const matchesSearch = searchTerm === '' || 
      exam.exam_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subjects?.subject_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;

    return matchesSearch && matchesStatus;
  });


  // Group exams by status
  const upcomingExams = filteredExams.filter(e => 
    e.status === 'scheduled' && new Date(e.exam_date) >= new Date()
  );
  const completedExams = filteredExams.filter(e => e.status === 'completed');
  const inProgressExams = filteredExams.filter(e => e.status === 'in_progress');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'in_progress': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'completed': return 'bg-green-50 text-green-600 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-200';
      case 'postponed': return 'bg-amber-50 text-amber-600 border-amber-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Calendar className="w-3 h-3" />;
      case 'in_progress': return <Clock className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'cancelled': return <XCircle className="w-3 h-3" />;
      case 'postponed': return <AlertCircle className="w-3 h-3" />;
      default: return <Calendar className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-[#1E88E5]"></div>
            <CalendarIcon className="absolute inset-0 m-auto w-6 h-6 text-[#1E88E5]" />
          </div>
          <p className="text-gray-600">Loading your exam schedule...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-8 shadow-soft max-w-md text-center"
        >
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-gray-800 mb-2">Error Loading Exams</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fetchStudentExams()}
            className="px-6 py-2.5 gradient-primary text-white rounded-xl shadow-glow hover:shadow-float transition-all"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="mb-2">My Exam Schedule</h1>
          <p className="text-gray-600">
            View your upcoming and past examinations
            {studentClass && (
              <span className="ml-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium border border-blue-200">
                📚 {studentClass}
              </span>
            )}
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button className="px-6 py-2.5 bg-white hover:bg-gray-50 rounded-xl shadow-soft border border-gray-200 text-gray-700 font-medium flex items-center gap-2 transition-all">
            <Calendar className="w-5 h-5" />
            Full Calendar
          </button>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4 }}
          className="glass-strong rounded-2xl p-6 shadow-soft hover:shadow-float transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Upcoming Exams</p>
          <h3 className="text-blue-600">{upcomingExams.length}</h3>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ y: -4 }}
          className="glass-strong rounded-2xl p-6 shadow-soft hover:shadow-float transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">In Progress</p>
          <h3 className="text-orange-600">{inProgressExams.length}</h3>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4 }}
          className="glass-strong rounded-2xl p-6 shadow-soft hover:shadow-float transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <h3 className="text-green-600">{completedExams.length}</h3>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-strong rounded-2xl p-4 shadow-soft"
      >
        <div className="flex gap-4">
          
          {/* Search */}
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-[#1E88E5] transition-colors" />
            <input
              type="text"
              placeholder="Search exams by name or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 h-11 bg-white border border-gray-200 rounded-xl focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-4 pr-10 h-11 bg-white border border-gray-200 rounded-xl focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none transition-all appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="postponed">Postponed</option>
            </select>
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Exams List */}
      <AnimatePresence mode="wait">
        {filteredExams.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-strong rounded-2xl p-12 shadow-soft text-center"
          >
            <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-800 mb-2">No Exams Found</h3>
            <p className="text-sm text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'No exams scheduled for your class yet'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredExams.map((exam, index) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass-strong rounded-2xl p-6 shadow-soft hover:shadow-float transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedExam(exam)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-12 h-12 bg-gradient-to-br from-[#1E88E5] to-[#5B9FFF] rounded-xl flex items-center justify-center flex-shrink-0"
                      >
                        <BookOpen className="w-6 h-6 text-white" />
                      </motion.div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="text-gray-800">{exam.exam_name}</h4>
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 ${getStatusColor(exam.status)}`}>
                            {getStatusIcon(exam.status)}
                            {exam.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-600 border border-purple-200 capitalize">
                            {exam.exam_type}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <BookOpen className="w-4 h-4 text-[#1E88E5]" />
                            <span>{exam.subjects?.subject_name || 'Subject'}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-[#1E88E5]" />
                            <span>{formatDate(exam.exam_date)}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-[#1E88E5]" />
                            <span>{formatTime(exam.start_time)} - {formatTime(exam.end_time)}</span>
                          </div>

                          {exam.room_number && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-[#1E88E5]" />
                              <span>Room {exam.room_number}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-6 pt-3 border-t border-gray-200/50">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">Max:</span>
                            <span className="text-sm font-semibold text-gray-800">{exam.max_marks}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">Passing:</span>
                            <span className="text-sm font-semibold text-gray-800">{exam.passing_marks}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">Duration:</span>
                            <span className="text-sm font-semibold text-gray-800">{exam.duration_minutes} mins</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1E88E5] transition-colors flex-shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Exam Detail Modal */}
      <AnimatePresence>
        {selectedExam && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedExam(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-strong rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-float"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 glass-strong border-b border-gray-200/50 px-6 py-4 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-800">Exam Details</h3>
                  <button
                    onClick={() => setSelectedExam(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-gray-800 mb-2">{selectedExam.exam_name}</h2>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 ${getStatusColor(selectedExam.status)}`}>
                      {getStatusIcon(selectedExam.status)}
                      {selectedExam.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-600 border border-purple-200 capitalize">
                      {selectedExam.exam_type}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/60 rounded-xl border border-gray-200/50">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-xs font-medium">Subject</span>
                    </div>
                    <p className="font-semibold text-gray-800">{selectedExam.subjects?.subject_name || 'N/A'}</p>
                    {selectedExam.subjects?.subject_code && (
                      <p className="text-xs text-gray-500 mt-1">{selectedExam.subjects.subject_code}</p>
                    )}
                  </div>

                  <div className="p-4 bg-white/60 rounded-xl border border-gray-200/50">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-medium">Date</span>
                    </div>
                    <p className="font-semibold text-gray-800">{formatDate(selectedExam.exam_date)}</p>
                  </div>

                  <div className="p-4 bg-white/60 rounded-xl border border-gray-200/50">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-medium">Time</span>
                    </div>
                    <p className="font-semibold text-gray-800">{formatTime(selectedExam.start_time)} - {formatTime(selectedExam.end_time)}</p>
                    <p className="text-xs text-gray-500 mt-1">Duration: {selectedExam.duration_minutes} minutes</p>
                  </div>

                  <div className="p-4 bg-white/60 rounded-xl border border-gray-200/50">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-medium">Room</span>
                    </div>
                    <p className="font-semibold text-gray-800">{selectedExam.room_number || 'TBA'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-xs text-blue-600 font-medium mb-1">Max Marks</p>
                    <h3 className="text-blue-600">{selectedExam.max_marks}</h3>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-xs text-green-600 font-medium mb-1">Passing Marks</p>
                    <h3 className="text-green-600">{selectedExam.passing_marks}</h3>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <p className="text-xs text-purple-600 font-medium mb-1">Duration</p>
                    <h3 className="text-purple-600">{selectedExam.duration_minutes}m</h3>
                  </div>
                </div>

                {selectedExam.syllabus_coverage && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-2 text-amber-700 mb-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-semibold">Syllabus Coverage</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedExam.syllabus_coverage}</p>
                  </div>
                )}

                {selectedExam.instructions && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-semibold">Instructions</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedExam.instructions}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default StudentExamView;
