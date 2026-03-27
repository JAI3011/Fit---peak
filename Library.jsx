import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, BookOpen, Utensils, Info, HelpCircle, 
  ChevronDown, Play, Filter, X, Clock, 
  Flame, Award, Dumbbell, Newspaper, MessageSquare
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/Card';

// Data Imports
import { exercises } from '../data/exercises';
import { nutritionGuides } from '../data/nutritionGuides';
import { recipes } from '../data/recipes';
import { articles } from '../data/articles';
import { faqs } from '../data/faqs';

const Library = () => {
  const [activeTab, setActiveTab] = useState('Exercises');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const tabs = [
    { name: 'Exercises', icon: Dumbbell },
    { name: 'Nutrition', icon: Info },
    { name: 'Recipes', icon: Utensils },
    { name: 'Blog', icon: Newspaper },
    { name: 'FAQs', icon: HelpCircle },
  ];

  // Filtering Logic
  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => 
      (selectedCategory === 'All' || ex.category === selectedCategory) &&
      (selectedDifficulty === 'All' || ex.difficulty === selectedDifficulty) &&
      (ex.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter(re => 
      (selectedCategory === 'All' || re.category === selectedCategory) &&
      (re.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, selectedCategory]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(f => 
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredArticles = useMemo(() => {
    return articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const filteredGuides = useMemo(() => {
    return nutritionGuides.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  // Modal Component
  const DetailModal = ({ item, type, onClose }) => {
    if (!item) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl glass-panel p-1 rounded-3xl overflow-hidden"
        >
          <div className="bg-darkBg/90 p-8 rounded-[22px] max-h-[85vh] overflow-y-auto custom-scrollbar">
            <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/5 transition-colors">
              <X className="w-5 h-5 text-zinc-500" />
            </button>

            {type === 'exercise' && (
              <div className="space-y-6 text-white">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-cyan-400/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-cyan-400/20">
                    {item.category}
                  </span>
                  <h2 className="text-3xl font-black">{item.name}</h2>
                </div>
                {item.video && (
                  <div className="aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                    <iframe width="100%" height="100%" src={item.video} frameBorder="0" allowFullScreen />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel p-4 rounded-xl border-white/5 bg-white/[0.02]">
                    <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Muscles Worked</p>
                    <p className="text-sm font-bold">{item.muscles?.join(', ')}</p>
                  </div>
                  <div className="glass-panel p-4 rounded-xl border-white/5 bg-white/[0.02]">
                    <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Equipment</p>
                    <p className="text-sm font-bold">{item.equipment}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-3">Instructions</h4>
                  <ul className="space-y-3 list-decimal list-inside text-zinc-400 text-sm leading-relaxed">
                    {item.instructions?.map((step, i) => <li key={i}>{step}</li>)}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 italic text-purple-400 text-sm">
                  Pro Tip: {item.tips}
                </div>
              </div>
            )}

            {type === 'recipe' && (
              <div className="space-y-6 text-white">
                <div className="aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-6">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-3xl font-black">{item.name}</h2>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-3 glass-panel rounded-xl"><p className="text-[10px] font-black text-zinc-500 uppercase">Cals</p><p className="font-bold text-cyan-400">{item.calories}</p></div>
                  <div className="text-center p-3 glass-panel rounded-xl"><p className="text-[10px] font-black text-zinc-500 uppercase">Prot</p><p className="font-bold text-purple-400">{item.protein}g</p></div>
                  <div className="text-center p-3 glass-panel rounded-xl"><p className="text-[10px] font-black text-zinc-500 uppercase">Carb</p><p className="font-bold text-emerald-400">{item.carbs}g</p></div>
                  <div className="text-center p-3 glass-panel rounded-xl"><p className="text-[10px] font-black text-zinc-500 uppercase">Fat</p><p className="font-bold text-orange-400">{item.fats}g</p></div>
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-3">Ingredients</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-zinc-400">
                    {item.ingredients?.map((ing, i) => <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> {ing}
                    </div>)}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-3">Method</h4>
                  <ol className="space-y-3 text-sm text-zinc-400 list-decimal list-inside leading-relaxed">
                    {item.instructions?.map((step, i) => <li key={i}>{step}</li>)}
                  </ol>
                </div>
              </div>
            )}

            {type === 'article' && (
              <div className="space-y-6 text-white">
                <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-6 relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-darkBg to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2 block">{item.category}</span>
                    <h2 className="text-3xl font-black leading-tight">{item.title}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-8 border-b border-white/5 pb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10" />
                    <span className="font-bold">{item.author}</span>
                  </div>
                  <span>•</span>
                  <span>{item.date}</span>
                  <span>•</span>
                  <span>{item.readTime} read</span>
                </div>
                <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed space-y-4">
                  <p className="text-lg text-white font-medium italic">"{item.excerpt}"</p>
                  <p>In the world of professional fitness, consistency is often cited as the number one factor for success. However, understanding the underlying mechanics of {item.category.toLowerCase()} can be the difference between a plateau and a breakthrough.</p>
                  <p>When we look at {item.title.toLowerCase()}, the primary focus should always be on form and sustainability. Many athletes rush into advanced techniques without mastering the basics, which leads to injury and burnout.</p>
                  <h3 className="text-xl font-black text-white mt-8">Key Takeaways</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Prioritize movement quality over quantity.</li>
                    <li>Listen to your body's biofeedback signals.</li>
                    <li>Consistency beats intensity every single time.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <DashboardLayout role="user">
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        {/* Header with Search */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">Library <span className="text-gradient">& Resources</span></h1>
            <p className="text-zinc-500 font-medium">Master your form, nutrition, and mindset.</p>
          </div>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder={`Search in ${activeTab}...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400/50 transition-all font-medium" 
            />
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.name}
              onClick={() => { setActiveTab(tab.name); setSelectedCategory('All'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.name 
                  ? 'bg-white/10 text-cyan-400 border border-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="min-h-[400px]"
          >
            {/* Exercises Tab */}
            {activeTab === 'Exercises' && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <select 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-zinc-300 text-sm focus:outline-none"
                  >
                    <option value="All" className="bg-darkBg">All Categories</option>
                    {[...new Set(exercises.map(e => e.category))].map(c => <option key={c} value={c} className="bg-darkBg">{c}</option>)}
                  </select>
                  <select 
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-zinc-300 text-sm focus:outline-none"
                  >
                    <option value="All" className="bg-darkBg">All Difficulties</option>
                    <option value="Beginner" className="bg-darkBg">Beginner</option>
                    <option value="Intermediate" className="bg-darkBg">Intermediate</option>
                    <option value="Advanced" className="bg-darkBg">Advanced</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredExercises.map(ex => (
                    <Card key={ex.id} className="p-4 hover:border-cyan-400/30 transition-all cursor-pointer group" onClick={() => setSelectedDetail({ item: ex, type: 'exercise' })}>
                      <div className="aspect-video rounded-xl bg-white/5 mb-4 relative overflow-hidden flex items-center justify-center">
                        {ex.image ? (
                          <img src={ex.image} alt={ex.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500" />
                        ) : (
                          <Play className="w-8 h-8 text-zinc-700 group-hover:text-cyan-400 transition-colors" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-transparent to-transparent opacity-60" />
                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-md text-[8px] font-black text-white uppercase tracking-widest">{ex.difficulty}</span>
                        {ex.image && <Play className="absolute w-8 h-8 text-white/50 group-hover:text-cyan-400 transition-colors z-10" />}
                      </div>
                      <div className="flex justify-between items-start mb-2 text-white">
                        <h4 className="font-black text-lg group-hover:text-cyan-400 transition-colors">{ex.name}</h4>
                        <span className="text-[10px] font-black uppercase text-zinc-500">{ex.category}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1 font-bold"><Clock className="w-3 h-3" /> {ex.duration || '15 min'}</span>
                        <span className="flex items-center gap-1 font-bold"><Award className="w-3 h-3" /> {ex.equipment || 'Varies'}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition Guides Tab */}
            {activeTab === 'Nutrition' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGuides.map(guide => (
                  <Card key={guide.id} className="p-6 hover:border-purple-400/30 transition-all cursor-pointer group">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/10 group-hover:border-purple-500/30 transition-colors">
                        <BookOpen className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-xl font-black text-white">{guide.title}</h4>
                          <span className="text-[10px] font-black text-zinc-500 uppercase">{guide.readTime}</span>
                        </div>
                        <p className="text-zinc-500 text-sm italic mb-4">{guide.description}</p>
                        <button className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                          Read Guide →
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Recipes Tab */}
            {activeTab === 'Recipes' && (
              <div className="space-y-6">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Post-Workout'].map(cat => (
                    <button 
                      key={cat} onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                        selectedCategory === cat ? 'bg-cyan-400 text-black border-cyan-400' : 'text-zinc-500 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredRecipes.map(re => (
                    <Card key={re.id} className="p-4 hover:border-emerald-400/30 transition-all cursor-pointer group" onClick={() => setSelectedDetail({ item: re, type: 'recipe' })}>
                      <div className="aspect-square rounded-2xl bg-white/5 mb-4 flex items-center justify-center overflow-hidden relative group-hover:shadow-[0_0_30px_rgba(52,211,153,0.1)] transition-all">
                        {re.image?.startsWith('http') ? (
                          <img src={re.image} alt={re.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <span className="text-4xl group-hover:scale-110 transition-transform">{re.image || '🥗'}</span>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-darkBg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h4 className="font-black text-lg text-white mb-3 group-hover:text-emerald-400 transition-colors">{re.name}</h4>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-black uppercase text-zinc-500 mb-4">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {re.prepTime}</span>
                        <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {re.calories} Cal</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="flex-1 h-1 bg-purple-500/20 rounded-full overflow-hidden"><div className="h-full bg-purple-500" style={{ width: '60%' }} /></div>
                        <div className="flex-1 h-1 bg-emerald-500/20 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: '40%' }} /></div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Blog Tab */}
            {activeTab === 'Blog' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredArticles.map(art => (
                  <Card key={art.id} className="flex flex-col md:flex-row gap-6 p-6 hover:border-orange-400/30 transition-all cursor-pointer group" onClick={() => setSelectedDetail({ item: art, type: 'article' })}>
                    <div className="w-full md:w-40 aspect-square rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden relative">
                      {art.image?.startsWith('http') ? (
                        <img src={art.image} alt={art.title} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                      ) : (
                        <span className="text-5xl">{art.image}</span>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">{art.category}</span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-[10px] font-black text-zinc-600 uppercase">{art.readTime}</span>
                        </div>
                        <h4 className="text-xl font-black text-white mb-2 leading-tight">{art.title}</h4>
                        <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">{art.excerpt}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <div className="w-6 h-6 rounded-full bg-white/10" />
                        <span className="text-xs font-bold text-zinc-400">{art.author}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* FAQs Tab */}
            {activeTab === 'FAQs' && (
              <div className="max-w-3xl mx-auto space-y-4">
                {filteredFaqs.map(faq => (
                  <div key={faq.id} className="glass-panel border border-white/5 rounded-2xl overflow-hidden transition-all">
                    <button 
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-5 text-left group"
                    >
                      <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">{faq.question}</span>
                      <ChevronDown className={`w-5 h-5 text-zinc-600 transition-transform ${expandedFaq === faq.id ? 'rotate-180 text-cyan-400' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {expandedFaq === faq.id && (
                        <motion.div 
                          initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 pt-0 text-zinc-400 text-sm leading-relaxed border-t border-white/5 bg-white/[0.01]">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <DetailModal 
          item={selectedDetail?.item} 
          type={selectedDetail?.type} 
          onClose={() => setSelectedDetail(null)} 
        />
      </div>
    </DashboardLayout>
  );
};

export default Library;
