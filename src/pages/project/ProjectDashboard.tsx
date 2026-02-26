// import React, { useEffect, useState } from 'react';
// import { supabase } from '../../lib/supabase';
// import {
//   BookOpen,
//   CheckCircle2,
//   Clock,
//   AlertCircle,
//   TrendingUp,
//   Users,
//   Calendar,
//   FileText,
//   FlaskConical
// } from 'lucide-react';
// import { Link } from 'react-router-dom';

// interface DashboardStats {
//   activeProjects: number;
//   completedProjects: number;
//   inProgressProjects: number;
//   lateProjects: number;
// }

// interface RecentActivity {
//   id: string;
//   activity_description: string;
//   created_at: string;
//   activity_type: string;
// }

// interface ProjectData {
//   id: string;
//   status: string;
//   due_date: string;
// }

// interface AssignmentData {
//   id: string;
//   project_id: string;
//   status: string;
// }

// const ProjectDashboard: React.FC = () => {
//   const [stats, setStats] = useState<DashboardStats>({
//     activeProjects: 0,
//     completedProjects: 0,
//     inProgressProjects: 0,
//     lateProjects: 0
//   });
//   const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);

//       // Fetch project statistics
//       const { data: projects, error: projectsError } = await supabase
//         .from('projects')
//         .select('id, status, due_date');

//       if (projectsError) throw projectsError;

//       // Fetch assignment statistics with project_id
//       const { data: assignments, error: assignmentsError } = await supabase
//         .from('project_assignments')
//         .select('id, project_id, status');

//       if (assignmentsError) throw assignmentsError;

//       // Calculate stats
//       const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
//       const completedProjects = assignments?.filter(a => a.status === 'completed').length || 0;
//       const inProgressProjects = assignments?.filter(a => a.status === 'in_progress').length || 0;
      
//       // Check for late projects - now properly typed
//       const now = new Date();
//       const lateProjects = assignments?.filter((assignment: AssignmentData) => {
//         const project = projects?.find((p: ProjectData) => p.id === assignment.project_id);
//         return assignment.status !== 'completed' && project && new Date(project.due_date) < now;
//       }).length || 0;

//       setStats({
//         activeProjects,
//         completedProjects,
//         inProgressProjects,
//         lateProjects
//       });

//       // Fetch recent activities
//       const { data: activities, error: activitiesError } = await supabase
//         .from('project_activity_log')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(10);

//       if (activitiesError) throw activitiesError;

//       setRecentActivities(activities || []);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getActivityIcon = (type: string) => {
//     switch (type) {
//       case 'created':
//         return <FileText className="w-4 h-4" />;
//       case 'submitted':
//         return <CheckCircle2 className="w-4 h-4" />;
//       case 'status_changed':
//         return <TrendingUp className="w-4 h-4" />;
//       default:
//         return <Clock className="w-4 h-4" />;
//     }
//   };

//   const getActivityColor = (type: string) => {
//     switch (type) {
//       case 'submitted':
//         return 'text-green-600 bg-green-50';
//       case 'status_changed':
//         return 'text-orange-600 bg-orange-50';
//       case 'created':
//         return 'text-blue-600 bg-blue-50';
//       default:
//         return 'text-gray-600 bg-gray-50';
//     }
//   };

//   const formatRelativeTime = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

//     if (diffInSeconds < 60) return 'Just now';
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
//     return `${Math.floor(diffInSeconds / 86400)} days ago`;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Project Tracker Dashboard</h1>
//           <p className="text-gray-600 mt-2">Monitor and manage all student projects</p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-blue-50 rounded-lg">
//                 <BookOpen className="w-6 h-6 text-blue-600" />
//               </div>
//               <span className="text-sm font-medium text-gray-500">Active</span>
//             </div>
//             <div className="text-3xl font-bold text-gray-900">{stats.activeProjects}</div>
//             <p className="text-sm text-gray-600 mt-2">Active Projects</p>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-green-50 rounded-lg">
//                 <CheckCircle2 className="w-6 h-6 text-green-600" />
//               </div>
//               <span className="text-sm font-medium text-gray-500">Completed</span>
//             </div>
//             <div className="text-3xl font-bold text-gray-900">{stats.completedProjects}</div>
//             <p className="text-sm text-gray-600 mt-2">Submissions Completed</p>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-yellow-50 rounded-lg">
//                 <Clock className="w-6 h-6 text-yellow-600" />
//               </div>
//               <span className="text-sm font-medium text-gray-500">In Progress</span>
//             </div>
//             <div className="text-3xl font-bold text-gray-900">{stats.inProgressProjects}</div>
//             <p className="text-sm text-gray-600 mt-2">Currently Working</p>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center justify-between mb-4">
//               <div className="p-3 bg-red-50 rounded-lg">
//                 <AlertCircle className="w-6 h-6 text-red-600" />
//               </div>
//               <span className="text-sm font-medium text-gray-500">Late</span>
//             </div>
//             <div className="text-3xl font-bold text-gray-900">{stats.lateProjects}</div>
//             <p className="text-sm text-gray-600 mt-2">Overdue Projects</p>
//           </div>
//         </div>

//         {/* Recent Activity Section */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
//             <Link
//               to="/projects/activity"
//               className="text-sm text-blue-600 hover:text-blue-700 font-medium"
//             >
//               View All
//             </Link>
//           </div>

//           <div className="space-y-4">
//             {recentActivities.length === 0 ? (
//               <p className="text-gray-500 text-center py-8">No recent activity</p>
//             ) : (
//               recentActivities.map((activity) => (
//                 <div
//                   key={activity.id}
//                   className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <div className={`p-2 rounded-lg ${getActivityColor(activity.activity_type)}`}>
//                     {getActivityIcon(activity.activity_type)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm text-gray-900">{activity.activity_description}</p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {formatRelativeTime(activity.created_at)}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
//           <Link
//             to="/projects/assign"
//             className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-6 shadow-sm transition-colors"
//           >
//             <div className="flex items-center gap-3">
//               <FileText className="w-6 h-6" />
//               <div>
//                 <h3 className="font-semibold text-lg">Assign New Project</h3>
//                 <p className="text-sm text-blue-100 mt-1">Create and assign projects</p>
//               </div>
//             </div>
//           </Link>

//           <Link
//             to="/projects/tracking"
//             className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm transition-colors"
//           >
//             <div className="flex items-center gap-3">
//               <TrendingUp className="w-6 h-6 text-gray-700" />
//               <div>
//                 <h3 className="font-semibold text-lg text-gray-900">Track Projects</h3>
//                 <p className="text-sm text-gray-600 mt-1">Monitor project progress</p>
//               </div>
//             </div>
//           </Link>

//           <Link
//             to="/projects/reports"
//             className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm transition-colors"
//           >
//             <div className="flex items-center gap-3">
//               <Calendar className="w-6 h-6 text-gray-700" />
//               <div>
//                 <h3 className="font-semibold text-lg text-gray-900">View Reports</h3>
//                 <p className="text-sm text-gray-600 mt-1">Analytics and insights</p>
//               </div>
//             </div>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectDashboard;
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  FlaskConical
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  activeProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  lateProjects: number;
}

interface RecentActivity {
  id: string;
  activity_description: string;
  created_at: string;
  activity_type: string;
}

interface ProjectData {
  id: string;
  status: string;
  due_date: string;
}

interface AssignmentData {
  id: string;
  project_id: string;
  status: string;
}

const ProjectDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
    lateProjects: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch project statistics
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, status, due_date');

      if (projectsError) throw projectsError;

      // Fetch assignment statistics with project_id
      const { data: assignments, error: assignmentsError } = await supabase
        .from('project_assignments')
        .select('id, project_id, status');

      if (assignmentsError) throw assignmentsError;

      // Calculate stats
      const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
      const completedProjects = assignments?.filter(a => a.status === 'completed').length || 0;
      const inProgressProjects = assignments?.filter(a => a.status === 'in_progress').length || 0;
      
      // Check for late projects - now properly typed
      const now = new Date();
      const lateProjects = assignments?.filter((assignment: AssignmentData) => {
        const project = projects?.find((p: ProjectData) => p.id === assignment.project_id);
        return assignment.status !== 'completed' && project && new Date(project.due_date) < now;
      }).length || 0;

      setStats({
        activeProjects,
        completedProjects,
        inProgressProjects,
        lateProjects
      });

      // Fetch recent activities
      const { data: activities, error: activitiesError } = await supabase
        .from('project_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (activitiesError) throw activitiesError;

      setRecentActivities(activities || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created':
        return <FileText className="w-4 h-4" />;
      case 'submitted':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'status_changed':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'submitted':
        return 'text-emerald-600 bg-emerald-50';
      case 'status_changed':
        return 'text-amber-600 bg-amber-50';
      case 'created':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F6F9FC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
          <p 
            className="text-gray-600"
            style={{ fontSize: '15px', fontWeight: 500 }}
          >
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F9FC] p-8">
      <div className="max-w-[1600px] mx-auto space-y-7">
        {/* Header */}
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
            Project Tracker Dashboard
          </h1>
          <p 
            className="text-gray-600 mt-2" 
            style={{ fontSize: '15px', fontWeight: 400 }}
          >
            Monitor and manage all student projects
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6 hover:shadow-float transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-blue-50 rounded-[16px] flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-blue-500" />
              </div>
            </div>
            <div 
              className="text-gray-900 mb-1"
              style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
            >
              {stats.activeProjects}
            </div>
            <p 
              className="text-gray-600"
              style={{ fontSize: '15px', fontWeight: 500 }}
            >
              Active Projects
            </p>
          </div>

          <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6 hover:shadow-float transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-[16px] flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
            <div 
              className="text-gray-900 mb-1"
              style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
            >
              {stats.completedProjects}
            </div>
            <p 
              className="text-gray-600"
              style={{ fontSize: '15px', fontWeight: 500 }}
            >
              Submissions Completed
            </p>
          </div>

          <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6 hover:shadow-float transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-amber-50 rounded-[16px] flex items-center justify-center">
                <Clock className="w-7 h-7 text-amber-600" />
              </div>
            </div>
            <div 
              className="text-gray-900 mb-1"
              style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
            >
              {stats.inProgressProjects}
            </div>
            <p 
              className="text-gray-600"
              style={{ fontSize: '15px', fontWeight: 500 }}
            >
              Currently Working
            </p>
          </div>

          <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6 hover:shadow-float transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-red-50 rounded-[16px] flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-red-600" />
              </div>
            </div>
            <div 
              className="text-gray-900 mb-1"
              style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em' }}
            >
              {stats.lateProjects}
            </div>
            <p 
              className="text-gray-600"
              style={{ fontSize: '15px', fontWeight: 500 }}
            >
              Overdue Projects
            </p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 
              className="text-gray-900"
              style={{ fontSize: '20px', fontWeight: 600 }}
            >
              Recent Activity
            </h2>
            <Link
              to="/projects/activity"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              style={{ fontSize: '14px' }}
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p 
                className="text-gray-500 text-center py-8"
                style={{ fontSize: '14px' }}
              >
                No recent activity
              </p>
            ) : (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2.5 rounded-xl ${getActivityColor(activity.activity_type)}`}>
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p 
                      className="text-gray-900"
                      style={{ fontSize: '14px', fontWeight: 500 }}
                    >
                      {activity.activity_description}
                    </p>
                    <p 
                      className="text-gray-500 mt-1"
                      style={{ fontSize: '12px' }}
                    >
                      {formatRelativeTime(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/projects/assign"
            className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6 hover:shadow-float transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-[14px] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 
                  className="text-gray-900"
                  style={{ fontSize: '16px', fontWeight: 600 }}
                >
                  Assign New Project
                </h3>
                <p 
                  className="text-gray-600 mt-1"
                  style={{ fontSize: '13px' }}
                >
                  Create and assign projects
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/projects/tracking"
            className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6 hover:shadow-float transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-[14px] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 
                  className="text-gray-900"
                  style={{ fontSize: '16px', fontWeight: 600 }}
                >
                  Track Projects
                </h3>
                <p 
                  className="text-gray-600 mt-1"
                  style={{ fontSize: '13px' }}
                >
                  Monitor project progress
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/projects/reports"
            className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6 hover:shadow-float transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-[14px] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 
                  className="text-gray-900"
                  style={{ fontSize: '16px', fontWeight: 600 }}
                >
                  View Reports
                </h3>
                <p 
                  className="text-gray-600 mt-1"
                  style={{ fontSize: '13px' }}
                >
                  Analytics and insights
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
