// // src/pages/attendance/MyAttendance.tsx
// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../../../../context/AuthContext';
// import { supabase } from '../../../../lib/supabase';
// import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

// interface AttendanceRecord {
//   id: string;
//   date: string;
//   status: 'present' | 'absent' | 'late';
//   subject?: string;
// }

// const MyAttendance: React.FC = () => {
//   const { user } = useAuth();
//   const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalDays: 0,
//     present: 0,
//     absent: 0,
//     late: 0,
//     percentage: 0,
//   });

//   useEffect(() => {
//     fetchAttendance();
//   }, [user?.id]);

//   const fetchAttendance = async () => {
//     try {
//       // Fetch attendance records for the logged-in student
//       const { data, error } = await supabase
//         .from('attendance')
//         .select('*')
//         .eq('student_id', user?.id)
//         .order('date', { ascending: false })
//         .limit(30);

//       if (error) throw error;

//       setAttendance(data || []);

//       // Calculate stats
//       const present = data?.filter((a) => a.status === 'present').length || 0;
//       const absent = data?.filter((a) => a.status === 'absent').length || 0;
//       const late = data?.filter((a) => a.status === 'late').length || 0;
//       const total = data?.length || 0;
//       const percentage = total > 0 ? ((present + late) / total) * 100 : 0;

//       setStats({
//         totalDays: total,
//         present,
//         absent,
//         late,
//         percentage: Math.round(percentage),
//       });
//     } catch (error) {
//       console.error('Error fetching attendance:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'present':
//         return <CheckCircle className="w-5 h-5 text-green-500" />;
//       case 'absent':
//         return <XCircle className="w-5 h-5 text-red-500" />;
//       case 'late':
//         return <Clock className="w-5 h-5 text-orange-500" />;
//       default:
//         return null;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6 flex items-center justify-center min-h-screen">
//         <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center gap-3 mb-6">
//         <Calendar className="w-8 h-8 text-blue-600" />
//         <h2 className="text-2xl font-bold text-gray-800">My Attendance</h2>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
//           <p className="text-gray-600 text-sm mb-1">Attendance Rate</p>
//           <p className="text-3xl font-bold text-blue-600">{stats.percentage}%</p>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
//           <p className="text-gray-600 text-sm mb-1">Present</p>
//           <p className="text-3xl font-bold text-green-600">{stats.present}</p>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
//           <p className="text-gray-600 text-sm mb-1">Absent</p>
//           <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
//           <p className="text-gray-600 text-sm mb-1">Late</p>
//           <p className="text-3xl font-bold text-orange-600">{stats.late}</p>
//         </div>
//       </div>

//       {/* Attendance Records */}
//       <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
//         <div className="p-6 border-b border-gray-200">
//           <h3 className="text-lg font-bold text-gray-900">Recent Attendance</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Subject
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {attendance.map((record) => (
//                 <tr key={record.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 text-sm text-gray-900">
//                     {new Date(record.date).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2">
//                       {getStatusIcon(record.status)}
//                       <span className="text-sm font-medium capitalize">
//                         {record.status}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-600">
//                     {record.subject || 'All Subjects'}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyAttendance;
// src/pages/attendance/MyAttendance.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { supabase } from '../../../../lib/supabase';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  subject?: string;
  time_in?: string;
  time_out?: string;
  reason?: string;
  class_id:string;
}

const MyAttendance: React.FC = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0,
  });

  useEffect(() => {
    if (user?.id) {
      fetchAttendance();
    }
  }, [user?.id]);

  const fetchAttendance = async () => {
    try {
      // First, get the student_id from student_profiles using the logged-in user's id
      const { data: studentProfile, error: profileError } = await supabase
        .from('student_profiles')
        .select('student_id')
        .eq('id', user?.id)
        .single();

      if (profileError) {
        console.error('Error fetching student profile:', profileError);
        setLoading(false);
        return;
      }

      if (!studentProfile?.student_id) {
        console.error('No student_id found for this user');
        setLoading(false);
        return;
      }

      // Now fetch attendance records using the student_id
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentProfile.student_id)
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;

      setAttendance(data || []);

      // Calculate stats
      const present = data?.filter((a) => a.status === 'present').length || 0;
      const absent = data?.filter((a) => a.status === 'absent').length || 0;
      const late = data?.filter((a) => a.status === 'late').length || 0;
      const total = data?.length || 0;
      const percentage = total > 0 ? ((present + late) / total) * 100 : 0;

      setStats({
        totalDays: total,
        present,
        absent,
        late,
        percentage: Math.round(percentage),
      });
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'late':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'excused':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'text-green-600';
      case 'absent':
        return 'text-red-600';
      case 'late':
        return 'text-orange-600';
      case 'excused':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">My Attendance</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <p className="text-gray-600 text-sm mb-1">Attendance Rate</p>
          <p className="text-3xl font-bold text-blue-600">{stats.percentage}%</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <p className="text-gray-600 text-sm mb-1">Present</p>
          <p className="text-3xl font-bold text-green-600">{stats.present}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <p className="text-gray-600 text-sm mb-1">Absent</p>
          <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <p className="text-gray-600 text-sm mb-1">Late</p>
          <p className="text-3xl font-bold text-orange-600">{stats.late}</p>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Recent Attendance (Last 30 Days)</h3>
        </div>
        {attendance.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No attendance records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span className={`text-sm font-medium capitalize ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.time_in
                        ? new Date(record.time_in).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.time_out
                        ? new Date(record.time_out).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.subject || record.class_id || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {record.reason || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAttendance;
