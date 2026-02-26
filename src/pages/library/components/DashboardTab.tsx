// import React from 'react';
// import {
//   Library,
//   CheckCircle,
//   BookOpen,
//   AlertCircle,
//   TrendingUp,
//   Clock,
//   BookMarked,
// } from 'lucide-react';
// import { DashboardStats, Book, BorrowedBook } from '../../../types/library';

// interface DashboardTabProps {
//   stats: DashboardStats;
//   books: Book[];
//   borrowedBooks: BorrowedBook[];
// }

// const DashboardTab: React.FC<DashboardTabProps> = ({ stats, books, borrowedBooks }) => {
//   return (
//     <div className="space-y-6">
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-blue-100 text-sm font-medium">Total Books</p>
//               <h3 className="text-3xl font-bold mt-2">{stats.totalBooks}</h3>
//             </div>
//             <div className="bg-white/20 p-3 rounded-lg">
//               <Library className="w-8 h-8" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-green-100 text-sm font-medium">Available Books</p>
//               <h3 className="text-3xl font-bold mt-2">{stats.availableBooks}</h3>
//             </div>
//             <div className="bg-white/20 p-3 rounded-lg">
//               <CheckCircle className="w-8 h-8" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-orange-100 text-sm font-medium">Checked Out</p>
//               <h3 className="text-3xl font-bold mt-2">{stats.checkedOutBooks}</h3>
//             </div>
//             <div className="bg-white/20 p-3 rounded-lg">
//               <BookOpen className="w-8 h-8" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-red-100 text-sm font-medium">Overdue Books</p>
//               <h3 className="text-3xl font-bold mt-2">{stats.overdueBooks}</h3>
//             </div>
//             <div className="bg-white/20 p-3 rounded-lg">
//               <AlertCircle className="w-8 h-8" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Top Borrowed Books */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <div className="flex items-center gap-2 mb-4">
//           <TrendingUp className="w-5 h-5 text-blue-600" />
//           <h3 className="text-lg font-semibold text-gray-800">Top Borrowed Books</h3>
//         </div>
//         <div className="space-y-3">
//           {books
//             .sort((a, b) => (b.quantity - b.available_quantity) - (a.quantity - a.available_quantity))
//             .slice(0, 5)
//             .map((book, index) => (
//               <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-semibold">
//                     {index + 1}
//                   </div>
//                   {book.cover_url && (
//                     <img src={book.cover_url} alt={book.title} className="w-10 h-10 object-cover rounded" />
//                   )}
//                   <div>
//                     <p className="font-medium text-gray-800">{book.title}</p>
//                     <p className="text-sm text-gray-500">{book.author}</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-semibold text-gray-800">{book.quantity - book.available_quantity}</p>
//                   <p className="text-xs text-gray-500">times borrowed</p>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <div className="flex items-center gap-2 mb-4">
//           <Clock className="w-5 h-5 text-blue-600" />
//           <h3 className="text-lg font-semibold text-gray-800">Recent Borrow Activity</h3>
//         </div>
//         <div className="space-y-3">
//           {borrowedBooks.slice(0, 5).map((borrow) => (
//             <div key={borrow.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <BookMarked className="w-5 h-5 text-blue-600" />
//                 <div>
//                   <p className="font-medium text-gray-800">{borrow.book_title}</p>
//                   <p className="text-sm text-gray-500">{borrow.student_name} ({borrow.class_name})</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm text-gray-600">{new Date(borrow.issue_date).toLocaleDateString()}</p>
//                 <span className={`text-xs px-2 py-1 rounded-full ${
//                   borrow.status === 'Returned' ? 'bg-green-100 text-green-700' :
//                   borrow.status === 'Overdue' ? 'bg-red-100 text-red-700' :
//                   'bg-blue-100 text-blue-700'
//                 }`}>
//                   {borrow.status}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardTab;
// src/pages/library/components/DashboardTab.tsx
import React from 'react';
import {
  Library,
  CheckCircle,
  BookOpen,
  AlertCircle,
  TrendingUp,
  Clock,
  BookMarked,
} from 'lucide-react';
import { DashboardStats, Book, BorrowedBook } from '../../../types/library';

interface DashboardTabProps {
  stats: DashboardStats;
  books: Book[];
  borrowedBooks: BorrowedBook[];
  isStudent?: boolean; // NEW PROP
}

const DashboardTab: React.FC<DashboardTabProps> = ({
  stats,
  books,
  borrowedBooks,
  isStudent = false,
}) => {
  // STUDENT-SPECIFIC STATS
  const studentStats = isStudent
    ? [
        {
          label: 'Currently Borrowed',
          value: stats.checkedOutBooks,
          color: 'from-blue-500 to-blue-600',
          textColor: 'text-blue-100',
          icon: BookOpen,
        },
        {
          label: 'Overdue Books',
          value: stats.overdueBooks,
          color: 'from-red-500 to-red-600',
          textColor: 'text-red-100',
          icon: AlertCircle,
        },
        {
          label: 'Total Borrowed',
          value: stats.totalBooks,
          color: 'from-green-500 to-green-600',
          textColor: 'text-green-100',
          icon: Library,
        },
      ]
    : [
        {
          label: 'Total Books',
          value: stats.totalBooks,
          color: 'from-blue-500 to-blue-600',
          textColor: 'text-blue-100',
          icon: Library,
        },
        {
          label: 'Available Books',
          value: stats.availableBooks,
          color: 'from-green-500 to-green-600',
          textColor: 'text-green-100',
          icon: CheckCircle,
        },
        {
          label: 'Checked Out',
          value: stats.checkedOutBooks,
          color: 'from-orange-500 to-orange-600',
          textColor: 'text-orange-100',
          icon: BookOpen,
        },
        {
          label: 'Overdue Books',
          value: stats.overdueBooks,
          color: 'from-red-500 to-red-600',
          textColor: 'text-red-100',
          icon: AlertCircle,
        },
      ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${isStudent ? '3' : '4'} gap-6`}>
        {studentStats.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${stat.textColor} text-sm font-medium`}>{stat.label}</p>
                <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <stat.icon className="w-8 h-8" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Borrowed Books - HIDE FOR STUDENTS */}
      {!isStudent && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Top Borrowed Books</h3>
          </div>
          <div className="space-y-3">
            {books
              .sort(
                (a, b) =>
                  b.quantity - b.available_quantity - (a.quantity - a.available_quantity)
              )
              .slice(0, 5)
              .map((book, index) => (
                <div
                  key={book.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    {book.cover_url && (
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{book.title}</p>
                      <p className="text-sm text-gray-500">{book.author}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {book.quantity - book.available_quantity}
                    </p>
                    <p className="text-xs text-gray-500">times borrowed</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            {isStudent ? 'My Recent Activity' : 'Recent Borrow Activity'}
          </h3>
        </div>
        <div className="space-y-3">
          {borrowedBooks.slice(0, 5).map((borrow) => (
            <div
              key={borrow.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <BookMarked className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">{borrow.book_title}</p>
                  {!isStudent && (
                    <p className="text-sm text-gray-500">
                      {borrow.student_name} ({borrow.class_name})
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {new Date(borrow.issue_date).toLocaleDateString()}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    borrow.status === 'Returned'
                      ? 'bg-green-100 text-green-700'
                      : borrow.status === 'Overdue'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {borrow.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
