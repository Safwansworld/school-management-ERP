import React, { useState } from 'react';
import { Search, Users, BookOpen, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { BorrowedBook, Student } from '../../../types/library';

interface StudentHistoryTabProps {
  students: Student[];
  borrowedBooks: BorrowedBook[];
}

const StudentHistoryTab: React.FC<StudentHistoryTabProps> = ({ students, borrowedBooks }) => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(student =>
    student.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const studentHistory = selectedStudent
    ? borrowedBooks.filter(book => book.student_id === selectedStudent)
    : [];

  const selectedStudentData = students.find(s => s.id === selectedStudent);

  const stats = {
    totalBorrowed: studentHistory.length,
    currentlyBorrowed: studentHistory.filter(b => b.status === 'Borrowed').length,
    returned: studentHistory.filter(b => b.status === 'Returned').length,
    overdue: studentHistory.filter(b => b.status === 'Overdue').length,
    totalFines: studentHistory.reduce((sum, book) => sum + (book.fine_amount || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Search and Select Student */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Select Student
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[250px]"
          >
            <option value="">Choose a student</option>
            {filteredStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.student_name} ({student.class_name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedStudent ? (
        <>
          {/* Student Info and Stats */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedStudentData?.student_name}</h2>
                <p className="text-blue-100">{selectedStudentData?.class_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-blue-100 text-xs mb-1">Total Borrowed</p>
                <p className="text-2xl font-bold">{stats.totalBorrowed}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-blue-100 text-xs mb-1">Currently Borrowed</p>
                <p className="text-2xl font-bold">{stats.currentlyBorrowed}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-blue-100 text-xs mb-1">Returned</p>
                <p className="text-2xl font-bold">{stats.returned}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-blue-100 text-xs mb-1">Overdue</p>
                <p className="text-2xl font-bold">{stats.overdue}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-blue-100 text-xs mb-1">Total Fines</p>
                <p className="text-2xl font-bold">₹{stats.totalFines}</p>
              </div>
            </div>
          </div>

          {/* Borrowing History */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Borrowing History
              </h3>
            </div>

            {studentHistory.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Borrowing History</h3>
                <p className="text-gray-600">This student hasn't borrowed any books yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Book Title</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Issue Date</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Due Date</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Return Date</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Days Late</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Fine</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentHistory.map((record) => (
                      <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 text-sm font-medium text-gray-800">{record.book_title}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(record.issue_date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {new Date(record.expected_return_date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {record.actual_return_date 
                            ? new Date(record.actual_return_date).toLocaleDateString() 
                            : '-'}
                        </td>
                        <td className="py-4 px-6 text-sm">
                          {record.days_late && record.days_late > 0 ? (
                            <span className="text-red-600 font-semibold">{record.days_late} days</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm">
                          {record.fine_amount && record.fine_amount > 0 ? (
                            <span className="text-red-600 font-bold">₹{record.fine_amount}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            record.status === 'Returned' 
                              ? 'bg-green-100 text-green-700' 
                              : record.status === 'Overdue'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {record.status === 'Returned' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : record.status === 'Overdue' ? (
                              <XCircle className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Select a Student</h3>
          <p className="text-gray-600">Choose a student from the dropdown above to view their borrowing history.</p>
        </div>
      )}
    </div>
  );
};

export default StudentHistoryTab;
