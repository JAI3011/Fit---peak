import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Edit, Trash2, UserX, UserCheck, MoreVertical } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card';
import UserEditModal from '../../components/Admin/UserEditModal';
import { useAdmin } from '../../contexts/AdminContext';

const UserManagement = () => {
  const { users, trainers, updateUser, deleteUser, toggleUserStatus } = useAdmin();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                          user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSave = (updatedUser) => {
    updateUser(updatedUser.id, updatedUser);
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">User Management</h1>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="trainer">Trainers</option>
              <option value="admin">Admins</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="p-4 text-xs font-bold uppercase text-zinc-400">ID</th>
                <th className="p-4 text-xs font-bold uppercase text-zinc-400">User</th>
                <th className="p-4 text-xs font-bold uppercase text-zinc-400">Role</th>
                <th className="p-4 text-xs font-bold uppercase text-zinc-400">Status</th>
                <th className="p-4 text-xs font-bold uppercase text-zinc-400">Joined</th>
                <th className="p-4 text-xs font-bold uppercase text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 text-sm text-zinc-400">#{user.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-sm font-bold">
                        {user.name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-xs text-zinc-500">{user.email}</div>
                        {user.trainerId && (
                          <div className="text-[10px] text-cyan-400">
                            Trainer: {trainers.find(t => t.id === user.trainerId)?.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      user.role === 'admin' ? 'bg-fuchsia-500/20 text-fuchsia-400' :
                      user.role === 'trainer' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`flex items-center gap-2 ${
                      user.status === 'active' ? 'text-green-400' :
                      user.status === 'inactive' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        user.status === 'active' ? 'bg-green-400' :
                        user.status === 'inactive' ? 'bg-red-400' :
                        'bg-yellow-400 animate-pulse'
                      }`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-zinc-400">{user.joined}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-zinc-400" />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title={user.status === 'active' ? 'Suspend' : 'Activate'}
                      >
                        {user.status === 'active' ? (
                          <UserX className="w-4 h-4 text-red-400" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-green-400" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </Card>

        <UserEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={editingUser}
          onSave={handleSave}
          trainers={trainers}
        />
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;