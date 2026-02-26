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
  CheckCircle2
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
  id: string; // Add unique id for React keys
  criteria_name: string;
  weight: number;
  max_points: number;
  description: string;
}

interface Resource {
  id: string; // Add unique id for React keys
  resource_type: 'file' | 'link';
  resource_name: string;
  resource_url: string;
  file?: File;
}

const AssignProject: React.FC = () => {
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
  });

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [gradingCriteria, setGradingCriteria] = useState<GradingCriterion[]>([
    { id: crypto.randomUUID(), criteria_name: 'Content Quality', weight: 40, max_points: 100, description: '' },
    { id: crypto.randomUUID(), criteria_name: 'Presentation', weight: 30, max_points: 100, description: '' },
    { id: crypto.randomUUID(), criteria_name: 'Research', weight: 30, max_points: 100, description: '' },
  ]);
  const [resources, setResources] = useState<Resource[]>([]);

  const subjects = ['Science', 'Mathematics', 'History', 'English', 'Geography', 'Physics', 'Chemistry', 'Biology'];
  const sdgGoals = Array.from({ length: 17 }, (_, i) => `SDG ${i + 1}`);

  useEffect(() => {
    fetchClassesAndStudents();
  }, []);

  const fetchClassesAndStudents = async () => {
    try {
      setLoading(true);

      // Fetch all class assignments with student and class details
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

      // Group students by class
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
      showNotification('error', 'Failed to load classes and students');
    } finally {
      setLoading(false);
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
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `project-resources/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
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
    const subjectCode = subject.substring(0, 1).toUpperCase();
    const classCode = className || 'GEN';
    const timestamp = Date.now().toString().slice(-4);
    return `P${classCode}${subjectCode}-${timestamp}`;
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
    if (selectedStudents.length === 0) {
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

      // Generate project ID
      const firstStudent = classes
        .flatMap(c => c.students)
        .find(s => selectedStudents.includes(s.id));
      const projectId = generateProjectId(formData.subject, firstStudent?.class_name || '');

      // For testing: Use a dummy user ID instead of authentication
      const dummyUserId = '00000000-0000-0000-0000-000000000000';

      // Insert project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          project_id: projectId,
          title: formData.title,
          description: formData.description,
          subject: formData.subject,
          sdg_goal: formData.sdg_goal,
          due_date: formData.due_date,
          created_by: dummyUserId, // Using dummy ID for testing
          status: 'active'
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Insert project assignments
      const assignments = selectedStudents.map(studentId => ({
        project_id: project.id,
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
          project_id: project.id,
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
          project_id: project.id,
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
          project_id: project.id,
          user_id: dummyUserId, // Using dummy ID for testing
          activity_type: 'created',
          activity_description: `Project "${formData.title}" created and assigned to ${selectedStudents.length} student(s)`
        });

      showNotification('success', 'Project created and assigned successfully!');

      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: '',
        sdg_goal: '',
        due_date: '',
      });
      setSelectedStudents([]);
      setResources([]);
      setGradingCriteria([
        { id: crypto.randomUUID(), criteria_name: 'Content Quality', weight: 40, max_points: 100, description: '' },
        { id: crypto.randomUUID(), criteria_name: 'Presentation', weight: 30, max_points: 100, description: '' },
        { id: crypto.randomUUID(), criteria_name: 'Research', weight: 30, max_points: 100, description: '' },
      ]);
    } catch (error) {
      console.error('Error creating project:', error);
      showNotification('error', 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalWeight = gradingCriteria.reduce((sum, c) => sum + Number(c.weight), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Assign New Project</h1>
          <p className="text-gray-600 mt-2">Create and assign a new project to students</p>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
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
            <button
              onClick={() => setNotification(null)}
              className="ml-auto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </div>
            </div>
          </div>

          {/* Student Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Assign to Students <span className="text-red-500">*</span>
            </h2>

            <div className="space-y-4">
              {classes.map(classItem => (
                <div key={classItem.id} className="border border-gray-200 rounded-lg p-4">
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
                      className="text-lg font-semibold text-gray-900 cursor-pointer"
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Grading Criteria</h2>
              <button
                type="button"
                onClick={addGradingCriteria}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Criteria
              </button>
            </div>

            <div className="space-y-4">
              {gradingCriteria.map((criteria) => (
                <div key={criteria.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4">
                      <input
                        type="text"
                        placeholder="Criteria name"
                        value={criteria.criteria_name}
                        onChange={(e) => updateGradingCriteria(criteria.id, 'criteria_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="number"
                        placeholder="Weight %"
                        value={criteria.weight}
                        onChange={(e) => updateGradingCriteria(criteria.id, 'weight', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="number"
                        placeholder="Max points"
                        value={criteria.max_points}
                        onChange={(e) => updateGradingCriteria(criteria.id, 'max_points', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <input
                        type="text"
                        placeholder="Description"
                        value={criteria.description}
                        onChange={(e) => updateGradingCriteria(criteria.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            <div className={`mt-4 text-sm font-medium ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
              Total Weight: {totalWeight.toFixed(1)}% {totalWeight === 100 ? '✓' : '(must equal 100%)'}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Resources & Materials</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addResource('file')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => addResource('link')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  Add Link
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {resources.map((resource) => (
                <div key={resource.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  {resource.resource_type === 'file' ? (
                    <>
                      <Upload className="w-5 h-5 text-gray-400" />
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
                      <LinkIcon className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Resource name"
                        value={resource.resource_name}
                        onChange={(e) => updateResource(resource.id, 'resource_name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="url"
                        placeholder="URL"
                        value={resource.resource_url}
                        onChange={(e) => updateResource(resource.id, 'resource_url', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => removeResource(resource.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {resources.length === 0 && (
                <p className="text-center text-gray-500 py-8">No resources added yet</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: '',
                  description: '',
                  subject: '',
                  sdg_goal: '',
                  due_date: '',
                });
                setSelectedStudents([]);
                setResources([]);
              }}
              className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create & Assign Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignProject;
