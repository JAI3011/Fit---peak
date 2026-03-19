import React, { useState, useEffect } from 'react';
import { dietAPI } from '../services/api';
import './Workouts.css';
import './Diet.css';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const MEAL_ICONS = {
  Breakfast: '🌅',
  Lunch: '☀️',
  Dinner: '🌙',
  Snack: '🍎',
};

const EMPTY_FORM = {
  name: '',
  meal_type: 'Breakfast',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  date: new Date().toISOString().slice(0, 10),
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

function Diet() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10));

  const fetchEntries = async () => {
    try {
      const data = await dietAPI.getAll();
      const list = Array.isArray(data) ? data : data?.data || [];
      setEntries(list.sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at)));
    } catch {
      showAlert('error', 'Failed to load diet entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEntries(); }, []); // eslint-disable-line

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 4000);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Meal name is required.';
    if (!form.calories || isNaN(form.calories) || Number(form.calories) < 0)
      e.calories = 'Enter valid calories.';
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
      await dietAPI.create({
        ...form,
        calories: Number(form.calories),
        protein: form.protein ? Number(form.protein) : 0,
        carbs: form.carbs ? Number(form.carbs) : 0,
        fat: form.fat ? Number(form.fat) : 0,
      });
      await fetchEntries();
      setShowModal(false);
      setForm(EMPTY_FORM);
      showAlert('success', 'Meal added!');
    } catch (err) {
      showAlert('error', err?.response?.data?.detail || 'Failed to add entry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await dietAPI.remove(id);
      setEntries((e) => e.filter((x) => x.id !== id));
      showAlert('success', 'Entry deleted.');
    } catch {
      showAlert('error', 'Failed to delete entry.');
    }
  };

  const filtered = filterDate
    ? entries.filter((e) => e.date?.slice(0, 10) === filterDate)
    : entries;

  const totals = filtered.reduce(
    (acc, e) => ({
      calories: acc.calories + (Number(e.calories) || 0),
      protein: acc.protein + (Number(e.protein) || 0),
      carbs: acc.carbs + (Number(e.carbs) || 0),
      fat: acc.fat + (Number(e.fat) || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const mealGroups = MEAL_TYPES.reduce((acc, type) => {
    acc[type] = filtered.filter((e) => e.meal_type === type);
    return acc;
  }, {});

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">🥗 Diet</h1>
          <p className="page__subtitle">{entries.length} entries logged</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setErrors({}); }}>
          + Add Meal
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? '✅' : '⚠️'} {alert.text}
        </div>
      )}

      {/* Date filter */}
      <div className="diet-date-filter">
        <label className="form-label" htmlFor="diet-date">Filter by date</label>
        <input
          id="diet-date"
          type="date"
          className="form-input diet-date-input"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        {filterDate && (
          <button className="btn-text" onClick={() => setFilterDate('')}>
            Show all
          </button>
        )}
      </div>

      {loading ? (
        <div className="page-loading"><div className="spinner" /></div>
      ) : (
        <>
          {/* Nutrition summary */}
          {filtered.length > 0 && (
            <div className="nutrition-bar">
              <div className="nutrition-bar__item nutrition-bar__item--calories">
                <span className="nutrition-bar__value">{totals.calories}</span>
                <span className="nutrition-bar__label">kcal</span>
              </div>
              <div className="nutrition-bar__divider" />
              <div className="nutrition-bar__item">
                <span className="nutrition-bar__value">{totals.protein}g</span>
                <span className="nutrition-bar__label">Protein</span>
              </div>
              <div className="nutrition-bar__item">
                <span className="nutrition-bar__value">{totals.carbs}g</span>
                <span className="nutrition-bar__label">Carbs</span>
              </div>
              <div className="nutrition-bar__item">
                <span className="nutrition-bar__value">{totals.fat}g</span>
                <span className="nutrition-bar__label">Fat</span>
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="empty-page">
              <span className="empty-page__icon">🥗</span>
              <h2>No meals logged</h2>
              <p>{filterDate ? 'No meals for this date.' : 'Start tracking your nutrition!'}</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Log a Meal
              </button>
            </div>
          ) : (
            <div className="diet-sections">
              {MEAL_TYPES.map((type) => (
                mealGroups[type].length > 0 && (
                  <div key={type} className="diet-section">
                    <h2 className="diet-section__title">
                      {MEAL_ICONS[type]} {type}
                    </h2>
                    <div className="diet-list">
                      {mealGroups[type].map((entry) => (
                        <div key={entry.id} className="diet-item">
                          <div className="diet-item__main">
                            <div className="diet-item__icon">{MEAL_ICONS[entry.meal_type] || '🍽️'}</div>
                            <div className="diet-item__info">
                              <p className="diet-item__name">{entry.name}</p>
                              <p className="diet-item__date">{formatDate(entry.date)}</p>
                            </div>
                            <div className="diet-item__macros">
                              <span className="diet-item__cal">🔥 {entry.calories} kcal</span>
                              {entry.protein ? <span>P: {entry.protein}g</span> : null}
                              {entry.carbs ? <span>C: {entry.carbs}g</span> : null}
                              {entry.fat ? <span>F: {entry.fat}g</span> : null}
                            </div>
                          </div>
                          <button
                            className="workout-card__delete"
                            onClick={() => handleDelete(entry.id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Add Meal</h2>
              <button className="modal__close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form className="modal__form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Meal Name *</label>
                  <input
                    name="name"
                    className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                    placeholder="e.g. Oatmeal with banana"
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Meal Type</label>
                  <select name="meal_type" className="form-input" value={form.meal_type} onChange={handleChange}>
                    {MEAL_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Calories (kcal) *</label>
                  <input
                    type="number"
                    name="calories"
                    className={`form-input ${errors.calories ? 'form-input--error' : ''}`}
                    placeholder="350"
                    min="0"
                    value={form.calories}
                    onChange={handleChange}
                  />
                  {errors.calories && <p className="form-error">{errors.calories}</p>}
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
              </div>

              <div className="form-row form-row--thirds">
                <div className="form-group">
                  <label className="form-label">Protein (g)</label>
                  <input type="number" name="protein" className="form-input" placeholder="25" min="0" value={form.protein} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Carbs (g)</label>
                  <input type="number" name="carbs" className="form-input" placeholder="40" min="0" value={form.carbs} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Fat (g)</label>
                  <input type="number" name="fat" className="form-input" placeholder="10" min="0" value={form.fat} onChange={handleChange} />
                </div>
              </div>

              <div className="modal__actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Add Meal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Diet;
