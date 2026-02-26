// import React, { useState, useEffect } from 'react';
// import { AlertCircle, Send, Phone, Mail, Calendar, TrendingUp } from 'lucide-react';
// import { BorrowedBook, LibrarySettings } from '../../../types/library';

// interface OverdueTrackingTabProps {
//   borrowedBooks: BorrowedBook[];
//   settings: LibrarySettings | null;
// }

// const OverdueTrackingTab: React.FC<OverdueTrackingTabProps> = ({ borrowedBooks, settings }) => {
//   const [overdueBooks, setOverdueBooks] = useState<BorrowedBook[]>([]);
//   const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());

//   useEffect(() => {
//     const today = new Date();
//     const overdue = borrowedBooks.filter(book => {
//       if (book.status === 'Returned') return false;
//       const dueDate = new Date(book.expected_return_date);
//       return dueDate < today;
//     });

//     // Calculate fine amounts
//     const booksWithFines = overdue.map(book => {
//       const dueDate = new Date(book.expected_return_date);
//       const today = new Date();
//       const daysLate = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
//       const fineAmount = daysLate * (settings?.fine_per_day || 10);
      
//       return {
//         ...book,
//         days_late: daysLate,
//         fine_amount: fineAmount
//       };
//     });

//     setOverdueBooks(booksWithFines);
//   }, [borrowedBooks, settings]);

//   const handleSelectBook = (bookId: string) => {
//     const newSelected = new Set(selectedBooks);
//     if (newSelected.has(bookId)) {
//       newSelected.delete(bookId);
//     } else {
//       newSelected.add(bookId);
//     }
//     setSelectedBooks(newSelected);
//   };

//   const handleSelectAll = () => {
//     if (selectedBooks.size === overdueBooks.length) {
//       setSelectedBooks(new Set());
//     } else {
//       setSelectedBooks(new Set(overdueBooks.map(b => b.id)));
//     }
//   };

//   const handleSendReminder = (type: 'email' | 'sms') => {
//     if (selectedBooks.size === 0) {
//       alert('Please select at least one book to send reminders');
//       return;
//     }

//     const selectedBooksData = overdueBooks.filter(b => selectedBooks.has(b.id));
//     const message = type === 'email' ? 'Email' : 'SMS';
    
//     alert(`${message} reminders will be sent to ${selectedBooks.size} student(s):\n\n${
//       selectedBooksData.map(b => `${b.student_name} - ${b.book_title}`).join('\n')
//     }`);
    
//     // Here you would integrate with your email/SMS service
//     setSelectedBooks(new Set());
//   };

//   const totalFines = overdueBooks.reduce((sum, book) => sum + (book.fine_amount || 0), 0);
//   const selectedFines = overdueBooks
//     .filter(b => selectedBooks.has(b.id))
//     .reduce((sum, book) => sum + (book.fine_amount || 0), 0);

//   return (
//     <div className="space-y-6">
//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-red-100 text-sm font-medium">Total Overdue</p>
//               <h3 className="text-3xl font-bold mt-2">{overdueBooks.length}</h3>
//             </div>
//             <div className="bg-white/20 p-3 rounded-lg">
//               <AlertCircle className="w-8 h-8" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-orange-100 text-sm font-medium">Total Fines</p>
//               <h3 className="text-3xl font-bold mt-2">₹{totalFines}</h3>
//             </div>
//             <div className="bg-white/20 p-3 rounded-lg">
//               <TrendingUp className="w-8 h-8" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-purple-100 text-sm font-medium">Fine Per Day</p>
//               <h3 className="text-3xl font-bold mt-2">₹{settings?.fine_per_day || 10}</h3>
//             </div>
//             <div className="bg-white/20 p-3 rounded-lg">
//               <Calendar className="w-8 h-8" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Action Bar */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={selectedBooks.size === overdueBooks.length && overdueBooks.length > 0}
//                 onChange={handleSelectAll}
//                 className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//               />
//               <span className="text-sm font-medium text-gray-700">
//                 Select All ({selectedBooks.size} selected)
//               </span>
//             </label>
//             {selectedBooks.size > 0 && (
//               <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
//                 Selected Fines: ₹{selectedFines}
//               </span>
//             )}
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={() => handleSendReminder('email')}
//               disabled={selectedBooks.size === 0}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Mail className="w-4 h-4" />
//               Send Email
//             </button>
//             <button
//               onClick={() => handleSendReminder('sms')}
//               disabled={selectedBooks.size === 0}
//               className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Phone className="w-4 h-4" />
//               Send SMS
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Overdue Books Table */}
//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="p-6 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//             <AlertCircle className="w-5 h-5 text-red-600" />
//             Overdue Books Details
//           </h3>
//         </div>
        
//         {overdueBooks.length === 0 ? (
//           <div className="p-12 text-center">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
//               <AlertCircle className="w-8 h-8 text-green-600" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">No Overdue Books!</h3>
//             <p className="text-gray-600">All books have been returned on time.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
//                     <input
//                       type="checkbox"
//                       checked={selectedBooks.size === overdueBooks.length}
//                       onChange={handleSelectAll}
//                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                     />
//                   </th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Student</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Class</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Book Title</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Issue Date</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Due Date</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Days Late</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Fine Amount</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {overdueBooks.map((book) => (
//                   <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
//                     <td className="py-4 px-6">
//                       <input
//                         type="checkbox"
//                         checked={selectedBooks.has(book.id)}
//                         onChange={() => handleSelectBook(book.id)}
//                         className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                       />
//                     </td>
//                     <td className="py-4 px-6 text-sm font-medium text-gray-800">{book.student_name}</td>
//                     <td className="py-4 px-6 text-sm text-gray-600">{book.class_name}</td>
//                     <td className="py-4 px-6 text-sm text-gray-800">{book.book_title}</td>
//                     <td className="py-4 px-6 text-sm text-gray-600">
//                       {new Date(book.issue_date).toLocaleDateString()}
//                     </td>
//                     <td className="py-4 px-6 text-sm text-gray-600">
//                       {new Date(book.expected_return_date).toLocaleDateString()}
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
//                         {book.days_late} days
//                       </span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className="text-sm font-bold text-red-600">
//                         ₹{book.fine_amount}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
//                         <AlertCircle className="w-3 h-3" />
//                         Overdue
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OverdueTrackingTab;
// src/pages/library/components/OverdueTrackingTab.tsx
import React from 'react';
import { AlertCircle, Send, CheckCircle } from 'lucide-react';
import { BorrowedBook, LibrarySettings } from '../../../types/library';

interface OverdueTrackingTabProps {
  borrowedBooks: BorrowedBook[];
  settings: LibrarySettings | null;
  handleReturnBook: (borrowId: string, bookId: string) => void;
  isStudent?: boolean; // NEW PROP
}

const OverdueTrackingTab: React.FC<OverdueTrackingTabProps> = ({
  borrowedBooks,
  settings,
  handleReturnBook,
  isStudent = false,
}) => {
  const overdueBooks = borrowedBooks.filter((b) => {
    if (b.status === 'Returned') return false;
    const today = new Date();
    const expectedReturn = new Date(b.expected_return_date);
    return today > expectedReturn;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            {isStudent ? 'My Overdue Books' : 'Overdue Books'}
          </h3>
          <span className="ml-auto bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
            {overdueBooks.length} Overdue
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {!isStudent && (
                  <>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Student Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Class
                    </th>
                  </>
                )}
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Book Title
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Borrow Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Expected Return
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Days Late
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Fine
                </th>
                {/* HIDE ACTIONS FOR STUDENTS */}
                {!isStudent && (
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {overdueBooks.map((borrow) => {
                const daysLate = Math.floor(
                  (new Date().getTime() - new Date(borrow.expected_return_date).getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                const fine = daysLate * (settings?.fine_per_day || 10);

                return (
                  <tr key={borrow.id} className="border-b border-gray-100 hover:bg-red-50">
                    {!isStudent && (
                      <>
                        <td className="py-3 px-4 text-sm font-medium text-gray-800">
                          {borrow.student_name}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {borrow.class_name}
                        </td>
                      </>
                    )}
                    <td className="py-3 px-4 text-sm text-gray-800">{borrow.book_title}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(borrow.issue_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(borrow.expected_return_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        {daysLate} days
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-red-600">₹{fine}</td>
                    {!isStudent && (
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            <Send className="w-4 h-4" />
                            Remind
                          </button>
                          <button
                            onClick={() => handleReturnBook(borrow.id, borrow.book_id)}
                            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Return
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {overdueBooks.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">
                {isStudent
                  ? 'Great! You have no overdue books.'
                  : 'No overdue books! All returns are on time.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverdueTrackingTab;
