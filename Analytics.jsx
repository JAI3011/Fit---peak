import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Users, Activity } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card';
import { useAdmin } from '../../contexts/AdminContext';

const Analytics = () => {
  const { 
    users, 
    getUserGrowthData, 
    getActiveUsersData, 
    getWorkoutLogsData 
  } = useAdmin();

  const [timeRange, setTimeRange] = useState('week');

  const userGrowthData = useMemo(() => getUserGrowthData(), [users]);
  const activeUsersData = useMemo(() => getActiveUsersData(), [users]);
  const workoutLogsData = useMemo(() => getWorkoutLogsData(), [users]);

  // Derived Summary Stats
  const totalUsers = users.length;
  const activeNow = activeUsersData[activeUsersData.length - 1]?.active || 0;
  const totalLogs = workoutLogsData.reduce((acc, curr) => acc + curr.logs, 0);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-zinc-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm outline-none focus:border-cyan-400"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last month</option>
              <option value="year">Last year</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-400">+100% Growth</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Active Users (7d)</p>
                <p className="text-2xl font-bold">{activeNow}</p>
                <p className="text-xs text-green-400">Real-time status</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Workouts Logged</p>
                <p className="text-2xl font-bold">{totalLogs}</p>
                <p className="text-xs text-green-400">Total Sessions</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">User Growth</h3>
            <div className="h-[300px]">
              {userGrowthData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
                    <XAxis dataKey="month" stroke="#52525b" axisLine={false} tickLine={false} />
                    <YAxis stroke="#52525b" axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                      labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Line type="monotone" dataKey="users" stroke="#22d3ee" strokeWidth={3} dot={{ fill: '#22d3ee', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-500 italic">No growth data available</div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Active Users (Daily)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeUsersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
                  <XAxis dataKey="day" stroke="#52525b" axisLine={false} tickLine={false} />
                  <YAxis stroke="#52525b" axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="active" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-bold mb-4">Workout Logs</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={workoutLogsData}>
                  <defs>
                    <linearGradient id="colorLogs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
                  <XAxis dataKey="day" stroke="#52525b" axisLine={false} tickLine={false} />
                  <YAxis stroke="#52525b" axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="logs" stroke="#22d3ee" fill="url(#colorLogs)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;