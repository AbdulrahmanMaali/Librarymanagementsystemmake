import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { CatalogPage } from './components/CatalogPage';
import { BorrowReturnPage } from './components/BorrowReturnPage';
import { UserManagementPage } from './components/UserManagementPage';
import { BookManagementPage } from './components/BookManagementPage';
import { ReportsPage } from './components/ReportsPage';

// ============================================
// TYPE DEFINITIONS
// ============================================

// User type - represents a library user (admin or student)
export type User = {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'student';
  created_at: string;
};

// Book type - represents a book in the library catalog
export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  quantity: number;        // Total copies available
  available: number;       // Currently available for borrowing
  description: string;
  cover_url: string;
  published_year: number;
};

// BorrowRecord type - tracks book borrowing transactions
export type BorrowRecord = {
  id: string;
  user_id: string;
  book_id: string;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: 'borrowed' | 'returned' | 'overdue';
};

// ============================================
// MAIN APP COMPONENT
// ============================================

export default function App() {
  // State management for current logged-in user
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // State management for active page navigation
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'catalog' | 'borrow' | 'users' | 'books' | 'reports'>('dashboard');
  
  // State for mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('library_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Handle user login
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('library_user', JSON.stringify(user));
  };

  // Handle user logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('library_user');
    setCurrentPage('dashboard');
  };

  // Handle page navigation (also closes mobile menu)
  const navigateTo = (page: typeof currentPage) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  // Show login page if user is not authenticated
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // ============================================
  // MAIN APPLICATION LAYOUT
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============================================
          TOP NAVIGATION BAR
          ============================================ */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Desktop Navigation */}
            <div className="flex items-center gap-4 lg:gap-8 flex-1">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-gray-900 hidden sm:inline">Library Management</span>
                <span className="text-gray-900 sm:hidden">LMS</span>
              </div>

              {/* Desktop Navigation - Hidden on mobile */}
              <div className="hidden lg:flex gap-1">
                <button
                  onClick={() => navigateTo('dashboard')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    currentPage === 'dashboard'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigateTo('catalog')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    currentPage === 'catalog'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Catalog
                </button>
                <button
                  onClick={() => navigateTo('borrow')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    currentPage === 'borrow'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Borrow
                </button>
                {/* Admin-only navigation items */}
                {currentUser.role === 'admin' && (
                  <>
                    <button
                      onClick={() => navigateTo('users')}
                      className={`px-3 py-2 rounded-md transition-colors ${
                        currentPage === 'users'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Users
                    </button>
                    <button
                      onClick={() => navigateTo('books')}
                      className={`px-3 py-2 rounded-md transition-colors ${
                        currentPage === 'books'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Books
                    </button>
                    <button
                      onClick={() => navigateTo('reports')}
                      className={`px-3 py-2 rounded-md transition-colors ${
                        currentPage === 'reports'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Reports
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right side - User info and logout */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* User info - Hidden on small mobile */}
              <div className="text-right hidden md:block">
                <div className="text-gray-900 text-sm">{currentUser.full_name}</div>
                <div className="text-gray-500 text-xs">{currentUser.role}</div>
              </div>
              
              {/* Logout button - Compact on mobile */}
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* ============================================
              MOBILE NAVIGATION MENU
              ============================================ */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-3">
              {/* User info on mobile */}
              <div className="px-4 py-2 mb-2 md:hidden">
                <div className="text-gray-900">{currentUser.full_name}</div>
                <div className="text-gray-500 text-sm">{currentUser.role}</div>
              </div>
              
              <div className="space-y-1">
                <button
                  onClick={() => navigateTo('dashboard')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    currentPage === 'dashboard'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigateTo('catalog')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    currentPage === 'catalog'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Catalog
                </button>
                <button
                  onClick={() => navigateTo('borrow')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    currentPage === 'borrow'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Borrow/Return
                </button>
                {/* Admin-only mobile menu items */}
                {currentUser.role === 'admin' && (
                  <>
                    <button
                      onClick={() => navigateTo('users')}
                      className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                        currentPage === 'users'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      User Management
                    </button>
                    <button
                      onClick={() => navigateTo('books')}
                      className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                        currentPage === 'books'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Manage Books
                    </button>
                    <button
                      onClick={() => navigateTo('reports')}
                      className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                        currentPage === 'reports'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Reports
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ============================================
          MAIN CONTENT AREA
          ============================================ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Render the appropriate page based on currentPage state */}
        {currentPage === 'dashboard' && <Dashboard currentUser={currentUser} />}
        {currentPage === 'catalog' && <CatalogPage currentUser={currentUser} />}
        {currentPage === 'borrow' && <BorrowReturnPage currentUser={currentUser} />}
        {currentPage === 'users' && currentUser.role === 'admin' && <UserManagementPage />}
        {currentPage === 'books' && currentUser.role === 'admin' && <BookManagementPage />}
        {currentPage === 'reports' && currentUser.role === 'admin' && <ReportsPage />}
      </main>
    </div>
  );
}