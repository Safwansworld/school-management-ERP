import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ExamSchedule, ExamFormData, ExamFormErrors } from '../../types/Exam';
import { 
  X, 
  Clock, 
  Calendar, 
  FileText, 
  Users, 
  AlertCircle, 
  BookOpen,
  GraduationCap,
  MapPin,
  Target,
  CheckCircle2,
  Save,
  Edit3
} from 'lucide-react';

interface ClassAssignment {
    id: string;
    class_id: string;
    class_name: string;
    academic_year: string;
}

interface Subject {
    id: string;
    subject_name: string;
    subject_code: string;
    class_level: string;
}

interface ExamFormProps {
    initialData?: ExamSchedule | null;
    onSubmit: (data: ExamFormData) => void;
    onClose: () => void;
}

const ExamForm: React.FC<ExamFormProps> = ({
    initialData,
    onSubmit,
    onClose
}) => {
    const [formData, setFormData] = useState<ExamFormData>({
        subject_id: '',
        class_id: '',
        exam_name: '',
        exam_type: 'written',
        exam_date: '',
        start_time: '',
        end_time: '',
        room_number: '',
        max_marks: 100,
        passing_marks: 35,
        instructions: '',
        syllabus_coverage: ''
    });

    const [errors, setErrors] = useState<ExamFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // State for dynamic data
    const [classAssignments, setClassAssignments] = useState<ClassAssignment[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [loadingSubjects, setLoadingSubjects] = useState(true);

    // Fetch unique class assignments on component mount
    useEffect(() => {
        fetchClassAssignments();
        fetchAllSubjects();
    }, []);

    // Set initial data if editing
    useEffect(() => {
        if (initialData) {
            setFormData({
                subject_id: initialData.subject_id,
                class_id: initialData.class_id,
                exam_name: initialData.exam_name,
                exam_type: initialData.exam_type,
                exam_date: initialData.exam_date,
                start_time: initialData.start_time,
                end_time: initialData.end_time,
                room_number: initialData.room_number || '',
                max_marks: initialData.max_marks,
                passing_marks: initialData.passing_marks,
                instructions: initialData.instructions || '',
                syllabus_coverage: initialData.syllabus_coverage || ''
            });
        }
    }, [initialData]);

    const fetchClassAssignments = async () => {
        try {
            setLoadingClasses(true);
            
            const { data, error } = await supabase
                .from('class_assignments')
                .select('class_id, class_name, academic_year')
                .order('class_name', { ascending: true });

            if (error) throw error;

            const uniqueClasses = data?.reduce((acc: ClassAssignment[], current) => {
                const exists = acc.find(item => item.class_id === current.class_id);
                if (!exists) {
                    acc.push({
                        id: current.class_id,
                        class_id: current.class_id,
                        class_name: current.class_name,
                        academic_year: current.academic_year
                    });
                }
                return acc;
            }, []) || [];

            setClassAssignments(uniqueClasses);
        } catch (error) {
            console.error('Error fetching class assignments:', error);
        } finally {
            setLoadingClasses(false);
        }
    };

    const fetchAllSubjects = async () => {
        try {
            setLoadingSubjects(true);

            const { data: subjectsData, error: subjectsError } = await supabase
                .from('subjects')
                .select('id, subject_name, subject_code, class_level')
                .eq('status', 'active')
                .order('subject_name', { ascending: true });

            if (subjectsError) throw subjectsError;

            setSubjects(subjectsData || []);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setSubjects([]);
        } finally {
            setLoadingSubjects(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: ExamFormErrors = {};

        if (!formData.subject_id) newErrors.subject_id = 'Subject is required';
        if (!formData.class_id) newErrors.class_id = 'Class is required';
        if (!formData.exam_name.trim()) newErrors.exam_name = 'Exam name is required';
        if (!formData.exam_date) newErrors.exam_date = 'Exam date is required';
        if (!formData.start_time) newErrors.start_time = 'Start time is required';
        if (!formData.end_time) newErrors.end_time = 'End time is required';

        // Date validation
        if (formData.exam_date) {
            const examDate = new Date(formData.exam_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (examDate < today) {
                newErrors.exam_date = 'Exam date cannot be in the past';
            }
        }

        // Time validation
        if (formData.start_time && formData.end_time) {
            if (formData.start_time >= formData.end_time) {
                newErrors.end_time = 'End time must be after start time';
            }
        }

        // Marks validation
        if (formData.max_marks <= 0) {
            newErrors.max_marks = 'Maximum marks must be greater than 0';
        }

        if (formData.passing_marks < 0 || formData.passing_marks >= formData.max_marks) {
            newErrors.passing_marks = 'Passing marks must be between 0 and maximum marks';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof ExamFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleNumberChange = (field: 'max_marks' | 'passing_marks', value: string) => {
        const numValue = parseInt(value) || 0;
        handleInputChange(field, numValue);
    };

    // Calculate duration
    const getDuration = () => {
        if (formData.start_time && formData.end_time) {
            const start = new Date(`2000-01-01T${formData.start_time}`);
            const end = new Date(`2000-01-01T${formData.end_time}`);
            const diffMs = end.getTime() - start.getTime();
            const diffMinutes = Math.floor(diffMs / (1000 * 60));

            if (diffMinutes > 0) {
                const hours = Math.floor(diffMinutes / 60);
                const minutes = diffMinutes % 60;
                return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
            }
        }
        return '';
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-[24px] shadow-float border border-gray-100 w-full max-w-4xl max-h-[95vh] overflow-hidden">
                {/* Header - Match Admin Dashboard style */}
                <div className="relative bg-white border-b border-gray-200">
                    <div className="flex justify-between items-center p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-[14px] bg-blue-50 flex items-center justify-center">
                                {initialData ? (
                                    <Edit3 className="w-6 h-6 text-blue-500" />
                                ) : (
                                    <GraduationCap className="w-6 h-6 text-blue-500" />
                                )}
                            </div>
                            <div>
                                <h2 
                                    className="text-gray-900"
                                    style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.015em' }}
                                >
                                    {initialData ? 'Edit Exam' : 'Schedule New Exam'}
                                </h2>
                                <p className="text-gray-600 mt-0.5" style={{ fontSize: '14px', fontWeight: 400 }}>
                                    {initialData ? 'Modify exam details' : 'Create a new examination schedule'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-500 hover:text-red-600 flex items-center justify-center transition-all duration-200"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(95vh-120px)] custom-scrollbar">
                    <div className="space-y-6">
                        {/* Basic Information Section */}
                        <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-soft">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-blue-50 rounded-[12px] flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-blue-500" />
                                </div>
                                <h3 
                                    className="text-gray-900"
                                    style={{ fontSize: '16px', fontWeight: 600 }}
                                >
                                    Basic Information
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Class Selection */}
                                <div className="space-y-2">
                                    <label 
                                        className="block text-gray-700"
                                        style={{ fontSize: '14px', fontWeight: 600 }}
                                    >
                                        Class *
                                    </label>
                                    <select
                                        value={formData.class_id}
                                        onChange={(e) => handleInputChange('class_id', e.target.value)}
                                        disabled={loadingClasses}
                                        className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 ${
                                            errors.class_id ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                        } ${loadingClasses ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        style={{ fontSize: '14px', fontWeight: 500 }}
                                    >
                                        <option value="">
                                            {loadingClasses ? 'Loading classes...' : 'Select Class'}
                                        </option>
                                        {classAssignments.map(assignment => (
                                            <option key={assignment.id} value={assignment.class_id}>
                                                {assignment.class_name} ({assignment.academic_year})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.class_id && (
                                        <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 mt-1">
                                            <AlertCircle size={14} />
                                            {errors.class_id}
                                        </p>
                                    )}
                                </div>

                                {/* Subject */}
                                <div className="space-y-2">
                                    <label 
                                        className="block text-gray-700"
                                        style={{ fontSize: '14px', fontWeight: 600 }}
                                    >
                                        Subject *
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.subject_id}
                                            onChange={(e) => handleInputChange('subject_id', e.target.value)}
                                            disabled={loadingSubjects}
                                            className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 ${
                                                errors.subject_id ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                            } ${loadingSubjects ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            style={{ fontSize: '14px', fontWeight: 500 }}
                                        >
                                            <option value="">
                                                {loadingSubjects 
                                                    ? 'Loading subjects...' 
                                                    : subjects.length === 0
                                                    ? 'No subjects available'
                                                    : 'Select Subject'}
                                            </option>
                                            {subjects.map(subject => (
                                                <option key={subject.id} value={subject.id}>
                                                    {subject.subject_name} ({subject.subject_code})
                                                </option>
                                            ))}
                                        </select>
                                        {loadingSubjects && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                    {errors.subject_id && (
                                        <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 mt-1">
                                            <AlertCircle size={14} />
                                            {errors.subject_id}
                                        </p>
                                    )}
                                    {!loadingSubjects && subjects.length > 0 && (
                                        <p className="text-blue-600 text-xs font-medium flex items-center gap-1.5 bg-blue-50 px-2.5 py-1.5 rounded-lg mt-1">
                                            <CheckCircle2 size={12} />
                                            {subjects.length} subject{subjects.length !== 1 ? 's' : ''} available
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Exam Name and Type */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                <div className="space-y-2">
                                    <label 
                                        className="block text-gray-700"
                                        style={{ fontSize: '14px', fontWeight: 600 }}
                                    >
                                        Exam Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.exam_name}
                                        onChange={(e) => handleInputChange('exam_name', e.target.value)}
                                        placeholder="e.g., Mid-term Exam, Final Exam"
                                        className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 placeholder-gray-400 ${
                                            errors.exam_name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                        }`}
                                        style={{ fontSize: '14px', fontWeight: 500 }}
                                    />
                                    {errors.exam_name && (
                                        <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 mt-1">
                                            <AlertCircle size={14} />
                                            {errors.exam_name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label 
                                        className="block text-gray-700"
                                        style={{ fontSize: '14px', fontWeight: 600 }}
                                    >
                                        Exam Type
                                    </label>
                                    <select
                                        value={formData.exam_type}
                                        onChange={(e) => handleInputChange('exam_type', e.target.value as any)}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
                                        style={{ fontSize: '14px', fontWeight: 500 }}
                                    >
                                        <option value="written">📝 Written</option>
                                        <option value="oral">🗣️ Oral</option>
                                        <option value="practical">🔬 Practical</option>
                                        <option value="project">📊 Project</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Section */}
                        <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-soft">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-blue-50 rounded-[12px] flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                </div>
                                <h3 
                                    className="text-gray-900"
                                    style={{ fontSize: '16px', fontWeight: 600 }}
                                >
                                    Schedule Details
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-2">
                                    <label 
                                        className="block text-gray-700 flex items-center gap-2"
                                        style={{ fontSize: '14px', fontWeight: 600 }}
                                    >
                                        <Calendar className="w-4 h-4" />
                                        Exam Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.exam_date}
                                        onChange={(e) => handleInputChange('exam_date', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 ${
                                            errors.exam_date ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                        }`}
                                        style={{ fontSize: '14px', fontWeight: 500 }}
                                    />
                                    {errors.exam_date && (
                                        <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 mt-1">
                                            <AlertCircle size={14} />
                                            {errors.exam_date}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label 
                                        className="block text-gray-700 flex items-center gap-2"
                                        style={{ fontSize: '14px', fontWeight: 600 }}
                                    >
                                        <Clock className="w-4 h-4" />
                                        Start Time *
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.start_time}
                                        onChange={(e) => handleInputChange('start_time', e.target.value)}
                                        className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 ${
                                            errors.start_time ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                        }`}
                                        style={{ fontSize: '14px', fontWeight: 500 }}
                                    />
                                    {errors.start_time && (
                                        <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 mt-1">
                                            <AlertCircle size={14} />
                                            {errors.start_time}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label 
                                        className="block text-gray-700"
                                        style={{ fontSize: '14px', fontWeight: 600 }}
                                    >
                                        End Time *
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.end_time}
                                        onChange={(e) => handleInputChange('end_time', e.target.value)}
                                        className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 ${
                                            errors.end_time ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                        }`}
                                        style={{ fontSize: '14px', fontWeight: 500 }}
                                    />
                                    {errors.end_time && (
                                        <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 mt-1">
                                            <AlertCircle size={14} />
                                            {errors.end_time}
                                        </p>
                                    )}
                                    {getDuration() && (
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5 mt-1">
                                            <p className="text-emerald-700 text-xs font-medium flex items-center gap-1.5">
                                                <CheckCircle2 size={12} />
                                                Duration: {getDuration()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Venue and Marks Section */}
                        <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-soft">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-blue-50 rounded-[12px] flex items-center justify-center">
                                    <Target className="w-5 h-5 text-blue-500" />
                                </div>
                                <h3 
                                    className="text-gray-900"
                                    style={{ fontSize: '16px', fontWeight: 600 }}
                                >
                                    Venue & Marks
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-2">
                                    <label 
                                        className="block text-gray-700 flex items-center gap-2"
                                        style={{ fontSize: '14px', fontWeight: 600 }}
                                    >
                                        <MapPin className="w-4 h-4" />
                                        Room Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.room_number}
                                        onChange={(e) => handleInputChange('room_number', e.target.value)}
                                        placeholder="e.g., Room 101, Hall A"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 placeholder-gray-400"
                                        style={{ fontSize: '14px', fontWeight: 500 }}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label 
                                        className="block text-gray-700"
                                        style={{ fontSize: '14px', fontWeight: 600 }}
                                    >
                                        Maximum Marks
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.max_marks}
                                        onChange={(e) => handleNumberChange('max_marks', e.target.value)}
                                        min="1"
                                        className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 ${
                                            errors.max_marks ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                        }`}
                                        style={{ fontSize: '14px', fontWeight: 500 }}
                                    />
                                    {errors.max_marks && (
                                        <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 mt-1">
                                            <AlertCircle size={14} />
                                            {errors.max_marks}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label 
                                        className="block text-gray-700"
                                        style={{ fontSize: '14px', fontWeight: 600 }}
                                    >
                                        Passing Marks
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.passing_marks}
                                        onChange={(e) => handleNumberChange('passing_marks', e.target.value)}
                                        min="0"
                                        max={formData.max_marks - 1}
                                        className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 ${
                                            errors.passing_marks ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                        }`}
                                        style={{ fontSize: '14px', fontWeight: 500 }}
                                    />
                                    {errors.passing_marks && (
                                        <p className="text-red-600 text-xs font-medium flex items-center gap-1.5 mt-1">
                                            <AlertCircle size={14} />
                                            {errors.passing_marks}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Information Section */}
                        <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-soft">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-blue-50 rounded-[12px] flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                </div>
                                <h3 
                                    className="text-gray-900"
                                    style={{ fontSize: '16px', fontWeight: 600 }}
                                >
                                    Additional Information
                                </h3>
                            </div>

                            <div className="space-y-5">
                                {/* Instructions */}
                                <div className="space-y-2">
                                    <label 
                                        className="block text-gray-700 flex items-center gap-2"
                                        style={{ fontSize: '14px', fontWeight: 600 }}
                                    >
                                        <FileText className="w-4 h-4" />
                                        Instructions
                                    </label>
                                    <textarea
                                        value={formData.instructions}
                                        onChange={(e) => handleInputChange('instructions', e.target.value)}
                                        placeholder="Special instructions for students..."
                                        rows={4}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 placeholder-gray-400 resize-none"
                                        style={{ fontSize: '14px', fontWeight: 500 }}
                                    />
                                </div>

                                {/* Syllabus Coverage */}
                                <div className="space-y-2">
                                    <label 
                                        className="block text-gray-700"
                                        style={{ fontSize: '14px', fontWeight: 600 }}
                                    >
                                        Syllabus Coverage
                                    </label>
                                    <textarea
                                        value={formData.syllabus_coverage}
                                        onChange={(e) => handleInputChange('syllabus_coverage', e.target.value)}
                                        placeholder="Topics/chapters covered in this exam..."
                                        rows={4}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 placeholder-gray-400 resize-none"
                                        style={{ fontSize: '14px', fontWeight: 500 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium transition-all duration-200"
                                style={{ fontSize: '14px' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2.5 rounded-xl text-white font-medium transition-all duration-200 flex items-center gap-2 ${
                                    isSubmitting
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'gradient-primary shadow-soft hover:shadow-float'
                                }`}
                                style={{ fontSize: '14px' }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        {initialData ? 'Update Exam' : 'Schedule Exam'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(229, 231, 235, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(156, 163, 175, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(107, 114, 128, 0.7);
                }
            `}</style>
        </div>
    );
};

export default ExamForm;
