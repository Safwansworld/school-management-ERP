'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Plus,
  Loader,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  Edit2,
  Eye,
  Download,
  RefreshCwIcon,
} from 'lucide-react';
import {
  fetchAcademicYears,
  fetchClassesByAcademicYear,
  fetchStudentsByAcademicYearAndClass,
  fetchAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
  approveAchievement,
  rejectAchievement,
  subscribeToAchievements,
} from '../../services/achievementService';
import { Achievement, Student, AchievementFormData } from '../../types/achievements';
import AddAchievementModal from './components/AddAchievementModal'
import ViewAchievementModal from './components/ViewAchievementModal';
import Toast from './components/common/Toast';

const ACHIEVEMENT_TYPES = [
  { value: 'academic', label: '📚 Academic' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'cultural', label: '🎭 Cultural' },
  { value: 'behavior', label: '⭐ Behavior' },
  { value: 'attendance', label: '📅 Attendance' },
  { value: 'leadership', label: '👥 Leadership' },
  { value: 'innovation', label: '💡 Innovation' },
  { value: 'arts', label: '🎨 Arts' },
];

const STATUS_COLORS = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_ICONS = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

export default function AchievementsPage() {
  // ==================== STATE MANAGEMENT ====================
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [classNames, setClassNames] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  // Filter states
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // UI states
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // ==================== INITIALIZATION ====================

  useEffect(() => {
    initializeData();
    const unsubscribe = subscribeToAchievements(handleRealTimeUpdate);
    return () => unsubscribe();
  }, []);

  const initializeData = async () => {
    setLoading(true);
    try {
      const years = await fetchAcademicYears();
      setAcademicYears(years);
      if (years.length > 0) {
        setSelectedYear(years[0]);
      }
    } catch (error) {
      showToast('Failed to load academic years', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ==================== DROPDOWN CASCADE LOGIC ====================

  const handleYearChange = useCallback(async (year: string) => {
    setSelectedYear(year);
    setSelectedClass('');
    setSelectedStudent('');
    setClassNames([]);
    setStudents([]);

    if (year) {
      try {
        const classes = await fetchClassesByAcademicYear(year);
        setClassNames(classes);
      } catch (error) {
        showToast('Failed to load classes', 'error');
      }
    }
  }, []);

  const handleClassChange = useCallback(async (className: string) => {
    setSelectedClass(className);
    setSelectedStudent('');
    setStudents([]);

    if (className && selectedYear) {
      try {
        const studentList = await fetchStudentsByAcademicYearAndClass(selectedYear, className);
        setStudents(studentList);
      } catch (error) {
        showToast('Failed to load students', 'error');
      }
    }
  }, [selectedYear]);

  const handleStudentChange = useCallback((studentId: string) => {
    setSelectedStudent(studentId);
  }, []);

  // ==================== DATA FETCHING ====================

  useEffect(() => {
    loadAchievements();
  }, [selectedYear, selectedType, selectedStatus, currentPage]);

  const loadAchievements = async () => {
    setLoading(true);
    try {
      const result = await fetchAchievements(currentPage, {
        academicYear: selectedYear || undefined,
        achievementType: selectedType || undefined,
        studentName: selectedStudent ? students.find(s => s.student_id === selectedStudent)?.student_name : undefined,
        status: selectedStatus || undefined,
      });

      setAchievements(result.data);
      setTotalCount(result.count);
      setHasMore(result.hasMore);
    } catch (error) {
      showToast('Failed to load achievements', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ==================== REAL-TIME UPDATES ====================

  const handleRealTimeUpdate = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      setAchievements(prev => [payload.new, ...prev]);
      showToast('New achievement added', 'info');
    } else if (payload.eventType === 'UPDATE') {
      setAchievements(prev => prev.map(a => (a.id === payload.new.id ? payload.new : a)));
    } else if (payload.eventType === 'DELETE') {
      setAchievements(prev => prev.filter(a => a.id !== payload.old.id));
    }
  };

  // ==================== CRUD OPERATIONS ====================

  const handleAddAchievement = async (
    formData: AchievementFormData,
    certificateFile?: File,
    attachmentFile?: File
  ) => {
    try {
      await addAchievement(formData, certificateFile, attachmentFile);
      showToast('Achievement added successfully', 'success');
      setShowAddModal(false);
      setCurrentPage(1);
      loadAchievements();
    } catch (error) {
      showToast('Failed to add achievement', 'error');
    }
  };

  const handleUpdateAchievement = async (
    formData: AchievementFormData,
    certificateFile?: File,
    attachmentFile?: File
  ) => {
    if (!editingId) return;

    try {
      const updatePayload: Partial<Achievement> = {
        student_id: formData.student_id,
        student_name: formData.student_name,
        achievement_type: formData.achievement_type as Achievement['achievement_type'],
        title: formData.title,
        description: formData.description || null,
        category: formData.category || null,
        date_achieved: formData.date_achieved,
        awarded_by: formData.awarded_by || null,
        academic_year: formData.academic_year,
        points: formData.points,
      };

      await updateAchievement(editingId, updatePayload, certificateFile, attachmentFile);
      showToast('Achievement updated successfully', 'success');
      setShowAddModal(false);
      setEditingId(null);
      loadAchievements();
    } catch (error) {
      showToast('Failed to update achievement', 'error');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveAchievement(id);
      showToast('Achievement approved', 'success');
      loadAchievements();
    } catch (error) {
      showToast('Failed to approve achievement', 'error');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectAchievement(id);
      showToast('Achievement rejected', 'success');
      loadAchievements();
    } catch (error) {
      showToast('Failed to reject achievement', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;

    try {
      await deleteAchievement(id);
      showToast('Achievement deleted successfully', 'success');
      loadAchievements();
    } catch (error) {
      showToast('Failed to delete achievement', 'error');
    }
  };

  // ==================== UTILITY FUNCTIONS ====================

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getAchievementTypeLabel = (type: string) => {
    return ACHIEVEMENT_TYPES.find(t => t.value === type)?.label || type;
  };

  // ==================== JSX RENDERING ====================

  return (
    <div className="min-h-screen bg-[#F6F9FC] p-3">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">Student Achievements</h1>
                <p className="text-gray-600 text-sm mt-1">Manage and track student achievements across all categories</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingId(null);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl shadow-glow hover:shadow-float font-medium transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Add Achievement
            </motion.button>
          </div>
        

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#1E88E5]/10 rounded-lg flex items-center justify-center">
              <Filter className="w-5 h-5 text-[#1E88E5]" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Filters & Search</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Academic Year Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none transition-all"
              >
                <option value="">Select Year</option>
                {academicYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Class Name Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                disabled={!selectedYear}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none transition-all disabled:bg-gray-50 disabled:opacity-50"
              >
                <option value="">Select Class</option>
                {classNames.map(className => (
                  <option key={className} value={className}>{className}</option>
                ))}
              </select>
            </div>

            {/* Student Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => handleStudentChange(e.target.value)}
                disabled={!selectedClass}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none transition-all disabled:bg-gray-50 disabled:opacity-50"
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.student_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Achievement Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Achievement Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none transition-all"
              >
                <option value="">All Types</option>
                {ACHIEVEMENT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none transition-all"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Search Input */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E88E5]/20 focus:border-[#1E88E5] outline-none transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* Achievements Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden"
        >
          {loading && achievements.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-[#1E88E5] animate-spin" />
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No achievements found</p>
              <p className="text-gray-500 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Achievement</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Points</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {achievements.map((achievement, index) => (
                      <motion.tr 
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{achievement.student_name}</p>
                          <p className="text-sm text-gray-600">{achievement.academic_year}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{achievement.title}</p>
                          <p className="text-sm text-gray-600 truncate">{achievement.description}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {getAchievementTypeLabel(achievement.achievement_type)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(achievement.date_achieved).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#1E88E5]/10 text-[#1E88E5] font-semibold text-sm border border-[#1E88E5]/20">
                            +{achievement.points}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${STATUS_COLORS[achievement.status]}`}>
                            {achievement.status.charAt(0).toUpperCase() + achievement.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedAchievement(achievement);
                                setShowViewModal(true);
                              }}
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#1E88E5]/10 rounded-lg transition-colors text-[#1E88E5]"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedAchievement(achievement);
                                setEditingId(achievement.id);
                                setShowAddModal(true);
                              }}
                              className="w-8 h-8 flex items-center justify-center hover:bg-green-50 rounded-lg transition-colors text-green-600"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </motion.button>
                            {achievement.status === 'pending' && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleApprove(achievement.id)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-green-50 rounded-lg transition-colors text-green-600"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleReject(achievement.id)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                </motion.button>
                              </>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(achievement.id)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-red-50 rounded-lg transition-colors text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalCount)} of {totalCount} achievements
                </p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={!hasMore}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Modals */}
        {showAddModal && (
          <AddAchievementModal
            academicYears={academicYears}
            classNames={classNames}
            students={students}
            selectedYear={selectedYear}
            selectedClass={selectedClass}
            onYearChange={handleYearChange}
            onClassChange={handleClassChange}
            onSubmit={editingId ? handleUpdateAchievement : handleAddAchievement}
            onClose={() => {
              setShowAddModal(false);
              setEditingId(null);
              setSelectedAchievement(null);
            }}
            initialData={editingId && selectedAchievement ? selectedAchievement : undefined}
          />
        )}

        {showViewModal && selectedAchievement && (
          <ViewAchievementModal
            achievement={selectedAchievement}
            onClose={() => {
              setShowViewModal(false);
              setSelectedAchievement(null);
            }}
          />
        )}

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
