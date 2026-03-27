import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, role: authRole } = useAuth();
  
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && authRole) {
      const redirectPath = location.state?.from?.pathname;
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else {
        navigate(`/${authRole}/dashboard`, { replace: true });
      }
    }
  }, [isAuthenticated, authRole, navigate, location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password, role);
      // navigation is handled by the useEffect once isAuthenticated becomes true
    } catch (error) {
      console.error("Login failed:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel p-8 sm:p-10 rounded-[2rem] shadow-2xl relative">
          
          <div className="flex justify-center mb-8">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Activity className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
          <p className="text-center text-gray-400 mb-8">Access your FitPeak dashboard</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Role Selection */}
            <div className="flex p-1 bg-white/5 rounded-xl">
              {['user', 'trainer', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg capitalize transition-all duration-300 relative`}
                >
                  {role === r && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)] rounded-lg"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${role === r ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                    {r}
                  </span>
                </button>
              ))}
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all text-white placeholder-gray-500"
                  placeholder="name@example.com"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all text-white placeholder-gray-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full neon-button py-3.5 rounded-xl font-bold text-white flex justify-center items-center gap-2 group mt-8"
            >
              {isSubmitting ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            Don't have an account?{' '}
            <button onClick={() => navigate('/register')} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Sign up
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;