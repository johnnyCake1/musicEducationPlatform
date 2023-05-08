import React from 'react';
import './ProgressBar.css';

function ProgressBar({ percentage }) {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${percentage}%` }} />
    </div>
  );
}

export default ProgressBar;
