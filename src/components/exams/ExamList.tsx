
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExamSchedule } from '../../types/Exam';
import { 
  Clock, 
  MapPin, 
  Users, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  BookOpen, 
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  CheckCircle,
  Play,
  XCircle,
  Pause,
  ClockIcon,
  GraduationCap,
  X
} from 'lucide-react';

interface ExamListProps {
  exams: ExamSchedule[];
  onEditExam: (exam: ExamSchedule) => void;
  onDeleteExam: (examId: string) => void;
}

const ExamList: React.FC<ExamListProps> = ({ exams, onEditExam, onDeleteExam }) => {
  const [selectedExam, setSelectedExam] = useState<ExamSchedule | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Group exams by subject for folder structure
  const examFolders = useMemo(() => {
    const folders = new Map<string, ExamSchedule[]>();
    
    exams.forEach(exam => {
      const subjectKey = exam.subjects?.subject_name || 'Unknown Subject';
      if (!folders.has(subjectKey)) {
        folders.set(subjectKey, []);
      }
      folders.get(subjectKey)!.push(exam);
    });

    // Sort exams within each folder by date
    folders.forEach(examList => {
      examList.sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime());
    });

    return Array.from(folders.entries()).map(([subject, examList]) => ({
      subject,
      exams: examList,
      subjectCode: examList[0]?.subjects?.subject_code || '',
      count: examList.length
    }));
  }, [exams]);

  const toggleFolder = (subject: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(subject)) {
      newExpanded.delete(subject);
    } else {
      newExpanded.add(subject);
    }
    setExpandedFolders(newExpanded);
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes > 0) {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }
    return '';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-[#1E88E5]/10 text-[#1E88E5] border-[#1E88E5]/20';
      case 'in_progress': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      case 'postponed': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'written': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'oral': return 'bg-green-50 text-green-700 border-green-200';
      case 'practical': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'project': return 'bg-[#5B9FFF]/10 text-[#5B9FFF] border-[#5B9FFF]/20';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

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

  const getFolderStatusSummary = (exams: ExamSchedule[]) => {
    const statusCounts = exams.reduce((acc, exam) => {
      acc[exam.status] = (acc[exam.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return statusCounts;
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC] p-8">
      <div className="max-w-[1600px] mx-auto">
        {examFolders.length === 0 ? (
          <div className="bg-white rounded-[20px] p-12 shadow-soft border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No exams scheduled</h3>
              <p className="text-gray-600">Create your first exam schedule to get started.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Panel - Exam List */}
            <div className={`space-y-4 ${selectedExam ? 'xl:col-span-2' : 'xl:col-span-3'} transition-all duration-300`}>
              {examFolders.map(({ subject, exams: subjectExams, subjectCode, count }) => {
                const isExpanded = expandedFolders.has(subject);
                const statusSummary = getFolderStatusSummary(subjectExams);

                return (
                  <motion.div 
                    key={subject} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden"
                  >
                    {/* Folder Header */}
                    <div
                      onClick={() => toggleFolder(subject)}
                      className="group p-6 cursor-pointer hover:bg-gray-50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
                              {isExpanded ? (
                                <FolderOpen className="w-5 h-5 text-white" />
                              ) : (
                                <Folder className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5 text-gray-600 group-hover:text-[#1E88E5] transition-colors" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#1E88E5] transition-colors" />
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#1E88E5] transition-colors">
                              {subject}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="font-medium">({subjectCode})</span>
                              <span>•</span>
                              <span>{count} exam{count !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Summary */}
                        <div className="flex items-center gap-2">
                          {Object.entries(statusSummary).map(([status, statusCount]) => (
                            <div
                              key={status}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(status)}`}
                            >
                              {getStatusIcon(status)}
                              <span>{statusCount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50/50">
                        <div className="p-6 space-y-4">
                          {subjectExams.map(exam => (
                            <motion.div 
                              key={exam.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`border rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                                selectedExam?.id === exam.id 
                                  ? 'bg-[#1E88E5]/5 border-[#1E88E5]/30 shadow-md ring-2 ring-[#1E88E5]/20' 
                                  : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                              }`}
                              onClick={() => setSelectedExam(exam)}
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-base font-semibold text-gray-900">{exam.exam_name}</h4>
                                    <div className="flex gap-2">
                                      <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border font-semibold ${getStatusColor(exam.status)}`}>
                                        {getStatusIcon(exam.status)}
                                        {exam.status.replace('_', ' ').toUpperCase()}
                                      </span>
                                      <span className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${getTypeColor(exam.exam_type)}`}>
                                        {exam.exam_type.toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <div className="w-5 h-5 bg-[#1E88E5]/10 rounded flex items-center justify-center">
                                      <BookOpen size={12} className="text-[#1E88E5]" />
                                    </div>
                                    <span className="font-medium">{exam.subjects?.subject_name}</span>
                                    <span className="text-gray-400">({exam.subjects?.subject_code})</span>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEditExam(exam);
                                    }}
                                    className="w-8 h-8 bg-white border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 text-gray-600 hover:text-green-600 flex items-center justify-center transition-all duration-300 shadow-sm"
                                    title="Edit Exam"
                                  >
                                    <Edit size={14} />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteExam(exam.id);
                                    }}
                                    className="w-8 h-8 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 text-gray-600 hover:text-red-600 flex items-center justify-center transition-all duration-300 shadow-sm"
                                    title="Delete Exam"
                                  >
                                    <Trash2 size={14} />
                                  </motion.button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <div className="w-5 h-5 bg-[#1E88E5]/10 rounded flex items-center justify-center">
                                    <Calendar size={12} className="text-[#1E88E5]" />
                                  </div>
                                  <span className="font-medium">{formatDate(exam.exam_date)}</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-600">
                                  <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                                    <Clock size={12} className="text-purple-600" />
                                  </div>
                                  <span className="font-medium">
                                    {formatTime(exam.start_time)} - {formatTime(exam.end_time)}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-600">
                                  <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                                    <Users size={12} className="text-green-600" />
                                  </div>
                                  <span className="font-medium">{exam.classes?.class_name} - {exam.classes?.section}</span>
                                </div>

                                {exam.room_number && (
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center">
                                      <MapPin size={12} className="text-orange-600" />
                                    </div>
                                    <span className="font-medium">{exam.room_number}</span>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Right Panel - Exam Details */}
            {selectedExam && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="xl:col-span-1"
              >
                <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 sticky top-6 max-h-[calc(100vh-120px)] overflow-hidden">
                  {/* Header */}
                  <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Exam Details
                        </h3>
                        <p className="text-gray-600 text-sm">View complete information</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedExam(null)}
                      className="w-8 h-8 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 text-gray-600 hover:text-red-600 flex items-center justify-center transition-all duration-300"
                    >
                      <X size={16} />
                    </motion.button>
                  </div>

                  {/* Scrollable Content */}
                  <div className="p-6 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar">
                    <div className="space-y-4">
                      {/* Basic Info */}
                      <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <div className="w-6 h-6 bg-[#1E88E5]/10 rounded flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-[#1E88E5]" />
                          </div>
                          Basic Information
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Exam Name</label>
                            <p className="text-gray-900 font-medium bg-white p-2.5 rounded-lg text-sm border border-gray-100">{selectedExam.exam_name}</p>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Type</label>
                            <span className={`inline-block text-xs px-2.5 py-1.5 rounded-lg border font-semibold ${getTypeColor(selectedExam.exam_type)}`}>
                              {selectedExam.exam_type.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
                            <p className="text-gray-900 font-medium bg-white p-2.5 rounded-lg text-sm border border-gray-100">
                              {selectedExam.subjects?.subject_name}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Class</label>
                            <p className="text-gray-900 font-medium bg-white p-2.5 rounded-lg text-sm border border-gray-100">
                              {selectedExam.classes?.class_name} - {selectedExam.classes?.section}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Schedule */}
                      <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                            <Clock className="w-4 h-4 text-purple-600" />
                          </div>
                          Schedule
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                            <p className="text-gray-900 font-medium bg-white p-2.5 rounded-lg text-sm border border-gray-100">{formatDate(selectedExam.exam_date)}</p>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Time</label>
                            <p className="text-gray-900 font-medium bg-white p-2.5 rounded-lg text-sm border border-gray-100">
                              {formatTime(selectedExam.start_time)} - {formatTime(selectedExam.end_time)}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Duration</label>
                            <p className="text-gray-900 font-medium bg-white p-2.5 rounded-lg text-sm border border-gray-100">
                              {getDuration(selectedExam.start_time, selectedExam.end_time)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-green-600" />
                          </div>
                          Details
                        </h4>
                        <div className="space-y-3">
                          {selectedExam.room_number && (
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Room</label>
                              <p className="text-gray-900 font-medium bg-white p-2.5 rounded-lg text-sm border border-gray-100">{selectedExam.room_number}</p>
                            </div>
                          )}
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Maximum Marks</label>
                            <p className="text-gray-900 font-medium bg-white p-2.5 rounded-lg text-sm border border-gray-100">{selectedExam.max_marks}</p>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Passing Marks</label>
                            <p className="text-gray-900 font-medium bg-white p-2.5 rounded-lg text-sm border border-gray-100">{selectedExam.passing_marks}</p>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Status</h4>
                        <span className={`inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border font-semibold ${getStatusColor(selectedExam.status)}`}>
                          {getStatusIcon(selectedExam.status)}
                          {selectedExam.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      {/* Instructions */}
                      {selectedExam.instructions && (
                        <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Instructions</h4>
                          <p className="text-gray-700 bg-white p-3 rounded-lg font-medium text-sm border border-gray-100">
                            {selectedExam.instructions}
                          </p>
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="pt-4 border-t border-gray-100">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onEditExam(selectedExam)}
                          className="w-full px-4 py-3 gradient-primary text-white font-semibold rounded-xl shadow-glow hover:shadow-float transition-all duration-300 text-sm"
                        >
                          Edit Exam
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(243, 244, 246, 0.5);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(30, 136, 229, 0.5);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(30, 136, 229, 0.7);
          }
        `}</style>
      </div>
    </div>
  );
};

export default ExamList;
