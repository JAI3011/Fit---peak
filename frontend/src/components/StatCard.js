import React from 'react';
import './StatCard.css';

function StatCard({ icon, label, value, unit, color, trend }) {
  return (
    <div className="stat-card" style={{ '--card-accent': color || 'var(--primary-start)' }}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__body">
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">
          {value ?? '—'}
          {unit && <span className="stat-card__unit"> {unit}</span>}
        </p>
        {trend !== undefined && (
          <p className={`stat-card__trend ${trend >= 0 ? 'up' : 'down'}`}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </p>
        )}
      </div>
    </div>
  );
}

export default StatCard;
