// // import React, { useEffect, useState } from 'react';
// // import { supabase } from '../../lib/supabase';
// // import {
// //   Search,
// //   Eye,
// //   FileText,
// //   Clock,
// //   CheckCircle2,
// //   AlertCircle,
// //   Users,
// //   Upload
// // } from 'lucide-react';
// // import ProjectDetailsModal from './ProjectDetailsModal';
// // import ProjectSubmissionsModal from './ProjectSubmissionsModal';
// // import StudentProjectViewModal from './StudentProjectView';
// // import StudentSubmissionModal from './StudentSubmissionModal';

// // interface ProjectWithDetails {
// //   id: string;
// //   project_id: string;
// //   title: string;
// //   description: string;
// //   subject: string;
// //   sdg_goal: string;
// //   due_date: string;
// //   status: string;
// //   assigned_count: number;
// //   completed_count: number;
// //   // Student-specific fields
// //   assignment_id?: string;
// //   assignment_status?: string;
// //   submission_id?: string | null;
// //   submitted_at?: string | null;
// //   grade?: number | null;
// //   feedback?: string | null;
// // }

// // const ProjectTracking: React.FC = () => {
// //   const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
// //   const [filteredProjects, setFilteredProjects] = useState<ProjectWithDetails[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [statusFilter, setStatusFilter] = useState('all');
// //   const [subjectFilter, setSubjectFilter] = useState('all');
// //   const [userRole, setUserRole] = useState<string | null>(null);
// //   const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);

// //   // Modal states
// //   const [detailsModalOpen, setDetailsModalOpen] = useState(false);
// //   const [submissionsModalOpen, setSubmissionsModalOpen] = useState(false);
// //   const [studentViewModalOpen, setStudentViewModalOpen] = useState(false);
// //   const [studentSubmissionModalOpen, setStudentSubmissionModalOpen] = useState(false);
// //   const [selectedProject, setSelectedProject] = useState<ProjectWithDetails | null>(null);

// //   useEffect(() => {
// //     initializeData();
// //   }, []);

// //   useEffect(() => {
// //     filterProjects();
// //   }, [searchTerm, statusFilter, subjectFilter, projects]);

// //   const initializeData = async () => {
// //     try {
// //       setLoading(true);

// //       // Get current user and role
// //       const { data: { user }, error: userError } = await supabase.auth.getUser();
// //       if (userError || !user) throw new Error('User not authenticated');

// //       // Get user role
// //       const { data: profile, error: profileError } = await supabase
// //         .from('user_profiles')
// //         .select('role')
// //         .eq('id', user.id)
// //         .single();

// //       if (profileError) throw profileError;
      
// //       setUserRole(profile.role);

// //       // Fetch projects based on role
// //       if (profile.role === 'student') {
// //         await fetchStudentProjects(user.id);
// //       } else {
// //         await fetchTeacherProjects();
// //       }
// //     } catch (error) {
// //       console.error('Error initializing data:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchStudentProjects = async (userId: string) => {
// //     try {
// //       // Get student_profile using auth user id
// //       const { data: studentProfile, error: profileError } = await supabase
// //         .from('student_profiles')
// //         .select('student_id')
// //         .eq('id', userId)
// //         .single();

// //       if (profileError || !studentProfile) {
// //         console.error('Student profile not found');
// //         setProjects([]);
// //         return;
// //       }

// //       setCurrentStudentId(studentProfile.student_id);

// //       // Get student_id from class_assignments
// //       const { data: classAssignment, error: classError } = await supabase
// //         .from('class_assignments')
// //         .select('student_id')
// //         .eq('student_id', studentProfile.student_id)
// //         .single();

// //       if (classError || !classAssignment) {
// //         console.error('Class assignment not found');
// //         setProjects([]);
// //         return;
// //       }

// //       // Get project assignments for this student
// //       const { data: assignments, error: assignmentsError } = await supabase
// //         .from('project_assignments')
// //         .select('id, project_id, status, submission_date')
// //         .eq('student_id', classAssignment.student_id);

// //       if (assignmentsError) throw assignmentsError;

// //       if (!assignments || assignments.length === 0) {
// //         setProjects([]);
// //         return;
// //       }

// //       // Get project details
// //       const projectIds = assignments.map(a => a.project_id);
// //       const { data: projectsData, error: projectsError } = await supabase
// //         .from('projects')
// //         .select('*')
// //         .in('id', projectIds);

// //       if (projectsError) throw projectsError;

// //       // Get submissions for these assignments
// //       const assignmentIds = assignments.map(a => a.id);
// //       const { data: submissions, error: submissionsError } = await supabase
// //         .from('project_submissions')
// //         .select('id, assignment_id, submitted_at, grade, feedback')
// //         .eq('student_id', classAssignment.student_id)
// //         .in('assignment_id', assignmentIds);

// //       if (submissionsError) throw submissionsError;

// //       // Combine all data
// //       const combinedProjects: ProjectWithDetails[] = (projectsData || []).map(project => {
// //         const assignment = assignments.find(a => a.project_id === project.id);
// //         const submission = submissions?.find(s => s.assignment_id === assignment?.id);

// //         return {
// //           id: project.id,
// //           project_id: project.project_id,
// //           title: project.title,
// //           description: project.description,
// //           subject: project.subject,
// //           sdg_goal: project.sdg_goal,
// //           due_date: project.due_date,
// //           status: project.status,
// //           assigned_count: 0,
// //           completed_count: 0,
// //           assignment_id: assignment?.id || '',
// //           assignment_status: assignment?.status || 'not_started',
// //           submission_id: submission?.id || null,
// //           submitted_at: submission?.submitted_at || null,
// //           grade: submission?.grade || null,
// //           feedback: submission?.feedback || null
// //         };
// //       });

// //       setProjects(combinedProjects);
// //       setFilteredProjects(combinedProjects);
// //     } catch (error) {
// //       console.error('Error fetching student projects:', error);
// //     }
// //   };

// //   const fetchTeacherProjects = async () => {
// //     try {
// //       const { data: projectsData, error: projectsError } = await supabase
// //         .from('projects')
// //         .select(`
// //           id,
// //           project_id,
// //           title,
// //           description,
// //           subject,
// //           sdg_goal,
// //           due_date,
// //           status
// //         `)
// //         .order('created_at', { ascending: false });

// //       if (projectsError) throw projectsError;

// //       const projectsWithCounts = await Promise.all(
// //         (projectsData || []).map(async (project) => {
// //           const { count: assignedCount } = await supabase
// //             .from('project_assignments')
// //             .select('*', { count: 'exact', head: true })
// //             .eq('project_id', project.id);

// //           const { count: completedCount } = await supabase
// //             .from('project_assignments')
// //             .select('*', { count: 'exact', head: true })
// //             .eq('project_id', project.id)
// //             .eq('status', 'completed');

// //           return {
// //             ...project,
// //             assigned_count: assignedCount || 0,
// //             completed_count: completedCount || 0
// //           };
// //         })
// //       );

// //       setProjects(projectsWithCounts);
// //       setFilteredProjects(projectsWithCounts);
// //     } catch (error) {
// //       console.error('Error fetching teacher projects:', error);
// //     }
// //   };

// //   const filterProjects = () => {
// //     let filtered = [...projects];

// //     if (searchTerm) {
// //       filtered = filtered.filter(
// //         (p) =>
// //           p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //           p.project_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //           p.description.toLowerCase().includes(searchTerm.toLowerCase())
// //       );
// //     }

// //     if (statusFilter !== 'all') {
// //       if (userRole === 'student') {
// //         filtered = filtered.filter((p) => {
// //           if (statusFilter === 'pending') {
// //             return !p.submission_id && new Date(p.due_date) > new Date();
// //           }
// //           if (statusFilter === 'submitted') {
// //             return p.submission_id && !p.grade;
// //           }
// //           if (statusFilter === 'graded') {
// //             return p.grade !== null;
// //           }
// //           if (statusFilter === 'overdue') {
// //             return !p.submission_id && new Date(p.due_date) < new Date();
// //           }
// //           return true;
// //         });
// //       } else {
// //         filtered = filtered.filter((p) => {
// //           if (statusFilter === 'late') {
// //             return new Date(p.due_date) < new Date() && p.status !== 'completed';
// //           }
// //           return p.status === statusFilter;
// //         });
// //       }
// //     }

// //     if (subjectFilter !== 'all') {
// //       filtered = filtered.filter((p) => p.subject === subjectFilter);
// //     }

// //     setFilteredProjects(filtered);
// //   };

// //   const handleViewDetails = (project: ProjectWithDetails) => {
// //     setSelectedProject(project);
// //     if (userRole === 'student') {
// //       setStudentViewModalOpen(true);
// //     } else {
// //       setDetailsModalOpen(true);
// //     }
// //   };

// //   const handleViewSubmissions = (project: ProjectWithDetails) => {
// //     setSelectedProject(project);
// //     setSubmissionsModalOpen(true);
// //   };

// //   const handleStudentSubmit = (project: ProjectWithDetails) => {
// //     setSelectedProject(project);
// //     setStudentSubmissionModalOpen(true);
// //   };

// //   const getStatusBadge = (project: ProjectWithDetails) => {
// //     if (userRole === 'student') {
// //       const dueDate = new Date(project.due_date);
// //       const now = new Date();
// //       const isOverdue = dueDate < now && !project.submission_id;

// //       if (project.grade !== null) {
// //         return (
// //           <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
// //             <CheckCircle2 className="w-3 h-3" />
// //             Graded ({project.grade})
// //           </span>
// //         );
// //       }

// //       if (project.submission_id) {
// //         return (
// //           <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
// //             <Clock className="w-3 h-3" />
// //             Submitted
// //           </span>
// //         );
// //       }

// //       if (isOverdue) {
// //         return (
// //           <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
// //             <AlertCircle className="w-3 h-3" />
// //             Overdue
// //           </span>
// //         );
// //       }

// //       return (
// //         <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
// //           <Clock className="w-3 h-3" />
// //           Pending
// //         </span>
// //       );
// //     } else {
// //       const dueDate = new Date(project.due_date);
// //       const now = new Date();
// //       const isLate = dueDate < now && project.status !== 'completed';

// //       if (isLate) {
// //         return (
// //           <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
// //             <AlertCircle className="w-3 h-3" />
// //             Late
// //           </span>
// //         );
// //       }

// //       const statusColors: Record<string, string> = {
// //         active: 'bg-yellow-100 text-yellow-700',
// //         completed: 'bg-green-100 text-green-700',
// //         draft: 'bg-gray-100 text-gray-700',
// //         archived: 'bg-gray-100 text-gray-700'
// //       };

// //       const statusIcons: Record<string, React.ReactNode> = {
// //         active: <Clock className="w-3 h-3" />,
// //         completed: <CheckCircle2 className="w-3 h-3" />,
// //         draft: <FileText className="w-3 h-3" />,
// //         archived: <FileText className="w-3 h-3" />
// //       };

// //       return (
// //         <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
// //           {statusIcons[project.status]}
// //           {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
// //         </span>
// //       );
// //     }
// //   };

// //   const formatDate = (dateString: string) => {
// //     return new Date(dateString).toLocaleDateString('en-US', {
// //       year: 'numeric',
// //       month: 'short',
// //       day: 'numeric'
// //     });
// //   };

// //   const getDaysRemaining = (dueDate: string) => {
// //     const due = new Date(dueDate);
// //     const now = new Date();
// //     const diffTime = due.getTime() - now.getTime();
// //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

// //     if (diffDays < 0) return 'Overdue';
// //     if (diffDays === 0) return 'Due today';
// //     if (diffDays === 1) return '1 day left';
// //     return `${diffDays} days left`;
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-screen">
// //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6">
// //       <div className="max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <h1 className="text-3xl font-bold text-gray-900">
// //             {userRole === 'student' ? 'My Projects' : 'Project Tracking'}
// //           </h1>
// //           <p className="text-gray-600 mt-2">
// //             {userRole === 'student' 
// //               ? 'View and submit your assigned projects' 
// //               : 'Monitor all assigned projects and their progress'}
// //           </p>
// //         </div>

// //         {/* Student Stats */}
// //         {userRole === 'student' && (
// //           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
// //             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
// //               <p className="text-sm text-gray-600">Total Projects</p>
// //               <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
// //             </div>
// //             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
// //               <p className="text-sm text-gray-600">Pending</p>
// //               <p className="text-2xl font-bold text-yellow-600">
// //                 {projects.filter(p => !p.submission_id && new Date(p.due_date) > new Date()).length}
// //               </p>
// //             </div>
// //             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
// //               <p className="text-sm text-gray-600">Submitted</p>
// //               <p className="text-2xl font-bold text-blue-600">
// //                 {projects.filter(p => p.submission_id).length}
// //               </p>
// //             </div>
// //             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
// //               <p className="text-sm text-gray-600">Graded</p>
// //               <p className="text-2xl font-bold text-green-600">
// //                 {projects.filter(p => p.grade !== null).length}
// //               </p>
// //             </div>
// //           </div>
// //         )}

// //         {/* Filters */}
// //         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //             <div className="relative">
// //               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
// //               <input
// //                 type="text"
// //                 placeholder="Search projects..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>

// //             <select
// //               value={statusFilter}
// //               onChange={(e) => setStatusFilter(e.target.value)}
// //               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //             >
// //               {userRole === 'student' ? (
// //                 <>
// //                   <option value="all">All Projects</option>
// //                   <option value="pending">Pending</option>
// //                   <option value="submitted">Submitted</option>
// //                   <option value="graded">Graded</option>
// //                   <option value="overdue">Overdue</option>
// //                 </>
// //               ) : (
// //                 <>
// //                   <option value="all">All Status</option>
// //                   <option value="active">Active</option>
// //                   <option value="completed">Completed</option>
// //                   <option value="late">Late</option>
// //                   <option value="draft">Draft</option>
// //                 </>
// //               )}
// //             </select>

// //             <select
// //               value={subjectFilter}
// //               onChange={(e) => setSubjectFilter(e.target.value)}
// //               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //             >
// //               <option value="all">All Subjects</option>
// //               <option value="Science">Science</option>
// //               <option value="Mathematics">Mathematics</option>
// //               <option value="History">History</option>
// //               <option value="English">English</option>
// //               <option value="Geography">Geography</option>
// //             </select>
// //           </div>
// //         </div>

// //         {/* Projects Grid */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {filteredProjects.length === 0 ? (
// //             <div className="col-span-full text-center py-12">
// //               <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
// //               <p className="text-gray-500">No projects found</p>
// //             </div>
// //           ) : (
// //             filteredProjects.map((project) => (
// //               <div
// //                 key={project.id}
// //                 className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
// //               >
// //                 <div className="flex items-start justify-between mb-4">
// //                   <div className="flex-1">
// //                     <p className="text-sm font-mono text-blue-600 mb-1">{project.project_id}</p>
// //                     <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
// //                       {project.title}
// //                     </h3>
// //                   </div>
// //                   {getStatusBadge(project)}
// //                 </div>

// //                 <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

// //                 <div className="flex items-center gap-2 mb-4">
// //                   <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
// //                     {project.subject}
// //                   </span>
// //                   {project.sdg_goal && (
// //                     <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
// //                       {project.sdg_goal}
// //                     </span>
// //                   )}
// //                 </div>

// //                 {/* Teacher View Stats */}
// //                 {userRole !== 'student' && (
// //                   <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
// //                     <div className="flex items-center gap-1">
// //                       <Users className="w-4 h-4" />
// //                       <span>{project.assigned_count} assigned</span>
// //                     </div>
// //                     <div className="flex items-center gap-1">
// //                       <CheckCircle2 className="w-4 h-4" />
// //                       <span>{project.completed_count} completed</span>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Due Date */}
// //                 <div className="flex items-center justify-between text-sm mb-4 p-3 bg-gray-50 rounded-lg">
// //                   <div className="flex items-center gap-2 text-gray-600">
// //                     <Clock className="w-4 h-4" />
// //                     <span>Due: {formatDate(project.due_date)}</span>
// //                   </div>
// //                   {userRole === 'student' && (
// //                     <span className={`font-medium ${
// //                       getDaysRemaining(project.due_date) === 'Overdue' 
// //                         ? 'text-red-600' 
// //                         : 'text-gray-900'
// //                     }`}>
// //                       {getDaysRemaining(project.due_date)}
// //                     </span>
// //                   )}
// //                 </div>

// //                 {/* Student Feedback */}
// //                 {userRole === 'student' && project.feedback && (
// //                   <div className="mb-4 p-3 bg-green-50 rounded-lg">
// //                     <p className="text-xs text-green-600 mb-1">Teacher Feedback:</p>
// //                     <p className="text-sm text-green-900 line-clamp-2">{project.feedback}</p>
// //                   </div>
// //                 )}

// //                 {/* Actions */}
// //                 <div className="pt-4 border-t border-gray-200">
// //                   {userRole === 'student' ? (
// //                     <div className="space-y-2">
// //                       <button
// //                         onClick={() => handleViewDetails(project)}
// //                         className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
// //                       >
// //                         <Eye className="w-4 h-4" />
// //                         View Details
// //                       </button>
// //                       {!project.submission_id ? (
// //                         <button
// //                           onClick={() => handleStudentSubmit(project)}
// //                           disabled={new Date(project.due_date) < new Date()}
// //                           className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
// //                         >
// //                           <Upload className="w-4 h-4" />
// //                           {new Date(project.due_date) < new Date() ? 'Submission Closed' : 'Submit Project'}
// //                         </button>
// //                       ) : project.grade === null ? (
// //                         <button
// //                           onClick={() => handleStudentSubmit(project)}
// //                           className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
// //                         >
// //                           <FileText className="w-4 h-4" />
// //                           Resubmit Project
// //                         </button>
// //                       ) : null}
// //                     </div>
// //                   ) : (
// //                     <div className="flex items-center gap-2">
// //                       <button
// //                         onClick={() => handleViewDetails(project)}
// //                         className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
// //                       >
// //                         <Eye className="w-4 h-4" />
// //                         View Details
// //                       </button>
// //                       <button
// //                         onClick={() => handleViewSubmissions(project)}
// //                         className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
// //                       >
// //                         <FileText className="w-4 h-4" />
// //                         Submissions
// //                       </button>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             ))
// //           )}
// //         </div>
// //       </div>

// //       {/* Teacher Modals */}
// //       {userRole !== 'student' && (
// //         <>
// //           <ProjectDetailsModal
// //             isOpen={detailsModalOpen}
// //             onClose={() => setDetailsModalOpen(false)}
// //             projectId={selectedProject?.id || ''}
// //           />

// //           <ProjectSubmissionsModal
// //             isOpen={submissionsModalOpen}
// //             onClose={() => setSubmissionsModalOpen(false)}
// //             projectId={selectedProject?.id || ''}
// //           />
// //         </>
// //       )}

// //       {/* Student Modals */}
// //       {userRole === 'student' && (
// //         <>
// //           <StudentProjectViewModal
// //             isOpen={studentViewModalOpen}
// //             onClose={() => setStudentViewModalOpen(false)}
// //             project={selectedProject}
// //           />

// //           <StudentSubmissionModal
// //             isOpen={studentSubmissionModalOpen}
// //             onClose={() => {
// //               setStudentSubmissionModalOpen(false);
// //               setSelectedProject(null);
// //             }}
// //             project={selectedProject}
// //             studentId={currentStudentId}
// //             onSubmitSuccess={initializeData}
// //           />
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default ProjectTracking;
// import React, { useEffect, useState, useRef } from 'react';
// import { supabase } from '../../lib/supabase';
// import {
//   Search,
//   Eye,
//   FileText,
//   Clock,
//   CheckCircle2,
//   AlertCircle,
//   Users,
//   Upload,
//   MoreVertical,
//   Edit,
//   Trash2,
//   Archive,
//   Copy,
//   RefreshCw
// } from 'lucide-react';
// import ProjectDetailsModal from './ProjectDetailsModal';
// import ProjectSubmissionsModal from './ProjectSubmissionsModal';
// import StudentProjectViewModal from './StudentProjectView';
// import StudentSubmissionModal from './StudentSubmissionModal';


// interface ProjectWithDetails {
//   id: string;
//   project_id: string;
//   title: string;
//   description: string;
//   subject: string;
//   sdg_goal: string;
//   due_date: string;
//   status: string;
//   assigned_count: number;
//   completed_count: number;
//   // Student-specific fields
//   assignment_id?: string;
//   assignment_status?: string;
//   submission_id?: string | null;
//   submitted_at?: string | null;
//   grade?: number | null;
//   feedback?: string | null;
// }

// const ProjectTracking: React.FC = () => {
//   const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
//   const [filteredProjects, setFilteredProjects] = useState<ProjectWithDetails[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [subjectFilter, setSubjectFilter] = useState('all');
//   const [userRole, setUserRole] = useState<string | null>(null);
//   const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
//   const [openMenuId, setOpenMenuId] = useState<string | null>(null);
//   const menuRef = useRef<HTMLDivElement>(null);

//   // Modal states
//   const [detailsModalOpen, setDetailsModalOpen] = useState(false);
//   const [submissionsModalOpen, setSubmissionsModalOpen] = useState(false);
//   const [studentViewModalOpen, setStudentViewModalOpen] = useState(false);
//   const [studentSubmissionModalOpen, setStudentSubmissionModalOpen] = useState(false);
//   const [projectFormModalOpen, setProjectFormModalOpen] = useState(false);
//   const [selectedProject, setSelectedProject] = useState<ProjectWithDetails | null>(null);
//   const [formMode, setFormMode] = useState<'create' | 'edit' | 'duplicate'>('create');

//   useEffect(() => {
//     initializeData();
//   }, []);

//   useEffect(() => {
//     filterProjects();
//   }, [searchTerm, statusFilter, subjectFilter, projects]);

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setOpenMenuId(null);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const initializeData = async () => {
//     try {
//       setLoading(true);

//       // Get current user and role
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError || !user) throw new Error('User not authenticated');

//       // Get user role
//       const { data: profile, error: profileError } = await supabase
//         .from('user_profiles')
//         .select('role')
//         .eq('id', user.id)
//         .single();

//       if (profileError) throw profileError;
      
//       setUserRole(profile.role);

//       // Fetch projects based on role
//       if (profile.role === 'student') {
//         await fetchStudentProjects(user.id);
//       } else {
//         await fetchTeacherProjects();
//       }
//     } catch (error) {
//       console.error('Error initializing data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStudentProjects = async (userId: string) => {
//     try {
//       // Get student_profile using auth user id
//       const { data: studentProfile, error: profileError } = await supabase
//         .from('student_profiles')
//         .select('student_id')
//         .eq('id', userId)
//         .single();

//       if (profileError || !studentProfile) {
//         console.error('Student profile not found');
//         setProjects([]);
//         return;
//       }

//       setCurrentStudentId(studentProfile.student_id);

//       // Get student_id from class_assignments
//       const { data: classAssignment, error: classError } = await supabase
//         .from('class_assignments')
//         .select('student_id')
//         .eq('student_id', studentProfile.student_id)
//         .single();

//       if (classError || !classAssignment) {
//         console.error('Class assignment not found');
//         setProjects([]);
//         return;
//       }

//       // Get project assignments for this student
//       const { data: assignments, error: assignmentsError } = await supabase
//         .from('project_assignments')
//         .select('id, project_id, status, submission_date')
//         .eq('student_id', classAssignment.student_id);

//       if (assignmentsError) throw assignmentsError;

//       if (!assignments || assignments.length === 0) {
//         setProjects([]);
//         return;
//       }

//       // Get project details
//       const projectIds = assignments.map(a => a.project_id);
//       const { data: projectsData, error: projectsError } = await supabase
//         .from('projects')
//         .select('*')
//         .in('id', projectIds);

//       if (projectsError) throw projectsError;

//       // Get submissions for these assignments
//       const assignmentIds = assignments.map(a => a.id);
//       const { data: submissions, error: submissionsError } = await supabase
//         .from('project_submissions')
//         .select('id, assignment_id, submitted_at, grade, feedback')
//         .eq('student_id', classAssignment.student_id)
//         .in('assignment_id', assignmentIds);

//       if (submissionsError) throw submissionsError;

//       // Combine all data
//       const combinedProjects: ProjectWithDetails[] = (projectsData || []).map(project => {
//         const assignment = assignments.find(a => a.project_id === project.id);
//         const submission = submissions?.find(s => s.assignment_id === assignment?.id);

//         return {
//           id: project.id,
//           project_id: project.project_id,
//           title: project.title,
//           description: project.description,
//           subject: project.subject,
//           sdg_goal: project.sdg_goal,
//           due_date: project.due_date,
//           status: project.status,
//           assigned_count: 0,
//           completed_count: 0,
//           assignment_id: assignment?.id || '',
//           assignment_status: assignment?.status || 'not_started',
//           submission_id: submission?.id || null,
//           submitted_at: submission?.submitted_at || null,
//           grade: submission?.grade || null,
//           feedback: submission?.feedback || null
//         };
//       });

//       setProjects(combinedProjects);
//       setFilteredProjects(combinedProjects);
//     } catch (error) {
//       console.error('Error fetching student projects:', error);
//     }
//   };

//   const fetchTeacherProjects = async () => {
//     try {
//       const { data: projectsData, error: projectsError } = await supabase
//         .from('projects')
//         .select(`
//           id,
//           project_id,
//           title,
//           description,
//           subject,
//           sdg_goal,
//           due_date,
//           status
//         `)
//         .order('created_at', { ascending: false });

//       if (projectsError) throw projectsError;

//       const projectsWithCounts = await Promise.all(
//         (projectsData || []).map(async (project) => {
//           const { count: assignedCount } = await supabase
//             .from('project_assignments')
//             .select('*', { count: 'exact', head: true })
//             .eq('project_id', project.id);

//           const { count: completedCount } = await supabase
//             .from('project_assignments')
//             .select('*', { count: 'exact', head: true })
//             .eq('project_id', project.id)
//             .eq('status', 'completed');

//           return {
//             ...project,
//             assigned_count: assignedCount || 0,
//             completed_count: completedCount || 0
//           };
//         })
//       );

//       setProjects(projectsWithCounts);
//       setFilteredProjects(projectsWithCounts);
//     } catch (error) {
//       console.error('Error fetching teacher projects:', error);
//     }
//   };

//   const filterProjects = () => {
//     let filtered = [...projects];

//     if (searchTerm) {
//       filtered = filtered.filter(
//         (p) =>
//           p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           p.project_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           p.description.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (statusFilter !== 'all') {
//       if (userRole === 'student') {
//         filtered = filtered.filter((p) => {
//           if (statusFilter === 'pending') {
//             return !p.submission_id && new Date(p.due_date) > new Date();
//           }
//           if (statusFilter === 'submitted') {
//             return p.submission_id && !p.grade;
//           }
//           if (statusFilter === 'graded') {
//             return p.grade !== null;
//           }
//           if (statusFilter === 'overdue') {
//             return !p.submission_id && new Date(p.due_date) < new Date();
//           }
//           return true;
//         });
//       } else {
//         filtered = filtered.filter((p) => {
//           if (statusFilter === 'late') {
//             return new Date(p.due_date) < new Date() && p.status !== 'completed';
//           }
//           return p.status === statusFilter;
//         });
//       }
//     }

//     if (subjectFilter !== 'all') {
//       filtered = filtered.filter((p) => p.subject === subjectFilter);
//     }

//     setFilteredProjects(filtered);
//   };

//   // CRUD Operations
//   const handleCreateProject = () => {
//     setSelectedProject(null);
//     setFormMode('create');
//     setProjectFormModalOpen(true);
//     setOpenMenuId(null);
//   };

//   const handleEditProject = (project: ProjectWithDetails) => {
//     setSelectedProject(project);
//     setFormMode('edit');
//     setProjectFormModalOpen(true);
//     setOpenMenuId(null);
//   };

//   const handleDuplicateProject = (project: ProjectWithDetails) => {
//     setSelectedProject(project);
//     setFormMode('duplicate');
//     setProjectFormModalOpen(true);
//     setOpenMenuId(null);
//   };

//   const handleDeleteProject = async (project: ProjectWithDetails) => {
//     if (!confirm(`Are you sure you want to delete "${project.title}"?`)) {
//       return;
//     }

//     try {
//       const { error } = await supabase
//         .from('projects')
//         .delete()
//         .eq('id', project.id);

//       if (error) throw error;

//       await initializeData();
//       setOpenMenuId(null);
//     } catch (error) {
//       console.error('Error deleting project:', error);
//       alert('Failed to delete project. It may have associated submissions.');
//     }
//   };

//   const handleArchiveProject = async (project: ProjectWithDetails) => {
//     try {
//       const { error } = await supabase
//         .from('projects')
//         .update({ status: 'archived' })
//         .eq('id', project.id);

//       if (error) throw error;

//       await initializeData();
//       setOpenMenuId(null);
//     } catch (error) {
//       console.error('Error archiving project:', error);
//       alert('Failed to archive project.');
//     }
//   };

//   const handleReactivateProject = async (project: ProjectWithDetails) => {
//     try {
//       const { error } = await supabase
//         .from('projects')
//         .update({ status: 'active' })
//         .eq('id', project.id);

//       if (error) throw error;

//       await initializeData();
//       setOpenMenuId(null);
//     } catch (error) {
//       console.error('Error reactivating project:', error);
//       alert('Failed to reactivate project.');
//     }
//   };

//   const toggleMenu = (projectId: string) => {
//     setOpenMenuId(openMenuId === projectId ? null : projectId);
//   };

//   const handleViewDetails = (project: ProjectWithDetails) => {
//     setSelectedProject(project);
//     if (userRole === 'student') {
//       setStudentViewModalOpen(true);
//     } else {
//       setDetailsModalOpen(true);
//     }
//     setOpenMenuId(null);
//   };

//   const handleViewSubmissions = (project: ProjectWithDetails) => {
//     setSelectedProject(project);
//     setSubmissionsModalOpen(true);
//     setOpenMenuId(null);
//   };

//   const handleStudentSubmit = (project: ProjectWithDetails) => {
//     setSelectedProject(project);
//     setStudentSubmissionModalOpen(true);
//   };

//   const getStatusBadge = (project: ProjectWithDetails) => {
//     if (userRole === 'student') {
//       const dueDate = new Date(project.due_date);
//       const now = new Date();
//       const isOverdue = dueDate < now && !project.submission_id;

//       if (project.grade !== null) {
//         return (
//           <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
//             <CheckCircle2 className="w-3 h-3" />
//             Graded ({project.grade})
//           </span>
//         );
//       }

//       if (project.submission_id) {
//         return (
//           <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
//             <Clock className="w-3 h-3" />
//             Submitted
//           </span>
//         );
//       }

//       if (isOverdue) {
//         return (
//           <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
//             <AlertCircle className="w-3 h-3" />
//             Overdue
//           </span>
//         );
//       }

//       return (
//         <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
//           <Clock className="w-3 h-3" />
//           Pending
//         </span>
//       );
//     } else {
//       const dueDate = new Date(project.due_date);
//       const now = new Date();
//       const isLate = dueDate < now && project.status !== 'completed';

//       if (isLate) {
//         return (
//           <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
//             <AlertCircle className="w-3 h-3" />
//             Late
//           </span>
//         );
//       }

//       const statusColors: Record<string, string> = {
//         active: 'bg-yellow-100 text-yellow-700',
//         completed: 'bg-green-100 text-green-700',
//         draft: 'bg-gray-100 text-gray-700',
//         archived: 'bg-gray-100 text-gray-700'
//       };

//       const statusIcons: Record<string, React.ReactNode> = {
//         active: <Clock className="w-3 h-3" />,
//         completed: <CheckCircle2 className="w-3 h-3" />,
//         draft: <FileText className="w-3 h-3" />,
//         archived: <FileText className="w-3 h-3" />
//       };

//       return (
//         <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
//           {statusIcons[project.status]}
//           {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
//         </span>
//       );
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getDaysRemaining = (dueDate: string) => {
//     const due = new Date(dueDate);
//     const now = new Date();
//     const diffTime = due.getTime() - now.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays < 0) return 'Overdue';
//     if (diffDays === 0) return 'Due today';
//     if (diffDays === 1) return '1 day left';
//     return `${diffDays} days left`;
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
//         <div className="mb-8 flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">
//               {userRole === 'student' ? 'My Projects' : 'Project Tracking'}
//             </h1>
//             <p className="text-gray-600 mt-2">
//               {userRole === 'student' 
//                 ? 'View and submit your assigned projects' 
//                 : 'Monitor all assigned projects and their progress'}
//             </p>
//           </div>
//           {userRole !== 'student' && (
//             <button
//               onClick={handleCreateProject}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <FileText className="w-5 h-5" />
//               Create Project
//             </button>
//           )}
//         </div>

//         {/* Student Stats */}
//         {userRole === 'student' && (
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//               <p className="text-sm text-gray-600">Total Projects</p>
//               <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
//             </div>
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//               <p className="text-sm text-gray-600">Pending</p>
//               <p className="text-2xl font-bold text-yellow-600">
//                 {projects.filter(p => !p.submission_id && new Date(p.due_date) > new Date()).length}
//               </p>
//             </div>
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//               <p className="text-sm text-gray-600">Submitted</p>
//               <p className="text-2xl font-bold text-blue-600">
//                 {projects.filter(p => p.submission_id).length}
//               </p>
//             </div>
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//               <p className="text-sm text-gray-600">Graded</p>
//               <p className="text-2xl font-bold text-green-600">
//                 {projects.filter(p => p.grade !== null).length}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search projects..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               {userRole === 'student' ? (
//                 <>
//                   <option value="all">All Projects</option>
//                   <option value="pending">Pending</option>
//                   <option value="submitted">Submitted</option>
//                   <option value="graded">Graded</option>
//                   <option value="overdue">Overdue</option>
//                 </>
//               ) : (
//                 <>
//                   <option value="all">All Status</option>
//                   <option value="active">Active</option>
//                   <option value="completed">Completed</option>
//                   <option value="late">Late</option>
//                   <option value="draft">Draft</option>
//                   <option value="archived">Archived</option>
//                 </>
//               )}
//             </select>

//             <select
//               value={subjectFilter}
//               onChange={(e) => setSubjectFilter(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="all">All Subjects</option>
//               <option value="Science">Science</option>
//               <option value="Mathematics">Mathematics</option>
//               <option value="History">History</option>
//               <option value="English">English</option>
//               <option value="Geography">Geography</option>
//             </select>
//           </div>
//         </div>

//         {/* Projects Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredProjects.length === 0 ? (
//             <div className="col-span-full text-center py-12">
//               <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <p className="text-gray-500">No projects found</p>
//             </div>
//           ) : (
//             filteredProjects.map((project) => (
//               <div
//                 key={project.id}
//                 className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
//               >
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex-1">
//                     <p className="text-sm font-mono text-blue-600 mb-1">{project.project_id}</p>
//                     <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
//                       {project.title}
//                     </h3>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     {getStatusBadge(project)}
//                     {userRole !== 'student' && (
//                       <div className="relative" ref={openMenuId === project.id ? menuRef : null}>
//                         <button
//                           onClick={() => toggleMenu(project.id)}
//                           className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
//                         >
//                           <MoreVertical className="w-5 h-5 text-gray-600" />
//                         </button>
//                         {openMenuId === project.id && (
//                           <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
//                             <button
//                               onClick={() => handleViewDetails(project)}
//                               className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                             >
//                               <Eye className="w-4 h-4" />
//                               View Details
//                             </button>
//                             <button
//                               onClick={() => handleEditProject(project)}
//                               className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                             >
//                               <Edit className="w-4 h-4" />
//                               Edit Project
//                             </button>
//                             <button
//                               onClick={() => handleDuplicateProject(project)}
//                               className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                             >
//                               <Copy className="w-4 h-4" />
//                               Duplicate
//                             </button>
//                             <button
//                               onClick={() => handleViewSubmissions(project)}
//                               className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                             >
//                               <FileText className="w-4 h-4" />
//                               View Submissions
//                             </button>
//                             <div className="border-t border-gray-200 my-1"></div>
//                             {project.status === 'archived' ? (
//                               <button
//                                 onClick={() => handleReactivateProject(project)}
//                                 className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
//                               >
//                                 <RefreshCw className="w-4 h-4" />
//                                 Reactivate
//                               </button>
//                             ) : (
//                               <button
//                                 onClick={() => handleArchiveProject(project)}
//                                 className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                               >
//                                 <Archive className="w-4 h-4" />
//                                 Archive
//                               </button>
//                             )}
//                             <button
//                               onClick={() => handleDeleteProject(project)}
//                               className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                               Delete
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

//                 <div className="flex items-center gap-2 mb-4">
//                   <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
//                     {project.subject}
//                   </span>
//                   {project.sdg_goal && (
//                     <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
//                       {project.sdg_goal}
//                     </span>
//                   )}
//                 </div>

//                 {/* Teacher View Stats */}
//                 {userRole !== 'student' && (
//                   <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
//                     <div className="flex items-center gap-1">
//                       <Users className="w-4 h-4" />
//                       <span>{project.assigned_count} assigned</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <CheckCircle2 className="w-4 h-4" />
//                       <span>{project.completed_count} completed</span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Due Date */}
//                 <div className="flex items-center justify-between text-sm mb-4 p-3 bg-gray-50 rounded-lg">
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <Clock className="w-4 h-4" />
//                     <span>Due: {formatDate(project.due_date)}</span>
//                   </div>
//                   {userRole === 'student' && (
//                     <span className={`font-medium ${
//                       getDaysRemaining(project.due_date) === 'Overdue' 
//                         ? 'text-red-600' 
//                         : 'text-gray-900'
//                     }`}>
//                       {getDaysRemaining(project.due_date)}
//                     </span>
//                   )}
//                 </div>

//                 {/* Student Feedback */}
//                 {userRole === 'student' && project.feedback && (
//                   <div className="mb-4 p-3 bg-green-50 rounded-lg">
//                     <p className="text-xs text-green-600 mb-1">Teacher Feedback:</p>
//                     <p className="text-sm text-green-900 line-clamp-2">{project.feedback}</p>
//                   </div>
//                 )}

//                 {/* Actions */}
//                 <div className="pt-4 border-t border-gray-200">
//                   {userRole === 'student' ? (
//                     <div className="space-y-2">
//                       <button
//                         onClick={() => handleViewDetails(project)}
//                         className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                       >
//                         <Eye className="w-4 h-4" />
//                         View Details
//                       </button>
//                       {!project.submission_id ? (
//                         <button
//                           onClick={() => handleStudentSubmit(project)}
//                           disabled={new Date(project.due_date) < new Date()}
//                           className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//                         >
//                           <Upload className="w-4 h-4" />
//                           {new Date(project.due_date) < new Date() ? 'Submission Closed' : 'Submit Project'}
//                         </button>
//                       ) : project.grade === null ? (
//                         <button
//                           onClick={() => handleStudentSubmit(project)}
//                           className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
//                         >
//                           <FileText className="w-4 h-4" />
//                           Resubmit Project
//                         </button>
//                       ) : null}
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => handleViewDetails(project)}
//                         className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                       >
//                         <Eye className="w-4 h-4" />
//                         View Details
//                       </button>
//                       <button
//                         onClick={() => handleViewSubmissions(project)}
//                         className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
//                       >
//                         <FileText className="w-4 h-4" />
//                         Submissions
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Teacher Modals */}
//       {userRole !== 'student' && (
//         <>
//           <ProjectDetailsModal
//             isOpen={detailsModalOpen}
//             onClose={() => setDetailsModalOpen(false)}
//             projectId={selectedProject?.id || ''}
//           />

//           <ProjectSubmissionsModal
//             isOpen={submissionsModalOpen}
//             onClose={() => setSubmissionsModalOpen(false)}
//             projectId={selectedProject?.id || ''}
//           />

//           {/* <ProjectFormModal
//             isOpen={projectFormModalOpen}
//             onClose={() => {
//               setProjectFormModalOpen(false);
//               setSelectedProject(null);
//             }}
//             project={selectedProject}
//             mode={formMode}
//             onSuccess={initializeData}
//           /> */}
//         </>
//       )}

//       {/* Student Modals */}
//       {userRole === 'student' && (
//         <>
//           <StudentProjectViewModal
//             isOpen={studentViewModalOpen}
//             onClose={() => setStudentViewModalOpen(false)}
//             project={selectedProject}
//           />

//           <StudentSubmissionModal
//             isOpen={studentSubmissionModalOpen}
//             onClose={() => {
//               setStudentSubmissionModalOpen(false);
//               setSelectedProject(null);
//             }}
//             project={selectedProject}
//             studentId={currentStudentId}
//             onSubmitSuccess={initializeData}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default ProjectTracking;
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Search,
  Eye,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Upload,
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  Copy,
  RefreshCw,
  Plus
} from 'lucide-react';
import ProjectDetailsModal from './ProjectDetailsModal';
import ProjectSubmissionsModal from './ProjectSubmissionsModal';
import StudentProjectViewModal from './StudentProjectView';
import StudentSubmissionModal from './StudentSubmissionModal';
import ProjectFormModal from './ProjectFormModal';

interface ProjectWithDetails {
  id: string;
  project_id: string;
  title: string;
  description: string;
  subject: string;
  sdg_goal: string;
  due_date: string;
  status: string;
  assigned_count: number;
  completed_count: number;
  // Student-specific fields
  assignment_id?: string;
  assignment_status?: string;
  submission_id?: string | null;
  submitted_at?: string | null;
  grade?: number | null;
  feedback?: string | null;
}

const ProjectTracking: React.FC = () => {
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [submissionsModalOpen, setSubmissionsModalOpen] = useState(false);
  const [studentViewModalOpen, setStudentViewModalOpen] = useState(false);
  const [studentSubmissionModalOpen, setStudentSubmissionModalOpen] = useState(false);
  const [projectFormModalOpen, setProjectFormModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectWithDetails | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'duplicate'>('create');

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [searchTerm, statusFilter, subjectFilter, projects, showArchived]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);

      // Get current user and role
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      // Get user role
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      
      setUserRole(profile.role);

      // Fetch projects based on role
      if (profile.role === 'student') {
        await fetchStudentProjects(user.id);
      } else {
        await fetchTeacherProjects();
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentProjects = async (userId: string) => {
    try {
      // Get student_profile using auth user id
      const { data: studentProfile, error: profileError } = await supabase
        .from('student_profiles')
        .select('student_id')
        .eq('id', userId)
        .single();

      if (profileError || !studentProfile) {
        console.error('Student profile not found');
        setProjects([]);
        return;
      }

      setCurrentStudentId(studentProfile.student_id);

      // Get student_id from class_assignments
      const { data: classAssignment, error: classError } = await supabase
        .from('class_assignments')
        .select('student_id')
        .eq('student_id', studentProfile.student_id)
        .single();

      if (classError || !classAssignment) {
        console.error('Class assignment not found');
        setProjects([]);
        return;
      }

      // Get project assignments for this student
      const { data: assignments, error: assignmentsError } = await supabase
        .from('project_assignments')
        .select('id, project_id, status, submission_date')
        .eq('student_id', classAssignment.student_id);

      if (assignmentsError) throw assignmentsError;

      if (!assignments || assignments.length === 0) {
        setProjects([]);
        return;
      }

      // Get project details (exclude archived for students)
      const projectIds = assignments.map(a => a.project_id);
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .in('id', projectIds)
        .neq('status', 'archived'); // Hide archived projects from students

      if (projectsError) throw projectsError;

      // Get submissions for these assignments
      const assignmentIds = assignments.map(a => a.id);
      const { data: submissions, error: submissionsError } = await supabase
        .from('project_submissions')
        .select('id, assignment_id, submitted_at, grade, feedback')
        .eq('student_id', classAssignment.student_id)
        .in('assignment_id', assignmentIds);

      if (submissionsError) throw submissionsError;

      // Combine all data
      const combinedProjects: ProjectWithDetails[] = (projectsData || []).map(project => {
        const assignment = assignments.find(a => a.project_id === project.id);
        const submission = submissions?.find(s => s.assignment_id === assignment?.id);

        return {
          id: project.id,
          project_id: project.project_id,
          title: project.title,
          description: project.description,
          subject: project.subject,
          sdg_goal: project.sdg_goal,
          due_date: project.due_date,
          status: project.status,
          assigned_count: 0,
          completed_count: 0,
          assignment_id: assignment?.id || '',
          assignment_status: assignment?.status || 'not_started',
          submission_id: submission?.id || null,
          submitted_at: submission?.submitted_at || null,
          grade: submission?.grade || null,
          feedback: submission?.feedback || null
        };
      });

      setProjects(combinedProjects);
      setFilteredProjects(combinedProjects);
    } catch (error) {
      console.error('Error fetching student projects:', error);
    }
  };

  const fetchTeacherProjects = async () => {
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          project_id,
          title,
          description,
          subject,
          sdg_goal,
          due_date,
          status
        `)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      const projectsWithCounts = await Promise.all(
        (projectsData || []).map(async (project) => {
          const { count: assignedCount } = await supabase
            .from('project_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', project.id);

          const { count: completedCount } = await supabase
            .from('project_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', project.id)
            .eq('status', 'completed');

          return {
            ...project,
            assigned_count: assignedCount || 0,
            completed_count: completedCount || 0
          };
        })
      );

      setProjects(projectsWithCounts);
      setFilteredProjects(projectsWithCounts);
    } catch (error) {
      console.error('Error fetching teacher projects:', error);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // Hide archived unless explicitly shown
    if (!showArchived && userRole !== 'student') {
      filtered = filtered.filter(p => p.status !== 'archived');
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.project_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      if (userRole === 'student') {
        filtered = filtered.filter((p) => {
          if (statusFilter === 'pending') {
            return !p.submission_id && new Date(p.due_date) > new Date();
          }
          if (statusFilter === 'submitted') {
            return p.submission_id && !p.grade;
          }
          if (statusFilter === 'graded') {
            return p.grade !== null;
          }
          if (statusFilter === 'overdue') {
            return !p.submission_id && new Date(p.due_date) < new Date();
          }
          return true;
        });
      } else {
        filtered = filtered.filter((p) => {
          if (statusFilter === 'late') {
            return new Date(p.due_date) < new Date() && p.status !== 'completed';
          }
          return p.status === statusFilter;
        });
      }
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter((p) => p.subject === subjectFilter);
    }

    setFilteredProjects(filtered);
  };

  // CRUD Operations
  const handleCreateProject = () => {
    setSelectedProject(null);
    setFormMode('create');
    setProjectFormModalOpen(true);
    setOpenMenuId(null);
  };

  const handleEditProject = (project: ProjectWithDetails) => {
    setSelectedProject(project);
    setFormMode('edit');
    setProjectFormModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDuplicateProject = (project: ProjectWithDetails) => {
    setSelectedProject(project);
    setFormMode('duplicate');
    setProjectFormModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteProject = async (project: ProjectWithDetails) => {
    if (!confirm(`Are you sure you want to delete "${project.title}"?\n\nThis will also delete all associated submissions and cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);

      if (error) throw error;

      await initializeData();
      setOpenMenuId(null);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. It may have associated data that prevents deletion.');
    }
  };

  const handleArchiveProject = async (project: ProjectWithDetails) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'archived' })
        .eq('id', project.id);

      if (error) throw error;

      await initializeData();
      setOpenMenuId(null);
    } catch (error) {
      console.error('Error archiving project:', error);
      alert('Failed to archive project.');
    }
  };

  const handleReactivateProject = async (project: ProjectWithDetails) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'active' })
        .eq('id', project.id);

      if (error) throw error;

      await initializeData();
      setOpenMenuId(null);
    } catch (error) {
      console.error('Error reactivating project:', error);
      alert('Failed to reactivate project.');
    }
  };

  const toggleMenu = (projectId: string) => {
    setOpenMenuId(openMenuId === projectId ? null : projectId);
  };

  const handleViewDetails = (project: ProjectWithDetails) => {
    setSelectedProject(project);
    if (userRole === 'student') {
      setStudentViewModalOpen(true);
    } else {
      setDetailsModalOpen(true);
    }
    setOpenMenuId(null);
  };

  const handleViewSubmissions = (project: ProjectWithDetails) => {
    setSelectedProject(project);
    setSubmissionsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleStudentSubmit = (project: ProjectWithDetails) => {
    setSelectedProject(project);
    setStudentSubmissionModalOpen(true);
  };

  const getStatusBadge = (project: ProjectWithDetails) => {
    if (userRole === 'student') {
      const dueDate = new Date(project.due_date);
      const now = new Date();
      const isOverdue = dueDate < now && !project.submission_id;

      if (project.grade !== null) {
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle2 className="w-3 h-3" />
            Graded ({project.grade})
          </span>
        );
      }

      if (project.submission_id) {
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <Clock className="w-3 h-3" />
            Submitted
          </span>
        );
      }

      if (isOverdue) {
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <AlertCircle className="w-3 h-3" />
            Overdue
          </span>
        );
      }

      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    } else {
      const dueDate = new Date(project.due_date);
      const now = new Date();
      const isLate = dueDate < now && project.status !== 'completed';

      if (isLate) {
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <AlertCircle className="w-3 h-3" />
            Late
          </span>
        );
      }

      const statusColors: Record<string, string> = {
        active: 'bg-yellow-100 text-yellow-700',
        completed: 'bg-green-100 text-green-700',
        draft: 'bg-gray-100 text-gray-700',
        archived: 'bg-purple-100 text-purple-700'
      };

      const statusIcons: Record<string, React.ReactNode> = {
        active: <Clock className="w-3 h-3" />,
        completed: <CheckCircle2 className="w-3 h-3" />,
        draft: <FileText className="w-3 h-3" />,
        archived: <Archive className="w-3 h-3" />
      };

      return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
          {statusIcons[project.status]}
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {userRole === 'student' ? 'My Projects' : 'Project Tracking'}
            </h1>
            <p className="text-gray-600 mt-2">
              {userRole === 'student' 
                ? 'View and submit your assigned projects' 
                : 'Monitor all assigned projects and their progress'}
            </p>
          </div>
          {userRole !== 'student' && (
            <button
              onClick={handleCreateProject}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Project
            </button>
          )}
        </div>

        {/* Student Stats */}
        {userRole === 'student' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {projects.filter(p => !p.submission_id && new Date(p.due_date) > new Date()).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Submitted</p>
              <p className="text-2xl font-bold text-blue-600">
                {projects.filter(p => p.submission_id).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Graded</p>
              <p className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.grade !== null).length}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {userRole === 'student' ? (
                <>
                  <option value="all">All Projects</option>
                  <option value="pending">Pending</option>
                  <option value="submitted">Submitted</option>
                  <option value="graded">Graded</option>
                  <option value="overdue">Overdue</option>
                </>
              ) : (
                <>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="late">Late</option>
                  <option value="draft">Draft</option>
                  {showArchived && <option value="archived">Archived</option>}
                </>
              )}
            </select>

            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Subjects</option>
              <option value="Science">Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="History">History</option>
              <option value="English">English</option>
              <option value="Geography">Geography</option>
            </select>
          </div>

          {/* Show Archived Toggle (Teachers only) */}
          {userRole !== 'student' && (
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="showArchived"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="showArchived" className="text-sm text-gray-700 cursor-pointer">
                Show archived projects
              </label>
            </div>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No projects found</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-mono text-blue-600 mb-1">{project.project_id}</p>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(project)}
                    {userRole !== 'student' && (
                      <div className="relative" ref={openMenuId === project.id ? menuRef : null}>
                        <button
                          onClick={() => toggleMenu(project.id)}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        {openMenuId === project.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button
                              onClick={() => handleViewDetails(project)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => handleEditProject(project)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Edit className="w-4 h-4" />
                              Edit Project
                            </button>
                            <button
                              onClick={() => handleDuplicateProject(project)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Copy className="w-4 h-4" />
                              Duplicate
                            </button>
                            <button
                              onClick={() => handleViewSubmissions(project)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <FileText className="w-4 h-4" />
                              View Submissions
                            </button>
                            <div className="border-t border-gray-200 my-1"></div>
                            {project.status === 'archived' ? (
                              <button
                                onClick={() => handleReactivateProject(project)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                              >
                                <RefreshCw className="w-4 h-4" />
                                Reactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleArchiveProject(project)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Archive className="w-4 h-4" />
                                Archive
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteProject(project)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                    {project.subject}
                  </span>
                  {project.sdg_goal && (
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
                      {project.sdg_goal}
                    </span>
                  )}
                </div>

                {/* Teacher View Stats */}
                {userRole !== 'student' && (
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{project.assigned_count} assigned</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{project.completed_count} completed</span>
                    </div>
                  </div>
                )}

                {/* Due Date */}
                <div className="flex items-center justify-between text-sm mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Due: {formatDate(project.due_date)}</span>
                  </div>
                  {userRole === 'student' && (
                    <span className={`font-medium ${
                      getDaysRemaining(project.due_date) === 'Overdue' 
                        ? 'text-red-600' 
                        : 'text-gray-900'
                    }`}>
                      {getDaysRemaining(project.due_date)}
                    </span>
                  )}
                </div>

                {/* Student Feedback */}
                {userRole === 'student' && project.feedback && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 mb-1">Teacher Feedback:</p>
                    <p className="text-sm text-green-900 line-clamp-2">{project.feedback}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-gray-200">
                  {userRole === 'student' ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleViewDetails(project)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      {!project.submission_id ? (
                        <button
                          onClick={() => handleStudentSubmit(project)}
                          disabled={new Date(project.due_date) < new Date()}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <Upload className="w-4 h-4" />
                          {new Date(project.due_date) < new Date() ? 'Submission Closed' : 'Submit Project'}
                        </button>
                      ) : project.grade === null ? (
                        <button
                          onClick={() => handleStudentSubmit(project)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          Resubmit Project
                        </button>
                      ) : null}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(project)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleViewSubmissions(project)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Submissions
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Teacher Modals */}
      {userRole !== 'student' && (
        <>
          <ProjectDetailsModal
            isOpen={detailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
            projectId={selectedProject?.id || ''}
          />

          <ProjectSubmissionsModal
            isOpen={submissionsModalOpen}
            onClose={() => setSubmissionsModalOpen(false)}
            projectId={selectedProject?.id || ''}
          />

          <ProjectFormModal
            isOpen={projectFormModalOpen}
            onClose={() => {
              setProjectFormModalOpen(false);
              setSelectedProject(null);
            }}
            project={selectedProject}
            mode={formMode}
            onSuccess={initializeData}
          />
        </>
      )}

      {/* Student Modals */}
      {userRole === 'student' && (
        <>
          <StudentProjectViewModal
  isOpen={studentViewModalOpen}
  onClose={() => setStudentViewModalOpen(false)}
  project={selectedProject}
/>


          <StudentSubmissionModal
            isOpen={studentSubmissionModalOpen}
            onClose={() => {
              setStudentSubmissionModalOpen(false);
              setSelectedProject(null);
            }}
            project={selectedProject}
            studentId={currentStudentId}
            onSubmitSuccess={initializeData}
          />
        </>
      )}
    </div>
  );
};

export default ProjectTracking;
