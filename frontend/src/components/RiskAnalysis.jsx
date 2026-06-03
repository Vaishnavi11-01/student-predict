import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { getStudents } from '../api/api';

export default function RiskAnalysis() {
  const [data, setData] = useState([
    { name: 'High', count: 23, color: '#EF4444' },
    { name: 'Medium', count: 45, color: '#F59E0B' },
    { name: 'Low', count: 32, color: '#10B981' }
  ]);

  useEffect(() => {
    // Fetch real data from backend
    getStudents()
      .then(res => res.data)
      .then(students => {
        const riskCounts = { high: 0, medium: 0, low: 0 };
        
        students.forEach(student => {
          if (student.latest_prediction && student.latest_prediction.risk_level) {
            const risk = student.latest_prediction.risk_level.toLowerCase();
            if (riskCounts[risk] !== undefined) {
              riskCounts[risk]++;
            }
          }
        });

        setData([
          { name: 'High', count: riskCounts.high, color: '#EF4444' },
          { name: 'Medium', count: riskCounts.medium, color: '#F59E0B' },
          { name: 'Low', count: riskCounts.low, color: '#10B981' }
        ]);
      })
      .catch(err => console.error('Error fetching risk analysis:', err));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-6"
    >
      <h3 className="text-xl font-bold mb-4">Risk Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#888888" />
          <YAxis stroke="#888888" />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="count" fill="#8884d8">
            {data.map((entry, index) => (
              <rect key={`bar-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
