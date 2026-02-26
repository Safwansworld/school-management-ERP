import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Modal from '../../components/ui/Modal';
import {
  User,
  Clock,
  FileText,
  Download,
  MessageSquare,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface ProjectSubmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

interface SubmissionWithStudent {
  id: string;
  assignment_id: string;
  student_id: string;
  submission_text: string;
  file_urls: string[];
  submitted_at: string;
  grade: number | null;
  feedback: string | null;
  reviewed_at: string | null;
  student_name: string;
  student_email: string;
  assignment_status: string;
}

const ProjectSubmissionsModal: React.FC<ProjectSubmissionsModalProps> = ({
  isOpen,
  onClose,
  projectId
}) => {
  const [submissions, setSubmissions] = useState<SubmissionWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionWithStudent | null>(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchSubmissions();
    }
  }, [isOpen, projectId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);

      // Fetch assignments for this project
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('project_assignments')
        .select('id, student_id, status')
        .eq('project_id', projectId);

      if (assignmentsError) throw assignmentsError;

      if (!assignmentsData || assignmentsData.length === 0) {
        setSubmissions([]);
        return;
      }

      const assignmentIds = assignmentsData.map(a => a.id);

      // Fetch submissions with student details
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('project_submissions')
        .select(`
          id,
          assignment_id,
          student_id,
          submission_text,
          file_urls,
          submitted_at,
          grade,
          feedback,
          reviewed_at
        `)
        .in('assignment_id', assignmentIds)
        .order('submitted_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      // Fetch student details
      const studentIds = [...new Set(submissionsData?.map(s => s.student_id) || [])];
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('id, full_name, email')
        .in('id', studentIds);

      if (studentsError) throw studentsError;

      // Combine data
      const submissionsWithStudents = (submissionsData || []).map(submission => {
        const student = studentsData?.find(s => s.id === submission.student_id);
        const assignment = assignmentsData.find(a => a.id === submission.assignment_id);
        
        return {
          ...submission,
          student_name: student ? `${student.full_name}` : 'Unknown',
          student_email: student?.email || '',
          assignment_status: assignment?.status || 'unknown'
        };
      });

      setSubmissions(submissionsWithStudents);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmission = async () => {
    if (!selectedSubmission) return;

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('project_submissions')
        .update({
          grade: parseFloat(gradeInput),
          feedback: feedbackInput,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', selectedSubmission.id);

      if (error) throw error;

      // Update assignment status to completed
      const { error: assignmentError } = await supabase
        .from('project_assignments')
        .update({ status: 'completed' })
        .eq('id', selectedSubmission.assignment_id);

      if (assignmentError) throw assignmentError;

      // Refresh submissions
      await fetchSubmissions();
      setSelectedSubmission(null);
      setGradeInput('');
      setFeedbackInput('');
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('Failed to grade submission');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (submission: SubmissionWithStudent) => {
    if (submission.grade !== null) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Project Submissions" size="xl">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Project Submissions" size="xl">
      <div className="space-y-4">
        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No submissions yet</p>
          </div>
        ) : (
          <>
            {/* Submissions List */}
            <div className="space-y-3">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(submission)}
                        <div>
                          <h4 className="font-semibold text-gray-900">{submission.student_name}</h4>
                          <p className="text-sm text-gray-500">{submission.student_email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Submitted: {formatDate(submission.submitted_at)}</span>
                        </div>
                        {submission.grade !== null && (
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium text-green-600">
                              Grade: {submission.grade}
                            </span>
                          </div>
                        )}
                      </div>

                      {submission.submission_text && (
                        <p className="text-sm text-gray-700 mb-3 p-3 bg-gray-50 rounded">
                          {submission.submission_text}
                        </p>
                      )}

                      {submission.file_urls && submission.file_urls.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {submission.file_urls.map((url, index) => (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              File {index + 1}
                            </a>
                          ))}
                        </div>
                      )}

                      {submission.feedback && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-900 mb-1">Feedback:</p>
                          <p className="text-sm text-green-800">{submission.feedback}</p>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      {submission.grade === null ? (
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Grade
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setGradeInput(submission.grade?.toString() || '');
                            setFeedbackInput(submission.feedback || '');
                          }}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                          Edit Grade
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Grading Form */}
            {selectedSubmission && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Grade Submission - {selectedSubmission.student_name}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grade
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={gradeInput}
                        onChange={(e) => setGradeInput(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter grade (0-100)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Feedback
                      </label>
                      <textarea
                        value={feedbackInput}
                        onChange={(e) => setFeedbackInput(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Provide feedback to student..."
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleGradeSubmission}
                        disabled={submitting || !gradeInput}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Saving...' : 'Save Grade'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSubmission(null);
                          setGradeInput('');
                          setFeedbackInput('');
                        }}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default ProjectSubmissionsModal;
