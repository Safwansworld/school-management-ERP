import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Modal from '../../components/ui/Modal';
import {
  Upload,
  X,
  File,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader
} from 'lucide-react';

interface StudentSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  studentId: string | null;
  onSubmitSuccess: () => void;
}

interface FilePreview {
  file: File;
  preview: string;
  type: string;
}

const StudentSubmissionModal: React.FC<StudentSubmissionModalProps> = ({
  isOpen,
  onClose,
  project,
  studentId,
  onSubmitSuccess
}) => {
  const [submissionText, setSubmissionText] = useState('');
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [existingSubmission, setExistingSubmission] = useState<any>(null);

  useEffect(() => {
    if (isOpen && project?.submission_id) {
      fetchExistingSubmission();
    } else {
      resetForm();
    }
  }, [isOpen, project]);

  const fetchExistingSubmission = async () => {
    if (!project?.submission_id) return;

    try {
      const { data, error } = await supabase
        .from('project_submissions')
        .select('*')
        .eq('id', project.submission_id)
        .single();

      if (error) throw error;

      if (data) {
        setExistingSubmission(data);
        setSubmissionText(data.submission_text || '');
      }
    } catch (error) {
      console.error('Error fetching existing submission:', error);
    }
  };

  const resetForm = () => {
    setSubmissionText('');
    setFiles([]);
    setError('');
    setUploadProgress(0);
    setExistingSubmission(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validate file size (max 10MB per file)
    const maxSize = 10 * 1024 * 1024;
    const invalidFiles = selectedFiles.filter(file => file.size > maxSize);
    
    if (invalidFiles.length > 0) {
      setError('Some files exceed 10MB limit and were not added');
      return;
    }

    // Create previews
    const newFilePreviews: FilePreview[] = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type
    }));

    setFiles(prev => [...prev, ...newFilePreviews]);
    setError('');
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const uploadFilesToStorage = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i].file;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `project-submissions/${studentId}/${project.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('project-files')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('project-files')
        .getPublicUrl(filePath);

      uploadedUrls.push(urlData.publicUrl);
      
      // Update progress
      setUploadProgress(((i + 1) / files.length) * 100);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!submissionText.trim() && files.length === 0) {
      setError('Please provide either text submission or upload files');
      return;
    }

    if (!studentId || !project) {
      setError('Missing required information');
      return;
    }

    try {
      setUploading(true);
      setError('');

      // Upload files to storage
      let fileUrls: string[] = [];
      if (files.length > 0) {
        fileUrls = await uploadFilesToStorage();
      }

      // Combine with existing file URLs if resubmitting
      if (existingSubmission?.file_urls) {
        fileUrls = [...existingSubmission.file_urls, ...fileUrls];
      }

      // Check if this is a new submission or resubmission
      if (existingSubmission) {
        // Update existing submission
        const { error: updateError } = await supabase
          .from('project_submissions')
          .update({
            submission_text: submissionText,
            file_urls: fileUrls,
            submitted_at: new Date().toISOString()
          })
          .eq('id', existingSubmission.id);

        if (updateError) throw updateError;
      } else {
        // Create new submission
        const { error: insertError } = await supabase
          .from('project_submissions')
          .insert({
            assignment_id: project.assignment_id,
            student_id: studentId,
            submission_text: submissionText,
            file_urls: fileUrls,
            submitted_at: new Date().toISOString()
          });

        if (insertError) throw insertError;

        // Update assignment status
        const { error: assignmentError } = await supabase
          .from('project_assignments')
          .update({ 
            status: 'submitted',
            submission_date: new Date().toISOString()
          })
          .eq('id', project.assignment_id);

        if (assignmentError) throw assignmentError;
      }

      // Log activity
      await supabase.from('project_activity_log').insert({
        project_id: project.id,
        assignment_id: project.assignment_id,
        user_id: studentId,
        activity_type: existingSubmission ? 'resubmission' : 'submission',
        activity_description: `Student ${existingSubmission ? 'resubmitted' : 'submitted'} project: ${project.title}`
      });

      // Success
      onSubmitSuccess();
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Error submitting project:', error);
      setError(error.message || 'Failed to submit project. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Submit Project: ${project.title}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Info */}
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600 mb-2">
            <strong>Subject:</strong> {project.subject}
          </p>
          <p className="text-sm text-blue-600 mb-2">
            <strong>Due Date:</strong> {new Date(project.due_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          {project.sdg_goal && (
            <p className="text-sm text-blue-600">
              <strong>SDG Goal:</strong> {project.sdg_goal}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Existing Submission Notice */}
        {existingSubmission && (
          <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <p className="text-sm text-yellow-700">
              You are resubmitting this project. Your previous submission will be updated.
            </p>
          </div>
        )}

        {/* Text Submission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Description / Report
          </label>
          <textarea
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Write your project description, findings, or report here..."
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Files (Images, PDFs, Documents)
          </label>
          
          {/* Upload Button */}
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">Max 10MB per file</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </label>

          {/* File Previews */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((filePreview, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(filePreview.type)}
                    
                    {filePreview.type.startsWith('image/') ? (
                      <img
                        src={filePreview.preview}
                        alt={filePreview.file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : null}
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {filePreview.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(filePreview.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    disabled={uploading}
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Existing Files */}
          {existingSubmission?.file_urls && existingSubmission.file_urls.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Previously Uploaded Files:</p>
              <div className="space-y-2">
                {existingSubmission.file_urls.map((url: string, index: number) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">File {index + 1}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {uploading && uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Uploading files...</span>
              <span className="text-blue-600 font-medium">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading || (!submissionText.trim() && files.length === 0)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                {existingSubmission ? 'Resubmit Project' : 'Submit Project'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentSubmissionModal;
