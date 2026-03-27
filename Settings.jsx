import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Mail, Zap, Shield } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card';
import { useAdmin } from '../../contexts/AdminContext';

const Settings = () => {
  const { settings, updateSettings } = useAdmin();
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        features: { ...prev.features, [name]: checked }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">System Settings</h1>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-bold flex items-center gap-2 hover:from-cyan-400 hover:to-purple-400 transition-all"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-400 text-center"
          >
            Settings saved successfully!
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold">General</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">App Name</label>
                <input
                  type="text"
                  name="appName"
                  value={formData.appName}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Support Email</label>
                <input
                  type="email"
                  name="supportEmail"
                  value={formData.supportEmail}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Default Calorie Goal</label>
                <input
                  type="number"
                  name="defaultCalorieGoal"
                  value={formData.defaultCalorieGoal}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </Card>

          {/* Feature Toggles */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold">Features</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Trainer Plan Creation</p>
                  <p className="text-xs text-zinc-500">Allow trainers to create and assign custom plans</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="trainerPlanCreation"
                    checked={formData.features.trainerPlanCreation}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">User Library</p>
                  <p className="text-xs text-zinc-500">Enable library section for users</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="userLibrary"
                    checked={formData.features.userLibrary}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;