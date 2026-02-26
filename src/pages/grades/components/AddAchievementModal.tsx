'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { Achievement, AchievementFormData, Student } from '../../../types/achievements';

interface AddAchievementModalProps {
  academicYears: string[];
  classNames: string[];
  students: Student[];
  selectedYear: string;
  selectedClass: string;
  onYearChange: (year: string) => void;
  onClassChange: (className: string) => void;
  onSubmit: (formData: AchievementFormData, certificateFile?: File, attachmentFile?: File) => Promise<void>;
  onClose: () => void;
  initialData?: Achievement;
}

const ACHIEVEMENT_TYPES = [
  { value: 'academic', label: 'Academic' },
  { value: 'sports', label: 'Sports' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'behavior', label: 'Behavior' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'innovation', label: 'Innovation' },
  { value: 'arts', label: 'Arts' },
] as const;

// Type helper for achievement type validation
type AchievementTypeValue = typeof ACHIEVEMENT_TYPES[number]['value'];

const isValidAchievementType = (value: string): value is AchievementTypeValue => {
  return ACHIEVEMENT_TYPES.some(type => type.value === value);
};

export default function AddAchievementModal({
  academicYears,
  classNames,
  students,
  selectedYear,
  selectedClass,
  onYearChange,
  onClassChange,
  onSubmit,
  onClose,
  initialData,
}: AddAchievementModalProps) {
  const [formData, setFormData] = useState<AchievementFormData>({
    student_id: '',
    student_name: '',
    achievement_type: 'academic',
    title: '',
    description: '',
    category: '',
    date_achieved: new Date().toISOString().split('T')[0],
    awarded_by: '',
    academic_year: selectedYear,
    points: 10,
  });

  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        student_id: initialData.student_id,
        student_name: initialData.student_name,
        achievement_type: initialData.achievement_type,
        title: initialData.title,
        description: initialData.description || '',
        category: initialData.category || '',
        date_achieved: initialData.date_achieved,
        awarded_by: initialData.awarded_by || '',
        academic_year: initialData.academic_year,
        points: initialData.points,
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.academic_year) newErrors.academic_year = 'Academic year is required';
    if (!formData.student_id) newErrors.student_id = 'Student is required';
    if (!formData.achievement_type) newErrors.achievement_type = 'Achievement type is required';
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.date_achieved) newErrors.date_achieved = 'Date is required';
    if (formData.points < 0) newErrors.points = 'Points cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData, certificateFile || undefined, attachmentFile || undefined);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (studentId: string) => {
    const student = students.find(s => s.student_id === studentId);
    setFormData({
      ...formData,
      student_id: studentId,
      student_name: student?.student_name || '',
    });
  };

  // FIX: Type-safe handler for achievement type
  const handleAchievementTypeChange = (value: string) => {
    if (isValidAchievementType(value)) {
      setFormData({
        ...formData,
        achievement_type: value,
      });
    } else {
      console.warn(`Invalid achievement type: ${value}`);
      setFormData({
        ...formData,
        achievement_type: 'academic', // Fallback to default
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? 'Edit Achievement' : 'Add New Achievement'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Academic Year Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Academic Year *</label>
            <select
              value={formData.academic_year}
              onChange={(e) => {
                onYearChange(e.target.value);
                setFormData({ ...formData, academic_year: e.target.value });
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Year</option>
              {academicYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {errors.academic_year && <p className="text-red-600 text-sm mt-1">{errors.academic_year}</p>}
          </div>

          {/* Class Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => onClassChange(e.target.value)}
              disabled={!formData.academic_year}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
            >
              <option value="">Select Class</option>
              {classNames.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
          </div>

          {/* Student Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Student *</label>
            <select
              value={formData.student_id}
              onChange={(e) => handleStudentChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Student</option>
              {students.map(student => (
                <option key={student.student_id} value={student.student_id}>
                  {student.student_name}
                </option>
              ))}
            </select>
            {errors.student_id && <p className="text-red-600 text-sm mt-1">{errors.student_id}</p>}
          </div>

          {/* Achievement Type - FIXED */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Achievement Type *</label>
            <select
              value={formData.achievement_type}
              onChange={(e) => handleAchievementTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              {ACHIEVEMENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {errors.achievement_type && <p className="text-red-600 text-sm mt-1">{errors.achievement_type}</p>}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Best Science Project"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about the achievement..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Inter-School Competition"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date and Points Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date Achieved *</label>
              <input
                type="date"
                value={formData.date_achieved}
                onChange={(e) => setFormData({ ...formData, date_achieved: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.date_achieved && <p className="text-red-600 text-sm mt-1">{errors.date_achieved}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Points</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.points && <p className="text-red-600 text-sm mt-1">{errors.points}</p>}
            </div>
          </div>

          {/* Awarded By */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Awarded By</label>
            <input
              type="text"
              value={formData.awarded_by}
              onChange={(e) => setFormData({ ...formData, awarded_by: e.target.value })}
              placeholder="Teacher/Admin name"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Certificate Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Certificate</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                className="hidden"
                id="certificate"
              />
              <label htmlFor="certificate" className="cursor-pointer flex items-center justify-center gap-2">
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600">{certificateFile?.name || 'Click to upload certificate'}</span>
              </label>
            </div>
          </div>

          {/* Attachment Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Additional Attachment</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <input
                type="file"
                onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                className="hidden"
                id="attachment"
              />
              <label htmlFor="attachment" className="cursor-pointer flex items-center justify-center gap-2">
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600">{attachmentFile?.name || 'Click to upload file'}</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : initialData ? 'Update Achievement' : 'Add Achievement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
