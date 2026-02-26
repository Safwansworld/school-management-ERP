
// import React, { useState, useEffect } from 'react';
// import { BarChart3, Book, BookOpen, AlertCircle, Users, Settings } from 'lucide-react';
// import { supabase } from '../../lib/supabase';
// import { useAuth } from '../../context/AuthContext';

// // Import types
// import { 
//   Book as BookType, 
//   BorrowedBook, 
//   Student, 
//   Category, 
//   LibrarySettings, 
//   DashboardStats 
// } from '../../types/library';

// // Import components
// import DashboardTab from './components/DashboardTab';
// import BooksInventoryTab from './components/BooksInventoryTab';
// import BorrowReturnTab from './components/BorrowReturnTab';
// import OverdueTrackingTab from './components/OverdueTrackingTab';
// import StudentHistoryTab from './components/StudentHistoryTab';
// import SettingsTab from './components/SettingsTab';

// // Import modals
// import AddBookModal from './modals/AddBookModal';
// import EditBookModal from './modals/EditBookModal';
// import BorrowBookModal from './modals/BorrowBookModal';

// // Import Radix UI Tabs
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';

// const LibraryManagementPage = () => {
//   // GET USER ROLE
//   const { user } = useAuth();
//   const isStudent = user?.role === 'student';
//   const isAdmin = user?.role === 'admin';
//   const isStaffLibrarian = user?.role === 'staff';

//   // State management
//   const [books, setBooks] = useState<BookType[]>([]);
//   const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
//   const [selectedBookForBorrow, setSelectedBookForBorrow] = useState<BookType | null>(null);
//   const [students, setStudents] = useState<Student[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [settings, setSettings] = useState<LibrarySettings | null>(null);
//   const [stats, setStats] = useState<DashboardStats>({
//     totalBooks: 0,
//     availableBooks: 0,
//     checkedOutBooks: 0,
//     overdueBooks: 0,
//   });

//   // Filter states
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [selectedStatus, setSelectedStatus] = useState('all');

//   // Modal states
//   const [showAddBookModal, setShowAddBookModal] = useState(false);
//   const [showBorrowModal, setShowBorrowModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch data on mount
//   useEffect(() => {
//     fetchAllData();
//   }, [user?.id]);

//   const fetchAllData = async () => {
//     await Promise.all([
//       fetchBooks(),
//       fetchBorrowedBooks(),
//       fetchStudents(),
//       fetchCategories(),
//       fetchSettings(),
//       fetchStats(),
//     ]);
//   };

//   const fetchBooks = async () => {
//     const { data, error } = await supabase
//       .from('books')
//       .select('*')
//       .order('title');

//     if (data) setBooks(data);
//     if (error) console.error('Error fetching books:', error);
//   };

//   const fetchBorrowedBooks = async () => {
//     let query = supabase
//       .from('borrowed_books')
//       .select('*')
//       .order('issue_date', { ascending: false });

//     // FILTER FOR STUDENTS: Only show their own borrowed books
//     if (isStudent) {
//       query = query.eq('student_id', user?.id);
//     }

//     const { data, error } = await query;

//     if (data) setBorrowedBooks(data);
//     if (error) console.error('Error fetching borrowed books:', error);
//   };

//   const fetchStudents = async () => {
//     const { data, error } = await supabase
//       .from('class_assignments')
//       .select('student_id, student_name, class_name')
//       .order('student_name');

//     if (data) {
//       const uniqueStudents = data.reduce((acc: Student[], curr) => {
//         if (!acc.find((s) => s.id === curr.student_id)) {
//           acc.push({
//             id: curr.student_id,
//             student_name: curr.student_name,
//             class_name: curr.class_name,
//           });
//         }
//         return acc;
//       }, []);
//       setStudents(uniqueStudents);
//     }

//     if (error) console.error('Error fetching students:', error);
//   };

//   const fetchCategories = async () => {
//     const { data, error } = await supabase
//       .from('book_categories')
//       .select('*')
//       .order('name');

//     if (data) setCategories(data);
//     if (error) console.error('Error fetching categories:', error);
//   };

//   const fetchSettings = async () => {
//     const { data, error } = await supabase
//       .from('library_settings')
//       .select('*')
//       .single();

//     if (data) setSettings(data);
//     if (error) console.error('Error fetching settings:', error);
//   };

//   const fetchStats = async () => {
//     const { data: booksData } = await supabase
//       .from('books')
//       .select('quantity, available_quantity');

//     let borrowedQuery = supabase
//       .from('borrowed_books')
//       .select('status')
//       .eq('status', 'Borrowed');

//     let overdueQuery = supabase
//       .from('borrowed_books')
//       .select('status')
//       .eq('status', 'Overdue');

//     // FILTER STATS FOR STUDENTS
//     if (isStudent) {
//       borrowedQuery = borrowedQuery.eq('student_id', user?.id);
//       overdueQuery = overdueQuery.eq('student_id', user?.id);
//     }

//     const { data: borrowedData } = await borrowedQuery;
//     const { data: overdueData } = await overdueQuery;

//     if (booksData) {
//       const totalBooks = booksData.reduce((sum, book) => sum + book.quantity, 0);
//       const availableBooks = booksData.reduce(
//         (sum, book) => sum + book.available_quantity,
//         0
//       );

//       setStats({
//         totalBooks: isStudent ? borrowedData?.length || 0 : totalBooks,
//         availableBooks: isStudent ? 0 : availableBooks,
//         checkedOutBooks: borrowedData?.length || 0,
//         overdueBooks: overdueData?.length || 0,
//       });
//     }
//   };

//   const handleDeleteBook = async (bookId: string) => {
//     if (!confirm('Are you sure you want to delete this book?')) return;

//     const { error } = await supabase.from('books').delete().eq('id', bookId);

//     if (error) {
//       alert('Error deleting book: ' + error.message);
//     } else {
//       alert('Book deleted successfully!');
//       fetchBooks();
//       fetchStats();
//     }
//   };

//   const handleReturnBook = async (borrowId: string, bookId: string) => {
//     setLoading(true);

//     const borrowRecord = borrowedBooks.find((b) => b.id === borrowId);
//     if (!borrowRecord) return;

//     const today = new Date();
//     const expectedReturnDate = new Date(borrowRecord.expected_return_date);
//     const daysLate = Math.max(
//       0,
//       Math.floor((today.getTime() - expectedReturnDate.getTime()) / (1000 * 60 * 60 * 24))
//     );
//     const fineAmount = daysLate * (settings?.fine_per_day || 10);

//     const { error: returnError } = await supabase
//       .from('borrowed_books')
//       .update({
//         status: 'Returned',
//         actual_return_date: new Date().toISOString(),
//         days_late: daysLate,
//         fine_amount: fineAmount,
//       })
//       .eq('id', borrowId);

//     if (returnError) {
//       alert('Error returning book: ' + returnError.message);
//       setLoading(false);
//       return;
//     }

//     const book = books.find((b) => b.id === bookId);
//     if (book) {
//       const { error: updateError } = await supabase
//         .from('books')
//         .update({
//           available_quantity: book.available_quantity + 1,
//           status: 'Available',
//         })
//         .eq('id', bookId);

//       if (updateError) {
//         alert('Error updating book status: ' + updateError.message);
//       } else {
//         alert(
//           `Book returned successfully! ${daysLate > 0 ? `Fine: ₹${fineAmount}` : 'No fine.'}`
//         );
//       }
//     }

//     fetchBooks();
//     fetchBorrowedBooks();
//     fetchStats();
//     setLoading(false);
//   };

//   const openEditModal = (book: BookType) => {
//     setSelectedBook(book);
//     setShowEditModal(true);
//   };

//   const openBorrowModalWithBook = (book: BookType) => {
//     setSelectedBookForBorrow(book);
//     setShowBorrowModal(true);
//   };

//   const closeBorrowModal = () => {
//     setShowBorrowModal(false);
//     setSelectedBookForBorrow(null);
//   };

//   // DEFINE TABS BASED ON ROLE
//   const tabs = isStudent
//     ? [
//         { id: 'dashboard', label: 'My Books', icon: BarChart3 },
//         { id: 'inventory', label: 'Browse Books', icon: Book },
//         { id: 'borrow', label: 'My Borrowed Books', icon: BookOpen },
//         { id: 'overdue', label: 'Overdue', icon: AlertCircle },
//       ]
//     : [
//         { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
//         { id: 'inventory', label: 'Books Inventory', icon: Book },
//         { id: 'borrow', label: 'Borrow & Return', icon: BookOpen },
//         { id: 'overdue', label: 'Overdue Tracking', icon: AlertCircle },
//         { id: 'history', label: 'Student History', icon: Users },
//         { id: 'settings', label: 'Settings', icon: Settings },
//       ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-900">
//             {isStudent ? 'Library Portal' : 'Library Management System'}
//           </h1>
//           <p className="text-gray-600 mt-2">
//             {isStudent
//               ? 'Browse books, track your borrowings, and manage returns'
//               : 'Manage books, track borrowing, and monitor library activities'}
//           </p>
//         </div>

//         {/* Radix UI Tabs */}
//         <Tabs defaultValue="dashboard" className="w-full">
//           <div className="bg-white rounded-xl shadow-md mb-6 p-4">
//             <TabsList className="w-full flex-wrap h-auto gap-2">
//               {tabs.map((tab) => (
//                 <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
//                   <tab.icon className="w-4 h-4" />
//                   {tab.label}
//                 </TabsTrigger>
//               ))}
//             </TabsList>
//           </div>

//           {/* Tab Content */}
//           <TabsContent value="dashboard">
//             <DashboardTab
//               stats={stats}
//               books={books}
//               borrowedBooks={borrowedBooks}
//               isStudent={isStudent}
//             />
//           </TabsContent>

//           <TabsContent value="inventory">
//             <BooksInventoryTab
//               books={books}
//               categories={categories}
//               searchQuery={searchQuery}
//               selectedCategory={selectedCategory}
//               selectedStatus={selectedStatus}
//               setSearchQuery={setSearchQuery}
//               setSelectedCategory={setSelectedCategory}
//               setSelectedStatus={setSelectedStatus}
//               setShowAddBookModal={setShowAddBookModal}
//               openEditModal={openEditModal}
//               handleDeleteBook={handleDeleteBook}
//               openBorrowModalWithBook={openBorrowModalWithBook}
//               isStudent={isStudent}
//             />
//           </TabsContent>

//           <TabsContent value="borrow">
//             <BorrowReturnTab
//               borrowedBooks={borrowedBooks}
//               setShowBorrowModal={setShowBorrowModal}
//               handleReturnBook={handleReturnBook}
//               loading={loading}
//               isStudent={isStudent}
//             />
//           </TabsContent>

//           <TabsContent value="overdue">
//             <OverdueTrackingTab
//               borrowedBooks={borrowedBooks}
//               settings={settings}
//               handleReturnBook={handleReturnBook}
//               isStudent={isStudent}
//             />
//           </TabsContent>

//           {!isStudent && (
//             <>
//               <TabsContent value="history">
//                 <StudentHistoryTab students={students} borrowedBooks={borrowedBooks} />
//               </TabsContent>

//               <TabsContent value="settings">
//                 <SettingsTab
//                   settings={settings}
//                   categories={categories}
//                   onSettingsUpdate={fetchSettings}
//                   onCategoriesUpdate={fetchCategories}
//                 />
//               </TabsContent>
//             </>
//           )}
//         </Tabs>
//       </div>

//       {/* Modals - Only show for admin/staff */}
//       {!isStudent && (
//         <>
//           {showAddBookModal && (
//             <AddBookModal
//               categories={categories}
//               onClose={() => setShowAddBookModal(false)}
//               onSuccess={() => {
//                 fetchBooks();
//                 fetchStats();
//               }}
//             />
//           )}

//           {showEditModal && selectedBook && (
//             <EditBookModal
//               book={selectedBook}
//               categories={categories}
//               onClose={() => {
//                 setShowEditModal(false);
//                 setSelectedBook(null);
//               }}
//               onSuccess={fetchBooks}
//             />
//           )}
//         </>
//       )}

//       {showBorrowModal && (
//         <BorrowBookModal
//           books={books}
//           students={students}
//           preSelectedBook={selectedBookForBorrow}
//           onClose={closeBorrowModal}
//           onSuccess={() => {
//             fetchBooks();
//             fetchBorrowedBooks();
//             fetchStats();
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default LibraryManagementPage;
import React, { useState, useEffect } from 'react';
import { BarChart3, Book, BookOpen, AlertCircle, Users, Settings } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

// Import types
import { 
  Book as BookType, 
  BorrowedBook, 
  Student, 
  Category, 
  LibrarySettings, 
  DashboardStats 
} from '../../types/library';

// Import components
import DashboardTab from './components/DashboardTab';
import BooksInventoryTab from './components/BooksInventoryTab';
import BorrowReturnTab from './components/BorrowReturnTab';
import OverdueTrackingTab from './components/OverdueTrackingTab';
import StudentHistoryTab from './components/StudentHistoryTab';
import SettingsTab from './components/SettingsTab';

// Import modals
import AddBookModal from './modals/AddBookModal';
import EditBookModal from './modals/EditBookModal';
import BorrowBookModal from './modals/BorrowBookModal';

// Import Radix UI Tabs
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';

const LibraryManagementPage = () => {
  // GET USER ROLE
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';
  const isStaffLibrarian = user?.role === 'staff';

  // State management
  const [books, setBooks] = useState<BookType[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [selectedBookForBorrow, setSelectedBookForBorrow] = useState<BookType | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<LibrarySettings | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    availableBooks: 0,
    checkedOutBooks: 0,
    overdueBooks: 0,
  });

  // Student-specific state
  const [studentProfileId, setStudentProfileId] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modal states
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch student profile ID first if user is a student
  useEffect(() => {
    if (isStudent && user?.id) {
      fetchStudentProfileId();
    } else {
      fetchAllData();
    }
  }, [user?.id, isStudent]);

  // Fetch data when studentProfileId is available
  useEffect(() => {
    if (isStudent && studentProfileId) {
      fetchAllData();
    }
  }, [studentProfileId]);

  const fetchStudentProfileId = async () => {
    try {
      console.log('🔍 Fetching student profile for user:', user?.id);

      const { data: studentProfile, error } = await supabase
        .from('student_profiles')
        .select('student_id')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('❌ Error fetching student profile:', error);
        return;
      }

      if (studentProfile) {
        console.log('✅ Found student_id:', studentProfile.student_id);
        setStudentProfileId(studentProfile.student_id);
      } else {
        console.warn('⚠️ No student profile found');
      }
    } catch (error) {
      console.error('❌ Error in fetchStudentProfileId:', error);
    }
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchBooks(),
      fetchBorrowedBooks(),
      fetchStudents(),
      fetchCategories(),
      fetchSettings(),
      fetchStats(),
    ]);
  };

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('title');

    if (data) setBooks(data);
    if (error) console.error('Error fetching books:', error);
  };

  const fetchBorrowedBooks = async () => {
    try {
      let query = supabase
        .from('borrowed_books')
        .select('*')
        .order('issue_date', { ascending: false });

      // ✅ FILTER FOR STUDENTS: Use student_id from student_profiles
      if (isStudent && studentProfileId) {
        console.log('📚 Filtering borrowed books for student_id:', studentProfileId);
        query = query.eq('student_id', studentProfileId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching borrowed books:', error);
        return;
      }

      console.log('✅ Fetched borrowed books:', data?.length || 0);
      console.log('📋 Borrowed books data:', data);

      if (data) setBorrowedBooks(data);
    } catch (error) {
      console.error('❌ Error in fetchBorrowedBooks:', error);
    }
  };

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('class_assignments')
      .select('student_id, student_name, class_name')
      .order('student_name');

    if (data) {
      const uniqueStudents = data.reduce((acc: Student[], curr) => {
        if (!acc.find((s) => s.id === curr.student_id)) {
          acc.push({
            id: curr.student_id,
            student_name: curr.student_name,
            class_name: curr.class_name,
          });
        }
        return acc;
      }, []);
      setStudents(uniqueStudents);
    }

    if (error) console.error('Error fetching students:', error);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('book_categories')
      .select('*')
      .order('name');

    if (data) setCategories(data);
    if (error) console.error('Error fetching categories:', error);
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('library_settings')
      .select('*')
      .single();

    if (data) setSettings(data);
    if (error) console.error('Error fetching settings:', error);
  };

  const fetchStats = async () => {
    try {
      const { data: booksData } = await supabase
        .from('books')
        .select('quantity, available_quantity');

      let borrowedQuery = supabase
        .from('borrowed_books')
        .select('status')
        .eq('status', 'Borrowed');

      let overdueQuery = supabase
        .from('borrowed_books')
        .select('status')
        .eq('status', 'Overdue');

      // ✅ FILTER STATS FOR STUDENTS: Use student_id
      if (isStudent && studentProfileId) {
        console.log('📊 Filtering stats for student_id:', studentProfileId);
        borrowedQuery = borrowedQuery.eq('student_id', studentProfileId);
        overdueQuery = overdueQuery.eq('student_id', studentProfileId);
      }

      const { data: borrowedData } = await borrowedQuery;
      const { data: overdueData } = await overdueQuery;

      console.log('📊 Stats - Borrowed:', borrowedData?.length, 'Overdue:', overdueData?.length);

      if (booksData) {
        const totalBooks = booksData.reduce((sum, book) => sum + book.quantity, 0);
        const availableBooks = booksData.reduce(
          (sum, book) => sum + book.available_quantity,
          0
        );

        setStats({
          totalBooks: isStudent ? borrowedData?.length || 0 : totalBooks,
          availableBooks: isStudent ? 0 : availableBooks,
          checkedOutBooks: borrowedData?.length || 0,
          overdueBooks: overdueData?.length || 0,
        });
      }
    } catch (error) {
      console.error('❌ Error in fetchStats:', error);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    const { error } = await supabase.from('books').delete().eq('id', bookId);

    if (error) {
      alert('Error deleting book: ' + error.message);
    } else {
      alert('Book deleted successfully!');
      fetchBooks();
      fetchStats();
    }
  };

  const handleReturnBook = async (borrowId: string, bookId: string) => {
    setLoading(true);

    const borrowRecord = borrowedBooks.find((b) => b.id === borrowId);
    if (!borrowRecord) return;

    const today = new Date();
    const expectedReturnDate = new Date(borrowRecord.expected_return_date);
    const daysLate = Math.max(
      0,
      Math.floor((today.getTime() - expectedReturnDate.getTime()) / (1000 * 60 * 60 * 24))
    );
    const fineAmount = daysLate * (settings?.fine_per_day || 10);

    const { error: returnError } = await supabase
      .from('borrowed_books')
      .update({
        status: 'Returned',
        actual_return_date: new Date().toISOString(),
        days_late: daysLate,
        fine_amount: fineAmount,
      })
      .eq('id', borrowId);

    if (returnError) {
      alert('Error returning book: ' + returnError.message);
      setLoading(false);
      return;
    }

    const book = books.find((b) => b.id === bookId);
    if (book) {
      const { error: updateError } = await supabase
        .from('books')
        .update({
          available_quantity: book.available_quantity + 1,
          status: 'Available',
        })
        .eq('id', bookId);

      if (updateError) {
        alert('Error updating book status: ' + updateError.message);
      } else {
        alert(
          `Book returned successfully! ${daysLate > 0 ? `Fine: ₹${fineAmount}` : 'No fine.'}`
        );
      }
    }

    fetchBooks();
    fetchBorrowedBooks();
    fetchStats();
    setLoading(false);
  };

  const openEditModal = (book: BookType) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  const openBorrowModalWithBook = (book: BookType) => {
    setSelectedBookForBorrow(book);
    setShowBorrowModal(true);
  };

  const closeBorrowModal = () => {
    setShowBorrowModal(false);
    setSelectedBookForBorrow(null);
  };

  // DEFINE TABS BASED ON ROLE
  const tabs = isStudent
    ? [
        { id: 'dashboard', label: 'My Books', icon: BarChart3 },
        { id: 'inventory', label: 'Browse Books', icon: Book },
        { id: 'borrow', label: 'My Borrowed Books', icon: BookOpen },
        { id: 'overdue', label: 'Overdue', icon: AlertCircle },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'inventory', label: 'Books Inventory', icon: Book },
        { id: 'borrow', label: 'Borrow & Return', icon: BookOpen },
        { id: 'overdue', label: 'Overdue Tracking', icon: AlertCircle },
        { id: 'history', label: 'Student History', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];

  // Show loading state for students until profile is fetched
  if (isStudent && !studentProfileId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your library profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isStudent ? 'Library Portal' : 'Library Management System'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isStudent
              ? 'Browse books, track your borrowings, and manage returns'
              : 'Manage books, track borrowing, and monitor library activities'}
          </p>
        </div>

        {/* Radix UI Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="bg-white rounded-xl shadow-md mb-6 p-4">
            <TabsList className="w-full flex-wrap h-auto gap-2">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent value="dashboard">
            <DashboardTab
              stats={stats}
              books={books}
              borrowedBooks={borrowedBooks}
              isStudent={isStudent}
            />
          </TabsContent>

          <TabsContent value="inventory">
            <BooksInventoryTab
              books={books}
              categories={categories}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedStatus={selectedStatus}
              setSearchQuery={setSearchQuery}
              setSelectedCategory={setSelectedCategory}
              setSelectedStatus={setSelectedStatus}
              setShowAddBookModal={setShowAddBookModal}
              openEditModal={openEditModal}
              handleDeleteBook={handleDeleteBook}
              openBorrowModalWithBook={openBorrowModalWithBook}
              isStudent={isStudent}
            />
          </TabsContent>

          <TabsContent value="borrow">
            <BorrowReturnTab
              borrowedBooks={borrowedBooks}
              setShowBorrowModal={setShowBorrowModal}
              handleReturnBook={handleReturnBook}
              loading={loading}
              isStudent={isStudent}
            />
          </TabsContent>

          <TabsContent value="overdue">
            <OverdueTrackingTab
              borrowedBooks={borrowedBooks}
              settings={settings}
              handleReturnBook={handleReturnBook}
              isStudent={isStudent}
            />
          </TabsContent>

          {!isStudent && (
            <>
              <TabsContent value="history">
                <StudentHistoryTab students={students} borrowedBooks={borrowedBooks} />
              </TabsContent>

              <TabsContent value="settings">
                <SettingsTab
                  settings={settings}
                  categories={categories}
                  onSettingsUpdate={fetchSettings}
                  onCategoriesUpdate={fetchCategories}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {/* Modals - Only show for admin/staff */}
      {!isStudent && (
        <>
          {showAddBookModal && (
            <AddBookModal
              categories={categories}
              onClose={() => setShowAddBookModal(false)}
              onSuccess={() => {
                fetchBooks();
                fetchStats();
              }}
            />
          )}

          {showEditModal && selectedBook && (
            <EditBookModal
              book={selectedBook}
              categories={categories}
              onClose={() => {
                setShowEditModal(false);
                setSelectedBook(null);
              }}
              onSuccess={fetchBooks}
            />
          )}
        </>
      )}

      {showBorrowModal && (
        <BorrowBookModal
          books={books}
          students={students}
          preSelectedBook={selectedBookForBorrow}
          onClose={closeBorrowModal}
          onSuccess={() => {
            fetchBooks();
            fetchBorrowedBooks();
            fetchStats();
          }}
        />
      )}
    </div>
  );
};

export default LibraryManagementPage;
