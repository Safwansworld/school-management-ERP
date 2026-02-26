import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import {
  CheckCircleIcon,
  XCircleIcon,
  Clock3Icon,
  AlertTriangleIcon,
  UserIcon,
  CalendarIcon,
  SearchIcon,
  SaveIcon,
  UsersIcon,
  UserCheckIcon,
  FilterIcon,
  BellIcon,
  CheckIcon,
  XIcon,
  ClockIcon,
  AlertCircleIcon,
  TrendingUpIcon,
} from 'lucide-react'

// Create a simplified interface for attendance purposes
interface TeacherForAttendance {
  id: string
  full_name: string
  employee_id: string
  subject_specialization: string
  status: 'active' | 'inactive' | 'on_leave'
  profile_picture?: string
}

// Keep the full interface if needed elsewhere, but mark properties as optional
interface Teacher {
  id: string
  full_name: string
  employee_id: string
  subject_specialization: string
  phone_number?: string
  email?: string
  address?: string
  date_of_birth?: string
  date_of_joining?: string
  qualification?: string
  experience_years?: number
  salary?: number
  profile_picture?: string
  status: 'active' | 'inactive' | 'on_leave'
  gender?: 'male' | 'female' | 'other'
  emergency_contact?: string
  created_at?: string
  updated_at?: string
}

interface AttendanceRecord {
  teacher_id: string
  status: 'present' | 'absent' | 'late' | 'leave'
  reason?: string
  time_in?: string
  time_out?: string
  marked_at?: string
}

interface AttendanceStats {
  total: number
  present: number
  absent: number
  late: number
  leave: number
  presentPercentage: number
}

interface FilterOptions {
  status: 'all' | 'present' | 'absent' | 'late' | 'leave'
}

const MarkTeacherAttendance = () => {
  // State management
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [teachers, setTeachers] = useState<TeacherForAttendance[]>([])
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({})
  
  // Loading and UI states
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showReasonModal, setShowReasonModal] = useState<string | null>(null)
  const [currentReason, setCurrentReason] = useState('')
  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set())

  // Enhanced filter state
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all'
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
    const leave = values.filter(a => a.status === 'leave').length
    const presentPercentage = total > 0 ? Math.round((present / total) * 100) : 0

    return { total, present, absent, late, leave, presentPercentage }
  }, [attendance])

  // Enhanced filtered teachers with better performance
  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher =>
      teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject_specialization.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [teachers, searchTerm])

  const fetchTeachers = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('id, full_name, employee_id, subject_specialization, status, profile_picture')
        .order('full_name', { ascending: true })

      if (error) throw error
      
      // Type assertion since we're selecting specific fields
      setTeachers(data as TeacherForAttendance[] || [])
      
      // Fetch existing attendance for today's teachers
      if (data && data.length > 0) {
        await fetchExistingAttendance(data as TeacherForAttendance[])
      }
    } catch (error) {
      console.error('Error fetching teachers:', error)
      showNotification('error', 'Failed to load teachers')
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  const fetchExistingAttendance = useCallback(async (teacherList: TeacherForAttendance[]) => {
    try {
      const { data, error } = await supabase
        .from('teacher_attendance')
        .select('*')
        .eq('date', selectedDate)
        .in('teacher_id', teacherList.map(t => t.id))

      if (error) {
        console.log('Error fetching attendance (may be expected for new setup):', error)
      }

      const attendanceMap: Record<string, AttendanceRecord> = {}

      // Initialize all teachers as present by default
      teacherList.forEach(teacher => {
        attendanceMap[teacher.id] = {
          teacher_id: teacher.id,
          status: 'present',
        }
      })

      // Override with existing attendance records if they exist
      data?.forEach(record => {
        if (record.teacher_id && attendanceMap[record.teacher_id]) {
          attendanceMap[record.teacher_id] = {
            teacher_id: record.teacher_id,
            status: record.status,
            reason: record.reason || '',
            time_in: record.time_in ? new Date(record.time_in).toLocaleTimeString() : '',
            marked_at: record.created_at
          }
        }
      })

      setAttendance(attendanceMap)
    } catch (error) {
      console.error('Error fetching existing attendance:', error)
    }
  }, [selectedDate])

  // Enhanced attendance update with optimistic updates
  const updateAttendanceStatus = useCallback((teacherId: string, status: 'present' | 'absent' | 'late' | 'leave') => {
    if (status === 'absent' || status === 'leave') {
      setShowReasonModal(teacherId)
      setCurrentReason(attendance[teacherId]?.reason || '')
    }

    // Optimistic update
    setAttendance(prev => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        status,
        time_in: status === 'present' || status === 'late' ? new Date().toLocaleTimeString() : undefined,
        marked_at: new Date().toISOString()
      }
    }))
  }, [attendance])

  // Bulk actions for better UX
  const handleBulkAction = useCallback((action: 'present' | 'absent') => {
    const updates: Record<string, AttendanceRecord> = {}

    selectedTeachers.forEach(teacherId => {
      updates[teacherId] = {
        ...attendance[teacherId],
        status: action,
        time_in: action === 'present' ? new Date().toLocaleTimeString() : undefined,
        marked_at: new Date().toISOString()
      }
    })

    setAttendance(prev => ({ ...prev, ...updates }))
    setSelectedTeachers(new Set())
    showNotification('success', `Marked ${selectedTeachers.size} teachers as ${action}`)
  }, [selectedTeachers, attendance, showNotification])

  // Enhanced save with better error handling and progress indication
  const saveAttendance = useCallback(async () => {
    if (teachers.length === 0) {
      showNotification('warning', 'No teachers to save attendance for')
      return
    }

    setSaving(true)
    try {
      const attendanceRecords = Object.values(attendance).map(record => ({
        teacher_id: record.teacher_id,
        date: selectedDate,
        status: record.status,
        time_in: record.time_in ? new Date(`${selectedDate} ${record.time_in}`).toISOString() : null,
        reason: record.reason || null,
        updated_at: new Date().toISOString()
      }))

      // First, delete existing attendance for this date to avoid conflicts
      const { error: deleteError } = await supabase
        .from('teacher_attendance')
        .delete()
        .eq('date', selectedDate)
        .in('teacher_id', Object.keys(attendance))

      if (deleteError) {
        console.log('Note: No existing records to delete or delete not needed:', deleteError)
      }

      // Then insert new records
      const { error: insertError } = await supabase
        .from('teacher_attendance')
        .insert(attendanceRecords)

      if (insertError) throw insertError

      showNotification('success', `Attendance saved successfully for ${attendanceRecords.length} teachers!`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Error saving attendance:', error)
      
      // More specific error handling
      if (errorMessage.includes('teacher_id') || errorMessage.includes('column')) {
        showNotification('error', 'Database configuration error: Please check if the attendance table has the correct columns (teacher_id, date, status, etc.)')
      } else {
        showNotification('error', `Error saving attendance: ${errorMessage}`)
      }
    } finally {
      setSaving(false)
    }
  }, [teachers, attendance, selectedDate, showNotification])

  // Effects
  useEffect(() => {
    fetchTeachers()
  }, [fetchTeachers])

  useEffect(() => {
    if (teachers.length > 0) {
      fetchExistingAttendance(teachers)
    }
  }, [selectedDate, teachers, fetchExistingAttendance])

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-emerald-600 bg-emerald-50 border-emerald-200'
      case 'absent': return 'text-red-600 bg-red-50 border-red-200'
      case 'late': return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'leave': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return CheckCircleIcon
      case 'absent': return XCircleIcon
      case 'late': return Clock3Icon
      case 'leave': return AlertTriangleIcon
      default: return UserIcon
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Notification System */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-md rounded-xl border shadow-lg transform transition-all duration-300 ${notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
            notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              notification.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' && <CheckIcon className="w-5 h-5 text-emerald-500" />}
                {notification.type === 'error' && <XIcon className="w-5 h-5 text-red-500" />}
                {notification.type === 'warning' && <AlertCircleIcon className="w-5 h-5 text-amber-500" />}
                {notification.type === 'info' && <BellIcon className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                className="ml-4 inline-flex text-gray-400 hover:text-gray-600"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Teacher Attendance
                  </h1>
                  <p className="text-gray-600 font-medium">
                    Efficient digital attendance management for teachers
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200"
                />
              </div>
              <button
                onClick={saveAttendance}
                disabled={saving || teachers.length === 0}
                className="px-6 py-3 gradient-primary text-white rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-glow hover:shadow-xl transform hover:scale-105"
              >
                <SaveIcon className={`w-4 h-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
                {saving ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          </div>

        {/* Enhanced Header with Better Visual Hierarchy */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          

          {/* Enhanced Stats Cards */}
          {teachers.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-700">{attendanceStats.total}</div>
                    <div className="text-sm text-blue-600 font-medium">Total Teachers</div>
                  </div>
                  <UsersIcon className="w-8 h-8 text-blue-500 opacity-80" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-emerald-700">{attendanceStats.present}</div>
                    <div className="text-sm text-emerald-600 font-medium">Present</div>
                  </div>
                  <CheckCircleIcon className="w-8 h-8 text-emerald-500 opacity-80" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-700">{attendanceStats.absent}</div>
                    <div className="text-sm text-red-600 font-medium">Absent</div>
                  </div>
                  <XCircleIcon className="w-8 h-8 text-red-500 opacity-80" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-amber-700">{attendanceStats.late}</div>
                    <div className="text-sm text-amber-600 font-medium">Late</div>
                  </div>
                  <ClockIcon className="w-8 h-8 text-amber-500 opacity-80" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-700">{attendanceStats.presentPercentage}%</div>
                    <div className="text-sm text-purple-600 font-medium">Attendance Rate</div>
                  </div>
                  <TrendingUpIcon className="w-8 h-8 text-purple-500 opacity-80" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Selection Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          {/* Enhanced Search */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Search Teachers
            </label>
            <div className="relative">
              <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, employee ID, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200"
              />
            </div>
          </div>

          {/* Enhanced Filter Controls */}
          {teachers.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-wrap items-center gap-3">
                  <FilterIcon className="w-5 h-5 text-gray-500" />
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="leave">Leave</option>
                  </select>
                </div>

                {/* Bulk Actions */}
                {selectedTeachers.size > 0 && (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 font-medium">
                      {selectedTeachers.size} selected
                    </span>
                    <button
                      onClick={() => handleBulkAction('present')}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                    >
                      Mark Present
                    </button>
                    <button
                      onClick={() => handleBulkAction('absent')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Mark Absent
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Teachers Table */}
        {loading ? (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-500">Loading teachers...</div>
        ) : filteredTeachers.length > 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <table className="min-w-full border-collapse">
              <thead className="bg-blue-50 border-b border-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Employee ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Mark Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTeachers.map((teacher) => {
                  const currentAttendance = attendance[teacher.id]
                  const StatusIcon = currentAttendance ? getStatusIcon(currentAttendance.status) : UserIcon
                  const statusColor = currentAttendance ? getStatusColor(currentAttendance.status) : 'text-gray-600 bg-gray-50 border-gray-200'
                  
                  return (
                    <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{teacher.full_name}</td>
                      <td className="px-6 py-4 text-gray-700">{teacher.employee_id}</td>
                      <td className="px-6 py-4 text-gray-700">{teacher.subject_specialization}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <StatusIcon className="w-4 h-4" />
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                            {currentAttendance?.status || 'Not Marked'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          {['present', 'absent', 'late', 'leave'].map((status) => {
                            const Icon = getStatusIcon(status)
                            return (
                              <button
                                key={status}
                                onClick={() => updateAttendanceStatus(teacher.id, status as any)}
                                className={`p-2 rounded-full border transition-colors ${getStatusColor(status)} hover:scale-110 transform transition-transform`}
                                title={`Mark as ${status}`}
                              >
                                <Icon className="w-4 h-4" />
                              </button>
                            )
                          })}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-500">
            {searchTerm ? 'No teachers found matching your search.' : 'No teachers found.'}
          </div>
        )}

        {/* Enhanced Reason Modal */}
        {showReasonModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border border-gray-200 transform transition-all duration-300 scale-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <AlertTriangleIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Add Reason</h3>
                  <p className="text-sm text-gray-600">Please provide a reason for this status</p>
                </div>
              </div>

              <textarea
                value={currentReason}
                onChange={(e) => setCurrentReason(e.target.value)}
                placeholder="Enter reason for absence/leave..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50"
                rows={4}
                autoFocus
              />

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowReasonModal(null)
                    setCurrentReason('')
                  }}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors rounded-xl hover:bg-gray-50"
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
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
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

export default MarkTeacherAttendance