import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useAdmin } from '../contexts/AdminContext';

const FitnessContext = createContext();

export const FitnessProvider = ({ children }) => {
  const { user: authUser } = useAuth();
  const { users, trainers, updateUser: syncToGlobal } = useAdmin();

  // 🔥 SINGLE SOURCE OF TRUTH: Derive current user from global Admin store
  const user = React.useMemo(() => {
    if (!authUser) return null;
    
    const currentUser = users.find(u => 
      String(u.id) === String(authUser.id) || String(u.email) === String(authUser.email)
    );

    if (!currentUser) {
      // Return a safe fallback object if user isn't in global store yet
      return {
        name: authUser.name || "Guest",
        role: authUser.role || "user",
        email: authUser.email,
        caloriesGoal: 2400,
        caloriesConsumed: 0,
        macros: { protein: 0, carbs: 0, fats: 0 },
        overallProgress: 0,
        trainerName: "Not Assigned",
        assignedWorkout: null,
        assignedDiet: null,
      };
    }

    // Resolve trainer name
    let trainerName = "Not Assigned";
    if (currentUser.trainerId) {
      const trainer = trainers.find(t => String(t.id) === String(currentUser.trainerId));
      if (trainer) trainerName = trainer.name;
    }

    return {
      ...currentUser,
      trainerName,
      macros: currentUser.macros || { protein: 0, carbs: 0, fats: 0 },
      caloriesGoal: currentUser.caloriesGoal || 2400,
      caloriesConsumed: currentUser.caloriesConsumed || 0,
      overallProgress: currentUser.overallProgress || 0,
    };
  }, [authUser, users, trainers]);

  // PERSIST TO GLOBAL STORE Helper
  const persistUpdate = (updates) => {
    if (user?.id) {
       syncToGlobal(user.id, updates);
    }
  };

  const updateProfile = (data) => {
    persistUpdate(data);
  };

  const addCalories = (amount) => {
    const newCount = (user?.caloriesConsumed || 0) + amount;
    persistUpdate({ caloriesConsumed: newCount });
  };

  const updateMacros = (newMacros) => {
    const currentMacros = user?.macros || { protein: 0, carbs: 0, fats: 0 };
    const updatedMacros = {
      protein: (currentMacros.protein || 0) + (newMacros.protein || 0),
      carbs: (currentMacros.carbs || 0) + (newMacros.carbs || 0),
      fats: (currentMacros.fats || 0) + (newMacros.fats || 0)
    };
    persistUpdate({ macros: updatedMacros });
  };

  const addProgress = (percentage) => {
    const newProgress = Math.min((user?.overallProgress || 0) + percentage, 100);
    persistUpdate({ overallProgress: newProgress });
  };

  return (
    <FitnessContext.Provider value={{ user, updateProfile, addCalories, updateMacros, addProgress }}>
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) throw new Error('useFitness must be used within a FitnessProvider');
  return context;
};