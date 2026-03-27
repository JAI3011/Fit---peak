import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, User, ShieldCheck, Ruler, Weight, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../contexts/AdminContext';

const Register = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, role: authRole } = useAuth();
  const { addUser } = useAdmin();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: '', height: '', weight: '', gender: 'male', goal: 'weight_loss', role: 'user'
  });
  const [errors, setErrors] = useState({});

  // Auto-redirect if already logged in after registration simulation
  useEffect(() => {
    if (isAuthenticated && authRole) {
      navigate(`/${authRole}/dashboard`, { replace: true });
    }
  }, [isAuthenticated, authRole, navigate]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case 'name':
        if (!value) error = "Name is required";
        else if (value.length < 2) error = "Name must be at least 2 characters";
        break;
      case 'email':
        if (!value) error = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid email format";
        break;
      case 'password':
        if (!value) error = "Password is required";
        else if (value.length < 6) error = "Password must be at least 6 characters";
        break;
      case 'age':
        if (!value) error = "Age is required";
        else {
          const ageNum = parseInt(value);
          if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) error = "Age must be between 1 and 120";
        }
        break;
      case 'height':
        if (!value) error = "Height is required";
        else {
          const hNum = parseInt(value);
          if (isNaN(hNum) || hNum < 50 || hNum > 300) error = "Height must be between 50 and 300 cm";
        }
        break;
      case 'weight':
        if (!value) error = "Weight is required";
        else {
          const wNum = parseFloat(value);
          if (isNaN(wNum) || wNum < 10 || wNum > 500) error = "Weight must be between 10 and 500 kg";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate on change
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // 1. Add user to AdminContext
      const createdUser = await addUser(formData);
      
      // 2. Log them in using AuthContext
      await login(formData.email, formData.password, formData.role, createdUser);
      // navigation handled by useEffect
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMsg(error.message || "Registration failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative py-12">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="glass-panel p-8 sm:p-10 rounded-[2rem] shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Activity className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
          <p className="text-center text-gray-400 mb-4">Join the FitPeak ecosystem today</p>
          
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center mb-6">
              {errorMsg}
            </div>
          )}
          
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input type="text" name="name" required placeholder="Full Name" onChange={handleChange} className={`w-full pl-11 pr-4 py-3 bg-white/5 border ${errors.name ? 'border-red-400/50' : 'border-white/10'} rounded-xl outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all text-white placeholder-gray-500`} />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>}
              </div>
              
              {/* Email */}
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input type="email" name="email" required placeholder="Email Address" onChange={handleChange} className={`w-full pl-11 pr-4 py-3 bg-white/5 border ${errors.email ? 'border-red-400/50' : 'border-white/10'} rounded-xl outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all text-white placeholder-gray-500`} />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1 md:col-span-2">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input type="password" name="password" required placeholder="Password" onChange={handleChange} className={`w-full pl-11 pr-4 py-3 bg-white/5 border ${errors.password ? 'border-red-400/50' : 'border-white/10'} rounded-xl outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all text-white placeholder-gray-500`} />
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
              </div>

              {/* Age */}
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-bold group-focus-within:text-purple-400">#</span>
                  </div>
                  <input type="number" name="age" required placeholder="Age" onChange={handleChange} className={`w-full pl-11 pr-4 py-3 bg-white/5 border ${errors.age ? 'border-red-400/50' : 'border-white/10'} rounded-xl outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all text-white placeholder-gray-500`} />
                </div>
                {errors.age && <p className="text-red-400 text-xs mt-1 ml-1">{errors.age}</p>}
              </div>

              {/* Height */}
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Ruler className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input type="number" name="height" required placeholder="Height (cm)" onChange={handleChange} className={`w-full pl-11 pr-4 py-3 bg-white/5 border ${errors.height ? 'border-red-400/50' : 'border-white/10'} rounded-xl outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all text-white placeholder-gray-500`} />
                </div>
                {errors.height && <p className="text-red-400 text-xs mt-1 ml-1">{errors.height}</p>}
              </div>

              {/* Weight */}
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Weight className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input type="number" name="weight" required placeholder="Weight (kg)" onChange={handleChange} className={`w-full pl-11 pr-4 py-3 bg-white/5 border ${errors.weight ? 'border-red-400/50' : 'border-white/10'} rounded-xl outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all text-white placeholder-gray-500`} />
                </div>
                {errors.weight && <p className="text-red-400 text-xs mt-1 ml-1">{errors.weight}</p>}
              </div>

              {/* Gender */}
              <div className="relative group">
                <select name="gender" onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all text-white appearance-none cursor-pointer">
                  <option value="male" className="bg-zinc-900 text-white">Male</option>
                  <option value="female" className="bg-zinc-900 text-white">Female</option>
                  <option value="other" className="bg-zinc-900 text-white">Other</option>
                </select>
              </div>

              {/* Goal */}
              <div className="relative group">
                <select name="goal" onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all text-white appearance-none cursor-pointer">
                  <option value="weight_loss" className="bg-zinc-900 py-2">Weight Loss</option>
                  <option value="muscle_gain" className="bg-zinc-900 py-2">Muscle Gain</option>
                  <option value="endurance" className="bg-zinc-900 py-2">Endurance</option>
                </select>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <select name="role" onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all text-white appearance-none cursor-pointer">
                  <option value="user" className="bg-zinc-900">User</option>
                  <option value="trainer" className="bg-zinc-900">Trainer</option>
                  <option value="admin" className="bg-zinc-900">Admin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full neon-button py-3.5 rounded-xl font-bold text-white flex justify-center items-center gap-2 group mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <span>Complete Registration</span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Sign In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

