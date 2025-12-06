import { useState, useEffect } from 'react';
import type { User, Book, BorrowRecord } from '../App';
import { getBooks, getBorrowRecords, saveBorrowRecords, saveBooks } from '../utils/mockData';

// ============================================
// BORROW & RETURN PAGE COMPONENT
// ============================================
// Manage borrowing and returning books

type BorrowReturnPageProps = {
  currentUser: User;
};

export function BorrowReturnPage({ currentUser }: BorrowReturnPageProps) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  const [books, setBooks] = useState<Book[]>([]);                    // All books
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]); // All borrow records
  const [activeRecords, setActiveRecords] = useState<any[]>([]);     // Currently borrowed books
  const [selectedBook, setSelectedBook] = useState('');              // Selected book for borrowing
  const [borrowDays, setBorrowDays] = useState(30);                  // Borrow period
  const [showBorrowForm, setShowBorrowForm] = useState(false);       // Modal visibility

  // ============================================
  // LOAD DATA ON MOUNT AND USER CHANGE
  // ============================================
  
  useEffect(() => {
    loadData();
  }, [currentUser]);

  // ============================================
  // LOAD AND UPDATE BORROW RECORDS
  // ============================================
  
  const loadData = () => {
    const booksData = getBooks();
    const recordsData = getBorrowRecords();

    setBooks(booksData);
    setBorrowRecords(recordsData);

    // Automatically update overdue status based on current date
    const now = new Date();
    const updatedRecords = recordsData.map((record: BorrowRecord) => {
      if (record.status === 'borrowed' && new Date(record.due_date) < now) {
        return { ...record, status: 'overdue' as const };
      }
      return record;
    });

    // Save updated records if status changed
    if (JSON.stringify(updatedRecords) !== JSON.stringify(recordsData)) {
      saveBorrowRecords(updatedRecords);
      setBorrowRecords(updatedRecords);
    }

    // Filter active records based on user role
    // Admins see all records, students see only their own
    const userRecords = currentUser.role === 'admin'
      ? updatedRecords
      : updatedRecords.filter((r: any) => r.user_id === currentUser.id);

    // Get only active (borrowed or overdue) records with book details
    const active = userRecords
      .filter((r: any) => r.status === 'borrowed' || r.status === 'overdue')
      .map((record: any) => {
        const book = booksData.find((b: any) => b.id === record.book_id);
        return { ...record, book };
      });

    setActiveRecords(active);
  };

  // ============================================
  // HANDLE BORROWING A BOOK
  // ============================================
  
  const handleBorrow = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBook) return;

    // Check if book is available
    const book = books.find((b) => b.id === selectedBook);
    if (!book || book.available <= 0) {
      alert('This book is not available');
      return;
    }

    // Create new borrow record
    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + borrowDays);

    const newRecord: BorrowRecord = {
      id: `record-${Date.now()}`,
      user_id: currentUser.id,
      book_id: selectedBook,
      borrow_date: now.toISOString(),
      due_date: dueDate.toISOString(),
      return_date: null,
      status: 'borrowed',
    };

    // Save the new borrow record
    const updatedRecords = [...borrowRecords, newRecord];
    saveBorrowRecords(updatedRecords);

    // Decrease book availability count
    const updatedBooks = books.map((b) =>
      b.id === selectedBook ? { ...b, available: b.available - 1 } : b
    );
    setBooks(updatedBooks);
    saveBooks(updatedBooks);

    // Reset form and close modal
    setSelectedBook('');
    setBorrowDays(30);
    setShowBorrowForm(false);
    loadData();
  };

  // ============================================
  // HANDLE RETURNING A BOOK
  // ============================================
  
  const handleReturn = (recordId: string) => {
    const record = borrowRecords.find((r) => r.id === recordId);
    if (!record) return;

    // Mark record as returned
    const updatedRecords = borrowRecords.map((r) =>
      r.id === recordId
        ? { ...r, return_date: new Date().toISOString(), status: 'returned' as const }
        : r
    );
    saveBorrowRecords(updatedRecords);

    // Increase book availability count
    const updatedBooks = books.map((b) =>
      b.id === record.book_id ? { ...b, available: b.available + 1 } : b
    );
    setBooks(updatedBooks);
    saveBooks(updatedBooks);

    // Reload data to refresh the list
    loadData();
  };

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

  // Calculate days remaining until due date
  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Filter books that are available for borrowing
  const availableBooks = books.filter((b) => b.available > 0);

  // ============================================
  // RENDER COMPONENT
  // ============================================
  
  return (
    <div>
      {/* Page Header with Borrow Button */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2">Borrow & Return</h1>
          <p className="text-gray-600">Manage your borrowed books</p>
        </div>
        <button
          onClick={() => setShowBorrowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Borrow Book</span>
        </button>
      </div>

      {/* ============================================
          CURRENTLY BORROWED BOOKS LIST
          ============================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Currently Borrowed</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {activeRecords.length === 0 ? (
            // Empty state
            <div className="p-6 text-center text-gray-500">No active borrowed books</div>
          ) : (
            // List of borrowed books
            activeRecords.map((record) => {
              const daysUntilDue = getDaysUntilDue(record.due_date);
              return (
                <div key={record.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  {/* Mobile-optimized layout */}
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Book info with cover */}
                    <div className="flex gap-3 sm:gap-4 flex-1 w-full">
                      <img
                        src={record.book?.cover_url}
                        alt={record.book?.title}
                        className="w-16 h-20 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        {/* Book title and author */}
                        <div className="text-gray-900 mb-1 line-clamp-2">{record.book?.title}</div>
                        <div className="text-gray-600 text-sm mb-3">by {record.book?.author}</div>
                        
                        {/* Dates grid - stack on small mobile */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">Borrowed</div>
                            <div className="text-gray-900">{formatDate(record.borrow_date)}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Due Date</div>
                            <div
                              className={
                                record.status === 'overdue'
                                  ? 'text-red-600'
                                  : daysUntilDue <= 3
                                  ? 'text-orange-600'
                                  : 'text-gray-900'
                              }
                            >
                              {formatDate(record.due_date)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Days remaining warning */}
                        {daysUntilDue >= 0 ? (
                          <div className="mt-2 text-sm text-gray-600">
                            {daysUntilDue === 0
                              ? 'Due today'
                              : `${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''} remaining`}
                          </div>
                        ) : (
                          <div className="mt-2 text-sm text-red-600">
                            Overdue by {Math.abs(daysUntilDue)} day{Math.abs(daysUntilDue) !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Status badge and return button */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                      <span
                        className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                          record.status === 'overdue'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {record.status === 'overdue' ? 'Overdue' : 'Borrowed'}
                      </span>
                      <button
                        onClick={() => handleReturn(record.id)}
                        className="flex-1 sm:flex-initial px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
                      >
                        Return Book
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ============================================
          BORROW BOOK MODAL
          ============================================ */}
      {showBorrowForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowBorrowForm(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-900">Borrow a Book</h2>
                <button
                  onClick={() => setShowBorrowForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Borrow form */}
            <form onSubmit={handleBorrow} className="p-4 sm:p-6">
              {/* Book selection dropdown */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Book</label>
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a book...</option>
                  {availableBooks.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} - {book.author} (Available: {book.available})
                    </option>
                  ))}
                </select>
              </div>

              {/* Borrow period input */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Borrow Period (days)</label>
                <input
                  type="number"
                  value={borrowDays}
                  onChange={(e) => setBorrowDays(parseInt(e.target.value) || 30)}
                  min="1"
                  max="90"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {/* Show calculated due date */}
                <div className="mt-2 text-sm text-gray-600">
                  Due date: {new Date(Date.now() + borrowDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowBorrowForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Borrow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
