import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const initialTasks = [
  { id: 1, text: 'Morning Jog (30 mins)', completed: false },
  { id: 2, text: 'Drink 2L Water', completed: true },
  { id: 3, text: 'Strength Training', completed: false },
];

const Checklist = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <motion.div
          key={task.id}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => toggleTask(task.id)}
          className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
            task.completed
              ? 'bg-cyan-400/10 border border-cyan-400/30'
              : 'glass-panel border-cyan-400/20 shadow-[0_4px_20px_rgba(34,211,238,0.05)]'
          }`}
          style={task.completed ? { animation: 'pulse-cyan 2s infinite' } : {}}
        >
          <motion.div
            layout
            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
              task.completed 
                ? 'bg-cyan-400 border-cyan-400' 
                : 'border-gray-500 bg-transparent'
            }`}
          >
            {task.completed && <Check className="w-4 h-4 text-darkBg" />}
          </motion.div>
          
          <span className={`flex-1 text-sm font-medium transition-all ${
            task.completed ? 'text-gray-500 line-through' : 'text-gray-200'
          }`}>
            {task.text}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default Checklist;
