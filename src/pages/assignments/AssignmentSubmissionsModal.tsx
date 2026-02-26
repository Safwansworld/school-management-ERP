// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, CheckCircle, Clock, Download, Send } from 'lucide-react';
// import { Button } from '../../components/ui/button';
// import { Badge } from '../../components/ui/badge';
// import { assignmentService } from '../../services/assignmentService';
// import { useAuth } from '../../context/AuthContext';
// import {toast} from 'sonner';

// interface AssignmentSubmissionsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   assignmentId: string;
//   isTeacher: boolean;
// }

// export default function AssignmentSubmissionsModal({
//   isOpen,
//   onClose,
//   assignmentId,
//   isTeacher,
// }: AssignmentSubmissionsModalProps) {
//   const { userProfile } = useAuth();
//   const [submissions, setSubmissions] = useState<any[]>([]);
//   const [assignment, setAssignment] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [reviewingId, setReviewingId] = useState<string | null>(null);

//   // Student submission form
//   const [submissionText, setSubmissionText] = useState('');
//   const [attachmentUrl, setAttachmentUrl] = useState('');

//   // Teacher review form
//   const [marks, setMarks] = useState<number>(0);
//   const [feedback, setFeedback] = useState('');

//   useEffect(() => {
//     if (isOpen) {
//       loadData();
//     }
//   }, [isOpen, assignmentId]);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const submissionsData = await assignmentService.getAssignmentSubmissions(assignmentId);
//       setSubmissions(submissionsData);

//       // Load assignment details if needed
//       // You can extend assignmentService to get single assignment
//     } catch (error) {
//       console.error('Error loading submissions:', error);
//       toast.error('Failed to load submissions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStudentSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       await assignmentService.submitAssignment({
//         assignment_id: assignmentId,
//         submission_text: submissionText,
//         attachment_url: attachmentUrl || undefined,
//       });
//       toast.success('Assignment submitted successfully!');
//       loadData();
//       setSubmissionText('');
//       setAttachmentUrl('');
//     } catch (error: any) {
//       console.error('Error submitting assignment:', error);
//       toast.error(error.message || 'Failed to submit assignment');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleReview = async (submissionId: string) => {
//     if (!marks || marks < 0) {
//       toast.error('Please enter valid marks');
//       return;
//     }

//     try {
//       await assignmentService.reviewSubmission(submissionId, marks, feedback);
//       toast.success('Submission reviewed successfully!');
//       loadData();
//       setReviewingId(null);
//       setMarks(0);
//       setFeedback('');
//     } catch (error: any) {
//       console.error('Error reviewing submission:', error);
//       toast.error(error.message || 'Failed to review submission');
//     }
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
//             <div className="glass-strong rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-float">
//               {/* Header */}
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-2xl font-bold text-gray-800">
//                   {isTeacher ? 'Assignment Submissions' : 'Submit Assignment'}
//                 </h3>
//                 <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               {loading ? (
//                 <div className="flex items-center justify-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
//                 </div>
//               ) : (
//                 <>
//                   {/* Student View: Submit Assignment */}
//                   {!isTeacher && (
//                     <form onSubmit={handleStudentSubmit} className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Your Submission
//                         </label>
//                         <textarea
//                           value={submissionText}
//                           onChange={(e) => setSubmissionText(e.target.value)}
//                           required
//                           rows={6}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           placeholder="Write your submission here..."
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Attachment URL (optional)
//                         </label>
//                         <input
//                           type="url"
//                           value={attachmentUrl}
//                           onChange={(e) => setAttachmentUrl(e.target.value)}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           placeholder="https://..."
//                         />
//                       </div>

//                       <Button
//                         type="submit"
//                         disabled={submitting}
//                         className="w-full gradient-primary text-white gap-2"
//                       >
//                         <Send className="w-4 h-4" />
//                         {submitting ? 'Submitting...' : 'Submit Assignment'}
//                       </Button>
//                     </form>
//                   )}

//                   {/* Teacher View: List of Submissions */}
//                   {isTeacher && (
//                     <div className="space-y-4">
//                       {submissions.length === 0 ? (
//                         <div className="text-center py-12">
//                           <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                           <p className="text-gray-500">No submissions yet</p>
//                         </div>
//                       ) : (
//                         submissions.map((submission) => (
//                           <div
//                             key={submission.id}
//                             className="glass-strong p-4 rounded-xl space-y-3"
//                           >
//                             <div className="flex items-start justify-between">
//                               <div>
//                                 <h4 className="font-semibold text-gray-800">{submission.student_name}</h4>
//                                 <p className="text-sm text-gray-600">
//                                   Submitted: {new Date(submission.submitted_at).toLocaleString()}
//                                 </p>
//                               </div>
//                               <Badge
//                                 variant="outline"
//                                 className={
//                                   submission.status === 'reviewed'
//                                     ? 'bg-green-50 text-green-600 border-green-200'
//                                     : 'bg-blue-50 text-blue-600 border-blue-200'
//                                 }
//                               >
//                                 {submission.status}
//                               </Badge>
//                             </div>

//                             <div className="bg-gray-50 p-3 rounded-lg">
//                               <p className="text-sm text-gray-700">{submission.submission_text}</p>
//                               {submission.attachment_url && (
//                                 <a
//                                   href={submission.attachment_url}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="text-blue-600 text-sm flex items-center gap-2 mt-2 hover:underline"
//                                 >
//                                   <Download className="w-4 h-4" />
//                                   View Attachment
//                                 </a>
//                               )}
//                             </div>

//                             {submission.status === 'reviewed' ? (
//                               <div className="bg-green-50 p-3 rounded-lg">
//                                 <p className="text-sm font-semibold text-green-800">
//                                   Marks: {submission.marks_obtained}
//                                 </p>
//                                 <p className="text-sm text-gray-700 mt-1">{submission.feedback}</p>
//                               </div>
//                             ) : (
//                               <>
//                                 {reviewingId === submission.id ? (
//                                   <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
//                                     <div>
//                                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Marks
//                                       </label>
//                                       <input
//                                         type="number"
//                                         value={marks}
//                                         onChange={(e) => setMarks(Number(e.target.value))}
//                                         min="0"
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                                         placeholder="Enter marks"
//                                       />
//                                     </div>
//                                     <div>
//                                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Feedback
//                                       </label>
//                                       <textarea
//                                         value={feedback}
//                                         onChange={(e) => setFeedback(e.target.value)}
//                                         rows={3}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                                         placeholder="Provide feedback..."
//                                       />
//                                     </div>
//                                     <div className="flex gap-2">
//                                       <Button
//                                         size="sm"
//                                         onClick={() => handleReview(submission.id)}
//                                         className="gradient-primary text-white"
//                                       >
//                                         Submit Review
//                                       </Button>
//                                       <Button
//                                         size="sm"
//                                         variant="outline"
//                                         onClick={() => setReviewingId(null)}
//                                       >
//                                         Cancel
//                                       </Button>
//                                     </div>
//                                   </div>
//                                 ) : (
//                                   <Button
//                                     size="sm"
//                                     onClick={() => setReviewingId(submission.id)}
//                                     className="gap-2"
//                                   >
//                                     <CheckCircle className="w-4 h-4" />
//                                     Review Submission
//                                   </Button>
//                                 )}
//                               </>
//                             )}
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Clock, Download, Send, Paperclip, Upload, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { assignmentService } from '../../services/assignmentService';
import { useAuth } from '../../context/AuthContext';
import {toast} from 'sonner';

interface AssignmentSubmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentId: string;
  isTeacher: boolean;
}

export default function AssignmentSubmissionsModal({
  isOpen,
  onClose,
  assignmentId,
  isTeacher,
}: AssignmentSubmissionsModalProps) {
  const { userProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  // Student submission form
  const [submissionText, setSubmissionText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Teacher review form
  const [marks, setMarks] = useState<number>(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, assignmentId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const submissionsData = await assignmentService.getAssignmentSubmissions(assignmentId);
      setSubmissions(submissionsData);

      // If student, check if they have an existing submission
      if (!isTeacher && submissionsData.length > 0) {
        const mySubmission = submissionsData.find(
          (sub) => sub.student_profile_id === userProfile?.id
        );
        if (mySubmission) {
          setSubmissionText(mySubmission.submission_text || '');
        }
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
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

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return '📄';
    if (['doc', 'docx'].includes(ext || '')) return '📝';
    if (['xls', 'xlsx'].includes(ext || '')) return '📊';
    if (['ppt', 'pptx'].includes(ext || '')) return '📊';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return '🖼️';
    if (['zip', 'rar'].includes(ext || '')) return '📦';
    return '📎';
  };

  const getFileName = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts[pathParts.length - 1];
    } catch {
      return 'attachment';
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let attachmentUrl = '';

      // Upload file if selected
      if (selectedFile) {
        setUploadingFile(true);
        attachmentUrl = await assignmentService.uploadFile(selectedFile, 'submission');
        setUploadingFile(false);
      }

      await assignmentService.submitAssignment({
        assignment_id: assignmentId,
        submission_text: submissionText,
        attachment_url: attachmentUrl || undefined,
      });

      toast.success('Assignment submitted successfully!');
      loadData();
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Error submitting assignment:', error);
      toast.error(error.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
      setUploadingFile(false);
    }
  };

  const handleReview = async (submissionId: string) => {
    if (!marks || marks < 0) {
      toast.error('Please enter valid marks');
      return;
    }

    try {
      await assignmentService.reviewSubmission(submissionId, marks, feedback);
      toast.success('Submission reviewed successfully!');
      loadData();
      setReviewingId(null);
      setMarks(0);
      setFeedback('');
    } catch (error: any) {
      console.error('Error reviewing submission:', error);
      toast.error(error.message || 'Failed to review submission');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-strong rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-float">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {isTeacher ? 'Assignment Submissions' : 'Submit Assignment'}
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                </div>
              ) : (
                <>
                  {/* Student View: Submit Assignment */}
                  {!isTeacher && (
                    <form onSubmit={handleStudentSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Submission *
                        </label>
                        <textarea
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          required
                          rows={6}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Write your submission here..."
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

                      {/* Check if already submitted */}
                      {submissions.find(sub => sub.student_profile_id === userProfile?.id) && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-sm text-amber-800">
                            ⚠️ You have already submitted this assignment. Submitting again will replace your previous submission.
                          </p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={submitting || uploadingFile}
                        className="w-full gradient-primary text-white gap-2"
                      >
                        {uploadingFile ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading File...
                          </>
                        ) : submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            {submissions.find(sub => sub.student_profile_id === userProfile?.id) 
                              ? 'Update Submission' 
                              : 'Submit Assignment'}
                          </>
                        )}
                      </Button>
                    </form>
                  )}

                  {/* Teacher View: List of Submissions */}
                  {isTeacher && (
                    <div className="space-y-4">
                      {submissions.length === 0 ? (
                        <div className="text-center py-12">
                          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No submissions yet</p>
                        </div>
                      ) : (
                        submissions.map((submission) => (
                          <motion.div
                            key={submission.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-strong p-4 rounded-xl space-y-3 border border-gray-200/50"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-800">{submission.student_name}</h4>
                                <p className="text-sm text-gray-600">
                                  Submitted: {new Date(submission.submitted_at).toLocaleString()}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  submission.status === 'reviewed'
                                    ? 'bg-green-50 text-green-600 border-green-200'
                                    : 'bg-blue-50 text-blue-600 border-blue-200'
                                }
                              >
                                {submission.status === 'reviewed' ? (
                                  <span className="flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Reviewed
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Pending
                                  </span>
                                )}
                              </Badge>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm font-medium text-gray-700 mb-2">Submission Text:</p>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {submission.submission_text || 'No text submission'}
                              </p>
                              
                              {submission.attachment_url && (
                                <a
                                  href={submission.attachment_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 mt-3 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-sm text-blue-600"
                                >
                                  <span className="text-lg">{getFileIcon(getFileName(submission.attachment_url))}</span>
                                  <span className="font-medium">View Attachment</span>
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>

                            {submission.status === 'reviewed' ? (
                              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-semibold text-green-800">
                                    Marks: {submission.marks_obtained}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Reviewed: {new Date(submission.reviewed_at).toLocaleString()}
                                  </p>
                                </div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Feedback:</p>
                                <p className="text-sm text-gray-700">{submission.feedback || 'No feedback provided'}</p>
                              </div>
                            ) : (
                              <>
                                {reviewingId === submission.id ? (
                                  <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Marks Obtained *
                                        </label>
                                        <input
                                          type="number"
                                          value={marks}
                                          onChange={(e) => setMarks(Number(e.target.value))}
                                          min="0"
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                          placeholder="Enter marks"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Feedback
                                      </label>
                                      <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Provide feedback to the student..."
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() => handleReview(submission.id)}
                                        className="gradient-primary text-white gap-2"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                        Submit Review
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setReviewingId(null);
                                          setMarks(0);
                                          setFeedback('');
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => setReviewingId(submission.id)}
                                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Review Submission
                                  </Button>
                                )}
                              </>
                            )}
                          </motion.div>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
