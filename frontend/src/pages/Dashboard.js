import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { workoutsAPI, dietAPI, progressAPI } from '../services/api';
import './Dashboard.css';

const QUOTES = [
  "The only bad workout is the one that didn't happen.",
  "Push yourself because no one else is going to do it for you.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Success starts with self-discipline.",
  "Take care of your body — it's the only place you have to live.",
  "Strive for progress, not perfection.",
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState([]);
  const [dietEntries, setDietEntries] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  useEffect(() => {
    const load = async () => {
      try {
        const [w, d, p] = await Promise.allSettled([
          workoutsAPI.getAll(),
          dietAPI.getAll(),
          progressAPI.getAll(),
        ]);
        if (w.status === 'fulfilled') setWorkouts(Array.isArray(w.value) ? w.value : w.value?.data || []);
        if (d.status === 'fulfilled') setDietEntries(Array.isArray(d.value) ? d.value : d.value?.data || []);
        if (p.status === 'fulfilled') setProgressRecords(Array.isArray(p.value) ? p.value : p.value?.data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayDiet = dietEntries.filter((e) => e.date?.slice(0, 10) === today);
  const totalCaloriesToday = todayDiet.reduce((s, e) => s + (Number(e.calories) || 0), 0);
  const latestProgress = progressRecords[0] || null;
  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at))
    .slice(0, 5);

  const firstName = user?.name?.split(' ')[0] || user?.username || 'Athlete';

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
        <p>Loading your stats…</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Welcome back, {firstName}! 👋</h1>
          <p className="dashboard__subtitle">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          icon="💪"
          label="Total Workouts"
          value={workouts.length}
          color="#667eea"
        />
        <StatCard
          icon="🔥"
          label="Calories Today"
          value={totalCaloriesToday}
          unit="kcal"
          color="#ed8936"
        />
        <StatCard
          icon="⚖️"
          label="Current Weight"
          value={latestProgress?.weight ?? '—'}
          unit={latestProgress?.weight ? 'kg' : ''}
          color="#48bb78"
        />
        <StatCard
          icon="🎯"
          label="Diet Entries Today"
          value={todayDiet.length}
          color="#9f7aea"
        />
      </div>

      {/* Main content grid */}
      <div className="dashboard__content">
        {/* Recent Workouts */}
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">💪 Recent Workouts</h2>
            <button className="btn-text" onClick={() => navigate('/workouts')}>
              View all →
            </button>
          </div>
          {recentWorkouts.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state__icon">🏋️</span>
              <p>No workouts yet. Log your first one!</p>
              <button className="btn btn-primary" onClick={() => navigate('/workouts')}>
                Add Workout
              </button>
            </div>
          ) : (
            <ul className="workout-list">
              {recentWorkouts.map((w, i) => (
                <li key={w.id || i} className="workout-list__item">
                  <div className="workout-list__icon">
                    {w.type === 'Cardio' ? '🏃' : w.type === 'Yoga' ? '🧘' : w.type === 'HIIT' ? '⚡' : '💪'}
                  </div>
                  <div className="workout-list__info">
                    <p className="workout-list__name">{w.name || w.workout_name || 'Workout'}</p>
                    <p className="workout-list__meta">
                      {w.type && <span className="badge">{w.type}</span>}
                      {w.duration && <span>{w.duration} min</span>}
                      {w.calories_burned && <span>🔥 {w.calories_burned} kcal</span>}
                    </p>
                  </div>
                  <span className="workout-list__date">
                    {formatDate(w.date || w.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right column */}
        <div className="dashboard__right">
          {/* Quick Add */}
          <div className="dashboard-card">
            <h2 className="dashboard-card__title">⚡ Quick Add</h2>
            <div className="quick-add-grid">
              <button className="quick-add-btn" onClick={() => navigate('/workouts')}>
                <span>💪</span> Workout
              </button>
              <button className="quick-add-btn" onClick={() => navigate('/exercises')}>
                <span>🏃</span> Exercise
              </button>
              <button className="quick-add-btn" onClick={() => navigate('/diet')}>
                <span>🥗</span> Meal
              </button>
              <button className="quick-add-btn" onClick={() => navigate('/progress')}>
                <span>📈</span> Progress
              </button>
            </div>
          </div>

          {/* Today's Nutrition */}
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h2 className="dashboard-card__title">🥗 Today's Nutrition</h2>
              <button className="btn-text" onClick={() => navigate('/diet')}>View →</button>
            </div>
            {todayDiet.length === 0 ? (
              <p className="empty-text">No meals logged today.</p>
            ) : (
              <div className="nutrition-summary">
                {['protein', 'carbs', 'fat'].map((macro) => {
                  const total = todayDiet.reduce((s, e) => s + (Number(e[macro]) || 0), 0);
                  return (
                    <div key={macro} className="nutrition-macro">
                      <span className="nutrition-macro__label">{macro.charAt(0).toUpperCase() + macro.slice(1)}</span>
                      <span className="nutrition-macro__value">{total}g</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quote */}
          <div className="dashboard-card dashboard-card--quote">
            <p className="quote-icon">💬</p>
            <p className="quote-text">"{quote}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
