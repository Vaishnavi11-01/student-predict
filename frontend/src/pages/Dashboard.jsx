import React, { useEffect, useState } from 'react';
import { getStudents, getPrediction, getSuggestions } from '../api/api';
import { RiskBadge } from '../components/RiskBadge';
import { SuggestionCard } from '../components/SuggestionCard';

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await getStudents();
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading students:', error);
      setLoading(false);
    }
  };

  const selectStudent = async (student) => {
    setSelectedStudent(student);
    setPrediction(null);
    setSuggestions('');
    
    try {
      const [predResponse, tipsResponse] = await Promise.all([
        getPrediction(student.id),
        getSuggestions(student.id)
      ]);
      setPrediction(predResponse.data);
      setSuggestions(tipsResponse.data.suggestions);
    } catch (error) {
      console.error('Error loading student data:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <header style={{
        background: '#2c3e50',
        color: 'white',
        padding: '20px 40px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0 }}>EduPredict Dashboard</h1>
        <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>Student Performance Prediction System</p>
      </header>

      <div style={{ padding: '40px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 30 }}>
          {/* Student List */}
          <div style={{ background: 'white', borderRadius: 8, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: 20, color: '#333' }}>Students</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {students.map(student => (
                <div
                  key={student.id}
                  onClick={() => selectStudent(student)}
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    background: selectedStudent?.id === student.id ? '#3498db' : '#f8f9fa',
                    color: selectedStudent?.id === student.id ? 'white' : '#333',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedStudent?.id !== student.id) {
                      e.target.style.background = '#e9ecef';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedStudent?.id !== student.id) {
                      e.target.style.background = '#f8f9fa';
                    }
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{student.name}</div>
                  <div style={{ fontSize: 14, opacity: 0.8 }}>{student.class_name} - {student.section}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Details */}
          <div>
            {selectedStudent ? (
              <div>
                <div style={{ background: 'white', borderRadius: 8, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: 20 }}>
                  <h2 style={{ marginBottom: 16, color: '#333' }}>{selectedStudent.name}</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 20 }}>
                    <div style={{ padding: 16, background: '#f8f9fa', borderRadius: 8 }}>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Class</div>
                      <div style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>{selectedStudent.class_name}</div>
                    </div>
                    <div style={{ padding: 16, background: '#f8f9fa', borderRadius: 8 }}>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Section</div>
                      <div style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>{selectedStudent.section}</div>
                    </div>
                    <div style={{ padding: 16, background: '#f8f9fa', borderRadius: 8 }}>
                      <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Student ID</div>
                      <div style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>#{selectedStudent.id}</div>
                    </div>
                  </div>

                  {prediction && (
                    <div>
                      <h3 style={{ marginBottom: 16, color: '#333' }}>Predictions</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 20 }}>
                        <div style={{ padding: 16, background: '#e8f4f8', borderRadius: 8, textAlign: 'center' }}>
                          <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Predicted Score</div>
                          <div style={{ fontSize: 32, fontWeight: 700, color: '#2c3e50' }}>{prediction.perf_score}</div>
                        </div>
                        <div style={{ padding: 16, background: '#f0e8f8', borderRadius: 8, textAlign: 'center' }}>
                          <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Attendance Forecast</div>
                          <div style={{ fontSize: 32, fontWeight: 700, color: '#2c3e50' }}>{prediction.attend_rate}%</div>
                        </div>
                        <div style={{ padding: 16, background: '#f8e8e8', borderRadius: 8, textAlign: 'center' }}>
                          <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Dropout Risk</div>
                          <div style={{ fontSize: 32, fontWeight: 700, color: '#2c3e50' }}>{prediction.dropout_risk}%</div>
                        </div>
                      </div>
                      <div style={{ marginBottom: 20 }}>
                        <RiskBadge level={prediction.risk_level} />
                      </div>
                    </div>
                  )}
                </div>

                {suggestions && <SuggestionCard suggestions={suggestions} />}
              </div>
            ) : (
              <div style={{
                background: 'white',
                borderRadius: 8,
                padding: 40,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                textAlign: 'center',
                color: '#666'
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>👈</div>
                <h3 style={{ marginBottom: 8, color: '#333' }}>Select a Student</h3>
                <p>Choose a student from the list to view their predictions and study suggestions.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
