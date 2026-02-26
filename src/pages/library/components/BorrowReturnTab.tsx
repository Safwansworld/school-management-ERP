// import React from 'react';
// import { BookOpen, RotateCcw } from 'lucide-react';
// import { BorrowedBook } from '../../../types/library';

// interface BorrowReturnTabProps {
//   borrowedBooks: BorrowedBook[];
//   setShowBorrowModal: (show: boolean) => void;
//   handleReturnBook: (borrowId: string, bookId: string) => void;
//   loading: boolean;
// }

// const BorrowReturnTab: React.FC<BorrowReturnTabProps> = ({
//   borrowedBooks,
//   setShowBorrowModal,
//   handleReturnBook,
//   loading,
// }) => {
//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <button
//           onClick={() => setShowBorrowModal(true)}
//           className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           <BookOpen className="w-5 h-5" />
//           Borrow New Book
//         </button>
//       </div>

//       {/* Currently Borrowed Books */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Currently Borrowed Books</h3>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Book Title</th>
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student</th>
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Class</th>
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Issue Date</th>
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Due Date</th>
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
//                 <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {borrowedBooks.filter(b => b.status !== 'Returned').map((borrow) => (
//                 <tr key={borrow.id} className="border-b border-gray-100 hover:bg-gray-50">
//                   <td className="py-3 px-4 text-sm text-gray-800">{borrow.book_title}</td>
//                   <td className="py-3 px-4 text-sm text-gray-800">{borrow.student_name}</td>
//                   <td className="py-3 px-4 text-sm text-gray-600">{borrow.class_name}</td>
//                   <td className="py-3 px-4 text-sm text-gray-600">
//                     {new Date(borrow.issue_date).toLocaleDateString()}
//                   </td>
//                   <td className="py-3 px-4 text-sm text-gray-600">
//                     {new Date(borrow.expected_return_date).toLocaleDateString()}
//                   </td>
//                   <td className="py-3 px-4">
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       new Date(borrow.expected_return_date) < new Date() 
//                         ? 'bg-red-100 text-red-700' 
//                         : 'bg-blue-100 text-blue-700'
//                     }`}>
//                       {new Date(borrow.expected_return_date) < new Date() ? 'Overdue' : 'Borrowed'}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4">
//                     <button
//                       onClick={() => handleReturnBook(borrow.id, borrow.book_id)}
//                       disabled={loading}
//                       className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
//                     >
//                       <RotateCcw className="w-4 h-4" />
//                       Return
//                     </button>
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

// export default BorrowReturnTab;
// src/pages/library/components/BorrowReturnTab.tsx
import React from 'react';
import { BookOpen, RotateCcw } from 'lucide-react';
import { BorrowedBook } from '../../../types/library';

interface BorrowReturnTabProps {
  borrowedBooks: BorrowedBook[];
  setShowBorrowModal: (show: boolean) => void;
  handleReturnBook: (borrowId: string, bookId: string) => void;
  loading: boolean;
  isStudent?: boolean; // NEW PROP
}

const BorrowReturnTab: React.FC<BorrowReturnTabProps> = ({
  borrowedBooks,
  setShowBorrowModal,
  handleReturnBook,
  loading,
  isStudent = false,
}) => {
  const activeBorrows = borrowedBooks.filter((b) => b.status !== 'Returned');

  return (
    <div className="space-y-6">
      {/* HIDE BORROW BUTTON FOR STUDENTS */}
      {!isStudent && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <button
            onClick={() => setShowBorrowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Borrow New Book
          </button>
        </div>
      )}

      {/* Currently Borrowed Books */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {isStudent ? 'My Borrowed Books' : 'Currently Borrowed Books'}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Book Title
                </th>
                {!isStudent && (
                  <>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Student
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Class
                    </th>
                  </>
                )}
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Issue Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Due Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                {/* HIDE ACTIONS COLUMN FOR STUDENTS */}
                {!isStudent && (
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {activeBorrows.map((borrow) => (
                <tr key={borrow.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{borrow.book_title}</td>
                  {!isStudent && (
                    <>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {borrow.student_name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {borrow.class_name}
                      </td>
                    </>
                  )}
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(borrow.issue_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(borrow.expected_return_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        new Date(borrow.expected_return_date) < new Date()
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {new Date(borrow.expected_return_date) < new Date()
                        ? 'Overdue'
                        : 'Borrowed'}
                    </span>
                  </td>
                  {!isStudent && (
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleReturnBook(borrow.id, borrow.book_id)}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Return
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {activeBorrows.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No active borrowings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowReturnTab;
