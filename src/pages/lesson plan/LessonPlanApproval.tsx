// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FileText, Clock, CheckCircle2, XCircle, Eye, Search,
//   Filter, User, Calendar, MessageSquare, ThumbsUp, ThumbsDown,
//   Plus, BookOpen, X, Upload, FileIcon, Trash2, Sparkles, Send
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { supabase } from '../../lib/supabase';
// import { useAuth } from '../../context/AuthContext';
// import { Button } from '../../components/ui/button';
// import { Badge } from '../../components/ui/badge';
// import { Input } from '../../components/ui/input';
// import { Textarea } from '../../components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

// interface Teacher {
//   id: string;
//   full_name: string;
//   employee_id: string;
//   email: string;
//   subject_specialization: string;
// }

// interface LessonPlan {
//   id: string;
//   title: string;
//   subject: string;
//   teacher_id: string;
//   teacher_name?: string;
//   grade_level: string;
//   duration: number;
//   objectives: string;
//   materials_required?: string;
//   teaching_methods?: string;
//   assessment_criteria?: string;
//   homework_assignments?: string;
//   teacher_notes?: string;
//   status: 'draft' | 'pending' | 'approved' | 'rejected';
//   submission_date?: string;
//   reviewed_by?: string;
//   reviewed_date?: string;
//   review_notes?: string;
//   attachments?: string[];
//   created_at: string;
//   updated_at: string;
//   teachers?: Teacher;
// }

// interface LessonPlanFormData {
//   teacher_id: string;
//   teacher_name: string;
//   title: string;
//   subject: string;
//   grade_level: string;
//   duration: number;
//   objectives: string;
//   materials_required: string;
//   teaching_methods: string;
//   assessment_criteria: string;
//   homework_assignments: string;
//   teacher_notes: string;
// }

// const subjects = [
//   'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Literature',
//   'History', 'Geography', 'Computer Science', 'Physical Education', 'Art',
//   'Music', 'Economics', 'Political Science', 'Psychology', 'Sociology'
// ];

// const gradeLevels = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);

// const durations = [15, 30, 45, 60, 90, 120, 180];

// export default function LessonPlanApproval() {
//   const { userProfile, isAdmin, isTeacher, isStudent } = useAuth();
//   const navigate = useNavigate();
  
//   const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showSubmitModal, setShowSubmitModal] = useState(false);
//   const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
//   const [reviewNotes, setReviewNotes] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // Form submission state
//   const [formData, setFormData] = useState<LessonPlanFormData>({
//     teacher_id: '',
//     teacher_name: '',
//     title: '',
//     subject: '',
//     grade_level: '',
//     duration: 45,
//     objectives: '',
//     materials_required: '',
//     teaching_methods: '',
//     assessment_criteria: '',
//     homework_assignments: '',
//     teacher_notes: ''
//   });
//   const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
//   const [uploading, setUploading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   // Check access
//   useEffect(() => {
//     if (isStudent) {
//       toast.error('Access Denied', {
//         description: 'Students do not have access to lesson plan approvals.'
//       });
//       navigate('/dashboard');
//     }
//   }, [isStudent, navigate]);

//   // Fetch teachers and lesson plans
//   useEffect(() => {
//     if (!isStudent) {
//       fetchTeachers();
//       fetchLessonPlans();
//     }
//   }, [userProfile]);

//   const fetchTeachers = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('teachers')
//         .select('id, full_name, employee_id, email, subject_specialization')
//         .eq('status', 'active')
//         .order('full_name');

//       if (error) throw error;
//       setTeachers(data || []);
//     } catch (error: any) {
//       console.error('Error fetching teachers:', error);
//     }
//   };

//   const fetchLessonPlans = async () => {
//     try {
//       setLoading(true);
      
//       let query = supabase
//         .from('lesson_plans')
//         .select(`
//           *,
//           teachers (
//             id,
//             full_name,
//             employee_id,
//             email,
//             subject_specialization
//           )
//         `)
//         .order('submission_date', { ascending: false, nullsFirst: false })
//         .order('created_at', { ascending: false });

//       if (isTeacher && userProfile) {
//         const { data: teacherData } = await supabase
//           .from('teachers')
//           .select('id')
//           .eq('email', userProfile.email)
//           .single();
        
//         if (teacherData) {
//           query = query.eq('teacher_id', teacherData.id);
//         }
//       }

//       const { data, error } = await query;
//       if (error) throw error;
//       setLessonPlans(data || []);
//     } catch (error: any) {
//       console.error('Error fetching lesson plans:', error);
//       toast.error('Failed to load lesson plans', {
//         description: error.message
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // File upload handlers
//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setUploadedFiles(prev => [...prev, ...files]);
//     }
//   };

//   const handleRemoveFile = (index: number) => {
//     setUploadedFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   const uploadFiles = async (): Promise<string[]> => {
//     if (uploadedFiles.length === 0) return [];

//     const uploadedPaths: string[] = [];
    
//     for (const file of uploadedFiles) {
//       const fileExt = file.name.split('.').pop();
//       const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
//       const filePath = `${userProfile?.id}/${fileName}`;

//       const { error } = await supabase.storage
//         .from('lesson-plans')
//         .upload(filePath, file);

//       if (error) {
//         console.error('Upload error:', error);
//         toast.error(`Failed to upload ${file.name}`);
//       } else {
//         uploadedPaths.push(filePath);
//       }
//     }

//     return uploadedPaths;
//   };

//   // Handle form submission
//   const handleSubmitLessonPlan = async () => {
//     // Validation
//     if (!formData.teacher_id || !formData.title || !formData.subject || !formData.grade_level || !formData.objectives) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     setSubmitting(true);
//     setUploading(true);

//     try {
//       // Upload files first
//       const attachmentPaths = await uploadFiles();
//       setUploading(false);

//       // Insert lesson plan
//       const { error } = await supabase.from('lesson_plans').insert({
//         teacher_id: formData.teacher_id,
//         teacher_name: formData.teacher_name,
//         title: formData.title,
//         subject: formData.subject,
//         grade_level: formData.grade_level,
//         duration: formData.duration,
//         objectives: formData.objectives,
//         materials_required: formData.materials_required || null,
//         teaching_methods: formData.teaching_methods || null,
//         assessment_criteria: formData.assessment_criteria || null,
//         homework_assignments: formData.homework_assignments || null,
//         teacher_notes: formData.teacher_notes || null,
//         attachments: attachmentPaths.length > 0 ? attachmentPaths : null,
//         status: 'pending',
//         submission_date: new Date().toISOString(),
//       });

//       if (error) throw error;

//       toast.success('Lesson Plan Submitted!', {
//         description: 'The lesson plan has been submitted for approval.'
//       });

//       // Reset form
//       setFormData({
//         teacher_id: '',
//         teacher_name: '',
//         title: '',
//         subject: '',
//         grade_level: '',
//         duration: 45,
//         objectives: '',
//         materials_required: '',
//         teaching_methods: '',
//         assessment_criteria: '',
//         homework_assignments: '',
//         teacher_notes: ''
//       });
//       setUploadedFiles([]);
//       setShowSubmitModal(false);
//       fetchLessonPlans();

//     } catch (error: any) {
//       console.error('Submit error:', error);
//       toast.error('Submission Failed', {
//         description: error.message
//       });
//     } finally {
//       setSubmitting(false);
//       setUploading(false);
//     }
//   };

//   // Filter and search
//   const filteredPlans = lessonPlans.filter(plan => {
//     const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
//     const matchesSearch = searchQuery === '' || 
//       plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       plan.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       plan.teachers?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       plan.teacher_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
//     return matchesStatus && matchesSearch;
//   });

//   const stats = {
//     pending: lessonPlans.filter(p => p.status === 'pending').length,
//     approved: lessonPlans.filter(p => p.status === 'approved').length,
//     rejected: lessonPlans.filter(p => p.status === 'rejected').length,
//     total: lessonPlans.length
//   };

//   // Handle review submission
//   const submitReview = async () => {
//     if (!selectedPlan || !reviewAction || !reviewNotes.trim()) {
//       toast.error('Please provide review notes');
//       return;
//     }

//     try {
//       const { error } = await supabase
//         .from('lesson_plans')
//         .update({
//           status: reviewAction === 'approve' ? 'approved' : 'rejected',
//           reviewed_by: userProfile?.id,
//           reviewed_date: new Date().toISOString(),
//           review_notes: reviewNotes
//         })
//         .eq('id', selectedPlan.id);

//       if (error) throw error;

//       toast.success(
//         `Lesson plan ${reviewAction === 'approve' ? 'approved' : 'rejected'} successfully!`
//       );

//       setShowReviewModal(false);
//       setReviewNotes('');
//       setSelectedPlan(null);
//       setReviewAction(null);
//       fetchLessonPlans();
//     } catch (error: any) {
//       console.error('Error reviewing lesson plan:', error);
//       toast.error('Failed to submit review', {
//         description: error.message
//       });
//     }
//   };

//   const handleReview = (action: 'approve' | 'reject') => {
//     setReviewAction(action);
//     setShowReviewModal(true);
//   };

//   const handleViewDetails = (plan: LessonPlan) => {
//     setSelectedPlan(plan);
//     setShowDetailsModal(true);
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'draft':
//         return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
//       case 'pending':
//         return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
//       case 'approved':
//         return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
//       case 'rejected':
//         return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
//       default:
//         return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
//     }
//   };

//   if (isStudent) {
//     return null;
//   }

//   return (
//     <div className="p-8 space-y-8">
//       {/* Header with Buttons */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex items-center justify-between"
//       >
//         <div>
//           <h1 className="text-3xl font-bold mb-2">
//             Lesson Plan {isTeacher ? 'Management' : 'Reviews'}
//           </h1>
//           <p className="text-gray-600">
//             {isTeacher 
//               ? 'Create and manage your lesson plans' 
//               : 'Review and approve lesson plans submitted by teachers'}
//           </p>
//         </div>
        
//         <div className="flex gap-3">
//           {/* Submit Form Button */}
//           <Button
//             onClick={() => setShowSubmitModal(true)}
//             className="h-12 px-6 rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg transition-all duration-200 hover:scale-105"
//           >
//             <Send className="w-5 h-5 mr-2" />
//             Submit Lesson Plan
//           </Button>

//           {/* Generate with AI Button */}
//           <Button
//             onClick={() => navigate('/lessonplangenerator')}
//             className="h-12 px-6 rounded-xl text-white bg-gradient-to-r from-[#1E88E5] to-[#5B9FFF] hover:shadow-lg transition-all duration-200 hover:scale-105"
//           >
//             <Sparkles className="w-5 h-5 mr-2" />
//             Generate with AI
//           </Button>
//         </div>
//       </motion.div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {[
//           { label: 'Total Plans', value: stats.total, icon: FileText, color: '#1E88E5' },
//           { label: 'Pending Review', value: stats.pending, icon: Clock, color: '#F57C00' },
//           { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: '#43A047' },
//           { label: 'Rejected', value: stats.rejected, icon: XCircle, color: '#E53935' },
//         ].map((stat, index) => {
//           const Icon = stat.icon;
//           return (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
//               className="glass-strong rounded-2xl p-6 shadow-soft"
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div 
//                   className="w-12 h-12 rounded-xl flex items-center justify-center"
//                   style={{ backgroundColor: `${stat.color}15` }}
//                 >
//                   <Icon className="w-6 h-6" style={{ color: stat.color }} />
//                 </div>
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
//               <p className="text-sm text-gray-600">{stat.label}</p>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* Filters */}
//       <div className="glass-strong rounded-2xl p-4 shadow-soft">
//         <div className="flex items-center gap-4">
//           <div className="relative flex-1">
//             <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <Input 
//               placeholder="Search by teacher, subject, or title..." 
//               value={searchQuery}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
//               className="pl-10 bg-white rounded-xl border-gray-200"
//             />
//           </div>
//           <Select value={filterStatus} onValueChange={setFilterStatus}>
//             <SelectTrigger className="w-48 bg-white rounded-xl">
//               <SelectValue placeholder="Filter by status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="draft">Draft</SelectItem>
//               <SelectItem value="pending">Pending</SelectItem>
//               <SelectItem value="approved">Approved</SelectItem>
//               <SelectItem value="rejected">Rejected</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Lesson Plans Table */}
//       <div className="glass-strong rounded-2xl shadow-soft overflow-hidden">
//         {loading ? (
//           <div className="p-12 text-center">
//             <div className="inline-block w-8 h-8 border-4 border-[#1E88E5] border-t-transparent rounded-full animate-spin" />
//             <p className="mt-4 text-gray-600">Loading lesson plans...</p>
//           </div>
//         ) : filteredPlans.length === 0 ? (
//           <div className="p-12 text-center">
//             <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
//             <p className="text-gray-600 mb-4">No lesson plans found</p>
//             <div className="flex gap-3 justify-center">
//               <Button
//                 onClick={() => setShowSubmitModal(true)}
//                 className="rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600"
//               >
//                 <Send className="w-4 h-4 mr-2" />
//                 Submit Lesson Plan
//               </Button>
//               <Button
//                 onClick={() => navigate('/lessonplangenerator')}
//                 className="rounded-xl text-white bg-gradient-to-r from-[#1E88E5] to-[#5B9FFF]"
//               >
//                 <Sparkles className="w-4 h-4 mr-2" />
//                 Generate with AI
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             {/* Table code continues... same as before */}
//             {/* I'll include the Submit Modal next */}
//           </div>
//         )}
//       </div>

//       {/* Submit Lesson Plan Modal */}
//       <AnimatePresence>
//         {showSubmitModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//             onClick={() => setShowSubmitModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               onClick={(e: React.MouseEvent) => e.stopPropagation()}
//               className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
//             >
//               {/* Modal Header */}
//               <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
//                     <Send className="w-5 h-5 text-white" />
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-800">Submit Lesson Plan</h2>
//                     <p className="text-sm text-gray-500">Fill in the details and attach files</p>
//                   </div>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setShowSubmitModal(false)}
//                   className="rounded-xl"
//                 >
//                   <X className="w-5 h-5" />
//                 </Button>
//               </div>

//               {/* Form */}
//               <div className="space-y-6">
//                 {/* Teacher Selection */}
//                 <div>
//                   <label className="block mb-1.5 font-medium text-gray-700">
//                     Teacher <span className="text-red-500">*</span>
//                   </label>
//                   <Select
//                     value={formData.teacher_id}
//                     onValueChange={(value) => {
//                       const teacher = teachers.find(t => t.id === value);
//                       setFormData(prev => ({
//                         ...prev,
//                         teacher_id: value,
//                         teacher_name: teacher?.full_name || '',
//                         subject: teacher?.subject_specialization || prev.subject
//                       }));
//                     }}
//                   >
//                     <SelectTrigger className="w-full bg-white rounded-xl">
//                       <SelectValue placeholder="Select teacher" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {teachers.map(teacher => (
//                         <SelectItem key={teacher.id} value={teacher.id}>
//                           {teacher.full_name} - {teacher.subject_specialization} ({teacher.employee_id})
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Rest of form fields */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Title */}
//                   <div>
//                     <label className="block mb-1.5 font-medium text-gray-700">
//                       Lesson Title <span className="text-red-500">*</span>
//                     </label>
//                     <Input
//                       value={formData.title}
//                       onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//                       placeholder="e.g., Introduction to Photosynthesis"
//                       className="rounded-xl"
//                     />
//                   </div>

//                   {/* Subject */}
//                   <div>
//                     <label className="block mb-1.5 font-medium text-gray-700">
//                       Subject <span className="text-red-500">*</span>
//                     </label>
//                     <Select
//                       value={formData.subject}
//                       onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
//                     >
//                       <SelectTrigger className="w-full bg-white rounded-xl">
//                         <SelectValue placeholder="Select subject" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {subjects.map(subject => (
//                           <SelectItem key={subject} value={subject}>{subject}</SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {/* Grade Level */}
//                   <div>
//                     <label className="block mb-1.5 font-medium text-gray-700">
//                       Grade Level <span className="text-red-500">*</span>
//                     </label>
//                     <Select
//                       value={formData.grade_level}
//                       onValueChange={(value) => setFormData(prev => ({ ...prev, grade_level: value }))}
//                     >
//                       <SelectTrigger className="w-full bg-white rounded-xl">
//                         <SelectValue placeholder="Select grade" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {gradeLevels.map(grade => (
//                           <SelectItem key={grade} value={grade}>{grade}</SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {/* Duration */}
//                   <div>
//                     <label className="block mb-1.5 font-medium text-gray-700">
//                       Duration (minutes) <span className="text-red-500">*</span>
//                     </label>
//                     <Select
//                       value={formData.duration.toString()}
//                       onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}
//                     >
//                       <SelectTrigger className="w-full bg-white rounded-xl">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {durations.map(duration => (
//                           <SelectItem key={duration} value={duration.toString()}>
//                             {duration} minutes
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 {/* Objectives */}
//                 <div>
//                   <label className="block mb-1.5 font-medium text-gray-700">
//                     Learning Objectives <span className="text-red-500">*</span>
//                   </label>
//                   <Textarea
//                     value={formData.objectives}
//                     onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
//                     placeholder="Enter clear learning goals..."
//                     rows={4}
//                     className="rounded-xl"
//                   />
//                 </div>

//                 {/* Optional Fields */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block mb-1.5 font-medium text-gray-700">Materials Required</label>
//                     <Textarea
//                       value={formData.materials_required}
//                       onChange={(e) => setFormData(prev => ({ ...prev, materials_required: e.target.value }))}
//                       placeholder="List materials..."
//                       rows={3}
//                       className="rounded-xl"
//                     />
//                   </div>

//                   <div>
//                     <label className="block mb-1.5 font-medium text-gray-700">Teaching Methods</label>
//                     <Textarea
//                       value={formData.teaching_methods}
//                       onChange={(e) => setFormData(prev => ({ ...prev, teaching_methods: e.target.value }))}
//                       placeholder="Describe methods..."
//                       rows={3}
//                       className="rounded-xl"
//                     />
//                   </div>

//                   <div>
//                     <label className="block mb-1.5 font-medium text-gray-700">Assessment Criteria</label>
//                     <Textarea
//                       value={formData.assessment_criteria}
//                       onChange={(e) => setFormData(prev => ({ ...prev, assessment_criteria: e.target.value }))}
//                       placeholder="How will you assess..."
//                       rows={3}
//                       className="rounded-xl"
//                     />
//                   </div>

//                   <div>
//                     <label className="block mb-1.5 font-medium text-gray-700">Homework Assignments</label>
//                     <Textarea
//                       value={formData.homework_assignments}
//                       onChange={(e) => setFormData(prev => ({ ...prev, homework_assignments: e.target.value }))}
//                       placeholder="Assignments..."
//                       rows={3}
//                       className="rounded-xl"
//                     />
//                   </div>
//                 </div>

//                 {/* Teacher Notes */}
//                 <div>
//                   <label className="block mb-1.5 font-medium text-gray-700">Teacher Notes</label>
//                   <Textarea
//                     value={formData.teacher_notes}
//                     onChange={(e) => setFormData(prev => ({ ...prev, teacher_notes: e.target.value }))}
//                     placeholder="Additional notes..."
//                     rows={3}
//                     className="rounded-xl"
//                   />
//                 </div>

//                 {/* File Upload */}
//                 <div>
//                   <label className="block mb-1.5 font-medium text-gray-700">Attachments</label>
//                   <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#1E88E5] transition-colors">
//                     <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
//                     <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
//                     <p className="text-xs text-gray-500">PDF, DOC, DOCX, PPT, PPTX (max 10MB)</p>
//                     <input
//                       type="file"
//                       multiple
//                       accept=".pdf,.doc,.docx,.ppt,.pptx"
//                       onChange={handleFileSelect}
//                       className="hidden"
//                       id="file-upload"
//                     />
//                     <label
//                       htmlFor="file-upload"
//                       className="mt-4 inline-block px-4 py-2 bg-[#1E88E5] text-white rounded-lg cursor-pointer hover:bg-[#1976D2]"
//                     >
//                       Choose Files
//                     </label>
//                   </div>

//                   {/* Uploaded Files List */}
//                   {uploadedFiles.length > 0 && (
//                     <div className="mt-4 space-y-2">
//                       {uploadedFiles.map((file, index) => (
//                         <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                           <div className="flex items-center gap-2">
//                             <FileIcon className="w-5 h-5 text-gray-600" />
//                             <span className="text-sm text-gray-700">{file.name}</span>
//                             <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => handleRemoveFile(index)}
//                             className="text-red-500 hover:text-red-700"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Submit Button */}
//                 <div className="flex gap-3 pt-4 border-t border-gray-200">
//                   <Button
//                     onClick={handleSubmitLessonPlan}
//                     disabled={submitting || uploading}
//                     className="flex-1 h-12 rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50"
//                   >
//                     {uploading ? (
//                       <>
//                         <Upload className="w-5 h-5 mr-2 animate-pulse" />
//                         Uploading Files...
//                       </>
//                     ) : submitting ? (
//                       <>
//                         <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                         Submitting...
//                       </>
//                     ) : (
//                       <>
//                         <Send className="w-5 h-5 mr-2" />
//                         Submit for Approval
//                       </>
//                     )}
//                   </Button>
//                   <Button
//                     onClick={() => setShowSubmitModal(false)}
//                     variant="outline"
//                     className="flex-1 h-12 rounded-xl"
//                     disabled={submitting || uploading}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Other modals (Review and Details) remain the same... */}
//     </div>
//   );
// }

// // Helper Components
// function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
//   return <label className={`text-sm font-medium text-gray-700 ${className}`}>{children}</label>;
// }

// function Section({ title, content }: { title: string; content: string }) {
//   return (
//     <div>
//       <p className="text-sm font-medium text-gray-700 mb-2">{title}</p>
//       <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//         <p className="text-sm text-gray-700 whitespace-pre-wrap">{content}</p>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Clock, CheckCircle2, XCircle, Eye, Search,
  Filter, User, Calendar, MessageSquare, ThumbsUp, ThumbsDown,
  Plus, BookOpen, X, Upload, FileIcon, Trash2, Sparkles, Send,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

interface Teacher {
  id: string;
  full_name: string;
  employee_id: string;
  email: string;
  subject_specialization: string;
}

interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  teacher_id: string;
  teacher_name?: string;
  grade_level: string;
  duration: number;
  objectives: string;
  materials_required?: string;
  teaching_methods?: string;
  assessment_criteria?: string;
  homework_assignments?: string;
  teacher_notes?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  submission_date?: string;
  reviewed_by?: string;
  reviewed_date?: string;
  review_notes?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
  teachers?: Teacher;
}

interface LessonPlanFormData {
  teacher_id: string;
  teacher_name: string;
  title: string;
  subject: string;
  grade_level: string;
  duration: number;
  objectives: string;
  materials_required: string;
  teaching_methods: string;
  assessment_criteria: string;
  homework_assignments: string;
  teacher_notes: string;
}

const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Literature',
  'History', 'Geography', 'Computer Science', 'Physical Education', 'Art',
  'Music', 'Economics', 'Political Science', 'Psychology', 'Sociology'
];

const gradeLevels = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);

const durations = [15, 30, 45, 60, 90, 120, 180];

export default function LessonPlanApproval() {
  const { userProfile, isAdmin, isTeacher, isStudent } = useAuth();
  const navigate = useNavigate();
  
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form submission state
  const [formData, setFormData] = useState<LessonPlanFormData>({
    teacher_id: '',
    teacher_name: '',
    title: '',
    subject: '',
    grade_level: '',
    duration: 45,
    objectives: '',
    materials_required: '',
    teaching_methods: '',
    assessment_criteria: '',
    homework_assignments: '',
    teacher_notes: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Check access
  useEffect(() => {
    if (isStudent) {
      toast.error('Access Denied', {
        description: 'Students do not have access to lesson plan approvals.'
      });
      navigate('/dashboard');
    }
  }, [isStudent, navigate]);

  // Fetch teachers and lesson plans
  useEffect(() => {
    if (!isStudent) {
      fetchTeachers();
      fetchLessonPlans();
    }
  }, [userProfile]);

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('id, full_name, employee_id, email, subject_specialization')
        .eq('status', 'active')
        .order('full_name');

      if (error) throw error;
      setTeachers(data || []);
    } catch (error: any) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchLessonPlans = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('lesson_plans')
        .select(`
          *,
          teachers (
            id,
            full_name,
            employee_id,
            email,
            subject_specialization
          )
        `)
        .order('submission_date', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (isTeacher && userProfile) {
        const { data: teacherData } = await supabase
          .from('teachers')
          .select('id')
          .eq('email', userProfile.email)
          .single();
        
        if (teacherData) {
          query = query.eq('teacher_id', teacherData.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      setLessonPlans(data || []);
    } catch (error: any) {
      console.error('Error fetching lesson plans:', error);
      toast.error('Failed to load lesson plans', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // File upload handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024); // 10MB limit
      
      if (validFiles.length !== files.length) {
        toast.error('Some files exceed 10MB limit');
      }
      
      setUploadedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (uploadedFiles.length === 0) return [];

    const uploadedPaths: string[] = [];
    
    for (const file of uploadedFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${userProfile?.id}/${fileName}`;

      const { error } = await supabase.storage
        .from('lesson-plans')
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      } else {
        uploadedPaths.push(filePath);
      }
    }

    return uploadedPaths;
  };

  // Download attachment
  const downloadAttachment = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('lesson-plans')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop() || 'file';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error('Download Failed', {
        description: error.message
      });
    }
  };

  // Handle form submission
  const handleSubmitLessonPlan = async () => {
    // Validation
    if (!formData.teacher_id || !formData.title || !formData.subject || !formData.grade_level || !formData.objectives) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setUploading(true);

    try {
      // Upload files first
      const attachmentPaths = await uploadFiles();
      setUploading(false);

      // Insert lesson plan
      const { error } = await supabase.from('lesson_plans').insert({
        teacher_id: formData.teacher_id,
        teacher_name: formData.teacher_name,
        title: formData.title,
        subject: formData.subject,
        grade_level: formData.grade_level,
        duration: formData.duration,
        objectives: formData.objectives,
        materials_required: formData.materials_required || null,
        teaching_methods: formData.teaching_methods || null,
        assessment_criteria: formData.assessment_criteria || null,
        homework_assignments: formData.homework_assignments || null,
        teacher_notes: formData.teacher_notes || null,
        attachments: attachmentPaths.length > 0 ? attachmentPaths : null,
        status: 'pending',
        submission_date: new Date().toISOString(),
      });

      if (error) throw error;

      toast.success('Lesson Plan Submitted!', {
        description: 'The lesson plan has been submitted for approval.'
      });

      // Reset form
      setFormData({
        teacher_id: '',
        teacher_name: '',
        title: '',
        subject: '',
        grade_level: '',
        duration: 45,
        objectives: '',
        materials_required: '',
        teaching_methods: '',
        assessment_criteria: '',
        homework_assignments: '',
        teacher_notes: ''
      });
      setUploadedFiles([]);
      setShowSubmitModal(false);
      fetchLessonPlans();

    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error('Submission Failed', {
        description: error.message
      });
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  // Filter and search
  const filteredPlans = lessonPlans.filter(plan => {
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.teachers?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.teacher_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const stats = {
    pending: lessonPlans.filter(p => p.status === 'pending').length,
    approved: lessonPlans.filter(p => p.status === 'approved').length,
    rejected: lessonPlans.filter(p => p.status === 'rejected').length,
    total: lessonPlans.length
  };

  // Handle review submission
  const submitReview = async () => {
    if (!selectedPlan || !reviewAction || !reviewNotes.trim()) {
      toast.error('Please provide review notes');
      return;
    }

    try {
      const { error } = await supabase
        .from('lesson_plans')
        .update({
          status: reviewAction === 'approve' ? 'approved' : 'rejected',
          reviewed_by: userProfile?.id,
          reviewed_date: new Date().toISOString(),
          review_notes: reviewNotes
        })
        .eq('id', selectedPlan.id);

      if (error) throw error;

      toast.success(
        `Lesson plan ${reviewAction === 'approve' ? 'approved' : 'rejected'} successfully!`
      );

      setShowReviewModal(false);
      setReviewNotes('');
      setSelectedPlan(null);
      setReviewAction(null);
      fetchLessonPlans();
    } catch (error: any) {
      console.error('Error reviewing lesson plan:', error);
      toast.error('Failed to submit review', {
        description: error.message
      });
    }
  };

  const handleReview = (action: 'approve' | 'reject') => {
    setReviewAction(action);
    setShowReviewModal(true);
  };

  const handleViewDetails = (plan: LessonPlan) => {
    setSelectedPlan(plan);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
      case 'pending':
        return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
      case 'approved':
        return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
      case 'rejected':
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  if (isStudent) {
    return null;
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header with Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Lesson Plan {isTeacher ? 'Management' : 'Reviews'}
          </h1>
          <p className="text-gray-600">
            {isTeacher 
              ? 'Create and manage your lesson plans' 
              : 'Review and approve lesson plans submitted by teachers'}
          </p>
        </div>
        
        <div className="flex gap-3">
          {/* Submit Form Button */}
          <Button
            onClick={() => setShowSubmitModal(true)}
            className="h-12 px-6 rounded-xl text-white bg-gradient-to-r from-[#1E88E5] to-[#5B9FFF] hover:shadow-lg transition-all duration-200 hover:scale-105"          >
            <Send className="w-5 h-5 mr-2" />
            Submit Lesson Plan
          </Button>

          {/* Generate with AI Button */}
          <Button
            onClick={() => navigate('/lessonplangenerator')}
            className="h-12 px-6 rounded-xl text-white bg-gradient-to-r from-[#1E88E5] to-[#5B9FFF] hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate with AI
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Plans', value: stats.total, icon: FileText, color: '#1E88E5' },
          { label: 'Pending Review', value: stats.pending, icon: Clock, color: '#F57C00' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: '#43A047' },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: '#E53935' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
              className="glass-strong rounded-2xl p-6 shadow-soft"
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="glass-strong rounded-2xl p-4 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search by teacher, subject, or title..." 
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white rounded-xl border-gray-200"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48 bg-white rounded-xl">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lesson Plans Table */}
      <div className="glass-strong rounded-2xl shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#1E88E5] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600">Loading lesson plans...</p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-4">No lesson plans found</p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => setShowSubmitModal(true)}
                className="rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Lesson Plan
              </Button>
              <Button
                onClick={() => navigate('/lessonplangenerator')}
                className="rounded-xl text-white bg-gradient-to-r from-[#1E88E5] to-[#5B9FFF]"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate with AI
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#1E88E5]/5 to-[#5B9FFF]/5 border-b border-gray-200/50">
                  <th className="text-left p-4 text-gray-700 font-semibold">Lesson Plan</th>
                  <th className="text-left p-4 text-gray-700 font-semibold">Teacher</th>
                  <th className="text-left p-4 text-gray-700 font-semibold">Subject</th>
                  <th className="text-left p-4 text-gray-700 font-semibold">Submitted</th>
                  <th className="text-left p-4 text-gray-700 font-semibold">Status</th>
                  <th className="text-left p-4 text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {filteredPlans.map((plan, index) => {
                  const statusColors = getStatusColor(plan.status);
                  const teacherName = plan.teachers?.full_name || plan.teacher_name || 'Unknown';
                  
                  return (
                    <motion.tr
                      key={plan.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-[#1E88E5]/3 transition-colors duration-200"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-800">{plan.title}</p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {plan.grade_level} • {plan.duration} minutes
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E88E5] to-[#5B9FFF] flex items-center justify-center text-white text-sm font-semibold">
                            {teacherName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                          <span className="text-gray-700">{teacherName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">{plan.subject}</td>
                      <td className="p-4">
                        {plan.submission_date ? (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(plan.submission_date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Not submitted</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge 
                          className={`rounded-lg px-3 py-1 ${statusColors.bg} ${statusColors.text} ${statusColors.border} capitalize`}
                        >
                          {plan.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleViewDetails(plan)}
                            variant="ghost"
                            size="sm"
                            className="rounded-lg hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {!isTeacher && plan.status === 'pending' && (
                            <>
                              <Button
                                onClick={() => {
                                  setSelectedPlan(plan);
                                  handleReview('approve');
                                }}
                                variant="ghost"
                                size="sm"
                                className="rounded-lg text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedPlan(plan);
                                  handleReview('reject');
                                }}
                                variant="ghost"
                                size="sm"
                                className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submit Lesson Plan Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSubmitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#1E88E5] to-[#5B9FFF] flex items-center justify-center">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Submit Lesson Plan</h2>
                    <p className="text-sm text-gray-500">Fill in the details and attach files</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSubmitModal(false)}
                  className="rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Teacher Selection */}
                <div>
                  <label className="block mb-1.5 font-medium text-gray-700">
                    Teacher <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.teacher_id}
                    onValueChange={(value) => {
                      const teacher = teachers.find(t => t.id === value);
                      setFormData(prev => ({
                        ...prev,
                        teacher_id: value,
                        teacher_name: teacher?.full_name || '',
                        subject: teacher?.subject_specialization || prev.subject
                      }));
                    }}
                  >
                    <SelectTrigger className="w-full bg-white rounded-xl">
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map(teacher => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.full_name} - {teacher.subject_specialization} ({teacher.employee_id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Title and Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700">
                      Lesson Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Introduction to Photosynthesis"
                      className="rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger className="w-full bg-white rounded-xl">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700">
                      Grade Level <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.grade_level}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, grade_level: value }))}
                    >
                      <SelectTrigger className="w-full bg-white rounded-xl">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeLevels.map(grade => (
                          <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700">
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.duration.toString()}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}
                    >
                      <SelectTrigger className="w-full bg-white rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {durations.map(duration => (
                          <SelectItem key={duration} value={duration.toString()}>
                            {duration} minutes
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Objectives */}
                <div>
                  <label className="block mb-1.5 font-medium text-gray-700">
                    Learning Objectives <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.objectives}
                    onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
                    placeholder="Enter clear learning goals for this lesson..."
                    rows={4}
                    className="rounded-xl"
                  />
                </div>

                {/* Optional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700">Materials Required</label>
                    <Textarea
                      value={formData.materials_required}
                      onChange={(e) => setFormData(prev => ({ ...prev, materials_required: e.target.value }))}
                      placeholder="List materials needed..."
                      rows={3}
                      className="rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700">Teaching Methods</label>
                    <Textarea
                      value={formData.teaching_methods}
                      onChange={(e) => setFormData(prev => ({ ...prev, teaching_methods: e.target.value }))}
                      placeholder="Describe teaching approaches..."
                      rows={3}
                      className="rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700">Assessment Criteria</label>
                    <Textarea
                      value={formData.assessment_criteria}
                      onChange={(e) => setFormData(prev => ({ ...prev, assessment_criteria: e.target.value }))}
                      placeholder="How will you assess learning..."
                      rows={3}
                      className="rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700">Homework Assignments</label>
                    <Textarea
                      value={formData.homework_assignments}
                      onChange={(e) => setFormData(prev => ({ ...prev, homework_assignments: e.target.value }))}
                      placeholder="Assignments for students..."
                      rows={3}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                {/* Teacher Notes */}
                <div>
                  <label className="block mb-1.5 font-medium text-gray-700">Teacher Notes</label>
                  <Textarea
                    value={formData.teacher_notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, teacher_notes: e.target.value }))}
                    placeholder="Additional notes or special considerations..."
                    rows={3}
                    className="rounded-xl"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block mb-1.5 font-medium text-gray-700">Attachments</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#1E88E5] transition-colors">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, PPT, PPTX (max 10MB per file)</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="mt-4 inline-block px-4 py-2 bg-[#1E88E5] text-white rounded-lg cursor-pointer hover:bg-[#1976D2] transition-colors"
                    >
                      Choose Files
                    </label>
                  </div>

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileIcon className="w-5 h-5 text-gray-600" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={handleSubmitLessonPlan}
                    disabled={submitting || uploading}
                    className="flex-1 h-12 rounded-xl text-white bg-gradient-to-r from-[#1E88E5] to-[#5B9FFF] hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Upload className="w-5 h-5 mr-2 animate-pulse" />
                        Uploading Files...
                      </>
                    ) : submitting ? (
                      <>
                        <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Submit for Approval
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowSubmitModal(false)}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl"
                    disabled={submitting || uploading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && selectedPlan && reviewAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    reviewAction === 'approve' ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  {reviewAction === 'approve' ? (
                    <ThumbsUp className="w-6 h-6 text-green-600" />
                  ) : (
                    <ThumbsDown className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {reviewAction === 'approve' ? 'Approve' : 'Reject'} Lesson Plan
                  </h2>
                  <p className="text-sm text-gray-500">{selectedPlan.title}</p>
                </div>
              </div>

              {/* Review Details */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Teacher</p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedPlan.teachers?.full_name || selectedPlan.teacher_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Subject</p>
                    <p className="text-sm font-medium text-gray-800">{selectedPlan.subject}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Grade Level</p>
                    <p className="text-sm font-medium text-gray-800">{selectedPlan.grade_level}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <p className="text-sm font-medium text-gray-800">{selectedPlan.duration} minutes</p>
                  </div>
                </div>

                {selectedPlan.teacher_notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Teacher's Notes:</p>
                    <p className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      {selectedPlan.teacher_notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Review Notes */}
              <div className="mb-6">
                <Label className="mb-2 block">Your Review Notes *</Label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReviewNotes(e.target.value)}
                  placeholder={
                    reviewAction === 'approve' 
                      ? 'Add feedback or commendations for the teacher...'
                      : 'Explain what needs to be improved or changed...'
                  }
                  className="bg-white rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1E88E5]/20 min-h-32"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={submitReview}
                  disabled={!reviewNotes.trim()}
                  className={`flex-1 h-12 rounded-xl text-white gap-2 ${
                    reviewAction === 'approve' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {reviewAction === 'approve' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  {reviewAction === 'approve' ? 'Approve Lesson Plan' : 'Reject Lesson Plan'}
                </Button>
                <Button
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewNotes('');
                  }}
                  variant="outline"
                  className="flex-1 h-12 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedPlan.title}</h2>
                  <div className="flex items-center gap-3">
                    <Badge className={`rounded-lg capitalize ${getStatusColor(selectedPlan.status).bg} ${getStatusColor(selectedPlan.status).text} ${getStatusColor(selectedPlan.status).border}`}>
                      {selectedPlan.status}
                    </Badge>
                    {selectedPlan.submission_date && (
                      <span className="text-sm text-gray-500">
                        Submitted {new Date(selectedPlan.submission_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowDetailsModal(false)}
                  className="rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Basic Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Teacher</p>
                  <p className="font-medium text-gray-800">
                    {selectedPlan.teachers?.full_name || selectedPlan.teacher_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Subject</p>
                  <p className="font-medium text-gray-800">{selectedPlan.subject}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Grade Level</p>
                  <p className="font-medium text-gray-800">{selectedPlan.grade_level}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="font-medium text-gray-800">{selectedPlan.duration} minutes</p>
                </div>
              </div>

              {/* Detailed Content */}
              <div className="space-y-6">
                <Section title="Learning Objectives" content={selectedPlan.objectives} />
                
                {selectedPlan.materials_required && (
                  <Section title="Materials Required" content={selectedPlan.materials_required} />
                )}
                
                {selectedPlan.teaching_methods && (
                  <Section title="Teaching Methods" content={selectedPlan.teaching_methods} />
                )}
                
                {selectedPlan.assessment_criteria && (
                  <Section title="Assessment Criteria" content={selectedPlan.assessment_criteria} />
                )}
                
                {selectedPlan.homework_assignments && (
                  <Section title="Homework Assignments" content={selectedPlan.homework_assignments} />
                )}
                
                {selectedPlan.teacher_notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Teacher's Notes</p>
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedPlan.teacher_notes}</p>
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {selectedPlan.attachments && selectedPlan.attachments.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Attachments ({selectedPlan.attachments.length})</p>
                    <div className="space-y-2">
                      {selectedPlan.attachments.map((filePath, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2">
                            <FileIcon className="w-5 h-5 text-gray-600" />
                            <span className="text-sm text-gray-700">
                              {filePath.split('/').pop()?.split('-').slice(2).join('-') || `Attachment ${index + 1}`}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadAttachment(filePath)}
                            className="text-[#1E88E5] hover:text-[#1976D2] hover:bg-blue-50"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPlan.review_notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Review Feedback</p>
                    <div className={`p-4 rounded-xl border ${
                      selectedPlan.status === 'approved' 
                        ? 'bg-green-50 border-green-100' 
                        : 'bg-red-50 border-red-100'
                    }`}>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedPlan.review_notes}</p>
                      {selectedPlan.reviewed_date && (
                        <p className="text-xs text-gray-500 mt-2">
                          Reviewed on {new Date(selectedPlan.reviewed_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              {!isTeacher && selectedPlan.status === 'pending' && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleReview('approve');
                    }}
                    className="flex-1 rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleReview('reject');
                    }}
                    className="flex-1 rounded-xl text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Components
function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-sm font-medium text-gray-700 ${className}`}>{children}</label>;
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">{title}</p>
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
