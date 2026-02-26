// import React, { useState } from 'react';
// import { X, Send, Loader2 } from 'lucide-react';
// import { supabase } from '../../../lib/supabase';
// import { Book, Student } from '../../../types/library';

// interface BorrowBookModalProps {
//   books: Book[];
//   students: Student[];
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const BorrowBookModal: React.FC<BorrowBookModalProps> = ({ books, students, onClose, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     book_id: '',
//     student_id: '',
//     issue_date: new Date().toISOString().split('T')[0],
//     borrow_duration_days: 14
//   });

//   const availableBooks = books.filter(book => book.available_quantity > 0);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const selectedBook = books.find(b => b.id === formData.book_id);
//       const selectedStudent = students.find(s => s.id === formData.student_id);

//       if (!selectedBook || !selectedStudent) {
//         alert('Please select valid book and student');
//         return;
//       }

//       const issueDate = new Date(formData.issue_date);
//       const expectedReturnDate = new Date(issueDate);
//       expectedReturnDate.setDate(expectedReturnDate.getDate() + formData.borrow_duration_days);

//       // Insert borrow record
//       const { error: borrowError } = await supabase.from('borrowed_books').insert([{
//         book_id: formData.book_id,
//         student_id: formData.student_id,
//         student_name: selectedStudent.student_name,
//         class_name: selectedStudent.class_name,
//         book_title: selectedBook.title,
//         issue_date: formData.issue_date,
//         expected_return_date: expectedReturnDate.toISOString().split('T')[0],
//         status: 'Borrowed'
//       }]);

//       if (borrowError) throw borrowError;

//       // Update book availability
//       const { error: updateError } = await supabase
//         .from('books')
//         .update({
//           available_quantity: selectedBook.available_quantity - 1,
//           status: selectedBook.available_quantity - 1 === 0 ? 'Checked Out' : 'Available'
//         })
//         .eq('id', formData.book_id);

//       if (updateError) throw updateError;

//       alert('Book borrowed successfully!');
//       onSuccess();
//       onClose();
//     } catch (error: any) {
//       console.error('Error borrowing book:', error);
//       alert('Error borrowing book: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'borrow_duration_days' ? Number(value) : value
//     }));
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
//           <h2 className="text-2xl font-bold text-white">Borrow Book</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-blue-500 rounded-full transition-colors"
//           >
//             <X className="w-6 h-6 text-white" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select Student *
//             </label>
//             <select
//               name="student_id"
//               value={formData.student_id}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="">Choose a student</option>
//               {students.map((student) => (
//                 <option key={student.id} value={student.id}>
//                   {student.student_name} ({student.class_name})
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select Book *
//             </label>
//             <select
//               name="book_id"
//               value={formData.book_id}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="">Choose a book</option>
//               {availableBooks.map((book) => (
//                 <option key={book.id} value={book.id}>
//                   {book.title} by {book.author} (Available: {book.available_quantity})
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Issue Date *
//               </label>
//               <input
//                 type="date"
//                 name="issue_date"
//                 value={formData.issue_date}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Borrow Duration (Days) *
//               </label>
//               <input
//                 type="number"
//                 name="borrow_duration_days"
//                 value={formData.borrow_duration_days}
//                 onChange={handleChange}
//                 min="1"
//                 max="90"
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <p className="text-sm text-blue-800">
//               <span className="font-semibold">Expected Return Date:</span>{' '}
//               {new Date(
//                 new Date(formData.issue_date).getTime() + 
//                 formData.borrow_duration_days * 24 * 60 * 60 * 1000
//               ).toLocaleDateString()}
//             </p>
//           </div>

//           <div className="flex gap-4 pt-4 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <Send className="w-5 h-5" />
//                   Borrow Book
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BorrowBookModal;
import React, { useState, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Book, Student } from '../../../types/library';

interface BorrowBookModalProps {
  books: Book[];
  students: Student[];
  preSelectedBook?: Book | null; // NEW: Pre-selected book
  onClose: () => void;
  onSuccess: () => void;
}

const BorrowBookModal: React.FC<BorrowBookModalProps> = ({ 
  books, 
  students, 
  preSelectedBook,
  onClose, 
  onSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    book_id: preSelectedBook?.id || '',
    student_id: '',
    issue_date: new Date().toISOString().split('T')[0],
    borrow_duration_days: 14
  });

  useEffect(() => {
    if (preSelectedBook) {
      setFormData(prev => ({ ...prev, book_id: preSelectedBook.id }));
    }
  }, [preSelectedBook]);

  const availableBooks = books.filter(book => book.available_quantity > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedBook = books.find(b => b.id === formData.book_id);
      const selectedStudent = students.find(s => s.id === formData.student_id);

      if (!selectedBook || !selectedStudent) {
        alert('Please select valid book and student');
        return;
      }

      const issueDate = new Date(formData.issue_date);
      const expectedReturnDate = new Date(issueDate);
      expectedReturnDate.setDate(expectedReturnDate.getDate() + formData.borrow_duration_days);

      // Insert borrow record
      const { error: borrowError } = await supabase.from('borrowed_books').insert([{
        book_id: formData.book_id,
        student_id: formData.student_id,
        student_name: selectedStudent.student_name,
        class_name: selectedStudent.class_name,
        book_title: selectedBook.title,
        issue_date: formData.issue_date,
        expected_return_date: expectedReturnDate.toISOString().split('T')[0],
        status: 'Borrowed'
      }]);

      if (borrowError) throw borrowError;

      // Update book availability
      const { error: updateError } = await supabase
        .from('books')
        .update({
          available_quantity: selectedBook.available_quantity - 1,
          status: selectedBook.available_quantity - 1 === 0 ? 'Checked Out' : 'Available'
        })
        .eq('id', formData.book_id);

      if (updateError) throw updateError;

      alert('Book borrowed successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error borrowing book:', error);
      alert('Error borrowing book: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'borrow_duration_days' ? Number(value) : value
    }));
  };

  const selectedBook = books.find(b => b.id === formData.book_id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Borrow Book</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-500 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Show selected book info if pre-selected */}
          {preSelectedBook && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-4">
                {preSelectedBook.cover_url && (
                  <img 
                    src={preSelectedBook.cover_url} 
                    alt={preSelectedBook.title}
                    className="w-20 h-28 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg mb-1">{preSelectedBook.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {preSelectedBook.author}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>ISBN: {preSelectedBook.isbn}</span>
                    <span>Available: {preSelectedBook.available_quantity}/{preSelectedBook.quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Student *
            </label>
            <select
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.student_name} ({student.class_name})
                </option>
              ))}
            </select>
          </div>

          {!preSelectedBook && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Book *
              </label>
              <select
                name="book_id"
                value={formData.book_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a book</option>
                {availableBooks.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} by {book.author} (Available: {book.available_quantity})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date *
              </label>
              <input
                type="date"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Borrow Duration (Days) *
              </label>
              <input
                type="number"
                name="borrow_duration_days"
                value={formData.borrow_duration_days}
                onChange={handleChange}
                min="1"
                max="90"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Expected Return Date:</span>{' '}
              {new Date(
                new Date(formData.issue_date).getTime() + 
                formData.borrow_duration_days * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Borrow Book
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowBookModal;
