// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // ==== CONTEXT & LAYOUT ====
// import { AuthProvider, useAuth } from './context/AuthContext';
// import { ProtectedRoute } from './components/auth/ProtectedRoute';
// import { DashboardLayout } from './components/layout/DashboardLayout';

// // ==== AUTH PAGES ====
// import { LoginPage } from './components/auth/Login';
// import { VerifyAccountPage } from './components/auth/VerifyAccount';
// import { AuthCallback } from './components/auth/AuthCallback';
// import { AccessDenied } from './pages/admin/AccessDenied';

// // ==== DASHBOARDS ====
// import AdminDashboard from './pages/dashboard/AdminDashboard';
// import StudentDashboard from './pages/dashboard/StudentDashboard';

// // ==== STUDENT & TEACHER MANAGEMENT ====
// import  Students  from './pages/students/Students';
// import { AddStudentPage } from './pages/admin/AddStudent';
// import { Teachers } from './pages/teachers/teachers';
// import { AddTeacherPage } from './pages/admin/AddTeacher';
// import { CreateStaffPage } from './pages/admin/createstaff';
// import  AddParent  from './pages/admin/AddParent'
// import  AddStaffPage  from './pages/admin/AddStaff';

// // ==== CLASS & SUBJECT MANAGEMENT ====
// import { Classes } from './pages/classes/Classes';
// import { ClassStudents } from './pages/classes/ClassStudents';
// import { Subjects } from './pages/subjects/Subjects';
// import { SubjectDetails } from './pages/subjects/subjectview';

// // ==== ATTENDANCE ====
// import StudentsAttendance from './pages/attendance/StudentsAttendance';
// import MarkAttendance from './pages/attendance/MarkAttendance';
// import TeacherAttendanceOverview from './pages/attendance/TeacherAttendance';
// import MarkTeacherAttendance from './pages/attendance/TeacherAttendancePage';

// // ==== EXAMS & RESULTS ====
// import ExamScheduling from './components/exams/ExamScheduling';
// import ResultsPage from './components/exams/ResultsPage';

// // ==== FINANCE ====
// import FeeManagementContent from './pages/finance/fees/FeeManagementContent';
// import FeeStructureMaster from './pages/finance/fees/FeeStructureMaster';
// import FeeAssignment from './pages/finance/fees/AssignFeeStructure';
// import FeeManagementDashboard from './pages/finance/fees/new/FeeManagementDashboard';
// import FeePaymentManagement from './pages/finance/fees/FeePaymentManagement';
// import ExpenseManagement from './pages/finance/expenses/ExpenseManagement';

// // ==== PROJECTS ====
// import ProjectDashboard from './pages/project/ProjectDashboard';
// import ProjectTracking from './pages/project/ProjectTracking';
// import AssignProject from './pages/project/AssignProject';
// import ProjectReports from './pages/project/ProjectReports';

// // ==== OTHER MODULES ====
// import EventsPage from './pages/events/eventpage';
// import LibraryManagementPage from './pages/library/LibraryManagementPage';
// import TransportManagement from './pages/transport/new/TransportManagement';
// import AchievementsPage from './pages/grades/AchievementsPage';
// //import AdminBusTrackingfrom from './pages/transport/AdminBusTracking';
// import DriverDashboard from './pages/transport/new/DriverDashboard';
// // Complaints 
// import Complaints from './pages/complaints/Complaints';


// // ==== DASHBOARD CONTENT SWITCHER ====
// const DashboardContent = () => {
//   const { user, userProfile } = useAuth();

//   const getDisplayName = () => {
//     if (userProfile) {
//       return `${userProfile.first_name} ${userProfile.last_name}`;
//     }
//     return user?.username || 'User';
//   };

//   // Role-based dashboard rendering
//   switch (user?.role) {
//     case 'admin':
//       return <AdminDashboard />;
    
//     case 'student':
//       return <StudentDashboard />;
    
//     case 'teacher':
//       return (
//         <div className="p-6">
//           <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
//           <p className="text-gray-600 mt-2">Welcome back, {getDisplayName()}!</p>
//           <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <p className="text-blue-800">Teacher dashboard features coming soon...</p>
//           </div>
//         </div>
//       );
    
//     case 'staff':
//       return (
//         <div className="p-6">
//           <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
//           <p className="text-gray-600 mt-2">Welcome back, {getDisplayName()}!</p>
//           <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
//             <p className="text-green-800">Staff dashboard features coming soon...</p>
//           </div>
//         </div>
//       );
    
//     case 'parent':
//       return (
//         <div className="p-6">
//           <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
//           <p className="text-gray-600 mt-2">Welcome back, {getDisplayName()}!</p>
//           <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
//             <p className="text-purple-800">Parent dashboard features coming soon...</p>
//           </div>
//         </div>
//       );
    
//     default:
//       return (
//         <div className="p-6">
//           <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
//             <h1 className="text-2xl font-bold text-red-900 mb-2">Unauthorized</h1>
//             <p className="text-red-600">You don't have access to this area.</p>
//           </div>
//         </div>
//       );
//   }
// };

// // ==== COMING SOON PLACEHOLDER ====
// const ComingSoon: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
//   <div className="p-6">
//     <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
//     <p className="text-gray-600 mt-2">{description || 'Coming soon...'}</p>
//   </div>
// );

// // ==== MAIN APP COMPONENT ====
// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <Routes>
//           {/* ==================== PUBLIC ROUTES ==================== */}
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/auth/callback" element={<AuthCallback />} />
//           <Route path="/access-denied" element={<AccessDenied />} />

//           {/* ==================== VERIFY ACCOUNT (Auth Required) ==================== */}
//           <Route
//             path="/auth/verify-account"
//             element={
//               <ProtectedRoute>
//                 <VerifyAccountPage />
//               </ProtectedRoute>
//             }
//           />

//           {/* ==================== DASHBOARD (All Authenticated Users) ==================== */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <DashboardLayout>
//                   <DashboardContent />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* ==================== STUDENT MANAGEMENT ==================== */}
//           <Route
//             path="/students"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'teacher']}>
//                 <DashboardLayout>
//                   <Students />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/add-student"
//             element={
//               <ProtectedRoute allowedRoles={['admin']}>
//                 <DashboardLayout>
//                   <AddStudentPage />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* ==================== TEACHER MANAGEMENT ==================== */}
//           <Route
//             path="/teachers"
//             element={
//               <ProtectedRoute allowedRoles={['admin']}>
//                 <DashboardLayout>
//                   <Teachers />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/add-teacher"
//             element={
//               <ProtectedRoute allowedRoles={['admin']}>
//                 <DashboardLayout>
//                   <AddTeacherPage />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* ==================== STAFF MANAGEMENT ==================== */}
//           <Route
//             path="/admin/create-staff"
//             element={
//               <ProtectedRoute allowedRoles={['admin']}>
//                 <DashboardLayout>
//                   <CreateStaffPage />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/admin/add-staff"
//             element={
//               <ProtectedRoute allowedRoles={['admin']}>
//                 <DashboardLayout>
//                   <AddStaffPage />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/add-parent"
//             element={
//               <ProtectedRoute allowedRoles={['admin']}>
//                 <DashboardLayout>
//                   <AddParent />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* ==================== CLASS MANAGEMENT ==================== */}
//           <Route
//             path="/classes"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'teacher']}>
//                 <DashboardLayout>
//                   <Classes />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/classes/:classId/students"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'teacher']}>
//                 <DashboardLayout>
//                   <ClassStudents />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* ==================== SUBJECT MANAGEMENT ==================== */}
//           <Route
//             path="/subjects"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'teacher']}>
//                 <DashboardLayout>
//                   <Subjects />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/subjects/:id"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'teacher']}>
//                 <DashboardLayout>
//                   <SubjectDetails />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* ==================== STUDENT ATTENDANCE ==================== */}
//           <Route
//             path="/attendance/student"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'teacher']}>
//                 <DashboardLayout>
//                   <StudentsAttendance />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/markattendance/student"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'teacher']}>
//                 <DashboardLayout>
//                   <MarkAttendance />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* ==================== TEACHER ATTENDANCE ==================== */}
//           <Route
//             path="/attendance/teacher"
//             element={
//               <ProtectedRoute allowedRoles={['admin']}>
//                 <DashboardLayout>
//                   <TeacherAttendanceOverview />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/markattendance/teacher"
//             element={
//               <ProtectedRoute allowedRoles={['admin']}>
//                 <DashboardLayout>
//                   <MarkTeacherAttendance />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* ==================== EXAMS & RESULTS ==================== */}
//           <Route
//             path="/exams"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'teacher']}>
//                 <DashboardLayout>
//                   <ExamScheduling />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/results"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
//                 <DashboardLayout>
//                   <ResultsPage />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* ==================== CERTIFICATES ==================== */}
//           <Route
//             path="/certificates"
//             element={
//               <ProtectedRoute>
//                 <DashboardLayout>
//                   <ComingSoon title="Certificates" />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* ==================== FEE MANAGEMENT ==================== */}
//           <Route
//             path="/feestructure"
//             element={
//               <ProtectedRoute allowedRoles={['admin']}>
//                 <DashboardLayout>
//                   <FeeManagementContent />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/fees"
//             element={
//               <ProtectedRoute allowedRoles={['admin']}>
//                 <DashboardLayout>
//                   <FeeStructureMaster />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/assignfeestructure"
//             element={
//               <ProtectedRoute allowedRoles={['admin']}>
//                 <DashboardLayout>
//                   <FeeAssignment />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/feepayments"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'staff']}>
//                 <DashboardLayout>
//                   <FeePaymentManagement />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/Feedashboard"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'staff']}>
//                 <DashboardLayout>
//                   <FeeManagementDashboard />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* ==================== EXPENSE MANAGEMENT ==================== */}
//           <Route
//             path="/expenses"
//             element={
//               <ProtectedRoute allowedRoles={['admin']}>
//                 <DashboardLayout>
//                   <ExpenseManagement />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* ==================== PROJECT MANAGEMENT ==================== */}
//           <Route
//             path="/project/dashboard"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'teacher']}>
//                 <DashboardLayout>
//                   <ProjectDashboard />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/projects/assign"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'teacher']}>
//                 <DashboardLayout>
//                   <AssignProject />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/projects/tracking"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
//                 <DashboardLayout>
//                   <ProjectTracking />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/projects/reports"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'teacher']}>
//                 <DashboardLayout>
//                   <ProjectReports />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* ==================== LIBRARY ==================== */}
//           <Route
//             path="/library"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'staff', 'teacher', 'student']}>
//                 <DashboardLayout>
//                   <LibraryManagementPage />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* ==================== TRANSPORT ==================== */}
//           <Route
//             path="/transport"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'staff']}>
//                 <DashboardLayout>
//                   <TransportManagement />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           {/* <Route
//             path="/adminBustracking"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'staff']}>
//                 <DashboardLayout>
//                   <AdminBusTracking />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           /> */}
//           <Route
//             path="/driverdashboard"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'staff']}>
//                 <DashboardLayout>
//                   <DriverDashboard />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
          
          

//           {/* ==================== EVENTS ==================== */}
//           <Route
//             path="/events"
//             element={
//               <ProtectedRoute>
//                 <DashboardLayout>
//                   <EventsPage />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* ==================== REPORTS ==================== */}
//           <Route
//             path="/student-reports"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'teacher']}>
//                 <DashboardLayout>
//                   <AchievementsPage />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/attendance-reports"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'teacher']}>
//                 <DashboardLayout>
//                   <ComingSoon title="Attendance Reports" />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/financial-summary"
//             element={
//               <ProtectedRoute allowedRoles={['admin']}>
//                 <DashboardLayout>
//                   <ComingSoon title="Financial Summary" />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/financial-reports"
//             element={
//               <ProtectedRoute allowedRoles={['admin']}>
//                 <DashboardLayout>
//                   <ComingSoon title="Financial Reports" />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* ==================== COMMUNICATION ==================== */}
//           <Route
//             path="/notifications"
//             element={
//               <ProtectedRoute>
//                 <DashboardLayout>
//                   <ComingSoon title="Notifications" />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/messages"
//             element={
//               <ProtectedRoute>
//                 <DashboardLayout>
//                   <ComingSoon title="Messages" />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/announcements"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'teacher']}>
//                 <DashboardLayout>
//                   <ComingSoon title="Announcements" />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* ==================== SETTINGS ==================== */}
//           <Route
//             path="/settings"
//             element={
//               <ProtectedRoute>
//                 <DashboardLayout>
//                   <ComingSoon title="System Settings" />
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />
//           {/* ==================== COMPLAINTS ==================== */}
//           <Route
//             path="/complaints"
//             element={
//               <ProtectedRoute allowedRoles={['admin', 'teacher', 'student' ,'parent','staff']}>
//                 <DashboardLayout>
//                   <Complaints/>
//                 </DashboardLayout>
//               </ProtectedRoute>
//             }
//           />


//           {/* ==================== FALLBACK ROUTES ==================== */}
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />
//           <Route path="*" element={<Navigate to="/dashboard" replace />} />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ==== CONTEXT & LAYOUT ====
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';

// ==== AUTH PAGES ====
import { LoginPage } from './components/auth/Login';
import { VerifyAccountPage } from './components/auth/VerifyAccount';
import { AuthCallback } from './components/auth/AuthCallback';
import { AccessDenied } from './pages/admin/AccessDenied';

// ==== DASHBOARDS ====
import AdminDashboard from './pages/dashboard/AdminDashboard';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';
import ParentDashboard from  './pages/dashboard/ParentDashboard';
import StaffDashboard from './pages/dashboard/StaffDashboard';
import StudentAnalytics from './pages/dashboard/StudentAnalytics';


// ==== STUDENT & TEACHER MANAGEMENT ====
import  Students  from './pages/students/Students';
import { AddStudentPage } from './pages/admin/AddStudent';
import { Teachers } from './pages/teachers/teachers';
import { AddTeacherPage } from './pages/admin/AddTeacher';
import { CreateStaffPage } from './pages/admin/createstaff';
import  AddParent  from './pages/admin/AddParent'
import  AddStaffPage  from './pages/admin/AddStaff';

// ==== CLASS & SUBJECT MANAGEMENT ====
import { Classes } from './pages/classes/Classes';
import { ClassStudents } from './pages/classes/ClassStudents';
import { Subjects } from './pages/subjects/Subjects';
import { SubjectDetails } from './pages/subjects/subjectview';

// ==== ATTENDANCE ====
import StudentsAttendance from './pages/attendance/StudentsAttendance';
import MarkAttendance from './pages/attendance/MarkAttendance';
import TeacherAttendanceOverview from './pages/attendance/TeacherAttendance';
import MarkTeacherAttendance from './pages/attendance/TeacherAttendancePage';

// ==== EXAMS & RESULTS ====
import ExamScheduling from './components/exams/ExamScheduling';
import ResultsPage from './components/exams/ResultsPage';

// ==== FINANCE ====
import FeeManagementContent from './pages/finance/fees/FeeManagementContent';
import FeeStructureMaster from './pages/finance/fees/FeeStructureMaster';
import FeeAssignment from './pages/finance/fees/AssignFeeStructure';
//import FeeManagementDashboard from './pages/finance/fees/new/FeeManagementDashboard';
import FeePaymentManagement from './pages/finance/fees/FeePaymentManagement';
import ExpenseManagement from './pages/finance/expenses/ExpenseManagement';

// ==== PROJECTS ====
import ProjectDashboard from './pages/project/ProjectDashboard';
import ProjectTracking from './pages/project/ProjectTracking';
import AssignProject from './pages/project/AssignProject';
import ProjectReports from './pages/project/ProjectReports';

// ==== OTHER MODULES ====
import MyAttendance from './pages/attendance/student/teacher/MyAttendance';
import MyChildren from './pages/parent/MyChildren'
import EventsPage from './pages/events/eventpage';
import LibraryManagementPage from './pages/library/LibraryManagementPage';
import TransportManagement from './pages/transport/new/TransportManagement';
import AchievementsPage from './pages/grades/AchievementsPage';
import AdminBusTracking from './pages/transport/AdminBusTracking';
import DriverDashboard from './pages/transport/new/DriverDashboard';
// Complaints 
import Complaints from './pages/complaints/Complaints';
import LessonPlanGenerator from './pages/lesson plan/LessonPlanGenerator';
import Timetable from './pages/schedule/TimeTableManagement';
import LessonPlanApproval from './pages/lesson plan/LessonPlanApproval';
import Assignments from './pages/assignments/Assignments';
import Messages from './pages/messages/Messages';
import LeaveManagement from './pages/leaveapplication/LeaveManagement';
import StudentExamView from './pages/examstudentview/StudentExamView';
import ParentExamView from './pages/examstudentview/ParentExamView';
import StudentResultsView from './pages/examstudentview/StudentResultsView';
import ParentResultsView from './pages/examstudentview/ParentResultsView';

// DASHBOARD CONTENT SWITCHER
const DashboardContent: React.FC = () => {
  const { user, userProfile } = useAuth();

  const getDisplayName = () => {
    if (userProfile) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    return user?.username || 'User';
  };

  // Role-based dashboard rendering
  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'parent':
      return <ParentDashboard />;
    case 'staff':
      return <StaffDashboard />;
    default:
      return (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-red-900 mb-2">Unauthorized</h1>
            <p className="text-red-600">You don't have access to this area.</p>
          </div>
        </div>
      );
  }
};

// COMING SOON PLACEHOLDER
const ComingSoon: React.FC<{ title: string; description?: string }> = ({
  title,
  description,
}) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    <p className="text-gray-600 mt-2">{description || 'Coming soon...'}</p>
  </div>
);

// MAIN APP COMPONENT
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/access-denied" element={<AccessDenied />} />

          {/* VERIFY ACCOUNT (Auth Required) */}
          <Route
            path="/auth/verify-account"
            element={
              <ProtectedRoute>
                <VerifyAccountPage />
              </ProtectedRoute>
            }
          />

          {/* DASHBOARD (All Authenticated Users) */}
          <Route
            path="/lessonplangenerator"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <LessonPlanGenerator />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/lessonplan"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <LessonPlanApproval />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignments"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Assignments />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/assign"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AssignProject />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/tracking"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ProjectTracking />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/reports"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ProjectReports />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardContent />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* STUDENT MANAGEMENT */}
          <Route
            path="/students"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                <DashboardLayout>
                  <Students />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/studentanalytics"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                <DashboardLayout>
                  <StudentAnalytics />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-student"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AddStudentPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* TEACHER MANAGEMENT */}
          <Route
            path="/teachers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <Teachers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-teacher"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AddTeacherPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* STAFF MANAGEMENT */}
          <Route
            path="/admin/add-staff"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AddStaffPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* PARENT MANAGEMENT */}
          <Route
            path="/admin/add-parent"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <AddParent />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* PARENT - MY CHILDREN */}
          <Route
            path="/my-children"
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <DashboardLayout>
                  <MyChildren />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* CLASS MANAGEMENT */}
          <Route
            path="/classes"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                <DashboardLayout>
                  <Classes />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes/:classId/students"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                <DashboardLayout>
                  <ClassStudents />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* SUBJECT MANAGEMENT */}
          <Route
            path="/subjects"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher','student','parent']}>
                <DashboardLayout>
                  <Subjects />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/subjects/:id"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                <DashboardLayout>
                  <SubjectDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* STUDENT ATTENDANCE */}
          <Route
            path="/attendance/student"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'staff']}>
                <DashboardLayout>
                  <StudentsAttendance />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mark/attendance/student"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'staff']}>
                <DashboardLayout>
                  <MarkAttendance />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* MY ATTENDANCE (Student/Parent View) */}
          <Route
            path="/attendance/my-attendance"
            element={
              <ProtectedRoute allowedRoles={['student', 'parent']}>
                <DashboardLayout>
                  <MyAttendance />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* TEACHER ATTENDANCE */}
          <Route
            path="/attendance/teacher"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <TeacherAttendanceOverview />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mark/attendance/teacher"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <MarkTeacherAttendance />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* EXAMS & RESULTS */}
          <Route
            path="/exams"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent']}>
                <DashboardLayout>
                  <ExamScheduling />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/examstudent"
            element={
              <ProtectedRoute allowedRoles={[ 'student']}>
                <DashboardLayout>
                  <StudentExamView />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/examparent"
            element={
              <ProtectedRoute allowedRoles={[ 'parent']}>
                <DashboardLayout>
                  <ParentExamView />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent']}>
                <DashboardLayout>
                  <ResultsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resultstudent"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout>
                  <StudentResultsView/>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resultparent"
            element={
              <ProtectedRoute allowedRoles={[ 'parent']}>
                <DashboardLayout>
                  <ParentResultsView />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* CERTIFICATES */}
          <Route
            path="/certificates"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent']}>
                <DashboardLayout>
                  <ComingSoon title="Certificates" />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* FEE MANAGEMENT */}
          <Route
            path="/fees"
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <DashboardLayout>
                  < FeeStructureMaster/>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignfeestructure"
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <DashboardLayout>
                  <  FeeAssignment />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/feepayments"
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <DashboardLayout>
                  <FeePaymentManagement/>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />


          {/* EXPENSE MANAGEMENT */}
          <Route
            path="/expenses"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <ExpenseManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* FINANCIAL REPORTS */}
          <Route
            path="/financial-reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <ComingSoon title="Financial Reports" />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* PROJECT MANAGEMENT */}
          <Route
            path="/project/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                <DashboardLayout>
                  <ProjectDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminBustracking"
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <DashboardLayout>
                  <AdminBusTracking />
                </DashboardLayout>
              </ProtectedRoute>
            }
          /> 
          <Route
            path="/projects/tracking"
            element={
              <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
                <DashboardLayout>
                  <ProjectTracking />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* LIBRARY */}
          <Route
            path="/library"
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff', 'teacher', 'student']}>
                <DashboardLayout>
                  <LibraryManagementPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* TRANSPORT */}
          <Route
            path="/transport"
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <DashboardLayout>
                  <TransportManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
           <Route
            path="/driverdashboard"
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <DashboardLayout>
                  <DriverDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* EVENTS */}
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <EventsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaveapplication"
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff','teacher']}>
                <DashboardLayout>
                  <LeaveManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* COMMUNICATION */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ComingSoon title="Notifications" />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Messages/>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* COMPLAINTS */}
          <Route
            path="/complaints"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Complaints />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* SETTINGS */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ComingSoon title="Settings" />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Time Table  */}
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Timetable/>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* FALLBACK ROUTES */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
