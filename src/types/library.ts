export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: 'Available' | 'Checked Out' | 'Reserved';
  location: string;
  shelf_no: string;
  section: string;
  quantity: number;
  available_quantity: number;
  cover_url?: string;
  created_at: string;
}

export interface BorrowedBook {
  id: string;
  book_id: string;
  student_id: string;
  student_name: string;
  class_name: string;
  book_title: string;
  issue_date: string;
  expected_return_date: string;
  actual_return_date?: string;
  status: 'Borrowed' | 'Returned' | 'Overdue';
  days_late?: number;
  fine_amount?: number;
}

export interface Student {
  id: string;
  student_name: string;
  class_name: string;
}

export interface DashboardStats {
  totalBooks: number;
  availableBooks: number;
  checkedOutBooks: number;
  overdueBooks: number;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface LibrarySettings {
  id: string;
  borrow_duration_days: number;
  fine_per_day: number;
  max_books_per_student: number;
}
