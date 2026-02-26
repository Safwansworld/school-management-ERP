import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Save,
  X,
  Plus,
  Upload,
  Link as LinkIcon,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader
} from 'lucide-react';

interface ClassWithStudents {
  id: string;
  class_name: string;
  students: Student[];
}

interface Student {
  id: string;
  student_name: string;
  class_name: string;
}

interface GradingCriterion {
  id: string;
  criteria_name: string;
  weight: number;
  max_points: number;
  description: string;
}

interface Resource {
  id: string;
  resource_type: 'file' | 'link';
  resource_name: string;
  resource_url: string;
  file?: File;
}

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any | null;
  mode: 'create' | 'edit' | 'duplicate';
  onSuccess: () => void;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  project,
  mode,
  onSuccess
}) => {
  const [classes, setClasses] = useState<ClassWithStudents[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    sdg_goal: '',
    due_date: '',
    status: 'draft'
  });

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [gradingCriteria, setGradingCriteria] = useState<GradingCriterion[]>([
    { id: crypto.randomUUID(), criteria_name: 'Content Quality', weight: 40, max_points: 100, description: '' },
    { id: crypto.randomUUID(), criteria_name: 'Presentation', weight: 30, max_points: 100, description: '' },
    { id: crypto.randomUUID(), criteria_name: 'Research', weight: 30, max_points: 100, description: '' },
  ]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [existingProjectId, setExistingProjectId] = useState<string>('');

  const subjects = ['Science', 'Mathematics', 'History', 'English', 'Geography', 'Physics', 'Chemistry', 'Biology'];
  const sdgGoals = Array.from({ length: 17 }, (_, i) => `SDG ${i + 1}`);

  useEffect(() => {
    if (isOpen) {
      fetchClassesAndStudents();
      loadProjectData();
    }
  }, [isOpen, project, mode]);

  const loadProjectData = async () => {
    if (mode === 'edit' && project) {
      // Load existing project data
      setFormData({
        title: project.title,
        description: project.description,
        subject: project.subject,
        sdg_goal: project.sdg_goal || '',
        due_date: project.due_date,
        status: project.status
      });
      setExistingProjectId(project.id);

      // Load assigned students
      const { data: assignments } = await supabase
        .from('project_assignments')
        .select('student_id')
        .eq('project_id', project.id);

      if (assignments) {
        setSelectedStudents(assignments.map(a => a.student_id));
      }

      // Load grading criteria
      const { data: criteria } = await supabase
        .from('project_grading_criteria')
        .select('*')
        .eq('project_id', project.id);

      if (criteria && criteria.length > 0) {
        setGradingCriteria(criteria.map(c => ({
          id: c.id,
          criteria_name: c.criteria_name,
          weight: c.weight,
          max_points: c.max_points,
          description: c.description || ''
        })));
      }

      // Load resources
      const { data: resourcesData } = await supabase
        .from('project_resources')
        .select('*')
        .eq('project_id', project.id);

      if (resourcesData && resourcesData.length > 0) {
        setResources(resourcesData.map(r => ({
          id: r.id,
          resource_type: r.resource_type,
          resource_name: r.resource_name,
          resource_url: r.resource_url
        })));
      }
    } else if (mode === 'duplicate' && project) {
      // Duplicate project data
      setFormData({
        title: `${project.title} (Copy)`,
        description: project.description,
        subject: project.subject,
        sdg_goal: project.sdg_goal || '',
        due_date: '',
        status: 'draft'
      });

      // Load grading criteria from original
      const { data: criteria } = await supabase
        .from('project_grading_criteria')
        .select('*')
        .eq('project_id', project.id);

      if (criteria && criteria.length > 0) {
        setGradingCriteria(criteria.map(c => ({
          id: crypto.randomUUID(),
          criteria_name: c.criteria_name,
          weight: c.weight,
          max_points: c.max_points,
          description: c.description || ''
        })));
      }

      // Load resources from original
      const { data: resourcesData } = await supabase
        .from('project_resources')
        .select('*')
        .eq('project_id', project.id);

      if (resourcesData && resourcesData.length > 0) {
        setResources(resourcesData.map(r => ({
          id: crypto.randomUUID(),
          resource_type: r.resource_type,
          resource_name: r.resource_name,
          resource_url: r.resource_url
        })));
      }
    } else {
      // Reset for create mode
      setFormData({
        title: '',
        description: '',
        subject: '',
        sdg_goal: '',
        due_date: '',
        status: 'draft'
      });
      setSelectedStudents([]);
      setResources([]);
      setGradingCriteria([
        { id: crypto.randomUUID(), criteria_name: 'Content Quality', weight: 40, max_points: 100, description: '' },
        { id: crypto.randomUUID(), criteria_name: 'Presentation', weight: 30, max_points: 100, description: '' },
        { id: crypto.randomUUID(), criteria_name: 'Research', weight: 30, max_points: 100, description: '' },
      ]);
    }
  };

  const fetchClassesAndStudents = async () => {
    try {
      const { data: assignments, error } = await supabase
        .from('class_assignments')
        .select(`
          id,
          class_id,
          student_id,
          class_name,
          student_name,
          academic_year
        `)
        .order('class_name');

      if (error) throw error;

      const classMap = new Map<string, ClassWithStudents>();

      assignments?.forEach((assignment) => {
        if (!classMap.has(assignment.class_id)) {
          classMap.set(assignment.class_id, {
            id: assignment.class_id,
            class_name: assignment.class_name,
            students: []
          });
        }

        const classData = classMap.get(assignment.class_id);
        if (classData) {
          classData.students.push({
            id: assignment.student_id,
            student_name: assignment.student_name,
            class_name: assignment.class_name
          });
        }
      });

      setClasses(Array.from(classMap.values()));
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleClassSelection = (classId: string) => {
    const classStudents = classes.find(c => c.id === classId)?.students || [];
    const studentIds = classStudents.map(s => s.id);
    const allSelected = studentIds.every(id => selectedStudents.includes(id));

    if (allSelected) {
      setSelectedStudents(prev => prev.filter(id => !studentIds.includes(id)));
    } else {
      setSelectedStudents(prev => [...new Set([...prev, ...studentIds])]);
    }
  };

  const addGradingCriteria = () => {
    setGradingCriteria(prev => [
      ...prev,
      { id: crypto.randomUUID(), criteria_name: '', weight: 0, max_points: 100, description: '' }
    ]);
  };

  const updateGradingCriteria = (id: string, field: keyof GradingCriterion, value: string | number) => {
    setGradingCriteria(prev =>
      prev.map(criteria =>
        criteria.id === id ? { ...criteria, [field]: value } : criteria
      )
    );
  };

  const removeGradingCriteria = (id: string) => {
    setGradingCriteria(prev => prev.filter(criteria => criteria.id !== id));
  };

  const addResource = (type: 'file' | 'link') => {
    setResources(prev => [
      ...prev,
      { id: crypto.randomUUID(), resource_type: type, resource_name: '', resource_url: '' }
    ]);
  };

  const updateResource = (id: string, field: keyof Resource, value: string | File) => {
    setResources(prev =>
      prev.map(resource =>
        resource.id === id ? { ...resource, [field]: value } : resource
      )
    );
  };

  const removeResource = (id: string) => {
    setResources(prev => prev.filter(resource => resource.id !== id));
  };

  const handleFileChange = async (id: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `project-resources/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(filePath);

      updateResource(id, 'resource_url', publicUrl);
      updateResource(id, 'resource_name', file.name);
    } catch (error) {
      console.error('Error uploading file:', error);
      showNotification('error', 'Failed to upload file');
    }
  };

  const generateProjectId = (subject: string, className: string) => {
    const subjectCode = subject.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `PRJ-${subjectCode}-${timestamp}`;
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      showNotification('error', 'Project title is required');
      return false;
    }
    if (!formData.subject) {
      showNotification('error', 'Please select a subject');
      return false;
    }
    if (!formData.due_date) {
      showNotification('error', 'Due date is required');
      return false;
    }
    if (selectedStudents.length === 0 && mode !== 'edit') {
      showNotification('error', 'Please select at least one student');
      return false;
    }

    const totalWeight = gradingCriteria.reduce((sum, c) => sum + Number(c.weight), 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      showNotification('error', 'Grading criteria weights must total 100%');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || '00000000-0000-0000-0000-000000000000';

      if (mode === 'edit') {
        // Update existing project
        const { error: projectError } = await supabase
          .from('projects')
          .update({
            title: formData.title,
            description: formData.description,
            subject: formData.subject,
            sdg_goal: formData.sdg_goal,
            due_date: formData.due_date,
            status: formData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProjectId);

        if (projectError) throw projectError;

        // Update assignments
        await supabase
          .from('project_assignments')
          .delete()
          .eq('project_id', existingProjectId);

        const assignments = selectedStudents.map(studentId => ({
          project_id: existingProjectId,
          student_id: studentId,
          status: 'not_started'
        }));

        const { error: assignmentError } = await supabase
          .from('project_assignments')
          .insert(assignments);

        if (assignmentError) throw assignmentError;

        // Update grading criteria
        await supabase
          .from('project_grading_criteria')
          .delete()
          .eq('project_id', existingProjectId);

        const criteria = gradingCriteria
          .filter(c => c.criteria_name.trim())
          .map(c => ({
            project_id: existingProjectId,
            criteria_name: c.criteria_name,
            weight: c.weight,
            max_points: c.max_points,
            description: c.description
          }));

        if (criteria.length > 0) {
          const { error: criteriaError } = await supabase
            .from('project_grading_criteria')
            .insert(criteria);

          if (criteriaError) throw criteriaError;
        }

        // Update resources
        await supabase
          .from('project_resources')
          .delete()
          .eq('project_id', existingProjectId);

        const resourceData = resources
          .filter(r => r.resource_name && r.resource_url)
          .map(r => ({
            project_id: existingProjectId,
            resource_type: r.resource_type,
            resource_name: r.resource_name,
            resource_url: r.resource_url
          }));

        if (resourceData.length > 0) {
          const { error: resourceError } = await supabase
            .from('project_resources')
            .insert(resourceData);

          if (resourceError) throw resourceError;
        }

        showNotification('success', 'Project updated successfully!');
      } else {
        // Create new project (create or duplicate)
        const firstStudent = classes
          .flatMap(c => c.students)
          .find(s => selectedStudents.includes(s.id));
        const projectId = generateProjectId(formData.subject, firstStudent?.class_name || '');

        const { data: newProject, error: projectError } = await supabase
          .from('projects')
          .insert({
            project_id: projectId,
            title: formData.title,
            description: formData.description,
            subject: formData.subject,
            sdg_goal: formData.sdg_goal,
            due_date: formData.due_date,
            created_by: userId,
            status: formData.status
          })
          .select()
          .single();

        if (projectError) throw projectError;

        // Insert project assignments
        const assignments = selectedStudents.map(studentId => ({
          project_id: newProject.id,
          student_id: studentId,
          status: 'not_started'
        }));

        const { error: assignmentError } = await supabase
          .from('project_assignments')
          .insert(assignments);

        if (assignmentError) throw assignmentError;

        // Insert grading criteria
        const criteria = gradingCriteria
          .filter(c => c.criteria_name.trim())
          .map(c => ({
            project_id: newProject.id,
            criteria_name: c.criteria_name,
            weight: c.weight,
            max_points: c.max_points,
            description: c.description
          }));

        if (criteria.length > 0) {
          const { error: criteriaError } = await supabase
            .from('project_grading_criteria')
            .insert(criteria);

          if (criteriaError) throw criteriaError;
        }

        // Insert resources
        const resourceData = resources
          .filter(r => r.resource_name && r.resource_url)
          .map(r => ({
            project_id: newProject.id,
            resource_type: r.resource_type,
            resource_name: r.resource_name,
            resource_url: r.resource_url
          }));

        if (resourceData.length > 0) {
          const { error: resourceError } = await supabase
            .from('project_resources')
            .insert(resourceData);

          if (resourceError) throw resourceError;
        }

        // Log activity
        await supabase
          .from('project_activity_log')
          .insert({
            project_id: newProject.id,
            user_id: userId,
            activity_type: mode === 'duplicate' ? 'duplicated' : 'created',
            activity_description: `Project "${formData.title}" ${mode === 'duplicate' ? 'duplicated' : 'created'} and assigned to ${selectedStudents.length} student(s)`
          });

        showNotification('success', `Project ${mode === 'duplicate' ? 'duplicated' : 'created'} successfully!`);
      }

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving project:', error);
      showNotification('error', 'Failed to save project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalWeight = gradingCriteria.reduce((sum, c) => sum + Number(c.weight), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Create New Project' : mode === 'edit' ? 'Edit Project' : 'Duplicate Project'}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`mx-6 mt-4 p-4 rounded-lg flex items-center gap-3 ${
              notification.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Renewable Energy Sources: A Comparative Study"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Provide detailed instructions and objectives for the project..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject, index) => (
                      <option key={`subject-${index}-${subject}`} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SDG Goal
                  </label>
                  <select
                    name="sdg_goal"
                    value={formData.sdg_goal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select SDG</option>
                    {sdgGoals.map((sdg, index) => (
                      <option key={`sdg-${index}-${sdg}`} value={sdg}>{sdg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Student Selection */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Assign to Students {mode !== 'edit' && <span className="text-red-500">*</span>}
            </h3>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {classes.map(classItem => (
                <div key={classItem.id} className="border border-gray-200 bg-white rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      id={`class-${classItem.id}`}
                      checked={classItem.students.every(s => selectedStudents.includes(s.id))}
                      onChange={() => toggleClassSelection(classItem.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`class-${classItem.id}`}
                      className="text-base font-semibold text-gray-900 cursor-pointer"
                    >
                      {classItem.class_name}
                    </label>
                    <span className="ml-auto text-sm text-gray-600">
                      {classItem.students.filter(s => selectedStudents.includes(s.id)).length} / {classItem.students.length} selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pl-7">
                    {classItem.students.map(student => (
                      <label
                        key={student.id}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{student.student_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm text-gray-600">
              Selected: <span className="font-semibold">{selectedStudents.length}</span> student(s)
            </p>
          </div>

          {/* Grading Criteria */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Grading Criteria</h3>
              <button
                type="button"
                onClick={addGradingCriteria}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Criteria
              </button>
            </div>

            <div className="space-y-3">
              {gradingCriteria.map((criteria) => (
                <div key={criteria.id} className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-4">
                      <input
                        type="text"
                        placeholder="Criteria name"
                        value={criteria.criteria_name}
                        onChange={(e) => updateGradingCriteria(criteria.id, 'criteria_name', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="number"
                        placeholder="Weight %"
                        value={criteria.weight}
                        onChange={(e) => updateGradingCriteria(criteria.id, 'weight', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="number"
                        placeholder="Max points"
                        value={criteria.max_points}
                        onChange={(e) => updateGradingCriteria(criteria.id, 'max_points', parseInt(e.target.value))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <input
                        type="text"
                        placeholder="Description"
                        value={criteria.description}
                        onChange={(e) => updateGradingCriteria(criteria.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-1 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeGradingCriteria(criteria.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-3 text-sm font-medium ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
              Total Weight: {totalWeight.toFixed(1)}% {totalWeight === 100 ? '✓' : '(must equal 100%)'}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Resources & Materials</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addResource('file')}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => addResource('link')}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  Add Link
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {resources.map((resource) => (
                <div key={resource.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                  {resource.resource_type === 'file' ? (
                    <>
                      <Upload className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileChange(resource.id, file);
                        }}
                        className="flex-1 text-sm text-gray-600"
                      />
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Resource name"
                        value={resource.resource_name}
                        onChange={(e) => updateResource(resource.id, 'resource_name', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="url"
                        placeholder="URL"
                        value={resource.resource_url}
                        onChange={(e) => updateResource(resource.id, 'resource_url', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => removeResource(resource.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {resources.length === 0 && (
                <p className="text-center text-gray-500 py-6 text-sm">No resources added yet</p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {mode === 'create' ? 'Create Project' : mode === 'edit' ? 'Update Project' : 'Duplicate Project'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
