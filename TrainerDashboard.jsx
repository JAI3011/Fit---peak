// src/pages/TrainerDashboard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Activity, TrendingUp, MessageSquare, Calendar, Award, Target } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import ClientCard from "../components/ClientCard";
import { useAdmin } from "../contexts/AdminContext";
import { useAuth } from "../context/AuthContext";

export default function TrainerDashboard() {
  const { users = [] } = useAdmin();
  const { user: authUser } = useAuth();

  // Debugging auth state
  console.log('Current trainer user:', authUser);

  if (!authUser) {
    return (
      <DashboardLayout role="trainer">
        <div className="text-white p-6">Loading trainer data... please wait.</div>
      </DashboardLayout>
    );
  }

  const trainerName = authUser.name || "Trainer";

  // Get only users assigned to this trainer
  const assignedClients = (users || []).filter(u => 
    u.role === 'user' && u.trainerId === authUser?.id
  );

  // Enrich clients for display (if needed)
  const enrichedClients = assignedClients.map(client => ({
    ...client,
    avatar: client.name?.[0] || 'U',
    goal: client.goal || 'Fitness Goal',
    progress: client.progress || 0,
    lastActive: client.lastActive || 'Recently',
    adherence: client.adherence || 85,
    workoutsThisWeek: client.workoutsThisWeek || 3,
    mealsLogged: client.mealsLogged || 70,
  }));

  const trainer = {
    name: trainerName,
    clients: assignedClients.length,
    activePrograms: assignedClients.filter(c => c.assignedWorkout || c.assignedDiet).length,
    rating: 4.8
  };

  const stats = [
    { label: "Total Clients", value: trainer.clients, icon: Users, color: "cyan" },
    { label: "Active Programs", value: trainer.activePrograms, icon: Activity, color: "purple" },
    { label: "Avg. Adherence", value: "87%", icon: TrendingUp, color: "green" },
    { label: "Rating", value: "4.8⭐", icon: Award, color: "yellow" }
  ];

  const pendingTasks = [
    { id: 1, client: "Jaysmin Patel", task: "Review progress photos", priority: "high" },
    { id: 2, client: "Rohan Mehta", task: "Update meal plan", priority: "medium" },
    { id: 3, client: "Priya Singh", task: "Adjust workout intensity", priority: "low" }
  ];

  return (
    <DashboardLayout role="trainer">
      <div className="flex-1 space-y-6">
        
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-2xl font-semibold">
              Welcome back, <span className="text-cyan-400">{trainer.name}</span>
            </h1>
            <p className="text-zinc-400 text-sm">
              Manage your clients and programs 💪
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <button
              className="p-2 bg-zinc-700/50 rounded-xl cursor-not-allowed opacity-60"
              title="Chat feature coming soon"
            >
              <MessageSquare className="w-5 h-5 text-zinc-400" />
            </button>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              Schedule
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Active Clients
                </h2>
                <button className="text-cyan-400 text-sm hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {enrichedClients.slice(0, 3).map(client => (
                  <ClientCard key={client.id} client={client} />
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <QuickActionButton
                  icon={<Activity className="w-5 h-5" />}
                  label="Create Workout"
                  color="cyan"
                />
                <QuickActionButton
                  icon={<Target className="w-5 h-5" />}
                  label="Create Diet Plan"
                  color="purple"
                />
                <QuickActionButton
                  icon={<MessageSquare className="w-5 h-5" />}
                  label="Message Clients"
                  color="green"
                />
                <QuickActionButton
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="View Analytics"
                  color="orange"
                />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                📋 Pending Tasks
              </h2>
              <div className="space-y-3">
                {pendingTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-bold mb-4">This Week</h2>
              <div className="space-y-3">
                <SummaryItem label="Clients Trained" value={`${assignedClients.length}/${assignedClients.length}`} percentage={100} />
                <SummaryItem label="Programs Created" value="3" percentage={75} />
                <SummaryItem label="Avg. Client Adherence" value="87%" percentage={87} />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
              <div className="text-center">
                <div className="text-4xl mb-2">🏆</div>
                <h3 className="font-bold text-yellow-400 mb-1">Top Trainer</h3>
                <p className="text-xs text-zinc-400">Highest client satisfaction this month!</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// STAT CARD COMPONENT
function StatCard({ stat }) {
  const colorClasses = {
    cyan: "from-cyan-500 to-cyan-600 shadow-cyan-500/20",
    purple: "from-purple-500 to-purple-600 shadow-purple-500/20",
    green: "from-green-500 to-green-600 shadow-green-500/20",
    yellow: "from-yellow-500 to-orange-500 shadow-yellow-500/20"
  };

  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[stat.color]} shadow-lg`}>
          <stat.icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-zinc-400">{stat.label}</p>
          <p className="text-2xl font-bold">{stat.value}</p>
        </div>
      </div>
    </Card>
  );
}

// QUICK ACTION BUTTON
function QuickActionButton({ icon, label, color }) {
  const colorClasses = {
    cyan: "from-cyan-500/10 to-cyan-600/10 border-cyan-500/30 hover:border-cyan-500/50",
    purple: "from-purple-500/10 to-purple-600/10 border-purple-500/30 hover:border-purple-500/50",
    green: "from-green-500/10 to-green-600/10 border-green-500/30 hover:border-green-500/50",
    orange: "from-orange-500/10 to-orange-600/10 border-orange-500/30 hover:border-orange-500/50"
  };

  return (
    <button className={`p-4 rounded-xl border bg-gradient-to-br ${colorClasses[color]} transition-all hover:scale-105 w-full`}>
      <div className="flex flex-col items-center gap-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
    </button>
  );
}

// TASK ITEM
function TaskItem({ task }) {
  const priorityColors = {
    high: "bg-red-500/10 text-red-400 border-red-500/30",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    low: "bg-green-500/10 text-green-400 border-green-500/30"
  };

  return (
    <div className="p-3 bg-white/5 rounded-lg border border-zinc-800 hover:border-cyan-500/30 transition-all">
      <div className="flex justify-between items-start gap-2">
        <div>
          <p className="text-sm font-medium">{task.task}</p>
          <p className="text-xs text-zinc-500">{task.client}</p>
        </div>
        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
    </div>
  );
}

// SUMMARY ITEM
function SummaryItem({ label, value, percentage }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-zinc-400">{label}</span>
        <span className="text-sm font-bold">{value}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
        />
      </div>
    </div>
  );
}