import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Modal from '../../components/ui/Modal';
import {
  Calendar,
  Users,
  FileText,
  Target,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download
} from 'lucide-react';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

interface ProjectDetails {
  id: string;
  project_id: string;
  title: string;
  description: string;
  subject: string;
  sdg_goal: string;
  due_date: string;
  status: string;
  created_at: string;
}

interface ProjectResource {
  id: string;
  resource_type: string;
  resource_name: string;
  resource_url: string;
  uploaded_at: string;
}

interface GradingCriteria {
  id: string;
  criteria_name: string;
  weight: number;
  max_points: number;
  description: string;
}

interface AssignmentStats {
  total_assigned: number;
  not_started: number;
  in_progress: number;
  completed: number;
  submitted: number;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ isOpen, onClose, projectId }) => {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [resources, setResources] = useState<ProjectResource[]>([]);
  const [criteria, setCriteria] = useState<GradingCriteria[]>([]);
  const [stats, setStats] = useState<AssignmentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchProjectDetails();
    }
  }, [isOpen, projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);

      // Fetch project details
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Fetch resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('project_resources')
        .select('*')
        .eq('project_id', projectId)
        .order('uploaded_at', { ascending: false });

      if (resourcesError) throw resourcesError;
      setResources(resourcesData || []);

      // Fetch grading criteria
      const { data: criteriaData, error: criteriaError } = await supabase
        .from('project_grading_criteria')
        .select('*')
        .eq('project_id', projectId)
        .order('weight', { ascending: false });

      if (criteriaError) throw criteriaError;
      setCriteria(criteriaData || []);

      // Fetch assignment statistics
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('project_assignments')
        .select('status')
        .eq('project_id', projectId);

      if (assignmentsError) throw assignmentsError;

      const statsData: AssignmentStats = {
        total_assigned: assignmentsData?.length || 0,
        not_started: assignmentsData?.filter(a => a.status === 'not_started').length || 0,
        in_progress: assignmentsData?.filter(a => a.status === 'in_progress').length || 0,
        completed: assignmentsData?.filter(a => a.status === 'completed').length || 0,
        submitted: assignmentsData?.filter(a => a.status === 'submitted').length || 0
      };

      setStats(statsData);
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

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      active: <Clock className="w-5 h-5 text-amber-600" />,
      completed: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      draft: <FileText className="w-5 h-5 text-gray-500" />,
      archived: <AlertCircle className="w-5 h-5 text-gray-400" />
    };
    return icons[status] || icons.draft;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-amber-50 text-amber-700 border-amber-200',
      completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      draft: 'bg-gray-50 text-gray-700 border-gray-200',
      archived: 'bg-gray-50 text-gray-500 border-gray-200'
    };
    return colors[status] || colors.draft;
  };

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Project Details" size="xl">
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
        </div>
      </Modal>
    );
  }

  if (!project) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Project Details" size="xl">
        <div className="text-center py-12">
          <p 
            className="text-gray-500"
            style={{ fontSize: '15px', fontWeight: 500 }}
          >
            Project not found
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Project Details" size="xl">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-[20px] p-6 border border-blue-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p 
                className="text-blue-600 mb-2 font-mono"
                style={{ fontSize: '13px', fontWeight: 500 }}
              >
                {project.project_id}
              </p>
              <h2 
                className="text-gray-900 mb-2"
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
            <div className={`flex items-center gap-2 ml-4 px-3 py-1.5 rounded-xl border ${getStatusColor(project.status)}`}>
              {getStatusIcon(project.status)}
              <span 
                className="font-medium capitalize"
                style={{ fontSize: '14px' }}
              >
                {project.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-[12px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p 
                  className="text-blue-600"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                >
                  Subject
                </p>
                <p 
                  className="text-gray-900"
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  {project.subject}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-[12px] flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p 
                  className="text-emerald-600"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                >
                  SDG Goal
                </p>
                <p 
                  className="text-gray-900"
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  {project.sdg_goal || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-[12px] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p 
                  className="text-red-600"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                >
                  Due Date
                </p>
                <p 
                  className="text-gray-900"
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  {formatDate(project.due_date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-[12px] flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p 
                  className="text-purple-600"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                >
                  Assigned
                </p>
                <p 
                  className="text-gray-900"
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  {stats?.total_assigned || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Statistics */}
        {stats && (
          <div className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm">
            <h3 
              className="text-gray-900 mb-5"
              style={{ fontSize: '18px', fontWeight: 600 }}
            >
              Assignment Progress
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-5 bg-gray-50 rounded-[16px] border border-gray-100">
                <p 
                  className="text-gray-700"
                  style={{ fontSize: '28px', fontWeight: 700 }}
                >
                  {stats.not_started}
                </p>
                <p 
                  className="text-gray-600 mt-2"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                >
                  Not Started
                </p>
              </div>
              <div className="text-center p-5 bg-blue-50 rounded-[16px] border border-blue-100">
                <p 
                  className="text-blue-700"
                  style={{ fontSize: '28px', fontWeight: 700 }}
                >
                  {stats.in_progress}
                </p>
                <p 
                  className="text-blue-600 mt-2"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                >
                  In Progress
                </p>
              </div>
              <div className="text-center p-5 bg-amber-50 rounded-[16px] border border-amber-100">
                <p 
                  className="text-amber-700"
                  style={{ fontSize: '28px', fontWeight: 700 }}
                >
                  {stats.submitted}
                </p>
                <p 
                  className="text-amber-600 mt-2"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                >
                  Submitted
                </p>
              </div>
              <div className="text-center p-5 bg-emerald-50 rounded-[16px] border border-emerald-100">
                <p 
                  className="text-emerald-700"
                  style={{ fontSize: '28px', fontWeight: 700 }}
                >
                  {stats.completed}
                </p>
                <p 
                  className="text-emerald-600 mt-2"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                >
                  Completed
                </p>
              </div>
            </div>
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
              Resources
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

export default ProjectDetailsModal;
