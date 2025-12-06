// ============================================
// MOCK DATA UTILITIES
// ============================================
// This file contains all mock/demo data for the library system
// In a production app, this would be replaced with API calls to a backend

// ============================================
// MOCK USER DATA
// ============================================
// Pre-defined users for demo purposes (includes passwords for testing)
export const mockUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // In production, passwords would be hashed
    email: 'admin@library.com',
    full_name: 'Admin User',
    role: 'admin' as const,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    username: 'student1',
    password: 'student123',
    email: 'student1@university.edu',
    full_name: 'John Smith',
    role: 'student' as const,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    username: 'student2',
    password: 'student123',
    email: 'student2@university.edu',
    full_name: 'Emma Johnson',
    role: 'student' as const,
    created_at: '2024-02-01T00:00:00Z',
  },
];

// ============================================
// MOCK BOOK DATA
// ============================================
// Sample books in the library catalog
export const mockBooks = [
  {
    id: '1',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    category: 'Computer Science',
    isbn: '978-0262033848',
    quantity: 5,      // Total copies in library
    available: 3,     // Currently available for borrowing
    description: 'A comprehensive textbook covering algorithms and data structures.',
    cover_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    published_year: 2009,
  },
  {
    id: '2',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Software Engineering',
    isbn: '978-0132350884',
    quantity: 4,
    available: 2,
    description: 'A handbook of agile software craftsmanship.',
    cover_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    published_year: 2008,
  },
  {
    id: '3',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Literature',
    isbn: '978-0743273565',
    quantity: 10,
    available: 8,
    description: 'A classic American novel set in the Jazz Age.',
    cover_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    published_year: 1925,
  },
  {
    id: '4',
    title: 'Calculus: Early Transcendentals',
    author: 'James Stewart',
    category: 'Mathematics',
    isbn: '978-1285741550',
    quantity: 8,
    available: 5,
    description: 'Comprehensive calculus textbook for university students.',
    cover_url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
    published_year: 2015,
  },
  {
    id: '5',
    title: 'Physics for Scientists and Engineers',
    author: 'Raymond A. Serway',
    category: 'Physics',
    isbn: '978-1133947271',
    quantity: 6,
    available: 4,
    description: 'A comprehensive introduction to physics concepts.',
    cover_url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
    published_year: 2013,
  },
  {
    id: '6',
    title: '1984',
    author: 'George Orwell',
    category: 'Literature',
    isbn: '978-0451524935',
    quantity: 12,
    available: 9,
    description: 'A dystopian social science fiction novel.',
    cover_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    published_year: 1949,
  },
  {
    id: '7',
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz',
    category: 'Computer Science',
    isbn: '978-0078022159',
    quantity: 5,
    available: 3,
    description: 'Comprehensive coverage of database management systems.',
    cover_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
    published_year: 2019,
  },
  {
    id: '8',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Literature',
    isbn: '978-0141439518',
    quantity: 8,
    available: 6,
    description: 'A romantic novel of manners.',
    cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    published_year: 1813,
  },
];

// ============================================
// MOCK BORROW RECORDS DATA
// ============================================
// Sample borrowing transactions showing different statuses
export const mockBorrowRecords = [
  {
    id: '1',
    user_id: '2',
    book_id: '1',
    borrow_date: '2024-11-15T10:00:00Z',
    due_date: '2024-12-15T10:00:00Z',  // This date is in the past
    return_date: null,                  // Not returned yet
    status: 'overdue' as const,         // Marked as overdue
  },
  {
    id: '2',
    user_id: '2',
    book_id: '2',
    borrow_date: '2024-11-20T10:00:00Z',
    due_date: '2024-12-20T10:00:00Z',
    return_date: null,
    status: 'borrowed' as const,        // Currently borrowed, not overdue
  },
  {
    id: '3',
    user_id: '3',
    book_id: '3',
    borrow_date: '2024-11-01T10:00:00Z',
    due_date: '2024-12-01T10:00:00Z',
    return_date: '2024-11-28T14:30:00Z',  // Already returned
    status: 'returned' as const,
  },
  {
    id: '4',
    user_id: '3',
    book_id: '4',
    borrow_date: '2024-11-25T10:00:00Z',
    due_date: '2024-12-25T10:00:00Z',
    return_date: null,
    status: 'borrowed' as const,
  },
];

// ============================================
// INITIALIZATION FUNCTION
// ============================================
// Populates localStorage with mock data if it doesn't exist
// This runs once when the app first loads
export function initializeMockData() {
  // Check if data already exists, if not, populate with mock data
  if (!localStorage.getItem('library_users')) {
    localStorage.setItem('library_users', JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem('library_books')) {
    localStorage.setItem('library_books', JSON.stringify(mockBooks));
  }
  if (!localStorage.getItem('library_borrow_records')) {
    localStorage.setItem('library_borrow_records', JSON.stringify(mockBorrowRecords));
  }
}

// ============================================
// GETTER FUNCTIONS
// ============================================
// Retrieve data from localStorage with fallback to mock data

// Get all users from localStorage
export function getUsers() {
  const data = localStorage.getItem('library_users');
  return data ? JSON.parse(data) : mockUsers;
}

// Get all books from localStorage
export function getBooks() {
  const data = localStorage.getItem('library_books');
  return data ? JSON.parse(data) : mockBooks;
}

// Get all borrow records from localStorage
export function getBorrowRecords() {
  const data = localStorage.getItem('library_borrow_records');
  return data ? JSON.parse(data) : mockBorrowRecords;
}

// ============================================
// SETTER FUNCTIONS
// ============================================
// Save data to localStorage

// Save updated users list
export function saveUsers(users: any[]) {
  localStorage.setItem('library_users', JSON.stringify(users));
}

// Save updated books list
export function saveBooks(books: any[]) {
  localStorage.setItem('library_books', JSON.stringify(books));
}

// Save updated borrow records list
export function saveBorrowRecords(records: any[]) {
  localStorage.setItem('library_borrow_records', JSON.stringify(records));
}
