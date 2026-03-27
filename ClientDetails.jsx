import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Dumbbell, Utensils, Calendar, ClipboardList, CheckCircle2, TrendingUp, Target, Users } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/Card';
import SelectWorkoutModal from '../components/Trainer/SelectWorkoutModal';
import SelectDietModal from '../components/Trainer/SelectDietModal';
import ClientProgressChart from '../components/ClientProgressChart';
import { useAdmin } from '../contexts/AdminContext';

export default function ClientDetails() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { users, getUserById, updateUser, trainers } = useAdmin();

  const client = users.find(u => u.id === clientId);
  const assignedTrainer = trainers.find(t => t.id === client?.trainerId);

  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);

  if (!client) {
    return (
      <DashboardLayout role="trainer">
        <div className="text-center py-12 text-zinc-400">
          Client not found
        </div>
      </DashboardLayout>
    );
  }

  const handleAssignWorkout = (planData) => {
    updateUser(client.id, { assignedWorkout: planData });
  };

  const handleAssignDiet = (planData) => {
    updateUser(client.id, { assignedDiet: planData });
  };

  return (
    <DashboardLayout role="trainer">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <button
            onClick={() => navigate('/trainer/clients')}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Clients
          </button>
        </div>

        <Card className="relative overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-3xl font-black shadow-lg shadow-cyan-500/20">
                {client.name[0]}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-1">{client.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm mt-2">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <Target className="w-4 h-4 text-cyan-400" />
                    {client.goal || 'Fitness Goal'}
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    {client.progress || 0}% Completion
                  </span>
                </div>
              </div>
            </div>

            {assignedTrainer && (
              <div className="w-full lg:w-auto p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group hover:border-cyan-500/30 transition-all">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  <Users className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Assigned Trainer</p>
                  <p className="font-bold text-white group-hover:text-cyan-400 transition-colors">{assignedTrainer.name}</p>
                  <p className="text-xs text-zinc-500">{assignedTrainer.email}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Two columns: Assigned Plans and History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Assigned Plans */}
          <div className="space-y-6">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-cyan-400" />
                  Current Workout Plan
                </h3>
                <button
                  onClick={() => setIsWorkoutModalOpen(true)}
                  className="px-3 py-1.5 bg-cyan-400/10 border border-cyan-400/30 rounded-lg text-cyan-400 text-sm font-medium hover:bg-cyan-400/20 transition-colors"
                >
                  Assign New
                </button>
              </div>
              {client.assignedWorkout ? (
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="font-bold text-white">{client.assignedWorkout.name}</p>
                  <p className="text-sm text-zinc-400 mt-1">{client.assignedWorkout.description}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
                    <span>Duration: {client.assignedWorkout.duration}</span>
                    <span>Assigned: {new Date(client.assignedWorkout.assignedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-zinc-500">
                  No workout plan assigned yet.
                </div>
              )}
            </Card>

            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-purple-400" />
                  Current Diet Plan
                </h3>
                <button
                  onClick={() => setIsDietModalOpen(true)}
                  className="px-3 py-1.5 bg-purple-400/10 border border-purple-400/30 rounded-lg text-purple-400 text-sm font-medium hover:bg-purple-400/20 transition-colors"
                >
                  Assign New
                </button>
              </div>
              {client.assignedDiet ? (
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="font-bold text-white">{client.assignedDiet.name}</p>
                  <p className="text-sm text-zinc-400 mt-1">{client.assignedDiet.description}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
                    <span>Duration: {client.assignedDiet.duration}</span>
                    <span>Assigned: {new Date(client.assignedDiet.assignedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-zinc-500">
                  No diet plan assigned yet.
                </div>
              )}
            </Card>
          </div>

          {/* Plan History */}
          <Card>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-purple-400" />
              Assignment History
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
              <div className="text-center text-zinc-500 py-6">
                History tracking coming soon.
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Tracking */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Progress Overview
            </h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded-full text-xs text-cyan-400">
                Weight (kg)
              </span>
            </div>
          </div>
          
          {client.progressData && client.progressData.length > 0 ? (
            <ClientProgressChart 
              data={client.progressData} 
              metric="weight" 
              color="#22d3ee" 
            />
          ) : (
            <div className="p-8 text-center text-zinc-500 italic">
              No progress data available yet.
            </div>
          )}
        </Card>

        <SelectWorkoutModal
          isOpen={isWorkoutModalOpen}
          onClose={() => setIsWorkoutModalOpen(false)}
          onAssign={handleAssignWorkout}
        />
        <SelectDietModal
          isOpen={isDietModalOpen}
          onClose={() => setIsDietModalOpen(false)}
          onAssign={handleAssignDiet}
        />
      </div>
    </DashboardLayout>
  );
}