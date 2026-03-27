import React, { useState, useEffect } from 'react';
import { useFitness } from '../context/FitnessContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Play, Info, Calendar as CalendarIcon, Award, User, Plus, Dumbbell } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/Card';

const schedule = [
  { day: 'Mon', focus: 'Chest', status: 'done' },
  { day: 'Tue', focus: 'Back', status: 'done' },
  { day: 'Wed', focus: 'Rest', status: 'rest' },
  { day: 'Thu', focus: 'Legs', status: 'today' },
  { day: 'Fri', focus: 'Shoulder', status: 'pending' },
  { day: 'Sat', focus: 'Arms', status: 'pending' },
  { day: 'Sun', focus: 'Rest', status: 'rest' },
];

const initialExercises = [
  { 
    id: '1', 
    name: 'Squats', 
    sets: 4, 
    reps: 12, 
    setsData: [
      { weight: 60, completed: true },
      { weight: 65, completed: true },
    ]
  },
  { 
    id: '2', 
    name: 'Leg Press', 
    sets: 3, 
    reps: 15, 
    setsData: []
  },
  { 
    id: '3', 
    name: 'Lunges', 
    sets: 3, 
    reps: 10, 
    setsData: []
  },
];

const normalizeExercises = (exercises) =>
  exercises.map((ex, i) => ({
    ...ex,
    id: ex.id ? String(ex.id) : String(i + 1),
    setsData: ex.setsData || [],
  }));

const Workouts = () => {
  const { addProgress, user } = useFitness();
  const [exercises, setExercises] = useState(
    normalizeExercises(user?.assignedWorkout?.exercises || initialExercises)
  );
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);

  // Synchronize exercises if user.assignedWorkout changes
  useEffect(() => {
    if (user?.assignedWorkout?.exercises) {
      setExercises(normalizeExercises(user.assignedWorkout.exercises));
    }
  }, [user?.assignedWorkout]);

  const trainer = user?.trainerName || "Trainer";
  const workoutName = user?.assignedWorkout?.name || "Legs Day";
  const workoutFocus = user?.assignedWorkout?.focus || "Strength & Power";

  const logSet = (id) => {
    const weight = window.prompt("Enter weight (kg):", "60");
    if (weight === null) return;

    setExercises(exercises.map(ex => {
      const setsData = ex.setsData || [];
      if (ex.id === id && setsData.length < ex.sets) {
        addProgress(2); // Global progress sync
        return {
          ...ex,
          setsData: [...setsData, { weight: parseFloat(weight) || 0, completed: true }]
        };
      }
      return ex;
    }));
  };

  const handleCompleteWorkout = () => {
    if (!isWorkoutComplete) {
      addProgress(10); // Big boost for finishing
      setIsWorkoutComplete(true);
    }
  };

  return (
    <DashboardLayout role="user">
      <div className="flex-1 space-y-8 pb-10">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 relative overflow-hidden"
        >
          <div className="relative z-10">
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Award className="text-cyan-400 w-8 h-8" /> My Workout Program
            </h1>
            <div className="flex items-center gap-2 mt-2 text-zinc-400">
              <User className="w-4 h-4" />
              <span className="text-sm">Assigned by: <span className="text-white font-bold">{trainer}</span></span>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full -mr-20 -mt-20" />
        </motion.div>

        {/* WEEKLY SCHEDULE */}
        <section>
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold flex items-center gap-2">
               <CalendarIcon className="w-5 h-5 text-purple-400" /> This Week's Schedule
             </h2>
             <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">Read-Only</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {schedule.map((item, i) => (
              <div 
                key={i}
                className={`glass p-4 text-center border transition-all ${
                  item.status === 'today' ? 'border-cyan-400/50 bg-cyan-400/5 shadow-[0_0_20px_rgba(34,211,238,0.1)]' :
                  item.status === 'done' ? 'border-green-400/20 opacity-60' :
                  'border-white/5 opacity-40'
                }`}
              >
                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">{item.day}</p>
                <p className={`text-sm font-bold ${item.status === 'today' ? 'text-cyan-400' : 'text-zinc-300'}`}>{item.focus}</p>
                <div className="mt-2 flex justify-center">
                  {item.status === 'done' && <Check className="w-4 h-4 text-green-400" />}
                  {item.status === 'today' && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                  {item.status === 'rest' && <div className="text-[10px] text-zinc-600">—</div>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TODAY'S WORKOUT */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-black text-white">🔥 Today: {workoutName}</h2>
                <p className="text-zinc-500 text-sm">Target: {workoutFocus}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-5 py-2.5 rounded-xl bg-white/5 text-xs font-bold hover:bg-red-500/10 hover:text-red-400 transition-all uppercase tracking-wider border border-white/5">Skip Today</button>
                <button 
                  onClick={handleCompleteWorkout}
                  className="neon-btn px-6 py-2.5 text-xs"
                >
                  {isWorkoutComplete ? 'Workout Logged ✓' : 'Mark Workout Complete'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {exercises.map((ex) => (
                <Card key={ex.id} className={`group border-transparent hover:border-cyan-400/20 transition-all ${(ex.setsData?.length ?? 0) === ex.sets ? 'opacity-60' : ''}`}>
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-lg ${ex.setsData.length === ex.sets ? 'bg-green-500/20' : 'bg-gradient-to-br from-cyan-400 to-blue-500'}`}>
                            {ex.setsData.length === ex.sets ? <Check className="w-4 h-4 text-green-400" /> : <Play className="w-4 h-4 text-white fill-white" />}
                         </div>
                         <div>
                            <h3 className="text-lg font-bold">{ex.name}</h3>
                            <p className="text-zinc-500 text-xs">{ex.sets} sets × {ex.reps} reps</p>
                         </div>
                      </div>
                      <span className="text-[10px] font-black text-zinc-600 bg-white/5 px-2 py-0.5 rounded uppercase tracking-tighter">
                        ({(ex.setsData?.length ?? 0)}/{ex.sets} completed)
                      </span>
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="flex gap-1">
                      {[...Array(ex.sets)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-2 flex-1 rounded-full transition-all duration-700 ${
                            i < (ex.setsData?.length ?? 0) ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'bg-white/5'
                          }`}
                        />
                      ))}
                    </div>

                    {/* DETAILED SETS LOG */}
                     <div className="flex flex-wrap gap-2">
                        {(ex.setsData || []).map((set, i) => (
                          <div key={i} className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl">
                             <Check className="w-3 h-3 text-green-400" />
                             <span className="text-xs font-bold text-green-400">Set {i+1}: {set.weight}kg</span>
                          </div>
                        ))}
                       
                       {(ex.setsData?.length ?? 0) < ex.sets && (
                         <button 
                           onClick={() => logSet(ex.id)}
                           className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/10 px-4 py-1.5 rounded-xl transition-all"
                         >
                           <Plus className="w-3 h-3 text-cyan-400" />
                           <span className="text-xs font-bold text-zinc-300">Log Set {ex.setsData.length + 1}</span>
                         </button>
                       )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* ASIDE / HISTORY */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" /> Trainer's Note
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                "Focus on the <span className="text-cyan-400">eccentric phase</span> of the squat today. 3 seconds down, explosive on the way up. Don't sacrifice form for weight!"
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3 text-xs">
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <span className="text-zinc-500 italic">— {trainer}</span>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-4 uppercase tracking-tighter">📊 Workout History</h3>
              <div className="space-y-3">
                {[
                  { label: 'Week 1', val: '4/5', status: 'done' },
                  { label: 'Week 2', val: '5/5', status: 'done' },
                  { label: 'Week 3', val: '3/5', status: 'current' },
                ].map((week, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/2">
                      <div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase">{week.label}</p>
                        <p className="font-bold text-sm text-white">{week.val} <span className="text-zinc-500 font-normal">Workouts</span></p>
                      </div>
                      <div className="flex gap-1">
                        {week.status === 'done' ? <Check className="w-4 h-4 text-green-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
                      </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
};

export default Workouts;
