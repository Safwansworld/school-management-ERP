import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  MapPin, 
  FileText, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ChevronRight,
  Users,
  Calendar as CalendarIcon
} from 'lucide-react';

interface ExamSchedule {
  id: string;
  exam_name: string;
  exam_type: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  room_number: string;
  max_marks: number;
  passing_marks: number;
  instructions: string;
  syllabus_coverage: string;
  status: string;
  class_id: string;
  subjects?: {
    subject_name: string;
    subject_code: string;
  };
  classes?: {
    id: string;
    class_name: string;
    section: string;
  };
  student_info?: {
    student_name: string;
    student_id: string;
  };
}

interface LinkedStudent {
  student_id: string;
  full_name: string;
  class_id: string;
  class_name: string;
}

const ParentExamView: React.FC = () => {
  const { user } = useAuth();
  const [linkedStudents, setLinkedStudents] = useState<LinkedStudent[]>([]);
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [studentFilter, setStudentFilter] = useState<string>('all');
  const [selectedExam, setSelectedExam] = useState<ExamSchedule | null>(null);

  useEffect(() => {
    fetchLinkedStudentsAndExams();
  }, [user]);

  const fetchLinkedStudentsAndExams = async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Get all linked student_ids from parent_student_links
      const { data: links, error: linkError } = await supabase
        .from('parent_student_links')
        .select('student_id')
        .eq('parent_id', user?.id);

      if (linkError) {
        throw linkError;
      }

      if (!links || links.length === 0) {
        setError('No students linked to your account. Please contact administration.');
        setLoading(false);
        return;
      }

      const studentIds = links.map(link => link.student_id);

      // Step 2: Get student profiles
      const { data: studentProfiles, error: profileError } = await supabase
        .from('student_profiles')
        .select('id, student_id, full_name')
        .in('student_id', studentIds);

      if (profileError) {
        throw profileError;
      }

      if (!studentProfiles || studentProfiles.length === 0) {
        setError('Could not find student profiles. Please contact administration.');
        setLoading(false);
        return;
      }

      // Step 3: Get class assignments
      const { data: classAssignments, error: assignmentError } = await supabase
        .from('class_assignments')
        .select('student_id, class_id, class_name, academic_year')
        .in('student_id', studentIds)
        .order('assigned_at', { ascending: false });

      if (assignmentError) {
        throw assignmentError;
      }

      if (!classAssignments || classAssignments.length === 0) {
        setError('None of your children are assigned to classes yet. Please contact administration.');
        setLoading(false);
        return;
      }

      // Step 4: Build linked students array
      const studentsWithClasses: LinkedStudent[] = studentProfiles.map(profile => {
        const assignment = classAssignments.find(a => a.student_id === profile.student_id);
        return {
          student_id: profile.student_id,
          full_name: profile.full_name,
          class_id: assignment?.class_id || '',
          class_name: assignment?.class_name || 'Not assigned'
        };
      }).filter(s => s.class_id);

      setLinkedStudents(studentsWithClasses);

      // Step 5: Get unique class IDs
      const classIds = [...new Set(studentsWithClasses.map(s => s.class_id))];

      if (classIds.length === 0) {
        setExams([]);
        setLoading(false);
        return;
      }

      // Step 6: Fetch exams
      const { data: examData, error: examError } = await supabase
        .from('exam_schedules')
        .select(`
          *,
          subjects:subject_id (
            subject_name,
            subject_code
          ),
          classes:class_id (
            id,
            class_name,
            section
          )
        `)
        .in('class_id', classIds)
        .order('exam_date', { ascending: true });

      if (examError) {
        throw examError;
      }

      // Step 7: Map exams to students
      const examsWithStudentInfo = examData?.map(exam => {
        const student = studentsWithClasses.find(s => s.class_id === exam.class_id);
        return {
          ...exam,
          student_info: student ? {
            student_name: student.full_name,
            student_id: student.student_id
          } : undefined
        };
      }) || [];

      setExams(examsWithStudentInfo);

    } catch (err: any) {
      console.error('Error fetching parent exams:', err);
      setError(err.message || 'Failed to load exam schedules');
    } finally {
      setLoading(false);
    }
  };

  // Filter exams
  const filteredExams = exams.filter(exam => {
    const matchesSearch = searchTerm === '' || 
      exam.exam_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subjects?.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.student_info?.student_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    const matchesStudent = studentFilter === 'all' || exam.student_info?.student_id === studentFilter;

    return matchesSearch && matchesStatus && matchesStudent;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'in_progress': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      case 'postponed': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'postponed': return <AlertCircle className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
            <CalendarIcon className="absolute inset-0 m-auto w-6 h-6 text-blue-500" />
          </div>
          <p 
            className="text-gray-600"
            style={{ fontSize: '15px', fontWeight: 500 }}
          >
            Loading exam schedules...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[20px] p-8 shadow-soft border border-red-200 max-w-md"
        >
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 
              className="text-gray-900 mb-2"
              style={{ fontSize: '18px', fontWeight: 600 }}
            >
              Error Loading Exams
            </h3>
            <p 
              className="text-gray-600 mb-4"
              style={{ fontSize: '14px' }}
            >
              {error}
            </p>
            <button
              onClick={() => fetchLinkedStudentsAndExams()}
              className="px-6 py-2.5 gradient-primary text-white font-medium rounded-xl shadow-soft hover:shadow-float transition-all"
              style={{ fontSize: '14px' }}
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F9FC] p-8">
      <div className="max-w-[1600px] mx-auto space-y-7">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 
            className="text-gray-900"
            style={{ 
              fontSize: '32px', 
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}
          >
            Children's Exam Schedule
          </h1>
          <p 
            className="text-gray-600 mt-2" 
            style={{ fontSize: '15px', fontWeight: 400 }}
          >
            View exam schedules for all your children
          </p>
        </motion.div>

        {/* Linked Students Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {linkedStudents.map((student, index) => {
            const studentExams = exams.filter(e => e.student_info?.student_id === student.student_id);
            const upcomingCount = studentExams.filter(e => 
              e.status === 'scheduled' && new Date(e.exam_date) >= new Date()
            ).length;

            return (
              <motion.div 
                key={student.student_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-[14px] flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium border border-blue-200" style={{ fontSize: '12px' }}>
                    {upcomingCount} upcoming
                  </span>
                </div>
                <h3 
                  className="text-gray-900 mb-1"
                  style={{ fontSize: '18px', fontWeight: 600 }}
                >
                  {student.full_name}
                </h3>
                <p 
                  className="text-gray-600"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                >
                  {student.class_name}
                </p>
              </motion.div>
            );
            
          })}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-blue-50 rounded-[16px] flex items-center justify-center">
                <Calendar className="w-7 h-7 text-blue-500" />
              </div>
            </div>
            <p 
              className="text-blue-600 mb-1"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              Total Exams
            </p>
            <p 
              className="text-gray-900"
              style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
            >
              {exams.length}
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-amber-50 rounded-[16px] flex items-center justify-center">
                <Clock className="w-7 h-7 text-amber-600" />
              </div>
            </div>
            <p 
              className="text-amber-600 mb-1"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              Upcoming
            </p>
            <p 
              className="text-gray-900"
              style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
            >
              {exams.filter(e => e.status === 'scheduled' && new Date(e.exam_date) >= new Date()).length}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-[16px] flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
            <p 
              className="text-emerald-600 mb-1"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              Completed
            </p>
            <p 
              className="text-gray-900"
              style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
            >
              {exams.filter(e => e.status === 'completed').length}
            </p>
          </motion.div>
        </div>


        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
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

            {/* Student Filter */}
            <div className="relative">
              <select
                value={studentFilter}
                onChange={(e) => setStudentFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 appearance-none cursor-pointer"
                style={{ fontSize: '14px', fontWeight: 500 }}
              >
                <option value="all">All Children</option>
                {linkedStudents.map(student => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.full_name}
                  </option>
                ))}
              </select>
              <Users className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
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
          </div>
        </motion.div>

        {/* Exams List */}
        <AnimatePresence mode="wait">
          {filteredExams.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[20px] p-12 shadow-soft border border-gray-100 text-center"
            >
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 
                className="text-gray-900 mb-2"
                style={{ fontSize: '18px', fontWeight: 600 }}
              >
                No Exams Found
              </h3>
              <p 
                className="text-gray-600"
                style={{ fontSize: '14px' }}
              >
                {searchTerm || statusFilter !== 'all' || studentFilter !== 'all'
                  ? 'Try adjusting your filters' 
                  : 'No exams scheduled yet'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredExams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedExam(exam)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-[14px] flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-purple-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 
                              className="text-gray-900"
                              style={{ fontSize: '18px', fontWeight: 600 }}
                            >
                              {exam.exam_name}
                            </h3>
                            <span className={`px-3 py-1 rounded-lg font-medium border flex items-center gap-1 ${getStatusColor(exam.status)}`} style={{ fontSize: '12px' }}>
                              {getStatusIcon(exam.status)}
                              {exam.status.replace('_', ' ').toUpperCase()}
                            </span>
                            {exam.student_info && (
                              <span className="px-3 py-1 rounded-lg font-medium bg-purple-50 text-purple-700 border border-purple-200" style={{ fontSize: '12px' }}>
                                👤 {exam.student_info.student_name}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <BookOpen className="w-4 h-4 text-gray-400" />
                              <span style={{ fontSize: '14px', fontWeight: 500 }}>
                                {exam.subjects?.subject_name || 'Subject'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span style={{ fontSize: '14px', fontWeight: 500 }}>
                                {formatDate(exam.exam_date)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span style={{ fontSize: '14px', fontWeight: 500 }}>
                                {formatTime(exam.start_time)} - {formatTime(exam.end_time)}
                              </span>
                            </div>

                            {exam.room_number && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span style={{ fontSize: '14px', fontWeight: 500 }}>
                                  Room {exam.room_number}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-6 mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500" style={{ fontSize: '13px' }}>Class:</span>
                              <span className="text-gray-900" style={{ fontSize: '14px', fontWeight: 700 }}>
                                {exam.classes?.class_name || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500" style={{ fontSize: '13px' }}>Max Marks:</span>
                              <span className="text-gray-900" style={{ fontSize: '14px', fontWeight: 700 }}>{exam.max_marks}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500" style={{ fontSize: '13px' }}>Duration:</span>
                              <span className="text-gray-900" style={{ fontSize: '14px', fontWeight: 700 }}>{exam.duration_minutes} mins</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Exam Detail Modal */}
        <AnimatePresence>
          {selectedExam && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedExam(null)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-float"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-[24px] z-10">
                  <div className="flex items-center justify-between">
                    <h2 
                      className="text-gray-900"
                      style={{ fontSize: '20px', fontWeight: 600 }}
                    >
                      Exam Details
                    </h2>
                    <button
                      onClick={() => setSelectedExam(null)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {selectedExam.student_info && (
                    <div className="bg-purple-50 rounded-[16px] p-4 border border-purple-200">
                      <div className="flex items-center gap-2 text-purple-700">
                        <Users className="w-4 h-4" />
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>
                          Student: {selectedExam.student_info.student_name}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 
                      className="text-gray-900 mb-2"
                      style={{ fontSize: '24px', fontWeight: 600 }}
                    >
                      {selectedExam.exam_name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg font-medium border flex items-center gap-1 ${getStatusColor(selectedExam.status)}`} style={{ fontSize: '12px' }}>
                        {getStatusIcon(selectedExam.status)}
                        {selectedExam.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="px-3 py-1 rounded-lg font-medium bg-purple-50 text-purple-700 border border-purple-200 capitalize" style={{ fontSize: '12px' }}>
                        {selectedExam.exam_type}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-[16px] p-4 border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <BookOpen className="w-4 h-4" />
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>Subject</span>
                      </div>
                      <p 
                        className="text-gray-900"
                        style={{ fontSize: '15px', fontWeight: 600 }}
                      >
                        {selectedExam.subjects?.subject_name || 'N/A'}
                      </p>
                      {selectedExam.subjects?.subject_code && (
                        <p className="text-gray-500" style={{ fontSize: '12px' }}>
                          {selectedExam.subjects.subject_code}
                        </p>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-[16px] p-4 border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>Date</span>
                      </div>
                      <p 
                        className="text-gray-900"
                        style={{ fontSize: '15px', fontWeight: 600 }}
                      >
                        {formatDate(selectedExam.exam_date)}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-[16px] p-4 border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Clock className="w-4 h-4" />
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>Time</span>
                      </div>
                      <p 
                        className="text-gray-900"
                        style={{ fontSize: '15px', fontWeight: 600 }}
                      >
                        {formatTime(selectedExam.start_time)} - {formatTime(selectedExam.end_time)}
                      </p>
                      <p className="text-gray-500" style={{ fontSize: '12px' }}>
                        Duration: {selectedExam.duration_minutes} minutes
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-[16px] p-4 border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>Room</span>
                      </div>
                      <p 
                        className="text-gray-900"
                        style={{ fontSize: '15px', fontWeight: 600 }}
                      >
                        {selectedExam.room_number || 'TBA'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-[16px] p-4 border border-blue-200">
                      <p className="text-blue-600 mb-1" style={{ fontSize: '13px', fontWeight: 500 }}>Max Marks</p>
                      <p className="text-blue-700" style={{ fontSize: '24px', fontWeight: 700 }}>{selectedExam.max_marks}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-[16px] p-4 border border-emerald-200">
                      <p className="text-emerald-600 mb-1" style={{ fontSize: '13px', fontWeight: 500 }}>Passing Marks</p>
                      <p className="text-emerald-700" style={{ fontSize: '24px', fontWeight: 700 }}>{selectedExam.passing_marks}</p>
                    </div>
                    <div className="bg-purple-50 rounded-[16px] p-4 border border-purple-200">
                      <p className="text-purple-600 mb-1" style={{ fontSize: '13px', fontWeight: 500 }}>Duration</p>
                      <p className="text-purple-700" style={{ fontSize: '24px', fontWeight: 700 }}>{selectedExam.duration_minutes}m</p>
                    </div>
                  </div>

                  {selectedExam.syllabus_coverage && (
                    <div className="bg-amber-50 rounded-[16px] p-4 border border-amber-200">
                      <div className="flex items-center gap-2 text-amber-700 mb-2">
                        <FileText className="w-4 h-4" />
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>Syllabus Coverage</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap" style={{ fontSize: '14px' }}>
                        {selectedExam.syllabus_coverage}
                      </p>
                    </div>
                  )}

                  {selectedExam.instructions && (
                    <div className="bg-blue-50 rounded-[16px] p-4 border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-700 mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>Instructions</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap" style={{ fontSize: '14px' }}>
                        {selectedExam.instructions}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ParentExamView;
