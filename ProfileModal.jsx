import React, { useState } from "react";
import { X, Loader } from "lucide-react";

export default function ProfileModal({ open, setOpen, user, onSave }) {
  const [formData, setFormData] = useState({
    ...user,
    goal: user.goal || "Muscle Gain"
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    const numValue = parseFloat(value);

    switch (name) {
      case 'name':
        if (!value) error = "Name is required";
        else if (value.length < 2) error = "Name must be at least 2 characters";
        break;
      case 'age':
        if (isNaN(numValue) || numValue < 1 || numValue > 120) error = "Age must be between 1 and 120";
        break;
      case 'height':
        if (isNaN(numValue) || numValue < 50 || numValue > 300) error = "Height must be between 50 and 300 cm";
        break;
      case 'weight':
        if (isNaN(numValue) || numValue < 10 || numValue > 500) error = "Weight must be between 10 and 500 kg";
        break;
      case 'caloriesGoal':
        if (isNaN(numValue) || numValue < 500 || numValue > 10000) error = "Goal must be 500 - 10,000";
        break;
      case 'caloriesConsumed':
        if (isNaN(numValue) || numValue < 0 || numValue > 10000) error = "Must be 0 - 10,000";
        break;
      case 'overallProgress':
        if (isNaN(numValue) || numValue < 0 || numValue > 100) error = "Must be 0 - 100%";
        break;
      case 'macros.protein':
      case 'macros.carbs':
      case 'macros.fats':
        if (isNaN(numValue) || numValue < 0) error = "Cannot be negative";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = e.target.type === 'number' ? parseFloat(value) || 0 : value;

    // Handle nested macros object
    if (name.startsWith('macros.')) {
      const macroKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        macros: {
          ...prev.macros,
          [macroKey]: finalValue
        }
      }));
      const error = validateField(name, finalValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: finalValue
      }));
      const error = validateField(name, finalValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate top level
    ['name', 'age', 'height', 'weight', 'caloriesGoal', 'caloriesConsumed', 'overallProgress'].forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    // Validate macros
    if (formData.macros) {
      ['protein', 'carbs', 'fats'].forEach(key => {
        const fullKey = `macros.${key}`;
        const error = validateField(fullKey, formData.macros[key]);
        if (error) newErrors[fullKey] = error;
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // Simulate real persistence delay
      await new Promise(resolve => setTimeout(resolve, 800));
      onSave(formData);
      setOpen(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Update Profile</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Form Fields - Scrollable */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Section: Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={`form-input ${errors.name ? 'border-red-400/50' : ''}`} />
              {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className={`form-input ${errors.age ? 'border-red-400/50' : ''}`} />
              {errors.age && <p className="text-red-400 text-[10px] mt-1">{errors.age}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Section: Physical */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">Height (cm)</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} className={`form-input ${errors.height ? 'border-red-400/50' : ''}`} />
              {errors.height && <p className="text-red-400 text-[10px] mt-1">{errors.height}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">Weight (kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} className={`form-input ${errors.weight ? 'border-red-400/50' : ''}`} />
              {errors.weight && <p className="text-red-400 text-[10px] mt-1">{errors.weight}</p>}
            </div>
          </div>

          {/* Section: Daily Targets */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-tighter">Daily Energy & Progress</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase text-zinc-500 mb-1 font-bold">Daily Goal (kcal)</label>
                <input type="number" name="caloriesGoal" value={formData.caloriesGoal} onChange={handleChange} className={`form-input ${errors.caloriesGoal ? 'border-red-400/50' : ''}`} />
                {errors.caloriesGoal && <p className="text-red-400 text-[10px] mt-1">{errors.caloriesGoal}</p>}
              </div>
              <div>
                <label className="block text-[10px] uppercase text-zinc-500 mb-1 font-bold">Consumed (kcal)</label>
                <input type="number" name="caloriesConsumed" value={formData.caloriesConsumed} onChange={handleChange} className={`form-input ${errors.caloriesConsumed ? 'border-red-400/50' : ''}`} />
                {errors.caloriesConsumed && <p className="text-red-400 text-[10px] mt-1">{errors.caloriesConsumed}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] uppercase text-zinc-500 mb-1 font-bold">Overall Progress (%)</label>
                <input type="number" name="overallProgress" value={formData.overallProgress} onChange={handleChange} className={`form-input ${errors.overallProgress ? 'border-red-400/50' : ''}`} />
                {errors.overallProgress && <p className="text-red-400 text-[10px] mt-1">{errors.overallProgress}</p>}
              </div>
            </div>
          </div>

          {/* Section: Macros */}
          <div className="space-y-4 pt-4 border-t border-white/5 pb-4">
             <h3 className="text-xs font-black text-purple-400 uppercase tracking-tighter">Macronutrient Targets (g)</h3>
             <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-zinc-500 mb-1 font-bold">Protein</label>
                  <input type="number" name="macros.protein" value={formData.macros?.protein} onChange={handleChange} className={`form-input ${errors['macros.protein'] ? 'border-red-400/50' : ''}`} />
                  {errors['macros.protein'] && <p className="text-red-400 text-[10px] mt-1">{errors['macros.protein']}</p>}
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-zinc-500 mb-1 font-bold">Carbs</label>
                  <input type="number" name="macros.carbs" value={formData.macros?.carbs} onChange={handleChange} className={`form-input ${errors['macros.carbs'] ? 'border-red-400/50' : ''}`} />
                  {errors['macros.carbs'] && <p className="text-red-400 text-[10px] mt-1">{errors['macros.carbs']}</p>}
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-zinc-500 mb-1 font-bold">Fats</label>
                  <input type="number" name="macros.fats" value={formData.macros?.fats} onChange={handleChange} className={`form-input ${errors['macros.fats'] ? 'border-red-400/50' : ''}`} />
                  {errors['macros.fats'] && <p className="text-red-400 text-[10px] mt-1">{errors['macros.fats']}</p>}
                </div>
             </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setOpen(false)}
            disabled={isSaving}
            className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg font-semibold transition-all text-white shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}