import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ExamSchedule, Subject, Class, ExamFormData } from '../../types/Exam'
import ExamForm from './ExamForm';
import ExamCalendar from './ExamCalendar';
import ExamList from './ExamList';
import { 
  Calendar, 
  Clock, 
  List, 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Users, 
  Calendar as CalendarIcon,
  CheckCircle,
  Play,
  XCircle,
  Pause,
  ClockIcon
} from 'lucide-react';


const ExamScheduling: React.FC = () => {
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamSchedule | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');


  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { data: examData, error: examError } = await supabase
        .from('exam_schedules')
        .select(`
          *,
          subjects!subject_id (
            subject_name,
            subject_code,
            description,
            class_level,
            credits
          ),
          classes!class_id (
            class_name,
            section,
            academic_year,
            capacity,
            current_strength
          )
        `)
        .order('exam_date', { ascending: true });


      if (examError) throw examError;


      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('*')
        .eq('status', 'active')
        .order('subject_name');


      if (subjectError) throw subjectError;


      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('status', 'active')
        .order('class_name', { ascending: true });


      if (classError) throw classError;


      setExams(examData || []);
      setSubjects(subjectData || []);
      setClasses(classData || []);
      
    } catch (error: unknown) {
      console.error('Error fetching data:', error);
      
      let errorMessage = 'Failed to load data';
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(`Error loading data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };


  const handleCreateExam = async (formData: ExamFormData) => {
    try {
      const { data, error } = await supabase
        .from('exam_schedules')
        .insert([formData])
        .select(`
          *,
          subjects (
            subject_name,
            subject_code,
            description,
            class_level,
            credits
          ),
          classes (
            class_name,
            section,
            academic_year,
            capacity,
            current_strength
          )
        `);


      if (error) throw error;


      if (data) {
        setExams([...exams, ...data]);
        setShowForm(false);
      }
    } catch (error: unknown) {
      console.error('Error creating exam:', error);
      
      let errorMessage = 'Failed to create exam';
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(`Error creating exam: ${errorMessage}`);
    }
  };


  const handleUpdateExam = async (id: string, formData: ExamFormData) => {
    try {
      const { data, error } = await supabase
        .from('exam_schedules')
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(`
          *,
          subjects (
            subject_name,
            subject_code,
            description,
            class_level,
            credits
          ),
          classes (
            class_name,
            section,
            academic_year,
            capacity,
            current_strength
          )
        `);


      if (error) throw error;


      if (data) {
        setExams(exams.map(exam => exam.id === id ? data[0] : exam));
        setEditingExam(null);
      }
    } catch (error: unknown) {
      console.error('Error updating exam:', error);
      
      let errorMessage = 'Failed to update exam';
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(`Error updating exam: ${errorMessage}`);
    }
  };


  const handleDeleteExam = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;


    try {
      const { error } = await supabase
        .from('exam_schedules')
        .delete()
        .eq('id', id);


      if (error) throw error;


      setExams(exams.filter(exam => exam.id !== id));
    } catch (error) {
      console.error('Error deleting exam:', error);
      alert('Error deleting exam. Please try again.');
    }
  };


  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <ClockIcon className="w-4 h-4" />;
      case 'in_progress':
        return <Play className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'postponed':
        return <Pause className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };


  // Filter exams based on search and filters
  const filteredExams = exams.filter(exam => {
    const matchesSearch = searchTerm === '' || 
      exam.exam_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subjects?.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.classes?.class_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    const matchesClass = classFilter === 'all' || exam.class_id === classFilter;


    return matchesSearch && matchesStatus && matchesClass;
  });


  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
            <CalendarIcon className="absolute inset-0 m-auto w-6 h-6 text-blue-500" />
          </div>
          <p className="text-gray-600 font-medium" style={{ fontSize: '15px' }}>
            Loading exam schedules...
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#F6F9FC] p-8">
      <div className="max-w-[1600px] mx-auto space-y-7">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="text-gray-900"
              style={{ 
                fontSize: '32px', 
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              Exam Scheduling
            </h1>
            <p 
              className="text-gray-600 mt-2" 
              style={{ fontSize: '15px', fontWeight: 400 }}
            >
              Manage and schedule examinations for all classes
            </p>
          </div>
          
          {/* Action Button */}
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2.5 gradient-primary text-white font-medium rounded-xl shadow-soft hover:shadow-float transition-all duration-200 flex items-center gap-2"
            style={{ fontSize: '14px' }}
          >
            <Plus className="w-5 h-5" />
            <span>Schedule New Exam</span>
          </button>
        </div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-[16px] flex items-center justify-center">
                <Calendar className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <p 
                  className="text-gray-900"
                  style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
                >
                  {exams.length}
                </p>
                <p className="text-gray-600" style={{ fontSize: '15px', fontWeight: 500 }}>
                  Total Exams
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-[16px] flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <p 
                  className="text-gray-900"
                  style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
                >
                  {subjects.length}
                </p>
                <p className="text-gray-600" style={{ fontSize: '15px', fontWeight: 500 }}>
                  Active Subjects
                </p>
              </div>
            </div>
          </div>


          <div className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-[16px] flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <p 
                  className="text-gray-900"
                  style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
                >
                  {classes.length}
                </p>
                <p className="text-gray-600" style={{ fontSize: '15px', fontWeight: 500 }}>
                  Active Classes
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Filters Section */}
        <div className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search */}
            <div className="relative group">
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" 
                size={18} 
              />
              <input
                type="text"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 placeholder-gray-400"
                style={{ fontSize: '14px', fontWeight: 500 }}
              />
            </div>


            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 appearance-none cursor-pointer"
                style={{ fontSize: '14px', fontWeight: 500 }}
              >
                <option value="all">All Status</option>
                <option value="scheduled">⏰ Scheduled</option>
                <option value="in_progress">▶️ In Progress</option>
                <option value="completed">✅ Completed</option>
                <option value="cancelled">❌ Cancelled</option>
                <option value="postponed">⏸️ Postponed</option>
              </select>
              <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>


            {/* Class Filter */}
            <div className="relative">
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 appearance-none cursor-pointer"
                style={{ fontSize: '14px', fontWeight: 500 }}
              >
                <option value="all">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_name} - {cls.section} ({cls.academic_year})
                  </option>
                ))}
              </select>
              <Users className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>


            {/* View Mode Toggle */}
            <div className="flex rounded-xl overflow-hidden bg-gray-50 border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex-1 px-4 py-2 flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'calendar'
                    ? 'gradient-primary text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
                style={{ fontSize: '14px' }}
              >
                <Calendar size={16} />
                <span className="hidden sm:inline">Calendar</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-4 py-2 flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'gradient-primary text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
                style={{ fontSize: '14px' }}
              >
                <List size={16} />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>


        {/* Content Area */}
        <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden">
          {viewMode === 'calendar' ? (
            <ExamCalendar
              exams={filteredExams}
              onEditExam={setEditingExam}
              onDeleteExam={handleDeleteExam}
            />
          ) : (
            <ExamList
              exams={filteredExams}
              onEditExam={setEditingExam}
              onDeleteExam={handleDeleteExam}
            />
          )}
        </div>


        {/* Form Modal */}
        {(showForm || editingExam) && (
          <ExamForm
            subjects={subjects}
            classes={classes}
            initialData={editingExam}
            onSubmit={editingExam ? 
              (data) => handleUpdateExam(editingExam.id, data) : 
              handleCreateExam
            }
            onClose={() => {
              setShowForm(false);
              setEditingExam(null);
            }}
          />
        )}
      </div>
    </div>
  );
};


export default ExamScheduling;
