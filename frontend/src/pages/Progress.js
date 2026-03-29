import React, { useState, useEffect } from 'react';
import { progressAPI } from '../services/api';
import './Workouts.css';
import './Progress.css';

const EMPTY_FORM = {
  weight: '',
  body_fat: '',
  chest: '',
  waist: '',
  hips: '',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

function diffLabel(current, previous) {
  if (current == null || previous == null) return null;
  const diff = Number(current) - Number(previous);
  if (diff === 0) return <span className="diff diff--neutral">= same</span>;
  return diff > 0
    ? <span className="diff diff--up">▲ +{diff.toFixed(1)}</span>
    : <span className="diff diff--down">▼ {diff.toFixed(1)}</span>;
}

function Progress() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchRecords = async () => {
    try {
      const data = await progressAPI.getAll();
      const list = Array.isArray(data) ? data : data?.data || [];
      setRecords(list.sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at)));
    } catch {
      showAlert('error', 'Failed to load progress records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []); // eslint-disable-line

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 4000);
  };

  const validate = () => {
    const e = {};
    if (!form.date) e.date = 'Date is required.';
    if (!form.weight && !form.body_fat && !form.chest && !form.waist && !form.hips) {
      e.weight = 'Enter at least one measurement.';
    }
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
      const payload = { date: form.date, notes: form.notes };
      if (form.weight) payload.weight = Number(form.weight);
      if (form.body_fat) payload.body_fat = Number(form.body_fat);
      if (form.chest) payload.chest = Number(form.chest);
      if (form.waist) payload.waist = Number(form.waist);
      if (form.hips) payload.hips = Number(form.hips);

      await progressAPI.create(payload);
      await fetchRecords();
      setShowModal(false);
      setForm(EMPTY_FORM);
      showAlert('success', 'Progress recorded!');
    } catch (err) {
      showAlert('error', err?.response?.data?.detail || 'Failed to save progress.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await progressAPI.remove(id);
      setRecords((r) => r.filter((x) => x.id !== id));
      showAlert('success', 'Record deleted.');
    } catch {
      showAlert('error', 'Failed to delete record.');
    }
  };

  const latest = records[0] || null;
  const previous = records[1] || null;

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">📈 Progress</h1>
          <p className="page__subtitle">{records.length} record{records.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setErrors({}); }}>
          + Add Record
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? '✅' : '⚠️'} {alert.text}
        </div>
      )}

      {loading ? (
        <div className="page-loading"><div className="spinner" /></div>
      ) : records.length === 0 ? (
        <div className="empty-page">
          <span className="empty-page__icon">📊</span>
          <h2>No progress records yet</h2>
          <p>Start tracking your measurements to see your transformation!</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add First Record
          </button>
        </div>
      ) : (
        <>
          {/* Latest measurements highlight */}
          {latest && (
            <div className="progress-latest">
              <h2 className="progress-latest__title">📌 Latest Measurements</h2>
              <p className="progress-latest__date">{formatDate(latest.date)}</p>
              <div className="progress-metrics">
                {[
                  { key: 'weight', label: 'Weight', unit: 'kg', icon: '⚖️' },
                  { key: 'body_fat', label: 'Body Fat', unit: '%', icon: '📊' },
                  { key: 'chest', label: 'Chest', unit: 'cm', icon: '💪' },
                  { key: 'waist', label: 'Waist', unit: 'cm', icon: '📏' },
                  { key: 'hips', label: 'Hips', unit: 'cm', icon: '📐' },
                ].map(({ key, label, unit, icon }) =>
                  latest[key] != null ? (
                    <div key={key} className="progress-metric">
                      <span className="progress-metric__icon">{icon}</span>
                      <span className="progress-metric__value">
                        {latest[key]}
                        <span className="progress-metric__unit">{unit}</span>
                      </span>
                      <span className="progress-metric__label">{label}</span>
                      {previous && previous[key] != null && (
                        <div className="progress-metric__diff">
                          {diffLabel(latest[key], previous[key])}
                        </div>
                      )}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}

          {/* Timeline */}
          <h2 className="progress-timeline__heading">📅 History</h2>
          <div className="progress-timeline">
            {records.map((rec, idx) => (
              <div key={rec.id} className="timeline-entry">
                <div className="timeline-entry__dot" />
                <div className="timeline-entry__content">
                  <div className="timeline-entry__header">
                    <p className="timeline-entry__date">{formatDate(rec.date)}</p>
                    <button
                      className="workout-card__delete"
                      onClick={() => handleDelete(rec.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="timeline-entry__metrics">
                    {rec.weight != null && (
                      <span className="timeline-metric">
                        ⚖️ {rec.weight} kg
                        {idx < records.length - 1 && records[idx + 1]?.weight != null &&
                          diffLabel(rec.weight, records[idx + 1].weight)}
                      </span>
                    )}
                    {rec.body_fat != null && (
                      <span className="timeline-metric">📊 {rec.body_fat}% BF</span>
                    )}
                    {rec.chest != null && <span className="timeline-metric">Chest: {rec.chest}cm</span>}
                    {rec.waist != null && <span className="timeline-metric">Waist: {rec.waist}cm</span>}
                    {rec.hips != null && <span className="timeline-metric">Hips: {rec.hips}cm</span>}
                  </div>
                  {rec.notes && <p className="timeline-entry__notes">{rec.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Add Progress Record</h2>
              <button className="modal__close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form className="modal__form" onSubmit={handleSubmit}>
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

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    className={`form-input ${errors.weight ? 'form-input--error' : ''}`}
                    placeholder="75.5"
                    min="0"
                    step="0.1"
                    value={form.weight}
                    onChange={handleChange}
                  />
                  {errors.weight && <p className="form-error">{errors.weight}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Body Fat (%)</label>
                  <input
                    type="number"
                    name="body_fat"
                    className="form-input"
                    placeholder="18.5"
                    min="0"
                    max="100"
                    step="0.1"
                    value={form.body_fat}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row form-row--thirds">
                <div className="form-group">
                  <label className="form-label">Chest (cm)</label>
                  <input type="number" name="chest" className="form-input" placeholder="95" min="0" step="0.1" value={form.chest} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Waist (cm)</label>
                  <input type="number" name="waist" className="form-input" placeholder="80" min="0" step="0.1" value={form.waist} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Hips (cm)</label>
                  <input type="number" name="hips" className="form-input" placeholder="95" min="0" step="0.1" value={form.hips} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea name="notes" className="form-input" placeholder="How are you feeling?" value={form.notes} onChange={handleChange} />
              </div>

              <div className="modal__actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Progress;
