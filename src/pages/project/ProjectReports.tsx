import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Download, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ClassMetrics {
  class_name: string;
  total_projects: number;
  completed: number;
  in_progress: number;
  not_started: number;
  late: number;
  avg_score: number;
  completion_rate: number;
}

interface StatusDistribution {
  completed: number;
  in_progress: number;
  not_started: number;
  late: number;
}

interface AssignmentWithProject {
  id: string;
  status: string;
  student_id: string;
  project_id: string;
  projects: {
    due_date: string;
  } | null;
}

const ProjectReports: React.FC = () => {
  const [classMetrics, setClassMetrics] = useState<ClassMetrics[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<StatusDistribution>({
    completed: 0,
    in_progress: 0,
    not_started: 0,
    late: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Fetch all assignments with project info
      const { data: assignments, error: assignmentsError } = await supabase
        .from('project_assignments')
        .select(`
          id,
          status,
          student_id,
          project_id,
          projects!inner (
            due_date
          )
        `);

      if (assignmentsError) throw assignmentsError;

      // Fetch class assignments to get class names
      const { data: classAssignments, error: classError } = await supabase
        .from('class_assignments')
        .select('student_id, class_name');

      if (classError) throw classError;

      // Type-safe assignment handling
      const typedAssignments = assignments as unknown as AssignmentWithProject[];

      // Calculate status distribution
      const now = new Date();
      let statusCounts = {
        completed: 0,
        in_progress: 0,
        not_started: 0,
        late: 0
      };

      typedAssignments?.forEach(assignment => {
        const dueDate = assignment.projects?.due_date ? new Date(assignment.projects.due_date) : null;
        const isLate = dueDate && dueDate < now && assignment.status !== 'completed';

        if (isLate) {
          statusCounts.late++;
        } else {
          const status = assignment.status as keyof StatusDistribution;
          if (status in statusCounts) {
            statusCounts[status]++;
          }
        }
      });

      setStatusDistribution(statusCounts);

      // Calculate class metrics
      const classMap = new Map<string, ClassMetrics>();

      typedAssignments?.forEach(assignment => {
        const classAssignment = classAssignments?.find(ca => ca.student_id === assignment.student_id);
        const className = classAssignment?.class_name || 'Unknown';

        if (!classMap.has(className)) {
          classMap.set(className, {
            class_name: className,
            total_projects: 0,
            completed: 0,
            in_progress: 0,
            not_started: 0,
            late: 0,
            avg_score: 0,
            completion_rate: 0
          });
        }

        const metrics = classMap.get(className)!;
        metrics.total_projects++;

        const dueDate = assignment.projects?.due_date ? new Date(assignment.projects.due_date) : null;
        const isLate = dueDate && dueDate < now && assignment.status !== 'completed';

        if (isLate) {
          metrics.late++;
        } else if (assignment.status === 'completed') {
          metrics.completed++;
        } else if (assignment.status === 'in_progress') {
          metrics.in_progress++;
        } else {
          metrics.not_started++;
        }
      });

      // Calculate completion rates
      const metricsArray = Array.from(classMap.values()).map(metrics => ({
        ...metrics,
        completion_rate: metrics.total_projects > 0
          ? (metrics.completed / metrics.total_projects) * 100
          : 0
      }));

      setClassMetrics(metricsArray.sort((a, b) => a.class_name.localeCompare(b.class_name)));
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusChartData = {
    labels: ['Completed', 'In Progress', 'Not Started', 'Late'],
    datasets: [
      {
        label: 'Projects by Status',
        data: [
          statusDistribution.completed,
          statusDistribution.in_progress,
          statusDistribution.not_started,
          statusDistribution.late
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(156, 163, 175, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(156, 163, 175)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  };

  const completionChartData = {
    labels: classMetrics.map(m => m.class_name),
    datasets: [
      {
        label: 'Completed',
        data: classMetrics.map(m => m.completed),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      },
      {
        label: 'In Progress',
        data: classMetrics.map(m => m.in_progress),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1
      },
      {
        label: 'Not Started',
        data: classMetrics.map(m => m.not_started),
        backgroundColor: 'rgba(156, 163, 175, 0.8)',
        borderColor: 'rgb(156, 163, 175)',
        borderWidth: 1
      },
      {
        label: 'Late',
        data: classMetrics.map(m => m.late),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: false,
      },
    },
  };

  const exportToCSV = () => {
    const headers = ['Class', 'Total Projects', 'Completed', 'In Progress', 'Not Started', 'Late', 'Completion Rate'];
    const rows = classMetrics.map(m => [
      m.class_name,
      m.total_projects,
      m.completed,
      m.in_progress,
      m.not_started,
      m.late,
      `${m.completion_rate.toFixed(1)}%`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">Performance metrics and insights</p>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status Distribution Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Project Status Distribution</h2>
            </div>
            <div className="h-80">
              <Doughnut data={statusChartData} options={chartOptions} />
            </div>
          </div>

          {/* Completion by Class Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Project Completion by Class</h2>
            </div>
            <div className="h-80">
              <Bar data={completionChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Performance Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Class Performance Metrics</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Class</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Total Projects</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Completed</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">In Progress</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Not Started</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Late</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {classMetrics.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                ) : (
                  classMetrics.map((metrics, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{metrics.class_name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 text-center">{metrics.total_projects}</td>
                      <td className="py-3 px-4 text-sm text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          {metrics.completed}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          {metrics.in_progress}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {metrics.not_started}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          {metrics.late}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${metrics.completion_rate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 min-w-[45px]">
                            {metrics.completion_rate.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectReports;
