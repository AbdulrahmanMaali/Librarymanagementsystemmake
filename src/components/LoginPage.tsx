import { useState } from 'react';
import type { User } from '../App';
import { mockUsers, initializeMockData } from '../utils/mockData';

// ============================================
// LOGIN PAGE COMPONENT
// ============================================
// Handles user authentication, registration, and password reset

type LoginPageProps = {
  onLogin: (user: User) => void; // Callback when login succeeds
};

export function LoginPage({ onLogin }: LoginPageProps) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // UI state
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  // Registration form state
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regFullName, setRegFullName] = useState('');

  // Initialize mock data on component mount
  useState(() => {
    initializeMockData();
  });

  // ============================================
  // LOGIN HANDLER
  // ============================================
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Get users from localStorage
    const usersData = localStorage.getItem('library_users');
    const users = usersData ? JSON.parse(usersData) : mockUsers;

    // Find matching user
    const user = users.find(
      (u: any) => u.username === username && u.password === password
    );

    if (user) {
      // Remove password before passing to parent
      const { password: _, ...userWithoutPassword } = user;
      onLogin(userWithoutPassword);
    } else {
      setError('Invalid username or password');
    }
  };

  // ============================================
  // PASSWORD RESET HANDLER
  // ============================================
  
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (resetEmail) {
      // In production, this would send an email via backend
      setSuccess('Password reset link has been sent to your email');
      setTimeout(() => {
        setShowResetPassword(false);
        setSuccess('');
        setResetEmail('');
      }, 2000);
    } else {
      setError('Please enter your email address');
    }
  };

  // ============================================
  // REGISTRATION HANDLER
  // ============================================
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate all fields are filled
    if (!regUsername || !regPassword || !regEmail || !regFullName) {
      setError('All fields are required');
      return;
    }

    // Get existing users
    const usersData = localStorage.getItem('library_users');
    const users = usersData ? JSON.parse(usersData) : mockUsers;

    // Check if username already exists
    if (users.find((u: any) => u.username === regUsername)) {
      setError('Username already exists');
      return;
    }

    // Create new user (students only, admins must be created manually)
    const newUser = {
      id: `user-${Date.now()}`,
      username: regUsername,
      password: regPassword,
      email: regEmail,
      full_name: regFullName,
      role: 'student' as const,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('library_users', JSON.stringify(users));

    setSuccess('Registration successful! You can now login.');
    setTimeout(() => {
      setShowRegister(false);
      setUsername(regUsername);
      setRegUsername('');
      setRegPassword('');
      setRegEmail('');
      setRegFullName('');
      setSuccess('');
    }, 2000);
  };

  // ============================================
  // PASSWORD RESET VIEW
  // ============================================
  
  if (showResetPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="text-gray-900 text-center mb-2">Reset Password</h2>
            <p className="text-gray-600 text-sm sm:text-base">Enter your email to receive a reset link</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleResetPassword}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 text-sm sm:text-base">Email Address</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="your.email@example.com"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors mb-4 text-sm sm:text-base"
            >
              Send Reset Link
            </button>

            <button
              type="button"
              onClick={() => {
                setShowResetPassword(false);
                setError('');
                setSuccess('');
              }}
              className="w-full text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================
  // REGISTRATION VIEW
  // ============================================
  
  if (showRegister) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-gray-900 text-center mb-2">Create Account</h2>
            <p className="text-gray-600 text-sm sm:text-base">Register as a new student</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-sm">Full Name</label>
              <input
                type="text"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="John Doe"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-sm">Email</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="john@example.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-sm">Username</label>
              <input
                type="text"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="johndoe"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 text-sm">Password</label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors mb-4 text-sm sm:text-base"
            >
              Register
            </button>

            <button
              type="button"
              onClick={() => {
                setShowRegister(false);
                setError('');
                setSuccess('');
              }}
              className="w-full text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
            >
              Already have an account? Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================
  // LOGIN VIEW (DEFAULT)
  // ============================================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
        {/* Logo and title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-gray-900 mb-2">Library Management System</h1>
          <p className="text-gray-600 text-sm sm:text-base">Sign in to your account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowResetPassword(true)}
            className="text-blue-600 hover:text-blue-700 mb-4 block text-sm"
          >
            Forgot password?
          </button>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors mb-4 text-sm sm:text-base"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => setShowRegister(true)}
            className="w-full text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
          >
            Don&apos;t have an account? Register
          </button>
        </form>

        {/* Demo accounts */}
        <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-center mb-2 text-sm">Demo Accounts:</p>
          <div className="space-y-2 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-gray-900 text-xs sm:text-sm">Admin: admin / admin123</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-gray-900 text-xs sm:text-sm">Student: student1 / student123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
