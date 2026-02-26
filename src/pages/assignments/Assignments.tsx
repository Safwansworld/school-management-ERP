import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, FileText, CheckCircle2, Eye, Users, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useAuth } from '../../context/AuthContext';
import { assignmentService, AssignmentWithStats } from '../../services/assignmentService';
import CreateAssignmentModal from './CreateAssignmentModal';
import AssignmentSubmissionsModal from './AssignmentSubmissionsModal';
import {toast} from 'sonner';


const subjectColors: { [key: string]: string } = {
  Mathematics: '#1E88E5',
  Physics: '#7B1FA2',
  History: '#E53935',
  Chemistry: '#00897B',
  English: '#F57C00',
  Biology: '#43A047',
  Science: '#2196F3',
  Geography: '#558B2F',
  Computer: '#455A64',
};

export default function Assignments() {
  const { userProfile, isTeacher, isStudent, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [assignments, setAssignments] = useState<AssignmentWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);

  // Admin stats
  const [stats, setStats] = useState({
    totalAssignments: 0,
    activeAssignments: 0,
    totalSubmissions: 0,
    averageCompletion: 0,
  });

  useEffect(() => {
    loadAssignments();
  }, [userProfile]);

  const loadAssignments = async () => {
    if (!userProfile) return;

    try {
      setLoading(true);
      if (isTeacher) {
        const data = await assignmentService.getTeacherAssignments(userProfile.id);
        setAssignments(data);
      } else if (isStudent) {
        const data = await assignmentService.getStudentAssignments(userProfile.id);
        setAssignments(data);
      } else if (isAdmin) {
        // Admin: Load all assignments
        const data = await assignmentService.getAllAssignments();
        setAssignments(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: AssignmentWithStats[]) => {
    const total = data.length;
    const active = data.filter(a => 
      getStatusFromDueDate(a.due_date, a.submitted_count, a.total_students) === 'active'
    ).length;
    
    const totalSubmissions = data.reduce((sum, a) => sum + a.submitted_count, 0);
    const totalPossible = data.reduce((sum, a) => sum + a.total_students, 0);
    const avgCompletion = totalPossible > 0 ? (totalSubmissions / totalPossible) * 100 : 0;

    setStats({
      totalAssignments: total,
      activeAssignments: active,
      totalSubmissions: totalSubmissions,
      averageCompletion: Math.round(avgCompletion),
    });
  };

  const getStatusFromDueDate = (dueDate: string, submittedCount: number, totalStudents: number) => {
    const now = new Date();
    const due = new Date(dueDate);

    if (submittedCount === totalStudents) return 'completed';
    if (now > due) return 'pending';
    return 'active';
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (activeTab === 'all') return true;
    const status = getStatusFromDueDate(
      assignment.due_date,
      assignment.submitted_count,
      assignment.total_students
    );
    return status === activeTab;
  });

  const handleViewSubmissions = (assignmentId: string) => {
    setSelectedAssignment(assignmentId);
    setShowSubmissionsModal(true);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-3 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="mb-2">Assignments</h1>
          <p className="text-gray-600">
            {isTeacher && 'Track and manage student assignments'}
            {isStudent && 'View and submit your assignments'}
            {isAdmin && 'Monitor all assignments across the school'}
          </p>
        </div>
        {(isTeacher || isAdmin) && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="gradient-primary text-white shadow-glow hover:shadow-float rounded-xl h-11 gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Assignment
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Admin Stats Dashboard */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="glass-strong rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalAssignments}</p>
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Assignments</p>
                <p className="text-2xl font-bold text-gray-800">{stats.activeAssignments}</p>
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalSubmissions}</p>
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Completion</p>
                <p className="text-2xl font-bold text-gray-800">{stats.averageCompletion}%</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      {(isTeacher || isAdmin) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="glass-strong h-auto p-2 rounded-xl shadow-soft">
              <TabsTrigger
                value="all"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-soft"
              >
                All Assignments
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-soft"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-soft"
              >
                Pending Review
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-soft"
              >
                Completed
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>
      )}

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAssignments.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No assignments found</p>
          </div>
        ) : (
          filteredAssignments.map((assignment, index) => {
            const progress = assignment.total_students > 0 
              ? (assignment.submitted_count / assignment.total_students) * 100 
              : 0;
            const subjectColor = subjectColors[assignment.subject] || '#1E88E5';
            const status = getStatusFromDueDate(
              assignment.due_date,
              assignment.submitted_count,
              assignment.total_students
            );

            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05, duration: 0.6 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="glass-strong rounded-2xl p-6 shadow-soft hover:shadow-float transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${subjectColor}20` }}
                    >
                      <FileText className="w-6 h-6" style={{ color: subjectColor }} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-800 mb-1 truncate">{assignment.title}</h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className="border-0 text-xs"
                          style={{
                            backgroundColor: `${subjectColor}15`,
                            color: subjectColor,
                          }}
                        >
                          {assignment.subject}
                        </Badge>
                        <Badge variant="outline" className="bg-white/60 border-gray-200/50 text-gray-600 text-xs">
                          {assignment.class_name}
                        </Badge>
                        {isAdmin && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {assignment.teacher_name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
                </div>

                {(isTeacher || isAdmin) && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Submission Progress</span>
                        <span className="font-semibold text-gray-800">
                          {assignment.submitted_count}/{assignment.total_students}
                        </span>
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 0.3 + index * 0.05, duration: 0.8 }}
                      >
                        <Progress
                          value={progress}
                          className="h-2"
                          style={{
                            // @ts-ignore
                            '--progress-background': subjectColor,
                          }}
                        />
                      </motion.div>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-200/50">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-[#1E88E5]" />
                        <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`
                          ${status === 'completed' ? 'bg-green-50 text-green-600 border-green-200' : ''}
                          ${status === 'active' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                          ${status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-200' : ''}
                        `}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Student View */}
                {isStudent && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-200/50">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-[#1E88E5]" />
                        <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                      </div>
                      {(assignment as any).has_submitted ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Submitted
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200/50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewSubmissions(assignment.id)}
                    className="w-full rounded-lg bg-white hover:bg-[#1E88E5]/10 border-[#1E88E5]/20 text-[#1E88E5] gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {isTeacher || isAdmin ? 'View Submissions' : isStudent ? 'View & Submit' : 'View Details'}
                  </Button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Modals */}
      {(isTeacher || isAdmin) && (
        <CreateAssignmentModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadAssignments}
        />
      )}

      {selectedAssignment && (
        <AssignmentSubmissionsModal
          isOpen={showSubmissionsModal}
          onClose={() => {
            setShowSubmissionsModal(false);
            setSelectedAssignment(null);
          }}
          assignmentId={selectedAssignment}
          isTeacher={isTeacher || isAdmin}
        />
      )}
    </div>
  );
}
