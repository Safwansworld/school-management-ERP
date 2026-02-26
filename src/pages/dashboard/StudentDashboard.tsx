import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Bell,
  FileText,
  BarChart3,
  Users,
  RefreshCw
} from 'lucide-react'

interface Course {
  id: string
  name: string
  teacher: string
  progress: number
  grade: string
  color: string
}

interface Assignment {
  id: string
  title: string
  subject: string
  dueDate: string
  status: 'pending' | 'submitted' | 'overdue'
}

interface ClassSchedule {
  id: string
  subject: string
  teacher: string
  time: string
  room: string
}

const StudentDashboard = () => {
  const { user } = useAuth()

  // Mock data - Replace with actual API calls
  const stats = [
    {
      title: 'Attendance Rate',
      value: '94.5%',
      icon: <CheckCircle className="w-6 h-6 text-blue-500" />,
      bgColor: 'bg-blue-100',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Current GPA',
      value: '3.8',
      icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
      bgColor: 'bg-green-100',
      trend: '+5%',
      trendUp: true
    },
    {
      title: 'Active Courses',
      value: '6',
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      bgColor: 'bg-purple-100',
      trend: '-2%',
      trendUp: false
    },
    {
      title: 'Completed Assignments',
      value: '42',
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      bgColor: 'bg-orange-100',
      trend: '+12%',
      trendUp: true
    }
  ]

  const courses: Course[] = [
    { id: '1', name: 'Mathematics', teacher: 'Mr. Johnson', progress: 85, grade: 'A', color: 'blue' },
    { id: '2', name: 'Physics', teacher: 'Dr. Smith', progress: 78, grade: 'B+', color: 'green' },
    { id: '3', name: 'Chemistry', teacher: 'Mrs. Davis', progress: 92, grade: 'A+', color: 'purple' },
    { id: '4', name: 'English Literature', teacher: 'Ms. Brown', progress: 88, grade: 'A', color: 'pink' },
    { id: '5', name: 'Biology', teacher: 'Dr. Wilson', progress: 81, grade: 'A-', color: 'teal' },
    { id: '6', name: 'History', teacher: 'Mr. Anderson', progress: 76, grade: 'B+', color: 'indigo' }
  ]

  const assignments: Assignment[] = [
    { id: '1', title: 'Calculus Problem Set', subject: 'Mathematics', dueDate: 'Tomorrow', status: 'pending' },
    { id: '2', title: 'Physics Lab Report', subject: 'Physics', dueDate: '2 days', status: 'pending' },
    { id: '3', title: 'Chemistry Quiz', subject: 'Chemistry', dueDate: 'Today', status: 'overdue' },
    { id: '4', title: 'Essay Writing', subject: 'English', dueDate: 'Next Week', status: 'submitted' },
    { id: '5', title: 'Biology Presentation', subject: 'Biology', dueDate: '3 days', status: 'pending' }
  ]

  const todaySchedule: ClassSchedule[] = [
    { id: '1', subject: 'Mathematics', teacher: 'Mr. Johnson', time: '08:00 - 09:00', room: 'Room 101' },
    { id: '2', subject: 'Physics', teacher: 'Dr. Smith', time: '09:15 - 10:15', room: 'Lab 201' },
    { id: '3', subject: 'Chemistry', teacher: 'Mrs. Davis', time: '10:30 - 11:30', room: 'Lab 202' },
    { id: '4', subject: 'English', teacher: 'Ms. Brown', time: '12:00 - 13:00', room: 'Room 105' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'submitted': return 'bg-green-50 text-green-700 border-green-200'
      case 'overdue': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500'
    if (progress >= 75) return 'bg-blue-500'
    if (progress >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Main Content */}
      <div className="p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome {user?.user_metadata?.full_name || 'Student'}
              </h1>
              <p className="text-gray-500">Here's your school overview for today</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Calendar className="w-5 h-5" />
                View Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                  stat.trendUp ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <TrendingUp className={`w-3 h-3 ${
                    stat.trendUp ? 'text-green-500' : 'text-red-500 rotate-180'
                  }`} />
                  <span className={`text-xs font-medium ${
                    stat.trendUp ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid - Attendance Trends & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Grade Trends */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Grade Trends</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {[85, 78, 92, 88, 81, 76, 89, 95, 87, 90, 93, 91].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center justify-end">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-400"
                    style={{ height: `${value}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>

          {/* Performance Donut Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance</h3>
            <div className="flex items-center justify-center h-64">
              <div className="relative w-48 h-48">
                {/* Donut Chart SVG */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* A+ */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="12"
                    strokeDasharray="75.4 251.2"
                    strokeDashoffset="0"
                  />
                  {/* A */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="12"
                    strokeDasharray="62.8 251.2"
                    strokeDashoffset="-75.4"
                  />
                  {/* B+ */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#93C5FD"
                    strokeWidth="12"
                    strokeDasharray="50.2 251.2"
                    strokeDashoffset="-138.2"
                  />
                  {/* B */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#DBEAFE"
                    strokeWidth="12"
                    strokeDasharray="62.8 251.2"
                    strokeDashoffset="-188.4"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">3.8</p>
                    <p className="text-sm text-gray-500">GPA</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">A+ (30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-sm text-gray-600">A (25%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                <span className="text-sm text-gray-600">B+ (20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-200"></div>
                <span className="text-sm text-gray-600">B (25%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* My Courses Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">My Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{course.name}</h4>
                    <p className="text-sm text-gray-500">{course.teacher}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-semibold rounded-lg">
                    {course.grade}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-900">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`${getProgressColor(course.progress)} h-2 rounded-full transition-all`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Grid - Schedule and Assignments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Today's Schedule</h3>
            <div className="space-y-3">
              {todaySchedule.map((schedule) => (
                <div 
                  key={schedule.id} 
                  className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-28">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <Clock className="w-4 h-4 mr-2 text-blue-500" />
                      {schedule.time.split(' - ')[0]}
                    </div>
                  </div>
                  <div className="flex-1 ml-4">
                    <h4 className="font-semibold text-gray-900">{schedule.subject}</h4>
                    <p className="text-sm text-gray-500">{schedule.teacher} • {schedule.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignments - Takes 1 column */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Assignments</h3>
            <div className="space-y-3">
              {assignments.slice(0, 4).map((assignment) => (
                <div 
                  key={assignment.id} 
                  className={`p-4 rounded-xl border ${getStatusColor(assignment.status)}`}
                >
                  <h4 className="font-medium text-sm mb-1">{assignment.title}</h4>
                  <p className="text-xs text-gray-600 mb-3">{assignment.subject}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium">Due: {assignment.dueDate}</span>
                    {assignment.status === 'overdue' && <AlertCircle className="w-4 h-4" />}
                    {assignment.status === 'submitted' && <CheckCircle className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
