import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ExamResult, StudentReport, GradeScale, Student } from '../../types/results';
import { ExamSchedule } from '../../types/Exam';
import ResultsList from '../../components/exams/ResultsList';
import ResultForm from '../../components/exams/ResultForm';
import ReportCard from '../../components/exams/ReportCard';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  FileText, 
  Plus, 
  Search, 
  Filter,
  BarChart3,
  Users,
  TrendingUp,
  Award,
  ChevronDown,
  Sparkles,
  Target,
  Activity
} from 'lucide-react';


const ResultsPage: React.FC = () => {
  // State for data
  const [results, setResults] = useState<ExamResult[]>([]);
  const [reports, setReports] = useState<StudentReport[]>([]);
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeScales, setGradeScales] = useState<GradeScale[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for UI
  const [showForm, setShowForm] = useState(false);
  const [editingResult, setEditingResult] = useState<ExamResult | null>(null);
  const [viewMode, setViewMode] = useState<'results' | 'reports'>('results');
  const [searchTerm, setSearchTerm] = useState('');
  const [examFilter, setExamFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [filtersExpanded, setFiltersExpanded] = useState(false);


  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch results with related data
      const { data: resultsData, error: resultsError } = await supabase
        .from('exam_results')
        .select(`
          *,
          exam_schedules (
            exam_name,
            exam_date,
            max_marks,
            subjects (
              subject_name,
              subject_code
            )
          ),
          students (
            full_name,
            roll_number,
            profile_picture
          )
        `)
        .order('created_at', { ascending: false });


      if (resultsError) throw resultsError;


      // Fetch reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('student_reports')
        .select(`
          *,
          students (
            full_name,
            roll_number
          ),
          classes (
            class_name,
            section,
            academic_year
          )
        `)
        .order('generated_at', { ascending: false });


      if (reportsError) throw reportsError;


      // Fetch exams
      const { data: examsData, error: examsError } = await supabase
        .from('exam_schedules')
        .select(`
          *,
          subjects (
            subject_name,
            subject_code
          ),
          classes (
            class_name,
            section
          )
        `)
        .order('exam_date', { ascending: false });


      if (examsError) throw examsError;


      // Fetch students
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('id, full_name, roll_number, class_id, status,profile_picture')
        .eq('status', 'active')
        .order('full_name');


      if (studentsError) throw studentsError;


      // Fetch grade scales
      const { data: gradeScalesData, error: gradeScalesError } = await supabase
        .from('grade_scales')
        .select('*')
        .eq('status', 'active')
        .order('min_percentage', { ascending: false });


      if (gradeScalesError) throw gradeScalesError;


      setResults(resultsData || []);
      setReports(reportsData || []);
      setExams(examsData || []);
      setStudents(studentsData || []);
      setGradeScales(gradeScalesData || []);


    } catch (error: unknown) {
      console.error('Error fetching data:', error);
      let errorMessage = 'Failed to load data';
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      alert(`Error loading data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };


  const calculateGrade = (percentage: number): string => {
    const grade = gradeScales.find(scale => 
      percentage >= scale.min_percentage && percentage <= scale.max_percentage
    );
    return grade?.grade || 'F';
  };


  const handleCreateResult = async (bulkData: any[]) => {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .insert(bulkData.map(result => ({
          ...result,
          evaluated_at: new Date().toISOString()
        })))
        .select(`
          *,
          exam_schedules (
            exam_name,
            exam_date,
            max_marks,
            subjects (
              subject_name,
              subject_code
            )
          ),
          students (
            full_name,
            roll_number
          )
        `);


      if (error) throw error;


      if (data) {
        setResults([...data, ...results]);
        setShowForm(false);
      }
    } catch (error: unknown) {
      console.error('Error creating results:', error);
      let errorMessage = 'Failed to create results';
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      alert(`Error creating results: ${errorMessage}`);
    }
  };


  const handleUpdateResult = async (id: string, formData: any) => {
    try {
      const exam = exams.find(e => e.id === formData.exam_id);
      const maxMarks = exam?.max_marks || 100;
      const percentage = (formData.marks_obtained / maxMarks) * 100;
      const grade = calculateGrade(percentage);
      const status = percentage >= 35 ? 'pass' : 'fail';


      const { data, error } = await supabase
        .from('exam_results')
        .update({
          ...formData,
          percentage,
          grade,
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          exam_schedules (
            exam_name,
            exam_date,
            max_marks,
            subjects (
              subject_name,
              subject_code
            )
          ),
          students (
            full_name,
            roll_number
          )
        `);


      if (error) throw error;


      if (data) {
        setResults(results.map(result => result.id === id ? data[0] : result));
        setEditingResult(null);
      }
    } catch (error: unknown) {
      console.error('Error updating result:', error);
      let errorMessage = 'Failed to update result';
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      alert(`Error updating result: ${errorMessage}`);
    }
  };


  const handleDeleteResult = async (id: string) => {
    if (!confirm('Are you sure you want to delete this result?')) return;


    try {
      const { error } = await supabase
        .from('exam_results')
        .delete()
        .eq('id', id);


      if (error) throw error;


      setResults(results.filter(result => result.id !== id));
    } catch (error: unknown) {
      console.error('Error deleting result:', error);
      let errorMessage = 'Failed to delete result';
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      alert(`Error deleting result: ${errorMessage}`);
    }
  };


  // Filter results
  const filteredResults = results.filter(result => {
    const matchesSearch = searchTerm === '' || 
      result.students?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.students?.roll_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.exam_schedules?.exam_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesExam = examFilter === 'all' || result.exam_id === examFilter;

    return matchesSearch && matchesExam;
  });


  // Calculate statistics
  const stats = {
    totalResults: results.length,
    passed: results.filter(r => r.status === 'pass').length,
    failed: results.filter(r => r.status === 'fail').length,
    pending: results.filter(r => r.status === 'pending').length,
    averagePercentage: results.length > 0 
      ? results.reduce((sum, r) => sum + r.percentage, 0) / results.length 
      : 0
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
            <BarChart3 className="absolute inset-0 m-auto w-6 h-6 text-blue-500" />
          </div>
          <div className="text-center">
            <h3 
              className="text-gray-900"
              style={{ fontSize: '18px', fontWeight: 600 }}
            >
              Loading Results
            </h3>
            <p className="text-gray-600 mt-1" style={{ fontSize: '14px' }}>
              Please wait while we fetch your data...
            </p>
          </div>
        </div>
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
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
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
                Results Management
              </h1>
              <p 
                className="text-gray-600 mt-1" 
                style={{ fontSize: '15px', fontWeight: 400 }}
              >
                Manage exam results and generate comprehensive reports
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="px-6 py-2.5 gradient-primary text-white rounded-xl flex items-center gap-2 font-medium shadow-soft hover:shadow-float transition-all duration-200"
            style={{ fontSize: '14px' }}
          >
            <Plus size={20} />
            <span>Add Results</span>
          </motion.button>
        </motion.div>


        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Total Results Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-[14px] bg-blue-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <Sparkles size={16} className="text-blue-500" />
            </div>
            <p 
              className="text-gray-900 mb-1"
              style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
            >
              {stats.totalResults}
            </p>
            <p className="text-gray-600" style={{ fontSize: '15px', fontWeight: 500 }}>
              Total Results
            </p>
            <div className="mt-3 text-emerald-600 text-xs font-medium">
              +12% this month
            </div>
          </motion.div>


          {/* Passed Results Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-[14px] bg-emerald-50 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-emerald-600" />
              </div>
              <Target size={16} className="text-emerald-500" />
            </div>
            <p 
              className="text-gray-900 mb-1"
              style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
            >
              {stats.passed}
            </p>
            <p className="text-gray-600" style={{ fontSize: '15px', fontWeight: 500 }}>
              Passed
            </p>
            <div className="mt-3 text-emerald-600 text-xs font-medium">
              {stats.totalResults > 0 ? Math.round((stats.passed / stats.totalResults) * 100) : 0}% pass rate
            </div>
          </motion.div>


          {/* Failed Results Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-[14px] bg-red-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <Activity size={16} className="text-red-500" />
            </div>
            <p 
              className="text-gray-900 mb-1"
              style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
            >
              {stats.failed}
            </p>
            <p className="text-gray-600" style={{ fontSize: '15px', fontWeight: 500 }}>
              Failed
            </p>
            <div className="mt-3 text-red-600 text-xs font-medium">
              Need attention
            </div>
          </motion.div>


          {/* Pending Results Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-[14px] bg-amber-50 flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
            <p 
              className="text-gray-900 mb-1"
              style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
            >
              {stats.pending}
            </p>
            <p className="text-gray-600" style={{ fontSize: '15px', fontWeight: 500 }}>
              Pending
            </p>
            <div className="mt-3 text-amber-600 text-xs font-medium">
              In progress
            </div>
          </motion.div>


          {/* Average Percentage Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-[14px] bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p 
              className="text-gray-900 mb-1"
              style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
            >
              {stats.averagePercentage.toFixed(1)}%
            </p>
            <p className="text-gray-600" style={{ fontSize: '15px', fontWeight: 500 }}>
              Average Score
            </p>
            <div className="mt-3 text-blue-600 text-xs font-medium">
              Class average
            </div>
          </motion.div>
        </div>


        {/* Filters Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-[12px] flex items-center justify-center">
                  <Filter className="w-5 h-5 text-blue-500" />
                </div>
                <h3 
                  className="text-gray-900"
                  style={{ fontSize: '16px', fontWeight: 600 }}
                >
                  Search & Filters
                </h3>
              </div>
              <button
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span style={{ fontSize: '14px' }}>Filters</span>
                <ChevronDown 
                  size={16} 
                  className={`transform transition-transform ${filtersExpanded ? 'rotate-180' : ''}`} 
                />
              </button>
            </div>
          </div>
          
          <div className={`p-6 ${filtersExpanded ? 'block' : 'hidden lg:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label 
                  className="block text-gray-700 mb-2"
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  Search Students
                </label>
                <div className="relative">
                  <Search 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                    size={18} 
                  />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 placeholder-gray-400"
                    style={{ fontSize: '14px', fontWeight: 500 }}
                  />
                </div>
              </div>


              {/* Exam Filter */}
              <div>
                <label 
                  className="block text-gray-700 mb-2"
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  Filter by Exam
                </label>
                <select
                  value={examFilter}
                  onChange={(e) => setExamFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                >
                  <option value="all">All Exams</option>
                  {exams.map(exam => (
                    <option key={exam.id} value={exam.id}>
                      {exam.exam_name} - {exam.subjects?.subject_name}
                    </option>
                  ))}
                </select>
              </div>


              {/* Student Filter */}
              <div>
                <label 
                  className="block text-gray-700 mb-2"
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  Filter by Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                >
                  <option value="">All Students</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.full_name} ({student.roll_number})
                    </option>
                  ))}
                </select>
              </div>


              {/* View Mode Toggle */}
              <div>
                <label 
                  className="block text-gray-700 mb-2"
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  View Mode
                </label>
                <div className="flex rounded-xl overflow-hidden bg-gray-50 border border-gray-200 p-1">
                  <button
                    onClick={() => setViewMode('results')}
                    className={`flex-1 px-4 py-2 flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ${
                      viewMode === 'results'
                        ? 'gradient-primary text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                    }`}
                    style={{ fontSize: '14px' }}
                  >
                    <BarChart3 size={16} />
                    Results
                  </button>
                  <button
                    onClick={() => setViewMode('reports')}
                    className={`flex-1 px-4 py-2 flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ${
                      viewMode === 'reports'
                        ? 'gradient-primary text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                    }`}
                    style={{ fontSize: '14px' }}
                  >
                    <FileText size={16} />
                    Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>


        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden"
        >
          {viewMode === 'results' ? (
            <ResultsList
              results={filteredResults}
              onEditResult={setEditingResult}
              onDeleteResult={handleDeleteResult}
            />
          ) : (
            <ReportCard
              reports={reports}
              selectedStudent={selectedStudent}
              students={students}
            />
          )}
        </motion.div>


        {/* Form Modal */}
        {(showForm || editingResult) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[24px] shadow-float max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              <ResultForm
                exams={exams}
                students={students}
                gradeScales={gradeScales}
                initialData={editingResult}
                onSubmit={editingResult ? 
                  (data) => handleUpdateResult(editingResult.id, data) : 
                  handleCreateResult
                }
                onClose={() => {
                  setShowForm(false);
                  setEditingResult(null);
                }}
              />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};


export default ResultsPage;
