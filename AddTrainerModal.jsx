import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader } from 'lucide-react';

const AddTrainerModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    experience: '',
    certification: '',
    status: 'pending',
  });
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [isSaving, setIsSaving] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value) return "Name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        return "";
      case 'email':
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    
    if (nameErr || emailErr) {
      setErrors({ name: nameErr, email: emailErr });
      return;
    }

    setIsSaving(true);
    // Simulate delay for consistent UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTrainer = {
      ...formData,
      role: 'trainer',
      joined: new Date().toISOString().slice(0, 10),
      clientCount: 0,
    };
    onAdd(newTrainer);
    setIsSaving(false);
    setFormData({
      name: '',
      email: '',
      specialization: '',
      experience: '',
      certification: '',
      status: 'pending',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Add New Trainer</h2>
              <button 
                onClick={onClose} 
                disabled={isSaving}
                className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-50"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSaving}
                  autoComplete="off"
                  className={`w-full bg-white/5 border ${errors.name ? 'border-red-400/50' : 'border-white/10'} rounded-lg px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 disabled:opacity-50 transition-all`}
                />
                {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSaving}
                  autoComplete="off"
                  className={`w-full bg-white/5 border ${errors.email ? 'border-red-400/50' : 'border-white/10'} rounded-lg px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 disabled:opacity-50 transition-all`}
                />
                {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 disabled:opacity-50 transition-all"
                  placeholder="e.g., Strength Training"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 disabled:opacity-50 transition-all"
                    placeholder="e.g., 5 years"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400 disabled:opacity-50 transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Certification</label>
                <input
                  type="text"
                  name="certification"
                  value={formData.certification}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 disabled:opacity-50 transition-all"
                  placeholder="e.g., NASM-CPT"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 text-white transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !!errors.name || !!errors.email}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-cyan-400 hover:to-purple-400 text-white transition-all disabled:from-zinc-700 disabled:to-zinc-700 disabled:opacity-50 shadow-xl shadow-cyan-500/10"
                >
                  {isSaving ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Add Trainer
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddTrainerModal;
