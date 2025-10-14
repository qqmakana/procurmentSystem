import React, { useState } from 'react';
import { User } from '../types';

interface AuthSystemProps {
  onLogin: (user: User) => void;
  onLogout: () => void;
  currentUser: User | null;
}

const AuthSystem: React.FC<AuthSystemProps> = ({ onLogin, onLogout, currentUser }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    role: 'Requester' as const
  });
  const [error, setError] = useState('');

  // Mock user database (in real app, this would be a backend API)
  const users = [
    {
      id: 'user-0',
      name: 'Solar Couple',
      email: 'solarcouple@gmail.com',
      password: 'q',
      role: 'Admin' as const,
      department: 'Administration',
      isActive: true,
      permissions: ['approve_all', 'admin_access', 'create_requisition', 'view_all_requisitions']
    },
    {
      id: 'user-1',
      name: 'Lebone',
      email: 'lebone@dm-mineralsgroup.com',
      password: 'password123',
      role: 'Finance' as const,
      department: 'Finance',
      isActive: true,
      permissions: ['approve_finance', 'view_all_requisitions']
    },
    {
      id: 'user-2',
      name: 'Sabelo Msiza',
      email: 'sabelo@dm-mineralsgroup.com',
      password: 'password123',
      role: 'COO' as const,
      department: 'Operations',
      isActive: true,
      permissions: ['approve_coo', 'view_all_requisitions']
    },
    {
      id: 'user-3',
      name: 'Joan',
      email: 'joan@dm-mineralsgroup.com',
      password: 'password123',
      role: 'CFO' as const,
      department: 'Finance',
      isActive: true,
      permissions: ['approve_cfo', 'view_all_requisitions']
    },
    {
      id: 'user-4',
      name: 'Doctor Motswadiri',
      email: 'doctor@dm-mineralsgroup.com',
      password: 'password123',
      role: 'CEO' as const,
      department: 'Executive',
      isActive: true,
      permissions: ['approve_all', 'admin_access']
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      onLogin(userWithoutPassword);
      setIsLoginOpen(false);
      setLoginForm({ email: '', password: '' });
    } else {
      setError('Invalid email or password');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Check if user already exists
    if (users.find(u => u.email === registerForm.email)) {
      setError('User with this email already exists');
      return;
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: registerForm.name,
      email: registerForm.email,
      role: registerForm.role,
      department: registerForm.department,
      isActive: true,
      permissions: ['create_requisition', 'view_own_requisitions']
    };

    // In real app, this would be sent to backend
    console.log('New user registered:', newUser);
    alert('Registration successful! Please login with your credentials.');
    setIsRegisterOpen(false);
    setRegisterForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      department: '',
      role: 'Requester'
    });
  };

  if (currentUser) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-white font-medium">{currentUser.name}</div>
          <div className="text-sm text-white/70">{currentUser.role} • {currentUser.department}</div>
        </div>
        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
          <span className="text-blue-300 font-semibold">
            {currentUser.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="btn-secondary text-sm px-4 py-2"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => setIsLoginOpen(true)}
        className="btn-primary"
      >
        Login
      </button>
      <button
        onClick={() => setIsRegisterOpen(true)}
        className="btn-secondary"
      >
        Register
      </button>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Login</h2>
              <button
                onClick={() => setIsLoginOpen(false)}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
              {error && (
                <div className="text-red-300 text-sm">{error}</div>
              )}
              <button
                type="submit"
                className="w-full btn-primary"
              >
                Login
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-white/70 text-sm">
                Demo accounts:<br/>
                <strong>solarcouple@gmail.com / q (Admin)</strong><br/>
                lebone@company.com / password123 (Finance)<br/>
                sabelo.msiza@company.com / password123 (COO)<br/>
                joan@company.com / password123 (CFO)<br/>
                doctor.motswadiri@company.com / password123 (CEO)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Register</h2>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Department</label>
                <input
                  type="text"
                  value={registerForm.department}
                  onChange={(e) => setRegisterForm({...registerForm, department: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your department"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Role</label>
                <select
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm({...registerForm, role: e.target.value as any})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Requester">Requester</option>
                  <option value="Finance">Finance</option>
                  <option value="COO">COO</option>
                  <option value="CFO">CFO</option>
                  <option value="CEO">CEO</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm your password"
                  required
                />
              </div>
              {error && (
                <div className="text-red-300 text-sm">{error}</div>
              )}
              <button
                type="submit"
                className="w-full btn-primary"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthSystem;
