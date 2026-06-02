import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function AttendanceVsScore() {
  const [data, setData] = useState([
    { attendance: 90, score: 85 },
    { attendance: 85, score: 78 },
    { attendance: 75, score: 72 },
    { attendance: 65, score: 68 },
    { attendance: 55, score: 60 },
    { attendance: 95, score: 92 },
    { attendance: 80, score: 75 },
    { attendance: 70, score: 65 }
  ]);

  useEffect(() => {
    // Fetch real data from backend
    fetch('http://localhost:8000/students/')
      .then(res => res.json())
      .then(students => {
        const scatterData = students.map(student => ({
          attendance: student.latest_prediction ? student.latest_prediction.attend_rate : 0,
          score: student.latest_prediction ? student.latest_prediction.perf_score : 0
        }));

        if (scatterData.length > 0) {
          setData(scatterData);
        }
      })
      .catch(err => console.error('Error fetching attendance vs score:', err));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6"
    >
      <h3 className="text-xl font-bold mb-4">Attendance vs Score</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="attendance" 
            name="Attendance %" 
            stroke="#888888"
            label={{ value: 'Attendance %', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            dataKey="score" 
            name="Score" 
            stroke="#888888"
            label={{ value: 'Score', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
          />
          <Scatter data={data} fill="#7C3AED" />
        </ScatterChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
