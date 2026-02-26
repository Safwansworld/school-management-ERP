// src/pages/dashboard/StaffDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Briefcase,
  Users,
  DollarSign,
  Library,
  Bus,
  CheckCircle,
  ArrowRight,
  Shield,
  Calendar,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface StaffProfile {
  staff_name: string;
  department: string;
  position: string;
  permissions: string[];
}

const StaffDashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [staffProfile, setStaffProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const fetchDashboardData = async () => {
    try {
      // Fetch staff profile
      const { data: profile, error } = await supabase
        .from('staff_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      setStaffProfile({
        staff_name: profile.staff_name,
        department: profile.department,
        position: profile.position,
        permissions: profile.permissions || [],
      });

      // Placeholder stats
      setStats({
        tasksCompleted: 12,
        pendingApprovals: 3,
      });
    } catch (error) {
      console.error('Error fetching staff data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = () => {
    if (staffProfile) {
      return staffProfile.staff_name;
    }
    if (userProfile) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    return user?.username || 'Staff';
  };

  // Permission-based quick actions
  const getAvailableActions = () => {
    const actions = [];
    const permissions = staffProfile?.permissions || [];

    if (permissions.includes('manage_attendance') || permissions.includes('view_attendance')) {
      actions.push({
        title: 'Mark Attendance',
        icon: CheckCircle,
        color: 'bg-blue-50 hover:bg-blue-100 text-blue-600',
        link: '/attendance/student',
      });
    }

    if (permissions.includes('manage_fees') || permissions.includes('view_fees')) {
      actions.push({
        title: 'Fee Management',
        icon: DollarSign,
        color: 'bg-green-50 hover:bg-green-100 text-green-600',
        link: '/fees',
      });
    }

    if (permissions.includes('manage_library') || permissions.includes('view_library')) {
      actions.push({
        title: 'Library',
        icon: Library,
        color: 'bg-purple-50 hover:bg-purple-100 text-purple-600',
        link: '/library',
      });
    }

    // Always available
    actions.push({
      title: 'Transport',
      icon: Bus,
      color: 'bg-orange-50 hover:bg-orange-100 text-orange-600',
      link: '/transport',
    });

    return actions;
  };

  const statCards = [
    {
      title: 'Tasks Completed',
      value: stats.tasksCompleted,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: Calendar,
      color: 'bg-orange-500',
    },
    {
      title: 'Active Permissions',
      value: staffProfile?.permissions.length || 0,
      icon: Shield,
      color: 'bg-blue-500',
    },
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {getDisplayName()}!</h1>
            <p className="text-green-100">
              {staffProfile?.position} • {staffProfile?.department} Department
            </p>
          </div>
          <Briefcase className="w-16 h-16 opacity-80" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions Based on Permissions */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-green-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {getAvailableActions().map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`flex items-center gap-3 p-4 rounded-lg transition-colors ${action.color}`}
            >
              <action.icon className="w-5 h-5" />
              <span className="font-medium text-gray-900">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Permissions List */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-500" />
          Your Permissions
        </h2>
        {staffProfile && staffProfile.permissions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {staffProfile.permissions.map((permission, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-green-50 p-3 rounded-lg"
              >
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">
                  {permission.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No permissions assigned</p>
        )}
      </div>

      {/* Role & Department Badge */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-green-800 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            <span className="font-semibold">Role:</span> Staff
          </p>
          <p className="text-green-800 flex items-center gap-2">
            <span className="font-semibold">Department:</span> {staffProfile?.department}
          </p>
          <p className="text-green-800 flex items-center gap-2">
            <span className="font-semibold">Position:</span> {staffProfile?.position}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
