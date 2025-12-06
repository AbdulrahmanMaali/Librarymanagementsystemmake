import { useState, useEffect } from 'react';
import { getBooks, getBorrowRecords, getUsers } from '../utils/mockData';

export function ReportsPage() {
  const [mostBorrowedBooks, setMostBorrowedBooks] = useState<any[]>([]);
  const [monthlyActivity, setMonthlyActivity] = useState<any[]>([]);
  const [inventoryStatus, setInventoryStatus] = useState<any[]>([]);

  useEffect(() => {
    generateReports();
  }, []);

  const generateReports = () => {
    const books = getBooks();
    const records = getBorrowRecords();
    const users = getUsers();

    // Most Borrowed Books
    const borrowCounts: { [key: string]: number } = {};
    records.forEach((record: any) => {
      borrowCounts[record.book_id] = (borrowCounts[record.book_id] || 0) + 1;
    });

    const mostBorrowed = Object.entries(borrowCounts)
      .map(([bookId, count]) => {
        const book = books.find((b: any) => b.id === bookId);
        return { book, count };
      })
      .filter((item) => item.book)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setMostBorrowedBooks(mostBorrowed);

    // Monthly Activity (last 6 months)
    const monthlyData: { [key: string]: { borrowed: number; returned: number } } = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[monthKey] = { borrowed: 0, returned: 0 };
    }

    records.forEach((record: any) => {
      const borrowDate = new Date(record.borrow_date);
      const monthKey = borrowDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      if (monthlyData[monthKey]) {
        monthlyData[monthKey].borrowed += 1;
      }

      if (record.return_date) {
        const returnDate = new Date(record.return_date);
        const returnMonthKey = returnDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (monthlyData[returnMonthKey]) {
          monthlyData[returnMonthKey].returned += 1;
        }
      }
    });

    const monthlyArray = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
    }));

    setMonthlyActivity(monthlyArray);

    // Inventory Status
    const inventory = books.map((book: any) => ({
      ...book,
      borrowed: book.quantity - book.available,
      utilization: ((book.quantity - book.available) / book.quantity) * 100,
    }));

    setInventoryStatus(inventory);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">View library statistics and insights</p>
      </div>

      {/* Most Borrowed Books */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Most Borrowed Books</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {mostBorrowedBooks.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No data available</div>
          ) : (
            mostBorrowedBooks.map((item, index) => (
              <div key={item.book.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <img
                    src={item.book.cover_url}
                    alt={item.book.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="text-gray-900 mb-1">{item.book.title}</div>
                    <div className="text-gray-600 text-sm">{item.book.author}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl text-gray-900">{item.count}</div>
                    <div className="text-gray-600 text-sm">borrows</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Monthly Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Monthly Activity (Last 6 Months)</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700">Month</th>
                  <th className="px-4 py-3 text-left text-gray-700">Borrowed</th>
                  <th className="px-4 py-3 text-left text-gray-700">Returned</th>
                  <th className="px-4 py-3 text-left text-gray-700">Net Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {monthlyActivity.map((month) => (
                  <tr key={month.month} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{month.month}</td>
                    <td className="px-4 py-3 text-blue-600">{month.borrowed}</td>
                    <td className="px-4 py-3 text-green-600">{month.returned}</td>
                    <td
                      className={`px-4 py-3 ${
                        month.borrowed - month.returned > 0 ? 'text-orange-600' : 'text-green-600'
                      }`}
                    >
                      {month.borrowed - month.returned > 0 ? '+' : ''}
                      {month.borrowed - month.returned}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Visual Chart */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="space-y-2">
              {monthlyActivity.map((month) => {
                const maxValue = Math.max(...monthlyActivity.map((m) => Math.max(m.borrowed, m.returned)));
                return (
                  <div key={month.month}>
                    <div className="text-gray-700 text-sm mb-1">{month.month}</div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="bg-blue-500 h-6 rounded"
                            style={{ width: `${(month.borrowed / maxValue) * 100}%` }}
                          />
                          <span className="text-sm text-gray-600">{month.borrowed}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="bg-green-500 h-6 rounded"
                            style={{ width: `${(month.returned / maxValue) * 100}%` }}
                          />
                          <span className="text-sm text-gray-600">{month.returned}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-6 mt-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span className="text-gray-600 text-sm">Borrowed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span className="text-gray-600 text-sm">Returned</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Tracking */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Inventory Status</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700">Book</th>
                  <th className="px-4 py-3 text-left text-gray-700">Total</th>
                  <th className="px-4 py-3 text-left text-gray-700">Available</th>
                  <th className="px-4 py-3 text-left text-gray-700">Borrowed</th>
                  <th className="px-4 py-3 text-left text-gray-700">Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inventoryStatus.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={book.cover_url} alt={book.title} className="w-8 h-10 object-cover rounded" />
                        <div>
                          <div className="text-gray-900">{book.title}</div>
                          <div className="text-gray-600 text-sm">{book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{book.quantity}</td>
                    <td className="px-4 py-3 text-green-600">{book.available}</td>
                    <td className="px-4 py-3 text-blue-600">{book.borrowed}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className={`h-2 rounded-full ${
                              book.utilization > 80
                                ? 'bg-red-500'
                                : book.utilization > 50
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${book.utilization}%` }}
                          />
                        </div>
                        <span className="text-gray-600 text-sm">{book.utilization.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
