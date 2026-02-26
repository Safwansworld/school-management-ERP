import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExamResult } from '../../types/results';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Trophy, 
  XCircle, 
  Clock, 
  CheckCircle, 
  Calendar, 
  User, 
  BookOpen, 
  Target, 
  Award, 
  ChevronRight, 
  Star, 
  TrendingUp, 
  FileText, 
  X,
  Activity
} from 'lucide-react';

interface ResultsListProps {
  results: ExamResult[];
  onEditResult: (result: ExamResult) => void;
  onDeleteResult: (resultId: string) => void;
}

const ResultsList: React.FC<ResultsListProps> = ({ results, onEditResult, onDeleteResult }) => {
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'fail':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'absent':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle size={14} className="text-emerald-600" />;
      case 'fail':
        return <XCircle size={14} className="text-red-600" />;
      case 'absent':
        return <Clock size={14} className="text-gray-600" />;
      case 'pending':
        return <Clock size={14} className="text-amber-600" />;
      default:
        return <Clock size={14} className="text-gray-600" />;
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
        return 'bg-blue-500 text-white shadow-sm';
      case 'A':
        return 'bg-blue-400 text-white shadow-sm';
      case 'B+':
        return 'bg-cyan-500 text-white shadow-sm';
      case 'B':
        return 'bg-emerald-500 text-white shadow-sm';
      case 'C':
        return 'bg-amber-500 text-white shadow-sm';
      case 'C-':
        return 'bg-orange-500 text-white shadow-sm';
      case 'D':
        return 'bg-red-500 text-white shadow-sm';
      case 'F':
        return 'bg-red-600 text-white shadow-sm';
      default:
        return 'bg-gray-500 text-white shadow-sm';
    }
  };

  const getPerformanceIndicator = (percentage: number) => {
    if (percentage >= 90) return { color: 'text-blue-600', icon: <Star size={14} />, label: 'Excellent' };
    if (percentage >= 80) return { color: 'text-cyan-600', icon: <TrendingUp size={14} />, label: 'Very Good' };
    if (percentage >= 70) return { color: 'text-emerald-600', icon: <Target size={14} />, label: 'Good' };
    if (percentage >= 50) return { color: 'text-amber-600', icon: <Award size={14} />, label: 'Average' };
    return { color: 'text-red-600', icon: <XCircle size={14} />, label: 'Needs Improvement' };
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedResults = useMemo(() => {
    if (!sortConfig) return results;

    return [...results].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case 'student':
          aValue = a.students?.full_name;
          bValue = b.students?.full_name;
          break;
        case 'percentage':
          aValue = a.percentage;
          bValue = b.percentage;
          break;
        case 'marks':
          aValue = a.marks_obtained;
          bValue = b.marks_obtained;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [results, sortConfig]);

  return (
    <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-[14px] flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 
                className="text-gray-900"
                style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.015em' }}
              >
                Exam Results
              </h2>
              <p className="text-gray-600 mt-1" style={{ fontSize: '14px' }}>
                {results.length} {results.length === 1 ? 'result' : 'results'} found
              </p>
            </div>
          </div>

          {results.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-emerald-600">
                  {results.filter(r => r.status === 'pass').length} Passed
                </span>
                {' • '}
                <span className="font-semibold text-red-600">
                  {results.filter(r => r.status === 'fail').length} Failed
                </span>
                {' • '}
                <span className="font-semibold text-amber-600">
                  {results.filter(r => r.status === 'pending').length} Pending
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="px-8 py-6">
        {results.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-blue-50 rounded-[20px] flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-blue-500" />
            </div>
            <h3 
              className="text-gray-900 mb-3"
              style={{ fontSize: '20px', fontWeight: 600 }}
            >
              No results found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto" style={{ fontSize: '14px' }}>
              Start adding exam results to track student performance and generate comprehensive reports.
            </p>
            <div className="flex justify-center gap-6">
              <div className="flex items-center text-sm text-gray-600">
                <Target size={16} className="mr-2 text-blue-500" />
                Track Performance
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Award size={16} className="mr-2 text-blue-500" />
                Generate Reports
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp size={16} className="mr-2 text-blue-500" />
                Analyze Trends
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('student')}
                    >
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>Student</span>
                        {sortConfig?.key === 'student' && (
                          <ChevronRight 
                            size={14} 
                            className={`transform transition-transform ${
                              sortConfig.direction === 'desc' ? 'rotate-90' : '-rotate-90'
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Exam Details</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} />
                        <span>Subject</span>
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('marks')}
                    >
                      <div className="flex items-center gap-2">
                        <Target size={16} />
                        <span>Performance</span>
                        {sortConfig?.key === 'marks' && (
                          <ChevronRight 
                            size={14} 
                            className={`transform transition-transform ${
                              sortConfig.direction === 'desc' ? 'rotate-90' : '-rotate-90'
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Award size={16} />
                        <span>Grade</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} />
                        <span>Status</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedResults.map((result, index) => {
                    const performance = getPerformanceIndicator(result.percentage);
                    return (
                      <motion.tr
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group transition-all duration-200 ${
                          hoveredRow === result.id 
                            ? 'bg-blue-50' 
                            : 'bg-white hover:bg-gray-50'
                        }`}
                        onMouseEnter={() => setHoveredRow(result.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        {/* Student Info */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 flex-shrink-0">
                              {result.students?.profile_picture ? (
                                <img
                                  className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                                  src={result.students.profile_picture}
                                  alt={result.students.full_name}
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-full bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center">
                                  <User className="h-6 w-6 text-blue-500" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p 
                                className="text-gray-900 truncate"
                                style={{ fontSize: '14px', fontWeight: 600 }}
                              >
                                {result.students?.full_name || 'Unknown Student'}
                              </p>
                              <p className="text-gray-600 mt-1" style={{ fontSize: '12px' }}>
                                Roll: {result.students?.roll_number || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Exam Details */}
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <p 
                              className="text-gray-900"
                              style={{ fontSize: '14px', fontWeight: 500 }}
                            >
                              {result.exam_schedules?.exam_name}
                            </p>
                            <p className="text-gray-600 flex items-center" style={{ fontSize: '12px' }}>
                              <Calendar size={12} className="mr-1" />
                              {new Date(result.exam_schedules?.exam_date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </td>

                        {/* Subject */}
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <p 
                              className="text-gray-900"
                              style={{ fontSize: '14px', fontWeight: 500 }}
                            >
                              {result.exam_schedules?.subjects?.subject_name}
                            </p>
                            <p className="text-gray-600 bg-gray-100 px-2 py-1 rounded-md inline-block" style={{ fontSize: '11px' }}>
                              {result.exam_schedules?.subjects?.subject_code}
                            </p>
                          </div>
                        </td>

                        {/* Performance */}
                        <td className="px-6 py-5">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span 
                                className="text-gray-900"
                                style={{ fontSize: '14px', fontWeight: 700 }}
                              >
                                {result.marks_obtained}/{result.exam_schedules?.max_marks}
                              </span>
                              <span className={`text-xs font-medium ${performance.color} flex items-center gap-1`}>
                                {performance.icon}
                                <span>{performance.label}</span>
                              </span>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  result.percentage >= 90
                                    ? 'gradient-primary'
                                    : result.percentage >= 80
                                    ? 'bg-cyan-500'
                                    : result.percentage >= 70
                                    ? 'bg-emerald-500'
                                    : result.percentage >= 50
                                    ? 'bg-amber-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(result.percentage, 100)}%` }}
                              ></div>
                            </div>
                            <p className="text-gray-600" style={{ fontSize: '12px', fontWeight: 600 }}>
                              {result.percentage.toFixed(1)}%
                            </p>
                          </div>
                        </td>

                        {/* Grade */}
                        <td className="px-6 py-5">
                          <span 
                            className={`inline-flex items-center px-3 py-1.5 rounded-xl font-bold ${getGradeColor(result.grade)} transform transition-all duration-200 hover:scale-105`}
                            style={{ fontSize: '14px' }}
                          >
                            {result.grade}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <span 
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium border ${getStatusColor(result.status)} transform transition-all duration-200 hover:scale-105`}
                            style={{ fontSize: '12px' }}
                          >
                            {getStatusIcon(result.status)}
                            <span className="capitalize">{result.status}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedResult(result)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => onEditResult(result)}
                              className="p-2 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-all duration-200"
                              title="Edit Result"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => onDeleteResult(result.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Delete Result"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Result Details Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[24px] shadow-float w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-[24px] z-10">
              <div className="h-32 rounded-t-[24px] gradient-primary"></div>
              <div className="px-6 pb-4 -mt-12">
                <div className="flex items-start justify-between">
                  <div className="w-20 h-20 gradient-primary rounded-[16px] shadow-soft flex items-center justify-center border-4 border-white">
                    <span 
                      className="text-white"
                      style={{ fontSize: '20px', fontWeight: 700 }}
                    >
                      {selectedResult.students?.full_name?.charAt(0) || 'N'}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="bg-white rounded-full p-2 shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <X size={24} className="text-gray-700" />
                  </button>
                </div>
                <h3 
                  className="text-gray-900 mt-4"
                  style={{ fontSize: '24px', fontWeight: 600 }}
                >
                  Result Details
                </h3>
                <p className="text-gray-600" style={{ fontSize: '14px' }}>
                  Complete performance overview
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
              {/* Student & Exam Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-[20px] p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <User size={20} className="text-blue-600" />
                    <h4 
                      className="text-gray-900"
                      style={{ fontSize: '16px', fontWeight: 600 }}
                    >
                      Student Info
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-600" style={{ fontSize: '13px' }}>Full Name</p>
                      <p 
                        className="text-gray-900"
                        style={{ fontSize: '15px', fontWeight: 600 }}
                      >
                        {selectedResult.students?.full_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600" style={{ fontSize: '13px' }}>Roll Number</p>
                      <p 
                        className="text-gray-900"
                        style={{ fontSize: '15px', fontWeight: 600 }}
                      >
                        {selectedResult.students?.roll_number}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-50 rounded-[20px] p-6 border border-cyan-200">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen size={20} className="text-cyan-600" />
                    <h4 
                      className="text-gray-900"
                      style={{ fontSize: '16px', fontWeight: 600 }}
                    >
                      Exam Info
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-600" style={{ fontSize: '13px' }}>Exam Name</p>
                      <p 
                        className="text-gray-900"
                        style={{ fontSize: '15px', fontWeight: 600 }}
                      >
                        {selectedResult.exam_schedules?.exam_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600" style={{ fontSize: '13px' }}>Subject</p>
                      <p 
                        className="text-gray-900"
                        style={{ fontSize: '15px', fontWeight: 600 }}
                      >
                        {selectedResult.exam_schedules?.subjects?.subject_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600" style={{ fontSize: '13px' }}>Date</p>
                      <p 
                        className="text-gray-900"
                        style={{ fontSize: '15px', fontWeight: 600 }}
                      >
                        {new Date(selectedResult.exam_schedules?.exam_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-gray-50 rounded-[20px] p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Target size={20} className="text-blue-500" />
                  <h4 
                    className="text-gray-900"
                    style={{ fontSize: '16px', fontWeight: 600 }}
                  >
                    Performance Metrics
                  </h4>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div 
                      className="text-gray-900 mb-1"
                      style={{ fontSize: '24px', fontWeight: 700 }}
                    >
                      {selectedResult.marks_obtained}
                    </div>
                    <div className="text-gray-600" style={{ fontSize: '12px' }}>Marks Obtained</div>
                    <div className="text-gray-500 mt-1" style={{ fontSize: '11px' }}>
                      out of {selectedResult.exam_schedules?.max_marks}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div 
                      className="text-blue-600 mb-1"
                      style={{ fontSize: '24px', fontWeight: 700 }}
                    >
                      {selectedResult.percentage.toFixed(1)}%
                    </div>
                    <div className="text-gray-600" style={{ fontSize: '12px' }}>Percentage</div>
                    <div className={`mt-1 ${getPerformanceIndicator(selectedResult.percentage).color}`} style={{ fontSize: '11px' }}>
                      {getPerformanceIndicator(selectedResult.percentage).label}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div className={`inline-flex items-center px-3 py-1 rounded-lg font-bold ${getGradeColor(selectedResult.grade)}`} style={{ fontSize: '18px' }}>
                      {selectedResult.grade}
                    </div>
                    <div className="text-gray-600 mt-2" style={{ fontSize: '12px' }}>Grade</div>
                  </div>

                  <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg font-medium border ${getStatusColor(selectedResult.status)}`} style={{ fontSize: '13px' }}>
                      {getStatusIcon(selectedResult.status)}
                      <span className="capitalize">{selectedResult.status}</span>
                    </div>
                    <div className="text-gray-600 mt-2" style={{ fontSize: '12px' }}>Status</div>
                  </div>
                </div>

                {/* Performance Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-gray-600 mb-2" style={{ fontSize: '14px' }}>
                    <span>Performance Score</span>
                    <span style={{ fontWeight: 600 }}>{selectedResult.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        selectedResult.percentage >= 90
                          ? 'gradient-primary'
                          : selectedResult.percentage >= 80
                          ? 'bg-cyan-500'
                          : selectedResult.percentage >= 70
                          ? 'bg-emerald-500'
                          : selectedResult.percentage >= 50
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(selectedResult.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Remarks Section */}
              {selectedResult.remarks && (
                <div className="bg-amber-50 rounded-[20px] p-6 border border-amber-200">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText size={20} className="text-amber-600" />
                    <h4 
                      className="text-gray-900"
                      style={{ fontSize: '16px', fontWeight: 600 }}
                    >
                      Remarks
                    </h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed" style={{ fontSize: '14px' }}>
                    {selectedResult.remarks}
                  </p>
                </div>
              )}

              {/* Evaluation Details */}
              <div className="bg-emerald-50 rounded-[20px] p-6 border border-emerald-200">
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={20} className="text-emerald-600" />
                  <h4 
                    className="text-gray-900"
                    style={{ fontSize: '16px', fontWeight: 600 }}
                  >
                    Evaluation Details
                  </h4>
                </div>
                <p className="text-gray-700" style={{ fontSize: '14px' }}>
                  <span style={{ fontWeight: 500 }}>Evaluated on:</span>{' '}
                  {selectedResult.evaluated_at
                    ? new Date(selectedResult.evaluated_at).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Not yet evaluated'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setSelectedResult(null);
                  onEditResult(selectedResult);
                }}
                className="px-6 py-2.5 gradient-primary text-white rounded-xl font-medium transition-all shadow-soft hover:shadow-float"
                style={{ fontSize: '14px' }}
              >
                Edit Result
              </button>
              <button
                onClick={() => setSelectedResult(null)}
                className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-white font-medium transition-colors"
                style={{ fontSize: '14px' }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ResultsList;
