import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Testimonials from '../components/Testimonials';
import { BrainCircuit, Activity, LineChart, Target, ArrowRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.2 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 100, damping: 10 } 
  }
};

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight">
              Optimize Your Life.<br />
              <span className="text-gradient">Peak Performance.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
              Experience the next generation of personal coaching. FitPeak leverages AI to create adaptive workouts and hyper-personalized meal plans tailored just for you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="neon-button px-8 py-4 rounded-xl text-lg font-bold w-full sm:w-auto"
              >
                Join FitPeak Free
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="glass-panel px-8 py-4 rounded-xl text-lg font-bold w-full sm:w-auto hover:bg-white/10 transition-colors"
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why FitPeak?</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Our platform combines cutting-edge AI with expert trainer insights to give you the ultimate edge.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <Card>
              <div className="p-3 bg-cyan-500/10 w-fit rounded-xl mb-6">
                <BrainCircuit className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI Adaptive Plans</h3>
              <p className="text-gray-400">Our dynamic algorithms adjust your workouts and diet based on your real-time progress and feedback.</p>
            </Card>
            
            <Card>
              <div className="p-3 bg-purple-500/10 w-fit rounded-xl mb-6">
                <Target className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Goal Precision</h3>
              <p className="text-gray-400">Whether losing weight or building muscle, hit your macros perfectly with granular daily tracking.</p>
            </Card>

            <Card>
              <div className="p-3 bg-fuchsia-500/10 w-fit rounded-xl mb-6">
                <LineChart className="w-8 h-8 text-fuchsia-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Advanced Analytics</h3>
              <p className="text-gray-400">Visualize your transformation with beautiful, intricate charts showing every micro-improvement.</p>
            </Card>
          </motion.div>
        </div>
      </section>

      <Testimonials />
    </div>
  );
};

export default Landing;
