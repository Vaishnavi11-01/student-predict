import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { getStudents } from '../api/api';

export default function ScoreTrends() {
  const [data, setData] = useState([
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 68 },
    { month: 'Mar', score: 72 },
    { month: 'Apr', score: 70 },
    { month: 'May', score: 75 },
    { month: 'Jun', score: 78 }
  ]);

  useEffect(() => {
    // Fetch real data from backend
    getStudents()
      .then(res => res.data)
      .then(students => {
        // Calculate average score per month from grades
        const monthlyScores = {};
        
        students.forEach(student => {
          if (student.grades) {
            student.grades.forEach(grade => {
              const month = new Date(grade.date).toLocaleString('default', { month: 'short' });
              if (!monthlyScores[month]) {
                monthlyScores[month] = [];
              }
              monthlyScores[month].push(grade.score);
            });
          }
        });

        const trendData = Object.keys(monthlyScores).map(month => ({
          month,
          score: monthlyScores[month].reduce((a, b) => a + b, 0) / monthlyScores[month].length
        }));

        if (trendData.length > 0) {
          setData(trendData);
        }
      })
      .catch(err => console.error('Error fetching score trends:', err));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6"
    >
      <h3 className="text-xl font-bold mb-4">Score Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="month" stroke="#888888" />
          <YAxis stroke="#888888" />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#00D4FF" 
            strokeWidth={3}
            dot={{ fill: '#00D4FF' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
