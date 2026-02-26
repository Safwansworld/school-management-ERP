// import React, { useState, useEffect } from 'react';
// import { supabase } from '../../lib/supabase';
// import { useAuth } from '../../context/AuthContext';
// import { 
//   Trophy, 
//   TrendingUp, 
//   Target, 
//   Award,
//   Calendar,
//   BookOpen,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Search,
//   Filter,
//   Eye,
//   Star,
//   ChevronRight,
//   Activity,
//   FileText
// } from 'lucide-react';

// interface ExamResult {
//   id: string;
//   exam_id: string;
//   student_id: string;
//   marks_obtained: number;
//   grade: string;
//   percentage: number;
//   status: 'pass' | 'fail' | 'absent' | 'pending';
//   remarks: string;
//   evaluated_at: string;
//   exam_schedules?: {
//     exam_name: string;
//     exam_date: string;
//     max_marks: number;
//     subjects?: {
//       subject_name: string;
//       subject_code: string;
//     };
//   };
// }

// const StudentResultsView: React.FC = () => {
//   const { user } = useAuth();
//   const [results, setResults] = useState<ExamResult[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);

//   useEffect(() => {
//     fetchStudentResults();
//   }, [user]);

//   const fetchStudentResults = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       console.log('🔍 Step 1: Fetching results for user:', user?.id);

//       // Get student_id from student_profiles
//       const { data: studentProfile, error: studentError } = await supabase
//         .from('student_profiles')
//         .select('student_id, full_name')
//         .eq('id', user?.id)
//         .single();

//       if (studentError) throw studentError;

//       if (!studentProfile?.student_id) {
//         setError('Your student profile is incomplete. Please contact administration.');
//         setLoading(false);
//         return;
//       }

//       console.log('📚 Step 2: Student ID:', studentProfile.student_id);

//       // Fetch exam results for this student
//       const { data: resultsData, error: resultsError } = await supabase
//         .from('exam_results')
//         .select(`
//           *,
//           exam_schedules:exam_id (
//             exam_name,
//             exam_date,
//             max_marks,
//             subjects:subject_id (
//               subject_name,
//               subject_code
//             )
//           )
//         `)
//         .eq('student_id', studentProfile.student_id)
//         .order('evaluated_at', { ascending: false });

//       if (resultsError) throw resultsError;

//       console.log('✅ Step 3: Fetched results:', resultsData?.length || 0);
//       setResults(resultsData || []);

//     } catch (err: any) {
//       console.error('❌ Error fetching results:', err);
//       setError(err.message || 'Failed to load your results');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter results
//   const filteredResults = results.filter(result => {
//     const matchesSearch = searchTerm === '' || 
//       result.exam_schedules?.exam_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       result.exam_schedules?.subjects?.subject_name.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesStatus = statusFilter === 'all' || result.status === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   // Calculate statistics
//   const stats = {
//     total: results.length,
//     passed: results.filter(r => r.status === 'pass').length,
//     failed: results.filter(r => r.status === 'fail').length,
//     average: results.length > 0 
//       ? results.reduce((sum, r) => sum + r.percentage, 0) / results.length 
//       : 0,
//     highest: results.length > 0 
//       ? Math.max(...results.map(r => r.percentage)) 
//       : 0
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'pass': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
//       case 'fail': return 'bg-red-50 text-red-700 border-red-200';
//       case 'absent': return 'bg-gray-50 text-gray-700 border-gray-200';
//       case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
//       default: return 'bg-gray-50 text-gray-700 border-gray-200';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'pass': return <CheckCircle className="w-4 h-4" />;
//       case 'fail': return <XCircle className="w-4 h-4" />;
//       case 'absent': return <Clock className="w-4 h-4" />;
//       case 'pending': return <Clock className="w-4 h-4" />;
//       default: return <Clock className="w-4 h-4" />;
//     }
//   };

//   const getGradeColor = (grade: string) => {
//     switch (grade) {
//       case 'A+': return 'bg-blue-500 text-white';
//       case 'A': return 'bg-blue-400 text-white';
//       case 'B+': return 'bg-cyan-500 text-white';
//       case 'B': return 'bg-emerald-500 text-white';
//       case 'C+': return 'bg-amber-500 text-white';
//       case 'C': return 'bg-orange-500 text-white';
//       case 'D': return 'bg-red-500 text-white';
//       case 'F': return 'bg-red-600 text-white';
//       default: return 'bg-gray-500 text-white';
//     }
//   };

//   const getPerformanceIndicator = (percentage: number) => {
//     if (percentage >= 90) return { color: 'text-blue-600', label: 'Excellent', icon: <Star className="w-4 h-4" /> };
//     if (percentage >= 80) return { color: 'text-cyan-600', label: 'Very Good', icon: <TrendingUp className="w-4 h-4" /> };
//     if (percentage >= 70) return { color: 'text-emerald-600', label: 'Good', icon: <Target className="w-4 h-4" /> };
//     if (percentage >= 50) return { color: 'text-amber-600', label: 'Average', icon: <Award className="w-4 h-4" /> };
//     return { color: 'text-red-600', label: 'Needs Improvement', icon: <XCircle className="w-4 h-4" /> };
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric' 
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center">
//         <div className="flex flex-col items-center space-y-4">
//           <div className="relative">
//             <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
//             <Trophy className="absolute inset-0 m-auto w-6 h-6 text-blue-500" />
//           </div>
//           <p className="text-gray-600 font-medium" style={{ fontSize: '15px' }}>
//             Loading your results...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center p-8">
//         <div className="bg-white rounded-[20px] p-8 shadow-soft border border-red-200 max-w-md">
//           <div className="text-center">
//             <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Results</h3>
//             <p className="text-gray-600 mb-4">{error}</p>
//             <button
//               onClick={() => fetchStudentResults()}
//               className="px-6 py-2.5 gradient-primary text-white font-medium rounded-xl"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F6F9FC] p-8">
//       <div className="max-w-[1400px] mx-auto space-y-7">
        
//         {/* Header */}
//         <div>
//           <h1 
//             className="text-gray-900"
//             style={{ 
//               fontSize: '32px', 
//               fontWeight: 600,
//               letterSpacing: '-0.02em',
//               lineHeight: 1.2
//             }}
//           >
//             My Exam Results
//           </h1>
//           <p 
//             className="text-gray-600 mt-2" 
//             style={{ fontSize: '15px', fontWeight: 400 }}
//           >
//             View your academic performance and exam results
//           </p>
//         </div>

//         {/* Statistics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
//           <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-[20px] p-6 shadow-soft text-white">
//             <div className="flex items-center justify-between mb-2">
//               <div className="w-12 h-12 bg-white/20 rounded-[14px] flex items-center justify-center">
//                 <FileText className="w-6 h-6" />
//               </div>
//             </div>
//             <p style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}>
//               {stats.total}
//             </p>
//             <p style={{ fontSize: '15px', fontWeight: 500 }} className="opacity-90">
//               Total Exams
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-[20px] p-6 shadow-soft text-white">
//             <div className="flex items-center justify-between mb-2">
//               <div className="w-12 h-12 bg-white/20 rounded-[14px] flex items-center justify-center">
//                 <Trophy className="w-6 h-6" />
//               </div>
//             </div>
//             <p style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}>
//               {stats.passed}
//             </p>
//             <p style={{ fontSize: '15px', fontWeight: 500 }} className="opacity-90">
//               Passed
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-[20px] p-6 shadow-soft text-white">
//             <div className="flex items-center justify-between mb-2">
//               <div className="w-12 h-12 bg-white/20 rounded-[14px] flex items-center justify-center">
//                 <XCircle className="w-6 h-6" />
//               </div>
//             </div>
//             <p style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}>
//               {stats.failed}
//             </p>
//             <p style={{ fontSize: '15px', fontWeight: 500 }} className="opacity-90">
//               Failed
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-[20px] p-6 shadow-soft text-white">
//             <div className="flex items-center justify-between mb-2">
//               <div className="w-12 h-12 bg-white/20 rounded-[14px] flex items-center justify-center">
//                 <Activity className="w-6 h-6" />
//               </div>
//             </div>
//             <p style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}>
//               {stats.average.toFixed(1)}%
//             </p>
//             <p style={{ fontSize: '15px', fontWeight: 500 }} className="opacity-90">
//               Average Score
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-[20px] p-6 shadow-soft text-white">
//             <div className="flex items-center justify-between mb-2">
//               <div className="w-12 h-12 bg-white/20 rounded-[14px] flex items-center justify-center">
//                 <Star className="w-6 h-6" />
//               </div>
//             </div>
//             <p style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}>
//               {stats.highest.toFixed(1)}%
//             </p>
//             <p style={{ fontSize: '15px', fontWeight: 500 }} className="opacity-90">
//               Highest Score
//             </p>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
//             {/* Search */}
//             <div className="relative group">
//               <Search 
//                 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" 
//                 size={18} 
//               />
//               <input
//                 type="text"
//                 placeholder="Search by exam or subject..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 placeholder-gray-400"
//                 style={{ fontSize: '14px', fontWeight: 500 }}
//               />
//             </div>

//             {/* Status Filter */}
//             <div className="relative">
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 appearance-none cursor-pointer"
//                 style={{ fontSize: '14px', fontWeight: 500 }}
//               >
//                 <option value="all">All Status</option>
//                 <option value="pass">Passed</option>
//                 <option value="fail">Failed</option>
//                 <option value="absent">Absent</option>
//                 <option value="pending">Pending</option>
//               </select>
//               <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
//             </div>
//           </div>
//         </div>

//         {/* Results List */}
//         {filteredResults.length === 0 ? (
//           <div className="bg-white rounded-[20px] p-12 shadow-soft border border-gray-100 text-center">
//             <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
//             <p className="text-gray-600">
//               {searchTerm || statusFilter !== 'all' 
//                 ? 'Try adjusting your filters' 
//                 : 'No exam results available yet'}
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredResults.map((result) => {
//               const performance = getPerformanceIndicator(result.percentage);
              
//               return (
//                 <div
//                   key={result.id}
//                   className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300 cursor-pointer"
//                   onClick={() => setSelectedResult(result)}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-start gap-4">
//                         <div className="w-12 h-12 bg-blue-50 rounded-[14px] flex items-center justify-center flex-shrink-0">
//                           <BookOpen className="w-6 h-6 text-blue-500" />
//                         </div>
                        
//                         <div className="flex-1">
//                           <div className="flex items-center gap-3 mb-2 flex-wrap">
//                             <h3 
//                               className="text-gray-900 font-semibold"
//                               style={{ fontSize: '18px' }}
//                             >
//                               {result.exam_schedules?.exam_name || 'Exam'}
//                             </h3>
//                             <span className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 ${getStatusColor(result.status)}`}>
//                               {getStatusIcon(result.status)}
//                               {result.status.toUpperCase()}
//                             </span>
//                             <span className={`px-3 py-1 rounded-xl font-bold text-sm ${getGradeColor(result.grade)}`}>
//                               {result.grade}
//                             </span>
//                           </div>

//                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
//                             <div className="flex items-center gap-2 text-gray-600">
//                               <BookOpen className="w-4 h-4 text-gray-400" />
//                               <span style={{ fontSize: '14px' }}>
//                                 {result.exam_schedules?.subjects?.subject_name || 'Subject'}
//                               </span>
//                             </div>

//                             <div className="flex items-center gap-2 text-gray-600">
//                               <Calendar className="w-4 h-4 text-gray-400" />
//                               <span style={{ fontSize: '14px' }}>
//                                 {formatDate(result.evaluated_at)}
//                               </span>
//                             </div>

//                             <div className="flex items-center gap-2 text-gray-600">
//                               <Target className="w-4 h-4 text-gray-400" />
//                               <span style={{ fontSize: '14px' }}>
//                                 {result.marks_obtained}/{result.exam_schedules?.max_marks}
//                               </span>
//                             </div>

//                             <div className={`flex items-center gap-2 ${performance.color}`}>
//                               {performance.icon}
//                               <span style={{ fontSize: '14px', fontWeight: 600 }}>
//                                 {performance.label}
//                               </span>
//                             </div>
//                           </div>

//                           {/* Progress Bar */}
//                           <div className="mt-4">
//                             <div className="flex justify-between text-sm text-gray-600 mb-2">
//                               <span>Performance</span>
//                               <span className="font-semibold">{result.percentage.toFixed(1)}%</span>
//                             </div>
//                             <div className="w-full bg-gray-200 rounded-full h-2">
//                               <div 
//                                 className={`h-2 rounded-full transition-all duration-300 ${
//                                   result.percentage >= 90 ? 'gradient-primary' :
//                                   result.percentage >= 80 ? 'bg-cyan-500' :
//                                   result.percentage >= 70 ? 'bg-emerald-500' :
//                                   result.percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
//                                 }`}
//                                 style={{ width: `${Math.min(result.percentage, 100)}%` }}
//                               ></div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Result Detail Modal */}
//         {selectedResult && (
//           <div 
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
//             onClick={() => setSelectedResult(null)}
//           >
//             <div 
//               className="bg-white rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Modal Header */}
//               <div className="h-32 rounded-t-[24px] gradient-primary"></div>
//               <div className="px-6 pb-4 -mt-12">
//                 <div className="flex items-start justify-between">
//                   <div className="w-20 h-20 gradient-primary rounded-[16px] shadow-soft flex items-center justify-center border-4 border-white">
//                     <span className="text-white text-2xl font-bold">{selectedResult.grade}</span>
//                   </div>
//                   <button
//                     onClick={() => setSelectedResult(null)}
//                     className="bg-white rounded-full p-2 shadow-sm hover:bg-gray-50 transition-colors"
//                   >
//                     <XCircle className="w-6 h-6 text-gray-700" />
//                   </button>
//                 </div>
//                 <h3 className="text-gray-900 mt-4 text-2xl font-semibold">
//                   {selectedResult.exam_schedules?.exam_name}
//                 </h3>
//                 <p className="text-gray-600 text-sm">
//                   {selectedResult.exam_schedules?.subjects?.subject_name}
//                 </p>
//               </div>

//               {/* Modal Content */}
//               <div className="px-6 py-6 space-y-6">
//                 {/* Performance Metrics */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <div className="bg-gray-50 rounded-xl p-4 text-center">
//                     <div className="text-gray-900 text-2xl font-bold mb-1">
//                       {selectedResult.marks_obtained}
//                     </div>
//                     <div className="text-gray-600 text-xs">Marks Obtained</div>
//                     <div className="text-gray-500 text-xs mt-1">
//                       out of {selectedResult.exam_schedules?.max_marks}
//                     </div>
//                   </div>

//                   <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
//                     <div className="text-blue-600 text-2xl font-bold mb-1">
//                       {selectedResult.percentage.toFixed(1)}%
//                     </div>
//                     <div className="text-gray-600 text-xs">Percentage</div>
//                     <div className={`text-xs mt-1 ${getPerformanceIndicator(selectedResult.percentage).color}`}>
//                       {getPerformanceIndicator(selectedResult.percentage).label}
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 rounded-xl p-4 text-center">
//                     <div className={`inline-flex items-center px-3 py-1 rounded-lg font-bold text-lg ${getGradeColor(selectedResult.grade)}`}>
//                       {selectedResult.grade}
//                     </div>
//                     <div className="text-gray-600 text-xs mt-2">Grade</div>
//                   </div>

//                   <div className="bg-gray-50 rounded-xl p-4 text-center">
//                     <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg font-medium border text-sm ${getStatusColor(selectedResult.status)}`}>
//                       {getStatusIcon(selectedResult.status)}
//                       <span className="capitalize">{selectedResult.status}</span>
//                     </div>
//                     <div className="text-gray-600 text-xs mt-2">Status</div>
//                   </div>
//                 </div>

//                 {/* Performance Bar */}
//                 <div className="bg-gray-50 rounded-xl p-4">
//                   <div className="flex justify-between text-gray-600 mb-2 text-sm">
//                     <span>Performance Score</span>
//                     <span className="font-semibold">{selectedResult.percentage.toFixed(1)}%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-3">
//                     <div 
//                       className={`h-3 rounded-full transition-all duration-500 ${
//                         selectedResult.percentage >= 90 ? 'gradient-primary' :
//                         selectedResult.percentage >= 80 ? 'bg-cyan-500' :
//                         selectedResult.percentage >= 70 ? 'bg-emerald-500' :
//                         selectedResult.percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
//                       }`}
//                       style={{ width: `${Math.min(selectedResult.percentage, 100)}%` }}
//                     ></div>
//                   </div>
//                 </div>

//                 {/* Remarks */}
//                 {selectedResult.remarks && (
//                   <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
//                     <div className="flex items-center gap-2 text-amber-700 mb-2">
//                       <FileText className="w-4 h-4" />
//                       <span className="font-medium">Remarks</span>
//                     </div>
//                     <p className="text-gray-700 text-sm leading-relaxed">
//                       {selectedResult.remarks}
//                     </p>
//                   </div>
//                 )}

//                 {/* Evaluation Date */}
//                 <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
//                   <div className="flex items-center gap-2 text-blue-700 mb-1">
//                     <Calendar className="w-4 h-4" />
//                     <span className="font-medium text-sm">Evaluation Date</span>
//                   </div>
//                   <p className="text-gray-700 text-sm">
//                     {new Date(selectedResult.evaluated_at).toLocaleString('en-US', { 
//                       weekday: 'long', 
//                       year: 'numeric', 
//                       month: 'long', 
//                       day: 'numeric',
//                       hour: '2-digit',
//                       minute: '2-digit'
//                     })}
//                   </p>
//                 </div>
//               </div>

//               {/* Modal Footer */}
//               <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
//                 <button
//                   onClick={() => setSelectedResult(null)}
//                   className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-white font-medium transition-colors text-sm"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentResultsView;
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  Award,
  Calendar,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Star,
  ChevronRight,
  Activity,
  FileText
} from 'lucide-react';

interface ExamResult {
  id: string;
  exam_id: string;
  student_id: string;
  marks_obtained: number;
  grade: string;
  percentage: number;
  status: 'pass' | 'fail' | 'absent' | 'pending';
  remarks: string;
  evaluated_at: string;
  exam_schedules?: {
    exam_name: string;
    exam_date: string;
    max_marks: number;
    subjects?: {
      subject_name: string;
      subject_code: string;
    };
  };
}

const StudentResultsView: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);

  useEffect(() => {
    fetchStudentResults();
  }, [user]);

  const fetchStudentResults = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get student_id from student_profiles
      const { data: studentProfile, error: studentError } = await supabase
        .from('student_profiles')
        .select('student_id, full_name')
        .eq('id', user?.id)
        .single();

      if (studentError) throw studentError;

      if (!studentProfile?.student_id) {
        setError('Your student profile is incomplete. Please contact administration.');
        setLoading(false);
        return;
      }

      // Fetch exam results
      const { data: resultsData, error: resultsError } = await supabase
        .from('exam_results')
        .select(`
          *,
          exam_schedules:exam_id (
            exam_name,
            exam_date,
            max_marks,
            subjects:subject_id (
              subject_name,
              subject_code
            )
          )
        `)
        .eq('student_id', studentProfile.student_id)
        .order('evaluated_at', { ascending: false });

      if (resultsError) throw resultsError;

      setResults(resultsData || []);

    } catch (err: any) {
      console.error('Error fetching results:', err);
      setError(err.message || 'Failed to load your results');
    } finally {
      setLoading(false);
    }
  };

  // Filter results
  const filteredResults = results.filter(result => {
    const matchesSearch = searchTerm === '' || 
      result.exam_schedules?.exam_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.exam_schedules?.subjects?.subject_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || result.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: results.length,
    passed: results.filter(r => r.status === 'pass').length,
    failed: results.filter(r => r.status === 'fail').length,
    average: results.length > 0 
      ? results.reduce((sum, r) => sum + r.percentage, 0) / results.length 
      : 0,
    highest: results.length > 0 
      ? Math.max(...results.map(r => r.percentage)) 
      : 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'fail': return 'bg-red-50 text-red-700 border-red-200';
      case 'absent': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4" />;
      case 'fail': return <XCircle className="w-4 h-4" />;
      case 'absent': return <Clock className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-blue-500 text-white';
      case 'A': return 'bg-blue-400 text-white';
      case 'B+': return 'bg-cyan-500 text-white';
      case 'B': return 'bg-emerald-500 text-white';
      case 'C+': return 'bg-amber-500 text-white';
      case 'C': return 'bg-orange-500 text-white';
      case 'D': return 'bg-red-500 text-white';
      case 'F': return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPerformanceIndicator = (percentage: number) => {
    if (percentage >= 90) return { color: 'text-blue-600', label: 'Excellent', icon: <Star className="w-4 h-4" /> };
    if (percentage >= 80) return { color: 'text-cyan-600', label: 'Very Good', icon: <TrendingUp className="w-4 h-4" /> };
    if (percentage >= 70) return { color: 'text-emerald-600', label: 'Good', icon: <Target className="w-4 h-4" /> };
    if (percentage >= 50) return { color: 'text-amber-600', label: 'Average', icon: <Award className="w-4 h-4" /> };
    return { color: 'text-red-600', label: 'Needs Improvement', icon: <XCircle className="w-4 h-4" /> };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
            <Trophy className="absolute inset-0 m-auto w-6 h-6 text-blue-500" />
          </div>
          <p 
            className="text-gray-600"
            style={{ fontSize: '15px', fontWeight: 500 }}
          >
            Loading your results...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[20px] p-8 shadow-soft border border-red-200 max-w-md"
        >
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 
              className="text-gray-900 mb-2"
              style={{ fontSize: '18px', fontWeight: 600 }}
            >
              Error Loading Results
            </h3>
            <p 
              className="text-gray-600 mb-4"
              style={{ fontSize: '14px' }}
            >
              {error}
            </p>
            <button
              onClick={() => fetchStudentResults()}
              className="px-6 py-2.5 gradient-primary text-white font-medium rounded-xl shadow-soft hover:shadow-float transition-all"
              style={{ fontSize: '14px' }}
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F9FC] p-8">
      <div className="max-w-[1600px] mx-auto space-y-7">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 
            className="text-gray-900"
            style={{ 
              fontSize: '32px', 
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}
          >
            My Exam Results
          </h1>
          <p 
            className="text-gray-600 mt-2" 
            style={{ fontSize: '15px', fontWeight: 400 }}
          >
            View your academic performance and exam results
          </p>
        </motion.div>

        {/* Small Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-[16px] p-4 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-[12px] flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p 
              className="text-gray-900 mb-1"
              style={{ fontSize: '24px', fontWeight: 700 }}
            >
              {stats.total}
            </p>
            <p 
              className="text-gray-600"
              style={{ fontSize: '13px', fontWeight: 500 }}
            >
              Total Exams
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-[16px] p-4 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-50 rounded-[12px] flex items-center justify-center">
                <Trophy className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p 
              className="text-gray-900 mb-1"
              style={{ fontSize: '24px', fontWeight: 700 }}
            >
              {stats.passed}
            </p>
            <p 
              className="text-gray-600"
              style={{ fontSize: '13px', fontWeight: 500 }}
            >
              Passed
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-[16px] p-4 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-50 rounded-[12px] flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p 
              className="text-gray-900 mb-1"
              style={{ fontSize: '24px', fontWeight: 700 }}
            >
              {stats.failed}
            </p>
            <p 
              className="text-gray-600"
              style={{ fontSize: '13px', fontWeight: 500 }}
            >
              Failed
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-[16px] p-4 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-50 rounded-[12px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p 
              className="text-gray-900 mb-1"
              style={{ fontSize: '24px', fontWeight: 700 }}
            >
              {stats.average.toFixed(1)}%
            </p>
            <p 
              className="text-gray-600"
              style={{ fontSize: '13px', fontWeight: 500 }}
            >
              Average
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-[16px] p-4 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-50 rounded-[12px] flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p 
              className="text-gray-900 mb-1"
              style={{ fontSize: '24px', fontWeight: 700 }}
            >
              {stats.highest.toFixed(1)}%
            </p>
            <p 
              className="text-gray-600"
              style={{ fontSize: '13px', fontWeight: 500 }}
            >
              Highest
            </p>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Search */}
            <div className="relative group">
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" 
                size={18} 
              />
              <input
                type="text"
                placeholder="Search by exam or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 placeholder-gray-400"
                style={{ fontSize: '14px', fontWeight: 500 }}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 appearance-none cursor-pointer"
                style={{ fontSize: '14px', fontWeight: 500 }}
              >
                <option value="all">All Status</option>
                <option value="pass">✅ Passed</option>
                <option value="fail">❌ Failed</option>
                <option value="absent">⏰ Absent</option>
                <option value="pending">⏸️ Pending</option>
              </select>
              <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </motion.div>

        {/* Results List */}
        <AnimatePresence mode="wait">
          {filteredResults.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[20px] p-12 shadow-soft border border-gray-100 text-center"
            >
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 
                className="text-gray-900 mb-2"
                style={{ fontSize: '18px', fontWeight: 600 }}
              >
                No Results Found
              </h3>
              <p 
                className="text-gray-600"
                style={{ fontSize: '14px' }}
              >
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'No exam results available yet'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredResults.map((result, index) => {
                const performance = getPerformanceIndicator(result.percentage);
                
                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedResult(result)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-[14px] flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-6 h-6 text-blue-500" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 
                                className="text-gray-900"
                                style={{ fontSize: '18px', fontWeight: 600 }}
                              >
                                {result.exam_schedules?.exam_name || 'Exam'}
                              </h3>
                              <span className={`px-3 py-1 rounded-lg font-medium border flex items-center gap-1 ${getStatusColor(result.status)}`} style={{ fontSize: '12px' }}>
                                {getStatusIcon(result.status)}
                                {result.status.toUpperCase()}
                              </span>
                              <span className={`px-3 py-1 rounded-xl font-bold ${getGradeColor(result.grade)}`} style={{ fontSize: '14px' }}>
                                {result.grade}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                              <div className="flex items-center gap-2 text-gray-600">
                                <BookOpen className="w-4 h-4 text-gray-400" />
                                <span style={{ fontSize: '14px', fontWeight: 500 }}>
                                  {result.exam_schedules?.subjects?.subject_name || 'Subject'}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span style={{ fontSize: '14px', fontWeight: 500 }}>
                                  {formatDate(result.evaluated_at)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-gray-600">
                                <Target className="w-4 h-4 text-gray-400" />
                                <span style={{ fontSize: '14px', fontWeight: 500 }}>
                                  {result.marks_obtained}/{result.exam_schedules?.max_marks}
                                </span>
                              </div>

                              <div className={`flex items-center gap-2 ${performance.color}`}>
                                {performance.icon}
                                <span style={{ fontSize: '14px', fontWeight: 600 }}>
                                  {performance.label}
                                </span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                              <div className="flex justify-between mb-2">
                                <span className="text-gray-600" style={{ fontSize: '13px', fontWeight: 500 }}>Performance</span>
                                <span className="text-gray-900" style={{ fontSize: '13px', fontWeight: 700 }}>{result.percentage.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    result.percentage >= 90 ? 'gradient-primary' :
                                    result.percentage >= 80 ? 'bg-cyan-500' :
                                    result.percentage >= 70 ? 'bg-emerald-500' :
                                    result.percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(result.percentage, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Result Detail Modal */}
        <AnimatePresence>
          {selectedResult && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedResult(null)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-float"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header with Gradient */}
                <div className="h-32 rounded-t-[24px] gradient-primary"></div>
                <div className="px-6 pb-4 -mt-12">
                  <div className="flex items-start justify-between">
                    <div className="w-20 h-20 gradient-primary rounded-[16px] shadow-soft flex items-center justify-center border-4 border-white">
                      <span className="text-white font-bold" style={{ fontSize: '24px' }}>{selectedResult.grade}</span>
                    </div>
                    <button
                      onClick={() => setSelectedResult(null)}
                      className="bg-white rounded-full p-2 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      <XCircle className="w-6 h-6 text-gray-700" />
                    </button>
                  </div>
                  <h3 
                    className="text-gray-900 mt-4"
                    style={{ fontSize: '24px', fontWeight: 600 }}
                  >
                    {selectedResult.exam_schedules?.exam_name}
                  </h3>
                  <p 
                    className="text-gray-600"
                    style={{ fontSize: '14px' }}
                  >
                    {selectedResult.exam_schedules?.subjects?.subject_name}
                  </p>
                </div>

                {/* Modal Content */}
                <div className="px-6 py-6 space-y-6">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-[16px] p-4 text-center border border-gray-100">
                      <div 
                        className="text-gray-900 mb-1"
                        style={{ fontSize: '24px', fontWeight: 700 }}
                      >
                        {selectedResult.marks_obtained}
                      </div>
                      <div className="text-gray-600" style={{ fontSize: '12px' }}>Marks Obtained</div>
                      <div className="text-gray-500 mt-1" style={{ fontSize: '11px' }}>
                        out of {selectedResult.exam_schedules?.max_marks}
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-[16px] p-4 text-center border border-blue-200">
                      <div 
                        className="text-blue-600 mb-1"
                        style={{ fontSize: '24px', fontWeight: 700 }}
                      >
                        {selectedResult.percentage.toFixed(1)}%
                      </div>
                      <div className="text-gray-600" style={{ fontSize: '12px' }}>Percentage</div>
                      <div className={`mt-1 ${getPerformanceIndicator(selectedResult.percentage).color}`} style={{ fontSize: '11px', fontWeight: 600 }}>
                        {getPerformanceIndicator(selectedResult.percentage).label}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-[16px] p-4 text-center border border-gray-100">
                      <div className={`inline-flex items-center px-3 py-1 rounded-lg font-bold ${getGradeColor(selectedResult.grade)}`} style={{ fontSize: '18px' }}>
                        {selectedResult.grade}
                      </div>
                      <div className="text-gray-600 mt-2" style={{ fontSize: '12px' }}>Grade</div>
                    </div>

                    <div className="bg-gray-50 rounded-[16px] p-4 text-center border border-gray-100">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg font-medium border ${getStatusColor(selectedResult.status)}`} style={{ fontSize: '13px' }}>
                        {getStatusIcon(selectedResult.status)}
                        <span className="capitalize">{selectedResult.status}</span>
                      </div>
                      <div className="text-gray-600 mt-2" style={{ fontSize: '12px' }}>Status</div>
                    </div>
                  </div>

                  {/* Performance Bar */}
                  <div className="bg-gray-50 rounded-[16px] p-4 border border-gray-100">
                    <div className="flex justify-between text-gray-600 mb-2" style={{ fontSize: '13px' }}>
                      <span>Performance Score</span>
                      <span className="font-semibold">{selectedResult.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          selectedResult.percentage >= 90 ? 'gradient-primary' :
                          selectedResult.percentage >= 80 ? 'bg-cyan-500' :
                          selectedResult.percentage >= 70 ? 'bg-emerald-500' :
                          selectedResult.percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(selectedResult.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Remarks */}
                  {selectedResult.remarks && (
                    <div className="bg-amber-50 rounded-[16px] p-4 border border-amber-200">
                      <div className="flex items-center gap-2 text-amber-700 mb-2">
                        <FileText className="w-4 h-4" />
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>Remarks</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed" style={{ fontSize: '14px' }}>
                        {selectedResult.remarks}
                      </p>
                    </div>
                  )}

                  {/* Evaluation Date */}
                  <div className="bg-blue-50 rounded-[16px] p-4 border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>Evaluation Date</span>
                    </div>
                    <p className="text-gray-700" style={{ fontSize: '14px' }}>
                      {new Date(selectedResult.evaluated_at).toLocaleString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-[24px]">
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-white font-medium transition-colors"
                    style={{ fontSize: '14px' }}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentResultsView;
