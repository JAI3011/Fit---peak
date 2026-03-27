import React, { createContext, useContext, useState, useEffect } from 'react';

const TrainerContext = createContext();

export const TrainerProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedWorkouts = localStorage.getItem('trainer_workouts');
      const savedDiets = localStorage.getItem('trainer_diets');

      if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
      if (savedDiets) setDietPlans(JSON.parse(savedDiets));
    } catch (error) {
      console.error("Error parsing trainer data from localStorage:", error);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('trainer_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('trainer_diets', JSON.stringify(dietPlans));
  }, [dietPlans]);

  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now().toString()
    };
    setWorkouts(prev => [newWorkout, ...prev]);
    return newWorkout;
  };

  const addDietPlan = (dietPlan) => {
    const newDietPlan = {
      ...dietPlan,
      id: Date.now().toString()
    };
    setDietPlans(prev => [newDietPlan, ...prev]);
    return newDietPlan;
  };

  return (
    <TrainerContext.Provider 
      value={{ 
        workouts, 
        dietPlans, 
        addWorkout, 
        addDietPlan 
      }}
    >
      {children}
    </TrainerContext.Provider>
  );
};

export const useTrainer = () => {
  const context = useContext(TrainerContext);
  if (!context) {
    throw new Error('useTrainer must be used within a TrainerProvider');
  }
  return context;
};
