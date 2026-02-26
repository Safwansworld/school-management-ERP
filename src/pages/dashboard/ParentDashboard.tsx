// src/pages/dashboard/ParentDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Users,
  GraduationCap,
  Calendar,
  Award,
  Bell,
  ArrowRight,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Child {
  id: string;
  student_name: string;
  class_name: string;
  roll_number: string;
  attendance_percentage?: number;
}

const ParentDashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChildren: 0,
    upcomingExams: 0,
    unreadNotifications: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const fetchDashboardData = async () => {
    try {
      // Fetch children linked to this parent
      const { data: childrenData, error } = await supabase
        .from('students')
        .select(`
          id,
          student_name,
          roll_number,
          class:classes(class_name)
        `)
        .eq('parent_id', user?.id);

      if (error) throw error;

      // Format children data
      const formattedChildren = childrenData?.map((child: any) => ({
        id: child.id,
        student_name: child.student_name,
        class_name: child.class?.class_name || 'N/A',
        roll_number: child.roll_number,
      })) || [];

      setChildren(formattedChildren);

      // Fetch upcoming exams
      const today = new Date().toISOString().split('T')[0];
      const { count: examCount } = await supabase
        .from('exams')
        .select('*', { count: 'exact', head: true })
        .gte('exam_date', today);

      setStats({
        totalChildren: formattedChildren.length,
        upcomingExams: examCount || 0,
        unreadNotifications: 5, // Placeholder
      });
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
    return user?.username || 'Parent';
  };

  const statCards = [
    {
      title: 'My Children',
      value: stats.totalChildren,
      icon: Users,
      color: 'bg-purple-500',
      link: '/my-children',
    },
    {
      title: 'Upcoming Exams',
      value: stats.upcomingExams,
      icon: Calendar,
      color: 'bg-orange-500',
      link: '/exams',
    },
    {
      title: 'Notifications',
      value: stats.unreadNotifications,
      icon: Bell,
      color: 'bg-red-500',
      link: '/notifications',
    },
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {getDisplayName()}!</h1>
            <p className="text-purple-100">
              Track your children's academic progress and stay connected.
            </p>
          </div>
          <GraduationCap className="w-16 h-16 opacity-80" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* My Children */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-500" />
          My Children
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.length > 0 ? (
            children.map((child) => (
              <Link
                key={child.id}
                to={`/my-children`}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-5 hover:shadow-md transition-all border border-purple-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-purple-500 p-2 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                    {child.class_name}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{child.student_name}</h3>
                <p className="text-sm text-gray-600">Roll No: {child.roll_number}</p>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No children records found</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            to="/attendance/my-attendance"
            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">View Attendance</span>
          </Link>
          <Link
            to="/results"
            className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Award className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-900">View Results</span>
          </Link>
          <Link
            to="/exams"
            className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
          >
            <BookOpen className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-gray-900">Exam Schedule</span>
          </Link>
          <Link
            to="/complaints"
            className="flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-red-600" />
            <span className="font-medium text-gray-900">Submit Complaint</span>
          </Link>
        </div>
      </div>

      {/* Role Badge */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-purple-800 flex items-center gap-2">
          <Users className="w-5 h-5" />
          <span className="font-semibold">Role:</span> Parent
        </p>
      </div>
    </div>
  );
};

export default ParentDashboard;
