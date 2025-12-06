import { useState, useEffect } from 'react';
import type { User, Book } from '../App';
import { getBooks } from '../utils/mockData';

// ============================================
// CATALOG PAGE COMPONENT
// ============================================
// Browse and search the book catalog with filtering

type CatalogPageProps = {
  currentUser: User;
};

export function CatalogPage({ currentUser }: CatalogPageProps) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  const [books, setBooks] = useState<Book[]>([]);                    // All books
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);    // Filtered results
  const [searchQuery, setSearchQuery] = useState('');                // Search input
  const [selectedCategory, setSelectedCategory] = useState('all');   // Category filter
  const [selectedBook, setSelectedBook] = useState<Book | null>(null); // For details modal

  // ============================================
  // LOAD BOOKS ON MOUNT
  // ============================================
  
  useEffect(() => {
    const booksData = getBooks();
    setBooks(booksData);
    setFilteredBooks(booksData);
  }, []);

  // ============================================
  // FILTER BOOKS BASED ON SEARCH AND CATEGORY
  // ============================================
  
  useEffect(() => {
    let result = books;

    // Filter by search query (title or author)
    if (searchQuery) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((book) => book.category === selectedCategory);
    }

    setFilteredBooks(result);
  }, [searchQuery, selectedCategory, books]);

  // Get unique categories from books
  const categories = ['all', ...Array.from(new Set(books.map((book) => book.category)))];

  // ============================================
  // RENDER COMPONENT
  // ============================================
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-gray-900 mb-2">Book Catalog</h1>
        <p className="text-gray-600">Browse and search our collection</p>
      </div>

      {/* ============================================
          SEARCH AND FILTERS
          ============================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-gray-700 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or author..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-gray-600 text-sm sm:text-base">
          Showing {filteredBooks.length} of {books.length} books
        </div>
      </div>

      {/* ============================================
          BOOKS GRID - Responsive layout
          ============================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedBook(book)}
          >
            {/* Book cover image */}
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              {/* Title and author */}
              <div className="text-gray-900 mb-1 line-clamp-2 min-h-[3rem]">{book.title}</div>
              <div className="text-gray-600 text-sm mb-2 truncate">{book.author}</div>
              
              {/* Category and year */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  {book.category}
                </span>
                <span className="text-xs text-gray-500">{book.published_year}</span>
              </div>
              
              {/* Availability */}
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600">
                  Available: {book.available}/{book.quantity}
                </div>
                {book.available > 0 ? (
                  <span className="text-green-600">In Stock</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================
          EMPTY STATE
          ============================================ */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-gray-900 mb-2">No books found</div>
          <div className="text-gray-600">Try adjusting your search or filters</div>
        </div>
      )}

      {/* ============================================
          BOOK DETAILS MODAL
          ============================================ */}
      {selectedBook && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6">
              {/* Modal header with close button */}
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <h2 className="text-gray-900">Book Details</h2>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Book details content - responsive layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Cover image */}
                <div className="flex justify-center md:block">
                  <img
                    src={selectedBook.cover_url}
                    alt={selectedBook.title}
                    className="w-48 md:w-full rounded-lg shadow-md"
                  />
                </div>

                {/* Book information */}
                <div className="md:col-span-2">
                  <h3 className="text-gray-900 mb-2">{selectedBook.title}</h3>
                  <div className="text-gray-600 mb-4">by {selectedBook.author}</div>

                  {/* Details table */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Category</span>
                      <span className="text-gray-900">{selectedBook.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">ISBN</span>
                      <span className="text-gray-900 text-sm sm:text-base">{selectedBook.isbn}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Published Year</span>
                      <span className="text-gray-900">{selectedBook.published_year}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Total Copies</span>
                      <span className="text-gray-900">{selectedBook.quantity}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Available</span>
                      <span className={selectedBook.available > 0 ? 'text-green-600' : 'text-red-600'}>
                        {selectedBook.available}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <div className="text-gray-700 mb-2">Description</div>
                    <p className="text-gray-600 text-sm sm:text-base">{selectedBook.description}</p>
                  </div>

                  {/* Availability status */}
                  <div className="mt-6">
                    {selectedBook.available > 0 ? (
                      <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-3 rounded-lg">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm sm:text-base">Available for borrowing</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-700 bg-red-50 px-4 py-3 rounded-lg">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm sm:text-base">Currently out of stock</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
