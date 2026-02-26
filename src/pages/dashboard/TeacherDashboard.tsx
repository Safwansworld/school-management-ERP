// src/pages/dashboard/TeacherDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Users,
  BookOpen,
  ClipboardList,
  Calendar,
  TrendingUp,
  Award,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  attendanceToday: number;
  upcomingExams: number;
}

const TeacherDashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClasses: 0,
    totalStudents: 0,
    attendanceToday: 0,
    upcomingExams: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const fetchDashboardData = async () => {
    try {
      // Fetch classes assigned to teacher
      const { data: classes, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('class_teacher_id', user?.id);

      // Fetch total students in teacher's classes
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .in(
          'class_id',
          classes?.map((c) => c.id) || []
        );

      // Fetch today's attendance (marked by this teacher)
      const today = new Date().toISOString().split('T')[0];
      const { count: attendanceCount } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('marked_by', user?.id)
        .eq('date', today);

      // Fetch upcoming exams
      const { count: examCount } = await supabase
        .from('exams')
        .select('*', { count: 'exact', head: true })
        .gte('exam_date', today);

      setStats({
        totalClasses: classes?.length || 0,
        totalStudents: studentCount || 0,
        attendanceToday: attendanceCount || 0,
        upcomingExams: examCount || 0,
      });

      // Fetch recent activities (attendance, assignments, etc.)
      const { data: activities } = await supabase
        .from('attendance')
        .select('*, class:classes(class_name)')
        .eq('marked_by', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentActivities(activities || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = () => {
    if (userProfile) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    return user?.username || 'Teacher';
  };

  const statCards = [
    {
      title: 'My Classes',
      value: stats.totalClasses,
      icon: BookOpen,
      color: 'bg-blue-500',
      link: '/classes',
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-green-500',
      link: '/students',
    },
    {
      title: "Today's Attendance",
      value: stats.attendanceToday,
      icon: ClipboardList,
      color: 'bg-purple-500',
      link: '/attendance/student',
    },
    {
      title: 'Upcoming Exams',
      value: stats.upcomingExams,
      icon: Calendar,
      color: 'bg-orange-500',
      link: '/exams',
    },
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {getDisplayName()}!</h1>
            <p className="text-blue-100">
              Here's what's happening with your classes today.
            </p>
          </div>
          <Award className="w-16 h-16 opacity-80" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              to="/attendance/student"
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <ClipboardList className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Mark Attendance</span>
            </Link>
            <Link
              to="/exams"
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Schedule Exam</span>
            </Link>
            <Link
              to="/students"
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <Users className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">View Students</span>
            </Link>
            <Link
              to="/results"
              className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <Award className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-900">Enter Results</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <ClipboardList className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Attendance marked for {activity.class?.class_name || 'Class'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activities</p>
            )}
          </div>
        </div>
      </div>

      {/* Role Badge */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 flex items-center gap-2">
          <Award className="w-5 h-5" />
          <span className="font-semibold">Role:</span> Teacher
        </p>
      </div>
    </div>
  );
};

export default TeacherDashboard;
