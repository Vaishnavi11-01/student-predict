import React from 'react';

export function SuggestionCard({ suggestions }) {
  return (
    <div style={{
      background: 'white',
      padding: 20,
      borderRadius: 8,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginTop: 20
    }}>
      <h3 style={{ marginBottom: 12, color: '#333' }}>AI Study Suggestions</h3>
      <pre style={{
        whiteSpace: 'pre-wrap',
        fontFamily: 'inherit',
        lineHeight: 1.6,
        color: '#555',
        margin: 0
      }}>
        {suggestions}
      </pre>
    </div>
  );
}
