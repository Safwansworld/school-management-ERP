import React, { useState, useMemo } from 'react';
import { ExamSchedule } from '../../types/Exam'
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Users, 
  Edit, 
  Trash2,
  CheckCircle,
  Play,
  XCircle,
  Pause,
  ClockIcon,
  Calendar as CalendarIcon,
  BookOpen
} from 'lucide-react';

interface ExamCalendarProps {
  exams: ExamSchedule[];
  onEditExam: (exam: ExamSchedule) => void;
  onDeleteExam: (examId: string) => void;
}

// Helper function to format date in local timezone
const formatDateToLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ExamCalendar: React.FC<ExamCalendarProps> = ({ exams, onEditExam, onDeleteExam }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentDate]);

  // Group exams by date
  const examsByDate = useMemo(() => {
    return exams.reduce((acc, exam) => {
      const date = exam.exam_date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(exam);
      return acc;
    }, {} as Record<string, ExamSchedule[]>);
  }, [exams]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const getExamsForDate = (date: Date) => {
    const dateStr = formatDateToLocal(date);
    return examsByDate[dateStr] || [];
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
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

  const selectedDateExams = selectedDate ? examsByDate[selectedDate] || [] : [];

  return (
    <div className="p-6">
      {/* Modern Calendar Header */}
      <div className="bg-white rounded-[20px] p-6 mb-6 shadow-soft border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <p className="text-gray-600 font-medium text-sm">Examination Calendar</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="w-10 h-10 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 text-gray-600 hover:text-[#1E88E5] flex items-center justify-center shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-6 py-2.5 gradient-primary text-white font-semibold rounded-xl shadow-glow hover:shadow-float transition-all duration-300"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="w-10 h-10 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 text-gray-600 hover:text-[#1E88E5] flex items-center justify-center shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Modern Calendar Grid */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 text-center text-sm font-semibold text-gray-700 bg-gray-50 rounded-xl border border-gray-100">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date, index) => {
                const dateStr = formatDateToLocal(date);
                const dayExams = getExamsForDate(date);
                const isSelected = selectedDate === dateStr;

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                    className={`
                      group min-h-[100px] p-3 border rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1
                      ${isCurrentMonth(date) 
                        ? 'bg-white border-gray-200 hover:bg-gray-50' 
                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                      }
                      ${isToday(date) 
                        ? 'ring-2 ring-[#1E88E5]/50 bg-[#1E88E5]/5 border-[#1E88E5]/30 shadow-md' 
                        : ''
                      }
                      ${isSelected 
                        ? 'ring-2 ring-[#5B9FFF]/50 bg-[#5B9FFF]/5 border-[#5B9FFF]/30 shadow-lg' 
                        : ''
                      }
                      hover:shadow-md
                    `}
                  >
                    <div className={`text-sm font-semibold mb-2 ${
                      isCurrentMonth(date) 
                        ? isToday(date) 
                          ? 'text-[#1E88E5]' 
                          : 'text-gray-900' 
                        : 'text-gray-400'
                    }`}>
                      {date.getDate()}
                    </div>
                    
                    {dayExams.length > 0 && (
                      <div className="space-y-1">
                        {dayExams.slice(0, 2).map(exam => (
                          <div
                            key={exam.id}
                            className={`text-xs px-2 py-1 rounded-lg border text-center font-medium ${getStatusColor(exam.status)}`}
                          >
                            {exam.subjects?.subject_code}
                          </div>
                        ))}
                        {dayExams.length > 2 && (
                          <div className="text-xs text-gray-500 text-center font-medium bg-gray-100 rounded-lg py-1">
                            +{dayExams.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Date Details Panel */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-[20px] p-6 shadow-soft border border-gray-100 sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {selectedDate ? 'Exam Details' : 'Select Date'}
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  {selectedDate 
                    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })
                    : 'Click on a date'
                  }
                </p>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {selectedDateExams.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateExams.map(exam => (
                    <div key={exam.id} className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 hover:bg-gray-50 hover:shadow-sm transition-all duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{exam.exam_name}</h4>
                          <p className="text-sm text-gray-600 font-medium">
                            {exam.subjects?.subject_name}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">
                            ({exam.subjects?.subject_code})
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => onEditExam(exam)}
                            className="w-8 h-8 bg-white border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 text-gray-600 hover:text-green-600 flex items-center justify-center transition-all duration-300"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteExam(exam.id)}
                            className="w-8 h-8 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 text-gray-600 hover:text-red-600 flex items-center justify-center transition-all duration-300"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="w-5 h-5 bg-[#1E88E5]/10 rounded flex items-center justify-center">
                            <Clock size={12} className="text-[#1E88E5]" />
                          </div>
                          <span className="font-medium">
                            {formatTime(exam.start_time)} - {formatTime(exam.end_time)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                            <Users size={12} className="text-purple-600" />
                          </div>
                          <span className="font-medium">
                            {exam.classes?.class_name} - {exam.classes?.section}
                          </span>
                        </div>

                        {exam.room_number && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                              <MapPin size={12} className="text-green-600" />
                            </div>
                            <span className="font-medium">{exam.room_number}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border font-semibold ${getStatusColor(exam.status)}`}>
                          {getStatusIcon(exam.status)}
                          <span>{exam.status.replace('_', ' ').toUpperCase()}</span>
                        </div>
                        <div className="text-xs text-gray-700 font-semibold bg-gray-100 px-3 py-2 rounded-lg">
                          {exam.max_marks} marks
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : selectedDate ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No exams scheduled</p>
                  <p className="text-gray-500 text-sm">for this date</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-8 h-8 text-[#1E88E5]" />
                  </div>
                  <p className="text-gray-700 font-medium">Select a date</p>
                  <p className="text-gray-600 text-sm">to view scheduled exams</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
  );
};

export default ExamCalendar;
