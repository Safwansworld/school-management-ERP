import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import {
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    User,
    Calendar,
    Search,
    Save,
    RefreshCw,
    BookOpen,
    Users,
    UserCheck,
    Filter,
    Download,
    Bell,
    Check,
    X,
    AlertCircle,
    TrendingUp,
    Minus
} from 'lucide-react'

// Enhanced interfaces with better typing
interface Student {
    id: string
    full_name: string
    roll_number: string
    admission_number: string
    profile_picture?: string
    section: string
    gender: string
    class_id: string
    status: 'active' | 'inactive'
    parent_contact?: string
    emergency_contact?: string
}

interface TeacherForAttendance {
    id: string
    full_name: string
    employee_id: string
    subject_specialization: string
    profile_picture?: string
}

interface AttendanceRecord {
    student_id: string
    status: 'present' | 'absent' | 'late' | 'excused'
    reason?: string
    time_in?: string
    class_id: string
    marked_at?: string
}

interface AttendanceStats {
    total: number
    present: number
    absent: number
    late: number
    excused: number
    presentPercentage: number
}

interface FilterOptions {
    status: 'all' | 'present' | 'absent' | 'late' | 'excused'
    gender: 'all' | 'male' | 'female' | 'other'
    section: string
}

const MarkAttendance = () => {
    // State management
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [selectedClass, setSelectedClass] = useState('')
    const [selectedTeacher, setSelectedTeacher] = useState('')
    const [students, setStudents] = useState<Student[]>([])
    const [teachers, setTeachers] = useState<TeacherForAttendance[]>([])
    const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({})
    const [classes, setClasses] = useState<string[]>([])

    // Loading and UI states
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [showReasonModal, setShowReasonModal] = useState<string | null>(null)
    const [currentReason, setCurrentReason] = useState('')
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())

    // Enhanced filter state
    const [filters, setFilters] = useState<FilterOptions>({
        status: 'all',
        gender: 'all',
        section: ''
    })

    // Notification state
    const [notification, setNotification] = useState<{
        type: 'success' | 'error' | 'warning' | 'info'
        message: string
        show: boolean
    }>({ type: 'info', message: '', show: false })

    // Show notification helper
    const showNotification = useCallback((type: 'success' | 'error' | 'warning' | 'info', message: string) => {
        setNotification({ type, message, show: true })
        setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 5000)
    }, [])

    // Memoized computed values for better performance
    const attendanceStats: AttendanceStats = useMemo(() => {
        const values = Object.values(attendance)
        const total = values.length
        const present = values.filter(a => a.status === 'present').length
        const absent = values.filter(a => a.status === 'absent').length
        const late = values.filter(a => a.status === 'late').length
        const excused = values.filter(a => a.status === 'excused').length
        const presentPercentage = total > 0 ? Math.round((present / total) * 100) : 0

        return { total, present, absent, late, excused, presentPercentage }
    }, [attendance])

    // Enhanced filtered students
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.roll_number.includes(searchTerm) ||
                student.admission_number.includes(searchTerm)

            const matchesStatus = filters.status === 'all' ||
                attendance[student.id]?.status === filters.status

            const matchesGender = filters.gender === 'all' ||
                student.gender.toLowerCase() === filters.gender.toLowerCase()

            const matchesSection = !filters.section || student.section === filters.section

            return matchesSearch && matchesStatus && matchesGender && matchesSection
        })
    }, [students, searchTerm, filters, attendance])

    // Data fetching functions
    const fetchClasses = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('class_id, section')
                .eq('status', 'active')
                .not('class_id', 'is', null)

            if (error) throw error

            const uniqueClasses = [...new Set(data.map(item => item.class_id))]
            setClasses(uniqueClasses.sort())
        } catch (error) {
            console.error('Error fetching classes:', error)
            showNotification('error', 'Failed to load classes')
        }
    }, [showNotification])

    const fetchTeachers = async () => {
        try {
            const { data, error } = await supabase
                .from('teachers')
                .select('id, full_name, employee_id, subject_specialization, profile_picture')
                .eq('status', 'active')
                .order('full_name', { ascending: true })

            if (error) throw error

            const teachersData: TeacherForAttendance[] = (data || []).map(teacher => ({
                id: teacher.id,
                full_name: teacher.full_name,
                employee_id: teacher.employee_id,
                subject_specialization: teacher.subject_specialization,
                profile_picture: teacher.profile_picture
            }))

            setTeachers(teachersData)
        } catch (error) {
            console.error('Error fetching teachers:', error)
            showNotification('error', 'Failed to load teachers')
        }
    }

    const fetchStudents = useCallback(async () => {
        if (!selectedClass) return

        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('class_id', selectedClass)
                .eq('status', 'active')
                .order('roll_number', { ascending: true })

            if (error) throw error

            setStudents(data || [])
            await fetchExistingAttendance(data || [])
        } catch (error) {
            console.error('Error fetching students:', error)
            showNotification('error', 'Failed to load students')
        } finally {
            setLoading(false)
        }
    }, [selectedClass, selectedDate, showNotification])

    const fetchExistingAttendance = useCallback(async (studentList: Student[]) => {
        try {
            const { data, error } = await supabase
                .from('attendance')
                .select('*')
                .eq('date', selectedDate)
                .in('student_id', studentList.map(s => s.id))

            if (error) throw error

            const attendanceMap: Record<string, AttendanceRecord> = {}

            // Initialize all students as present by default
            studentList.forEach(student => {
                attendanceMap[student.id] = {
                    student_id: student.id,
                    status: 'present',
                    class_id: student.class_id
                }
            })

            // Override with existing attendance records
            data?.forEach(record => {
                attendanceMap[record.student_id] = {
                    student_id: record.student_id,
                    class_id: record.class_id,
                    status: record.status,
                    reason: record.reason || '',
                    time_in: record.time_in ? new Date(record.time_in).toLocaleTimeString() : '',
                    marked_at: record.created_at
                }
            })

            setAttendance(attendanceMap)
        } catch (error) {
            console.error('Error fetching existing attendance:', error)
            showNotification('error', 'Failed to load existing attendance records')
        }
    }, [selectedDate, showNotification])

    // Enhanced attendance update
    const updateAttendanceStatus = useCallback((studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
        if (status === 'absent' || status === 'excused') {
            setShowReasonModal(studentId)
            setCurrentReason(attendance[studentId]?.reason || '')
        }

        setAttendance(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                status,
                time_in: status === 'present' || status === 'late' ? new Date().toLocaleTimeString() : undefined,
                marked_at: new Date().toISOString()
            }
        }))
    }, [attendance])

    // Bulk actions
    const handleBulkAction = useCallback((action: 'present' | 'absent') => {
        const updates: Record<string, AttendanceRecord> = {}

        selectedStudents.forEach(studentId => {
            updates[studentId] = {
                ...attendance[studentId],
                status: action,
                time_in: action === 'present' ? new Date().toLocaleTimeString() : undefined,
                marked_at: new Date().toISOString()
            }
        })

        setAttendance(prev => ({ ...prev, ...updates }))
        setSelectedStudents(new Set())
        showNotification('success', `Marked ${selectedStudents.size} students as ${action}`)
    }, [selectedStudents, attendance, showNotification])

    // Save attendance
    const saveAttendance = useCallback(async () => {
        if (!selectedTeacher) {
            showNotification('warning', 'Please select a teacher who is marking the attendance')
            return
        }

        if (students.length === 0) {
            showNotification('warning', 'No students to save attendance for')
            return
        }

        setSaving(true)
        try {
            const attendanceRecords = Object.values(attendance).map(record => {
                const student = students.find(s => s.id === record.student_id)

                return {
                    student_id: record.student_id,
                    date: selectedDate,
                    status: record.status,
                    time_in: record.time_in ? new Date(`${selectedDate} ${record.time_in}`).toISOString() : null,
                    reason: record.reason || null,
                    class_id: student ? student.class_id : null,
                    marked_by: selectedTeacher,
                    updated_at: new Date().toISOString()
                }
            })

            const { error } = await supabase
                .from('attendance')
                .upsert(attendanceRecords, {
                    onConflict: 'student_id,date'
                })

            if (error) throw error

            showNotification('success', `Attendance saved successfully for ${attendanceRecords.length} students!`)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            console.error('Error saving attendance:', error)
            showNotification('error', `Error saving attendance: ${errorMessage}`)
        } finally {
            setSaving(false)
        }
    }, [selectedTeacher, students, attendance, selectedDate, showNotification])

    // Effects
    useEffect(() => {
        fetchClasses()
        fetchTeachers()
    }, [fetchClasses])

    useEffect(() => {
        fetchStudents()
    }, [fetchStudents])

    // Helper functions
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present': return 'text-emerald-700 bg-emerald-50 border-emerald-200'
            case 'absent': return 'text-red-700 bg-red-50 border-red-200'
            case 'late': return 'text-amber-700 bg-amber-50 border-amber-200'
            case 'excused': return 'text-blue-700 bg-blue-50 border-blue-200'
            default: return 'text-gray-700 bg-gray-50 border-gray-200'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'present': return CheckCircle
            case 'absent': return XCircle
            case 'late': return Clock
            case 'excused': return AlertTriangle
            default: return User
        }
    }

    const selectedTeacherInfo = teachers.find(t => t.id === selectedTeacher)

    return (
        <div className="min-h-screen bg-[#F6F9FC]">
            {/* Notification System */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 max-w-md rounded-xl border-2 shadow-float transform transition-all duration-300 ${notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                        notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                            notification.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                                'bg-blue-50 border-blue-200 text-blue-800'
                    }`}>
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                {notification.type === 'success' && <Check className="w-5 h-5 text-emerald-600" />}
                                {notification.type === 'error' && <X className="w-5 h-5 text-red-600" />}
                                {notification.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-600" />}
                                {notification.type === 'info' && <Bell className="w-5 h-5 text-blue-600" />}
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-semibold">{notification.message}</p>
                            </div>
                            <button
                                onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                                className="ml-4 inline-flex text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-3 lg:px-4 py-4 space-y-6">
                {/* Enhanced Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                    <div className="space-y-2">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Mark Attendance
                            </h1>
                            <p className="text-gray-600 font-medium">
                                Efficient digital attendance management system
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="relative">
                            <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 transition-all duration-200 font-medium"
                            />
                        </div>
                        <button
                            onClick={saveAttendance}
                            disabled={saving || students.length === 0 || !selectedTeacher}
                            className="px-6 py-3 gradient-primary text-white rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-glow hover:shadow-xl transform hover:scale-105"
                        >
                            <Save className={`w-4 h-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
                            {saving ? 'Saving...' : 'Save Attendance'}
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
                    {/* Stats Cards */}
                    {students.length > 0 && (
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-blue-700">{attendanceStats.total}</div>
                                        <div className="text-sm text-blue-600 font-medium">Total Students</div>
                                    </div>
                                    <Users className="w-8 h-8 text-blue-500 opacity-80" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-emerald-700">{attendanceStats.present}</div>
                                        <div className="text-sm text-emerald-600 font-medium">Present</div>
                                    </div>
                                    <CheckCircle className="w-8 h-8 text-emerald-500 opacity-80" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-red-700">{attendanceStats.absent}</div>
                                        <div className="text-sm text-red-600 font-medium">Absent</div>
                                    </div>
                                    <XCircle className="w-8 h-8 text-red-500 opacity-80" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-amber-700">{attendanceStats.late}</div>
                                        <div className="text-sm text-amber-600 font-medium">Late</div>
                                    </div>
                                    <Clock className="w-8 h-8 text-amber-500 opacity-80" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-purple-700">{attendanceStats.presentPercentage}%</div>
                                        <div className="text-sm text-purple-600 font-medium">Attendance Rate</div>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-purple-500 opacity-80" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>



                {/* Selection Controls */}
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Class Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Select Class
                            </label>
                            <select
                                value={selectedClass}
                                onChange={(e) => {
                                    setSelectedClass(e.target.value)
                                    setStudents([])
                                    setAttendance({})
                                }}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 transition-all duration-200 text-gray-900 font-medium"
                            >
                                <option value="">Choose Class</option>
                                {classes.map(className => (
                                    <option key={className} value={className}>{className}</option>
                                ))}
                            </select>
                        </div>

                        {/* Teacher Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Select Teacher
                            </label>
                            <select
                                value={selectedTeacher}
                                onChange={(e) => setSelectedTeacher(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 transition-all duration-200 text-gray-900 font-medium"
                            >
                                <option value="">Choose Teacher</option>
                                {teachers.map(teacher => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.full_name} ({teacher.employee_id})
                                    </option>
                                ))}
                            </select>
                            {selectedTeacherInfo && (
                                <p className="text-xs text-gray-500 mt-1 font-medium">
                                    Subject: {selectedTeacherInfo.subject_specialization}
                                </p>
                            )}
                        </div>

                        {/* Search */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Search Students
                            </label>
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search by name, roll no..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Teacher Info Card */}
                    {selectedTeacherInfo && (
                        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                                    {selectedTeacherInfo.profile_picture ? (
                                        <img
                                            src={selectedTeacherInfo.profile_picture}
                                            alt={selectedTeacherInfo.full_name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <UserCheck className="w-6 h-6 text-white" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-blue-900 text-lg">
                                        {selectedTeacherInfo.full_name}
                                    </p>
                                    <p className="text-sm text-blue-700 font-medium">
                                        Employee ID: {selectedTeacherInfo.employee_id} • Subject: {selectedTeacherInfo.subject_specialization}
                                    </p>
                                </div>
                                <div className="px-4 py-2 bg-blue-200 text-blue-800 rounded-xl text-xs font-bold">
                                    Marking Attendance
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filter Controls */}
                    {students.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                                <div className="flex flex-wrap items-center gap-3">
                                    <Filter className="w-5 h-5 text-gray-500" />
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                                        className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-primary font-medium"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="present">Present</option>
                                        <option value="absent">Absent</option>
                                        <option value="late">Late</option>
                                        <option value="excused">Excused</option>
                                    </select>
                                    <select
                                        value={filters.gender}
                                        onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value as any }))}
                                        className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-primary font-medium"
                                    >
                                        <option value="all">All Genders</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Bulk Actions */}
                                {selectedStudents.size > 0 && (
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-600 font-semibold">
                                            {selectedStudents.size} selected
                                        </span>
                                        <button
                                            onClick={() => handleBulkAction('present')}
                                            className="px-5 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 text-sm font-semibold shadow-soft"
                                        >
                                            Mark Present
                                        </button>
                                        <button
                                            onClick={() => handleBulkAction('absent')}
                                            className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 text-sm font-semibold shadow-soft"
                                        >
                                            Mark Absent
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Students Grid */}
                {loading ? (
                    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-16">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 border-4 border-blue-200 border-t-primary rounded-full animate-spin"></div>
                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Students</h3>
                                <p className="text-gray-600">Please wait while we fetch the student data...</p>
                            </div>
                        </div>
                    </div>
                ) : filteredStudents.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {selectedClass} Students
                                </h2>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center text-sm text-gray-600 bg-white px-4 py-2 rounded-xl border border-gray-200 font-medium">
                                        <Users className="w-4 h-4 mr-2" />
                                        {filteredStudents.length} students
                                    </div>
                                    <button className="flex items-center text-sm text-primary hover:text-accent font-semibold transition-colors">
                                        <Download className="w-4 h-4 mr-1" />
                                        Export
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredStudents.map((student) => {
                                    const currentStatus = attendance[student.id]?.status || 'present'
                                    const StatusIcon = getStatusIcon(currentStatus)
                                    const isSelected = selectedStudents.has(student.id)

                                    return (
                                       <div
  key={student.id}
  className="rounded-2xl border border-blue-100 bg-white/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(33,150,243,0.1)] overflow-hidden transition-all duration-300 hover:shadow-[0_10px_40px_rgba(33,150,243,0.15)]"
>
  {/* Header */}
  <div className="flex items-center justify-between px-5 py-4 border-b border-blue-100/70 bg-gradient-to-br from-white/70 to-blue-50/50 backdrop-blur-md">
    <div className="flex items-center gap-4">
      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-inner flex items-center justify-center">
        {student.profile_picture ? (
          <img
            src={student.profile_picture}
            alt={student.full_name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-white font-semibold text-lg">
            {student.full_name[0].toUpperCase()}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-base font-bold text-gray-900 leading-tight">{student.full_name}</h3>
        <p className="text-sm text-gray-500 font-medium">
          Roll: {student.roll_number} • {student.section} • {student.gender}
        </p>
      </div>
    </div>

    <input
      type="checkbox"
      checked={isSelected}
      onChange={(e) => {
        const newSelected = new Set(selectedStudents);
        if (e.target.checked) newSelected.add(student.id);
        else newSelected.delete(student.id);
        setSelectedStudents(newSelected);
      }}
      className="w-5 h-5 rounded-md border border-blue-300 focus:ring-2 focus:ring-blue-400 bg-white/70"
    />
  </div>

  {/* Current Status */}
  <div className="flex items-center justify-center gap-2 mx-5 mt-4 mb-3 bg-white/70 border border-blue-100 rounded-xl px-3 py-2 shadow-sm">
    <svg
      className="w-5 h-5 text-blue-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
    </svg>
    <span className="text-sm font-medium text-gray-700">
      {attendance[student.id]?.status
        ? attendance[student.id].status.charAt(0).toUpperCase() +
          attendance[student.id].status.slice(1)
        : "Not Marked"}
    </span>
  </div>

  {/* Status Buttons */}
  <div className="grid grid-cols-2 gap-3 px-5 pb-5">
    <button
      onClick={() => updateAttendanceStatus(student.id, "present")}
      className={`flex flex-col items-center justify-center rounded-xl py-2.5 font-semibold text-sm shadow border transition-all ${
        currentStatus === "present"
          ? "bg-green-100 text-green-700 border-green-300 ring-2 ring-green-200"
          : "bg-white/60 text-green-700 border-blue-100 hover:bg-green-50 hover:border-green-200"
      }`}
    >
      <CheckCircle className="w-5 h-5 mb-1" />
      Present
    </button>

    <button
      onClick={() => updateAttendanceStatus(student.id, "absent")}
      className={`flex flex-col items-center justify-center rounded-xl py-2.5 font-semibold text-sm shadow border transition-all ${
        currentStatus === "absent"
          ? "bg-red-100 text-red-700 border-red-300 ring-2 ring-red-200"
          : "bg-white/60 text-red-700 border-blue-100 hover:bg-red-50 hover:border-red-200"
      }`}
    >
      <XCircle className="w-5 h-5 mb-1" />
      Absent
    </button>

    <button
      onClick={() => updateAttendanceStatus(student.id, "late")}
      className={`flex flex-col items-center justify-center rounded-xl py-2.5 font-semibold text-sm shadow border transition-all ${
        currentStatus === "late"
          ? "bg-yellow-100 text-yellow-700 border-yellow-300 ring-2 ring-yellow-200"
          : "bg-white/60 text-yellow-700 border-blue-100 hover:bg-yellow-50 hover:border-yellow-200"
      }`}
    >
      <Clock className="w-5 h-5 mb-1" />
      Late
    </button>

    <button
      onClick={() => updateAttendanceStatus(student.id, "excused")}
      className={`flex flex-col items-center justify-center rounded-xl py-2.5 font-semibold text-sm shadow border transition-all ${
        currentStatus === "excused"
          ? "bg-blue-100 text-blue-700 border-blue-300 ring-2 ring-blue-200"
          : "bg-white/60 text-blue-700 border-blue-100 hover:bg-blue-50 hover:border-blue-200"
      }`}
    >
      <AlertTriangle className="w-5 h-5 mb-1" />
      Excused
    </button>
  </div>

  {/* Last Updated */}
  {attendance[student.id]?.marked_at && (
    <div className="text-center pb-4">
      <span className="text-xs text-gray-400 font-medium">
        Last updated:{" "}
        {new Date(attendance[student.id].marked_at!).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </span>
    </div>
  )}
</div>



                                    )
                                })}
                            </div>
                        </div>
                    </div>
                ) : selectedClass ? (
                    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-16">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Students Found</h3>
                            <p className="text-gray-600 text-lg">
                                No active students found for <span className="font-bold">{selectedClass}</span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-16">
                        <div className="text-center">
                            <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                                <Calendar className="w-12 h-12 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start</h3>
                            <p className="text-gray-600 text-lg mb-6">
                                Please select a class and teacher to view students and mark attendance
                            </p>
                            <div className="flex justify-center space-x-2">
                                <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reason Modal */}
                {showReasonModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-float border border-gray-100 transform transition-all">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mr-4 shadow-soft">
                                    <AlertTriangle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Add Reason</h3>
                                    <p className="text-sm text-gray-600">Please provide a reason for this status</p>
                                </div>
                            </div>

                            <textarea
                                value={currentReason}
                                onChange={(e) => setCurrentReason(e.target.value)}
                                placeholder="Enter reason for absence/excuse..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-gray-50"
                                rows={4}
                                autoFocus
                            />

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowReasonModal(null)
                                        setCurrentReason('')
                                    }}
                                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors rounded-xl hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (showReasonModal) {
                                            setAttendance(prev => ({
                                                ...prev,
                                                [showReasonModal]: {
                                                    ...prev[showReasonModal],
                                                    reason: currentReason
                                                }
                                            }))
                                        }
                                        setShowReasonModal(null)
                                        setCurrentReason('')
                                    }}
                                    className="px-6 py-3 gradient-primary text-white rounded-xl hover:opacity-90 transition-all duration-200 font-semibold shadow-glow hover:shadow-xl transform hover:scale-105"
                                >
                                    Save Reason
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MarkAttendance
