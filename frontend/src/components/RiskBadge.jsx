import React from 'react';

const colors = {
  high: { bg: '#FCEBEB', text: '#A32D2D' },
  medium: { bg: '#FAEEDA', text: '#854F0B' },
  low: { bg: '#EAF3DE', text: '#3B6D11' },
};

export function RiskBadge({ level }) {
  const c = colors[level] || colors.low;
  return (
    <span style={{
      background: c.bg,
      color: c.text,
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      textTransform: 'capitalize'
    }}>
      {level} risk
    </span>
  );
}
