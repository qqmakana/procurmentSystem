import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string, name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const users = [
    { email: 'solarcouple@gmail.com', password: '123', name: 'Solar Couple' },
    { email: 'joan@dm-mineralsgroup.com', password: '123', name: 'Joan Rinomhota' },
    { email: 'sabelo@dm-mineralsgroup.com', password: '123', name: 'Sabelo Msiza' },
    { email: 'lebone@dm-mineralsgroup.com', password: '123', name: 'Lebone Marule' },
    { email: 'doctor@dm-mineralsgroup.com', password: '123', name: 'Doctor Motswadiri' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a brief loading state for better UX
    setTimeout(() => {
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        onLogin(user.email, user.name);
      } else {
        setError('Invalid email or password. Please try again.');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
      </div>
      
      <div className="max-w-md w-full relative">
        <div className="bg-black border-2 border-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl animate-float">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-black text-center text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-center text-white font-medium mb-8">
              Sign in to access Procurement Tracker
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500 rounded-xl">
                <p className="text-red-500 text-sm font-semibold text-center">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-white mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="your.email@dm-mineralsgroup.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-white mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Info */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-center text-sm text-white font-medium">
                🔒 Secure access for authorized users only
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white font-medium mt-6">
          DM Minerals Group • Procurement System
        </p>
      </div>
    </div>
  );
};

export default Login;

