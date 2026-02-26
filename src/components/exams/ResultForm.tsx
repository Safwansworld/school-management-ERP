// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { ExamSchedule } from '../../types/Exam';
// import { Student, GradeScale, ExamResult } from '../../types/results';
// import { 
//   X, 
//   Save, 
//   Plus, 
//   Trash2, 
//   User, 
//   BookOpen, 
//   FileText, 
//   Award, 
//   Target, 
//   AlertCircle, 
//   CheckCircle, 
//   Calendar, 
//   Hash, 
//   Percent,
//   Upload,
//   Download
// } from 'lucide-react';

// interface ResultFormProps {
//   exams: ExamSchedule[];
//   students: Student[];
//   gradeScales: GradeScale[];
//   initialData?: ExamResult | null;
//   onSubmit: (data: any) => void;
//   onClose: () => void;
// }

// interface ResultEntry {
//   student_id: string;
//   exam_id: string;
//   marks_obtained: number;
//   remarks?: string;
// }

// const ResultForm: React.FC<ResultFormProps> = ({
//   exams,
//   students,
//   gradeScales,
//   initialData,
//   onSubmit,
//   onClose,
// }) => {
//   const [isBulkMode, setIsBulkMode] = useState(!initialData);
//   const [selectedExam, setSelectedExam] = useState<string>(initialData?.exam_id || '');
//   const [resultEntries, setResultEntries] = useState<ResultEntry[]>(
//     initialData
//       ? [
//           {
//             student_id: initialData.student_id,
//             exam_id: initialData.exam_id,
//             marks_obtained: initialData.marks_obtained,
//             remarks: initialData.remarks,
//           },
//         ]
//       : []
//   );

//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const selectedExamDetails = exams.find((exam) => exam.id === selectedExam);
//   const maxMarks = selectedExamDetails?.max_marks || 100;

//   useEffect(() => {
//     if (initialData) {
//       setSelectedExam(initialData.exam_id);
//     }
//   }, [initialData]);

//   const calculateGrade = (percentage: number): string => {
//     const grade = gradeScales.find(
//       (scale) => percentage >= scale.min_percentage && percentage <= scale.max_percentage
//     );
//     return grade?.grade || 'F';
//   };

//   const addResultEntry = () => {
//     if (!selectedExam) {
//       setFormErrors({ exam: 'Please select an exam first' });
//       return;
//     }

//     setResultEntries([
//       ...resultEntries,
//       {
//         student_id: '',
//         exam_id: selectedExam,
//         marks_obtained: 0,
//         remarks: '',
//       },
//     ]);
//     setFormErrors({});
//   };

//   const removeResultEntry = (index: number) => {
//     setResultEntries(resultEntries.filter((_, i) => i !== index));
//   };

//   const updateResultEntry = (index: number, field: keyof ResultEntry, value: any) => {
//     const updated = [...resultEntries];
//     updated[index] = { ...updated[index], [field]: value };
//     setResultEntries(updated);

//     // Clear specific error
//     if (formErrors[`entry-${index}-${field}`]) {
//       const newErrors = { ...formErrors };
//       delete newErrors[`entry-${index}-${field}`];
//       setFormErrors(newErrors);
//     }
//   };

//   const validateForm = (): boolean => {
//     const errors: Record<string, string> = {};

//     if (!selectedExam) {
//       errors.exam = 'Please select an exam';
//     }

//     if (resultEntries.length === 0) {
//       errors.entries = 'Please add at least one result entry';
//     }

//     resultEntries.forEach((entry, index) => {
//       if (!entry.student_id) {
//         errors[`entry-${index}-student_id`] = 'Student is required';
//       }
//       if (entry.marks_obtained < 0 || entry.marks_obtained > maxMarks) {
//         errors[`entry-${index}-marks_obtained`] = `Marks must be between 0 and ${maxMarks}`;
//       }
      
//       // Check for duplicate students
//       const duplicates = resultEntries.filter(e => e.student_id === entry.student_id);
//       if (duplicates.length > 1 && entry.student_id) {
//         errors[`entry-${index}-student_id`] = 'Duplicate student entry';
//       }
//     });

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const submissionData = resultEntries.map((entry) => {
//         const percentage = (entry.marks_obtained / maxMarks) * 100;
//         const grade = calculateGrade(percentage);
//         const status = percentage >= 35 ? 'pass' : 'fail';

//         return {
//           ...entry,
//           exam_id: selectedExam,
//           percentage,
//           grade,
//           status,
//         };
//       });

//       await onSubmit(submissionData);
//     } catch (error) {
//       console.error('Error submitting results:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full max-h-[90vh]">
//       {/* Header */}
//       <div className="sticky top-0 bg-white border-b border-border px-6 py-4 rounded-t-2xl z-10">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="h-10 w-10 gradient-primary rounded-lg flex items-center justify-center">
//               {initialData ? (
//                 <FileText className="h-5 w-5 text-white" />
//               ) : (
//                 <Plus className="h-5 w-5 text-white" />
//               )}
//             </div>
//             <div>
//               <h3 className="text-xl font-bold text-foreground">
//                 {initialData ? 'Edit Result' : 'Add Results'}
//               </h3>
//               <p className="text-sm text-muted-foreground">
//                 {initialData ? 'Update student exam result' : 'Add exam results for students'}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>
//       </div>

//       {/* Form Content */}
//       <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
//         {/* Exam Selection */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/20"
//         >
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <BookOpen className="w-5 h-5 text-primary" />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-foreground">
//                 Select Exam <span className="text-destructive">*</span>
//               </label>
//               <p className="text-xs text-muted-foreground">Choose the exam for these results</p>
//             </div>
//           </div>
          
//           <select
//             value={selectedExam}
//             onChange={(e) => {
//               setSelectedExam(e.target.value);
//               setFormErrors({});
//             }}
//             disabled={!!initialData}
//             className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white ${
//               formErrors.exam ? 'border-destructive' : 'border-input'
//             } ${initialData ? 'opacity-60 cursor-not-allowed' : ''}`}
//           >
//             <option value="">-- Select an Exam --</option>
//             {exams.map((exam) => (
//               <option key={exam.id} value={exam.id}>
//                 {exam.exam_name} - {exam.subjects?.subject_name} ({exam.subjects?.subject_code}) - Max Marks: {exam.max_marks}
//               </option>
//             ))}
//           </select>
//           {formErrors.exam && (
//             <motion.p 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="mt-2 text-sm text-destructive flex items-center gap-2"
//             >
//               <AlertCircle size={14} />
//               {formErrors.exam}
//             </motion.p>
//           )}

//           {selectedExamDetails && (
//             <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="bg-white rounded-xl p-3 shadow-soft">
//                 <p className="text-xs text-muted-foreground mb-1">Subject</p>
//                 <p className="font-semibold text-foreground text-sm">{selectedExamDetails.subjects?.subject_name}</p>
//               </div>
//               <div className="bg-white rounded-xl p-3 shadow-soft">
//                 <p className="text-xs text-muted-foreground mb-1">Code</p>
//                 <p className="font-semibold text-foreground text-sm">{selectedExamDetails.subjects?.subject_code}</p>
//               </div>
//               <div className="bg-white rounded-xl p-3 shadow-soft">
//                 <p className="text-xs text-muted-foreground mb-1">Max Marks</p>
//                 <p className="font-semibold text-primary text-sm">{selectedExamDetails.max_marks}</p>
//               </div>
//               <div className="bg-white rounded-xl p-3 shadow-soft">
//                 <p className="text-xs text-muted-foreground mb-1">Date</p>
//                 <p className="font-semibold text-foreground text-sm">
//                   {new Date(selectedExamDetails.exam_date).toLocaleDateString('en-US', { 
//                     month: 'short', 
//                     day: 'numeric' 
//                   })}
//                 </p>
//               </div>
//             </div>
//           )}
//         </motion.div>

//         {/* Mode Toggle (for new results) */}
//         {!initialData && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="flex items-center justify-between bg-secondary rounded-xl p-4"
//           >
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-primary/10 rounded-lg">
//                 <Target className="w-5 h-5 text-primary" />
//               </div>
//               <div>
//                 <p className="text-sm font-semibold text-foreground">Entry Mode</p>
//                 <p className="text-xs text-muted-foreground">
//                   {isBulkMode ? 'Add multiple results at once' : 'Add single result'}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => setIsBulkMode(!isBulkMode)}
//               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                 isBulkMode ? 'bg-primary' : 'bg-muted'
//               }`}
//             >
//               <span
//                 className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                   isBulkMode ? 'translate-x-6' : 'translate-x-1'
//                 }`}
//               />
//             </button>
//           </motion.div>
//         )}

//         {/* Result Entries */}
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-accent/10 rounded-lg">
//                 <User className="w-5 h-5 text-accent" />
//               </div>
//               <div>
//                 <h4 className="text-sm font-semibold text-foreground">Student Results</h4>
//                 <p className="text-xs text-muted-foreground">
//                   {resultEntries.length} {resultEntries.length === 1 ? 'entry' : 'entries'}
//                 </p>
//               </div>
//             </div>
//             {!initialData && selectedExam && (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={addResultEntry}
//                 className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-xl text-sm font-medium shadow-glow hover:shadow-float transition-all"
//               >
//                 <Plus size={16} />
//                 Add Student
//               </motion.button>
//             )}
//           </div>

//           {formErrors.entries && (
//             <motion.div 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-3"
//             >
//               <AlertCircle className="text-destructive" size={20} />
//               <p className="text-sm text-destructive font-medium">{formErrors.entries}</p>
//             </motion.div>
//           )}

//           {resultEntries.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-center py-12 bg-secondary rounded-2xl border-2 border-dashed border-border"
//             >
//               <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <User className="w-8 h-8 text-primary" />
//               </div>
//               <h4 className="text-lg font-semibold text-foreground mb-2">No Students Added</h4>
//               <p className="text-muted-foreground mb-4">
//                 {selectedExam 
//                   ? 'Click "Add Student" to start adding results' 
//                   : 'Select an exam first to add student results'}
//               </p>
//             </motion.div>
//           ) : (
//             <div className="space-y-4">
//               {resultEntries.map((entry, index) => {
//                 const percentage = (entry.marks_obtained / maxMarks) * 100;
//                 const grade = calculateGrade(percentage);
//                 const student = students.find(s => s.id === entry.student_id);

//                 return (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.05 }}
//                     className="glass-strong rounded-2xl p-6 shadow-soft border border-border"
//                   >
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="flex items-center gap-3">
//                         <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
//                           <span className="text-sm font-bold text-primary">#{index + 1}</span>
//                         </div>
//                         <div>
//                           <h5 className="font-semibold text-foreground">Result Entry</h5>
//                           <p className="text-xs text-muted-foreground">
//                             {student ? `${student.full_name} (${student.roll_number})` : 'Select a student'}
//                           </p>
//                         </div>
//                       </div>
//                       {!initialData && resultEntries.length > 1 && (
//                         <button
//                           onClick={() => removeResultEntry(index)}
//                           className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       )}
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {/* Student Selection */}
//                       <div>
//                         <label className="block text-sm font-medium text-foreground mb-2">
//                           Student <span className="text-destructive">*</span>
//                         </label>
//                         <select
//                           value={entry.student_id}
//                           onChange={(e) => updateResultEntry(index, 'student_id', e.target.value)}
//                           className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white ${
//                             formErrors[`entry-${index}-student_id`] ? 'border-destructive' : 'border-input'
//                           }`}
//                         >
//                           <option value="">-- Select Student --</option>
//                           {students.map((student) => (
//                             <option key={student.id} value={student.id}>
//                               {student.full_name} ({student.roll_number})
//                             </option>
//                           ))}
//                         </select>
//                         {formErrors[`entry-${index}-student_id`] && (
//                           <p className="mt-1 text-xs text-destructive flex items-center gap-1">
//                             <AlertCircle size={12} />
//                             {formErrors[`entry-${index}-student_id`]}
//                           </p>
//                         )}
//                       </div>

//                       {/* Marks Obtained */}
//                       <div>
//                         <label className="block text-sm font-medium text-foreground mb-2">
//                           Marks Obtained <span className="text-destructive">*</span>
//                         </label>
//                         <div className="relative">
//                           <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
//                           <input
//                             type="number"
//                             min="0"
//                             max={maxMarks}
//                             value={entry.marks_obtained}
//                             onChange={(e) => updateResultEntry(index, 'marks_obtained', parseFloat(e.target.value) || 0)}
//                             className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
//                               formErrors[`entry-${index}-marks_obtained`] ? 'border-destructive' : 'border-input'
//                             }`}
//                             placeholder={`Max: ${maxMarks}`}
//                           />
//                         </div>
//                         {formErrors[`entry-${index}-marks_obtained`] && (
//                           <p className="mt-1 text-xs text-destructive flex items-center gap-1">
//                             <AlertCircle size={12} />
//                             {formErrors[`entry-${index}-marks_obtained`]}
//                           </p>
//                         )}
//                       </div>

//                       {/* Remarks */}
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-foreground mb-2">
//                           Remarks (Optional)
//                         </label>
//                         <textarea
//                           value={entry.remarks || ''}
//                           onChange={(e) => updateResultEntry(index, 'remarks', e.target.value)}
//                           rows={2}
//                           className="w-full px-4 py-3 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
//                           placeholder="Add any remarks or comments about the student's performance..."
//                         />
//                       </div>
//                     </div>

//                     {/* Performance Preview */}
//                     {entry.student_id && entry.marks_obtained >= 0 && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="mt-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/10"
//                       >
//                         <h6 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2">
//                           <Target size={14} className="text-primary" />
//                           Performance Preview
//                         </h6>
//                         <div className="grid grid-cols-3 gap-4">
//                           <div className="text-center">
//                             <div className="text-2xl font-bold text-primary mb-1">
//                               {percentage.toFixed(1)}%
//                             </div>
//                             <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
//                               <Percent size={12} />
//                               Percentage
//                             </div>
//                           </div>
//                           <div className="text-center">
//                             <div className={`inline-flex items-center px-4 py-2 rounded-xl text-lg font-bold ${
//                               grade === 'A+' || grade === 'A'
//                                 ? 'gradient-primary text-white'
//                                 : grade === 'B+' || grade === 'B'
//                                 ? 'bg-green-500 text-white'
//                                 : grade === 'C'
//                                 ? 'bg-yellow-500 text-white'
//                                 : 'bg-destructive text-white'
//                             }`}>
//                               {grade}
//                             </div>
//                             <div className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
//                               <Award size={12} />
//                               Grade
//                             </div>
//                           </div>
//                           <div className="text-center">
//                             <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
//                               percentage >= 35
//                                 ? 'bg-green-100 text-green-700'
//                                 : 'bg-red-100 text-red-700'
//                             }`}>
//                               {percentage >= 35 ? (
//                                 <>
//                                   <CheckCircle size={14} />
//                                   Pass
//                                 </>
//                               ) : (
//                                 <>
//                                   <AlertCircle size={14} />
//                                   Fail
//                                 </>
//                               )}
//                             </div>
//                             <div className="text-xs text-muted-foreground mt-2">
//                               Status
//                             </div>
//                           </div>
//                         </div>

//                         {/* Progress Bar */}
//                         <div className="mt-4">
//                           <div className="w-full bg-white rounded-full h-2">
//                             <div
//                               className={`h-2 rounded-full transition-all duration-500 ${
//                                 percentage >= 90
//                                   ? 'gradient-primary'
//                                   : percentage >= 80
//                                   ? 'bg-accent'
//                                   : percentage >= 70
//                                   ? 'bg-green-500'
//                                   : percentage >= 50
//                                   ? 'bg-yellow-500'
//                                   : 'bg-destructive'
//                               }`}
//                               style={{ width: `${Math.min(percentage, 100)}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       </motion.div>
//                     )}
//                   </motion.div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="sticky bottom-0 bg-secondary px-6 py-4 border-t border-border rounded-b-2xl flex items-center justify-between">
//         <div className="text-sm text-muted-foreground">
//           {resultEntries.length > 0 && (
//             <span className="flex items-center gap-2">
//               <CheckCircle size={16} className="text-primary" />
//               {resultEntries.length} {resultEntries.length === 1 ? 'result' : 'results'} ready to submit
//             </span>
//           )}
//         </div>
//         <div className="flex gap-3">
//           <button
//             onClick={onClose}
//             className="px-6 py-3 border border-border rounded-xl text-foreground hover:bg-white font-medium transition-colors"
//           >
//             Cancel
//           </button>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={handleSubmit}
//             disabled={isSubmitting || resultEntries.length === 0}
//             className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
//               isSubmitting || resultEntries.length === 0
//                 ? 'bg-muted text-muted-foreground cursor-not-allowed'
//                 : 'gradient-primary text-white shadow-glow hover:shadow-float'
//             }`}
//           >
//             {isSubmitting ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Save size={18} />
//                 {initialData ? 'Update Result' : 'Save Results'}
//               </>
//             )}
//           </motion.button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultForm;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { ExamSchedule } from '../../types/Exam';
import { Student, GradeScale, ExamResult } from '../../types/results';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  User, 
  BookOpen, 
  FileText, 
  Award, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  Calendar, 
  Hash, 
  Percent,
  Upload,
  Download,
  Users
} from 'lucide-react';

interface ResultFormProps {
  exams: ExamSchedule[];
  students: Student[];
  gradeScales: GradeScale[];
  initialData?: ExamResult | null;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

interface ResultEntry {
  student_id: string;
  exam_id: string;
  marks_obtained: number;
  remarks?: string;
}

interface ClassStudent {
  student_id: string;
  student_name: string;
  students?: {
    id: string;
    full_name: string;
    roll_number: string;
  };
}

const ResultForm: React.FC<ResultFormProps> = ({
  exams,
  students,
  gradeScales,
  initialData,
  onSubmit,
  onClose,
}) => {
  const [selectedExam, setSelectedExam] = useState<string>(initialData?.exam_id || '');
  const [resultEntries, setResultEntries] = useState<ResultEntry[]>(
    initialData
      ? [
          {
            student_id: initialData.student_id,
            exam_id: initialData.exam_id,
            marks_obtained: initialData.marks_obtained,
            remarks: initialData.remarks,
          },
        ]
      : []
  );
  const [classStudents, setClassStudents] = useState<ClassStudent[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedExamDetails = exams.find((exam) => exam.id === selectedExam);
  const maxMarks = selectedExamDetails?.max_marks || 100;

  // Fetch students assigned to the exam's class - WITHOUT YEAR FILTER
  useEffect(() => {
    const fetchClassStudents = async () => {
      if (!selectedExam || initialData) return;

      setIsLoadingStudents(true);
      setFormErrors({});

      try {
        const exam = exams.find(e => e.id === selectedExam);
        if (!exam?.class_id) {
          setFormErrors({ exam: 'Selected exam does not have a class assigned' });
          setIsLoadingStudents(false);
          return;
        }

        console.log('Fetching students for class_id:', exam.class_id);

        // Query WITHOUT academic_year filter - only match class_id
        const { data, error } = await supabase
          .from('class_assignments')
          .select(`
            student_id,
            student_name,
            students (
              id,
              full_name,
              roll_number
            )
          `)
          .eq('class_id', exam.class_id);

        if (error) {
          console.error('Error fetching class students:', error);
          setFormErrors({ students: 'Failed to load students for this class' });
          setIsLoadingStudents(false);
          return;
        }

        console.log('Fetched students:', data);

        if (!data || data.length === 0) {
          setFormErrors({ students: 'No students assigned to this class' });
          setClassStudents([]);
          setResultEntries([]);
          setIsLoadingStudents(false);
          return;
        }

        setClassStudents(data);

        // Initialize result entries for all students
        const entries: ResultEntry[] = data.map(assignment => ({
          student_id: assignment.student_id,
          exam_id: selectedExam,
          marks_obtained: 0,
          remarks: ''
        }));

        setResultEntries(entries);
      } catch (error) {
        console.error('Error loading students:', error);
        setFormErrors({ students: 'An error occurred while loading students' });
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchClassStudents();
  }, [selectedExam, exams, initialData]);

  const calculateGrade = (percentage: number): string => {
    const grade = gradeScales.find(
      (scale) => percentage >= scale.min_percentage && percentage <= scale.max_percentage
    );
    return grade?.grade || 'F';
  };

  const updateResultEntry = (index: number, field: keyof ResultEntry, value: any) => {
    const updated = [...resultEntries];
    updated[index] = { ...updated[index], [field]: value };
    setResultEntries(updated);

    // Clear specific error
    if (formErrors[`entry-${index}-${field}`]) {
      const newErrors = { ...formErrors };
      delete newErrors[`entry-${index}-${field}`];
      setFormErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!selectedExam) {
      errors.exam = 'Please select an exam';
    }

    if (resultEntries.length === 0) {
      errors.entries = 'No students found in this class. Please ensure students are assigned to this class.';
    }

    resultEntries.forEach((entry, index) => {
      if (!entry.student_id) {
        errors[`entry-${index}-student_id`] = 'Student is required';
      }
      if (entry.marks_obtained < 0 || entry.marks_obtained > maxMarks) {
        errors[`entry-${index}-marks_obtained`] = `Marks must be between 0 and ${maxMarks}`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = resultEntries.map((entry) => {
        const percentage = (entry.marks_obtained / maxMarks) * 100;
        const grade = calculateGrade(percentage);
        const status = percentage >= 35 ? 'pass' : 'fail';

        return {
          ...entry,
          exam_id: selectedExam,
          percentage,
          grade,
          status,
        };
      });

      await onSubmit(submissionData);
    } catch (error) {
      console.error('Error submitting results:', error);
      setFormErrors({ submit: 'Failed to submit results. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get student details for display
  const getStudentDetails = (studentId: string) => {
    const classStudent = classStudents.find(cs => cs.student_id === studentId);
    if (classStudent?.students) {
      return classStudent.students;
    }
    return students.find(s => s.id === studentId);
  };

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-border px-6 py-4 rounded-t-2xl z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 gradient-primary rounded-lg flex items-center justify-center">
              {initialData ? (
                <FileText className="h-5 w-5 text-white" />
              ) : (
                <Plus className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {initialData ? 'Edit Result' : 'Add Results'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {initialData ? 'Update student exam result' : 'Add exam results for all students in the class'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
        {/* Exam Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground">
                Select Exam <span className="text-destructive">*</span>
              </label>
              <p className="text-xs text-muted-foreground">Choose the exam to enter results for all students</p>
            </div>
          </div>
          
          <select
            value={selectedExam}
            onChange={(e) => {
              setSelectedExam(e.target.value);
              setFormErrors({});
            }}
            disabled={!!initialData}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white ${
              formErrors.exam ? 'border-destructive' : 'border-input'
            } ${initialData ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <option value="">-- Select an Exam --</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.exam_name} - {exam.subjects?.subject_name} ({exam.subjects?.subject_code}) - Max Marks: {exam.max_marks}
              </option>
            ))}
          </select>
          {formErrors.exam && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-destructive flex items-center gap-2"
            >
              <AlertCircle size={14} />
              {formErrors.exam}
            </motion.p>
          )}

          {selectedExamDetails && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-3 shadow-soft">
                <p className="text-xs text-muted-foreground mb-1">Subject</p>
                <p className="font-semibold text-foreground text-sm">{selectedExamDetails.subjects?.subject_name}</p>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-soft">
                <p className="text-xs text-muted-foreground mb-1">Code</p>
                <p className="font-semibold text-foreground text-sm">{selectedExamDetails.subjects?.subject_code}</p>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-soft">
                <p className="text-xs text-muted-foreground mb-1">Max Marks</p>
                <p className="font-semibold text-primary text-sm">{selectedExamDetails.max_marks}</p>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-soft">
                <p className="text-xs text-muted-foreground mb-1">Date</p>
                <p className="font-semibold text-foreground text-sm">
                  {new Date(selectedExamDetails.exam_date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        {isLoadingStudents && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-secondary rounded-2xl"
          >
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground font-medium">Loading students from class...</p>
            <p className="text-sm text-muted-foreground mt-2">Please wait while we fetch the student list</p>
          </motion.div>
        )}

        {/* Error Display */}
        {(formErrors.students || formErrors.entries) && !isLoadingStudents && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-3"
          >
            <AlertCircle className="text-destructive flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-destructive font-medium">
                {formErrors.students || formErrors.entries}
              </p>
              <p className="text-xs text-destructive/80 mt-1">
                Please ensure students are assigned to this class in the Class Assignments section.
              </p>
            </div>
          </motion.div>
        )}

        {/* Result Entries */}
        {!isLoadingStudents && selectedExam && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Student Results</h4>
                  <p className="text-xs text-muted-foreground">
                    {resultEntries.length} {resultEntries.length === 1 ? 'student' : 'students'} loaded from class
                  </p>
                </div>
              </div>
            </div>

            {resultEntries.length === 0 && !formErrors.students && !formErrors.entries ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 bg-secondary rounded-2xl border-2 border-dashed border-border"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Select an Exam</h4>
                <p className="text-muted-foreground">
                  Choose an exam above to automatically load all students from that class
                </p>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="space-y-4">
                  {resultEntries.map((entry, index) => {
                    const percentage = (entry.marks_obtained / maxMarks) * 100;
                    const grade = calculateGrade(percentage);
                    const studentDetails = getStudentDetails(entry.student_id);

                    return (
                      <motion.div
                        key={entry.student_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.03 }}
                        className="glass-strong rounded-2xl p-6 shadow-soft border border-border hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">#{index + 1}</span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-foreground">
                                {studentDetails?.full_name || 'Unknown Student'}
                              </h5>
                              <p className="text-xs text-muted-foreground">
                                Roll No: {studentDetails?.roll_number || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg">
                            <User size={14} className="text-primary" />
                            <span className="text-xs font-medium text-primary">Student {index + 1}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Student Name (Read-only Display) */}
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Student Name
                            </label>
                            <div className="w-full px-4 py-3 border border-input rounded-xl bg-secondary/50 text-muted-foreground">
                              {studentDetails?.full_name} ({studentDetails?.roll_number})
                            </div>
                          </div>

                          {/* Marks Obtained */}
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Marks Obtained <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                              <input
                                type="number"
                                min="0"
                                max={maxMarks}
                                step="0.01"
                                value={entry.marks_obtained}
                                onChange={(e) => updateResultEntry(index, 'marks_obtained', parseFloat(e.target.value) || 0)}
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                                  formErrors[`entry-${index}-marks_obtained`] ? 'border-destructive' : 'border-input'
                                }`}
                                placeholder={`Max: ${maxMarks}`}
                              />
                            </div>
                            {formErrors[`entry-${index}-marks_obtained`] && (
                              <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                                <AlertCircle size={12} />
                                {formErrors[`entry-${index}-marks_obtained`]}
                              </p>
                            )}
                          </div>

                          {/* Remarks */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Remarks (Optional)
                            </label>
                            <textarea
                              value={entry.remarks || ''}
                              onChange={(e) => updateResultEntry(index, 'remarks', e.target.value)}
                              rows={2}
                              className="w-full px-4 py-3 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                              placeholder="Add any remarks or comments about the student's performance..."
                            />
                          </div>
                        </div>

                        {/* Performance Preview */}
                        {entry.student_id && entry.marks_obtained >= 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/10"
                          >
                            <h6 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                              <Target size={14} className="text-primary" />
                              Performance Preview
                            </h6>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-primary mb-1">
                                  {percentage.toFixed(1)}%
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                  <Percent size={12} />
                                  Percentage
                                </div>
                              </div>
                              <div className="text-center">
                                <div className={`inline-flex items-center px-4 py-2 rounded-xl text-lg font-bold ${
                                  grade === 'A+' || grade === 'A'
                                    ? 'gradient-primary text-white'
                                    : grade === 'B+' || grade === 'B'
                                    ? 'bg-green-500 text-white'
                                    : grade === 'C'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-destructive text-white'
                                }`}>
                                  {grade}
                                </div>
                                <div className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                                  <Award size={12} />
                                  Grade
                                </div>
                              </div>
                              <div className="text-center">
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                                  percentage >= 35
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {percentage >= 35 ? (
                                    <>
                                      <CheckCircle size={14} />
                                      Pass
                                    </>
                                  ) : (
                                    <>
                                      <AlertCircle size={14} />
                                      Fail
                                    </>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground mt-2">
                                  Status
                                </div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                              <div className="w-full bg-white rounded-full h-2">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                                  transition={{ duration: 0.5, ease: "easeOut" }}
                                  className={`h-2 rounded-full ${
                                    percentage >= 90
                                      ? 'gradient-primary'
                                      : percentage >= 80
                                      ? 'bg-accent'
                                      : percentage >= 70
                                      ? 'bg-green-500'
                                      : percentage >= 50
                                      ? 'bg-yellow-500'
                                      : 'bg-destructive'
                                  }`}
                                ></motion.div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </AnimatePresence>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-secondary px-6 py-4 border-t border-border rounded-b-2xl flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {resultEntries.length > 0 && (
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-primary" />
              {resultEntries.length} {resultEntries.length === 1 ? 'result' : 'results'} ready to submit
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-border rounded-xl text-foreground hover:bg-white font-medium transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: resultEntries.length === 0 || isSubmitting ? 1 : 1.05 }}
            whileTap={{ scale: resultEntries.length === 0 || isSubmitting ? 1 : 0.95 }}
            onClick={handleSubmit}
            disabled={isSubmitting || resultEntries.length === 0}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              isSubmitting || resultEntries.length === 0
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'gradient-primary text-white shadow-glow hover:shadow-float'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                {initialData ? 'Update Result' : `Save ${resultEntries.length} Results`}
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ResultForm;
