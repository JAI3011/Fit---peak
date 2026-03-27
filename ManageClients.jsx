// src/pages/ManageClients.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Users } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/Card';
import ClientCard from '../components/ClientCard';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../context/AuthContext';

export default function ManageClients() {
  const { users } = useAdmin();
  const { user: authUser } = useAuth(); // current logged-in trainer
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGoal, setFilterGoal] = useState('All');

  console.log('=== ManageClients Debug ===');
  console.log('Current trainer user:', authUser);
  console.log('All users:', users);

  // Filter clients using strict equality (IDs standardized as strings)
  const clients = users.filter(u => 
    u.role === 'user' && u.trainerId === authUser?.id
  );

  console.log('Assigned clients:', clients);

  // For demo, we also need to ensure that the client objects have the expected fields (name, avatar, goal, progress, lastActive)
  // You can add those fields to the user objects in AdminContext, or derive them.
  // For now, we'll add a mapping to ensure ClientCard works.

  const enrichedClients = clients.map(client => ({
    ...client,
    avatar: client.name?.[0] || 'U',
    goal: client.goal || 'Fitness Goal',
    progress: client.progress || 0,
    lastActive: client.lastActive || 'Recently',
    adherence: client.adherence || 85,
    workoutsThisWeek: client.workoutsThisWeek || 3,
    mealsLogged: client.mealsLogged || 70,
  }));

  const goals = ["All", "Muscle Gain", "Weight Loss", "Athletic Performance", "Maintenance"];

  const filteredClients = enrichedClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGoal = filterGoal === "All" || client.goal === filterGoal;
    return matchesSearch && matchesGoal;
  });

  return (
    <DashboardLayout role="trainer">
      <div className="flex-1 space-y-6">
        
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Users className="w-7 h-7 text-cyan-400" />
              Manage Clients
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              {filteredClients.length} clients • {clients.filter(c => c.adherence >= 80).length} highly engaged
            </p>
          </div>
        </motion.div>

        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clients..."
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-zinc-500" />
              <select
                value={filterGoal}
                onChange={(e) => setFilterGoal(e.target.value)}
                className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-all cursor-pointer"
              >
                {goals.map(goal => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {filteredClients.length > 0 ? (
            filteredClients.map(client => (
              <ClientCard key={client.id} client={client} />
            ))
          ) : (
            <Card className="text-center py-12">
              <p className="text-zinc-400">No clients assigned to you yet.</p>
              <p className="text-xs text-zinc-500 mt-2">Admins can assign trainers to users from the user management panel.</p>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}