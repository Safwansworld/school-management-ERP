import { useState, useEffect ,useRef} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Calendar, BookOpen, Users, FileText, Paperclip, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { assignmentService } from '../../services/assignmentService';
import { useAuth } from '../../context/AuthContext';
import {toast} from 'sonner';
// interface CreateAssignmentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export default function CreateAssignmentModal({ isOpen, onClose, onSuccess }: CreateAssignmentModalProps) {
//   const { userProfile } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(false);
  
//   // Dynamic data from database
//   const [academicYears, setAcademicYears] = useState<string[]>([]);
//   const [classes, setClasses] = useState<Array<{ class_id: string; class_name: string }>>([]);

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     subject: '',
//     class_id: '',
//     academic_year: '',
//     due_date: '',
//     total_marks: 100,
//     attachment_url: '',
//   });

//   useEffect(() => {
//     if (isOpen) {
//       loadInitialData();
//     }
//   }, [isOpen]);

//   // Load academic years when modal opens
//   const loadInitialData = async () => {
//     try {
//       setLoadingData(true);
//       const years = await assignmentService.getAcademicYears();
//       setAcademicYears(years);
//     } catch (error) {
//       console.error('Error loading initial data:', error);
//       toast.error('Failed to load academic years');
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   // Load classes when academic year is selected
//   useEffect(() => {
//     if (formData.academic_year) {
//       loadClassesForYear(formData.academic_year);
//     } else {
//       setClasses([]);
//       setFormData(prev => ({ ...prev, class_id: '' })); // Reset class selection
//     }
//   }, [formData.academic_year]);

//   const loadClassesForYear = async (academicYear: string) => {
//     try {
//       setLoadingData(true);
//       const classData = await assignmentService.getClassNamesForYear(academicYear);
//       setClasses(classData);
//     } catch (error) {
//       console.error('Error loading classes:', error);
//       toast.error('Failed to load classes');
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await assignmentService.createAssignment(formData);
//       toast.success('Assignment created successfully!');
//       onSuccess();
//       onClose();
//       // Reset form
//       setFormData({
//         title: '',
//         description: '',
//         subject: '',
//         class_id: '',
//         academic_year: '',
//         due_date: '',
//         total_marks: 100,
//         attachment_url: '',
//       });
//     } catch (error: any) {
//       console.error('Error creating assignment:', error);
//       toast.error(error.message || 'Failed to create assignment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
//           />

//           {/* Modal */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 20 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4"
//           >
//             <div className="glass-strong rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-float">
//               {/* Header */}
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-2xl font-bold text-gray-800">Create Assignment</h3>
//                 <button
//                   onClick={onClose}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* Form */}
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 {/* Title */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     <FileText className="w-4 h-4 inline mr-2" />
//                     Assignment Title *
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="e.g., Algebra Problem Set"
//                   />
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     rows={4}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Describe the assignment..."
//                   />
//                 </div>

//                 {/* Subject & Total Marks */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <BookOpen className="w-4 h-4 inline mr-2" />
//                       Subject *
//                     </label>
//                     <input
//                       type="text"
//                       name="subject"
//                       value={formData.subject}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="e.g., Mathematics"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Total Marks *
//                     </label>
//                     <input
//                       type="number"
//                       name="total_marks"
//                       value={formData.total_marks}
//                       onChange={handleChange}
//                       required
//                       min="1"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 {/* Academic Year & Class - UPDATED */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <Calendar className="w-4 h-4 inline mr-2" />
//                       Academic Year *
//                     </label>
//                     <select
//                       name="academic_year"
//                       value={formData.academic_year}
//                       onChange={handleChange}
//                       required
//                       disabled={loadingData}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
//                     >
//                       <option value="">
//                         {loadingData ? 'Loading...' : 'Select Academic Year'}
//                       </option>
//                       {academicYears.map((year) => (
//                         <option key={year} value={year}>
//                           {year}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <Users className="w-4 h-4 inline mr-2" />
//                       Class *
//                     </label>
//                     <select
//                       name="class_id"
//                       value={formData.class_id}
//                       onChange={handleChange}
//                       required
//                       disabled={!formData.academic_year || loadingData}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
//                     >
//                       <option value="">
//                         {!formData.academic_year 
//                           ? 'Select Academic Year First' 
//                           : loadingData 
//                           ? 'Loading Classes...' 
//                           : 'Select Class'}
//                       </option>
//                       {classes.map((cls) => (
//                         <option key={cls.class_id} value={cls.class_id}>
//                           {cls.class_name}
//                         </option>
//                       ))}
//                     </select>
//                     {formData.academic_year && classes.length === 0 && !loadingData && (
//                       <p className="text-xs text-amber-600 mt-1">
//                         No classes found for this academic year
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Due Date */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     <Calendar className="w-4 h-4 inline mr-2" />
//                     Due Date *
//                   </label>
//                   <input
//                     type="datetime-local"
//                     name="due_date"
//                     value={formData.due_date}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 {/* Attachment URL (optional) */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     <Upload className="w-4 h-4 inline mr-2" />
//                     Attachment URL (optional)
//                   </label>
//                   <input
//                     type="url"
//                     name="attachment_url"
//                     value={formData.attachment_url}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="https://..."
//                   />
//                 </div>

//                 {/* Assigned To */}
//                 <div className="p-4 bg-blue-50 rounded-lg">
//                   <p className="text-sm text-gray-700">
//                     <strong>Assigned To:</strong> {userProfile?.first_name} {userProfile?.last_name}
//                   </p>
//                   <p className="text-xs text-gray-600 mt-1">
//                     This assignment will be assigned to all students in <strong>{classes.find(c => c.class_id === formData.class_id)?.class_name || 'the selected class'}</strong> for academic year <strong>{formData.academic_year || '(select year)'}</strong>.
//                   </p>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-3 pt-4">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={onClose}
//                     className="flex-1"
//                     disabled={loading}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     className="flex-1 gradient-primary text-white"
//                     disabled={loading || loadingData}
//                   >
//                     {loading ? 'Creating...' : 'Create Assignment'}
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }



interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAssignmentModal({ isOpen, onClose, onSuccess }: CreateAssignmentModalProps) {
  const { userProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [classes, setClasses] = useState<Array<{ class_id: string; class_name: string }>>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    class_id: '',
    academic_year: '',
    due_date: '',
    total_marks: 100,
    attachment_url: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      const years = await assignmentService.getAcademicYears();
      setAcademicYears(years);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Failed to load academic years');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (formData.academic_year) {
      loadClassesForYear(formData.academic_year);
    } else {
      setClasses([]);
      setFormData(prev => ({ ...prev, class_id: '' }));
    }
  }, [formData.academic_year]);

  const loadClassesForYear = async (academicYear: string) => {
    try {
      setLoadingData(true);
      const classData = await assignmentService.getClassNamesForYear(academicYear);
      setClasses(classData);
    } catch (error) {
      console.error('Error loading classes:', error);
      toast.error('Failed to load classes');
    } finally {
      setLoadingData(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let attachmentUrl = formData.attachment_url;

      // Upload file if selected
      if (selectedFile) {
        setUploadingFile(true);
        attachmentUrl = await assignmentService.uploadFile(selectedFile, 'assignment');
        setUploadingFile(false);
      }

      await assignmentService.createAssignment({
        ...formData,
        attachment_url: attachmentUrl,
      });

      toast.success('Assignment created successfully!');
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: '',
        class_id: '',
        academic_year: '',
        due_date: '',
        total_marks: 100,
        attachment_url: '',
      });
      setSelectedFile(null);
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      toast.error(error.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
      setUploadingFile(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return '📄';
    if (['doc', 'docx'].includes(ext || '')) return '📝';
    if (['xls', 'xlsx'].includes(ext || '')) return '📊';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return '🖼️';
    if (['zip', 'rar'].includes(ext || '')) return '📦';
    return '📎';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-strong rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-float">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Create Assignment</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Assignment Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Algebra Problem Set"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the assignment..."
                  />
                </div>

                {/* Subject & Total Marks */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <BookOpen className="w-4 h-4 inline mr-2" />
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Mathematics"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Marks *
                    </label>
                    <input
                      type="number"
                      name="total_marks"
                      value={formData.total_marks}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Academic Year & Class */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Academic Year *
                    </label>
                    <select
                      name="academic_year"
                      value={formData.academic_year}
                      onChange={handleChange}
                      required
                      disabled={loadingData}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {loadingData ? 'Loading...' : 'Select Academic Year'}
                      </option>
                      {academicYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="w-4 h-4 inline mr-2" />
                      Class *
                    </label>
                    <select
                      name="class_id"
                      value={formData.class_id}
                      onChange={handleChange}
                      required
                      disabled={!formData.academic_year || loadingData}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!formData.academic_year 
                          ? 'Select Academic Year First' 
                          : loadingData 
                          ? 'Loading Classes...' 
                          : 'Select Class'}
                      </option>
                      {classes.map((cls) => (
                        <option key={cls.class_id} value={cls.class_id}>
                          {cls.class_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Due Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* File Attachment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Paperclip className="w-4 h-4 inline mr-2" />
                    Attach File (optional)
                  </label>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.zip,.rar"
                    className="hidden"
                  />

                  {!selectedFile ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-gray-600"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Click to upload file (Max 10MB)</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="text-2xl">{getFileIcon(selectedFile.name)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Supported: PDF, Word, Excel, PowerPoint, Images, ZIP
                  </p>
                </div>

                {/* Assigned To Info */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Assigned By:</strong> {userProfile?.first_name} {userProfile?.last_name}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    This assignment will be assigned to all students in{' '}
                    <strong>{classes.find(c => c.class_id === formData.class_id)?.class_name || 'the selected class'}</strong>{' '}
                    for academic year <strong>{formData.academic_year || '(select year)'}</strong>.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gradient-primary text-white gap-2"
                    disabled={loading || loadingData || uploadingFile}
                  >
                    {uploadingFile ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : loading ? (
                      'Creating...'
                    ) : (
                      'Create Assignment'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
