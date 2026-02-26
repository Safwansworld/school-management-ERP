import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Modal from '../../components/ui/Modal';
import {
  Calendar,
  BookOpen,
  Target,
  FileText,
  Download,
  Clock,
  Award,
  MessageSquare
} from 'lucide-react';

interface StudentProjectViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
}

interface ProjectResource {
  id: string;
  resource_type: string;
  resource_name: string;
  resource_url: string;
}

interface GradingCriteria {
  id: string;
  criteria_name: string;
  weight: number;
  max_points: number;
  description: string;
}

const StudentProjectViewModal: React.FC<StudentProjectViewModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  const [resources, setResources] = useState<ProjectResource[]>([]);
  const [criteria, setCriteria] = useState<GradingCriteria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && project?.id) {
      fetchProjectDetails();
    }
  }, [isOpen, project]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);

      // Fetch resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('project_resources')
        .select('*')
        .eq('project_id', project.id)
        .order('uploaded_at', { ascending: false });

      if (resourcesError) throw resourcesError;
      setResources(resourcesData || []);

      // Fetch grading criteria
      const { data: criteriaData, error: criteriaError } = await supabase
        .from('project_grading_criteria')
        .select('*')
        .eq('project_id', project.id)
        .order('weight', { ascending: false });

      if (criteriaError) throw criteriaError;
      setCriteria(criteriaData || []);
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!project) return null;

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Project Details" size="xl">
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Project Details" size="xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-[20px] p-6 border border-blue-200">
          <p 
            className="text-blue-600 mb-2 font-mono"
            style={{ fontSize: '13px', fontWeight: 500 }}
          >
            {project.project_id}
          </p>
          <h2 
            className="text-gray-900 mb-3"
            style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.015em' }}
          >
            {project.title}
          </h2>
          <p 
            className="text-gray-700"
            style={{ fontSize: '15px', fontWeight: 400, lineHeight: 1.6 }}
          >
            {project.description}
          </p>
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-[16px] border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 rounded-[12px] flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p 
                className="text-blue-600"
                style={{ fontSize: '13px', fontWeight: 500 }}
              >
                Subject
              </p>
              <p 
                className="text-gray-900"
                style={{ fontSize: '16px', fontWeight: 600 }}
              >
                {project.subject}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-emerald-50 rounded-[16px] border border-emerald-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-[12px] flex items-center justify-center">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p 
                className="text-emerald-600"
                style={{ fontSize: '13px', fontWeight: 500 }}
              >
                SDG Goal
              </p>
              <p 
                className="text-gray-900"
                style={{ fontSize: '16px', fontWeight: 600 }}
              >
                {project.sdg_goal || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-red-50 rounded-[16px] border border-red-100">
            <div className="w-12 h-12 bg-red-100 rounded-[12px] flex items-center justify-center">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p 
                className="text-red-600"
                style={{ fontSize: '13px', fontWeight: 500 }}
              >
                Due Date
              </p>
              <p 
                className="text-gray-900"
                style={{ fontSize: '16px', fontWeight: 600 }}
              >
                {formatDate(project.due_date)}
              </p>
            </div>
          </div>

          {project.grade !== null && (
            <div className="flex items-center gap-4 p-5 bg-amber-50 rounded-[16px] border border-amber-100">
              <div className="w-12 h-12 bg-amber-100 rounded-[12px] flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p 
                  className="text-amber-600"
                  style={{ fontSize: '13px', fontWeight: 500 }}
                >
                  Your Grade
                </p>
                <p 
                  className="text-gray-900"
                  style={{ fontSize: '18px', fontWeight: 700 }}
                >
                  {project.grade}/100
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Submission Status */}
        {project.submitted_at && (
          <div className="bg-blue-50 rounded-[16px] p-5 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-[10px] flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <p 
                className="text-blue-900"
                style={{ fontSize: '16px', fontWeight: 600 }}
              >
                Submission Status
              </p>
            </div>
            <p 
              className="text-blue-700 ml-[52px]"
              style={{ fontSize: '14px', fontWeight: 400 }}
            >
              Submitted on {formatDate(project.submitted_at)}
            </p>
          </div>
        )}

        {/* Teacher Feedback */}
        {project.feedback && (
          <div className="bg-emerald-50 rounded-[16px] p-5 border border-emerald-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-[10px] flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
              </div>
              <p 
                className="text-emerald-900"
                style={{ fontSize: '16px', fontWeight: 600 }}
              >
                Teacher Feedback
              </p>
            </div>
            <p 
              className="text-emerald-800 ml-[52px]"
              style={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.6 }}
            >
              {project.feedback}
            </p>
          </div>
        )}

        {/* Grading Criteria */}
        {criteria.length > 0 && (
          <div className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm">
            <h3 
              className="text-gray-900 mb-5"
              style={{ fontSize: '18px', fontWeight: 600 }}
            >
              Grading Criteria
            </h3>
            <div className="space-y-3">
              {criteria.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-[12px] border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 
                      className="text-gray-900"
                      style={{ fontSize: '15px', fontWeight: 600 }}
                    >
                      {item.criteria_name}
                    </h4>
                    {item.description && (
                      <p 
                        className="text-gray-600 mt-1"
                        style={{ fontSize: '14px', fontWeight: 400 }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p 
                      className="text-blue-600"
                      style={{ fontSize: '20px', fontWeight: 700 }}
                    >
                      {item.max_points} pts
                    </p>
                    <p 
                      className="text-gray-500"
                      style={{ fontSize: '12px' }}
                    >
                      {item.weight}% weight
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources */}
        {resources.length > 0 && (
          <div className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm">
            <h3 
              className="text-gray-900 mb-5"
              style={{ fontSize: '18px', fontWeight: 600 }}
            >
              Project Resources
            </h3>
            <div className="space-y-2">
              {resources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.resource_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 hover:bg-blue-50 rounded-[12px] transition-all duration-200 group border border-transparent hover:border-blue-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-[10px] flex items-center justify-center transition-colors">
                      <FileText className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div>
                      <p 
                        className="text-gray-900 group-hover:text-blue-600 transition-colors"
                        style={{ fontSize: '15px', fontWeight: 600 }}
                      >
                        {resource.resource_name}
                      </p>
                      <p 
                        className="text-gray-500"
                        style={{ fontSize: '12px' }}
                      >
                        {resource.resource_type}
                      </p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default StudentProjectViewModal;
