import React, { useState, useEffect } from 'react';
import { workoutsAPI } from '../services/api';
import './Workouts.css';

const WORKOUT_TYPES = ['Strength', 'Cardio', 'Yoga', 'HIIT', 'Other'];

const TYPE_ICONS = {
  Strength: '💪',
  Cardio: '🏃',
  Yoga: '🧘',
  HIIT: '⚡',
  Other: '🏋️',
};

const EMPTY_FORM = {
  name: '',
  type: 'Strength',
  duration: '',
  calories_burned: '',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchWorkouts = async () => {
    try {
      const data = await workoutsAPI.getAll();
      const list = Array.isArray(data) ? data : data?.data || [];
      setWorkouts(list.sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at)));
    } catch {
      showAlert('error', 'Failed to load workouts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkouts(); }, []); // eslint-disable-line

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 4000);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Workout name is required.';
    if (!form.duration || isNaN(form.duration) || Number(form.duration) <= 0)
      e.duration = 'Enter a valid duration (minutes).';
    if (!form.date) e.date = 'Date is required.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await workoutsAPI.create({
        ...form,
        duration: Number(form.duration),
        calories_burned: form.calories_burned ? Number(form.calories_burned) : 0,
      });
      await fetchWorkouts();
      setShowModal(false);
      setForm(EMPTY_FORM);
      showAlert('success', 'Workout added successfully!');
    } catch (err) {
      showAlert('error', err?.response?.data?.detail || 'Failed to add workout.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workout?')) return;
    try {
      await workoutsAPI.remove(id);
      setWorkouts((w) => w.filter((x) => x.id !== id));
      showAlert('success', 'Workout deleted.');
    } catch {
      showAlert('error', 'Failed to delete workout.');
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">💪 Workouts</h1>
          <p className="page__subtitle">{workouts.length} workout{workouts.length !== 1 ? 's' : ''} logged</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setErrors({}); }}>
          + Add Workout
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? '✅' : '⚠️'} {alert.text}
        </div>
      )}

      {loading ? (
        <div className="page-loading"><div className="spinner" /></div>
      ) : workouts.length === 0 ? (
        <div className="empty-page">
          <span className="empty-page__icon">🏋️</span>
          <h2>No workouts yet</h2>
          <p>Start logging your workouts to track your fitness journey!</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Log Your First Workout
          </button>
        </div>
      ) : (
        <div className="workout-cards">
          {workouts.map((w) => (
            <div key={w.id} className="workout-card">
              <div className="workout-card__top">
                <div className="workout-card__icon">
                  {TYPE_ICONS[w.type] || '🏋️'}
                </div>
                <div className="workout-card__info">
                  <h3 className="workout-card__name">{w.name || w.workout_name}</h3>
                  <p className="workout-card__date">{formatDate(w.date || w.created_at)}</p>
                </div>
                <button
                  className="workout-card__delete"
                  onClick={() => handleDelete(w.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
              <div className="workout-card__stats">
                <span className="workout-card__badge">{w.type || 'Workout'}</span>
                {w.duration && (
                  <span className="workout-card__stat">⏱ {w.duration} min</span>
                )}
                {w.calories_burned ? (
                  <span className="workout-card__stat">🔥 {w.calories_burned} kcal</span>
                ) : null}
              </div>
              {w.notes && <p className="workout-card__notes">{w.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Add Workout</h2>
              <button className="modal__close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form className="modal__form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Workout Name *</label>
                  <input
                    name="name"
                    className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                    placeholder="e.g. Morning Run"
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select name="type" className="form-input" value={form.type} onChange={handleChange}>
                    {WORKOUT_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Duration (minutes) *</label>
                  <input
                    type="number"
                    name="duration"
                    className={`form-input ${errors.duration ? 'form-input--error' : ''}`}
                    placeholder="45"
                    min="1"
                    value={form.duration}
                    onChange={handleChange}
                  />
                  {errors.duration && <p className="form-error">{errors.duration}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Calories Burned</label>
                  <input
                    type="number"
                    name="calories_burned"
                    className="form-input"
                    placeholder="300"
                    min="0"
                    value={form.calories_burned}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  name="date"
                  className={`form-input ${errors.date ? 'form-input--error' : ''}`}
                  value={form.date}
                  onChange={handleChange}
                />
                {errors.date && <p className="form-error">{errors.date}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  name="notes"
                  className="form-input"
                  placeholder="How did it go?"
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>

              <div className="modal__actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Add Workout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Workouts;
