import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface UserManagementProps {
  users: User[];
  currentUser: User;
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  currentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Requester' as UserRole,
    department: '',
    isActive: true,
    permissions: [] as string[]
  });

  const roleHierarchy: Record<UserRole, number> = {
    'Requester': 1,
    'Finance': 2,
    'COO': 3,
    'CFO': 4,
    'CEO': 5,
    'Admin': 6
  };

  const canManageUser = (targetUser: User): boolean => {
    if (currentUser.role === 'Admin') return true;
    return roleHierarchy[currentUser.role] > roleHierarchy[targetUser.role];
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      alert('Please fill in all required fields');
      return;
    }
    
    onAddUser(newUser);
    setNewUser({
      name: '',
      email: '',
      role: 'Requester',
      department: '',
      isActive: true,
      permissions: []
    });
    setShowAddForm(false);
  };

  const getRoleColor = (role: UserRole): string => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'CEO':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'CFO':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'COO':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Finance':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Requester':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-white/70">Manage system users and permissions</p>
        </div>
        {currentUser.role === 'Admin' && (
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            ➕ Add User
          </button>
        )}
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="bg-white/5 border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Add New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Name *</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Email *</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Requester">Requester</option>
                <option value="Finance">Finance</option>
                <option value="COO">COO</option>
                <option value="CFO">CFO</option>
                <option value="CEO">CEO</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Department</label>
              <input
                type="text"
                value={newUser.department}
                onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter department..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              className="btn-primary"
            >
              Add User
            </button>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          System Users ({users.length})
        </h3>
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white/10 border border-white/20 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-300 font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{user.name}</div>
                    <div className="text-sm text-white/70">{user.email}</div>
                    <div className="text-sm text-white/60">{user.department}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user.role)}`}>
                    {user.role}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    user.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </div>
                  
                  {canManageUser(user) && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingUser(user.id)}
                        className="btn-secondary text-xs px-3 py-1"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                            onDeleteUser(user.id);
                          }
                        }}
                        className="btn-danger text-xs px-3 py-1"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Edit Form */}
              {editingUser === user.id && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Name</label>
                      <input
                        type="text"
                        value={user.name}
                        onChange={(e) => onUpdateUser(user.id, { name: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) => onUpdateUser(user.id, { email: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Role</label>
                      <select
                        value={user.role}
                        onChange={(e) => onUpdateUser(user.id, { role: e.target.value as UserRole })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Requester">Requester</option>
                        <option value="Finance">Finance</option>
                        <option value="COO">COO</option>
                        <option value="CFO">CFO</option>
                        <option value="CEO">CEO</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Department</label>
                      <input
                        type="text"
                        value={user.department}
                        onChange={(e) => onUpdateUser(user.id, { department: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => setEditingUser(null)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setEditingUser(null)}
                      className="btn-primary"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

