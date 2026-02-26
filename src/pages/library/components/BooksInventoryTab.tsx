// import React from 'react';
// import { Search, Plus, Edit, Trash2, Book, BookOpen, Eye } from 'lucide-react';
// import { Book as BookType, Category } from '../../../types/library';

// interface BooksInventoryTabProps {
//   books: BookType[];
//   categories: Category[];
//   searchQuery: string;
//   selectedCategory: string;
//   selectedStatus: string;
//   setSearchQuery: (query: string) => void;
//   setSelectedCategory: (category: string) => void;
//   setSelectedStatus: (status: string) => void;
//   setShowAddBookModal: (show: boolean) => void;
//   openEditModal: (book: BookType) => void;
//   handleDeleteBook: (bookId: string) => void;
//   openBorrowModalWithBook?: (book: BookType) => void;
//   isStudent?: boolean;
// }

// const BooksInventoryTab: React.FC<BooksInventoryTabProps> = ({
//   books,
//   categories,
//   searchQuery,
//   selectedCategory,
//   selectedStatus,
//   setSearchQuery,
//   setSelectedCategory,
//   setSelectedStatus,
//   setShowAddBookModal,
//   openEditModal,
//   handleDeleteBook,
//   openBorrowModalWithBook,
//   isStudent = false,
// }) => {
//   const filteredBooks = books.filter((book) => {
//     const matchesSearch =
//       book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       book.isbn.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesCategory =
//       selectedCategory === 'all' || book.category === selectedCategory;

//     const matchesStatus = selectedStatus === 'all' || book.status === selectedStatus;

//     return matchesSearch && matchesCategory && matchesStatus;
//   });

//   return (
//     <div className="space-y-6">
//       {/* Search and Filters */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <div className="flex flex-col lg:flex-row gap-4">
//           {/* Search Input */}
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by title, author, or ISBN..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {/* Category Filter */}
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="all">All Categories</option>
//             {categories.map((cat) => (
//               <option key={cat.id} value={cat.name}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>

//           {/* Status Filter */}
//           <select
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="all">All Status</option>
//             <option value="Available">Available</option>
//             <option value="Checked Out">Checked Out</option>
//             <option value="Reserved">Reserved</option>
//           </select>

//           {/* Add Book Button - Admin/Staff Only */}
//           {!isStudent && (
//             <button
//               onClick={() => setShowAddBookModal(true)}
//               className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <Plus className="w-5 h-5" />
//               Add Book
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Books Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredBooks.map((book) => (
//           <div
//             key={book.id}
//             className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//           >
//             {/* Book Cover */}
//             <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
//               {book.cover_url ? (
//                 <img
//                   src={book.cover_url}
//                   alt={book.title}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.currentTarget.style.display = 'none';
//                   }}
//                 />
//               ) : (
//                 <Book className="w-20 h-20 text-white opacity-50" />
//               )}
//             </div>

//             {/* Book Details */}
//             <div className="p-5">
//               <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">
//                 {book.title}
//               </h3>
//               <p className="text-sm text-gray-600 mb-3">{book.author}</p>

//               <div className="space-y-2 mb-4">
//                 <div className="flex items-center gap-2 text-sm">
//                   <span className="text-gray-500">ISBN:</span>
//                   <span className="text-gray-700">{book.isbn}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm">
//                   <span className="text-gray-500">Category:</span>
//                   <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
//                     {book.category}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm">
//                   <span className="text-gray-500">Location:</span>
//                   <span className="text-gray-700">
//                     {book.section} - {book.shelf_no}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm">
//                   <span className="text-gray-500">Available:</span>
//                   <span className="font-semibold text-gray-800">
//                     {book.available_quantity}/{book.quantity}
//                   </span>
//                 </div>
//               </div>

//               {/* Status Badge */}
//               <div className="flex items-center justify-between mb-4">
//                 <span
//                   className={`px-3 py-1 rounded-full text-sm font-medium ${
//                     book.status === 'Available'
//                       ? 'bg-green-100 text-green-700'
//                       : book.status === 'Checked Out'
//                       ? 'bg-red-100 text-red-700'
//                       : 'bg-yellow-100 text-yellow-700'
//                   }`}
//                 >
//                   {book.status}
//                 </span>
//               </div>

//               {/* Action Buttons - Role Based */}
//               <div className="space-y-2">
//                 {/* BORROW BUTTON - Only for Admin/Staff with available books */}
//                 {!isStudent &&
//                   book.available_quantity > 0 &&
//                   openBorrowModalWithBook && (
//                     <button
//                       onClick={() => openBorrowModalWithBook(book)}
//                       className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
//                     >
//                       <BookOpen className="w-4 h-4" />
//                       Borrow Book
//                     </button>
//                   )}

//                 {/* STUDENT VIEW - Only View Details */}
//                 {isStudent ? (
//                   <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
//                     <Eye className="w-4 h-4" />
//                     View Details
//                   </button>
//                 ) : (
//                   // ADMIN/STAFF - Edit & Delete Buttons
//                   <div className="grid grid-cols-2 gap-2">
//                     <button
//                       onClick={() => openEditModal(book)}
//                       className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
//                     >
//                       <Edit className="w-4 h-4" />
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteBook(book.id)}
//                       className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* No Books Found */}
//       {filteredBooks.length === 0 && (
//         <div className="bg-white rounded-xl shadow-md p-12 text-center">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
//             <Book className="w-8 h-8 text-gray-400" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">No Books Found</h3>
//           <p className="text-gray-600">Try adjusting your search or filters.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BooksInventoryTab;
import React from 'react';
import { Search, Plus, Edit, Trash2, Book, BookOpen, Eye } from 'lucide-react';
import { Book as BookType, Category } from '../../../types/library';

interface BooksInventoryTabProps {
  books: BookType[];
  categories: Category[];
  searchQuery: string;
  selectedCategory: string;
  selectedStatus: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedStatus: (status: string) => void;
  setShowAddBookModal: (show: boolean) => void;
  openEditModal: (book: BookType) => void;
  handleDeleteBook: (bookId: string) => void;
  openBorrowModalWithBook?: (book: BookType) => void;
  isStudent?: boolean;
}

const BooksInventoryTab: React.FC<BooksInventoryTabProps> = ({
  books,
  categories,
  searchQuery,
  selectedCategory,
  selectedStatus,
  setSearchQuery,
  setSelectedCategory,
  setSelectedStatus,
  setShowAddBookModal,
  openEditModal,
  handleDeleteBook,
  openBorrowModalWithBook,
  isStudent = false,
}) => {
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || book.category === selectedCategory;

    const matchesStatus = selectedStatus === 'all' || book.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 placeholder-gray-400"
              style={{ fontSize: '14px', fontWeight: 500 }}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
            style={{ fontSize: '14px', fontWeight: 500 }}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
            style={{ fontSize: '14px', fontWeight: 500 }}
          >
            <option value="all">All Status</option>
            <option value="Available">Available</option>
            <option value="Checked Out">Checked Out</option>
            <option value="Reserved">Reserved</option>
          </select>

          {/* Add Book Button - Admin/Staff Only */}
          {!isStudent && (
            <button
              onClick={() => setShowAddBookModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 gradient-primary text-white rounded-xl shadow-soft hover:shadow-float transition-all duration-200 font-medium"
              style={{ fontSize: '14px' }}
            >
              <Plus className="w-5 h-5" />
              Add Book
            </button>
          )}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-[20px] shadow-soft border border-gray-100 overflow-hidden hover:shadow-float transition-all duration-300"
          >
            {/* Book Cover */}
            <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center relative">
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <Book className="w-20 h-20 text-white opacity-50" />
              )}
            </div>

            {/* Book Details */}
            <div className="p-5">
              <h3 
                className="text-gray-900 mb-2 line-clamp-1"
                style={{ fontSize: '18px', fontWeight: 600 }}
              >
                {book.title}
              </h3>
              <p 
                className="text-gray-600 mb-4"
                style={{ fontSize: '14px', fontWeight: 400 }}
              >
                {book.author}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span 
                    className="text-gray-500"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                  >
                    ISBN:
                  </span>
                  <span 
                    className="text-gray-700"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                  >
                    {book.isbn}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-gray-500"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                  >
                    Category:
                  </span>
                  <span 
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium"
                    style={{ fontSize: '12px' }}
                  >
                    {book.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-gray-500"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                  >
                    Location:
                  </span>
                  <span 
                    className="text-gray-700"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                  >
                    {book.section} - {book.shelf_no}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-gray-500"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                  >
                    Available:
                  </span>
                  <span 
                    className="text-gray-900"
                    style={{ fontSize: '13px', fontWeight: 600 }}
                  >
                    {book.available_quantity}/{book.quantity}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1.5 rounded-xl font-medium ${
                    book.status === 'Available'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : book.status === 'Checked Out'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                  style={{ fontSize: '13px' }}
                >
                  {book.status}
                </span>
              </div>

              {/* Action Buttons - Role Based */}
              <div className="space-y-2">
                {/* BORROW BUTTON - Only for Admin/Staff with available books */}
                {!isStudent &&
                  book.available_quantity > 0 &&
                  openBorrowModalWithBook && (
                    <button
                      onClick={() => openBorrowModalWithBook(book)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium shadow-sm"
                      style={{ fontSize: '14px' }}
                    >
                      <BookOpen className="w-4 h-4" />
                      Borrow Book
                    </button>
                  )}

                {/* STUDENT VIEW - Only View Details */}
                {isStudent ? (
                  <button 
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium"
                    style={{ fontSize: '14px' }}
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                ) : (
                  // ADMIN/STAFF - Edit & Delete Buttons
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openEditModal(book)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium"
                      style={{ fontSize: '14px' }}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
                      style={{ fontSize: '14px' }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Books Found */}
      {filteredBooks.length === 0 && (
        <div className="bg-white rounded-[20px] shadow-soft border border-gray-100 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[16px] bg-gray-100 mb-4">
            <Book className="w-8 h-8 text-gray-400" />
          </div>
          <h3 
            className="text-gray-900 mb-2"
            style={{ fontSize: '18px', fontWeight: 600 }}
          >
            No Books Found
          </h3>
          <p 
            className="text-gray-600"
            style={{ fontSize: '14px' }}
          >
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default BooksInventoryTab;
