import { useState, useEffect } from 'react';
import type { User } from '../App';
import { getBooks, getBorrowRecords, getUsers } from '../utils/mockData';

// ============================================
// DASHBOARD COMPONENT
// ============================================
// Main dashboard showing overview statistics and recent activity

type DashboardProps = {
  currentUser: User;  // Current logged-in user
};

export function Dashboard({ currentUser }: DashboardProps) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Statistics for dashboard cards
  const [stats, setStats] = useState({
    totalBooks: 0,      // Total book copies in library
    availableBooks: 0,  // Currently available for borrowing
    borrowedBooks: 0,   // Currently checked out
    overdueBooks: 0,    // Past due date
    totalUsers: 0,      // Number of students
  });

  // Recent borrowing activity
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // ============================================
  // LOAD DATA ON COMPONENT MOUNT
  // ============================================
  
  useEffect(() => {
    const books = getBooks();
    const records = getBorrowRecords();
    const users = getUsers();

    // Calculate statistics from data
    const totalBooks = books.reduce((sum: number, book: any) => sum + book.quantity, 0);
    const availableBooks = books.reduce((sum: number, book: any) => sum + book.available, 0);
    const borrowedBooks = records.filter((r: any) => r.status === 'borrowed' || r.status === 'overdue').length;
    const overdueBooks = records.filter((r: any) => r.status === 'overdue').length;

    setStats({
      totalBooks,
      availableBooks,
      borrowedBooks,
      overdueBooks,
      totalUsers: users.filter((u: any) => u.role === 'student').length,
    });

    // Get recent activity (last 5 records)
    // Admins see all records, students only see their own
    const userRecords = currentUser.role === 'admin'
      ? records.slice(-5).reverse()  // Last 5, newest first
      : records.filter((r: any) => r.user_id === currentUser.id).slice(-5).reverse();

    // Attach book and user details to each record
    const activityWithDetails = userRecords.map((record: any) => {
      const book = books.find((b: any) => b.id === record.book_id);
      const user = users.find((u: any) => u.id === record.user_id);
      return { ...record, book, user };
    });

    setRecentActivity(activityWithDetails);
  }, [currentUser]);

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // ============================================
  // RENDER COMPONENT
  // ============================================
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {currentUser.full_name}!</p>
      </div>

      {/* ============================================
          STATISTICS GRID
          ============================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {/* Total Books Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <div className="text-gray-900 text-xl sm:text-2xl mb-1">{stats.totalBooks}</div>
          <div className="text-gray-600 text-sm">Total Books</div>
        </div>

        {/* Available Books Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-gray-900 text-xl sm:text-2xl mb-1">{stats.availableBooks}</div>
          <div className="text-gray-600 text-sm">Available</div>
        </div>

        {/* Borrowed Books Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
          </div>
          <div className="text-gray-900 text-xl sm:text-2xl mb-1">{stats.borrowedBooks}</div>
          <div className="text-gray-600 text-sm">Borrowed</div>
        </div>

        {/* Overdue Books Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-gray-900 text-xl sm:text-2xl mb-1">{stats.overdueBooks}</div>
          <div className="text-gray-600 text-sm">Overdue</div>
        </div>
      </div>

      {/* ============================================
          OVERDUE NOTIFICATION BANNER
          ============================================ */}
      {stats.overdueBooks > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <div className="text-red-900 mb-1">Overdue Books Alert</div>
              <div className="text-red-700 text-sm sm:text-base">
                {currentUser.role === 'admin'
                  ? `There are ${stats.overdueBooks} overdue books in the system. Please follow up with users.`
                  : `You have ${stats.overdueBooks} overdue book(s). Please return them as soon as possible to avoid late fees.`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          RECENT ACTIVITY LIST
          ============================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.length === 0 ? (
            // Empty state
            <div className="p-6 text-center text-gray-500">No recent activity</div>
          ) : (
            // Activity list
            recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                  {/* Book info */}
                  <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
                    <img
                      src={activity.book?.cover_url}
                      alt={activity.book?.title}
                      className="w-12 h-16 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-900 mb-1 truncate">{activity.book?.title}</div>
                      <div className="text-gray-600 text-sm mb-2">by {activity.book?.author}</div>
                      {/* Show user name for admin view */}
                      {currentUser.role === 'admin' && (
                        <div className="text-gray-600 text-sm mb-1">
                          Borrowed by: {activity.user?.full_name}
                        </div>
                      )}
                      {/* Dates */}
                      <div className="flex flex-col sm:flex-row sm:gap-4 text-sm">
                        <div className="text-gray-500">
                          Borrowed: {formatDate(activity.borrow_date)}
                        </div>
                        <div className="text-gray-500">
                          Due: {formatDate(activity.due_date)}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Status badge */}
                  <div className="self-start sm:self-auto">
                    <span
                      className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                        activity.status === 'returned'
                          ? 'bg-green-100 text-green-700'
                          : activity.status === 'overdue'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
