import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Bell, Globe, Save } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";

export default function TrainerProfile() {
  const [profile, setProfile] = useState({
    name: "Rahul Sharma",
    email: "rahul.sharma@fitpeak.com",
    phone: "+91 98765 43210",
    bio: "Certified fitness trainer with 8+ years of experience in strength training and nutrition coaching.",
    specialization: "Strength Training",
    certifications: "NASM-CPT, Precision Nutrition Level 1",
    experience: "8 years"
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    clientMessages: true,
    workoutReminders: false,
    weeklyReports: true
  });

  const handleProfileUpdate = () => {
    console.log("Updating profile:", profile);
    alert("Profile updated successfully! ✅");
  };

  const handleNotificationUpdate = () => {
    console.log("Updating notifications:", notifications);
    alert("Notification settings updated! ✅");
  };

  return (
    <DashboardLayout role="trainer">
      <div className="flex-1 space-y-6">
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-semibold">Profile & Settings</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage your account and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN - PROFILE */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* BASIC INFO */}
            <Card>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleProfileUpdate}
                className="mt-4 w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </Card>

            {/* PROFESSIONAL INFO */}
            <Card>
              <h2 className="text-xl font-bold mb-4">Professional Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Specialization</label>
                  <select
                    value={profile.specialization}
                    onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option>Strength Training</option>
                    <option>Weight Loss</option>
                    <option>Athletic Performance</option>
                    <option>Bodybuilding</option>
                    <option>CrossFit</option>
                    <option>Yoga</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Certifications</label>
                  <input
                    type="text"
                    value={profile.certifications}
                    onChange={(e) => setProfile({ ...profile, certifications: e.target.value })}
                    placeholder="e.g., NASM-CPT, ACE"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Years of Experience</label>
                  <input
                    type="text"
                    value={profile.experience}
                    onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </Card>

            {/* CHANGE PASSWORD */}
            <Card>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" />
                Change Password
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <button className="mt-4 w-full md:w-auto px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg font-semibold transition-all">
                Update Password
              </button>
            </Card>
          </div>

          {/* RIGHT COLUMN - SETTINGS */}
          <div className="space-y-6">
            {/* NOTIFICATIONS */}
            <Card>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-cyan-400" />
                Notification Settings
              </h2>

              <div className="space-y-4">
                <NotificationToggle
                  label="Email Notifications"
                  enabled={notifications.emailNotifications}
                  onChange={(val) => setNotifications({...notifications, emailNotifications: val})}
                />
                <NotificationToggle
                  label="Client Messages"
                  enabled={notifications.clientMessages}
                  onChange={(val) => setNotifications({...notifications, clientMessages: val})}
                />
                <NotificationToggle
                  label="Workout Reminders"
                  enabled={notifications.workoutReminders}
                  onChange={(val) => setNotifications({...notifications, workoutReminders: val})}
                />
                <NotificationToggle
                  label="Weekly Reports"
                  enabled={notifications.weeklyReports}
                  onChange={(val) => setNotifications({...notifications, weeklyReports: val})}
                />
              </div>

              <button
                onClick={handleNotificationUpdate}
                className="mt-6 w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg font-semibold transition-all"
              >
                Save Preferences
              </button>
            </Card>

            {/* LANGUAGE & REGION */}
            <Card>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                Language & Region
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Language</label>
                  <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none">
                    <option>English (US)</option>
                    <option>Hindi</option>
                    <option>Spanish</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// NOTIFICATION TOGGLE COMPONENT
function NotificationToggle({ label, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-300">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-cyan-500' : 'bg-zinc-700'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}