import React, { useState, useEffect } from 'react';
import { exercisesAPI } from '../services/api';
import './Workouts.css';
import './Exercises.css';

const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
  'Legs', 'Glutes', 'Core', 'Cardio', 'Full Body', 'Other',
];

const MUSCLE_ICONS = {
  Chest: '🫁', Back: '🔙', Shoulders: '🤸', Biceps: '💪', Triceps: '🦾',
  Legs: '🦵', Glutes: '🍑', Core: '🎯', Cardio: '🏃', 'Full Body': '🏋️', Other: '⚡',
};

const EMPTY_FORM = {
  name: '',
  muscle_group: 'Chest',
  sets: '',
  reps: '',
  weight: '',
  duration: '',
  notes: '',
};

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [filterGroup, setFilterGroup] = useState('All');

  const fetchExercises = async () => {
    try {
      const data = await exercisesAPI.getAll();
      setExercises(Array.isArray(data) ? data : data?.data || []);
    } catch {
      showAlert('error', 'Failed to load exercises.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExercises(); }, []); // eslint-disable-line

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 4000);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Exercise name is required.';
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
      await exercisesAPI.create({
        ...form,
        sets: form.sets ? Number(form.sets) : null,
        reps: form.reps ? Number(form.reps) : null,
        weight: form.weight ? Number(form.weight) : null,
        duration: form.duration ? Number(form.duration) : null,
      });
      await fetchExercises();
      setShowModal(false);
      setForm(EMPTY_FORM);
      showAlert('success', 'Exercise added!');
    } catch (err) {
      showAlert('error', err?.response?.data?.detail || 'Failed to add exercise.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exercise?')) return;
    try {
      await exercisesAPI.remove(id);
      setExercises((ex) => ex.filter((x) => x.id !== id));
      showAlert('success', 'Exercise deleted.');
    } catch {
      showAlert('error', 'Failed to delete exercise.');
    }
  };

  // Group exercises by muscle group
  const groups = ['All', ...MUSCLE_GROUPS];
  const filtered = filterGroup === 'All'
    ? exercises
    : exercises.filter((ex) => ex.muscle_group === filterGroup);

  const grouped = filtered.reduce((acc, ex) => {
    const g = ex.muscle_group || 'Other';
    if (!acc[g]) acc[g] = [];
    acc[g].push(ex);
    return acc;
  }, {});

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">🏃 Exercises</h1>
          <p className="page__subtitle">{exercises.length} exercise{exercises.length !== 1 ? 's' : ''} logged</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setErrors({}); }}>
          + Add Exercise
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? '✅' : '⚠️'} {alert.text}
        </div>
      )}

      {/* Filter tabs */}
      <div className="filter-tabs">
        {groups.map((g) => (
          <button
            key={g}
            className={`filter-tab ${filterGroup === g ? 'filter-tab--active' : ''}`}
            onClick={() => setFilterGroup(g)}
          >
            {g !== 'All' && MUSCLE_ICONS[g]} {g}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="page-loading"><div className="spinner" /></div>
      ) : exercises.length === 0 ? (
        <div className="empty-page">
          <span className="empty-page__icon">🏋️</span>
          <h2>No exercises yet</h2>
          <p>Add your exercises to track sets, reps, and weight.</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add First Exercise
          </button>
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="empty-page">
          <span className="empty-page__icon">🔍</span>
          <p>No exercises in this category.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([group, items]) => (
          <div key={group} className="exercise-group">
            <h2 className="exercise-group__title">
              {MUSCLE_ICONS[group] || '💪'} {group}
            </h2>
            <div className="exercise-list">
              {items.map((ex) => (
                <div key={ex.id} className="exercise-item">
                  <div className="exercise-item__icon">
                    {MUSCLE_ICONS[ex.muscle_group] || '💪'}
                  </div>
                  <div className="exercise-item__info">
                    <p className="exercise-item__name">{ex.name}</p>
                    <div className="exercise-item__stats">
                      {ex.sets && <span>📋 {ex.sets} sets</span>}
                      {ex.reps && <span>🔄 {ex.reps} reps</span>}
                      {ex.weight && <span>⚖️ {ex.weight} kg</span>}
                      {ex.duration && <span>⏱ {ex.duration}s</span>}
                    </div>
                    {ex.notes && <p className="exercise-item__notes">{ex.notes}</p>}
                  </div>
                  <button
                    className="workout-card__delete"
                    onClick={() => handleDelete(ex.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Add Exercise</h2>
              <button className="modal__close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form className="modal__form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Exercise Name *</label>
                  <input
                    name="name"
                    className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                    placeholder="e.g. Bench Press"
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Muscle Group</label>
                  <select name="muscle_group" className="form-input" value={form.muscle_group} onChange={handleChange}>
                    {MUSCLE_GROUPS.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Sets</label>
                  <input type="number" name="sets" className="form-input" placeholder="3" min="1" value={form.sets} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Reps</label>
                  <input type="number" name="reps" className="form-input" placeholder="12" min="1" value={form.reps} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input type="number" name="weight" className="form-input" placeholder="60" min="0" step="0.5" value={form.weight} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (seconds)</label>
                  <input type="number" name="duration" className="form-input" placeholder="60" min="1" value={form.duration} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea name="notes" className="form-input" placeholder="Form tips, variations…" value={form.notes} onChange={handleChange} />
              </div>

              <div className="modal__actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Add Exercise'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Exercises;
