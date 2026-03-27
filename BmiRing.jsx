import React from 'react';
import { motion } from 'framer-motion';

const BmiRing = ({ bmi }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;

  const numericBMI = Number(bmi);
  const safeProgress = Number.isFinite(numericBMI) ? Math.min(Math.max((numericBMI - 15) / 20 * 100, 0), 100) : 0;
  const offset = circumference - (safeProgress / 100) * circumference;

  const getColor = (val) => {
    if (!Number.isFinite(val)) return '#94a3b8'; // gray
    if (val < 18.5) return '#facc15'; // yellow
    if (val < 25) return '#4ade80'; // green
    return '#f43f5e'; // red
  };

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-white/10"
        />
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          stroke={getColor(bmi)}
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold">{bmi}</span>
      </div>
    </div>
  );
};

export default BmiRing;
