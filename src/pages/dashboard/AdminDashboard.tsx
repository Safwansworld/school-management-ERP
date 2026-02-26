import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Bell,
  MapPin,
  Plus,
  RefreshCw,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface StatCard {
  id: string;
  name: string;
  value: string;
  icon: any;
  change?: number;
}

interface RecentActivity {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  user: string;
  status: 'success' | 'warning' | 'info' | 'error';
}

interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'exam' | 'meeting' | 'event' | 'holiday';
}

// Metric Card Component - With lighter font weight
const MetricCard = ({ stat, delay }: { stat: StatCard; delay: number }) => {
  const Icon = stat.icon;
  const isPositive = stat.change && stat.change > 0;
  const isNegative = stat.change && stat.change < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white rounded-[20px] p-7 shadow-soft border border-gray-100 hover:shadow-float transition-all duration-300"
    >
      {/* Icon and Change Badge */}
      <div className="flex items-start justify-between mb-5">
        <div className="w-14 h-14 rounded-[16px] bg-blue-50 flex items-center justify-center">
          <Icon className="w-7 h-7 text-blue-500" />
        </div>

        {stat.change !== undefined && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold ${
              isPositive
                ? 'bg-emerald-50 text-emerald-600'
                : isNegative
                ? 'bg-red-50 text-red-600'
                : 'bg-gray-50 text-gray-600'
            }`}
            style={{ fontSize: '13px' }}
          >
            {isPositive ? (
              <ArrowUp className="w-3.5 h-3.5" />
            ) : isNegative ? (
              <ArrowDown className="w-3.5 h-3.5" />
            ) : null}
            <span>{Math.abs(stat.change)}%</span>
          </div>
        )}
      </div>

      {/* Value - Medium bold, not too heavy */}
      <div
        className="text-gray-900 mb-2 leading-none"
        style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
      >
        {stat.value}
      </div>

      {/* Title - Normal weight */}
      <div className="text-gray-600" style={{ fontSize: '15px', fontWeight: 500 }}>
        {stat.name}
      </div>
    </motion.div>
  );
};

export const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // ✅ SHOW LOADING STATE
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F6F9FC]">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full mx-auto"
          ></motion.div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ✅ SHOW ERROR IF NOT LOGGED IN
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F6F9FC]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 bg-white p-8 rounded-2xl shadow-lg border border-red-200"
        >
          <p className="text-red-600 font-semibold text-lg">Access Denied</p>
          <p className="text-gray-600">You must be logged in to access the dashboard</p>
        </motion.div>
      </div>
    );
  }

  // Get user role display name
  const getRoleDisplayName = () => {
    if (isAdmin) return 'Admin';
    const role = user?.role || 'User';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const adminStats: StatCard[] = [
    {
      id: 'total-students',
      name: 'Total Students',
      value: '1,247',
      icon: Users,
      change: 12,
    },
    {
      id: 'active-teachers',
      name: 'Total Teachers',
      value: '87',
      icon: GraduationCap,
      change: 5,
    },
    {
      id: 'active-classes',
      name: 'Active Classes',
      value: '42',
      icon: BookOpen,
      change: -2,
    },
    {
      id: 'avg-attendance',
      name: 'Avg. Attendance',
      value: '94.5%',
      icon: TrendingUp,
      change: 8,
    },
  ];

  const attendanceData = [
    { month: 'Jan', students: 850, teachers: 48 },
    { month: 'Feb', students: 920, teachers: 50 },
    { month: 'Mar', students: 880, teachers: 49 },
    { month: 'Apr', students: 950, teachers: 52 },
    { month: 'May', students: 980, teachers: 53 },
    { month: 'Jun', students: 940, teachers: 51 },
  ];

  const performanceData = [
    { name: 'Excellent', value: 35, color: '#3B82F6' },
    { name: 'Good', value: 40, color: '#60A5FA' },
    { name: 'Average', value: 20, color: '#93C5FD' },
    { name: 'Needs Improvement', value: 5, color: '#DBEAFE' },
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      type: 'enrollment',
      title: 'New Student Enrollment',
      message: 'Arjun Sharma enrolled in Grade 10-A (Science)',
      time: '2 minutes ago',
      user: 'Admissions Office',
      status: 'success',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Fee Payment Received',
      message: 'Quarter fee payment of ₹25,000 from Priya Patel',
      time: '15 minutes ago',
      user: 'Finance Department',
      status: 'success',
    },
    {
      id: 3,
      type: 'attendance',
      title: 'Attendance Marked',
      message: 'Daily attendance completed for Grade 8-C (32/35 present)',
      time: '1 hour ago',
      user: 'Mrs. Sharma',
      status: 'info',
    },
    {
      id: 4,
      type: 'exam',
      title: 'Exam Results Published',
      message: 'Unit Test 2 results published for Grade 7 Mathematics',
      time: '2 hours ago',
      user: 'Academic Office',
      status: 'info',
    },
  ];

  const upcomingEvents: UpcomingEvent[] = [
    {
      id: 1,
      title: 'Parent-Teacher Meeting',
      date: '2025-11-10',
      time: '10:00 AM',
      location: 'Main Auditorium',
      type: 'meeting',
    },
    {
      id: 2,
      title: 'Science Fair',
      date: '2025-11-15',
      time: '9:00 AM',
      location: 'Science Block',
      type: 'event',
    },
    {
      id: 3,
      title: 'Sports Day',
      date: '2025-11-20',
      time: '8:00 AM',
      location: 'Sports Ground',
      type: 'event',
    },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getActivityStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC] p-3">
      <div className="max-w-[1600px] mx-auto space-y-7">
        {/* Hero Header - Lighter font weight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 
              className="text-gray-900"
              style={{ 
                fontSize: '32px', 
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              Welcome {getRoleDisplayName()}
            </h1>
            <p 
              className="text-gray-600 mt-2" 
              style={{ fontSize: '15px', fontWeight: 400 }}
            >
              Here's your school overview for today
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl flex items-center gap-2 font-medium border border-gray-200 shadow-sm transition-all duration-200"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>
            {isAdmin && (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 gradient-primary text-white rounded-xl flex items-center gap-2 font-medium shadow-soft transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Add Student
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl flex items-center gap-2 font-medium border border-gray-200 shadow-sm transition-all duration-200"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Class
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        {/* Metrics Grid */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminStats.map((stat, index) => (
              <MetricCard key={stat.id} stat={stat} delay={0.1 + index * 0.1} />
            ))}
          </div>
        )}

        {/* Charts Row */}
        {isAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attendance Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="lg:col-span-2 bg-white rounded-[20px] p-7 shadow-soft border border-gray-100"
            >
              <h3 
                className="mb-6 text-gray-900"
                style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em' }}
              >
                Attendance Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    tick={{ fill: '#6B7280', fontSize: 13 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    tick={{ fill: '#6B7280', fontSize: 13 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      fontSize: '14px',
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }} />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#3B82F6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorStudents)"
                  />
                  <Area
                    type="monotone"
                    dataKey="teachers"
                    stroke="#60A5FA"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorTeachers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Performance Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-white rounded-[20px] p-7 shadow-soft border border-gray-100"
            >
              <h3 
                className="mb-6 text-gray-900"
                style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em' }}
              >
                Performance
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      fontSize: '14px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-5 space-y-3">
                {performanceData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-gray-700" style={{ fontSize: '14px', fontWeight: 500 }}>
                        {item.name}
                      </span>
                    </div>
                    <span className="text-gray-900" style={{ fontSize: '14px', fontWeight: 600 }}>
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="bg-white rounded-[20px] p-7 shadow-soft border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 
                className="text-gray-900"
                style={{ fontSize: '18px', fontWeight: 600 }}
              >
                Recent Activities
              </h3>
              <Bell className="w-5 h-5 text-blue-500" />
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                  className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getActivityStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 mb-1" style={{ fontSize: '14px', fontWeight: 600 }}>
                      {activity.title}
                    </h4>
                    <p className="text-gray-600 mb-2" style={{ fontSize: '14px', fontWeight: 400 }}>
                      {activity.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500" style={{ fontSize: '13px', fontWeight: 400 }}>
                        by {activity.user}
                      </span>
                      <span className="text-gray-500" style={{ fontSize: '13px', fontWeight: 400 }}>
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white rounded-[20px] p-7 shadow-soft border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 
                className="text-gray-900"
                style={{ fontSize: '18px', fontWeight: 600 }}
              >
                Upcoming Events
              </h3>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                  whileHover={{ x: 4 }}
                  className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 cursor-pointer border border-gray-100"
                >
                  <h4 className="text-gray-900 mb-2" style={{ fontSize: '15px', fontWeight: 600 }}>
                    {event.title}
                  </h4>
                  <div className="flex items-center gap-4 text-gray-600" style={{ fontSize: '14px' }}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {event.time}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 mt-2" style={{ fontSize: '13px' }}>
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {event.location}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
