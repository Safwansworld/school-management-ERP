import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Users, BookOpen, User, Calendar, 
  Search, Filter, RefreshCw, MoreVertical,
  Edit, Trash, X, Loader, CheckCircle,
  AlertCircle, Info, ChevronDown, ChevronUp,
  Settings2, FileDown, FileUp, Hash, IdCard,
  Phone, Mail, UserCheck, ShieldCheck, ShieldX,
  Building2
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useRolePermissions } from '../../hooks/useRolePermissions';

// Types (keeping your existing types)
interface Class {
  id?: string;
  class_name: string;
  section: string;
  academic_year: string;
  capacity: number;
  current_strength: number;
  class_teacher_id?: string;
  class_teacher_name?: string;
  status: 'active' | 'inactive';
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface Student {
  id: string;
  full_name: string;
  roll_number: string;
  admission_number: string;
  profile_picture?: string;
  status: 'active' | 'inactive';
  email?: string;
  parent_contact: string;
  class_id?: string;
}

interface NotificationState {
  show: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

export const Classes = () => {
  const navigate = useNavigate();
  
  // State Management (keeping your existing states)
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openStudentsDropdown, setOpenStudentsDropdown] = useState<string | null>(null);
  const { canAdd, canEdit, canDelete, isTeacher } = useRolePermissions();
  
  // Student list states
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [classStudents, setClassStudents] = useState<{ [key: string]: Student[] }>({});
  const [loadingStudents, setLoadingStudents] = useState<{ [key: string]: boolean }>({});
  
  // Form states
  const [formData, setFormData] = useState<Partial<Class>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'info',
    title: '',
    message: ''
  });

  // Available academic years
  const currentYear = new Date().getFullYear();
  const academicYears = Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - 2 + i;
    return `${year}-${year + 1}`;
  });

  // Show notification helper
  const showNotification = (type: NotificationState['type'], title: string, message: string) => {
    setNotification({ show: true, type, title, message });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // Supabase Service Functions (keeping your existing functions)
  const createClass = async (classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>): Promise<Class> => {
    const { data, error } = await supabase
      .from('classes')
      .insert(classData)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const getClasses = async () => {
    console.log('Fetching classes...');
    
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        teachers!classes_class_teacher_id_fkey(full_name)
      `)
      .order('class_name', { ascending: true });

    if (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }

    const classesWithCounts = await Promise.all(data.map(async (cls) => {
      const { data: assignmentData, error: countError } = await supabase
        .from('class_assignments')
        .select('student_id')
        .eq('class_id', cls.id);

      if (countError) {
        console.error('Error counting students:', countError);
      }

      const studentCount = assignmentData?.length || 0;

      return {
        ...cls,
        current_strength: studentCount,
        class_teacher_name: cls.teachers?.full_name || null
      };
    }));

    console.log('Classes loaded:', classesWithCounts);
    return classesWithCounts;
  };

  const updateClass = async (id: string, classData: Partial<Class>): Promise<Class> => {
    const { data, error } = await supabase
      .from('classes')
      .update(classData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deleteClass = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  const getClassStudents = async (classId: string): Promise<Student[]> => {
    console.log('Fetching students for class:', classId);
    
    try {
      const { data: assignments, error: assignmentError } = await supabase
        .from('class_assignments')
        .select('student_id')
        .eq('class_id', classId);

      if (assignmentError) {
        console.error('Error fetching class assignments:', assignmentError);
        throw assignmentError;
      }

      if (!assignments || assignments.length === 0) {
        console.log('No students assigned to this class');
        return [];
      }

      const studentIds = assignments.map(assignment => assignment.student_id);
      console.log('Found student IDs:', studentIds);

      const { data: students, error: studentError } = await supabase
        .from('students')
        .select(`
          id,
          full_name,
          roll_number,
          admission_number,
          profile_picture,
          status,
          email,
          parent_contact
        `)
        .in('id', studentIds)
        .order('roll_number', { ascending: true });

      if (studentError) {
        console.error('Error fetching students:', studentError);
        throw studentError;
      }

      const transformedStudents: Student[] = (students || []).map(student => ({
        id: student.id,
        full_name: student.full_name,
        roll_number: student.roll_number,
        admission_number: student.admission_number,
        profile_picture: student.profile_picture,
        status: student.status as 'active' | 'inactive',
        email: student.email,
        parent_contact: student.parent_contact,
        class_id: classId
      }));

      console.log(`Found ${transformedStudents.length} students for class ${classId}`);
      return transformedStudents;

    } catch (error) {
      console.error('Error in getClassStudents:', error);
      throw error;
    }
  };

  const loadClasses = async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      const data = await getClasses();
      setClasses(data);
      
    } catch (error) {
      console.error('Error loading classes:', error);
      showNotification('error', 'Loading Failed', 'Failed to load classes. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadClassStudents = async (classId: string) => {
    try {
      setLoadingStudents(prev => ({ ...prev, [classId]: true }));
      const students = await getClassStudents(classId);
      setClassStudents(prev => ({ ...prev, [classId]: students }));
      console.log('Students loaded for class:', classId, students);
    } catch (error) {
      console.error('Error loading class students:', error);
      showNotification('error', 'Loading Failed', 'Failed to load students for this class.');
      setClassStudents(prev => ({ ...prev, [classId]: [] }));
    } finally {
      setLoadingStudents(prev => ({ ...prev, [classId]: false }));
    }
  };

  const handleViewStudents = (cls: Class) => {
    const classId = cls.id!;
    
    if (expandedClass === classId) {
      setExpandedClass(null);
    } else {
      setExpandedClass(classId);
      if (!classStudents[classId]) {
        loadClassStudents(classId);
      }
    }
    setOpenStudentsDropdown(null);
  };

  const handleManageStudents = (cls: Class) => {
    navigate(`/classes/${cls.id}/students`);
    setOpenStudentsDropdown(null);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  // Form Validation
  const validateForm = (data: Partial<Class>): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.class_name) {
      errors.class_name = 'Class name is required';
    }
    if (!data.section) {
      errors.section = 'Section is required';
    }
    if (!data.academic_year) {
      errors.academic_year = 'Academic year is required';
    }
    if (!data.capacity || data.capacity <= 0) {
      errors.capacity = 'Valid capacity is required';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm(formData);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      showNotification('error', 'Validation Error', 'Please fix the errors in the form.');
      return;
    }

    try {
      setSubmitting(true);

      const classData: Omit<Class, 'id' | 'created_at' | 'updated_at'> = {
        class_name: formData.class_name!,
        section: formData.section!,
        academic_year: formData.academic_year!,
        capacity: formData.capacity!,
        current_strength: 0,
        class_teacher_id: formData.class_teacher_id,
        status: formData.status || 'active',
        description: formData.description
      };

      if (showEditModal && selectedClass) {
        await updateClass(selectedClass.id!, classData);
        setShowEditModal(false);
        showNotification('success', 'Class Updated', `${classData.class_name}-${classData.section} has been updated successfully.`);
      } else {
        await createClass(classData);
        setShowAddModal(false);
        showNotification('success', 'Class Added', `${classData.class_name}-${classData.section} has been added successfully.`);
      }

      resetForm();
      setTimeout(() => loadClasses(false), 1000);
      
    } catch (error: any) {
      console.error('Error saving class:', error);
      showNotification('error', 'Save Failed', 'Failed to save class. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedClass) {
      try {
        setSubmitting(true);
        await deleteClass(selectedClass.id!);
        setShowDeleteModal(false);
        setSelectedClass(null);
        showNotification('success', 'Class Deleted', `${selectedClass.class_name}-${selectedClass.section} has been deleted successfully.`);
        setTimeout(() => loadClasses(false), 1000);
      } catch (error: any) {
        console.error('Error deleting class:', error);
        showNotification('error', 'Delete Failed', 'Failed to delete class. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({});
    setFormErrors({});
    setSelectedClass(null);
  };

  const handleEdit = (cls: Class) => {
    setSelectedClass(cls);
    setFormData(cls);
    setShowEditModal(true);
  };

  const handleDelete = (cls: Class) => {
    setSelectedClass(cls);
    setShowDeleteModal(true);
  };

  const exportToCSV = async () => {
    try {
      showNotification('info', 'Exporting...', 'Preparing CSV file for download.');

      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const csvContent = [
        'Class Name,Section,Academic Year,Capacity,Current Strength,Status,Description',
        ...data.map(cls => [
          cls.class_name,
          cls.section,
          cls.academic_year,
          cls.capacity,
          cls.current_strength,
          cls.status,
          cls.description?.replace(/,/g, ';') || ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `classes-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      showNotification('success', 'Export Complete', 'Class data exported successfully.');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showNotification('error', 'Export Failed', 'Failed to export class data.');
    }
  };

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.section.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = !selectedYear || cls.academic_year === selectedYear;
    return matchesSearch && matchesYear;
  });

  return (
    <div className="p-3 space-y-3">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-30" style={{
        backgroundImage: `radial-gradient(circle at 20px 20px, rgba(30, 136, 229, 0.1) 2px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>

      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-4 right-4 z-50 max-w-md w-full"
          >
            <div className={`rounded-xl shadow-2xl border-l-4 p-4 backdrop-blur-lg ${
              notification.type === 'success' ? 'bg-green-50/90 border-green-400' :
              notification.type === 'error' ? 'bg-red-50/90 border-red-400' :
              notification.type === 'warning' ? 'bg-yellow-50/90 border-yellow-400' :
              'bg-blue-50/90 border-blue-400'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {notification.type === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
                  {notification.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600" />}
                  {notification.type === 'info' && <Info className="h-5 w-5 text-blue-600" />}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-semibold ${
                    notification.type === 'success' ? 'text-green-900' :
                    notification.type === 'error' ? 'text-red-900' :
                    notification.type === 'warning' ? 'text-yellow-900' :
                    'text-blue-900'
                  }`}>
                    {notification.title}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    notification.type === 'success' ? 'text-green-800' :
                    notification.type === 'error' ? 'text-red-800' :
                    notification.type === 'warning' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                  className="ml-auto"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between relative z-10"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Classes</h1>
          <p className="text-gray-600">Manage class information and assignments</p>
        </div>
        {canAdd && <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="gradient-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #1E88E5 0%, #5B9FFF 100%)'
            }}
          >
            <Plus className="w-5 h-5" />
            Create Class
          </button>
        </motion.div>}
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4 relative z-10"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent shadow-lg"
          />
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-3 bg-white/80 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent shadow-lg"
        >
          <option value="">All Academic Years</option>
          {academicYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </motion.div>

      {/* Classes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="glass-strong rounded-2xl p-6 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredClasses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-2xl p-12 text-center relative z-10"
        >
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 text-xl font-semibold mb-2">No classes found</p>
          <p className="text-gray-500">Create your first class to get started</p>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {filteredClasses.map((classItem, index) => (
              <motion.div
                key={classItem.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
                className="glass-strong rounded-2xl p-6 shadow-soft hover:shadow-float transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                {/* Gradient Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                  background: 'linear-gradient(90deg, #1E88E5 0%, #5B9FFF 100%)'
                }}></div>

                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E88E5]/20 to-[#5B9FFF]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-6 h-6 text-[#1E88E5]" />
                    </div>
                    <div className="relative">
                      {canEdit && <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(openDropdown === classItem.id ? null : classItem.id!);
                        }}
                        className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>}
                      {openDropdown === classItem.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(classItem);
                              setOpenDropdown(null);
                            }}
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Edit className="h-4 w-4 mr-3 text-yellow-600" />
                            Edit Class
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(classItem);
                              setOpenDropdown(null);
                            }}
                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4 mr-3" />
                            Delete Class
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    Class {classItem.class_name}-{classItem.section}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {classItem.academic_year}
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-[#1E88E5]" />
                    <span>{classItem.current_strength}/{classItem.capacity} Students</span>
                  </div>
                  {classItem.class_teacher_name && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-[#1E88E5]" />
                      <span className="truncate">{classItem.class_teacher_name}</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((classItem.current_strength / classItem.capacity) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #1E88E5 0%, #5B9FFF 100%)'
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200/50 flex gap-2">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <button 
                      onClick={() => navigate('/schedule')}
                      className="w-full rounded-lg bg-white hover:bg-[#1E88E5]/10 border border-[#1E88E5]/20 text-[#1E88E5] gap-2 px-3 py-2 text-sm font-medium flex items-center justify-center transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      Timetable
                    </button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenStudentsDropdown(openStudentsDropdown === classItem.id ? null : classItem.id!);
                      }}
                      className="w-full rounded-lg bg-white hover:bg-[#5B9FFF]/10 border border-[#5B9FFF]/20 text-[#5B9FFF] gap-2 px-3 py-2 text-sm font-medium flex items-center justify-center transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      Students
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    {openStudentsDropdown === classItem.id && (
                      <div className="absolute bottom-full mb-2 right-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewStudents(classItem);
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 rounded-t-xl"
                        >
                          <Users className="h-4 w-4 mr-3 text-blue-600" />
                          View Students
                        </button>
                        {canEdit && <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleManageStudents(classItem);
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-green-50 rounded-b-xl"
                        >
                          <Settings2 className="h-4 w-4 mr-3 text-green-600" />
                          Manage Students
                        </button>}
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Expanded Students Table */}
          <AnimatePresence>
            {expandedClass && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-strong rounded-2xl overflow-hidden shadow-float"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-bold text-gray-900 flex items-center">
                      <Users className="h-6 w-6 mr-3 text-[#1E88E5]" />
                      Students in Class {filteredClasses.find(c => c.id === expandedClass)?.class_name}-{filteredClasses.find(c => c.id === expandedClass)?.section}
                    </h4>
                    <button
                      onClick={() => setExpandedClass(null)}
                      className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {loadingStudents[expandedClass] ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader className="h-8 w-8 animate-spin text-[#1E88E5] mr-3" />
                      <span className="text-gray-600 text-lg">Loading students...</span>
                    </div>
                  ) : !classStudents[expandedClass] || classStudents[expandedClass]?.length === 0 ? (
                    <div className="text-center py-12">
                      <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg mb-4">No students assigned to this class</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4" />
                                <span>Student</span>
                              </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                              <div className="flex items-center space-x-2">
                                <Hash className="h-4 w-4" />
                                <span>Roll No</span>
                              </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                              <div className="flex items-center space-x-2">
                                <IdCard className="h-4 w-4" />
                                <span>Admission No</span>
                              </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>Contact</span>
                              </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200">
                          {classStudents[expandedClass]?.map((student, idx) => (
                            <tr key={student.id} className={`hover:bg-blue-50/50 transition-all ${idx % 2 === 0 ? 'bg-white/30' : 'bg-gray-50/30'}`}>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0">
                                    {student.profile_picture ? (
                                      <img
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={student.profile_picture}
                                        alt={student.full_name}
                                      />
                                    ) : (
                                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                        <User className="h-5 w-5 text-gray-500" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-semibold text-gray-900">
                                      {student.full_name}
                                    </div>
                                    {student.email && (
                                      <div className="text-xs text-gray-500 flex items-center">
                                        <Mail className="h-3 w-3 mr-1" />
                                        {student.email}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                {student.roll_number}
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                {student.admission_number}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {student.parent_contact}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${
                                  student.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {student.status === 'active' ? (
                                    <>
                                      <UserCheck className="h-3 w-3 mr-1" />
                                      ACTIVE
                                    </>
                                  ) : (
                                    <>
                                      <ShieldX className="h-3 w-3 mr-1" />
                                      INACTIVE
                                    </>
                                  )}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1E88E5] to-[#5B9FFF] px-6 py-4 rounded-t-2xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                    {showEditModal ? <Edit className="h-6 w-6 text-white" /> : <Plus className="h-6 w-6 text-white" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {showEditModal ? 'Edit Class' : 'Add New Class'}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {showEditModal ? 'Update class information' : 'Create a new class'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="text-white hover:bg-white/20 rounded-xl p-2 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Class Name */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Class Name *
                  </label>
                  <select
                    value={formData.class_name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, class_name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent font-medium"
                  >
                    <option value="">Select Class</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  {formErrors.class_name && (
                    <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.class_name}</p>
                  )}
                </div>

                {/* Section */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Building2 className="h-4 w-4 mr-2" />
                    Section *
                  </label>
                  <select
                    value={formData.section || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent font-medium"
                  >
                    <option value="">Select Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                  {formErrors.section && (
                    <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.section}</p>
                  )}
                </div>

                {/* Academic Year */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    Academic Year *
                  </label>
                  <select
                    value={formData.academic_year || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, academic_year: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent font-medium"
                  >
                    <option value="">Select Academic Year</option>
                    {academicYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {formErrors.academic_year && (
                    <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.academic_year}</p>
                  )}
                </div>

                {/* Capacity */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Users className="h-4 w-4 mr-2" />
                    Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent font-medium"
                    placeholder="Maximum number of students"
                  />
                  {formErrors.capacity && (
                    <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.capacity}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Info className="h-4 w-4 mr-2" />
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent font-medium"
                    placeholder="Optional class description"
                  />
                </div>

                {/* Status (for edit mode) */}
                {showEditModal && (
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Status
                    </label>
                    <select
                      value={formData.status || 'active'}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                      className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent font-medium"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                )}
              </form>
            </div>

            {/* Fixed Footer with Actions */}
            <div className="flex-shrink-0 flex items-center justify-end space-x-3 p-6 pt-4 border-t border-gray-200 bg-white/95 rounded-b-2xl">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  resetForm();
                }}
                className="px-6 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                onClick={handleSubmit}
                className="px-8 py-3 bg-gradient-to-r from-[#1E88E5] to-[#5B9FFF] text-white rounded-xl hover:from-[#1976D2] hover:to-[#4A8FEE] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-semibold transition-all duration-200 transform hover:scale-105"
              >
                {submitting && <Loader className="h-4 w-4 animate-spin" />}
                <span>{submitting ? 'Saving...' : (showEditModal ? 'Update Class' : 'Create Class')}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedClass && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md w-full p-8"
          >
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-6">
                <Trash className="h-8 w-8 text-red-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Delete Class
              </h3>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete{' '}
                  <span className="font-semibold text-gray-900">Class {selectedClass.class_name}-{selectedClass.section}</span>?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-800 text-sm font-medium flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    This action cannot be undone
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedClass(null);
                  }}
                  disabled={submitting}
                  className="px-6 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={submitting}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  {submitting && <Loader className="h-4 w-4 animate-spin" />}
                  <Trash className="h-4 w-4" />
                  <span>{submitting ? 'Deleting...' : 'Delete Class'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
