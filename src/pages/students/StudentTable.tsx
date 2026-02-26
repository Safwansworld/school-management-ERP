// import React, { useState } from 'react'
// import { MoreVerticalIcon, EditIcon, TrashIcon, EyeIcon, UserIcon } from 'lucide-react'
// import { Student } from '../../types/Student'

// interface StudentTableProps {
//   students: Student[]
//   loading: boolean
//   onEdit: (student: Student) => void
//   onView: (student: Student) => void
//   onDelete: (student: Student) => void
// }

// export const StudentTable: React.FC<StudentTableProps> = ({
//   students,
//   loading,
//   onEdit,
//   onView,
//   onDelete
// }) => {
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null)

//   const toggleDropdown = (studentId: string) => {
//     setOpenDropdown(openDropdown === studentId ? null : studentId)
//   }

//   if (loading) {
//     return (
//       <div className="p-8 text-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//         <p className="text-gray-500 mt-2">Loading students...</p>
//       </div>
//     )
//   }

//   if (students.length === 0) {
//     return (
//       <div className="p-8 text-center">
//         <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//         <p className="text-gray-500 text-lg">No students found</p>
//         <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
//       </div>
//     )
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full">
//         <thead className="bg-gray-50 border-b border-gray-200">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Student
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Class & Roll No
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Parent Details
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Status
//             </th>
//             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {students.map((student) => (
//             <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-200">
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="flex items-center">
//                   <div className="h-10 w-10 flex-shrink-0">
//                     {student.profile_picture ? (
//                       <img
//                         className="h-10 w-10 rounded-full object-cover"
//                         src={student.profile_picture}
//                         alt={student.full_name}
//                       />
//                     ) : (
//                       <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                         <UserIcon className="h-6 w-6 text-gray-400" />
//                       </div>
//                     )}
//                   </div>
//                   <div className="ml-4">
//                     <div className="text-sm font-medium text-gray-900">
//                       {student.full_name}
//                     </div>
//                     <div className="text-sm text-gray-500">
//                       {student.admission_number}
//                     </div>
//                   </div>
//                 </div>
//               </td>
              
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="text-sm text-gray-900">
//                   Class {student.class_name} {student.section && `- ${student.section}`}
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   Roll No: {student.roll_number}
//                 </div>
//               </td>
              
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="text-sm text-gray-900">
//                   {student.parent_name}
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   {student.parent_contact}
//                 </div>
//               </td>
              
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                   student.status === 'active'
//                     ? 'bg-green-100 text-green-800'
//                     : 'bg-red-100 text-red-800'
//                 }`}>
//                   {student.status}
//                 </span>
//               </td>
              
//               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                 <div className="relative">
//                   <button
//                     onClick={() => toggleDropdown(student.id!)}
//                     className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
//                   >
//                     <MoreVerticalIcon className="h-5 w-5" />
//                   </button>
                  
//                   {openDropdown === student.id && (
//                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
//                       <div className="py-1">
//                         <button
//                           onClick={() => {
//                             onView(student)
//                             setOpenDropdown(null)
//                           }}
//                           className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
//                         >
//                           <EyeIcon className="h-4 w-4 mr-3" />
//                           View Student
//                         </button>
//                         <button
//                           onClick={() => {
//                             onEdit(student)
//                             setOpenDropdown(null)
//                           }}
//                           className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
//                         >
//                           <EditIcon className="h-4 w-4 mr-3" />
//                           Edit Student
//                         </button>
//                         <button
//                           onClick={() => {
//                             onDelete(student)
//                             setOpenDropdown(null)
//                           }}
//                           className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
//                         >
//                           <TrashIcon className="h-4 w-4 mr-3" />
//                           Delete Student
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVerticalIcon, EditIcon, TrashIcon, EyeIcon, UserIcon } from 'lucide-react';
import { Student } from '../../types/Student';

interface StudentTableProps {
  students: Student[];
  loading: boolean;
  onEdit: (student: Student) => void;
  onView: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  loading,
  onEdit,
  onView,
  onDelete,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const toggleDropdown = (studentId: string) => {
    setOpenDropdown(openDropdown === studentId ? null : studentId);
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1E88E5] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium" style={{ fontSize: '15px' }}>
          Loading students...
        </p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <UserIcon className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-900 font-semibold mb-2" style={{ fontSize: '18px', fontWeight: 600 }}>
          No students found
        </p>
        <p className="text-gray-500" style={{ fontSize: '14px' }}>
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200/50">
            <th
              className="px-6 py-4 text-left text-gray-700"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              Student
            </th>
            <th
              className="px-6 py-4 text-left text-gray-700"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              Class & Roll No
            </th>
            <th
              className="px-6 py-4 text-left text-gray-700"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              Parent Details
            </th>
            <th
              className="px-6 py-4 text-left text-gray-700"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              Status
            </th>
            <th
              className="px-6 py-4 text-right text-gray-700"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student, index) => (
            <motion.tr
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.3 }}
              onMouseEnter={() => setHoveredRow(student.id!)}
              onMouseLeave={() => setHoveredRow(null)}
              className={`transition-all duration-300 ${
                hoveredRow === student.id
                  ? 'bg-gradient-to-r from-[#1E88E5]/5 to-transparent'
                  : ''
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    className="h-10 w-10 flex-shrink-0"
                  >
                    {student.profile_picture ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                        src={student.profile_picture}
                        alt={student.full_name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold shadow-sm">
                        {getInitials(student.full_name)}
                      </div>
                    )}
                  </motion.div>
                  <div className="ml-4">
                    <div
                      className="text-gray-900"
                      style={{ fontSize: '15px', fontWeight: 500 }}
                    >
                      {student.full_name}
                    </div>
                    <div
                      className="text-gray-500"
                      style={{ fontSize: '13px', fontWeight: 400 }}
                    >
                      {student.admission_number}
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div
                  className="text-gray-900"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                >
                  Class {student.class_name} {student.section && `- ${student.section}`}
                </div>
                <div
                  className="text-gray-500"
                  style={{ fontSize: '13px', fontWeight: 400 }}
                >
                  Roll No: {student.roll_number}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div
                  className="text-gray-900"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                >
                  {student.parent_name}
                </div>
                <div
                  className="text-gray-500"
                  style={{ fontSize: '13px', fontWeight: 400 }}
                >
                  {student.parent_contact}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-lg font-medium border ${
                    student.status === 'active'
                      ? 'bg-green-50 text-green-600 border-green-200'
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}
                  style={{ fontSize: '13px' }}
                >
                  {student.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="relative inline-block">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleDropdown(student.id!)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <MoreVerticalIcon className="h-5 w-5" />
                  </motion.button>

                  {openDropdown === student.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10 overflow-hidden"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onView(student);
                            setOpenDropdown(null);
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200 group"
                        >
                          <EyeIcon className="h-4 w-4 mr-3 text-gray-500 group-hover:text-blue-500" />
                          View Student
                        </button>
                        <button
                          onClick={() => {
                            onEdit(student);
                            setOpenDropdown(null);
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 transition-colors duration-200 group"
                        >
                          <EditIcon className="h-4 w-4 mr-3 text-gray-500 group-hover:text-yellow-500" />
                          Edit Student
                        </button>
                        <button
                          onClick={() => {
                            onDelete(student);
                            setOpenDropdown(null);
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 group"
                        >
                          <TrashIcon className="h-4 w-4 mr-3" />
                          Delete Student
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
