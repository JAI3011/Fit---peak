import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Award, Briefcase, Mail, Calendar, CheckCircle } from 'lucide-react';

const TrainerDetailModal = ({ isOpen, onClose, trainer }) => {
  if (!isOpen || !trainer) return null;

  // Mock clients (in real app, fetch from backend)
  const mockClients = [
    { id: 1, name: 'John Doe', progress: 65 },
    { id: 2, name: 'Jane Smith', progress: 80 },
    { id: 3, name: 'Mike Johnson', progress: 45 },
  ];

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
            className="relative w-full max-w-2xl glass-panel p-8 rounded-2xl max-h-[80vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Trainer Details</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg">
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-2xl font-bold">
                  {trainer.name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{trainer.name}</h3>
                  <p className="text-zinc-400">{trainer.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      trainer.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      trainer.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {trainer.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-purple-400 mb-2">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Certification</span>
                  </div>
                  <p className="text-white font-medium">{trainer.certification || 'Not specified'}</p>
                </div>
                <div className="glass-panel p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-cyan-400 mb-2">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Experience</span>
                  </div>
                  <p className="text-white font-medium">{trainer.experience || 'N/A'}</p>
                </div>
                <div className="glass-panel p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Clients</span>
                  </div>
                  <p className="text-white font-medium">{trainer.clientCount || 0} active clients</p>
                </div>
                <div className="glass-panel p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-orange-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Joined</span>
                  </div>
                  <p className="text-white font-medium">{trainer.joined}</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-4">Assigned Clients</h4>
                <div className="space-y-3">
                  {mockClients.map(client => (
                    <div key={client.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-xs font-bold">
                          {client.name[0]}
                        </div>
                        <span className="font-medium text-white">{client.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" style={{ width: `${client.progress}%` }} />
                        </div>
                        <span className="text-xs text-zinc-400">{client.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {trainer.status === 'pending' && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <p className="text-yellow-400 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    This trainer is pending approval. Use the approve/reject buttons on the main page.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TrainerDetailModal;